import Link from "next/link";
import { Img } from "@/components/Img";
import { SaveButton } from "@/components/SaveButton";
import { formatINR } from "@/lib/money";
import { WORLD_LABEL, isCoupleReady } from "@/lib/catalog";
import type { CoupleLook } from "@/lib/types";

export function CoupleCard({ look, tall = true }: { look: CoupleLook; tall?: boolean }) {
  return (
    <article className="group relative overflow-hidden bg-ink text-ivory">
      <Link href={`/couple-edit/${look.id}`} className="block">
        <div className="relative" style={{ aspectRatio: tall ? "3/4" : "4/5" }}>
          <Img
            src={look.imageUrl}
            alt={`${look.title} — youthful Indian couple, ${look.colourStory}, ${look.poseDirection}, ${WORLD_LABEL[look.world] || look.world}`}
            width={1000}
            height={1333}
            className="h-full w-full transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        </div>
      </Link>
      <div className="absolute right-3 top-3 z-10">
        <SaveButton kind="couple" id={look.id} title={look.title} imageUrl={look.imageUrl} meta={look.colourStory} />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wide2 text-gold-soft">{WORLD_LABEL[look.world] || look.world}</p>
        <h3 className="mt-1 font-display text-xl leading-tight sm:text-2xl">{look.title}</h3>
        <p className="mt-1 text-xs text-ivory/80">{look.colourStory}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-600">Full look {formatINR(look.totalPrice)}</span>
          <Link href={`/couple-edit/${look.id}`} className="text-[11px] font-semibold uppercase tracking-editorial text-gold-soft hover:text-ivory">
            See the look →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CoupleGrid({ looks, cols = 4 }: { looks: CoupleLook[]; cols?: 2 | 3 | 4 }) {
  const colClass = cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${colClass}`}>
      {looks.map((l) => (
        <CoupleCard key={l.id} look={l} />
      ))}
    </div>
  );
}
