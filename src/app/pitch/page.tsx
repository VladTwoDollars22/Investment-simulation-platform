import type { Metadata } from "next";
import { PitchArena } from "@/components/pitch/pitch-arena";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Founder Tinder — Pitch Voting",
  description:
    "Swipe through real student startup pitches, submit your own card, and see which niches, ask sizes, and ideas the room finds most investable.",
};

export default function PitchPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PitchArena />
      </main>
      <SiteFooter />
    </>
  );
}
