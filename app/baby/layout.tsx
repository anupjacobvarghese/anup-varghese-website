import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./baby.css";

const babyDisplay = Quicksand({
  subsets: ["latin"],
  variable: "--font-baby-display",
  weight: ["500", "600", "700"],
});

const babyBody = Nunito({
  subsets: ["latin"],
  variable: "--font-baby-body",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    absolute: "A special surprise",
  },
  description: "A little game for family and friends.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "A special surprise",
    description: "A little game for family and friends.",
    url: "https://www.anupvarghese.com/baby",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "A special surprise",
    description: "A little game for family and friends.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#c8e4f5",
  colorScheme: "light",
};

export default function BabyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`baby-shell ${babyDisplay.variable} ${babyBody.variable}`}>
      {children}
    </div>
  );
}
