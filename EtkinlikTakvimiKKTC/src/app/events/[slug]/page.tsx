import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarPlus,
  Clock,
  ExternalLink,
  Camera,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Ticket,
  UserRoundCheck
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { EventList } from "@/components/EventList";
import { buttonClasses } from "@/components/Button";
import { events, getEventBySlug, getSimilarEvents, venues } from "@/lib/mockData";
import { formatPrice } from "@/lib/eventUtils";

type EventDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Etkinlik bulunamadı"
    };
  }

  return {
    title: event.title,
    description: `${event.title}, ${event.venueName} ${event.city}. ${event.date} ${event.time} - ${event.category}.`
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const venue = venues.find((candidate) => candidate.id === event.venueId);
  const similarEvents = getSimilarEvents(event);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[440px] overflow-hidden rounded-[2.5rem] p-6 text-white shadow-festival sm:p-8">
          <div className="absolute inset-0" style={{ background: event.posterGradient }} />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.22),transparent_50%,rgba(17,24,39,0.28))]" />
          <div className="relative z-10 flex h-full min-h-[390px] flex-col justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge category={event.category}>{event.category}</Badge>
              {event.verified ? (
                <Badge tone="verified">
                  <ShieldCheck aria-hidden="true" size={13} />
                  Verified
                </Badge>
              ) : null}
              {event.featured ? <Badge tone="pink">Featured</Badge> : null}
              <Badge status={event.status}>{event.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/78">
                {event.city} / {event.venueName}
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight sm:text-6xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        <aside className="glass-panel rounded-[2.5rem] p-6 sm:p-7">
          <h2 className="text-2xl font-black text-ink">Event Info</h2>
          <dl className="mt-5 grid gap-4">
            <InfoRow icon={MapPin} label="Venue" value={`${event.venueName}, ${event.city}`} />
            <InfoRow icon={CalendarPlus} label="Date" value={event.date} />
            <InfoRow icon={Clock} label="Time" value={event.time} />
            <InfoRow icon={Ticket} label="Price range" value={formatPrice(event)} />
            <InfoRow icon={UserRoundCheck} label="Age limit" value={event.ageLimit} />
          </dl>

          <div className="mt-6 grid gap-3">
            <a
              className={buttonClasses({ className: "w-full", variant: "primary" })}
              href={event.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={18} />
              WhatsApp Reservation
            </a>
            <a
              className={buttonClasses({ className: "w-full", variant: "secondary" })}
              href={event.instagramUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Camera aria-hidden="true" size={18} />
              Instagram
            </a>
            <button className={buttonClasses({ className: "w-full", variant: "outline" })} type="button">
              <CalendarPlus aria-hidden="true" size={18} />
              Add to Calendar
            </button>
          </div>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
            Açıklama
          </p>
          <h2 className="mt-2 text-3xl font-black text-ink">Etkinlik detayları</h2>
          <p className="mt-5 text-base leading-8 text-slatecopy">{event.description}</p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/68 p-5">
              <p className="text-sm font-black text-mutedcopy">Artist / DJ</p>
              <p className="mt-2 text-xl font-black text-ink">{event.artist}</p>
            </div>
            <div className="rounded-3xl bg-white/68 p-5">
              <p className="text-sm font-black text-mutedcopy">Last updated</p>
              <p className="mt-2 text-xl font-black text-ink">{event.lastUpdated}</p>
            </div>
          </div>

          <a
            className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full text-sm font-black text-electric-purple hover:text-neon-pink"
            href={event.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Source link placeholder
            <ExternalLink aria-hidden="true" size={16} />
          </a>
        </article>

        <aside className="grid gap-6">
          <section className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-ink">Location</h2>
            <div className="mt-4 flex min-h-56 items-center justify-center rounded-[1.75rem] border border-dashed border-cyan-blue/35 bg-gradient-to-br from-white/70 to-soft-cyan/80 text-center">
              <div>
                <MapPin aria-hidden="true" className="mx-auto text-cyan-blue" size={34} />
                <p className="mt-3 text-sm font-black text-ink">Map placeholder</p>
                <p className="mt-1 text-sm font-semibold text-slatecopy">{event.venueName}</p>
              </div>
            </div>
          </section>

          {venue ? (
            <section className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-2xl font-black text-ink">Venue</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slatecopy">{venue.address}</p>
              <Link
                className={buttonClasses({ className: "mt-5 w-full", variant: "secondary" })}
                href={`/venues/${venue.slug}`}
              >
                Mekanı Gör
              </Link>
            </section>
          ) : null}
        </aside>
      </section>

      {similarEvents.length > 0 ? (
        <section className="mt-14">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-neon-pink">
              Similar events
            </p>
            <h2 className="mt-2 text-3xl font-black text-ink">Benzer etkinlikler</h2>
          </div>
          <EventList events={similarEvents} />
        </section>
      ) : null}

      <section className="mt-10 rounded-[2rem] border border-orange-200 bg-orange-50/78 p-5 text-sm font-bold leading-6 text-orange-900">
        Etkinlik bilgileri organizatör veya mekan tarafından sağlanır. İzinler, yaş kontrolü, bilet
        ve giriş koşulları ilgili işletmenin sorumluluğundadır.
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white/70 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-pink/15 to-cyan-blue/20 text-electric-purple">
        <Icon aria-hidden="true" size={19} />
      </div>
      <div>
        <dt className="text-xs font-black uppercase tracking-[0.16em] text-mutedcopy">{label}</dt>
        <dd className="mt-1 text-base font-black text-ink">{value}</dd>
      </div>
    </div>
  );
}
