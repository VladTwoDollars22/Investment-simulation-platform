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
import { useI18n } from "@/lib/i18n";
import {
  buildPitchInsights,
  buildVoterProfile,
  tallyFundingBuckets,
  tallyNicheVotes,
  tallyStartupVotes,
} from "@/lib/pitch-analytics";
import type { Niche, PitchCard, Vote } from "@/lib/pitch-types";
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
  const { dict, t } = useI18n();
  const copy = dict.pitch.results;
  const startupStats = tallyStartupVotes(startups, allVotes);
  const nicheStats = tallyNicheVotes(startups, allVotes);
  const buckets = tallyFundingBuckets(startups, allVotes);
  const insights = buildPitchInsights({
    startupStats,
    nicheStats,
    fundingBuckets: buckets,
  });
  const profile = buildVoterProfile({ startups, votes: allVotes, voterId });
  const archetypeCopy = profile
    ? dict.pitch.archetypes[profile.archetype.id]
    : null;

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

  const stats = [
    {
      label: copy.totalSwipes,
      value: totalVotes.toLocaleString("en-US"),
      detail: t("pitch.results.startupsOnBoard", {
        count: startups.length,
      }),
      icon: Users,
    },
    {
      label: copy.investRate,
      value: `${overallRate}%`,
      detail: t("pitch.results.yesVotes", {
        count: totalInvests.toLocaleString("en-US"),
      }),
      icon: Heart,
    },
    {
      label: copy.livePitches,
      value: liveStartups.toLocaleString("en-US"),
      detail: copy.submitted,
      icon: Sparkles,
    },
    {
      label: copy.hottestNiche,
      value: topNiche ? dict.pitch.niches[topNiche.niche] : "—",
      detail: topNiche
        ? t("pitch.results.rate", { rate: topNiche.investRate })
        : copy.noVotes,
      icon: Target,
    },
  ];

  function bucketSummary() {
    if (!bestBucket) return copy.notEnough;

    const range = dict.pitch.buckets[bestBucket.id].range;
    const key =
      bestBucket.id === "large"
        ? "bucketBestLarge"
        : bestBucket.id === "small"
          ? "bucketBestSmall"
          : "bucketBestMid";

    return t(`pitch.results.${key}`, {
      range,
      rate: bestBucket.investRate,
    });
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-2 rounded-full bg-grape" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
              {copy.spoken}
            </span>
            <span className="rounded-full border border-ink/10 bg-paper px-2 py-0.5 text-[9px] font-bold text-muted">
              {t("pitch.results.counted", { count: totalVotes })}
            </span>
            {status === "offline" && (
              <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[9px] font-bold text-[#b3341c]">
                {copy.offline}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
            {copy.title}{" "}
            <span className="serif-accent font-normal text-grape">
              {copy.titleAccent}
            </span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            {copy.body}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onVote}
            className={buttonClass({ variant: "outline", size: "sm" })}
          >
            <RotateCcw className="size-3.5" />
            {copy.swipeAgain}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={buttonClass({ variant: "primary", size: "sm" })}
          >
            <Plus className="size-3.5" />
            {copy.addPitch}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
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
                  {copy.mostInvestable}
                </h3>
              </div>
              <p className="mt-1 text-[10px] text-muted">{copy.ranked}</p>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              {t("pitch.results.startupsCount", { count: ranked.length })}
            </span>
          </div>

          {leader && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-gradient-to-r from-[#FFF9E8] to-[#F3EEFF] p-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-ink bg-acid text-lg">
                <Medal className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-grape">
                  {copy.favourite}
                </p>
                <p className="mt-0.5 truncate text-sm font-extrabold">
                  {leader.startup.emoji} {leader.startup.title}
                </p>
                <p className="truncate text-[10px] text-muted">
                  {t("pitch.results.favouriteMeta", {
                    rate: leader.investRate,
                    invests: leader.invests,
                    total: leader.total,
                  })}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                  {copy.seeking}
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
                          {dict.pitch.niches[stat.startup.niche]}
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
                            {mine === "invest" ? copy.youYes : copy.youPass}
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
                        {copy.yesVotesLabel}
                      </p>
                    </div>
                  </div>
                  {stat.total === 0 && (
                    <p className="ml-10 mt-1 text-[9px] font-medium text-muted">
                      {copy.newOnBoard}
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
              {copy.dna}
            </span>
            <BarChart3 className="size-4 text-acid" />
          </div>

          {profile && archetypeCopy ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {profile.archetype.emoji}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold tracking-[-0.03em]">
                    {archetypeCopy.label}
                  </h3>
                  <p className="text-[10px] font-semibold text-white/50">
                    {t("pitch.results.basedOn", { count: profile.votesCast })}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/70">
                {archetypeCopy.blurb}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                    {copy.yesRate}
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold tabular-nums">
                    {profile.investRate}%
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                    {copy.avgAsk}
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
                  {copy.favNiche}
                </span>
                <span className="rounded-full bg-acid px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ink">
                  {profile.favouriteNiche
                    ? dict.pitch.niches[profile.favouriteNiche]
                    : copy.noYes}
                </span>
              </div>

              {myVotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(copy.resetConfirm)) {
                      onResetVotes();
                    }
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-white/55 transition-colors hover:text-white"
                >
                  <RotateCcw className="size-3" />
                  {copy.resetVotes}
                </button>
              )}
            </>
          ) : (
            <div className="mt-4">
              <div className="grid size-12 place-items-center rounded-full bg-white/10">
                <Heart className="size-5 text-acid" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight">
                {copy.missing}
              </h3>
              <p className="mt-2 text-xs leading-5 text-white/65">
                {copy.missingBody}
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
                {copy.openDeck}
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
                {copy.nicheHeat}
              </h3>
              <p className="mt-1 text-[10px] text-muted">
                {copy.nicheHeatBody}
              </p>
            </div>
            <span className="rounded-full bg-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted">
              {copy.investRateLabel}
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
                    {dict.pitch.niches[niche.niche]}
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
                {copy.cheque}
              </h3>
              <p className="mt-1 text-[10px] text-muted">
                {copy.chequeBody}
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
                  {dict.pitch.buckets[bucket.id].range}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-muted">
                  {t("pitch.results.yes", {
                    invests: bucket.invests,
                    total: bucket.total,
                  })}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-xl bg-cream px-3 py-2.5 text-[10px] leading-4 text-ink/60">
            {bucketSummary()}
          </p>
        </section>
      </div>

      <section className="mt-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-grape" />
          <h3 className="text-lg font-extrabold tracking-[-0.03em]">
            {copy.playbook}
          </h3>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {insights.map((insight) => {
            const style = insightStyles[insight.tone];
            const Icon = style.icon;
            const params = { ...insight.params };
            if (insight.id === "nicheMoment" && typeof params.niche === "string") {
              params.niche = dict.pitch.niches[params.niche as Niche];
            }

            return (
              <div
                key={insight.id}
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
                  {t(`pitch.insights.${insight.id}.title`, params)}
                </h4>
                <p className="mt-1.5 text-[11px] leading-5 text-ink/60">
                  {t(`pitch.insights.${insight.id}.body`, params)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] border-[1.5px] border-ink bg-acid p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/55">
            {copy.keepMoving}
          </p>
          <p className="mt-1 text-lg font-extrabold tracking-tight">
            {copy.sharper}
          </p>
          <p className="mt-1 text-[10px] font-medium text-ink/55">
            {t("pitch.results.summary", {
              count: liveStartups,
              board: persistent ? copy.sharedBoard : copy.sessionBoard,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onVote}
            className={buttonClass({ variant: "dark", size: "md" })}
          >
            {copy.swipeMore}
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={buttonClass({ variant: "outline", size: "md" })}
          >
            <Plus className="size-4" />
            {copy.submitPitch}
          </button>
        </div>
      </section>

      <p className="mt-4 text-center text-[10px] leading-4 text-muted">
        {copy.footer}{" "}
        {status === "offline" && copy.footerOffline}
      </p>
    </div>
  );
}
