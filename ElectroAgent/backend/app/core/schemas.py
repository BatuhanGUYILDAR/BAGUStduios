from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

AiState = Literal["online", "thinking", "error"]
ExecutionState = Literal["idle", "observing", "planning", "executing", "verifying", "paused"]
EventKind = Literal["observation", "reasoning", "action", "verification", "safety", "system"]


class NetworkStatus(BaseModel):
    online: bool
    label: str
    sent_per_sec: float = 0
    received_per_sec: float = 0


class OllamaStatus(BaseModel):
    online: bool
    models: list[str] = Field(default_factory=list)
    active_model: str = "qwen3:8b"
    message: str | None = None


class VoiceStatus(BaseModel):
    listening: bool = False
    muted: bool = False
    wake_word: str = "electro"
    provider: str = "faster-whisper"


class SystemStatus(BaseModel):
    time: str
    date: str
    weather: str = "Local weather pending"
    internet: NetworkStatus
    cpu_percent: float
    gpu_percent: float | None = None
    vram_percent: float | None = None
    ram_percent: float
    temperatures: dict[str, float] = Field(default_factory=dict)
    fan_speeds: dict[str, float] = Field(default_factory=dict)
    active_models: list[str] = Field(default_factory=lambda: ["qwen3:8b", "deepseek-r1:8b"])
    active_agents: list[str] = Field(default_factory=lambda: ["planner", "observer", "operator"])
    ollama: OllamaStatus
    voice: VoiceStatus
    execution_state: ExecutionState = "idle"
    ai_state: AiState = "online"


class AgentEvent(BaseModel):
    id: str
    kind: EventKind
    title: str
    detail: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class GoalRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=1000)
    autonomous: bool = True


class AppSearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=200)
    limit: int = Field(default=8, ge=1, le=25)


class MemoryRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    metadata: dict[str, Any] = Field(default_factory=dict)


class LaunchCandidate(BaseModel):
    name: str
    source: str
    launch_path: str
    confidence: float
    executable: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class AgentRunSummary(BaseModel):
    run_id: str
    goal: str
    completed: bool
    confidence: float
    summary: str
    events: list[AgentEvent]
    requires_confirmation: bool = False
