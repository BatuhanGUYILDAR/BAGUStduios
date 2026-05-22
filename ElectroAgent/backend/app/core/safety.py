from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SafetyDecision:
    allowed: bool
    requires_confirmation: bool
    reason: str


class SafetyPolicy:
    destructive_terms = (
        "delete",
        "remove",
        "wipe",
        "format",
        "shutdown",
        "restart",
        "registry",
        "regedit",
        "powershell",
        "cmd",
        "terminal",
        "run script",
        "execute code",
    )

    restricted_terms = (
        "disable antivirus",
        "steal",
        "exfiltrate",
        "bypass password",
        "keylog",
        "credential",
    )

    def assess_goal(self, goal: str) -> SafetyDecision:
        lowered = goal.lower()
        if any(term in lowered for term in self.restricted_terms):
            return SafetyDecision(False, True, "The requested action is restricted by local safety policy.")
        if any(term in lowered for term in self.destructive_terms):
            return SafetyDecision(True, True, "This action needs explicit confirmation before execution.")
        return SafetyDecision(True, False, "Auto allowed.")

    def assess_launch_path(self, launch_path: str) -> SafetyDecision:
        lowered = launch_path.lower()
        if any(name in lowered for name in ("powershell.exe", "cmd.exe", "regedit.exe", "wscript.exe", "cscript.exe")):
            return SafetyDecision(True, True, "Launching shell or registry tools requires confirmation.")
        return SafetyDecision(True, False, "Safe application launch.")
