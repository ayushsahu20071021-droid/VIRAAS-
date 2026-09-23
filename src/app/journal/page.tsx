import Link from "next/link";
import { Img } from "@/components/Img";
import { JOURNAL } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Journal — VIRAAS Styling Desk",
  "Festive fashion articles: Garba, Navratri, College Fest, Diwali, chaniya styling, ethnic shirts, couple styling and budget edits.",
  "/journal"
);

export default function JournalPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-3xl">
        <p className="kicker">VIRAAS styling desk</p>
        <h1 className="heading-xl mt-2">JOURNAL</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          Field notes for the festive season — what works on real grounds, campuses and terraces. Every article links back into shoppable collections.
        </p>
      </header>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNAL.map((a) => (
          <Link key={a.id} href={`/journal/${a.slug}`} className="group card-surface">
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Img src={a.imageUrl} alt={`${a.title} — VIRAAS journal header`} width={900} height={675} className="h-full w-full transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <p className="text-[10px] font-semibold uppercase tracking-wide2 text-rani">{a.tags.join(" · ")}</p>
              <h2 className="mt-2 font-display text-xl leading-snug group-hover:text-rani">{a.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{a.dek}</p>
              <p className="mt-4 text-[11px] uppercase tracking-editorial text-ink-soft">Read →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
