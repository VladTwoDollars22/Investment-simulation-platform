"use client";

import {
  ArrowRight,
  FastForward,
  Pause,
  Play,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PortfolioChart } from "@/components/invest/portfolio-chart";
import { buttonClass } from "@/components/ui/button";
import {
  getStartupCopy,
  localizeStartups,
  SIMULATION_YEARS,
} from "@/lib/invest-data";
import {
  eventsForYear,
  type InvestmentAmounts,
  type SimulationResult,
} from "@/lib/invest-sim";
import { useI18n } from "@/lib/i18n";
import { cn, formatCurrency, formatMultiple } from "@/lib/utils";

export function SimulationStage({
  amounts,
  result,
  onDone,
}: {
  amounts: InvestmentAmounts;
  result: SimulationResult;
  onDone: () => void;
}) {
  const { dict, t } = useI18n();
  const copy = dict.invest.simulation;
  const [year, setYear] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || year >= SIMULATION_YEARS) return;

    const timeout = window.setTimeout(() => {
      setYear((current) => Math.min(SIMULATION_YEARS, current + 1));
    }, 1100);

    return () => window.clearTimeout(timeout);
  }, [playing, year]);

  const value = result.series[year];
  const previousValue = year > 0 ? result.series[year - 1] : result.series[0];
  const delta = value - previousValue;
  const totalDelta = value - 10_000;
  const events = eventsForYear(amounts, year);
  const startups = localizeStartups(dict);
  const funded = startups.filter(
    (startup) => (amounts[startup.id] ?? 0) > 0,
  );
  const finished = year >= SIMULATION_YEARS;
  const signedDelta = `${delta >= 0 ? "+" : ""}${formatCurrency(delta)}`;
  const signedTotal = `${totalDelta >= 0 ? "+" : ""}${formatCurrency(totalDelta)}`;

  return (
    <div className="shell py-8 md:py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-grape opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-grape" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
              {copy.live}
            </span>
          </div>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            {copy.title}{" "}
            <span className="serif-accent font-normal text-grape">
              {copy.titleAccent}
            </span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            {copy.body}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!finished && (
            <>
              <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                className={buttonClass({
                  variant: "outline",
                  size: "sm",
                })}
              >
                {playing ? (
                  <>
                    <Pause className="size-3.5" /> {copy.pause}
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" /> {copy.play}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setYear(SIMULATION_YEARS);
                  setPlaying(false);
                }}
                className={buttonClass({ variant: "ghost", size: "sm" })}
              >
                <FastForward className="size-3.5" />
                {copy.skip}
              </button>
            </>
          )}
          {finished && (
            <button
              type="button"
              onClick={onDone}
              className={buttonClass({ variant: "primary", size: "md" })}
            >
              {copy.seeBreakdown}
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[0.85fr_1.35fr]">
        <div className="relative overflow-hidden rounded-[26px] border-[1.5px] border-ink bg-ink p-6 text-paper shadow-[5px_5px_0_0_#d6f56d] sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-grape/40 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-paper/45">
                {copy.portfolioValue}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider",
                  finished && totalDelta >= 0
                    ? "bg-acid text-ink"
                    : finished
                      ? "bg-coral text-ink"
                      : "bg-white/10 text-paper/70",
                )}
              >
                {t("invest.simulation.yearOf", { year })}
              </span>
            </div>

            <p className="mt-4 text-[clamp(2.7rem,7vw,4.2rem)] font-extrabold leading-none tabular-nums tracking-[-0.05em]">
              {formatCurrency(value)}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                  delta >= 0
                    ? "bg-[#1c5a40] text-[#c7ffd9]"
                    : "bg-[#5b241c] text-[#ffd4c9]",
                )}
              >
                {delta >= 0 ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {year === 0
                  ? copy.startingPosition
                  : t("invest.simulation.thisYear", { amount: signedDelta })}
              </span>
              {year > 0 && (
                <span className="text-[10px] font-semibold text-paper/40">
                  {t("invest.simulation.sinceDayOne", { amount: signedTotal })}
                </span>
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-paper/40">
                <span>{copy.timeline}</span>
                <span>{t("invest.simulation.yearsOf", { year })}</span>
              </div>
              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                {Array.from({ length: SIMULATION_YEARS }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors duration-500",
                      index < year ? "bg-acid" : "bg-white/15",
                    )}
                  />
                ))}
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-paper/40">
                  {copy.deployed}
                </dt>
                <dd className="mt-1 text-base font-extrabold tabular-nums">
                  {formatCurrency(result.invested)}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-paper/40">
                  {copy.cashLeft}
                </dt>
                <dd className="mt-1 text-base font-extrabold tabular-nums">
                  {formatCurrency(result.cash)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold tracking-tight">
              {copy.trajectory}
            </h2>
            <span className="rounded-full bg-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted">
              {copy.start10k}
            </span>
          </div>
          <PortfolioChart values={result.series} visible={year + 1} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight">
              {year === 0
                ? copy.startingGun
                : t("invest.simulation.whatHappened", { year })}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {t("invest.simulation.events", { count: events.length })}
            </span>
          </div>

          {year === 0 ? (
            <div className="mt-4 rounded-2xl bg-cream p-4 text-sm leading-6 text-ink/65">
              {t("invest.simulation.startBody", {
                amount: formatCurrency(10_000),
              })}
            </div>
          ) : events.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {events.map((event) => {
                const eventCopy = getStartupCopy(dict, event.startup.id);

                return (
                  <li
                    key={`${event.startup.id}-${event.year}`}
                    className="animate-fade-up flex items-start gap-3 rounded-2xl border border-ink/10 bg-white/60 p-3.5"
                  >
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-xl text-base"
                      style={{ backgroundColor: event.startup.look.chip }}
                    >
                      {event.startup.emoji}
                    </span>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
                        {event.startup.name}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-ink/75">
                        {eventCopy.milestones[event.year - 1]}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-ink/15 p-6 text-center">
              <p className="text-sm font-semibold text-ink/55">
                {funded.length === 0 ? copy.satOut : copy.quiet}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[26px] border-[1.5px] border-ink/15 bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight">
              {copy.positions}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {t("invest.simulation.funded", { count: funded.length })}
            </span>
          </div>

          {funded.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {funded.map((startup) => {
                const amount = amounts[startup.id] ?? 0;
                const multiple = startup.timeline[year];
                const positionValue = amount * multiple;
                return (
                  <li
                    key={startup.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-cream/70"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="text-base" aria-hidden="true">
                        {startup.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold">
                          {startup.name}
                        </p>
                        <p className="text-[10px] text-muted">
                          {t("invest.simulation.invested", {
                            amount: formatCurrency(amount),
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-xs font-extrabold tabular-nums",
                          multiple === 0 && year > 0
                            ? "text-coral"
                            : "text-ink",
                        )}
                      >
                        {formatCurrency(positionValue)}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                        {t("invest.simulation.value", {
                          multiple: formatMultiple(multiple),
                        })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-ink/15 p-6 text-center">
              <p className="text-sm font-semibold text-ink/55">
                {t("invest.simulation.noPositions", {
                  amount: formatCurrency(10_000),
                })}
              </p>
            </div>
          )}

          {result.cash > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-cream px-3 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {copy.uninvested}
              </span>
              <span className="text-xs font-extrabold tabular-nums">
                {formatCurrency(result.cash)}
              </span>
            </div>
          )}
        </div>
      </div>

      {finished && (
        <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-[24px] border-[1.5px] border-ink bg-acid px-6 py-5 sm:flex-row">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/55">
              {copy.complete}
            </p>
            <p className="mt-1 text-lg font-extrabold tracking-tight">
              {t("invest.simulation.final", {
                amount: formatCurrency(result.finalValue),
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onDone}
            className={buttonClass({ variant: "dark", size: "md" })}
          >
            {copy.openResults}
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
