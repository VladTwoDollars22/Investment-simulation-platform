"use client";

import { ArrowLeft, RotateCcw, Wallet } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export type GamePhase = "intro" | "invest" | "sim" | "results";

const phaseLabels: Record<GamePhase, string> = {
  intro: "Briefing",
  invest: "Deal flow",
  sim: "Simulation",
  results: "Results",
};

export function GameHud({
  phase,
  roundIndex,
  remaining,
  onRestart,
}: {
  phase: GamePhase;
  roundIndex: number;
  remaining: number;
  onRestart: () => void;
}) {
  return (
    <div className="border-b border-ink/10 bg-paper/60">
      <div className="shell flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">All games</span>
          <span className="sm:hidden">Exit</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted">
            {phaseLabels[phase]}
          </span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={
                  phase === "results" ||
                  (phase === "invest" && index < roundIndex)
                    ? "h-1.5 w-7 rounded-full bg-grape"
                    : phase === "invest" && index === roundIndex
                      ? "h-1.5 w-7 rounded-full bg-grape/35"
                      : "h-1.5 w-7 rounded-full bg-ink/10"
                }
              />
            ))}
          </div>
          {phase === "invest" && (
            <span className="text-[11px] font-bold tabular-nums text-muted">
              Round {roundIndex + 1}/5
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 items-center gap-2 rounded-full border border-ink/10 bg-cream px-3.5">
            <Wallet className="size-3.5 text-grape" />
            <span className="text-xs font-extrabold tabular-nums">
              {formatCurrency(remaining)}
            </span>
            <span className="hidden text-[9px] font-bold uppercase tracking-wider text-muted sm:inline">
              left
            </span>
          </div>
          {phase !== "intro" && (
            <button
              type="button"
              onClick={onRestart}
              aria-label="Restart the simulation"
              title="Restart simulation"
              className="grid size-9 place-items-center rounded-full border border-ink/10 bg-paper text-ink/65 transition-colors hover:border-ink/25 hover:text-ink"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
