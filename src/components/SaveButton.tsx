"use client";

import { useEffect, useState } from "react";
import { loadSaved, toggleSaved, type SavedItem } from "@/lib/saved";

export function SaveButton({ kind, id, title, imageUrl, meta }: { kind: SavedItem["kind"]; id: string; title: string; imageUrl: string; meta?: string }) {
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const cur = loadSaved();
    setItems(cur);
    setSaved(cur.some((x) => x.kind === kind && x.id === id));
  }, [kind, id]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from Saved Looks" : "Save look"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleSaved({ kind, id, title, imageUrl, meta });
        setItems(next);
        setSaved(next.some((x) => x.kind === kind && x.id === id));
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${saved ? "border-rani bg-rani text-ivory" : "border-ink/15 bg-white/90 text-ink hover:border-rani hover:text-rani"}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 21s-7.5-4.7-9.5-9C.9 8.4 3 5 6.5 5c2 0 3.6 1.1 4.5 2.6C11.9 6.1 13.5 5 15.5 5 19 5 21.1 8.4 21.5 12c-2 4.3-9.5 9-9.5 9z" />
      </svg>
    </button>
  );
}
