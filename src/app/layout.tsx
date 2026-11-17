import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Starcup — Startup Investment Quiz",
    template: "%s · Starcup",
  },
  description:
    "A live $10,000 investment quiz across five real companies from 2015. Allocate, lock your portfolio, and unlock the 2020 result when the host reveals the code.",
  keywords: [
    "student startups",
    "startup game",
    "investment simulator",
    "investment quiz",
    "university entrepreneurship",
  ],
  openGraph: {
    title: "Starcup — Startup Investment Quiz",
    description:
      "Back five real 2015 companies with a virtual $10,000. Lock your portfolio and wait for the room to unlock what history did.",
    type: "website",
    images: [{ url: "/starcup-logo.jpg", width: 2752, height: 1536 }],
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
      <body className="flex min-h-full flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
