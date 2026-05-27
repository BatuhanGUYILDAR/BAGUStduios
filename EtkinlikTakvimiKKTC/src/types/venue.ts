import type { City } from "./event";

export interface Venue {
  id: string;
  slug: string;
  name: string;
  city: City;
  address: string;
  description: string;
  verified: boolean;
  instagramUrl: string;
  whatsappUrl: string;
}
