import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="kicker">404</p>
      <h1 className="heading-xl mt-3">This look moved on.</h1>
      <p className="mt-4 text-sm text-ink-soft">Only five occasion worlds exist at VIRAAS — try one of them.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Home</Link>
        <Link href="/occasions/garba" className="btn-secondary">Garba / Navratri</Link>
        <Link href="/couple-edit" className="btn-secondary">Couple Edit</Link>
      </div>
    </div>
  );
}
