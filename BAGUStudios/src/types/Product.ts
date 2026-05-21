export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  youtubeVideoId?: string;
  price: string;
  category: string;
  tags: string[];
  marketplaceUrl: string;
  featured: boolean;
};
