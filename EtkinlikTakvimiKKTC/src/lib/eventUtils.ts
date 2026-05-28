import type { Event, EventCategory, EventStatus } from "@/types/event";
import { MOCK_TODAY_ISO } from "./eventConstants";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(event: Pick<Event, "isFree" | "priceMin" | "priceMax">) {
  if (event.isFree) {
    return "Ücretsiz";
  }

  if (event.priceMin === event.priceMax) {
    return `${event.priceMin} TL`;
  }

  return `${event.priceMin} TL - ${event.priceMax} TL`;
}

export function categoryBadgeClass(category: EventCategory) {
  const classes: Record<EventCategory, string> = {
    "DJ Night": "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200",
    Club: "bg-violet-100 text-violet-700 ring-violet-200",
    "Beach Party": "bg-cyan-100 text-cyan-700 ring-cyan-200",
    Concert: "bg-orange-100 text-orange-700 ring-orange-200",
    Festival: "bg-lime-100 text-lime-800 ring-lime-200",
    Pub: "bg-rose-100 text-rose-700 ring-rose-200",
    University: "bg-indigo-100 text-indigo-700 ring-indigo-200",
    "Stand-up": "bg-amber-100 text-amber-800 ring-amber-200",
    Workshop: "bg-teal-100 text-teal-700 ring-teal-200"
  };

  return classes[category];
}

export function statusBadgeClass(status: EventStatus) {
  const classes: Record<EventStatus, string> = {
    approved: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-100 text-amber-800 ring-amber-200",
    rejected: "bg-rose-100 text-rose-700 ring-rose-200"
  };

  return classes[status];
}

export function formatStatus(status: EventStatus) {
  const labels: Record<EventStatus, string> = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected"
  };

  return labels[status];
}

export function isSameMockMonth(dateISO: string) {
  return dateISO.slice(0, 7) === MOCK_TODAY_ISO.slice(0, 7);
}

export function isMockWeekend(dateISO: string) {
  const date = new Date(`${dateISO}T12:00:00`);
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}
