from __future__ import annotations

import difflib
import os
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
    def search(self, query: str, limit: int = 8) -> list[LaunchCandidate]:
        lowered = query.strip().lower()
        scored: dict[str, LaunchCandidate] = {}

        for candidate in self._catalog():
            confidence = self._score(lowered, candidate.name.lower())
            if confidence <= 0.18:
                continue
            key = candidate.launch_path.lower()
            existing = scored.get(key)
            candidate.confidence = confidence
            if not existing or existing.confidence < candidate.confidence:
                scored[key] = candidate

        return sorted(scored.values(), key=lambda item: item.confidence, reverse=True)[:limit]

    def launch(self, candidate: LaunchCandidate) -> bool:
        path = candidate.launch_path
        try:
            if os.name == "nt" and (path.lower().endswith(".lnk") or path.lower().endswith(".url")):
                os.startfile(path)  # type: ignore[attr-defined]
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
        tokens = [token for token in query.replace("-", " ").split() if token]
        token_score = sum(1 for token in tokens if token in name) / max(len(tokens), 1)
        ratio = difflib.SequenceMatcher(None, query, name).ratio()
        substring = 0.2 if query in name or name in query else 0
        return min(1.0, ratio * 0.62 + token_score * 0.32 + substring)


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
                            launch = str(launch).strip('"').split(",")[0]
                            if name and launch:
                                results.append(
                                    LaunchCandidate(
                                        name=str(name),
                                        source="registry",
                                        launch_path=launch,
                                        executable=Path(launch).name if launch.lower().endswith(".exe") else None,
                                        confidence=0,
                                    )
                                )
                    except OSError:
                        continue
        except OSError:
            continue
    return results


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
            for executable in directory.glob("*/*.exe"):
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

    candidates.extend(_registry_apps())
    return tuple(candidates)
