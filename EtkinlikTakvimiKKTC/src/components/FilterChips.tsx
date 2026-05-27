import Link from "next/link";
import { Music2, PartyPopper, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/eventUtils";

const chips = [
  { label: "Bugün", href: "/events?date=Bug%C3%BCn" },
  { label: "Bu Hafta Sonu", href: "/events?date=Bu%20Hafta%20Sonu" },
  { label: "Mağusa", href: "/events?city=Ma%C4%9Fusa" },
  { label: "Girne", href: "/events?city=Girne" },
  { label: "Lefkoşa", href: "/events?city=Lefko%C5%9Fa" },
  { label: "Ücretsiz", href: "/events?price=%C3%9Ccretsiz" },
  { label: "18+", href: "/events?age=18%2B" },
  { label: "DJ Geceleri", href: "/events?category=DJ%20Night" },
  { label: "Beach Party", href: "/events?category=Beach%20Party" }
];

function ChipIcon({ label }: { label: string }) {
  if (label === "18+") {
    return <ShieldCheck aria-hidden="true" size={16} />;
  }

  if (label.includes("DJ") || label.includes("Party")) {
    return <Music2 aria-hidden="true" size={16} />;
  }

  if (label.includes("Hafta")) {
    return <PartyPopper aria-hidden="true" size={16} />;
  }

  return <Sparkles aria-hidden="true" size={16} />;
}

export function FilterChips({ className }: { className?: string }) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <div className="flex flex-wrap gap-3">
        {chips.map((chip) => (
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-4 py-2 text-sm font-extrabold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neon-pink/30 hover:text-electric-purple hover:shadow-neon"
            href={chip.href}
            key={chip.label}
          >
            <ChipIcon label={chip.label} />
            {chip.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
