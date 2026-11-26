import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "../baby/baby.css";

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
    absolute: "Coming soon",
  },
  description: "A baby name to be released this Saturday.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Coming soon",
    description: "A baby name to be released this Saturday.",
    url: "https://www.anupvarghese.com/babylocked",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Coming soon",
    description: "A baby name to be released this Saturday.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#c8e4f5",
  colorScheme: "light",
};

export default function BabyLockedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`baby-shell ${babyDisplay.variable} ${babyBody.variable}`}>
      {children}
    </div>
  );
}
