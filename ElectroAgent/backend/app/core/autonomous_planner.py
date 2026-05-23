from __future__ import annotations

import json
import re
import unicodedata
from dataclasses import dataclass, field
from typing import Any, Literal

from .intent import ParsedIntent
from .model_router import ModelRouter

ActionType = Literal["focus_window", "hotkey", "press_key", "type_text", "wait"]


@dataclass(frozen=True)
class DesktopAction:
    type: ActionType
    reason: str
    args: dict[str, Any] = field(default_factory=dict)
    requires_confirmation: bool = False


@dataclass(frozen=True)
class AutonomousPlan:
    app_name: str | None
    actions: list[DesktopAction]
    requires_confirmation: bool = False
    summary: str = ""


class AutonomousPlanner:
    """
    Builds semantic desktop action plans from the user's goal.

    This is deliberately application-agnostic: it does not contain "WhatsApp
    code" or "Notepad code". It describes what a human operator would do with
    a focused window, then the desktop operator executes those primitives.
    """

    def __init__(self, model_router: ModelRouter | None = None) -> None:
        self.model_router = model_router

    def build_plan(self, intent: ParsedIntent, observation: dict[str, Any]) -> AutonomousPlan:
        actions: list[DesktopAction] = []
        app_name = intent.app_name

        if app_name:
            actions.append(
                DesktopAction(
                    type="focus_window",
                    reason=f"Bring {app_name} into focus before continuing.",
                    args={"title_terms": self._title_terms(app_name, observation)},
                )
            )

        if intent.search_query:
            actions.extend(
                [
                    DesktopAction(
                        type="hotkey",
                        reason="Focus the browser address bar instead of the page find box.",
                        args={"keys": ["ctrl", "l"]},
                    ),
                    DesktopAction(
                        type="type_text",
                        reason="Enter the web search query extracted from the user's goal.",
                        args={"text": intent.search_query},
                    ),
                    DesktopAction(
                        type="press_key",
                        reason="Run the browser search.",
                        args={"key": "enter"},
                    ),
                ]
            )
            return AutonomousPlan(
                app_name=app_name,
                actions=actions,
                requires_confirmation=False,
                summary=self._summary(intent, actions),
            )

        if intent.text_to_type and not intent.outbound_message:
            content = self._resolve_text_to_type(intent.text_to_type, intent.raw_goal)
            actions.append(
                DesktopAction(
                    type="type_text",
                    reason="Create the requested content, then type it into the focused application.",
                    args={"text": content},
                )
            )
            return AutonomousPlan(
                app_name=app_name,
                actions=actions,
                requires_confirmation=False,
                summary=self._summary(intent, actions),
            )

        ai_plan = self._build_ai_plan(intent, observation)
        if ai_plan and ai_plan.actions:
            return ai_plan

        if intent.contact_name:
            actions.extend(
                [
                    DesktopAction(
                        type="hotkey",
                        reason="Open the application's search/find surface to locate the requested person or item.",
                        args={"keys": ["ctrl", "f"]},
                    ),
                    DesktopAction(
                        type="type_text",
                        reason="Enter the target name semantically extracted from the user's goal.",
                        args={"text": intent.contact_name},
                    ),
                    DesktopAction(
                        type="press_key",
                        reason="Select the most likely search result.",
                        args={"key": "enter"},
                    ),
                    DesktopAction(type="wait", reason="Allow the application to update after selection.", args={"seconds": 0.8}),
                ]
            )

        if intent.outbound_message:
            actions.extend(
                [
                    DesktopAction(
                        type="type_text",
                        reason="Type the approved outbound message into the active composition field.",
                        args={"text": intent.outbound_message},
                        requires_confirmation=True,
                    ),
                    DesktopAction(
                        type="press_key",
                        reason="Send the composed message.",
                        args={"key": "enter"},
                        requires_confirmation=True,
                    ),
                ]
            )

        return AutonomousPlan(
            app_name=app_name,
            actions=actions,
            requires_confirmation=any(action.requires_confirmation for action in actions),
            summary=self._summary(intent, actions),
        )

    def _build_ai_plan(self, intent: ParsedIntent, observation: dict[str, Any]) -> AutonomousPlan | None:
        if not self.model_router:
            return None

        prompt = self._planning_prompt(intent, observation)
        response = self.model_router.generate_text(prompt, role="light_planning", timeout=6.0)
        if not response:
            return None

        try:
            start = response.find("{")
            end = response.rfind("}")
            if start < 0 or end <= start:
                return None
            payload = json.loads(response[start : end + 1])
            raw_actions = payload.get("actions", [])
            if not isinstance(raw_actions, list):
                return None

            actions: list[DesktopAction] = []
            for raw in raw_actions[:8]:
                if not isinstance(raw, dict):
                    continue
                action_type = raw.get("type")
                if action_type not in {"focus_window", "hotkey", "press_key", "type_text", "wait"}:
                    continue
                args = raw.get("args", {})
                if not isinstance(args, dict):
                    args = {}
                reason = raw.get("reason")
                actions.append(
                    DesktopAction(
                        type=action_type,
                        args=args,
                        reason=reason if isinstance(reason, str) else f"AI selected {action_type}.",
                        requires_confirmation=bool(raw.get("requires_confirmation")),
                    )
                )

            if not actions:
                return None

            return AutonomousPlan(
                app_name=intent.app_name,
                actions=actions,
                requires_confirmation=any(action.requires_confirmation for action in actions),
                summary=f"Local AI planner selected {len(actions)} desktop actions.",
            )
        except Exception:
            return None

    @staticmethod
    def _planning_prompt(intent: ParsedIntent, observation: dict[str, Any]) -> str:
        return f"""
You are the local desktop AI planner for a native autonomous assistant.
Create a safe, application-agnostic desktop action plan.

Allowed action types only:
- focus_window: args {{"title_terms": ["app or window title"]}}
- hotkey: args {{"keys": ["ctrl", "f"]}}
- press_key: args {{"key": "enter"}}
- type_text: args {{"text": "literal text"}}
- wait: args {{"seconds": 0.8}}

Rules:
- Do not use terminal, shell, scripts, or code execution.
- Do not invent destructive actions.
- Mark type_text/press_key as requires_confirmation=true only when they send an outbound message or perform an external action.
- Return ONLY JSON.

User goal: {intent.raw_goal}
Parsed app: {intent.app_name}
Parsed contact/item: {intent.contact_name}
Parsed web search query: {intent.search_query}
Parsed outbound message: {intent.outbound_message}
Parsed local text: {intent.text_to_type}
Desktop observation: {json.dumps(observation, ensure_ascii=False)[:2500]}

JSON shape:
{{"actions":[{{"type":"focus_window","reason":"...","args":{{"title_terms":["..."]}},"requires_confirmation":false}}]}}
""".strip()

    @staticmethod
    def _title_terms(app_name: str, observation: dict[str, Any]) -> list[str]:
        terms = [app_name]
        active_title = observation.get("active_window", {}).get("title")
        if active_title:
            terms.append(active_title)
        return terms

    @staticmethod
    def _summary(intent: ParsedIntent, actions: list[DesktopAction]) -> str:
        if not actions:
            return "I need more desktop context before acting."
        target = intent.app_name or "the active desktop context"
        return f"I chose a {len(actions)} step desktop strategy for {target}."

    def _resolve_text_to_type(self, requested_text: str, raw_goal: str) -> str:
        if not self._looks_like_content_request(requested_text, raw_goal):
            return requested_text

        generated = self._generate_content(requested_text, raw_goal)
        if generated:
            return generated

        normalized = self._plain_text(f"{requested_text} {raw_goal}")
        if "aksam yemegi" in normalized or "dinner" in normalized:
            return "\n".join(
                [
                    "Aksam Yemegi Market Listesi",
                    "1. Tavuk veya et",
                    "2. Pirinc veya makarna",
                    "3. Domates",
                    "4. Biber",
                    "5. Sogan",
                    "6. Salata malzemeleri",
                    "7. Yogurt",
                    "8. Icecek",
                ]
            )
        if "shopping list" in normalized or "market list" in normalized or "market listesi" in normalized:
            return "\n".join(
                [
                    "Shopping List",
                    "1. Milk",
                    "2. Bread",
                    "3. Eggs",
                    "4. Rice",
                    "5. Apples",
                ]
            )
        return requested_text

    def _generate_content(self, requested_text: str, raw_goal: str) -> str | None:
        if not self.model_router:
            return None
        prompt = f"""
Create the actual text the user wants typed into a desktop app.
Do not describe the task. Do not say you completed it.
Return only the content to type.

User goal: {raw_goal}
Content request: {requested_text}
""".strip()
        response = self.model_router.generate_text(prompt, role="conversation", timeout=8.0)
        if not response:
            return None
        return response.strip().strip("`")

    @staticmethod
    def _looks_like_content_request(requested_text: str, raw_goal: str) -> bool:
        normalized = AutonomousPlanner._plain_text(f"{requested_text} {raw_goal}")
        markers = (
            "create",
            "make",
            "draft",
            "generate",
            "write a",
            "write an",
            "shopping list",
            "market list",
            "market listesi",
            "grocery",
            "with five items",
            "bes madde",
            "5 madde",
            "liste",
            "olustur",
            "hazirla",
        )
        if any(marker in normalized for marker in markers):
            return True
        return bool(re.search(r"\b(?:a|an)\s+\w+\s+(?:list|note|message|paragraph)\b", requested_text, re.IGNORECASE))

    @staticmethod
    def _plain_text(value: str) -> str:
        replacements = str.maketrans(
            {
                "\u0131": "i",
                "\u0130": "i",
                "\u015f": "s",
                "\u015e": "s",
                "\u011f": "g",
                "\u011e": "g",
                "\u00fc": "u",
                "\u00dc": "u",
                "\u00f6": "o",
                "\u00d6": "o",
                "\u00e7": "c",
                "\u00c7": "c",
            }
        )
        stripped = unicodedata.normalize("NFKD", value.translate(replacements))
        return "".join(char for char in stripped if not unicodedata.combining(char)).casefold()
