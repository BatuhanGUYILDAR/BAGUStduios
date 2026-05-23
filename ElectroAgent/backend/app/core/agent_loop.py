from __future__ import annotations

import uuid

from .app_discovery import ApplicationDiscovery
from .autonomous_planner import AutonomousPlan, AutonomousPlanner
from .browser_agent import BrowserAgent
from .desktop_operator import DesktopOperator
from .desktop_observer import DesktopObserver
from .events import event_hub
from .intent import ParsedIntent, parse_goal
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
        self.operator = DesktopOperator()
        self.planner = AutonomousPlanner(model_router)
        self.safety = SafetyPolicy()
        self.pending_confirmation: ParsedIntent | None = None

    async def execute(self, goal: str, autonomous: bool = True) -> AgentRunSummary:
        run_id = str(uuid.uuid4())
        events: list[AgentEvent] = []

        async def record(kind: str, title: str, detail: str) -> None:
            event = AgentEvent(id=str(uuid.uuid4()), kind=kind, title=title, detail=detail)
            events.append(event)
            await event_hub.publish({"type": "event", "data": event.model_dump(mode="json")})

        safety = self.safety.assess_goal(goal)
        intent = parse_goal(goal)
        await record("reasoning", "Goal understood", f"Interpreting the request as: {goal}")

        if self.pending_confirmation and self._is_confirmation(goal):
            return await self._continue_pending_confirmation(run_id, goal, events, record)

        if self.pending_confirmation and self._is_cancellation(goal):
            pending = self.pending_confirmation
            self.pending_confirmation = None
            await record("safety", "Pending action cancelled", self._intent_detail(pending))
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=True,
                confidence=1.0,
                summary="I cancelled the pending action. Nothing else was sent or changed.",
                events=events,
            )

        if intent.app_name:
            await record("reasoning", "Intent understood", self._intent_detail(intent))

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

        if intent.app_name:
            return await self._open_application(run_id, goal, intent.app_name, events, record, intent)

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
        await record("reasoning", "More context needed", observation.get("semantic_summary", "Desktop state captured."))
        self.memory.remember(f"Goal observed for planning: {goal}", {"run_id": run_id})

        return AgentRunSummary(
            run_id=run_id,
            goal=goal,
            completed=False,
            confidence=0.54,
            summary="I understood the goal and observed the desktop, but I do not yet have a safe enough desktop strategy to act on it.",
            events=events,
        )

    async def _open_application(
        self,
        run_id: str,
        goal: str,
        app_name: str,
        events: list[AgentEvent],
        record,
        intent: ParsedIntent | None = None,
    ) -> AgentRunSummary:
        await record("observation", "Application discovery", f"Scanning installed applications for {app_name}.")
        matches = self.discovery.search(app_name, limit=5)
        candidate = self.discovery.best_launch_match(app_name)
        if not candidate:
            if matches:
                close_matches = ", ".join(f"{match.name} ({match.confidence:.0%})" for match in matches[:3])
                await record(
                    "verification",
                    "Low confidence application match",
                    f"Closest candidates were {close_matches}, but none were safe enough to launch automatically.",
                )
                summary = f"I found possible matches for {app_name}, but none were confident enough to open safely."
                confidence = matches[0].confidence
            else:
                await record("verification", "No application match", "Start Menu, registry, and executable index did not return a confident match.")
                summary = f"I could not find an installed application match for {app_name}."
                confidence = 0.12
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=confidence,
                summary=summary,
                events=events,
            )

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

        if launched and intent:
            observation = self.observer.observe()
            await record("observation", "Desktop observed after launch", observation.get("semantic_summary", "Desktop state captured."))
            plan = self.planner.build_plan(intent, observation)
            if plan.actions:
                await record("reasoning", "AI strategy selected", plan.summary)

        if launched and intent and intent.has_external_message:
            self.pending_confirmation = intent
            contact = f" for {intent.contact_name}" if intent.contact_name else ""
            await record(
                "safety",
                "Message send paused",
                f"I opened {candidate.name}, but sending a message{contact} needs explicit confirmation.",
            )
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=min(candidate.confidence, 0.82),
                summary=f"I opened {candidate.name}. I did not send the message yet. Say 'onayla' to send it, or 'iptal' to cancel.",
                events=events,
                requires_confirmation=True,
            )

        if launched and intent and plan.actions:
            result = await self._execute_autonomous_plan(plan, record)
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=result.completed,
                confidence=0.82 if result.completed else 0.45,
                summary=result.detail,
                events=events,
                requires_confirmation=plan.requires_confirmation and not result.completed,
            )

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
        return parse_goal(goal).app_name

    @staticmethod
    def _intent_detail(intent: ParsedIntent) -> str:
        parts = [f"I will work in {intent.app_name}." if intent.app_name else "I will use the current desktop context."]
        if intent.contact_name:
            parts.append(f"Target person or item: {intent.contact_name}.")
        if intent.search_query:
            parts.append(f"Web search: {intent.search_query}.")
        if intent.outbound_message:
            parts.append("An outbound message is involved.")
        if intent.text_to_type:
            parts.append("Text or content needs to be created.")
        if intent.follow_up_actions:
            parts.append("Follow-up intent: " + " | ".join(intent.follow_up_actions))
        return " ".join(parts)

    async def _continue_pending_confirmation(self, run_id: str, goal: str, events: list[AgentEvent], record) -> AgentRunSummary:
        pending = self.pending_confirmation
        self.pending_confirmation = None
        if not pending:
            await record("verification", "No pending action", "There is no pending action to confirm.")
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=False,
                confidence=0.0,
                summary="There is no pending action to confirm.",
                events=events,
            )

        if pending.outbound_message:
            await record("safety", "Confirmation accepted", "Continuing the approved external message action.")
            observation = self.observer.observe()
            await record("observation", "Desktop observed before confirmed action", observation.get("semantic_summary", "Desktop state captured."))
            plan = self.planner.build_plan(pending, observation)
            result = await self._execute_autonomous_plan(plan, record, include_confirmed=True)
            return AgentRunSummary(
                run_id=run_id,
                goal=goal,
                completed=result.completed,
                confidence=0.86 if result.completed else 0.42,
                summary=result.detail,
                events=events,
            )

        await record("verification", "Unsupported pending action", self._intent_detail(pending))
        return AgentRunSummary(
            run_id=run_id,
            goal=goal,
            completed=False,
            confidence=0.2,
            summary="I understood the confirmation, but this pending action is not wired to a safe desktop operator yet.",
            events=events,
        )

    @staticmethod
    def _is_confirmation(goal: str) -> bool:
        lowered = goal.strip().casefold()
        return lowered in {
            "onayla",
            "onayliyorum",
            "onaylıyorum",
            "evet",
            "evet gonder",
            "evet gönder",
            "gonder",
            "gönder",
            "devam et",
            "continue",
            "proceed",
            "send it",
            "yes",
        }

    @staticmethod
    def _is_cancellation(goal: str) -> bool:
        lowered = goal.strip().casefold()
        return lowered in {"iptal", "vazgec", "vazgeç", "cancel", "stop", "hayir", "hayır", "no"}

    @staticmethod
    def _looks_like_web_search(goal: str) -> bool:
        lowered = goal.lower()
        return any(term in lowered for term in ("search", "google", "look up", "find online", "website", "marketplace"))

    async def _execute_autonomous_plan(self, plan: AutonomousPlan, record, include_confirmed: bool = False):
        last_result = None
        for index, action in enumerate(plan.actions, start=1):
            if action.requires_confirmation and not include_confirmed:
                await record("safety", "Autonomous plan paused", f"Step {index} needs explicit confirmation: {action.reason}")
                return type("PlanExecutionResult", (), {"completed": False, "detail": "I paused before an external or sensitive desktop action."})()

            await record("reasoning", f"Operating step {index}", action.reason)
            result = self.operator.execute_action(action.type, action.args)
            last_result = result
            await record("action" if result.completed else "verification", self._operator_action_title(action.type), result.detail)
            if not result.completed:
                return result

            observation = self.observer.observe()
            await record("verification", "Observed outcome", observation.get("semantic_summary", "Desktop state captured."))

        return last_result or type("PlanExecutionResult", (), {"completed": False, "detail": "No desktop actions were available to execute."})()

    @staticmethod
    def _operator_action_title(action_type: str) -> str:
        labels = {
            "focus_window": "Focused the workspace",
            "hotkey": "Navigated the interface",
            "press_key": "Confirmed the next step",
            "type_text": "Entered content",
            "wait": "Waited for the interface",
        }
        return labels.get(action_type, "Operated the desktop")
