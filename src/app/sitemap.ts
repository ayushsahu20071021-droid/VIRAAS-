import type { MetadataRoute } from "next";
import { ALL_PRODUCTS, ALL_COUPLES, JOURNAL, WORLDS, TAXONOMY } from "@/lib/catalog";

const BASE = "https://viraas.example";

// Sitemap: ONLY real public pages. ONLY the 5 occasion worlds. No ghost occasion URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/women`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/men`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/couple-edit`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/accessories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/saved`, lastModified: now, changeFrequency: "weekly", priority: 0.3 },
    { url: `${BASE}/try-on`, lastModified: now, changeFrequency: "weekly", priority: 0.6 }
  ];

  const worldPages: MetadataRoute.Sitemap = WORLDS.map((w) => ({
    url: `${BASE}/occasions/${w.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: w.slug === "garba" ? 1 : 0.8
  }));

  const categoryPages: MetadataRoute.Sitemap = [
    ...TAXONOMY.womenCategories.map((c) => ({ url: `${BASE}/women/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...TAXONOMY.menCategories.map((c) => ({ url: `${BASE}/men/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 }))
  ];

  const productPages: MetadataRoute.Sitemap = ALL_PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  const couplePages: MetadataRoute.Sitemap = ALL_COUPLES.map((c) => ({
    url: `${BASE}/couple-edit/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const journalPages: MetadataRoute.Sitemap = JOURNAL.map((a) => ({
    url: `${BASE}/journal/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  const tryOnPages: MetadataRoute.Sitemap = ALL_PRODUCTS.filter((p) => p.tryOnEnabled).map((p) => ({
    url: `${BASE}/try-on/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4
  }));

  return [...staticPages, ...worldPages, ...categoryPages, ...productPages, ...couplePages, ...journalPages, ...tryOnPages];
}
