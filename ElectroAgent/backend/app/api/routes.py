from __future__ import annotations

from fastapi import APIRouter

from ..core.agent_loop import AgentRuntime
from ..core.app_discovery import ApplicationDiscovery
from ..core.desktop_observer import DesktopObserver
from ..core.memory import MemoryStore
from ..core.model_router import ModelRouter
from ..core.schemas import AppSearchRequest, GoalRequest, MemoryRequest
from ..core.system_probe import get_system_status
from ..core.voice import get_voice_status

router = APIRouter()

discovery = ApplicationDiscovery()
memory = MemoryStore()
model_router = ModelRouter()
observer = DesktopObserver()
runtime = AgentRuntime(discovery=discovery, memory=memory, model_router=model_router, observer=observer)


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "online", "service": "electro-agent-core"}


@router.get("/system/status")
async def system_status():
    return get_system_status()


@router.get("/models/status")
async def model_status():
    return model_router.status()


@router.post("/apps/discover")
async def discover_apps(payload: AppSearchRequest):
    return discovery.search(payload.query, limit=payload.limit)


@router.get("/desktop/observe")
async def observe_desktop():
    return observer.observe()


@router.get("/voice/status")
async def voice_status():
    return get_voice_status()


@router.post("/memory")
async def remember(payload: MemoryRequest):
    return memory.remember(payload.text, metadata=payload.metadata)


@router.post("/agent/execute")
async def execute_goal(payload: GoalRequest):
    return await runtime.execute(payload.goal, autonomous=payload.autonomous)
