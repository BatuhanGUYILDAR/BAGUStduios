import type { Metadata } from "next";
import { EventsClient } from "@/components/EventsClient";
import { EventFilters } from "@/components/EventFilters";
import { categories, cities, defaultFilters } from "@/lib/eventConstants";
import type { EventFiltersState } from "@/types/event";

export const metadata: Metadata = {
  title: "Etkinlikler",
  description:
    "KKTC Events üzerinde şehir, kategori, tarih, fiyat ve yaş filtresiyle etkinlikleri keşfet."
};

type EventsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const dateOptions: EventFiltersState["date"][] = ["Tümü", "Bugün", "Bu Hafta Sonu", "Bu Ay"];
const priceOptions: EventFiltersState["price"][] = ["Tümü", "Ücretsiz", "Ücretli"];
const ageOptions: EventFiltersState["age"][] = ["Tümü", "18+"];
const sortOptions: EventFiltersState["sort"][] = [
  "En Yakın Tarih",
  "Fiyat Artan",
  "Öne Çıkanlar"
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseInitialFilters(searchParams?: Record<string, string | string[] | undefined>) {
  const city = firstParam(searchParams?.city);
  const category = firstParam(searchParams?.category);
  const date = firstParam(searchParams?.date);
  const price = firstParam(searchParams?.price);
  const age = firstParam(searchParams?.age);
  const sort = firstParam(searchParams?.sort);
  const search = firstParam(searchParams?.search);

  return {
    search: search ?? defaultFilters.search,
    city: cities.includes(city as EventFiltersState["city"])
      ? (city as EventFiltersState["city"])
      : defaultFilters.city,
    category: categories.includes(category as EventFiltersState["category"])
      ? (category as EventFiltersState["category"])
      : defaultFilters.category,
    date: dateOptions.includes(date as EventFiltersState["date"])
      ? (date as EventFiltersState["date"])
      : defaultFilters.date,
    price: priceOptions.includes(price as EventFiltersState["price"])
      ? (price as EventFiltersState["price"])
      : defaultFilters.price,
    age: ageOptions.includes(age as EventFiltersState["age"])
      ? (age as EventFiltersState["age"])
      : defaultFilters.age,
    sort: sortOptions.includes(sort as EventFiltersState["sort"])
      ? (sort as EventFiltersState["sort"])
      : defaultFilters.sort
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialFilters = parseInitialFilters(resolvedSearchParams);

  return (
    <div className="pb-8">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-neon-pink">
          KKTC event calendar
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
          Etkinlikleri keşfet
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slatecopy">
          Şehir, kategori, tarih ve fiyat filtreleriyle DJ geceleri, konserler, beach party&apos;ler,
          festival aktiviteleri ve sosyal buluşmaları hızlıca bul.
        </p>
      </section>
      <div className="grid gap-8">
        <EventFilters filters={initialFilters} />
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <EventsClient filters={initialFilters} />
        </section>
      </div>
    </div>
  );
}
