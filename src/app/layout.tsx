import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VentureU — Startup Games for Student Founders",
    template: "%s · VentureU",
  },
  description:
    "Two fast, interactive games for student startup events: simulate a $10,000 portfolio across five historical startups, then swipe on real student pitches and see what investors actually care about.",
  keywords: [
    "student startups",
    "startup game",
    "investment simulator",
    "pitch voting",
    "university entrepreneurship",
  ],
  openGraph: {
    title: "VentureU — Startup Games",
    description:
      "Back five historical startups with $10,000. Then swipe on student pitches. Find out what kind of investor you really are.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${instrument.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
