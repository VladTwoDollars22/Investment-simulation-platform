"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Home,
  Minus,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { StartupIcon } from "@/components/invest/startup-icon";
import { buttonClass } from "@/components/ui/button";
import type { UnlockResponse } from "@/lib/game-types";
import { useI18n } from "@/lib/i18n";
import {
  STARTING_BUDGET,
  type StartupCard,
  type StartupOutcome,
} from "@/lib/startup-types";
import { cn, formatCurrency, formatMultiple } from "@/lib/utils";

type ResultTone = "positive" | "negative" | "flat";

function signedPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function signedCurrency(value: number) {
  return `${value > 0 ? "+" : ""}${formatCurrency(value, {
    decimals: true,
  })}`;
}

export function ResultsStep({
  roomCode,
  playerName,
  startups,
  result,
}: {
  roomCode: string;
  playerName: string;
  startups: StartupCard[];
  result: UnlockResponse;
}) {
  const { dict, language } = useI18n();
  const copy = dict.play.results;
  const startupMap = new Map(
    startups.map((startup) => [startup.id, startup]),
  );

  const starting = result.startingBudget || STARTING_BUDGET;
  const final = result.finalBalance;
  const roi = result.roi;
  const tone: ResultTone =
    roi > 0.05 ? "positive" : roi < -0.05 ? "negative" : "flat";
  const toneLabel =
    tone === "positive"
      ? copy.positive
      : tone === "negative"
        ? copy.negative
        : copy.flatNote;
  const comparisonMax = Math.max(starting, final, 1);
  const startingWidth = (starting / comparisonMax) * 100;
  const finalWidth = (final / comparisonMax) * 100;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 backdrop-blur-md">
          {copy.room}: {roomCode}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 backdrop-blur-md">
          {copy.player}: {playerName}
        </span>
      </div>

      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1E1B4B]/60 backdrop-blur-md">
          <Trophy className="size-3 text-[#7C3AED]" />
          {copy.badge}
        </div>
        <h1 className="mt-4 text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#1E1B4B]">
          {copy.title}
          <span className="serif-accent block text-[#7C3AED]">
            {copy.titleAccent}
          </span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {copy.subtitle}
        </p>
      </div>

      <section className="mt-6 overflow-hidden rounded-[30px] border border-white/40 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] p-5 text-white shadow-[0_30px_80px_-45px_rgba(30,27,75,.8)] sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/40">
              {copy.startingLabel}
            </p>
            <p className="mt-1 text-[clamp(1.7rem,5vw,2.6rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
              {formatCurrency(starting)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
              {copy.finalLabel}
            </p>
            <p className="mt-1 text-[clamp(1.7rem,5vw,2.6rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-[#F5F3FF]">
              {formatCurrency(final, { decimals: true })}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
              <span>{copy.startingLabel}</span>
              <span>{formatCurrency(starting)}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white/25"
                style={{ width: `${startingWidth}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
              <span>{copy.finalLabel}</span>
              <span>{formatCurrency(final, { decimals: true })}</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#C4B5FD]"
                style={{ width: `${finalWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/40">
              {copy.roi}
            </p>
            <p
              className={cn(
                "mt-1 flex items-center gap-1.5 text-2xl font-extrabold tabular-nums sm:text-3xl",
                tone === "positive"
                  ? "text-[#A3E635]"
                  : tone === "negative"
                    ? "text-[#FDA4AF]"
                    : "text-white/70",
              )}
            >
              {tone === "positive" ? (
                <ArrowUpRight className="size-5" />
              ) : tone === "negative" ? (
                <ArrowDownRight className="size-5" />
              ) : (
                <Minus className="size-5" />
              )}
              {signedPercent(roi)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/40">
              {tone === "positive"
                ? copy.gain
                : tone === "negative"
                  ? copy.loss
                  : copy.flat}
            </p>
            <p className="mt-1 text-lg font-extrabold tabular-nums">
              {signedCurrency(result.profit)}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-white/45">
              {toneLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#1E1B4B]">
            {copy.breakdown}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {copy.breakdownBody}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {result.breakdown.map((row) => {
            const startup = startupMap.get(row.startupId);
            if (!startup) return null;

            const outcome: StartupOutcome = row.outcomes[language];
            const gain = row.finalValue - row.allocation;
            const gainPct =
              row.allocation > 0 ? (gain / row.allocation) * 100 : null;
            const rowTone: ResultTone =
              row.allocation === 0
                ? "flat"
                : row.multiplier2015to2020 >= 1
                  ? "positive"
                  : "negative";

            return (
              <article
                key={row.startupId}
                className="rounded-[24px] border border-white/40 bg-white/75 p-4 shadow-[0_18px_45px_-38px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-md sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-2xl"
                    style={{
                      backgroundColor: startup.look.chip,
                      color: startup.look.ink,
                    }}
                  >
                    <StartupIcon
                      icon={startup.logoIcon}
                      className="size-6"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-extrabold tracking-[-0.02em] text-[#1E1B4B]">
                      {startup.name}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {copy.multiple} {formatMultiple(row.multiplier2015to2020)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em]",
                      rowTone === "positive"
                        ? "bg-emerald-50 text-emerald-700"
                        : rowTone === "negative"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {row.allocation === 0
                      ? copy.noPosition
                      : gainPct !== null
                        ? signedPercent(gainPct)
                        : copy.flat}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/55 p-3">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                      {copy.invested}
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold tabular-nums text-[#1E1B4B]">
                      {formatCurrency(row.allocation)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                      {copy.finalValue}
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold tabular-nums text-[#1E1B4B]">
                      {formatCurrency(row.finalValue, { decimals: true })}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-extrabold",
                    rowTone === "positive"
                      ? "bg-emerald-50/80 text-emerald-700"
                      : rowTone === "negative"
                        ? "bg-rose-50/80 text-rose-700"
                        : "bg-slate-100/70 text-slate-500",
                  )}
                >
                  <span>
                    {row.allocation === 0
                      ? copy.noPosition
                      : rowTone === "positive"
                        ? copy.gain
                        : copy.loss}
                  </span>
                  <span className="tabular-nums">
                    {row.allocation === 0
                      ? formatCurrency(0)
                      : signedCurrency(gain)}
                  </span>
                </div>

                <div className="mt-3 rounded-2xl bg-white/55 p-3">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C3AED]">
                    {copy.outcome}
                  </p>
                  <p className="mt-1 text-xs font-extrabold text-[#1E1B4B]">
                    {outcome.headline}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {outcome.summary}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className={buttonClass({
            variant: "outline",
            size: "lg",
            className: "w-full sm:w-auto",
          })}
        >
          <Home className="size-4" />
          {copy.home}
        </Link>
      </div>
    </div>
  );
}


