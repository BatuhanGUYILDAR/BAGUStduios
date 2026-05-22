from __future__ import annotations

import socket
import time
from datetime import datetime

from .model_router import ModelRouter
from .schemas import NetworkStatus, SystemStatus, VoiceStatus

try:
    import psutil
except Exception:  # pragma: no cover - optional runtime dependency
    psutil = None

_last_network_sample: tuple[float, int, int] | None = None
_model_router = ModelRouter()


def _internet_status() -> NetworkStatus:
    online = False
    label = "Offline"
    try:
        with socket.create_connection(("1.1.1.1", 53), timeout=0.35):
            online = True
            label = "Online"
    except OSError:
        label = "Local only"

    sent_per_sec = 0.0
    received_per_sec = 0.0
    global _last_network_sample
    if psutil:
        counters = psutil.net_io_counters()
        now = time.monotonic()
        if _last_network_sample:
            previous_time, previous_sent, previous_recv = _last_network_sample
            elapsed = max(now - previous_time, 0.001)
            sent_per_sec = max(counters.bytes_sent - previous_sent, 0) / elapsed
            received_per_sec = max(counters.bytes_recv - previous_recv, 0) / elapsed
        _last_network_sample = (now, counters.bytes_sent, counters.bytes_recv)

    return NetworkStatus(online=online, label=label, sent_per_sec=sent_per_sec, received_per_sec=received_per_sec)


def _temperatures() -> dict[str, float]:
    if not psutil or not hasattr(psutil, "sensors_temperatures"):
        return {}
    try:
        readings = psutil.sensors_temperatures() or {}
    except Exception:
        return {}

    result: dict[str, float] = {}
    for name, entries in readings.items():
        if entries:
            current = getattr(entries[0], "current", None)
            if current is not None:
                result[name] = float(current)
    return result


def _fan_speeds() -> dict[str, float]:
    if not psutil or not hasattr(psutil, "sensors_fans"):
        return {}
    try:
        readings = psutil.sensors_fans() or {}
    except Exception:
        return {}

    result: dict[str, float] = {}
    for name, entries in readings.items():
        if entries:
            speed = getattr(entries[0], "current", None)
            if speed is not None:
                result[name] = float(speed)
    return result


def get_system_status() -> SystemStatus:
    now = datetime.now()
    ollama = _model_router.status()
    cpu_percent = float(psutil.cpu_percent(interval=None)) if psutil else 0.0
    ram_percent = float(psutil.virtual_memory().percent) if psutil else 0.0
    active_models = [ollama.active_model, "deepseek-r1:8b"]
    active_models = list(dict.fromkeys(active_models))

    return SystemStatus(
        time=now.strftime("%H:%M:%S"),
        date=now.strftime("%A, %B %d"),
        weather="Local weather pending",
        internet=_internet_status(),
        cpu_percent=cpu_percent,
        ram_percent=ram_percent,
        gpu_percent=None,
        vram_percent=None,
        temperatures=_temperatures(),
        fan_speeds=_fan_speeds(),
        active_models=active_models,
        active_agents=["planner", "observer", "operator"],
        ollama=ollama,
        voice=VoiceStatus(),
    )
