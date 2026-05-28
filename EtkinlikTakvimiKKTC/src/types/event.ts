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

export type EventStatus = "pending" | "approved" | "rejected";

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
  durationHours: number;
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

export type CreateEventPayload = {
  title: string;
  venueName: string;
  city: City;
  category: EventCategory;
  dateISO: string;
  time: string;
  priceMin: number;
  priceMax: number;
  durationHours?: number;
  ageLimit: Event["ageLimit"];
  description: string;
  artist?: string;
  instagramUrl?: string;
  whatsappContact?: string;
  sourceUrl?: string;
};

export type AdminEventPatch = Partial<
  Pick<
    Event,
    | "title"
    | "venueName"
    | "city"
    | "category"
    | "dateISO"
    | "time"
    | "durationHours"
    | "priceMin"
    | "priceMax"
    | "ageLimit"
    | "description"
    | "artist"
    | "verified"
    | "featured"
    | "status"
    | "instagramUrl"
    | "whatsappUrl"
    | "sourceUrl"
  >
>;
