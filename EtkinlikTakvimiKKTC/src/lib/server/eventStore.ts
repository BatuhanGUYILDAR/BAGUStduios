import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  categoryOptions,
  cityOptions
} from "@/lib/eventConstants";
import { DEFAULT_EVENT_DURATION_HOURS, isPubliclyVisibleApprovedEvent } from "@/lib/eventLifecycle";
import { events as seedEvents, venues } from "@/lib/mockData";
import type {
  AdminEventPatch,
  City,
  CreateEventPayload,
  Event,
  EventCategory,
  EventStatus
} from "@/types/event";

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

let writeQueue = Promise.resolve();

export class EventStoreError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCity(value: unknown): value is City {
  return typeof value === "string" && cityOptions.includes(value as City);
}

function isCategory(value: unknown): value is EventCategory {
  return typeof value === "string" && categoryOptions.includes(value as EventCategory);
}

function isAgeLimit(value: unknown): value is Event["ageLimit"] {
  return value === "18+" || value === "All Ages";
}

function isStatus(value: unknown): value is EventStatus {
  return value === "pending" || value === "approved" || value === "rejected";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function booleanValue(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return fallback;
}

function normalizeExistingStatus(status: unknown): EventStatus {
  if (isStatus(status)) {
    return status;
  }

  if (status === "Pending") {
    return "pending";
  }

  if (status === "Cancelled") {
    return "rejected";
  }

  return "approved";
}

function normalizeEvent(event: Event): Event {
  const durationHours = Number.isFinite(event.durationHours)
    ? Math.max(1, event.durationHours)
    : DEFAULT_EVENT_DURATION_HOURS;

  return {
    ...event,
    durationHours,
    priceMin: Number.isFinite(event.priceMin) ? event.priceMin : 0,
    priceMax: Number.isFinite(event.priceMax) ? event.priceMax : 0,
    status: normalizeExistingStatus(event.status),
    isFree: event.isFree || (event.priceMin === 0 && event.priceMax === 0)
  };
}

async function ensureDatabase() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(EVENTS_FILE, "utf8");
  } catch {
    await writeEvents(seedEvents.map(normalizeEvent));
  }
}

async function readEventsUnsafe() {
  await ensureDatabase();
  const raw = await readFile(EVENTS_FILE, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new EventStoreError("Events database is corrupted.", 500);
  }

  return parsed.map((event) => normalizeEvent(event as Event));
}

async function writeEvents(events: Event[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(EVENTS_FILE, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

async function withWrite<T>(operation: () => Promise<T>) {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function formatEventDate(dateISO: string) {
  const date = new Date(`${dateISO}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateISO;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long"
  }).format(date);
}

function formatLastUpdated() {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function uniqueSlug(title: string, events: Event[]) {
  const base = slugify(title) || `event-${Date.now()}`;
  let candidate = base;
  let suffix = 2;

  while (events.some((event) => event.slug === candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function whatsappUrlFromContact(value: string) {
  if (!value) {
    return "https://wa.me/";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "https://wa.me/";
}

function gradientForCategory(category: EventCategory) {
  const gradients: Record<EventCategory, string> = {
    "DJ Night": "linear-gradient(135deg, #ff2daa 0%, #7c3aed 52%, #06b6d4 100%)",
    Club: "linear-gradient(135deg, #111827 0%, #7c3aed 45%, #ff2daa 100%)",
    "Beach Party": "linear-gradient(135deg, #06b6d4 0%, #a3e635 50%, #f97316 100%)",
    Concert: "linear-gradient(135deg, #f97316 0%, #ff2daa 48%, #7c3aed 100%)",
    Festival: "linear-gradient(135deg, #7c3aed 0%, #ff2daa 44%, #a3e635 100%)",
    Pub: "linear-gradient(135deg, #f97316 0%, #ff2daa 54%, #06b6d4 100%)",
    University: "linear-gradient(135deg, #a3e635 0%, #06b6d4 50%, #7c3aed 100%)",
    "Stand-up": "linear-gradient(135deg, #fff7ed 0%, #f97316 45%, #ff2daa 100%)",
    Workshop: "linear-gradient(135deg, #ecfeff 0%, #06b6d4 48%, #a3e635 100%)"
  };

  return gradients[category];
}

function parseCreatePayload(payload: unknown): CreateEventPayload {
  if (!isRecord(payload)) {
    throw new EventStoreError("Geçersiz etkinlik verisi.");
  }

  const title = stringValue(payload.title);
  const venueName = stringValue(payload.venueName);
  const city = payload.city;
  const category = payload.category;
  const dateISO = stringValue(payload.dateISO ?? payload.date);
  const time = stringValue(payload.time);
  const ageLimit = payload.ageLimit;
  const description = stringValue(payload.description);

  if (!title) {
    throw new EventStoreError("Etkinlik başlığı zorunludur.");
  }

  if (!venueName) {
    throw new EventStoreError("Mekan adı zorunludur.");
  }

  if (!isCity(city)) {
    throw new EventStoreError("Geçerli bir şehir seçiniz.");
  }

  if (!isCategory(category)) {
    throw new EventStoreError("Geçerli bir kategori seçiniz.");
  }

  if (!dateISO || Number.isNaN(new Date(`${dateISO}T12:00:00`).getTime())) {
    throw new EventStoreError("Geçerli bir tarih giriniz.");
  }

  if (!time) {
    throw new EventStoreError("Saat zorunludur.");
  }

  if (!isAgeLimit(ageLimit)) {
    throw new EventStoreError("Geçerli bir yaş limiti seçiniz.");
  }

  if (!description) {
    throw new EventStoreError("Açıklama zorunludur.");
  }

  const priceMin = Math.max(0, numberValue(payload.priceMin, 0));
  const priceMax = Math.max(priceMin, numberValue(payload.priceMax, priceMin));
  const durationHours = Math.max(1, numberValue(payload.durationHours, DEFAULT_EVENT_DURATION_HOURS));

  return {
    title,
    venueName,
    city,
    category,
    dateISO,
    time,
    priceMin,
    priceMax,
    durationHours,
    ageLimit,
    description,
    artist: stringValue(payload.artist),
    instagramUrl: stringValue(payload.instagramUrl),
    whatsappContact: stringValue(payload.whatsappContact),
    sourceUrl: stringValue(payload.sourceUrl)
  };
}

export function parseAdminPatch(payload: unknown): AdminEventPatch {
  if (!isRecord(payload)) {
    throw new EventStoreError("Geçersiz güncelleme verisi.");
  }

  const patch: AdminEventPatch = {};

  if ("status" in payload) {
    if (!isStatus(payload.status)) {
      throw new EventStoreError("Geçersiz status değeri.");
    }

    patch.status = payload.status;
  }

  if ("title" in payload) {
    patch.title = stringValue(payload.title);
  }

  if ("venueName" in payload) {
    patch.venueName = stringValue(payload.venueName);
  }

  if ("city" in payload) {
    if (!isCity(payload.city)) {
      throw new EventStoreError("Geçerli bir şehir seçiniz.");
    }

    patch.city = payload.city;
  }

  if ("category" in payload) {
    if (!isCategory(payload.category)) {
      throw new EventStoreError("Geçerli bir kategori seçiniz.");
    }

    patch.category = payload.category;
  }

  if ("dateISO" in payload) {
    const dateISO = stringValue(payload.dateISO);
    if (!dateISO || Number.isNaN(new Date(`${dateISO}T12:00:00`).getTime())) {
      throw new EventStoreError("Geçerli bir tarih giriniz.");
    }

    patch.dateISO = dateISO;
  }

  if ("time" in payload) {
    patch.time = stringValue(payload.time);
  }

  if ("durationHours" in payload) {
    patch.durationHours = Math.max(
      1,
      numberValue(payload.durationHours, DEFAULT_EVENT_DURATION_HOURS)
    );
  }

  if ("priceMin" in payload) {
    patch.priceMin = Math.max(0, numberValue(payload.priceMin));
  }

  if ("priceMax" in payload) {
    patch.priceMax = Math.max(0, numberValue(payload.priceMax));
  }

  if ("ageLimit" in payload) {
    if (!isAgeLimit(payload.ageLimit)) {
      throw new EventStoreError("Geçerli bir yaş limiti seçiniz.");
    }

    patch.ageLimit = payload.ageLimit;
  }

  if ("description" in payload) {
    patch.description = stringValue(payload.description);
  }

  if ("artist" in payload) {
    patch.artist = stringValue(payload.artist);
  }

  if ("verified" in payload) {
    patch.verified = booleanValue(payload.verified);
  }

  if ("featured" in payload) {
    patch.featured = booleanValue(payload.featured);
  }

  if ("instagramUrl" in payload) {
    patch.instagramUrl = stringValue(payload.instagramUrl);
  }

  if ("whatsappUrl" in payload) {
    patch.whatsappUrl = whatsappUrlFromContact(stringValue(payload.whatsappUrl));
  }

  if ("sourceUrl" in payload) {
    patch.sourceUrl = stringValue(payload.sourceUrl);
  }

  return patch;
}

export async function getAllEvents() {
  return readEventsUnsafe();
}

export async function getApprovedEvents() {
  const events = await readEventsUnsafe();
  return events.filter((event) => isPubliclyVisibleApprovedEvent(event));
}

export async function getApprovedEventBySlug(slug: string) {
  const events = await getApprovedEvents();
  return events.find((event) => event.slug === slug);
}

export async function getApprovedEventsByVenueId(venueId: string) {
  const events = await getApprovedEvents();
  return events.filter((event) => event.venueId === venueId);
}

export async function getSimilarApprovedEvents(event: Event, limit = 3) {
  const events = await getApprovedEvents();

  return events
    .filter(
      (candidate) =>
        candidate.id !== event.id &&
        (candidate.city === event.city || candidate.category === event.category)
    )
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

export async function createPendingEvent(payload: unknown) {
  return withWrite(async () => {
    const input = parseCreatePayload(payload);
    const events = await readEventsUnsafe();
    const matchedVenue = venues.find(
      (venue) => venue.name.toLocaleLowerCase("tr-TR") === input.venueName.toLocaleLowerCase("tr-TR")
    );
    const event: Event = {
      id: crypto.randomUUID(),
      slug: uniqueSlug(input.title, events),
      title: input.title,
      venueId: matchedVenue?.id ?? `venue-${slugify(input.venueName) || crypto.randomUUID()}`,
      venueName: input.venueName,
      city: input.city,
      category: input.category,
      date: formatEventDate(input.dateISO),
      dateISO: input.dateISO,
      time: input.time,
      durationHours: input.durationHours ?? DEFAULT_EVENT_DURATION_HOURS,
      priceMin: input.priceMin,
      priceMax: input.priceMax,
      isFree: input.priceMin === 0 && input.priceMax === 0,
      ageLimit: input.ageLimit,
      description: input.description,
      artist: input.artist || "Organizatör bilgisi bekleniyor",
      posterGradient: gradientForCategory(input.category),
      verified: false,
      featured: false,
      status: "pending",
      whatsappUrl: whatsappUrlFromContact(input.whatsappContact ?? ""),
      instagramUrl: input.instagramUrl || "https://instagram.com/",
      sourceUrl: input.sourceUrl || "#",
      lastUpdated: formatLastUpdated()
    };

    const nextEvents = [event, ...events];
    await writeEvents(nextEvents);
    return event;
  });
}

export async function updateEvent(id: string, patch: AdminEventPatch) {
  return withWrite(async () => {
    const events = await readEventsUnsafe();
    const index = events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new EventStoreError("Etkinlik bulunamadı.", 404);
    }

    const current = events[index];
    const priceMin = patch.priceMin ?? current.priceMin;
    const priceMax = Math.max(priceMin, patch.priceMax ?? current.priceMax);
    const durationHours = Math.max(
      1,
      patch.durationHours ?? current.durationHours ?? DEFAULT_EVENT_DURATION_HOURS
    );
    const dateISO = patch.dateISO ?? current.dateISO;
    const category = patch.category ?? current.category;
    const updated: Event = {
      ...current,
      ...patch,
      priceMin,
      priceMax,
      durationHours,
      isFree: priceMin === 0 && priceMax === 0,
      dateISO,
      date: formatEventDate(dateISO),
      posterGradient: patch.category ? gradientForCategory(category) : current.posterGradient,
      lastUpdated: formatLastUpdated()
    };

    events[index] = updated;
    await writeEvents(events);
    return updated;
  });
}

export async function deleteEvent(id: string) {
  return withWrite(async () => {
    const events = await readEventsUnsafe();
    const nextEvents = events.filter((event) => event.id !== id);

    if (nextEvents.length === events.length) {
      throw new EventStoreError("Etkinlik bulunamadı.", 404);
    }

    await writeEvents(nextEvents);
  });
}
