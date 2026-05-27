export type City = "Mağusa" | "Girne" | "Lefkoşa" | "İskele" | "Güzelyurt";

export type EventCategory =
  | "DJ Night"
  | "Club"
  | "Beach Party"
  | "Concert"
  | "Festival"
  | "Pub"
  | "University"
  | "Stand-up"
  | "Workshop";

export type EventStatus = "Active" | "Pending" | "Cancelled" | "Sold Out";

export interface Event {
  id: string;
  slug: string;
  title: string;
  venueId: string;
  venueName: string;
  city: City;
  category: EventCategory;
  date: string;
  dateISO: string;
  time: string;
  priceMin: number;
  priceMax: number;
  isFree: boolean;
  ageLimit: "18+" | "All Ages";
  description: string;
  artist: string;
  posterGradient: string;
  verified: boolean;
  featured: boolean;
  status: EventStatus;
  whatsappUrl: string;
  instagramUrl: string;
  sourceUrl: string;
  lastUpdated: string;
}

export type EventFiltersState = {
  search: string;
  city: City | "Tümü";
  category: EventCategory | "Tümü";
  date: "Tümü" | "Bugün" | "Bu Hafta Sonu" | "Bu Ay";
  price: "Tümü" | "Ücretsiz" | "Ücretli";
  age: "Tümü" | "18+";
  sort: "En Yakın Tarih" | "Fiyat Artan" | "Öne Çıkanlar";
};
