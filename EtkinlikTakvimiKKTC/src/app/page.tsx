import Link from "next/link";
import { CalendarClock, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { EventList } from "@/components/EventList";
import { FeaturedEventCard } from "@/components/FeaturedEventCard";
import { FilterChips } from "@/components/FilterChips";
import { HeroSection } from "@/components/HeroSection";
import { StatsCard } from "@/components/StatsCard";
import { buttonClasses } from "@/components/Button";
import { events } from "@/lib/mockData";

export default function HomePage() {
  const featuredEvents = events.filter((event) => event.featured).slice(0, 3);
  const previewEvents = [...events]
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
    .slice(0, 6);

  return (
    <>
      <HeroSection />
      <FilterChips className="-mt-4" />

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={CalendarClock} label="Aktif takvimde" value="42 Etkinlik" />
          <StatsCard
            icon={ShieldCheck}
            label="Doğrulanmış mekan"
            value="12 Doğrulanmış Mekan"
          />
          <StatsCard icon={MapPinned} label="Ada genelinde" value="5 Şehir" />
          <StatsCard icon={Sparkles} label="Platform ritmi" value="Her Gün Güncellenir" />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-neon-pink">
              Premium seçki
            </p>
            <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Featured Events</h2>
          </div>
          <Link className={buttonClasses({ variant: "secondary" })} href="/events?sort=Öne%20Çıkanlar">
            Öne çıkanları gör
          </Link>
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <FeaturedEventCard event={event} key={event.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
              Takvim akışı
            </p>
            <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Yaklaşan Etkinlikler</h2>
          </div>
          <Link className={buttonClasses({ variant: "primary" })} href="/events">
            Tüm Etkinlikleri Gör
          </Link>
        </div>
        <EventList events={previewEvents} />
      </section>
    </>
  );
}
