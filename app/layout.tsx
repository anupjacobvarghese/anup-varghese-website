import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anupvarghese.com"),
  title: {
    default: "Anup Varghese | Strategic Advisor, Motivational Speaker & Counsellor",
    template: "%s | Anup Varghese",
  },
  description:
    "Anup Varghese helps leadership teams turn strategy into measurable impact and ambitious people find direction.",
  keywords: [
    "Anup Varghese",
    "management consultant GCC",
    "digital transformation advisor",
    "motivational speaker UAE",
    "career counsellor",
  ],
  openGraph: {
    title: "Anup Varghese — Ambition, architected.",
    description:
      "Trusted strategic advisor, motivational speaker and counsellor across the GCC and India.",
    url: "https://anupvarghese.com",
    siteName: "Anup Varghese",
    type: "website",
    images: [
      {
        url: "/media/portraits/consulting-landscape.png",
        width: 1024,
        height: 683,
        alt: "Anup Varghese, strategic advisor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anup Varghese — Ambition, architected.",
    description: "Strategic advisor, motivational speaker and counsellor.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
