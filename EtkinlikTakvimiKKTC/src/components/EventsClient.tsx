"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Event, EventFiltersState } from "@/types/event";
import { filterEvents } from "@/lib/filterEvents";
import { EmptyState } from "./EmptyState";
import { EventList } from "./EventList";
import { Button } from "./Button";

type EventsResponse = {
  events?: Event[];
  error?: string;
};

type EventsClientProps = {
  filters: EventFiltersState;
};

export function EventsClient({ filters }: EventsClientProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const filteredEvents = useMemo(() => filterEvents(events, filters), [events, filters]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        cache: "no-store"
      });
      const data = (await response.json()) as EventsResponse;

      if (!response.ok) {
        throw new Error(data.error || "Etkinlikler yüklenemedi.");
      }

      setEvents(data.events ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Etkinlikler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, [loadEvents]);

  if (loading) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
          Etkinlikler yükleniyor
        </p>
        <p className="mt-2 text-sm font-semibold text-slatecopy">
          Approved etkinlikler API&apos;den alınıyor.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-center">
        <h2 className="text-2xl font-black text-ink">Etkinlikler yüklenemedi</h2>
        <p className="mt-3 text-sm font-semibold text-slatecopy">{error}</p>
        <Button className="mt-6" onClick={loadEvents} variant="secondary">
          Tekrar Dene
        </Button>
      </section>
    );
  }

  return filteredEvents.length > 0 ? <EventList events={filteredEvents} /> : <EmptyState />;
}
