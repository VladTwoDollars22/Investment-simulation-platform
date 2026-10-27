"use client";

import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Copy,
  Lightbulb,
  RotateCcw,
  Share2,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PortfolioChart } from "@/components/invest/portfolio-chart";
import { Sparkline } from "@/components/ui/sparkline";
import { buttonClass } from "@/components/ui/button";
import {
  getStartupCopy,
  STARTING_BUDGET,
  type StartupId,
} from "@/lib/invest-data";
import type { PositionResult, SimulationResult } from "@/lib/invest-sim";
import { useI18n } from "@/lib/i18n";
import { useCountUp } from "@/lib/use-count-up";
import { cn, formatCurrency, formatMultiple, percent } from "@/lib/utils";

type PositionStatusKey = "none" | "wiped" | "underwater" | "returned" | "moonshot";

function positionStatus(position: PositionResult) {
  if (position.amount === 0) {
    return {
      key: "none" as const,
      className: "bg-ink/5 text-ink/45",
      kind: "pass" as const,
    };
  }

  if (position.multiple === 0) {
    return {
      key: "wiped" as const,
      className: "bg-coral/15 text-[#b3341c]",
      kind: "loss" as const,
    };
  }

  if (position.multiple < 1) {
    return {
      key: "underwater" as const,
      className: "bg-sun/30 text-[#8a5a00]",
      kind: "loss" as const,
    };
  }

  if (position.multiple < 3) {
    return {
      key: "returned" as const,
      className: "bg-mint/60 text-[#0b6749]",
      kind: "win" as const,
    };
  }

  return {
    key: "moonshot" as const,
    className: "bg-acid text-ink",
    kind: "win" as const,
  };
}

const lessonTone = {
  positive: {
    icon: TrendingUp,
    className: "bg-mint/50",
    iconClassName: "bg-[#0b6749] text-white",
  },
  warning: {
    icon: TrendingDown,
    className: "bg-coral/10",
    iconClassName: "bg-coral text-ink",
  },
  neutral: {
    icon: Lightbulb,
    className: "bg-sky/40",
    iconClassName: "bg-grape text-white",
  },
};

export function ResultsStage({
  result,
  onRestart,
}: {
  result: SimulationResult;
  onRestart: () => void;
}) {
  const { dict, t } = useI18n();
  const copy = dict.invest.results;
  const profileCopy = dict.invest.profiles[result.profile.id];
  const animatedValue = useCountUp(result.finalValue, 1100);
  const [copied, setCopied] = useState(false);
  const won = result.finalValue >= STARTING_BUDGET;
  const hitRate =
    result.invested > 0
      ? percent(result.hitCount, result.hitCount + result.lossCount)
      : 0;
  const totalPositionValue = Math.max(0, result.finalValue - result.cash);
  const fundedCount = result.positions.filter(
    (position) => position.amount > 0,
  ).length;

  async function copyResult() {
    const summary = t("invest.results.shareText", {
      starting: formatCurrency(STARTING_BUDGET),
      final: formatCurrency(result.finalValue),
      emoji: result.profile.emoji,
      profile: profileCopy.label,
    });
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function lessonParams(lesson: SimulationResult["lessons"][number]) {
    const params: Record<string, string | number> = {};
    if (lesson.cash !== undefined) params.amount = formatCurrency(lesson.cash);
    if (lesson.count !== undefined) params.count = lesson.count;
    if (lesson.startup) {
      params.name = lesson.startup.name;
      const startupCopy = getStartupCopy(
        dict,
        lesson.startup.id as StartupId,
      );
      params.lesson = startupCopy.outcome.lesson;
    }
    return params;
  }

  return (
    <div className="shell py-8 md:py-12">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="noise relative overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-ink p-6 text-paper shadow-[6px_6px_0_0_#d6f56d] sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-grape/50 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 size-40 rounded-full bg-acid/10 blur-2xl" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-paper/60">
                <BadgeCheck className="size-3.5 text-acid" />
                {copy.report}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-paper/35">
                {t("invest.results.positions", {
                  positions: fundedCount,
                  passes: result.passCount,
                })}
              </span>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {result.profile.emoji}
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/40">
                  {copy.profile}
                </p>
                <h1 className="text-2xl font-extrabold tracking-[-0.04em]">
                  {profileCopy.label}
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-lg text-sm leading-6 text-paper/60">
              {profileCopy.blurb}
            </p>

            <div className="mt-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-paper/40">
                {copy.finalValue}
              </p>
              <p
                className={cn(
                  "mt-1 text-[clamp(3.2rem,8vw,5.5rem)] font-extrabold leading-none tabular-nums tracking-[-0.06em]",
                  won ? "text-acid" : "text-[#ff9b86]",
                )}
              >
                {formatCurrency(animatedValue)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold tabular-nums",
                    won ? "bg-acid text-ink" : "bg-coral text-ink",
                  )}
                >
                  {won ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {t("invest.results.return", {
                    roi: `${result.roi >= 0 ? "+" : ""}${result.roi.toFixed(1)}`,
                  })}
                </span>
                <span className="text-[11px] font-semibold text-paper/45">
                  {t("invest.results.vs", {
                    profit: `${result.profit >= 0 ? "+" : ""}${formatCurrency(
                      result.profit,
                    )}`,
                    starting: formatCurrency(STARTING_BUDGET),
                  })}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-paper/45">
                  <span>{copy.yourPortfolio}</span>
                  <span>{formatCurrency(result.finalValue)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      won ? "bg-acid" : "bg-coral",
                    )}
                    style={{
                      width: `${Math.min(
                        100,
                        (result.finalValue /
                          Math.max(result.finalValue, STARTING_BUDGET)) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-paper/45">
                  <span>{copy.benchmark}</span>
                  <span>{formatCurrency(STARTING_BUDGET)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white/35 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        (STARTING_BUDGET /
                          Math.max(result.finalValue, STARTING_BUDGET)) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-[22px] border-[1.5px] border-ink/15 bg-paper p-4 sm:p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
              {copy.deployed}
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums tracking-tight">
              {formatCurrency(result.invested)}
            </p>
            <p className="mt-1 text-[10px] font-medium text-muted">
              {t("invest.results.ofFund", {
                percent: percent(result.invested, STARTING_BUDGET),
              })}
            </p>
          </div>
          <div className="rounded-[22px] border-[1.5px] border-ink/15 bg-paper p-4 sm:p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
              {copy.cashKept}
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums tracking-tight">
              {formatCurrency(result.cash)}
            </p>
            <p className="mt-1 text-[10px] font-medium text-muted">
              {copy.neverRisk}
            </p>
          </div>
          <div className="rounded-[22px] border-[1.5px] border-ink/15 bg-paper p-4 sm:p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
              {copy.hitRate}
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums tracking-tight">
              {hitRate}%
            </p>
            <p className="mt-1 text-[10px] font-medium text-muted">
              {t("invest.results.fundedOf", {
                hits: result.hitCount,
                total: result.hitCount + result.lossCount,
              })}
            </p>
          </div>
          <div className="rounded-[22px] border-[1.5px] border-ink/15 bg-paper p-4 sm:p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
              {copy.bestCall}
            </p>
            <p className="mt-1 truncate text-lg font-extrabold tracking-tight">
              {result.best ? result.best.startup.name : copy.none}
            </p>
            <p className="mt-1 text-[10px] font-medium text-muted">
              {result.best
                ? formatMultiple(result.best.multiple)
                : copy.noPositionsTaken}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-between gap-3 rounded-[22px] border-[1.5px] border-ink bg-acid p-4 sm:p-5">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-ink/55">
                {copy.truth}
              </p>
              <p className="mt-1 text-sm font-bold leading-5">
                {result.worst && result.worst.multiple === 0
                  ? t("invest.results.zero", {
                      name: result.worst.startup.name,
                    })
                  : result.cash > 4_000
                    ? copy.protected
                    : copy.full}
              </p>
            </div>
            <Trophy className="hidden size-8 shrink-0 text-ink/20 sm:block" />
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-4 sm:p-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
            <h2 className="text-sm font-extrabold tracking-tight">
              {copy.trajectory}
            </h2>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              {copy.yearRange}
            </span>
          </div>
          <PortfolioChart values={result.series} />
        </div>

        <div className="space-y-4">
          <div className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5">
            <h2 className="text-sm font-extrabold tracking-tight">{copy.where}</h2>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-ink/5">
              <div
                className="bg-grape"
                style={{
                  width: `${percent(
                    totalPositionValue,
                    Math.max(result.finalValue, 1),
                  )}%`,
                }}
              />
              <div
                className="bg-ink/25"
                style={{
                  width: `${percent(result.cash, Math.max(result.finalValue, 1))}%`,
                }}
              />
            </div>
            <dl className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-full bg-grape" />
                  {copy.positionValue}
                </dt>
                <dd className="font-extrabold tabular-nums">
                  {formatCurrency(totalPositionValue)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-full bg-ink/25" />
                  {copy.cashKept}
                </dt>
                <dd className="font-extrabold tabular-nums">
                  {formatCurrency(result.cash)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5">
            <h2 className="text-sm font-extrabold tracking-tight">
              {copy.dealCard}
            </h2>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                  {copy.bestDecision}
                </p>
                <p className="mt-0.5 text-sm font-extrabold">
                  {result.best
                    ? `${result.best.startup.emoji} ${result.best.startup.name}`
                    : copy.noFunded}
                </p>
                {result.best && (
                  <p className="text-[10px] font-medium text-muted">
                    {formatCurrency(result.best.amount)} →{" "}
                    {formatCurrency(result.best.value)} (
                    {formatMultiple(result.best.multiple)})
                  </p>
                )}
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                  {copy.toughest}
                </p>
                <p className="mt-0.5 text-sm font-extrabold">
                  {result.worst
                    ? `${result.worst.startup.emoji} ${result.worst.startup.name}`
                    : copy.noFunded}
                </p>
                {result.worst && (
                  <p className="text-[10px] font-medium text-muted">
                    {formatCurrency(result.worst.amount)} →{" "}
                    {formatCurrency(result.worst.value)} (
                    {formatMultiple(result.worst.multiple)})
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-grape">
              {copy.receipts}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">
              {copy.everyDecision}
            </h2>
          </div>
          <p className="text-[11px] font-medium text-muted">{copy.tap}</p>
        </div>

        <div className="mt-4 overflow-hidden rounded-[24px] border-[1.5px] border-ink/15 bg-paper">
          {result.positions.map((position) => {
            const status = positionStatus(position);
            const startupCopy = getStartupCopy(
              dict,
              position.startup.id as StartupId,
            );

            return (
              <details
                key={position.startup.id}
                className="group border-b border-ink/10 last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none flex-col gap-3 px-4 py-4 transition-colors hover:bg-cream/60 sm:grid sm:grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr_auto] sm:items-center sm:gap-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-xl text-lg"
                      style={{ backgroundColor: position.startup.look.chip }}
                    >
                      {position.startup.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">
                        {position.startup.name}
                      </p>
                      <p className="text-[10px] font-medium text-muted">
                        {position.startup.founded} · {startupCopy.sector}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted sm:hidden">
                      {copy.invested}
                    </span>
                    <span className="text-xs font-bold tabular-nums">
                      {position.amount > 0
                        ? formatCurrency(position.amount)
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted sm:hidden">
                      {copy.outcome}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold tabular-nums",
                        position.multiple >= 1
                          ? "text-[#0b6749]"
                          : position.amount > 0
                            ? "text-coral"
                            : "text-ink/45",
                      )}
                    >
                      {formatMultiple(position.multiple)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted sm:hidden">
                      {copy.returned}
                    </span>
                    <span className="text-xs font-bold tabular-nums">
                      {position.amount > 0
                        ? formatCurrency(position.value)
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider",
                        status.className,
                      )}
                    >
                      {copy.status[status.key as PositionStatusKey]}
                    </span>
                    <ChevronDown className="size-4 shrink-0 text-ink/30 transition-transform group-open:rotate-180" />
                  </div>
                </summary>

                <div className="grid gap-4 bg-cream/50 px-4 pb-5 pt-1 sm:grid-cols-[1.4fr_0.6fr] sm:px-5">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
                        {copy.whatHappened}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink/70">
                        <strong className="font-extrabold text-ink">
                          {startupCopy.outcome.headline}.
                        </strong>{" "}
                        {startupCopy.outcome.summary}
                      </p>
                    </div>
                    <div className="rounded-xl border-l-2 border-grape bg-white/60 px-3 py-2.5">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-grape">
                        {copy.lesson}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-ink/70">
                        {startupCopy.outcome.lesson}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
                      {copy.trajectoryLabel}
                    </p>
                    <Sparkline
                      values={position.startup.timeline}
                      stroke={
                        position.multiple >= 1 ? "#0b6749" : "#d33d27"
                      }
                      fill={
                        position.multiple >= 1
                          ? "rgba(11, 103, 73, 0.12)"
                          : "rgba(211, 61, 39, 0.1)"
                      }
                      className="mt-2 h-14"
                    />
                    <div className="mt-2 flex justify-between text-[9px] font-bold text-muted">
                      <span>{copy.start}</span>
                      <span>{copy.year5}</span>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-grape" />
          <h2 className="text-2xl font-extrabold tracking-[-0.04em]">
            {copy.teaches}
          </h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.lessons.map((lesson) => {
            const tone = lessonTone[lesson.tone];
            const Icon = tone.icon;
            const params = lessonParams(lesson);

            return (
              <div
                key={lesson.id}
                className="rounded-[22px] border-[1.5px] border-ink/15 bg-paper p-5"
              >
                <div
                  className={cn(
                    "grid size-9 place-items-center rounded-xl",
                    tone.iconClassName,
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <h3 className="mt-4 text-sm font-extrabold tracking-tight">
                  {t(`invest.lessons.${lesson.id}.title`, params)}
                </h3>
                <p className="mt-2 text-xs leading-5 text-ink/60">
                  {t(`invest.lessons.${lesson.id}.body`, params)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[26px] border-[1.5px] border-ink bg-ink p-6 text-paper sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-acid">
            {copy.nextMove}
          </p>
          <p className="mt-1 text-xl font-extrabold tracking-tight">
            {copy.nextTitle}
          </p>
          <p className="mt-1 text-xs text-paper/50">{copy.nextBody}</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button
            type="button"
            onClick={onRestart}
            className={buttonClass({
              variant: "outline",
              size: "md",
              className:
                "border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper hover:shadow-none",
            })}
          >
            <RotateCcw className="size-4" />
            {copy.runBack}
          </button>
          <Link
            href="/pitch"
            className={buttonClass({ variant: "acid", size: "md" })}
          >
            {copy.founderTinder}
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={copyResult}
            className={buttonClass({
              variant: "ghost",
              size: "md",
              className: "text-paper hover:bg-paper/10",
            })}
          >
            {copied ? (
              <>
                <Copy className="size-4 text-acid" />
                {copy.copied}
              </>
            ) : (
              <>
                <Share2 className="size-4" />
                {copy.share}
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
