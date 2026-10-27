import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InvestmentGame } from "@/components/invest/investment-game";

export const metadata: Metadata = {
  title: "Startup Investment Simulator",
  description:
    "Start with a virtual $10,000 and back five real historical startups. Fast-forward five years and learn what history does to your decisions.",
};

export default function InvestPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <InvestmentGame />
      </main>
      <SiteFooter />
    </>
  );
}
