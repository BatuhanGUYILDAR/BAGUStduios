from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any

try:
    import pygetwindow
except Exception:  # pragma: no cover
    pygetwindow = None

try:
    import mss
except Exception:  # pragma: no cover
    mss = None

try:
    from PIL import Image
except Exception:  # pragma: no cover
    Image = None

try:
    import pytesseract
except Exception:  # pragma: no cover
    pytesseract = None


class DesktopObserver:
    def __init__(self) -> None:
        self.capture_dir = Path(__file__).resolve().parents[1] / "data"
        self.capture_dir.mkdir(parents=True, exist_ok=True)

    def observe(self) -> dict[str, Any]:
        active_window = self._active_window()
        screenshot = self._screenshot()
        ocr_text = self._ocr(screenshot["path"]) if screenshot.get("path") else ""
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "active_window": active_window,
            "screenshot": screenshot,
            "ocr_text": ocr_text[:3000],
            "semantic_summary": self._summarize(active_window, ocr_text),
        }

    def _active_window(self) -> dict[str, Any]:
        if not pygetwindow:
            return {"title": None, "available": False}
        try:
            window = pygetwindow.getActiveWindow()
            if not window:
                return {"title": None, "available": True}
            return {
                "title": window.title,
                "left": window.left,
                "top": window.top,
                "width": window.width,
                "height": window.height,
                "available": True,
            }
        except Exception:
            return {"title": None, "available": False}

    def _screenshot(self) -> dict[str, Any]:
        if not mss or not Image:
            return {"available": False, "path": None}
        try:
            with mss.mss() as capture:
                monitor = capture.monitors[1]
                raw = capture.grab(monitor)
                image = Image.frombytes("RGB", raw.size, raw.rgb)
                path = self.capture_dir / "latest_screenshot.png"
                image.save(path)
                return {
                    "available": True,
                    "path": str(path),
                    "width": image.width,
                    "height": image.height,
                }
        except Exception as exc:
            return {"available": False, "path": None, "error": exc.__class__.__name__}

    def _ocr(self, image_path: str | None) -> str:
        if not image_path or not pytesseract or not Image:
            return ""
        try:
            with Image.open(image_path) as image:
                return pytesseract.image_to_string(image)
        except Exception:
            return ""

    @staticmethod
    def _summarize(active_window: dict[str, Any], ocr_text: str) -> str:
        title = active_window.get("title")
        if title and ocr_text:
            return f"Active window appears to be {title}; visible text was captured for semantic analysis."
        if title:
            return f"Active window appears to be {title}."
        return "Desktop observation is available, but no active window title was resolved."
