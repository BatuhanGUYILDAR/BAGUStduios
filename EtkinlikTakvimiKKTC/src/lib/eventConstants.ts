import type { City, EventCategory, EventFiltersState } from "@/types/event";

export const MOCK_TODAY_ISO = "2026-05-28";

export const cities: Array<City | "Tümü"> = [
  "Tümü",
  "Mağusa",
  "Girne",
  "Lefkoşa",
  "İskele",
  "Güzelyurt"
];

export const categories: Array<EventCategory | "Tümü"> = [
  "Tümü",
  "DJ Night",
  "Club",
  "Beach Party",
  "Concert",
  "Festival",
  "Pub",
  "University",
  "Stand-up",
  "Workshop"
];

export const defaultFilters: EventFiltersState = {
  search: "",
  city: "Tümü",
  category: "Tümü",
  date: "Tümü",
  price: "Tümü",
  age: "Tümü",
  sort: "En Yakın Tarih"
};

export const cityOptions = cities.filter((city): city is City => city !== "Tümü");

export const categoryOptions = categories.filter(
  (category): category is EventCategory => category !== "Tümü"
);
