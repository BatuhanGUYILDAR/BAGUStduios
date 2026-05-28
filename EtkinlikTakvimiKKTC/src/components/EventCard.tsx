import Link from "next/link";
import { CalendarDays, Clock, ExternalLink, MapPin, ShieldCheck, Ticket } from "lucide-react";
import type { Event } from "@/types/event";
import { formatPrice, formatStatus } from "@/lib/eventUtils";
import { isRecentlyExpiredEvent } from "@/lib/eventLifecycle";
import { Badge } from "./Badge";
import { buttonClasses } from "./Button";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const isExpired = isRecentlyExpiredEvent(event);

  return (
    <article className="glass-panel festival-ring grid overflow-hidden rounded-[2rem] transition duration-200 hover:-translate-y-1 hover:shadow-festival md:grid-cols-[15rem_1fr] xl:grid-cols-[17rem_1fr_18rem]">
      <Link
        aria-label={`${event.title} detay sayfasını aç`}
        className="group relative min-h-56 overflow-hidden md:min-h-full"
        href={`/events/${event.slug}`}
      >
        <div className="absolute inset-0" style={{ background: event.posterGradient }} />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.24),transparent_46%,rgba(17,24,39,0.22))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge category={event.category}>{event.category}</Badge>
          {event.featured ? <Badge tone="pink">Öne Çıkan</Badge> : null}
          {isExpired ? <Badge tone="orange">Süresi doldu</Badge> : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
            {event.city}
          </p>
          <p className="mt-2 line-clamp-2 text-3xl font-black leading-tight drop-shadow">
            {event.title}
          </p>
        </div>
      </Link>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {event.verified ? (
            <Badge tone="verified">
              <ShieldCheck aria-hidden="true" size={13} />
              Verified
            </Badge>
          ) : null}
          <Badge status={event.status}>{formatStatus(event.status)}</Badge>
          {isExpired ? <Badge tone="orange">Süresi doldu</Badge> : null}
          <Badge tone={event.ageLimit === "18+" ? "orange" : "cyan"}>{event.ageLimit}</Badge>
        </div>

        <Link className="focus-ring mt-4 block rounded-2xl" href={`/events/${event.slug}`}>
          <h2 className="text-2xl font-black leading-tight text-ink transition hover:text-electric-purple">
            {event.title}
          </h2>
        </Link>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slatecopy">
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" size={16} />
            {event.venueName}, {event.city}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden="true" size={16} />
            {event.time}
          </span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slatecopy">{event.description}</p>
        {isExpired ? (
          <div className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold leading-6 text-orange-900">
            Bu etkinliğin süresi doldu. Bilgilendirme için 24 saat boyunca listede kalır.
          </div>
        ) : null}
        <p className="mt-4 text-sm font-bold text-ink">Artist / DJ: {event.artist}</p>
      </div>

      <aside className="border-t border-white/80 p-5 sm:p-6 md:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-3xl bg-white/70 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-mutedcopy">
              <CalendarDays aria-hidden="true" size={16} />
              Tarih
            </p>
            <p className="mt-1 text-xl font-black text-ink">{event.date}</p>
          </div>
          <div className="rounded-3xl bg-white/70 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-mutedcopy">
              <Ticket aria-hidden="true" size={16} />
              Giriş
            </p>
            <p className="mt-1 text-xl font-black text-ink">{formatPrice(event)}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Link
            className={buttonClasses({ className: "w-full", variant: "primary" })}
            href={`/events/${event.slug}`}
          >
            Detay Gör
            <ExternalLink aria-hidden="true" size={17} />
          </Link>
          <a
            aria-disabled={isExpired}
            className={buttonClasses({
              className: isExpired ? "w-full pointer-events-none opacity-60" : "w-full",
              variant: "secondary"
            })}
            href={isExpired ? "#" : event.whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            {isExpired ? "Süresi Doldu" : "Rezervasyon"}
          </a>
        </div>
      </aside>
    </article>
  );
}
