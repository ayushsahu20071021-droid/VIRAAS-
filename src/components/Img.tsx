import Link from "next/link";
import Image from "next/image";

interface ImgProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** Optimized image element: lazy loading, explicit dimensions, responsive. */
export function Img({ src, alt, width = 1200, height = 1500, className, priority, sizes }: ImgProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      style={{ objectFit: "cover" }}
    />
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="kicker">{children}</p>;
}

export function SectionHead({ kicker, title, sub, href, cta }: { kicker: string; title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Eyebrow>{kicker}</Eyebrow>
        <h2 className="heading-lg mt-2">{title}</h2>
        {sub ? <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">{sub}</p> : null}
      </div>
      {href && cta ? (
        <Link href={href} className="text-[12px] font-semibold uppercase tracking-editorial text-rani hover:underline">
          {cta} →
        </Link>
      ) : null}
    </div>
  );
}
