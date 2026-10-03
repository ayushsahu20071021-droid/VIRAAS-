import { useEffect, useState, useCallback } from 'react';

const KEY = 'viraas:saved:v1';
export type SavedItem = { kind: 'product' | 'couple' | 'tryon'; id: string; savedAt: number; image?: string };

function read(): SavedItem[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function write(items: SavedItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage full / private mode */ }
  window.dispatchEvent(new Event('viraas:saved'));
}

export function useSaved() {
  const [items, setItems] = useState<SavedItem[]>(() => (typeof window === 'undefined' ? [] : read()));
  useEffect(() => {
    const h = () => setItems(read());
    window.addEventListener('viraas:saved', h); window.addEventListener('storage', h);
    return () => { window.removeEventListener('viraas:saved', h); window.removeEventListener('storage', h); };
  }, []);
  const isSaved = useCallback((kind: SavedItem['kind'], id: string) => items.some((i) => i.kind === kind && i.id === id), [items]);
  const toggle = useCallback((kind: SavedItem['kind'], id: string, image?: string) => {
    const cur = read();
    const exists = cur.some((i) => i.kind === kind && i.id === id);
    write(exists ? cur.filter((i) => !(i.kind === kind && i.id === id)) : [{ kind, id, savedAt: Date.now(), image }, ...cur]);
  }, []);
  const remove = useCallback((kind: SavedItem['kind'], id: string) => write(read().filter((i) => !(i.kind === kind && i.id === id))), []);
  return { items, isSaved, toggle, remove };
}

export const SHARE_TEXT = 'Found my festive look on VIRAAS ✨';
export async function webShare(url: string, text = SHARE_TEXT): Promise<'shared' | 'unsupported' | 'cancelled'> {
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
  if (!nav.share) return 'unsupported';
  try { await nav.share({ title: 'VIRAAS', text, url }); return 'shared'; } catch { return 'cancelled'; }
}
export async function copyLink(url: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(url); return true; } catch { return false; }
}
export const whatsappUrl = (url: string, text = SHARE_TEXT) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
