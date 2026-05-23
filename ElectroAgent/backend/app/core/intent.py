from __future__ import annotations

import re
from dataclasses import dataclass, field

from .app_discovery import _normalize_name


@dataclass(frozen=True)
class ParsedIntent:
    raw_goal: str
    app_name: str | None = None
    contact_name: str | None = None
    search_query: str | None = None
    outbound_message: str | None = None
    text_to_type: str | None = None
    follow_up_actions: list[str] = field(default_factory=list)

    @property
    def has_external_message(self) -> bool:
        return bool(self.outbound_message)


def parse_goal(goal: str) -> ParsedIntent:
    raw_goal = goal.strip()
    app_name = _extract_app_name(raw_goal)
    search_query = _extract_search_query(raw_goal)
    contact_name = None if search_query else _extract_contact_name(raw_goal)
    outbound_message = _extract_outbound_message(raw_goal)
    text_to_type = _extract_text_to_type(raw_goal) or _extract_content_request(raw_goal)
    if not app_name and text_to_type:
        app_name = "Notepad"
    follow_up_actions = _extract_follow_up_actions(raw_goal, app_name)

    return ParsedIntent(
        raw_goal=raw_goal,
        app_name=app_name,
        contact_name=contact_name,
        search_query=search_query,
        outbound_message=outbound_message,
        text_to_type=text_to_type,
        follow_up_actions=follow_up_actions,
    )


def _extract_app_name(goal: str) -> str | None:
    english = re.search(
        r"\b(?:open|launch|start)\s+(?P<target>.+?)(?:[,.;]|\s+\b(?:and|then|find|search|send|message)\b|$)",
        goal,
        flags=re.IGNORECASE,
    )
    if english:
        return _clean_app_name(english.group("target"))

    normalized = _normalize_name(goal)
    turkish = re.search(r"^(?P<target>.+?)\s+(?:ac|baslat|calistir)(?:\s|$)", normalized)
    if turkish:
        return _clean_app_name(turkish.group("target"))

    return None


def _extract_contact_name(goal: str) -> str | None:
    patterns = [
        r"\b(?:find|search for|look for)\s+(?P<contact>.+?)(?:[,.;]|\s+\b(?:and|then|send|message)\b|$)",
        r"\b(?P<contact>[^,.;]+?)\s+(?:kisiyi|kisiyi|kisiyi|bul)(?:[,.;]|\s|$)",
    ]
    normalized = _normalize_name(goal)
    for pattern in patterns:
        match = re.search(pattern, goal, flags=re.IGNORECASE)
        if match:
            return _clean_contact_name(match.group("contact"))
        normalized_match = re.search(pattern, normalized, flags=re.IGNORECASE)
        if normalized_match:
            return _clean_contact_name(normalized_match.group("contact"))
    return None


def _extract_search_query(goal: str) -> str | None:
    patterns = [
        r"\b(?:search|google|look up|find online|search google for)\s+(?P<query>.+?)(?:[,.;]|\s+\b(?:and|then)\b|$)",
        r"\b(?:google'?da|internette|webde)\s+(?P<query>.+?)\s+(?:ara|arat|bul)(?:[,.;]|\s|$)",
        r"\b(?P<query>.+?)\s+(?:google'?da|internette|webde)\s+(?:ara|arat|bul)(?:[,.;]|\s|$)",
    ]
    normalized = _normalize_name(goal)
    for pattern in patterns:
        match = re.search(pattern, goal, flags=re.IGNORECASE)
        if match:
            return _clean_search_query(match.group("query"))
        normalized_match = re.search(pattern, normalized, flags=re.IGNORECASE)
        if normalized_match:
            return _clean_search_query(normalized_match.group("query"))
    return None


def _extract_outbound_message(goal: str) -> str | None:
    quoted = re.search(r"[\"'“”](?P<message>.+?)[\"'“”]", goal)
    if quoted:
        return quoted.group("message").strip()

    if ":" in goal:
        before, after = goal.split(":", 1)
        before_tokens = set(_normalize_name(before).split())
        if before_tokens.intersection({"send", "message", "mesaj", "gonder", "yolla"}):
            return after.strip()

    after_colon = re.search(
        r"\b(?:send|message|mesaj|gonder|yolla)\b.*?:\s*(?P<message>.+)$",
        _normalize_name(goal),
        flags=re.IGNORECASE,
    )
    if after_colon:
        return after_colon.group("message").strip()

    return None


def _extract_text_to_type(goal: str) -> str | None:
    quoted = re.search(r"[\"'â€œâ€](?P<text>.+?)[\"'â€œâ€]", goal)
    normalized = _normalize_name(goal)
    if quoted and any(token in normalized.split() for token in ("write", "type", "yaz", "not", "metin")):
        return quoted.group("text").strip()

    patterns = [
        r"\b(?:write|type)\s+(?P<text>.+)$",
        r"\b(?:sunlari|sunu|bunu|metni|notu)?\s*yaz\s*:?\s*(?P<text>.+)$",
        r"\b(?:ve|and)\s+(?P<text>.+?)\s+yaz$",
    ]
    for pattern in patterns:
        match = re.search(pattern, goal, flags=re.IGNORECASE)
        if match:
            return _clean_typed_text(match.group("text"))
        normalized_match = re.search(pattern, normalized, flags=re.IGNORECASE)
        if normalized_match:
            return _clean_typed_text(normalized_match.group("text"))

    return None


def _extract_content_request(goal: str) -> str | None:
    normalized = _normalize_name(goal)
    content_markers = (
        "create",
        "make",
        "draft",
        "generate",
        "olustur",
        "hazirla",
        "planla",
    )
    content_nouns = (
        "list",
        "shopping",
        "grocery",
        "note",
        "paragraph",
        "market",
        "liste",
        "not",
        "yemek",
        "aksam yemegi",
    )
    words = set(normalized.split())
    if any(marker in words for marker in content_markers) and any(noun in normalized for noun in content_nouns):
        return _clean_typed_text(goal)

    if re.search(r"\b(?:shopping|grocery|market)\s+list\b", normalized):
        return _clean_typed_text(goal)

    if "market listesi" in normalized or "aksam yemegi" in normalized:
        return _clean_typed_text(goal)

    return None


def _extract_follow_up_actions(goal: str, app_name: str | None) -> list[str]:
    if not app_name:
        return []

    pieces = [piece.strip() for piece in re.split(r"[,;]|\s+\bthen\b\s+|\s+\band\b\s+", goal, flags=re.IGNORECASE)]
    actions: list[str] = []
    for piece in pieces:
        normalized_piece = _normalize_name(piece)
        normalized_app = _normalize_name(app_name)
        if not normalized_piece or normalized_piece == normalized_app:
            continue
        if normalized_app and normalized_app in normalized_piece and any(verb in normalized_piece.split() for verb in ("open", "launch", "start", "ac", "baslat", "calistir")):
            continue
        actions.append(piece)
    return actions[:5]


def _clean_app_name(value: str) -> str:
    cleaned = value.strip().strip(".,;:")
    cleaned = re.sub(r"\b(app|application|program|uygulama\S*|program\S*)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bnot defterini\b", "not defteri", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip(" '\"")


def _clean_contact_name(value: str) -> str:
    cleaned = value.strip().strip(".,;:")
    cleaned = re.sub(r"\b(this|that|message|mesaj|send|gonder|yolla)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip(" '\"")


def _clean_typed_text(value: str) -> str:
    cleaned = value.strip().strip(".,;")
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip(" '\"")


def _clean_search_query(value: str) -> str:
    cleaned = value.strip().strip(".,;:")
    cleaned = re.sub(r"^(?:google\s+for|for)\s+", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip(" '\"")
