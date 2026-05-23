from __future__ import annotations

import difflib
import json
import os
import re
import subprocess
import time
from functools import lru_cache
from pathlib import Path
from typing import Iterable

from .schemas import LaunchCandidate

try:
    import psutil
except Exception:  # pragma: no cover
    psutil = None

try:
    import winreg
except Exception:  # pragma: no cover
    winreg = None


class ApplicationDiscovery:
    min_search_confidence = 0.48
    min_launch_confidence = 0.68

    def search(self, query: str, limit: int = 8) -> list[LaunchCandidate]:
        lowered = _normalize_name(query)
        scored: dict[str, LaunchCandidate] = {}

        for candidate in self._catalog():
            confidence = self._score(lowered, _normalize_name(candidate.name))
            if confidence < self.min_search_confidence:
                continue
            key = candidate.launch_path.lower()
            existing = scored.get(key)
            scored_candidate = candidate.model_copy(update={"confidence": confidence})
            if not existing or existing.confidence < scored_candidate.confidence:
                scored[key] = scored_candidate

        return sorted(scored.values(), key=lambda item: item.confidence, reverse=True)[:limit]

    def best_launch_match(self, query: str) -> LaunchCandidate | None:
        matches = self.search(query, limit=5)
        if not matches:
            return None
        best = matches[0]
        if best.confidence < self.min_launch_confidence:
            return None
        return best

    def launch(self, candidate: LaunchCandidate) -> bool:
        path = candidate.launch_path
        try:
            if os.name == "nt" and path.startswith("shell:appsFolder\\"):
                subprocess.Popen(["explorer.exe", path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            elif os.name == "nt":
                os.startfile(path)  # type: ignore[attr-defined]
            else:
                subprocess.Popen([path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            return False

        time.sleep(0.8)
        return self._verify_process(candidate)

    def _verify_process(self, candidate: LaunchCandidate) -> bool:
        if not psutil:
            return True
        executable = candidate.executable or Path(candidate.launch_path).stem
        expected = executable.lower().replace(".exe", "")
        for process in psutil.process_iter(["name", "exe"]):
            try:
                name = (process.info.get("name") or "").lower().replace(".exe", "")
                exe = (process.info.get("exe") or "").lower()
                if expected and (expected == name or expected in exe):
                    return True
            except Exception:
                continue
        return True

    def _catalog(self) -> list[LaunchCandidate]:
        return list(_cached_catalog())

    @staticmethod
    def _score(query: str, name: str) -> float:
        if not query:
            return 0
        if query == name:
            return 1
        if query in name:
            return min(1.0, 0.9 + (len(query) / max(len(name), 1)) * 0.08)

        tokens = [token for token in query.replace("-", " ").split() if token]
        name_tokens = set(name.replace("-", " ").split())
        token_score = sum(1 for token in tokens if token in name_tokens or token in name) / max(len(tokens), 1)
        ratio = difflib.SequenceMatcher(None, query, name).ratio()
        if ratio < 0.58 and token_score == 0:
            return 0
        return min(1.0, ratio * 0.64 + token_score * 0.34)


def _start_menu_dirs() -> Iterable[Path]:
    paths = [
        os.environ.get("PROGRAMDATA", ""),
        os.environ.get("APPDATA", ""),
    ]
    for base in paths:
        if not base:
            continue
        menu = Path(base) / "Microsoft" / "Windows" / "Start Menu" / "Programs"
        if menu.exists():
            yield menu


def _common_executable_dirs() -> Iterable[Path]:
    candidates = [
        os.environ.get("ProgramFiles", ""),
        os.environ.get("ProgramFiles(x86)", ""),
        Path.home() / "AppData" / "Local" / "Programs",
        Path.home() / "AppData" / "Local" / "Microsoft" / "WindowsApps",
    ]
    for candidate in candidates:
        path = Path(candidate) if candidate else None
        if path and path.exists():
            yield path


def _registry_apps() -> Iterable[LaunchCandidate]:
    if not winreg:
        return []

    roots = [
        (winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Uninstall"),
        (winreg.HKEY_LOCAL_MACHINE, r"Software\Microsoft\Windows\CurrentVersion\Uninstall"),
        (winreg.HKEY_LOCAL_MACHINE, r"Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"),
    ]
    results: list[LaunchCandidate] = []
    for root, key_path in roots:
        try:
            with winreg.OpenKey(root, key_path) as key:
                for index in range(winreg.QueryInfoKey(key)[0]):
                    try:
                        subkey_name = winreg.EnumKey(key, index)
                        with winreg.OpenKey(key, subkey_name) as subkey:
                            name = winreg.QueryValueEx(subkey, "DisplayName")[0]
                            launch = ""
                            for value_name in ("DisplayIcon", "InstallLocation"):
                                try:
                                    launch = winreg.QueryValueEx(subkey, value_name)[0]
                                    break
                                except OSError:
                                    continue
                            launch_path = _resolve_registry_launch_path(str(launch), str(name))
                            if name and launch_path:
                                results.append(
                                    LaunchCandidate(
                                        name=str(name),
                                        source="registry",
                                        launch_path=launch_path,
                                        executable=Path(launch_path).name if launch_path.lower().endswith(".exe") else None,
                                        confidence=0,
                                    )
                                )
                    except OSError:
                        continue
        except OSError:
            continue
    return results


def _start_apps() -> Iterable[LaunchCandidate]:
    if os.name != "nt":
        return []
    command = [
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); "
        "Get-StartApps | Select-Object Name,AppID | ConvertTo-Json -Depth 2",
    ]
    try:
        completed = subprocess.run(command, capture_output=True, timeout=5, check=False)
    except Exception:
        return []

    stdout = completed.stdout.decode("utf-8-sig", errors="replace")
    if completed.returncode != 0 or not stdout.strip():
        return []
    try:
        payload = json.loads(stdout)
    except json.JSONDecodeError:
        return []

    rows = payload if isinstance(payload, list) else [payload]
    results: list[LaunchCandidate] = []
    for row in rows:
        name = str(row.get("Name") or "").strip()
        app_id = str(row.get("AppID") or "").strip()
        if not name or not app_id:
            continue
        results.append(
            LaunchCandidate(
                name=name,
                source="start_apps",
                launch_path=f"shell:appsFolder\\{app_id}",
                executable=None,
                confidence=0,
                metadata={"app_user_model_id": app_id},
            )
        )
    return results


_TURKISH_TRANSLATION = str.maketrans(
    {
        "\u0131": "i",
        "\u0130": "i",
        "\u011f": "g",
        "\u011e": "g",
        "\u00fc": "u",
        "\u00dc": "u",
        "\u015f": "s",
        "\u015e": "s",
        "\u00f6": "o",
        "\u00d6": "o",
        "\u00e7": "c",
        "\u00c7": "c",
    }
)


def _normalize_name(value: str) -> str:
    value = value.casefold().strip().translate(_TURKISH_TRANSLATION)
    value = re.sub(r"['\u2019`]", "", value)
    value = re.sub(r"[^a-z0-9\s+-]", " ", value)
    value = re.sub(r"\b(app|application|program|desktop|uygulama|uygulamasi|uygulamasini)\b", " ", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def _resolve_registry_launch_path(raw_path: str, app_name: str) -> str | None:
    cleaned = raw_path.strip().strip('"').split(",")[0]
    if not cleaned:
        return None

    path = Path(os.path.expandvars(cleaned))
    if path.suffix.lower() == ".exe" and path.exists():
        return str(path)
    if path.suffix.lower() in {".lnk", ".url"} and path.exists():
        return str(path)
    if path.is_dir():
        app_name_normalized = _normalize_name(app_name)
        executables = list(path.glob("*.exe"))
        if not executables:
            return None
        exact = [exe for exe in executables if _normalize_name(exe.stem) in app_name_normalized or app_name_normalized in _normalize_name(exe.stem)]
        chosen = exact[0] if exact else executables[0]
        return str(chosen)
    return None


@lru_cache(maxsize=1)
def _cached_catalog() -> tuple[LaunchCandidate, ...]:
    candidates: list[LaunchCandidate] = []

    for menu in _start_menu_dirs():
        for shortcut in menu.rglob("*"):
            if shortcut.suffix.lower() not in {".lnk", ".url"}:
                continue
            candidates.append(
                LaunchCandidate(
                    name=shortcut.stem,
                    source="start_menu",
                    launch_path=str(shortcut),
                    executable=None,
                    confidence=0,
                )
            )

    for directory in _common_executable_dirs():
        try:
            executables = list(directory.glob("*.exe")) + list(directory.glob("*/*.exe"))
            for executable in executables:
                candidates.append(
                    LaunchCandidate(
                        name=executable.stem,
                        source="executable_index",
                        launch_path=str(executable),
                        executable=executable.name,
                        confidence=0,
                    )
                )
        except OSError:
            continue

    candidates.extend(_start_apps())
    candidates.extend(_registry_apps())
    return tuple(candidates)
