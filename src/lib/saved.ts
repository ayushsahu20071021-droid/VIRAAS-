"use client";
// Saved Looks — localStorage persistence. Products, couple looks, collections.
import { SHARE_TEXT } from "@/lib/share-constants";

export type SavedKind = "product" | "couple" | "collection";
export interface SavedItem {
  kind: SavedKind;
  id: string;
  title: string;
  imageUrl: string;
  meta?: string;
  savedAt: number;
}

const KEY = "viraas.saved-looks.v1";

export function loadSaved(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSaved(items: SavedItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("viraas:saved", { detail: items }));
  } catch {
    /* storage full or blocked — keep UI-only state */
  }
}

export function toggleSaved(item: Omit<SavedItem, "savedAt">): SavedItem[] {
  const items = loadSaved();
  const idx = items.findIndex((x) => x.kind === item.kind && x.id === item.id);
  if (idx >= 0) items.splice(idx, 1);
  else items.push({ ...item, savedAt: Date.now() });
  persistSaved(items);
  return items;
}

export function isSaved(items: SavedItem[], kind: SavedKind, id: string): boolean {
  return items.some((x) => x.kind === kind && x.id === id);
}

export { SHARE_TEXT };

export async function shareLook(title: string, url: string): Promise<"shared" | "copied" | "whatsapp" | "failed"> {
  const text = `${SHARE_TEXT} — ${title}`;
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: "VIRAAS", text, url });
      return "shared";
    } catch {
      /* user cancelled — fall through to copy */
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}

export function whatsappShare(title: string, url: string): string {
  const text = encodeURIComponent(`${SHARE_TEXT} — ${title} ${url}`);
  return `https://wa.me/?text=${text}`;
}
