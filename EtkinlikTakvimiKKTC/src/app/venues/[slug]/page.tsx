import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Building2,
  Camera,
  MapPin,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { EventList } from "@/components/EventList";
import { buttonClasses } from "@/components/Button";
import { getEventsByVenueId, getVenueBySlug, venues } from "@/lib/mockData";

type VenueDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return venues.map((venue) => ({ slug: venue.slug }));
}

export async function generateMetadata({ params }: VenueDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    return {
      title: "Mekan bulunamadı"
    };
  }

  return {
    title: venue.name,
    description: `${venue.name}, ${venue.city}. ${venue.description}`
  };
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    notFound();
  }

  const venueEvents = getEventsByVenueId(venue.id).sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <article className="glass-panel rounded-[2.5rem] p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-neon-pink">
            <Building2 aria-hidden="true" size={17} />
            Venue profile
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-black leading-tight text-ink sm:text-6xl">{venue.name}</h1>
            {venue.verified ? (
              <Badge tone="verified">
                <ShieldCheck aria-hidden="true" size={13} />
                Verified
              </Badge>
            ) : null}
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-base font-bold text-slatecopy">
            <MapPin aria-hidden="true" size={18} />
            {venue.address}, {venue.city}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slatecopy">{venue.description}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              className={buttonClasses({ variant: "primary" })}
              href={venue.instagramUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Camera aria-hidden="true" size={18} />
              Instagram
            </a>
            <a
              className={buttonClasses({ variant: "secondary" })}
              href={venue.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={18} />
              WhatsApp
            </a>
          </div>
        </article>

        <aside className="glass-panel rounded-[2.5rem] p-6">
          <h2 className="text-2xl font-black text-ink">Map placeholder</h2>
          <div className="mt-4 flex min-h-64 items-center justify-center rounded-[1.75rem] border border-dashed border-cyan-blue/35 bg-gradient-to-br from-white/72 to-soft-cyan/80 text-center">
            <div>
              <MapPin aria-hidden="true" className="mx-auto text-cyan-blue" size={38} />
              <p className="mt-3 text-sm font-black text-ink">{venue.city}</p>
              <p className="mt-1 text-sm font-semibold text-slatecopy">{venue.address}</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
              Upcoming at this venue
            </p>
            <h2 className="mt-2 text-3xl font-black text-ink">Bu mekandaki etkinlikler</h2>
          </div>
          <p className="rounded-full bg-white/72 px-4 py-2 text-sm font-black text-slatecopy">
            {venueEvents.length} etkinlik
          </p>
        </div>
        {venueEvents.length > 0 ? (
          <EventList events={venueEvents} />
        ) : (
          <div className="glass-panel rounded-[2rem] p-8 text-center text-sm font-bold text-slatecopy">
            Bu mekan için yaklaşan etkinlik bulunmuyor.
          </div>
        )}
      </section>
    </div>
  );
}
