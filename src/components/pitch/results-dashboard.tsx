"use client";

import {
  ArrowRight,
  BarChart3,
  Heart,
  Layers3,
  Lightbulb,
  Medal,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import {
  buildPitchInsights,
  buildVoterProfile,
  tallyFundingBuckets,
  tallyNicheVotes,
  tallyStartupVotes,
} from "@/lib/pitch-analytics";
import type { PitchCard, Vote } from "@/lib/pitch-types";
import { cn, formatCurrency, percent } from "@/lib/utils";

const insightStyles = {
  positive: {
    className: "bg-mint/40",
    icon: Heart,
    iconClassName: "bg-[#0b6749] text-white",
  },
  neutral: {
    className: "bg-sky/35",
    icon: Layers3,
    iconClassName: "bg-grape text-white",
  },
  warning: {
    className: "bg-sun/30",
    icon: Lightbulb,
    iconClassName: "bg-sun text-ink",
  },
};

export function ResultsDashboard({
  startups,
  allVotes,
  myVotes,
  voterId,
  status,
  persistent,
  onVote,
  onSubmit,
  onResetVotes,
}: {
  startups: PitchCard[];
  allVotes: Vote[];
  myVotes: Vote[];
  voterId: string | null;
  status: "syncing" | "ready" | "offline";
  persistent: boolean;
  onVote: () => void;
  onSubmit: () => void;
  onResetVotes: () => void;
}) {
  const startupStats = tallyStartupVotes(startups, allVotes);
  const nicheStats = tallyNicheVotes(startups, allVotes);
  const buckets = tallyFundingBuckets(startups, allVotes);
  const insights = buildPitchInsights({
    startupStats,
    nicheStats,
    fundingBuckets: buckets,
  });
  const profile = buildVoterProfile({ startups, votes: allVotes, voterId });

  const totalVotes = allVotes.length;
  const totalInvests = startupStats.reduce(
    (total, stat) => total + stat.invests,
    0,
  );
  const overallRate = percent(totalInvests, totalVotes);
  const liveStartups = startups.filter((startup) => !startup.demo).length;
  const topNiche = nicheStats.find((niche) => niche.total > 0);
  const ranked = [...startupStats].sort(
    (a, b) =>
      b.invests - a.invests ||
      b.investRate - a.investRate ||
      b.total - a.total ||
      a.startup.title.localeCompare(b.startup.title),
  );
  const leader = ranked.find((stat) => stat.total > 0);
  const myVoteMap = new Map(
    myVotes.map((vote) => [vote.startupId, vote.decision]),
  );
  const bestBucket = [...buckets]
    .filter((bucket) => bucket.total > 0)
    .sort((a, b) => b.investRate - a.investRate)[0];

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-2 rounded-full bg-grape" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
              The room has spoken
            </span>
            <span className="rounded-full border border-ink/10 bg-paper px-2 py-0.5 text-[9px] font-bold text-muted">
              {totalVotes} swipes counted
            </span>
            {status === "offline" && (
              <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[9px] font-bold text-[#b3341c]">
                Offline snapshot
              </span>
            )}
          </div>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
            What investors{" "}
            <span className="serif-accent font-normal text-grape">
              actually care about.
            </span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Every swipe becomes a signal. See which pitches cut through, which
            niches carry the room, and how the size of the ask changes the
            answer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onVote}
            className={buttonClass({ variant: "outline", size: "sm" })}
          >
            <RotateCcw className="size-3.5" />
            Swipe again
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={buttonClass({ variant: "primary", size: "sm" })}
          >
            <Plus className="size-3.5" />
            Add a pitch
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total swipes",
            value: totalVotes.toLocaleString("en-US"),
            detail: `${startups.length} startups on the board`,
            icon: Users,
          },
          {
            label: "Invest rate",
            value: `${overallRate}%`,
            detail: `${totalInvests.toLocaleString("en-US")} yes votes`,
            icon: Heart,
          },
          {
            label: "Live pitches",
            value: liveStartups.toLocaleString("en-US"),
            detail: "Submitted by founders",
            icon: Sparkles,
          },
          {
            label: "Hottest niche",
            value: topNiche ? topNiche.niche : "—",
            detail: topNiche
              ? `${topNiche.investRate}% invest rate`
              : "No votes yet",
            icon: Target,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[20px] border-[1.5px] border-ink/15 bg-paper p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
                  {stat.label}
                </p>
                <Icon className="size-3.5 text-grape" />
              </div>
              <p className="mt-2 truncate text-lg font-extrabold tracking-[-0.03em] sm:text-xl">
                {stat.value}
              </p>
              <p className="mt-0.5 truncate text-[9px] font-medium text-muted">
                {stat.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-grape" />
                <h3 className="text-sm font-extrabold tracking-tight">
                  Most investable pitches
                </h3>
              </div>
              <p className="mt-1 text-[10px] text-muted">
                Ranked by yes votes, with the room&apos;s invest rate.
              </p>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              {ranked.length} startups
            </span>
          </div>

          {leader && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-gradient-to-r from-[#FFF9E8] to-[#F3EEFF] p-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-ink bg-acid text-lg">
                <Medal className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-grape">
                  Room favourite
                </p>
                <p className="mt-0.5 truncate text-sm font-extrabold">
                  {leader.startup.emoji} {leader.startup.title}
                </p>
                <p className="truncate text-[10px] text-muted">
                  {leader.investRate}% invest rate · {leader.invests} yes of{" "}
                  {leader.total} swipes
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                  Seeking
                </p>
                <p className="text-xs font-extrabold tabular-nums">
                  {formatCurrency(leader.startup.fundingNeeded, {
                    compact: true,
                  })}
                </p>
              </div>
            </div>
          )}

          <ol className="mt-4 space-y-2.5">
            {ranked.map((stat, index) => {
              const mine = myVoteMap.get(stat.startup.id);
              return (
                <li
                  key={stat.startup.id}
                  className="rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-ink/10 hover:bg-cream/50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-extrabold tabular-nums",
                        index === 0
                          ? "bg-ink text-acid"
                          : "bg-cream text-ink/50",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-base"
                      style={{
                        backgroundColor: "var(--color-cream)",
                      }}
                    >
                      {stat.startup.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-xs font-extrabold">
                          {stat.startup.title}
                        </p>
                        <span className="rounded-full bg-cream px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted">
                          {stat.startup.niche}
                        </span>
                        {mine && (
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider",
                              mine === "invest"
                                ? "bg-mint text-[#0b6749]"
                                : "bg-coral/15 text-[#b3341c]",
                            )}
                          >
                            {mine === "invest" ? "You: yes" : "You: pass"}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              stat.investRate >= 60
                                ? "bg-[#0b6749]"
                                : "bg-grape",
                            )}
                            style={{ width: `${stat.investRate}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[10px] font-extrabold tabular-nums">
                          {stat.total === 0 ? "—" : `${stat.investRate}%`}
                        </span>
                      </div>
                    </div>
                    <div className="hidden w-20 text-right sm:block">
                      <p className="text-[10px] font-extrabold tabular-nums">
                        {stat.invests} / {stat.total}
                      </p>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-muted">
                        yes votes
                      </p>
                    </div>
                  </div>
                  {stat.total === 0 && (
                    <p className="ml-10 mt-1 text-[9px] font-medium text-muted">
                      New on the board — waiting for its first swipe.
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="rounded-[26px] border-[1.5px] border-ink bg-grape p-5 text-white shadow-[5px_5px_0_0_#14131a] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">
              Your investor DNA
            </span>
            <BarChart3 className="size-4 text-acid" />
          </div>

          {profile ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {profile.archetype.emoji}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold tracking-[-0.03em]">
                    {profile.archetype.label}
                  </h3>
                  <p className="text-[10px] font-semibold text-white/50">
                    Based on {profile.votesCast} swipes
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/70">
                {profile.archetype.blurb}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                    Yes rate
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold tabular-nums">
                    {profile.investRate}%
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                    Avg. ask backed
                  </p>
                  <p className="mt-0.5 text-base font-extrabold tabular-nums">
                    {profile.averageAsk > 0
                      ? formatCurrency(profile.averageAsk, { compact: true })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                  Favourite niche
                </span>
                <span className="rounded-full bg-acid px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ink">
                  {profile.favouriteNiche ?? "No yes votes"}
                </span>
              </div>

              {myVotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Clear all your votes and start the deck again?",
                      )
                    ) {
                      onResetVotes();
                    }
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-white/55 transition-colors hover:text-white"
                >
                  <RotateCcw className="size-3" />
                  Reset my votes
                </button>
              )}
            </>
          ) : (
            <div className="mt-4">
              <div className="grid size-12 place-items-center rounded-full bg-white/10">
                <Heart className="size-5 text-acid" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight">
                Your voting fingerprint is missing.
              </h3>
              <p className="mt-2 text-xs leading-5 text-white/65">
                Swipe a few pitches and we will show you whether you are a
                conviction investor, a selective skeptic, or a very tough room.
              </p>
              <button
                type="button"
                onClick={onVote}
                className={buttonClass({
                  variant: "acid",
                  size: "sm",
                  className: "mt-4",
                })}
              >
                Open the deck
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5 sm:p-6">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">
                Niche heat
              </h3>
              <p className="mt-1 text-[10px] text-muted">
                Which categories make the room lean in.
              </p>
            </div>
            <span className="rounded-full bg-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted">
              invest rate
            </span>
          </div>

          <ul className="mt-5 space-y-3.5">
            {nicheStats.map((niche, index) => (
              <li key={niche.niche}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold">
                    {index === 0 && niche.total > 0 && (
                      <Trophy className="size-3 text-grape" />
                    )}
                    {niche.niche}
                  </span>
                  <span className="text-[10px] font-extrabold tabular-nums">
                    {niche.investRate}%
                    <span className="ml-1 font-medium text-muted">
                      ({niche.invests}/{niche.total})
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      index === 0 ? "bg-grape" : "bg-grape/45",
                    )}
                    style={{ width: `${niche.investRate}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5 sm:p-6">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">
                Does cheque size matter?
              </h3>
              <p className="mt-1 text-[10px] text-muted">
                Invest rate by the amount founders asked for.
              </p>
            </div>
            <Wallet className="size-4 text-grape" />
          </div>

          <div className="mt-6 grid grid-cols-3 items-end gap-3">
            {buckets.map((bucket) => (
              <div key={bucket.id} className="text-center">
                <div className="flex h-32 items-end justify-center">
                  <div className="relative flex w-full max-w-[64px] flex-col items-center justify-end">
                    <span className="mb-1 text-[11px] font-extrabold tabular-nums">
                      {bucket.total > 0 ? `${bucket.investRate}%` : "—"}
                    </span>
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-700",
                        bucket.id === bestBucket?.id
                          ? "bg-grape"
                          : "bg-grape/30",
                      )}
                      style={{
                        height: `${Math.max(bucket.total > 0 ? 8 : 2, bucket.investRate)}px`,
                        maxHeight: "104px",
                      }}
                    />
                  </div>
                </div>
                <p className="mt-2 text-[10px] font-extrabold">
                  {bucket.range}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-muted">
                  {bucket.invests}/{bucket.total} yes
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-xl bg-cream px-3 py-2.5 text-[10px] leading-4 text-ink/60">
            {bestBucket
              ? `${bestBucket.range} pitches convert at ${bestBucket.investRate}% — ${
                  bestBucket.id === "large"
                    ? "ambition is not being penalised in this room."
                    : bestBucket.id === "small"
                      ? "lower risk is clearly attractive."
                      : "there is a sweet spot in the middle."
                }`
              : "Not enough votes yet to compare cheque sizes."}
          </p>
        </section>
      </div>

      <section className="mt-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-grape" />
          <h3 className="text-lg font-extrabold tracking-[-0.03em]">
            The room&apos;s playbook
          </h3>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {insights.map((insight) => {
            const style = insightStyles[insight.tone];
            const Icon = style.icon;
            return (
              <div
                key={insight.title}
                className={cn(
                  "rounded-[22px] border border-ink/10 p-5",
                  style.className,
                )}
              >
                <div
                  className={cn(
                    "grid size-8 place-items-center rounded-lg",
                    style.iconClassName,
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <h4 className="mt-3 text-xs font-extrabold tracking-tight">
                  {insight.title}
                </h4>
                <p className="mt-1.5 text-[11px] leading-5 text-ink/60">
                  {insight.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] border-[1.5px] border-ink bg-acid p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/55">
            Keep the room moving
          </p>
          <p className="mt-1 text-lg font-extrabold tracking-tight">
            Every swipe makes the signal sharper.
          </p>
          <p className="mt-1 text-[10px] font-medium text-ink/55">
            {liveStartups} live {liveStartups === 1 ? "pitch" : "pitches"} ·{" "}
            {persistent ? "shared live board" : "session-only board"} · demo
            cohort included
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onVote}
            className={buttonClass({ variant: "dark", size: "md" })}
          >
            Swipe more
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={buttonClass({ variant: "outline", size: "md" })}
          >
            <Plus className="size-4" />
            Submit a pitch
          </button>
        </div>
      </section>

      <p className="mt-4 text-center text-[10px] leading-4 text-muted">
        Results combine live votes with a seeded demo cohort of 32 investors.
        This is event feedback, not an investment offer.{" "}
        {status === "offline" &&
          "You are viewing an offline snapshot stored on this device."}
      </p>
    </div>
  );
}
