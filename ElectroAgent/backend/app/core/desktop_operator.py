from __future__ import annotations

import time
from dataclasses import dataclass


@dataclass(frozen=True)
class OperatorResult:
    completed: bool
    detail: str


class DesktopOperator:
    def execute_action(self, action_type: str, args: dict) -> OperatorResult:
        if action_type == "focus_window":
            return self.focus_window(args.get("title_terms", []))
        if action_type == "hotkey":
            return self.hotkey(args.get("keys", []))
        if action_type == "press_key":
            return self.press_key(str(args.get("key", "")))
        if action_type == "type_text":
            return self.type_text(str(args.get("text", "")))
        if action_type == "wait":
            seconds = float(args.get("seconds", 0.5))
            time.sleep(max(0.05, min(seconds, 5.0)))
            return OperatorResult(completed=True, detail="I gave the app a moment to update.")
        return OperatorResult(completed=False, detail=f"Unsupported desktop action: {action_type}")

    def focus_window(self, title_terms: list[str]) -> OperatorResult:
        return self._focus_window(title_terms)

    def type_text(self, text: str) -> OperatorResult:
        try:
            import pyautogui
        except Exception:
            return OperatorResult(
                completed=False,
                detail="pyautogui is not installed. Install backend/requirements-optional.txt to enable desktop text entry.",
            )

        try:
            self._type_text(pyautogui, text)
        except Exception as exc:
            return OperatorResult(
                completed=False,
                detail=f"Desktop control failed before typing could be verified: {exc.__class__.__name__}: {exc}",
            )
        return OperatorResult(completed=True, detail="I entered the requested content into the active app.")

    def hotkey(self, keys: list[str]) -> OperatorResult:
        if not keys:
            return OperatorResult(completed=False, detail="No hotkey keys were provided.")
        try:
            import pyautogui

            pyautogui.hotkey(*keys)
        except Exception as exc:
            return OperatorResult(completed=False, detail=f"Hotkey failed: {exc.__class__.__name__}: {exc}")
        return OperatorResult(completed=True, detail="I moved to the right part of the interface.")

    def press_key(self, key: str) -> OperatorResult:
        if not key:
            return OperatorResult(completed=False, detail="No key was provided.")
        try:
            import pyautogui

            pyautogui.press(key)
        except Exception as exc:
            return OperatorResult(completed=False, detail=f"Key press failed: {exc.__class__.__name__}: {exc}")
        return OperatorResult(completed=True, detail="I confirmed the current selection.")

    def type_text_in_notepad(self, text: str) -> OperatorResult:
        try:
            import pyautogui
        except Exception:
            return OperatorResult(
                completed=False,
                detail="pyautogui is not installed. Install backend/requirements-optional.txt to enable desktop text entry.",
            )

        focus_result = self._focus_window(["notepad", "not defteri", "adsiz", "untitled"])
        if not focus_result.completed:
            return focus_result

        try:
            self._type_text(pyautogui, text)
        except Exception as exc:
            return OperatorResult(
                completed=False,
                detail=f"Desktop control failed before typing could be verified: {exc.__class__.__name__}: {exc}",
            )

        return OperatorResult(
            completed=True,
            detail="I opened Not Defteri and typed the requested text.",
        )

    def send_whatsapp_message(self, contact_name: str, message: str) -> OperatorResult:
        try:
            import pyautogui
        except Exception:
            return OperatorResult(
                completed=False,
                detail="pyautogui is not installed. Install backend/requirements-optional.txt to enable desktop message actions.",
            )

        focus_result = self._focus_window(["whatsapp"])
        if not focus_result.completed:
            return focus_result

        try:
            pyautogui.hotkey("ctrl", "f")
            time.sleep(0.35)
            self._type_text(pyautogui, contact_name)
            time.sleep(0.8)
            pyautogui.press("enter")
            time.sleep(0.8)
            self._type_text(pyautogui, message)
            time.sleep(0.2)
            pyautogui.press("enter")
        except Exception as exc:
            return OperatorResult(
                completed=False,
                detail=f"Desktop control failed before sending could be verified: {exc.__class__.__name__}: {exc}",
            )

        return OperatorResult(
            completed=True,
            detail=f"Typed and sent the approved message to {contact_name} in WhatsApp.",
        )

    def _focus_window(self, title_terms: list[str]) -> OperatorResult:
        errors: list[str] = []
        lowered_terms = [term.casefold() for term in title_terms]

        try:
            import pygetwindow

            windows = []
            for term in title_terms:
                windows.extend(pygetwindow.getWindowsWithTitle(term))
            for window in windows:
                title = getattr(window, "title", "")
                if not title or not any(term in title.casefold() for term in lowered_terms):
                    continue
                try:
                    if getattr(window, "isMinimized", False):
                        window.restore()
                    window.activate()
                    time.sleep(0.8)
                    return OperatorResult(
                        completed=True,
                        detail="I brought the target app into focus.",
                    )
                except Exception as exc:
                    errors.append(f"pygetwindow activate failed for {title}: {exc.__class__.__name__}: {exc}")
        except Exception as exc:
            errors.append(f"pygetwindow lookup failed: {exc.__class__.__name__}: {exc}")

        try:
            from pywinauto import Desktop

            desktop = Desktop(backend="uia")
            windows = [
                window
                for window in desktop.windows()
                if any(term in window.window_text().casefold() for term in lowered_terms)
            ]
            for window in windows:
                try:
                    window.set_focus()
                    time.sleep(0.8)
                    return OperatorResult(
                        completed=True,
                        detail="I brought the target app into focus.",
                    )
                except Exception as exc:
                    title = window.window_text() or "target window"
                    errors.append(f"pywinauto focus failed for {title}: {exc.__class__.__name__}: {exc}")
        except Exception as exc:
            errors.append(f"pywinauto lookup failed: {exc.__class__.__name__}: {exc}")

        detail = "Could not focus a visible target window safely."
        if errors:
            detail = f"{detail} {'; '.join(errors[-3:])}"
        return OperatorResult(completed=False, detail=detail)

    @staticmethod
    def _type_text(pyautogui, text: str) -> None:
        try:
            import pyperclip

            pyperclip.copy(text)
            pyautogui.hotkey("ctrl", "v")
        except Exception:
            pyautogui.write(text, interval=0.01)
