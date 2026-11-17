import type { Metadata } from "next";
import { PlayGame } from "@/components/play/play-game";
import { SiteHeader } from "@/components/site-header";
import { getPlayerStartups } from "@/lib/startups";

export const instant = false;

export const metadata: Metadata = {
  title: "Play - Startup Investment Quiz",
  description:
    "Allocate a virtual $10,000 across five real 2015 companies, submit your portfolio, and unlock the 2020 result with the host code.",
};

export default async function PlayRoomPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode: rawRoomCode } = await params;
  const roomCode = rawRoomCode
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PlayGame roomCode={roomCode} startups={getPlayerStartups()} />
      </main>
    </>
  );
}

