"use client";

import { useState } from "react";
import { SHARE_TEXT, shareLook, whatsappShare } from "@/lib/saved";

export function ShareBar({ title, url }: { title: string; url: string }) {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn-secondary !px-4 !py-2.5" onClick={async () => {
        const r = await shareLook(title, url);
        setStatus(r === "shared" ? "Shared." : r === "copied" ? "Link copied." : "Copy failed — try again.");
      }}>
        Share
      </button>
      <button type="button" className="btn-secondary !px-4 !py-2.5" onClick={async () => {
        await navigator.clipboard.writeText(`${SHARE_TEXT} — ${title} ${url}`);
        setStatus("Link copied.");
      }}>
        Copy Link
      </button>
      <a className="btn-secondary !px-4 !py-2.5" href={whatsappShare(title, url)} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      {status ? <span className="text-xs text-ink-soft">{status}</span> : null}
    </div>
  );
}
