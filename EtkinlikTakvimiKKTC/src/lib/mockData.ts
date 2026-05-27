import type { City, Event, EventCategory, EventFiltersState } from "@/types/event";
import type { Venue } from "@/types/venue";

export const MOCK_TODAY_ISO = "2026-05-27";

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

export const venues: Venue[] = [
  {
    id: "venue-shamrock",
    slug: "shamrock",
    name: "Shamrock",
    city: "Mağusa",
    address: "Salamis Yolu, Mağusa",
    description:
      "Mağusa'nın öğrenci ritmini taşıyan, DJ geceleri ve canlı performanslarla öne çıkan enerjik pub-club mekanı.",
    verified: true,
    instagramUrl: "https://instagram.com/",
    whatsappUrl: "https://wa.me/905551112233"
  },
  {
    id: "venue-cage-club",
    slug: "cage-club",
    name: "Cage Club",
    city: "Girne",
    address: "Kordonboyu, Girne",
    description:
      "Premium ses sistemi, sahne ışıkları ve geç saatlere uzayan elektronik müzik programıyla Girne gece hayatının canlı duraklarından.",
    verified: true,
    instagramUrl: "https://instagram.com/",
    whatsappUrl: "https://wa.me/905552223344"
  },
  {
    id: "venue-iskele-beach-arena",
    slug: "iskele-beach-arena",
    name: "İskele Beach Arena",
    city: "İskele",
    address: "Long Beach Sahil Şeridi, İskele",
    description:
      "Gün batımı partileri, plaj sahneleri ve yaz festival programları için tasarlanmış açık hava etkinlik alanı.",
    verified: true,
    instagramUrl: "https://instagram.com/",
    whatsappUrl: "https://wa.me/905553334455"
  },
  {
    id: "venue-downtown-stage",
    slug: "downtown-stage",
    name: "Downtown Stage",
    city: "Lefkoşa",
    address: "Dereboyu, Lefkoşa",
    description:
      "Alternatif konserler, stand-up geceleri ve özel sahne performansları için merkezi, modern ve kompakt bir canlı etkinlik mekanı.",
    verified: true,
    instagramUrl: "https://instagram.com/",
    whatsappUrl: "https://wa.me/905554445566"
  },
  {
    id: "venue-magusa-student-garden",
    slug: "magusa-student-garden",
    name: "Mağusa Student Garden",
    city: "Mağusa",
    address: "Üniversite Bölgesi, Mağusa",
    description:
      "Üniversite kulüpleri, dönem açılış partileri ve sosyal buluşmalar için geniş bahçeli, rahat atmosferli etkinlik noktası.",
    verified: false,
    instagramUrl: "https://instagram.com/",
    whatsappUrl: "https://wa.me/905555556677"
  },
  {
    id: "venue-lemon-garden",
    slug: "lemon-garden",
    name: "Lemon Garden",
    city: "Güzelyurt",
    address: "Merkez Çarşı Yakını, Güzelyurt",
    description:
      "Akustik performanslar, açık mikrofon geceleri, workshop'lar ve sıcak sosyal etkinlikler için renkli bahçe mekanı.",
    verified: false,
    instagramUrl: "https://instagram.com/",
    whatsappUrl: "https://wa.me/905556667788"
  }
];

export const events: Event[] = [
  {
    id: "event-001",
    slug: "hosgeldin-yaz-gecesi",
    title: "Hoşgeldin Yaz Gecesi",
    venueId: "venue-shamrock",
    venueName: "Shamrock",
    city: "Mağusa",
    category: "DJ Night",
    date: "30 Mayıs",
    dateISO: "2026-05-30",
    time: "22:00",
    priceMin: 300,
    priceMax: 700,
    isFree: false,
    ageLimit: "18+",
    description:
      "Mağusa'da yaz sezonunun açılışını neon ışıklar, tropik kokteyller ve yüksek tempolu house setlerle kutlayan özel gece.",
    artist: "DJ Arda Vibe",
    posterGradient: "linear-gradient(135deg, #ff2daa 0%, #7c3aed 52%, #06b6d4 100%)",
    verified: true,
    featured: true,
    status: "Active",
    whatsappUrl: "https://wa.me/905551112233",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/hosgeldin-yaz-gecesi",
    lastUpdated: "27 Mayıs 2026"
  },
  {
    id: "event-002",
    slug: "neon-friday",
    title: "Neon Friday",
    venueId: "venue-cage-club",
    venueName: "Cage Club",
    city: "Girne",
    category: "Club",
    date: "31 Mayıs",
    dateISO: "2026-05-31",
    time: "23:00",
    priceMin: 400,
    priceMax: 900,
    isFree: false,
    ageLimit: "18+",
    description:
      "Girne sahilinde neon bileklikler, LED sahne görselleri ve tech-house ağırlıklı bir cuma gecesi deneyimi.",
    artist: "Mira K & Resident Crew",
    posterGradient: "linear-gradient(135deg, #111827 0%, #7c3aed 45%, #ff2daa 100%)",
    verified: true,
    featured: true,
    status: "Active",
    whatsappUrl: "https://wa.me/905552223344",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/neon-friday",
    lastUpdated: "26 Mayıs 2026"
  },
  {
    id: "event-003",
    slug: "beach-vibes-party",
    title: "Beach Vibes Party",
    venueId: "venue-iskele-beach-arena",
    venueName: "İskele Beach Arena",
    city: "İskele",
    category: "Beach Party",
    date: "1 Haziran",
    dateISO: "2026-06-01",
    time: "18:30",
    priceMin: 250,
    priceMax: 600,
    isFree: false,
    ageLimit: "18+",
    description:
      "Gün batımından geceye uzanan sahil partisi; tropical house, fire show ve plaj oyunları programda.",
    artist: "Selin Wave",
    posterGradient: "linear-gradient(135deg, #06b6d4 0%, #a3e635 50%, #f97316 100%)",
    verified: true,
    featured: true,
    status: "Active",
    whatsappUrl: "https://wa.me/905553334455",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/beach-vibes-party",
    lastUpdated: "27 Mayıs 2026"
  },
  {
    id: "event-004",
    slug: "lefkosa-live-concert",
    title: "Lefkoşa Live Concert",
    venueId: "venue-downtown-stage",
    venueName: "Downtown Stage",
    city: "Lefkoşa",
    category: "Concert",
    date: "4 Haziran",
    dateISO: "2026-06-04",
    time: "21:00",
    priceMin: 350,
    priceMax: 650,
    isFree: false,
    ageLimit: "All Ages",
    description:
      "Alternatif rock ve indie-pop repertuvarı ile şehir merkezinde sıcak, yüksek enerjili bir canlı konser.",
    artist: "Nova Band",
    posterGradient: "linear-gradient(135deg, #f97316 0%, #ff2daa 48%, #7c3aed 100%)",
    verified: true,
    featured: false,
    status: "Active",
    whatsappUrl: "https://wa.me/905554445566",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/lefkosa-live-concert",
    lastUpdated: "24 Mayıs 2026"
  },
  {
    id: "event-005",
    slug: "campus-welcome-party",
    title: "Campus Welcome Party",
    venueId: "venue-magusa-student-garden",
    venueName: "Mağusa Student Garden",
    city: "Mağusa",
    category: "University",
    date: "5 Haziran",
    dateISO: "2026-06-05",
    time: "20:00",
    priceMin: 0,
    priceMax: 0,
    isFree: true,
    ageLimit: "All Ages",
    description:
      "Yeni dönem için üniversite kulüplerinin tanışma alanları, açık sahne performansları ve sosyal oyunları bir arada.",
    artist: "Campus DJ Team",
    posterGradient: "linear-gradient(135deg, #a3e635 0%, #06b6d4 50%, #7c3aed 100%)",
    verified: false,
    featured: false,
    status: "Pending",
    whatsappUrl: "https://wa.me/905555556677",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/campus-welcome-party",
    lastUpdated: "23 Mayıs 2026"
  },
  {
    id: "event-006",
    slug: "sunset-harbor-sessions",
    title: "Sunset Harbor Sessions",
    venueId: "venue-cage-club",
    venueName: "Cage Club Terrace",
    city: "Girne",
    category: "Pub",
    date: "6 Haziran",
    dateISO: "2026-06-06",
    time: "19:30",
    priceMin: 200,
    priceMax: 450,
    isFree: false,
    ageLimit: "18+",
    description:
      "Liman manzarası eşliğinde afro-house warm-up, kokteyl menüsü ve gün batımı sonrası lounge setler.",
    artist: "Luna D",
    posterGradient: "linear-gradient(135deg, #f97316 0%, #ff2daa 54%, #06b6d4 100%)",
    verified: true,
    featured: false,
    status: "Active",
    whatsappUrl: "https://wa.me/905552223344",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/sunset-harbor-sessions",
    lastUpdated: "22 Mayıs 2026"
  },
  {
    id: "event-007",
    slug: "electro-garden-festival",
    title: "Electro Garden Festival",
    venueId: "venue-downtown-stage",
    venueName: "Downtown Stage Garden",
    city: "Lefkoşa",
    category: "Festival",
    date: "7 Haziran",
    dateISO: "2026-06-07",
    time: "17:00",
    priceMin: 600,
    priceMax: 1200,
    isFree: false,
    ageLimit: "18+",
    description:
      "İki sahne, lokal DJ line-up'ı, food court ve ışık şovlarıyla gün boyu süren şehir festivali.",
    artist: "Multiple Artists",
    posterGradient: "linear-gradient(135deg, #7c3aed 0%, #ff2daa 44%, #a3e635 100%)",
    verified: true,
    featured: true,
    status: "Sold Out",
    whatsappUrl: "https://wa.me/905554445566",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/electro-garden-festival",
    lastUpdated: "26 Mayıs 2026"
  },
  {
    id: "event-008",
    slug: "open-air-stand-up-night",
    title: "Open Air Stand-up Night",
    venueId: "venue-lemon-garden",
    venueName: "Lemon Garden",
    city: "Güzelyurt",
    category: "Stand-up",
    date: "8 Haziran",
    dateISO: "2026-06-08",
    time: "20:30",
    priceMin: 180,
    priceMax: 300,
    isFree: false,
    ageLimit: "All Ages",
    description:
      "Bahçe atmosferinde genç komedyenler, açık mikrofon bölümü ve samimi masa düzeniyle keyifli stand-up gecesi.",
    artist: "Ada Komedi Ekibi",
    posterGradient: "linear-gradient(135deg, #fff7ed 0%, #f97316 45%, #ff2daa 100%)",
    verified: false,
    featured: false,
    status: "Active",
    whatsappUrl: "https://wa.me/905556667788",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/open-air-stand-up-night",
    lastUpdated: "21 Mayıs 2026"
  },
  {
    id: "event-009",
    slug: "yoga-brunch-social",
    title: "Yoga & Brunch Social",
    venueId: "venue-iskele-beach-arena",
    venueName: "İskele Beach Arena",
    city: "İskele",
    category: "Workshop",
    date: "27 Mayıs",
    dateISO: "2026-05-27",
    time: "09:30",
    priceMin: 0,
    priceMax: 0,
    isFree: true,
    ageLimit: "All Ages",
    description:
      "Sahil kenarında başlangıç seviyesi yoga seansı, ardından sağlıklı brunch ve yeni insanlarla tanışma buluşması.",
    artist: "Nefes Studio",
    posterGradient: "linear-gradient(135deg, #ecfeff 0%, #06b6d4 48%, #a3e635 100%)",
    verified: true,
    featured: false,
    status: "Active",
    whatsappUrl: "https://wa.me/905553334455",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/yoga-brunch-social",
    lastUpdated: "27 Mayıs 2026"
  },
  {
    id: "event-010",
    slug: "retro-turkish-pop-night",
    title: "Retro Turkish Pop Night",
    venueId: "venue-downtown-stage",
    venueName: "Downtown Stage",
    city: "Lefkoşa",
    category: "Concert",
    date: "12 Haziran",
    dateISO: "2026-06-12",
    time: "22:00",
    priceMin: 250,
    priceMax: 550,
    isFree: false,
    ageLimit: "18+",
    description:
      "90'lar ve 2000'ler Türkçe pop hitleri, canlı vokal performansı ve dans pistini dolduran nostaljik bir gece.",
    artist: "Melis & Popline",
    posterGradient: "linear-gradient(135deg, #ff2daa 0%, #f97316 42%, #a3e635 100%)",
    verified: true,
    featured: false,
    status: "Active",
    whatsappUrl: "https://wa.me/905554445566",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/retro-turkish-pop-night",
    lastUpdated: "20 Mayıs 2026"
  },
  {
    id: "event-011",
    slug: "erasmus-glow-party",
    title: "Erasmus Glow Party",
    venueId: "venue-magusa-student-garden",
    venueName: "Mağusa Student Garden",
    city: "Mağusa",
    category: "University",
    date: "13 Haziran",
    dateISO: "2026-06-13",
    time: "21:30",
    priceMin: 150,
    priceMax: 350,
    isFree: false,
    ageLimit: "18+",
    description:
      "Uluslararası öğrenci toplulukları için glow paint alanı, pop hits DJ setleri ve kampüs kulüpleri tanışma masaları.",
    artist: "Erasmus Sounds",
    posterGradient: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 46%, #ff2daa 100%)",
    verified: false,
    featured: false,
    status: "Active",
    whatsappUrl: "https://wa.me/905555556677",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/erasmus-glow-party",
    lastUpdated: "19 Mayıs 2026"
  },
  {
    id: "event-012",
    slug: "acoustic-sunset-picnic",
    title: "Acoustic Sunset Picnic",
    venueId: "venue-lemon-garden",
    venueName: "Lemon Garden",
    city: "Güzelyurt",
    category: "Festival",
    date: "14 Haziran",
    dateISO: "2026-06-14",
    time: "18:00",
    priceMin: 120,
    priceMax: 280,
    isFree: false,
    ageLimit: "All Ages",
    description:
      "Akustik sahne, yerel üretici stantları, piknik alanları ve aile dostu gün batımı festival buluşması.",
    artist: "Ada Acoustic Collective",
    posterGradient: "linear-gradient(135deg, #a3e635 0%, #f97316 52%, #ff2daa 100%)",
    verified: false,
    featured: false,
    status: "Cancelled",
    whatsappUrl: "https://wa.me/905556667788",
    instagramUrl: "https://instagram.com/",
    sourceUrl: "https://example.com/acoustic-sunset-picnic",
    lastUpdated: "18 Mayıs 2026"
  }
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getVenueBySlug(slug: string) {
  return venues.find((venue) => venue.slug === slug);
}

export function getEventsByVenueId(venueId: string) {
  return events.filter((event) => event.venueId === venueId);
}

export function getSimilarEvents(event: Event, limit = 3) {
  return events
    .filter(
      (candidate) =>
        candidate.id !== event.id &&
        (candidate.city === event.city || candidate.category === event.category)
    )
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}
