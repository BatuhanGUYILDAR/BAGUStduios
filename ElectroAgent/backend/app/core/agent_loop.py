from __future__ import annotations

import re
import uuid

from .app_discovery import ApplicationDiscovery
from .browser_agent import BrowserAgent
from .desktop_observer import DesktopObserver
from .events import event_hub
from .memory import MemoryStore
from .model_router import ModelRouter
from .safety import SafetyPolicy
from .schemas import AgentEvent, AgentRunSummary


class AgentRuntime:
    def __init__(
        self,
        discovery: ApplicationDiscovery,
        memory: MemoryStore,
        model_router: ModelRouter,
        observer: DesktopObserver,
    ) -> None:
        self.discovery = discovery
        self.memory = memory
        self.model_router = model_router
        self.observer = observer
        self.browser = BrowserAgent()
        self.safety = SafetyPolicy()

    async def execute(self, goal: str, autonomous: bool = True) -> AgentRunSummary:
        run_id = str(uuid.uuid4())
        events: list[AgentEvent] = []

        async def record(kind: str, title: str, detail: str) -> None:
            event = AgentEvent(id=str(uuid.uuid4()), kind=kind, title=title, detail=detail)
            events.append(event)
            await event_hub.publish({"type": "event", "data": event.model_dump(mode="json")})

        safety = self.safety.assess_goal(goal)
        await record("reasoning", "Goal understood", f"Interpreting the request as: {goal}")

        if not safety.allowed:
            await record("safety", "Action restricted", safety.reason)
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=0.0,
                summary="I cannot carry out that request because it crosses the local safety boundary.",
                events=events,
                requires_confirmation=True,
            )

        if safety.requires_confirmation or not autonomous:
            await record("safety", "Confirmation needed", safety.reason)
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=0.35,
                summary="I paused before doing anything sensitive. Confirm the exact action and I can continue inside the safety policy.",
                events=events,
                requires_confirmation=True,
            )

        app_name = self._extract_app_name(goal)
        if app_name:
            return await self._open_application(run_id, goal, app_name, events, record)

        if self._looks_like_web_search(goal):
            await record("reasoning", "Browser strategy selected", "The goal maps to a browser research action.")
            result = self.browser.search_web(goal)
            await record("action", "Browser opened", str(result["url"]))
            await record("verification", "Browser handoff complete", "The browser was opened for an autonomous research pass.")
            self.memory.remember(f"Browser research requested: {goal}", {"run_id": run_id})
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=bool(result["opened"]),
                confidence=0.72,
                summary="I opened a browser search for that goal. The next layer will inspect pages, compare results, and continue the workflow autonomously.",
                events=events,
            )

        await record("observation", "Desktop snapshot requested", "I captured the current desktop state before planning.")
        observation = self.observer.observe()
        await record("reasoning", "Planning route selected", observation.get("semantic_summary", "Desktop state captured."))
        self.memory.remember(f"Goal observed for planning: {goal}", {"run_id": run_id})

        return AgentRunSummary(
            run_id=run_id,
            goal=goal,
            completed=False,
            confidence=0.54,
            summary="I understood the goal and observed the desktop. This request needs a richer tool plan before I touch the computer, so I kept it in planning instead of pretending it was done.",
            events=events,
        )

    async def _open_application(
        self,
        run_id: str,
        goal: str,
        app_name: str,
        events: list[AgentEvent],
        record,
    ) -> AgentRunSummary:
        await record("observation", "Application discovery", f"Scanning installed applications for {app_name}.")
        matches = self.discovery.search(app_name, limit=5)
        if not matches:
            await record("verification", "No application match", "Start Menu, registry, and executable index did not return a confident match.")
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=0.12,
                summary=f"I could not find a confident installed-app match for {app_name}.",
                events=events,
            )

        candidate = matches[0]
        await record(
            "reasoning",
            "Best application candidate",
            f"{candidate.name} from {candidate.source} with {candidate.confidence:.0%} confidence.",
        )

        launch_safety = self.safety.assess_launch_path(candidate.launch_path)
        if launch_safety.requires_confirmation:
            await record("safety", "Launch confirmation needed", launch_safety.reason)
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=candidate.confidence,
                summary=f"I found {candidate.name}, but launching that target requires your confirmation.",
                events=events,
                requires_confirmation=True,
            )

        await record("action", "Launching application", candidate.name)
        launched = self.discovery.launch(candidate)
        await record(
            "verification",
            "Launch verified" if launched else "Launch not verified",
            "Process monitoring accepted the launch." if launched else "The launch call returned, but the process could not be verified.",
        )
        self.memory.remember(f"Opened application {candidate.name} for goal: {goal}", {"run_id": run_id, "app": candidate.name})
        return AgentRunSummary(
            run_id=run_id,
            goal=goal,
            completed=launched,
            confidence=candidate.confidence,
            summary=(
                f"I found {candidate.name}, launched it, and checked the process state."
                if launched
                else f"I found {candidate.name} and tried to launch it, but verification did not confirm the process."
            ),
            events=events,
        )

    @staticmethod
    def _extract_app_name(goal: str) -> str | None:
        patterns = [
            r"\bopen\s+(.+)$",
            r"\blaunch\s+(.+)$",
            r"\bstart\s+(.+)$",
        ]
        for pattern in patterns:
            match = re.search(pattern, goal.strip(), flags=re.IGNORECASE)
            if match:
                app_name = match.group(1).strip().strip(".")
                return re.sub(r"\b(app|application|program)\b", "", app_name, flags=re.IGNORECASE).strip()
        return None

    @staticmethod
    def _looks_like_web_search(goal: str) -> bool:
        lowered = goal.lower()
        return any(term in lowered for term in ("search", "google", "look up", "find online", "website", "marketplace"))
