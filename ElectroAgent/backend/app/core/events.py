from __future__ import annotations

import asyncio
from contextlib import suppress
from typing import Any

from fastapi import WebSocket


class EventHub:
    def __init__(self) -> None:
        self._sockets: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._sockets.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self._sockets.discard(websocket)

    async def publish(self, payload: dict[str, Any]) -> None:
        stale: list[WebSocket] = []
        async with self._lock:
            for socket in self._sockets:
                with suppress(Exception):
                    await socket.send_json(payload)
                    continue
                stale.append(socket)
            for socket in stale:
                self._sockets.discard(socket)


event_hub = EventHub()
