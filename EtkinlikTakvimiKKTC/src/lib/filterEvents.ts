import type { Event, EventFiltersState } from "@/types/event";
import { MOCK_TODAY_ISO } from "./mockData";
import { isMockWeekend, isSameMockMonth, normalizeSearch } from "./eventUtils";

export function filterEvents(events: Event[], filters: EventFiltersState) {
  const query = normalizeSearch(filters.search);

  return events
    .filter((event) => {
      const haystack = normalizeSearch(
        `${event.title} ${event.venueName} ${event.city} ${event.category}`
      );

      const matchesSearch = query.length === 0 || haystack.includes(query);
      const matchesCity = filters.city === "Tümü" || event.city === filters.city;
      const matchesCategory = filters.category === "Tümü" || event.category === filters.category;
      const matchesPrice =
        filters.price === "Tümü" ||
        (filters.price === "Ücretsiz" ? event.isFree : !event.isFree);
      const matchesAge = filters.age === "Tümü" || event.ageLimit === filters.age;
      const matchesDate =
        filters.date === "Tümü" ||
        (filters.date === "Bugün" && event.dateISO === MOCK_TODAY_ISO) ||
        (filters.date === "Bu Hafta Sonu" && isMockWeekend(event.dateISO)) ||
        (filters.date === "Bu Ay" && isSameMockMonth(event.dateISO));

      return (
        matchesSearch &&
        matchesCity &&
        matchesCategory &&
        matchesPrice &&
        matchesAge &&
        matchesDate
      );
    })
    .sort((a, b) => {
      if (filters.sort === "Fiyat Artan") {
        return a.priceMin - b.priceMin;
      }

      if (filters.sort === "Öne Çıkanlar") {
        return Number(b.featured) - Number(a.featured) || a.dateISO.localeCompare(b.dateISO);
      }

      return a.dateISO.localeCompare(b.dateISO);
    });
}
