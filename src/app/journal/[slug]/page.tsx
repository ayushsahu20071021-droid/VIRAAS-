import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/Img";
import { JOURNAL } from "@/lib/catalog";
import { pageMeta, articleJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return JOURNAL.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const a = JOURNAL.find((x) => x.slug === params.slug);
  if (!a) return pageMeta("Not found", "Article not found.", params.slug);
  return pageMeta(a.title, a.dek, `/journal/${a.slug}`);
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const a = JOURNAL.find((x) => x.slug === params.slug);
  if (!a) notFound();
  return (
    <article className="container-page py-12 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(a)) }} />
      <div className="mx-auto max-w-3xl">
        <p className="kicker">{a.tags.join(" · ")}</p>
        <h1 className="heading-lg mt-3">{a.title}</h1>
        <p className="mt-3 font-display text-lg italic text-ink-soft">{a.dek}</p>
        <p className="mt-3 text-xs uppercase tracking-editorial text-ink-soft">{a.author} · {a.publishedAt}</p>
        <div className="relative mt-8 overflow-hidden" style={{ aspectRatio: "16/10" }}>
          <Img src={a.imageUrl} alt={`${a.title} — editorial header`} width={1280} height={800} priority className="h-full w-full" />
        </div>
        <div className="mt-10 space-y-6">
          {a.body.map((para, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-ink-soft sm:text-base">{para}</p>
          ))}
        </div>
        <div className="mt-12 border-t border-ink/10 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-ink-soft">Shop these collections</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {a.links.map((l) => (
              <Link key={l} href={l} className="border border-ink/15 bg-white px-4 py-2 text-sm hover:border-rani hover:text-rani">
                {l.replace("/", "· ")}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <Link href="/journal" className="text-[12px] font-semibold uppercase tracking-editorial text-rani hover:underline">← All journal</Link>
        </div>
      </div>
    </article>
  );
}
