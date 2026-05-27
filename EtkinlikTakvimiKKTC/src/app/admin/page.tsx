import type { Metadata } from "next";
import { AlertTriangle, CalendarCheck2, Clock3, ShieldCheck } from "lucide-react";
import { AdminEventTable } from "@/components/AdminEventTable";
import { StatsCard } from "@/components/StatsCard";
import { events, venues } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Admin Preview",
  description:
    "KKTC Events frontend-only admin preview dashboard. Login, database and backend are not included."
};

export default function AdminPreviewPage() {
  const pendingEvents = events.filter((event) => event.status === "Pending").length;
  const verifiedVenues = venues.filter((venue) => venue.verified).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
          Frontend-only admin
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
          Admin Preview
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slatecopy">
          No login, no database, no moderation API. This page shows how the admin surface could look
          once a backend is connected.
        </p>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={CalendarCheck2} label="Total Events" value={String(events.length)} />
        <StatsCard icon={Clock3} label="Pending Events" value={String(pendingEvents)} />
        <StatsCard icon={ShieldCheck} label="Verified Venues" value={String(verifiedVenues)} />
        <StatsCard icon={AlertTriangle} label="Reported Events" value="2" />
      </section>

      <AdminEventTable events={events} />
    </div>
  );
}
