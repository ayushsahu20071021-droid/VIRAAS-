import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://viraas.example"),
  title: {
    default: "VIRAAS — Rooted in Tradition. Designed for Now.",
    template: "%s · VIRAAS"
  },
  description:
    "VIRAAS is festive fashion discovery for young India — Garba, College Fest, Diwali, Festive Party and Traditional looks, AI virtual try-on and affiliate shopping. Discover the look. See it on you. Shop the real outfit.",
  keywords: ["Indian fashion", "Garba", "Navratri", "Diwali", "lehenga", "chaniya choli", "couple edit", "virtual try-on", "festive wear", "ethnic shirts"],
  openGraph: {
    type: "website",
    siteName: "VIRAAS",
    title: "VIRAAS — The Festive Edit '26",
    description: "Tradition, reimagined for now. Discover the look. See it on you. Shop the real outfit.",
    images: ["/images/heroes/hero-main.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "VIRAAS — Rooted in Tradition. Designed for Now.",
    description: "Festive fashion discovery, AI virtual try-on and affiliate shopping for young India.",
    images: ["/images/heroes/hero-main.jpg"]
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14100E"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
