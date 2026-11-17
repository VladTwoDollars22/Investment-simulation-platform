import type { Metadata } from "next";
import { FindRoom } from "@/components/play/find-room";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Join a room — Startup Investment Quiz",
  description:
    "Enter the room code from the host screen, choose a player name, and join the 2015–2020 startup investment quiz.",
};

export default function PlayLandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <FindRoom />
      </main>
    </>
  );
}
