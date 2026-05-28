import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import type { EventFiltersState } from "@/types/event";
import { categories, cities } from "@/lib/eventConstants";
import { buttonClasses } from "./Button";

const dateOptions: EventFiltersState["date"][] = ["Tümü", "Bugün", "Bu Hafta Sonu", "Bu Ay"];
const priceOptions: EventFiltersState["price"][] = ["Tümü", "Ücretsiz", "Ücretli"];
const ageOptions: EventFiltersState["age"][] = ["Tümü", "18+"];
const sortOptions: EventFiltersState["sort"][] = [
  "En Yakın Tarih",
  "Fiyat Artan",
  "Öne Çıkanlar"
];

type EventFiltersProps = {
  filters: EventFiltersState;
  resultCount?: number;
};

function SelectField({
  label,
  name,
  options,
  value
}: {
  label: string;
  name: keyof EventFiltersState;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-ink">
      {label}
      <select
        className="focus-ring h-11 rounded-2xl border border-white/80 bg-white/78 px-3 text-sm font-bold text-slatecopy shadow-sm backdrop-blur"
        defaultValue={value}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EventFilters({ filters, resultCount }: EventFiltersProps) {
  return (
    <section className="sticky top-[4.75rem] z-30 -mx-4 border-y border-white/70 bg-cream/78 px-4 py-4 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <form action="/events" className="glass-panel rounded-[2rem] p-4" method="get">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
                <SlidersHorizontal aria-hidden="true" size={17} />
                Filtreler
              </p>
              <p className="mt-1 text-sm font-semibold text-slatecopy" aria-live="polite">
                {typeof resultCount === "number"
                  ? `${resultCount} etkinlik listeleniyor`
                  : "Approved etkinlikler API'den listeleniyor"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link className={buttonClasses({ size: "sm", variant: "secondary" })} href="/events">
                Temizle
              </Link>
              <button className={buttonClasses({ size: "sm", variant: "primary" })} type="submit">
                Filtrele
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_1fr]">
            <label className="grid gap-2 text-sm font-extrabold text-ink">
              Arama
              <span className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedcopy"
                  size={18}
                />
                <input
                  className="focus-ring h-11 w-full rounded-2xl border border-white/80 bg-white/78 py-2 pl-10 pr-3 text-sm font-bold text-ink shadow-sm backdrop-blur placeholder:text-mutedcopy"
                  defaultValue={filters.search}
                  name="search"
                  placeholder="Etkinlik, mekan veya şehir ara"
                  type="search"
                />
              </span>
            </label>

            <SelectField label="Şehir" name="city" options={cities} value={filters.city} />
            <SelectField
              label="Kategori"
              name="category"
              options={categories}
              value={filters.category}
            />
            <SelectField label="Tarih" name="date" options={dateOptions} value={filters.date} />
            <SelectField label="Fiyat" name="price" options={priceOptions} value={filters.price} />
            <SelectField label="Yaş" name="age" options={ageOptions} value={filters.age} />
            <SelectField
              label="Sıralama"
              name="sort"
              options={sortOptions}
              value={filters.sort}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
