from __future__ import annotations

import asyncio
from contextlib import suppress

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .core.events import event_hub
from .core.system_probe import get_system_status

app = FastAPI(title="Electro Agent Core", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.websocket("/ws/events")
async def events_socket(websocket: WebSocket) -> None:
    await event_hub.connect(websocket)
    try:
        while True:
            await asyncio.sleep(2)
            await websocket.send_json({"type": "status", "data": get_system_status().model_dump()})
    except WebSocketDisconnect:
        event_hub.disconnect(websocket)
    except RuntimeError:
        event_hub.disconnect(websocket)
    finally:
        with suppress(Exception):
            event_hub.disconnect(websocket)
