"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { buttonClasses } from "./Button";
import { cn } from "@/lib/eventUtils";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/events", label: "Etkinlikler" },
  { href: "/venues", label: "Mekanlar" },
  { href: "/submit-event", label: "Etkinlik Ekle" },
  { href: "/admin", label: "Admin Preview" }
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-cream/78 backdrop-blur-2xl">
      <nav
        aria-label="Ana navigasyon"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link className="focus-ring flex items-center gap-3 rounded-full" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sunset-cta text-white shadow-neon">
            <Sparkles aria-hidden="true" size={22} />
          </span>
          <span className="text-lg font-black tracking-normal text-ink">KKTC Events</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                className={cn(
                  "focus-ring rounded-full px-4 py-2 text-sm font-bold transition",
                  isActive
                    ? "bg-white text-electric-purple shadow-sm"
                    : "text-slatecopy hover:bg-white/70 hover:text-ink"
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className={buttonClasses({ size: "md", variant: "primary" })}
            href="/events?date=Bu%20Hafta%20Sonu"
          >
            <CalendarDays aria-hidden="true" size={18} />
            Bu Hafta Sonu
          </Link>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label="Menüyü aç veya kapat"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 text-ink shadow-sm lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/70 px-4 pb-4 lg:hidden">
          <div className="glass-panel mx-auto grid max-w-7xl gap-2 rounded-3xl p-3">
            {navLinks.map((link) => (
              <Link
                className="focus-ring rounded-2xl px-4 py-3 text-sm font-bold text-ink hover:bg-white/75"
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className={buttonClasses({ className: "mt-2 w-full", variant: "primary" })}
              href="/events?date=Bu%20Hafta%20Sonu"
              onClick={() => setIsOpen(false)}
            >
              <CalendarDays aria-hidden="true" size={18} />
              Bu Hafta Sonu
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
