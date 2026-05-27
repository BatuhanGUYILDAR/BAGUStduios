import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Music2,
  Star,
  Ticket,
  WandSparkles
} from "lucide-react";
import { buttonClasses } from "./Button";

const decor = [
  { icon: Ticket, className: "left-[4%] top-[18%] rotate-[-10deg] text-neon-pink" },
  { icon: Music2, className: "right-[9%] top-[16%] rotate-[12deg] text-electric-purple" },
  { icon: MapPin, className: "left-[12%] bottom-[18%] rotate-[8deg] text-cyan-blue" },
  { icon: Star, className: "right-[18%] bottom-[16%] rotate-[-8deg] text-festival-orange" },
  { icon: CalendarDays, className: "right-[42%] top-[9%] rotate-[7deg] text-lime-700" }
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(110deg,rgba(255,45,170,0.10),transparent_28%,rgba(6,182,212,0.12)_56%,rgba(249,115,22,0.12))]" />
      <div className="absolute inset-x-10 top-10 -z-10 h-28 rotate-[-2deg] rounded-[4rem] bg-gradient-to-r from-festival-orange/15 via-neon-pink/10 to-cyan-blue/15 blur-2xl" />
      {decor.map(({ icon: Icon, className }, index) => (
        <div
          className={`absolute hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-lg backdrop-blur md:flex ${className}`}
          key={index}
        >
          <Icon aria-hidden="true" size={22} />
        </div>
      ))}

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-extrabold text-electric-purple shadow-sm backdrop-blur">
            <WandSparkles aria-hidden="true" size={17} />
            Sunset Neon Festival modu açık
          </div>
          <h1 className="mt-7 max-w-4xl break-words text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-6xl lg:text-7xl">
            KKTC&apos;de Bugün Ne Var?
          </h1>
          <p className="mt-6 max-w-[22rem] text-lg leading-8 text-slatecopy sm:max-w-2xl sm:text-xl">
            Konserler, DJ geceleri, beach party&apos;ler, pub etkinlikleri ve festival aktiviteleri
            tek takvimde.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonClasses({
                className: "w-full max-w-[22rem] sm:w-auto",
                size: "lg",
                variant: "primary"
              })}
              href="/events"
            >
              <Ticket aria-hidden="true" size={20} />
              Etkinlikleri Keşfet
            </Link>
            <Link
              className={buttonClasses({
                className: "w-full max-w-[22rem] sm:w-auto",
                size: "lg",
                variant: "secondary"
              })}
              href="/events?date=Bu%20Hafta%20Sonu"
            >
              <CalendarDays aria-hidden="true" size={20} />
              Bu Hafta Sonu
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="relative min-h-[340px] overflow-hidden sm:min-h-[430px]">
          <div className="absolute left-0 top-6 h-60 w-[82%] rotate-[-5deg] rounded-[2.5rem] bg-gradient-to-br from-neon-pink via-electric-purple to-cyan-blue p-1 shadow-festival sm:h-72 sm:w-[78%]">
            <div className="h-full rounded-[2.35rem] border border-white/35 bg-white/12 p-5 text-white backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                  FEATURED
                </span>
                <span className="text-sm font-extrabold">30 Mayıs</span>
              </div>
              <div className="mt-24">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">
                  Mağusa
                </p>
                <p className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  Hoşgeldin Yaz Gecesi
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-0 h-60 w-[82%] rotate-[4deg] rounded-[2.5rem] bg-gradient-to-br from-festival-orange via-neon-pink to-lime-accent p-1 shadow-festival sm:h-72 sm:w-[78%]">
            <div className="h-full rounded-[2.35rem] border border-white/35 bg-white/14 p-5 text-white backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/22 px-3 py-1 text-xs font-black">
                  BEACH
                </span>
                <span className="text-sm font-extrabold">18:30</span>
              </div>
              <div className="mt-24">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  İskele
                </p>
                <p className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  Beach Vibes Party
                </p>
              </div>
            </div>
          </div>
          <div className="absolute left-[22%] top-[38%] flex h-20 w-20 rotate-[10deg] items-center justify-center rounded-[2rem] bg-white/86 text-electric-purple shadow-neon backdrop-blur sm:h-28 sm:w-28">
            <Music2 size={34} />
          </div>
        </div>
      </div>
    </section>
  );
}
