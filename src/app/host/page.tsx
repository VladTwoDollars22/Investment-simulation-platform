import type { Metadata } from "next";
import { HostDashboard } from "@/components/host/host-dashboard";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Host screen — Startup Investment Quiz",
  description:
    "Create a live quiz room, share the player QR code, keep the unlock code secret until the reveal, and keep the projector leaderboard current with REST polling.",
};

export default function HostPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HostDashboard />
      </main>
    </>
  );
}
