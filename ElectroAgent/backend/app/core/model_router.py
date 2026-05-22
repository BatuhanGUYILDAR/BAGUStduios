from __future__ import annotations

import json
import urllib.request
from dataclasses import dataclass

from .schemas import OllamaStatus


@dataclass(frozen=True)
class ModelProfile:
    name: str
    roles: tuple[str, ...]
    priority: int


class ModelRouter:
    def __init__(self) -> None:
        self.profiles = [
            ModelProfile("qwen3:8b", ("conversation", "light_planning", "fast_response"), 10),
            ModelProfile("deepseek-r1:8b", ("advanced_reasoning", "long_planning", "verification"), 20),
            ModelProfile("llama3", ("fallback_reasoning", "conversation"), 30),
            ModelProfile("mistral", ("fallback_reasoning", "summarization"), 40),
            ModelProfile("phi3", ("compact_fallback", "offline_repair"), 50),
        ]

    def status(self) -> OllamaStatus:
        try:
            with urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=0.45) as response:
                payload = json.loads(response.read().decode("utf-8"))
            models = [item.get("name", "") for item in payload.get("models", []) if item.get("name")]
            active = self.select_model("conversation", models)
            return OllamaStatus(online=True, models=models, active_model=active)
        except Exception as exc:
            return OllamaStatus(
                online=False,
                models=[],
                active_model="qwen3:8b",
                message=f"Ollama not reachable: {exc.__class__.__name__}",
            )

    def select_model(self, role: str, available: list[str] | None = None) -> str:
        available = available or []
        installed = {name.split(":")[0]: name for name in available} | {name: name for name in available}
        for profile in sorted(self.profiles, key=lambda item: item.priority):
            if role in profile.roles:
                base = profile.name.split(":")[0]
                if not available or profile.name in available or base in installed:
                    return installed.get(base, profile.name)
        return available[0] if available else "qwen3:8b"
