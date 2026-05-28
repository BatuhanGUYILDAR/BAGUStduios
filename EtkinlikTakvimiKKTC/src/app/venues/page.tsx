import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { VenueCard } from "@/components/VenueCard";
import { venues } from "@/lib/mockData";
import { getApprovedEvents } from "@/lib/server/eventStore";

export const metadata: Metadata = {
  title: "Mekanlar",
  description: "KKTC Events üzerinde doğrulanmış mekanları ve yaklaşan etkinlik sayılarını keşfet."
};

export const dynamic = "force-dynamic";

export default async function VenuesPage() {
  const events = await getApprovedEvents();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <section>
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
          <Building2 aria-hidden="true" size={17} />
          Mekan rehberi
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
          KKTC&apos;deki etkinlik mekanları
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slatecopy">
          DJ gecelerinden açık hava festivallerine kadar farklı etkinlik türleri için öne çıkan
          mekanları ve yaklaşan programlarını incele.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            upcomingCount={events.filter((event) => event.venueId === venue.id).length}
            venue={venue}
          />
        ))}
      </section>
    </div>
  );
}
