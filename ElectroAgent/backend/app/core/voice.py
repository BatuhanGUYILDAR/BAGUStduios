from __future__ import annotations

from .schemas import VoiceStatus


def get_voice_status() -> VoiceStatus:
    return VoiceStatus(
        listening=False,
        muted=False,
        wake_word="electro",
        provider="faster-whisper + piper planned",
    )
