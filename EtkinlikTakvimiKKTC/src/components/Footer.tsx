import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";

const cities = ["Mağusa", "Girne", "Lefkoşa", "İskele", "Güzelyurt"];
const categories = ["DJ Nights", "Beach Party", "Concert", "Festival", "Pub", "University"];
const legal = ["Privacy Policy", "Terms", "Contact"];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/70 bg-white/38">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <section>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sunset-cta text-white shadow-neon">
              <Sparkles aria-hidden="true" size={21} />
            </span>
            <span className="text-lg font-black text-ink">KKTC Events</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slatecopy">
            KKTC&apos;deki etkinlikleri, konserleri, DJ gecelerini ve festival aktivitelerini tek
            yerde keşfet.
          </p>
          <div className="mt-5 flex gap-2">
            {[Camera, MessageCircle, Mail].map((Icon, index) => (
              <button
                aria-label={`Sosyal bağlantı ${index + 1}`}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-2xl bg-white/75 text-electric-purple shadow-sm transition hover:-translate-y-0.5"
                key={index}
                type="button"
              >
                <Icon aria-hidden="true" size={18} />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-mutedcopy">Cities</h2>
          <ul className="mt-4 space-y-3">
            {cities.map((city) => (
              <li key={city}>
                <Link
                  className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-semibold text-slatecopy hover:text-electric-purple"
                  href={`/events?city=${encodeURIComponent(city)}`}
                >
                  <MapPin aria-hidden="true" size={15} />
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-mutedcopy">
            Categories
          </h2>
          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  className="focus-ring inline-flex rounded-full text-sm font-semibold text-slatecopy hover:text-electric-purple"
                  href="/events"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-mutedcopy">Legal</h2>
          <ul className="mt-4 space-y-3">
            {legal.map((item) => (
              <li key={item}>
                <Link
                  className="focus-ring inline-flex rounded-full text-sm font-semibold text-slatecopy hover:text-electric-purple"
                  href="/"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  );
}
