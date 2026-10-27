"use client";

import { BarChart3, Heart, Plus, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ResultsDashboard } from "@/components/pitch/results-dashboard";
import { SubmitForm } from "@/components/pitch/submit-form";
import { VoteDeck } from "@/components/pitch/vote-deck";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePitchBoard } from "@/lib/use-pitch-board";

type Tab = "vote" | "submit" | "results";

export function PitchArena() {
  const { dict, t } = useI18n();
  const copy = dict.pitch.arena;
  const board = usePitchBoard();
  const [tab, setTab] = useState<Tab>("vote");
  const tabs: Array<{ id: Tab; label: string; icon: typeof Heart }> = [
    { id: "vote", label: copy.vote, icon: Heart },
    { id: "submit", label: copy.submit, icon: Plus },
    { id: "results", label: copy.results, icon: BarChart3 },
  ];

  const ownIds = new Set(
    board.startups
      .filter(
        (startup) =>
          board.voterId && startup.creatorId === board.voterId,
      )
      .map((startup) => startup.id),
  );
  const deckSize = board.startups.length - ownIds.size;
  const votedIds = new Set(board.myVotes.map((vote) => vote.startupId));
  const remaining = board.startups.filter(
    (startup) => !ownIds.has(startup.id) && !votedIds.has(startup.id),
  ).length;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash !== "vote" && hash !== "submit" && hash !== "results") return;

    const timeout = window.setTimeout(() => setTab(hash), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function selectTab(nextTab: Tab) {
    setTab(nextTab);
    window.history.replaceState(null, "", `#${nextTab}`);
  }

  const statusLabel =
    board.status === "syncing"
      ? copy.statusSyncing
      : board.status === "offline"
        ? copy.statusOffline
        : board.persistent
          ? copy.statusLive
          : copy.statusSession;
  const statusDot =
    board.status === "syncing"
      ? "bg-sun"
      : board.status === "offline"
        ? "bg-coral"
        : board.persistent
          ? "bg-[#167a4b]"
          : "bg-sun";
  const StatusIcon = board.status === "offline" ? WifiOff : Wifi;

  return (
    <>
      <div className="border-b border-ink/10 bg-paper/60">
        <div className="shell flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-ink/55 transition-colors hover:text-ink"
            >
              {copy.allGames}
            </Link>
            <span
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream px-3 py-1.5 md:hidden"
              title={statusLabel}
            >
              <StatusIcon className="size-3 text-ink/45" />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">
                {statusLabel}
              </span>
            </span>
          </div>

          <div
            role="tablist"
            aria-label={copy.sections}
            className="flex w-full items-center gap-1 rounded-full border border-ink/10 bg-cream p-1 md:w-auto"
          >
            {tabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => selectTab(item.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-extrabold transition-all sm:px-4 sm:text-xs md:flex-none",
                    active
                      ? "bg-ink text-paper shadow-sm"
                      : "text-ink/55 hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{item.label}</span>
                  {item.id === "vote" && remaining > 0 && (
                    <span
                      className={cn(
                        "grid min-w-4 place-items-center rounded-full px-1 text-[8px] tabular-nums",
                        active
                          ? "bg-acid text-ink"
                          : "bg-ink/10 text-ink/60",
                      )}
                    >
                      {remaining}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream px-3 py-1.5"
              title={statusLabel}
            >
              <span className={cn("size-1.5 rounded-full", statusDot)} />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">
                {statusLabel}
              </span>
            </span>
            <span className="text-[10px] font-bold tabular-nums text-muted">
              {t("pitch.arena.swipes", { count: board.allVotes.length })}
            </span>
          </div>
        </div>
      </div>

      {board.status === "offline" && (
        <div className="border-b border-ink/10 bg-sun/25">
          <div className="shell py-2.5 text-center text-[10px] font-semibold text-ink/65 sm:text-left">
            {copy.offlineBanner}
          </div>
        </div>
      )}

      <div className="shell py-8 md:py-12">
        <div
          id="panel-vote"
          role="tabpanel"
          aria-label={copy.votePanel}
          className={tab === "vote" ? "" : "hidden"}
        >
          <VoteDeck
            startups={board.startups}
            voterId={board.voterId}
            myVotes={board.myVotes}
            status={board.status}
            active={tab === "vote"}
            onVote={board.castVote}
            onRemoveVote={board.removeVote}
            onResetVotes={board.resetVotes}
            onSeeResults={() => selectTab("results")}
            onOpenSubmit={() => selectTab("submit")}
          />
          {deckSize > 0 && (
            <p className="mt-6 text-center text-[10px] font-medium text-muted">
              {t("pitch.arena.boardSummary", {
                count: board.startups.length,
              })}
            </p>
          )}
        </div>

        <div
          id="panel-submit"
          role="tabpanel"
          aria-label={copy.submitPanel}
          className={tab === "submit" ? "" : "hidden"}
        >
          <SubmitForm
            submitStartup={board.submitStartup}
            onSeeResults={() => selectTab("results")}
          />
        </div>

        <div
          id="panel-results"
          role="tabpanel"
          aria-label={copy.resultsPanel}
          className={tab === "results" ? "" : "hidden"}
        >
          <ResultsDashboard
            startups={board.startups}
            allVotes={board.allVotes}
            myVotes={board.myVotes}
            voterId={board.voterId}
            status={board.status}
            persistent={board.persistent}
            onVote={() => selectTab("vote")}
            onSubmit={() => selectTab("submit")}
            onResetVotes={board.resetVotes}
          />
        </div>
      </div>
    </>
  );
}
