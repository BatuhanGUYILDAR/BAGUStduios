import Link from "next/link";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import type { Event } from "@/types/event";
import { formatPrice } from "@/lib/eventUtils";
import { Badge } from "./Badge";
import { buttonClasses } from "./Button";

type FeaturedEventCardProps = {
  event: Event;
};

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  return (
    <article className="glass-panel festival-ring overflow-hidden rounded-[2rem] transition duration-200 hover:-translate-y-1 hover:shadow-festival">
      <div className="relative h-56 overflow-hidden" style={{ background: event.posterGradient }}>
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.22),transparent_52%,rgba(17,24,39,0.2))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge category={event.category}>{event.category}</Badge>
          <Badge tone="pink">
            <Sparkles aria-hidden="true" size={13} />
            Premium
          </Badge>
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
            {event.venueName}
          </p>
          <h3 className="mt-2 text-3xl font-black leading-tight">{event.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="grid gap-3 text-sm font-bold text-slatecopy">
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" size={16} />
            {event.city}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" size={16} />
            {event.date} - {event.time}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-lg font-black text-ink">{formatPrice(event)}</p>
          <Link
            className={buttonClasses({ size: "sm", variant: "primary" })}
            href={`/events/${event.slug}`}
          >
            Detay Gör
          </Link>
        </div>
      </div>
    </article>
  );
}
