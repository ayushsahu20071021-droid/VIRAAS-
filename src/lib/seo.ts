import type { Metadata } from "next";

export const SITE_NAME = "VIRAAS";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · VIRAAS`, description, url: path, siteName: SITE_NAME, images: ["/images/heroes/hero-main.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} · VIRAAS`, description }
  };
}

export function productJsonLd(p: {
  id: string; title: string; description: string; imageUrl: string; price: number; currency: string; merchant: string; brand: string; colour: string; category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    sku: p.id,
    image: p.imageUrl,
    color: p.colour,
    category: p.category,
    brand: { "@type": "Brand", name: p.brand },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency || "INR",
      seller: { "@type": "Organization", name: p.merchant },
      availability: "https://schema.org/OnlineOnly"
    }
  };
}

export function articleJsonLd(a: { title: string; dek: string; imageUrl: string; publishedAt: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    image: a.imageUrl,
    datePublished: a.publishedAt,
    author: { "@type": "Organization", name: "VIRAAS Styling Desk" },
    mainEntityOfPage: `/journal/${a.slug}`
  };
}
