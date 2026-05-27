import Link from "next/link";
import { Camera, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import type { Venue } from "@/types/venue";
import { Badge } from "./Badge";
import { buttonClasses } from "./Button";

type VenueCardProps = {
  venue: Venue;
  upcomingCount: number;
};

export function VenueCard({ venue, upcomingCount }: VenueCardProps) {
  return (
    <article className="glass-panel festival-ring flex h-full flex-col rounded-[2rem] p-6 transition duration-200 hover:-translate-y-1 hover:shadow-festival">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink">{venue.name}</h2>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-slatecopy">
            <MapPin aria-hidden="true" size={16} />
            {venue.city}
          </p>
        </div>
        {venue.verified ? (
          <Badge tone="verified">
            <ShieldCheck aria-hidden="true" size={13} />
            Verified
          </Badge>
        ) : null}
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-slatecopy">{venue.address}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slatecopy">{venue.description}</p>

      <div className="mt-6 rounded-3xl bg-white/68 p-4">
        <p className="text-sm font-bold text-mutedcopy">Yaklaşan etkinlik</p>
        <p className="mt-1 text-3xl font-black text-ink">{upcomingCount}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          className={buttonClasses({ className: "w-full", variant: "outline" })}
          href={venue.instagramUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Camera aria-hidden="true" size={17} />
          Instagram
        </a>
        <a
          className={buttonClasses({ className: "w-full", variant: "outline" })}
          href={venue.whatsappUrl}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden="true" size={17} />
          WhatsApp
        </a>
      </div>
      <Link
        className={buttonClasses({ className: "mt-3 w-full", variant: "primary" })}
        href={`/venues/${venue.slug}`}
      >
        Mekanı Gör
      </Link>
    </article>
  );
}
