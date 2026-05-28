"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarCheck2, Clock3, Save, ShieldCheck, X } from "lucide-react";
import type { AdminEventPatch, Event, EventStatus } from "@/types/event";
import { categoryOptions, cityOptions } from "@/lib/eventConstants";
import { AdminEventTable } from "./AdminEventTable";
import { Button } from "./Button";
import { StatsCard } from "./StatsCard";

type AdminEventsResponse = {
  events?: Event[];
  error?: string;
};

type AdminEventResponse = {
  event?: Event;
  error?: string;
};

type AdminDashboardProps = {
  verifiedVenues: number;
};

export function AdminDashboard({ verifiedVenues }: AdminDashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const pendingEvents = useMemo(
    () => events.filter((event) => event.status === "pending").length,
    [events]
  );

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/events", {
        cache: "no-store"
      });
      const data = (await response.json()) as AdminEventsResponse;

      if (!response.ok) {
        throw new Error(data.error || "Admin etkinlikleri yüklenemedi.");
      }

      setEvents(data.events ?? []);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Admin etkinlikleri yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, [loadEvents]);

  async function patchEvent(id: string, patch: AdminEventPatch, successMessage: string) {
    setActionId(id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
      });
      const data = (await response.json()) as AdminEventResponse;

      if (!response.ok) {
        throw new Error(data.error || "Etkinlik güncellenemedi.");
      }

      setMessage(successMessage);
      setEditingEvent(null);
      await loadEvents();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Etkinlik güncellenemedi.");
    } finally {
      setActionId("");
    }
  }

  async function deleteSelectedEvent(event: Event) {
    const shouldDelete = window.confirm(`${event.title} etkinliği silinsin mi?`);

    if (!shouldDelete) {
      return;
    }

    setActionId(event.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "DELETE"
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Etkinlik silinemedi.");
      }

      setMessage(`${event.title} silindi.`);
      if (editingEvent?.id === event.id) {
        setEditingEvent(null);
      }
      await loadEvents();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Etkinlik silinemedi.");
    } finally {
      setActionId("");
    }
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingEvent) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const status = String(formData.get("status") ?? "pending") as EventStatus;
    const patch: AdminEventPatch = {
      title: String(formData.get("title") ?? ""),
      venueName: String(formData.get("venueName") ?? ""),
      city: String(formData.get("city") ?? editingEvent.city) as Event["city"],
      category: String(formData.get("category") ?? editingEvent.category) as Event["category"],
      dateISO: String(formData.get("dateISO") ?? ""),
      time: String(formData.get("time") ?? ""),
      durationHours: Number(formData.get("durationHours") ?? editingEvent.durationHours),
      priceMin: Number(formData.get("priceMin") ?? 0),
      priceMax: Number(formData.get("priceMax") ?? 0),
      ageLimit: String(formData.get("ageLimit") ?? editingEvent.ageLimit) as Event["ageLimit"],
      artist: String(formData.get("artist") ?? ""),
      description: String(formData.get("description") ?? ""),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") === "on",
      status
    };

    void patchEvent(editingEvent.id, patch, `${editingEvent.title} güncellendi.`);
  }

  return (
    <>
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={CalendarCheck2} label="Total Events" value={String(events.length)} />
        <StatsCard icon={Clock3} label="Pending Events" value={String(pendingEvents)} />
        <StatsCard icon={ShieldCheck} label="Verified Venues" value={String(verifiedVenues)} />
        <StatsCard icon={AlertTriangle} label="Reported Events" value="2" />
      </section>

      {message ? (
        <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4">
          <p className="text-sm font-bold text-rose-800">{error}</p>
          <Button className="mt-3" onClick={loadEvents} size="sm" variant="secondary">
            Tekrar Dene
          </Button>
        </div>
      ) : null}

      {editingEvent ? (
        <section className="glass-panel mb-6 rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
                Edit event
              </p>
              <h2 className="mt-1 text-2xl font-black text-ink">{editingEvent.title}</h2>
            </div>
            <Button onClick={() => setEditingEvent(null)} size="sm" variant="secondary">
              <X aria-hidden="true" size={15} />
              Cancel
            </Button>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleEditSubmit}>
            <AdminInput defaultValue={editingEvent.title} label="Title" name="title" required />
            <AdminInput
              defaultValue={editingEvent.venueName}
              label="Venue"
              name="venueName"
              required
            />
            <AdminSelect defaultValue={editingEvent.city} label="City" name="city" options={cityOptions} />
            <AdminSelect
              defaultValue={editingEvent.category}
              label="Category"
              name="category"
              options={categoryOptions}
            />
            <AdminInput
              defaultValue={editingEvent.dateISO}
              label="Date"
              name="dateISO"
              required
              type="date"
            />
            <AdminInput
              defaultValue={editingEvent.time}
              label="Time"
              name="time"
              required
              type="time"
            />
            <AdminInput
              defaultValue={String(editingEvent.durationHours)}
              label="Duration Hours"
              name="durationHours"
              required
              type="number"
            />
            <AdminInput
              defaultValue={String(editingEvent.priceMin)}
              label="Price Min"
              name="priceMin"
              type="number"
            />
            <AdminInput
              defaultValue={String(editingEvent.priceMax)}
              label="Price Max"
              name="priceMax"
              type="number"
            />
            <AdminSelect
              defaultValue={editingEvent.ageLimit}
              label="Age"
              name="ageLimit"
              options={["18+", "All Ages"]}
            />
            <AdminSelect
              defaultValue={editingEvent.status}
              label="Status"
              name="status"
              options={["pending", "approved", "rejected"]}
            />
            <AdminInput defaultValue={editingEvent.artist} label="Artist" name="artist" />
            <div className="flex items-center gap-6 rounded-2xl bg-white/62 px-4 py-3">
              <label className="flex items-center gap-2 text-sm font-bold text-ink">
                <input defaultChecked={editingEvent.featured} name="featured" type="checkbox" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-ink">
                <input defaultChecked={editingEvent.verified} name="verified" type="checkbox" />
                Verified
              </label>
            </div>
            <label className="grid gap-2 text-sm font-extrabold text-ink md:col-span-2">
              Description
              <textarea
                className="focus-ring min-h-32 rounded-2xl border border-white/80 bg-white/78 px-4 py-3 text-sm font-semibold text-ink shadow-sm"
                defaultValue={editingEvent.description}
                name="description"
                required
              />
            </label>
            <div className="md:col-span-2">
              <Button disabled={actionId === editingEvent.id} type="submit">
                <Save aria-hidden="true" size={17} />
                Save Changes
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {loading ? (
        <section className="glass-panel rounded-[2rem] p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
            Admin events loading
          </p>
          <p className="mt-2 text-sm font-semibold text-slatecopy">
            Backend API&apos;den pending, approved ve rejected kayıtlar alınıyor.
          </p>
        </section>
      ) : (
        <AdminEventTable
          actionId={actionId}
          events={events}
          onApprove={(event) => void patchEvent(event.id, { status: "approved" }, `${event.title} onaylandı.`)}
          onDelete={(event) => void deleteSelectedEvent(event)}
          onEdit={setEditingEvent}
          onReject={(event) => void patchEvent(event.id, { status: "rejected" }, `${event.title} reddedildi.`)}
        />
      )}
    </>
  );
}

function AdminInput({
  defaultValue,
  label,
  name,
  required = false,
  type = "text"
}: {
  defaultValue: string;
  label: string;
  name: string;
  required?: boolean;
  type?: "text" | "date" | "time" | "number";
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-ink">
      {label}
      <input
        className="focus-ring h-11 rounded-2xl border border-white/80 bg-white/78 px-4 text-sm font-semibold text-ink shadow-sm"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function AdminSelect<T extends string>({
  defaultValue,
  label,
  name,
  options
}: {
  defaultValue: T;
  label: string;
  name: string;
  options: T[];
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-ink">
      {label}
      <select
        className="focus-ring h-11 rounded-2xl border border-white/80 bg-white/78 px-4 text-sm font-semibold text-ink shadow-sm"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
