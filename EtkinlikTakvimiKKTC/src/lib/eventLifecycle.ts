import type { Event } from "@/types/event";

export const DEFAULT_EVENT_DURATION_HOURS = 6;
export const EXPIRED_VISIBLE_HOURS = 24;

export type EventLifecycleState = "upcoming" | "live" | "expired" | "hidden";

export function getEventDurationHours(event: Pick<Event, "durationHours">) {
  return Number.isFinite(event.durationHours) && event.durationHours > 0
    ? event.durationHours
    : DEFAULT_EVENT_DURATION_HOURS;
}

export function getEventStartDate(event: Pick<Event, "dateISO" | "time">) {
  return new Date(`${event.dateISO}T${event.time}:00`);
}

export function getEventEndDate(event: Pick<Event, "dateISO" | "time" | "durationHours">) {
  const startDate = getEventStartDate(event);
  return new Date(startDate.getTime() + getEventDurationHours(event) * 60 * 60 * 1000);
}

export function getEventRemovalDate(event: Pick<Event, "dateISO" | "time" | "durationHours">) {
  const endDate = getEventEndDate(event);
  return new Date(endDate.getTime() + EXPIRED_VISIBLE_HOURS * 60 * 60 * 1000);
}

export function getEventLifecycleState(
  event: Pick<Event, "dateISO" | "time" | "durationHours">,
  now = new Date()
): EventLifecycleState {
  const startDate = getEventStartDate(event);
  const endDate = getEventEndDate(event);
  const removalDate = getEventRemovalDate(event);

  if (now < startDate) {
    return "upcoming";
  }

  if (now <= endDate) {
    return "live";
  }

  if (now <= removalDate) {
    return "expired";
  }

  return "hidden";
}

export function isRecentlyExpiredEvent(
  event: Pick<Event, "dateISO" | "time" | "durationHours">,
  now = new Date()
) {
  return getEventLifecycleState(event, now) === "expired";
}

export function isPubliclyVisibleApprovedEvent(event: Event, now = new Date()) {
  return event.status === "approved" && getEventLifecycleState(event, now) !== "hidden";
}

export function formatEventDuration(event: Pick<Event, "durationHours">) {
  const duration = getEventDurationHours(event);
  return `${duration} saat`;
}
