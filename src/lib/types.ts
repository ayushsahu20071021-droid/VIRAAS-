export type Gender = "women" | "men";
export type Merchant = "MYNTRA" | "AJIO" | "FLIPKART" | "SHOPSY" | "MEESHO" | "NYKAA";

export interface Product {
  id: string;
  gender: Gender;
  category: string;
  categorySlug: string;
  subcategory: string;
  title: string;
  merchant: Merchant;
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  currency: string;
  colour: string;
  secondaryColours: string[];
  fabric: string;
  pattern: string;
  embroidery: string;
  silhouette: string;
  occasion: string;
  ageSegment: string;
  styleTags: string[];
  sizes: string[];
  imageUrl: string;
  gallery: string[];
  merchantUrl: string;
  affiliateUrl: string;
  affiliateSource: string;
  tryOnEnabled: boolean;
  imagePrompt: string;
  generatedImageUrl: string;
  status: string;
  lastChecked: string;
  notes: string;
  description: string;
}

export interface CoupleLook {
  id: string;
  world: string;
  title: string;
  description: string;
  colourStory: string;
  poseDirection: string;
  imageUrl: string;
  herProductIds: string[];
  hisProductIds: string[];
  totalPrice: number;
  tags: string[];
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  dek: string;
  world: string;
  tags: string[];
  links: string[];
  body: string[];
  imageUrl: string;
  author: string;
  publishedAt: string;
}

export interface WorldMeta {
  slug: string;
  label: string;
  priority: number;
  alt: string[];
}
