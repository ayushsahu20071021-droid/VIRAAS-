"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSaved, persistSaved, shareLook, whatsappShare, type SavedItem } from "@/lib/saved";

export function SavedList() {
  const [items, setItems] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    setItems(loadSaved());
  }, []);

  if (items === null) {
    return <div className="py-8 text-sm text-ink-soft">Loading saved looks…</div>;
  }

  const hrefFor = (it: SavedItem) =>
    it.kind === "product" ? (it.id.startsWith("tryon-") ? `/product/${it.id.replace("tryon-", "")}` : `/product/${it.id}`) : it.kind === "couple" ? `/couple-edit/${it.id}` : "/";

  if (items.length === 0) {
    return (
      <div className="mt-12 border border-ink/10 bg-white p-12 text-center">
        <p className="font-display text-2xl">Nothing saved yet.</p>
        <p className="mt-2 text-sm text-ink-soft">Tap the heart on any product or couple look.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/women" className="btn-primary">Shop Women</Link>
          <Link href="/couple-edit" className="btn-secondary">Couple Edit</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={`${it.kind}-${it.id}`} className="card-surface">
          <Link href={hrefFor(it)} className="block">
            <div className="relative overflow-hidden bg-ivory-deep" style={{ aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.imageUrl} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Link>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wide2 text-rani">{it.kind}</p>
            <p className="mt-1 line-clamp-2 text-sm font-600">{it.title}</p>
            {it.meta ? <p className="mt-1 text-xs text-ink-soft">{it.meta}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="border border-ink/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:border-rani hover:text-rani"
                onClick={async () => { await shareLook(it.title, `${window.location.origin}${hrefFor(it)}`); }}
              >
                Share
              </button>
              <a
                className="border border-ink/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:border-rani hover:text-rani"
                href={whatsappShare(it.title, `${window.location.origin}${hrefFor(it)}`)}
                target="_blank" rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <button
                className="border border-ink/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:border-rani hover:text-rani"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}${hrefFor(it)}`);
                }}
              >
                Copy Link
              </button>
              <button
                className="border border-ink/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-rani hover:border-rani"
                onClick={() => {
                  const next = items.filter((x) => !(x.kind === it.kind && x.id === it.id));
                  setItems(next);
                  persistSaved(next);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
