"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  Info,
  Quote,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { historicalStartups, type HistoricalStartup } from "@/lib/invest-data";
import type { InvestmentAmounts } from "@/lib/invest-sim";
import { cn, formatCurrency } from "@/lib/utils";

export function InvestStage({
  startup,
  roundIndex,
  amounts,
  remaining,
  onLock,
}: {
  startup: HistoricalStartup;
  roundIndex: number;
  amounts: InvestmentAmounts;
  remaining: number;
  onLock: (amount: number) => void;
}) {
  const [draft, setDraft] = useState(0);
  const max = remaining;
  const shareOfFund = Math.round((draft / 10_000) * 100);
  const shareOfRemaining = max > 0 ? Math.round((draft / max) * 100) : 0;
  const previous = historicalStartups.slice(0, roundIndex);

  const quickOptions = [0, 1_000, 2_500, 5_000]
    .filter((value) => value <= max)
    .concat(max > 0 && ![0, 1_000, 2_500, 5_000].includes(max) ? [max] : []);

  function updateDraft(nextValue: number) {
    setDraft(Math.min(Math.max(Math.round(nextValue), 0), max));
  }

  return (
    <div className="shell py-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-paper">
            Deal {roundIndex + 1} of 5
          </span>
          <span className="text-xs font-semibold text-muted">
            {startup.sector} · Founded {startup.founded}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted">
          <Wallet className="size-3.5 text-grape" />
          {formatCurrency(remaining)} available
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article
          key={startup.id}
          className="animate-fade-up overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-paper shadow-[5px_5px_0_0_#14131a]"
        >
          <div
            className="relative overflow-hidden px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-8"
            style={{
              background: `linear-gradient(135deg, ${startup.look.from}, ${startup.look.to})`,
            }}
          >
            <div className="dot-paper pointer-events-none absolute inset-0 opacity-25" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-16 place-items-center rounded-2xl border border-ink/10 bg-white/65 text-4xl shadow-sm backdrop-blur-sm sm:size-20">
                    <span aria-hidden="true">{startup.emoji}</span>
                  </div>
                  <div>
                    <span
                      className="inline-flex rounded-full border border-ink/10 bg-white/50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em]"
                      style={{ color: startup.look.ink }}
                    >
                      {startup.sector}
                    </span>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
                      Pitch deck · {startup.founded}
                    </p>
                  </div>
                </div>
                <span className="hidden rounded-full border border-ink/15 bg-white/50 px-3 py-1.5 text-[10px] font-bold text-ink/55 sm:block">
                  Pre-seed · open
                </span>
              </div>

              <h1 className="mt-6 text-[clamp(2.6rem,7vw,4.6rem)] font-extrabold leading-[0.92] tracking-[-0.06em]">
                {startup.name}
              </h1>
              <p
                className="serif-accent mt-2 max-w-xl text-xl leading-snug sm:text-2xl"
                style={{ color: startup.look.ink }}
              >
                {startup.tagline}
              </p>
            </div>
          </div>

          <div className="space-y-7 px-6 py-7 sm:px-8">
            <section>
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/45">
                The story
              </h2>
              <p className="mt-2.5 text-[15px] leading-7 text-ink/75">
                {startup.description}
              </p>
            </section>

            <section className="rounded-2xl border-l-[3px] border-grape bg-grape/[0.04] px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-grape">
                <Quote className="size-3.5" />
                What they are pitching
              </div>
              <p className="serif-accent mt-2 text-lg leading-7 text-ink/85">
                &ldquo;{startup.pitch}&rdquo;
              </p>
            </section>

            <section className="rounded-2xl border border-coral/25 bg-coral/[0.07] px-5 py-4">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b83a24]">
                <AlertTriangle className="size-3.5" />
                What could go wrong
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{startup.risk}</p>
            </section>

            <div className="flex items-start gap-2.5 border-t border-dashed border-ink/10 pt-5 text-[11px] leading-5 text-muted">
              <Info className="mt-0.5 size-3.5 shrink-0 text-grape" />
              <p>
                The outcome stays hidden until the end. Judge the business, not
                the brand you know today.
              </p>
            </div>
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onLock(draft);
            }}
            className="rounded-[26px] border-[1.5px] border-ink bg-paper p-5 shadow-[5px_5px_0_0_#14131a] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-grape">
                  Your call
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">
                  Write the cheque
                </h2>
              </div>
              <div className="grid size-10 place-items-center rounded-full bg-acid">
                <Sparkles className="size-4" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-cream p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  Available budget
                </span>
                <span className="text-sm font-extrabold tabular-nums">
                  {formatCurrency(remaining)}
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-grape transition-all duration-500"
                  style={{ width: `${100 - shareOfRemaining}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-medium text-muted">
                {formatCurrency(draft)} committed to {startup.name} ·{" "}
                {formatCurrency(max - draft)} would stay in cash
              </p>
            </div>

            <label
              htmlFor="investment-amount"
              className="mt-6 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted"
            >
              Investment amount
            </label>
            <div className="mt-2 flex items-center rounded-2xl border-[1.5px] border-ink/15 bg-white px-4 py-3 transition-colors focus-within:border-grape">
              <span className="text-2xl font-extrabold text-ink/30">$</span>
              <input
                id="investment-amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={draft.toLocaleString("en-US")}
                onChange={(event) => {
                  const digits = event.target.value.replace(/[^\d]/g, "");
                  updateDraft(digits === "" ? 0 : Number(digits));
                }}
                className="w-full bg-transparent px-2 text-3xl font-extrabold tabular-nums tracking-tight outline-none"
                aria-describedby="investment-helper"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                USD
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={max}
              step={100}
              value={draft}
              disabled={max === 0}
              onChange={(event) => updateDraft(Number(event.target.value))}
              aria-label="Investment amount slider"
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-grape disabled:cursor-not-allowed"
              style={{ accentColor: "#5438f5" }}
            />
            <div className="mt-1.5 flex justify-between text-[9px] font-bold uppercase tracking-wider text-muted">
              <span>$0</span>
              <span>{formatCurrency(max)} max</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateDraft(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
                    draft === option
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 bg-white text-ink/65 hover:border-ink/40 hover:text-ink",
                  )}
                >
                  {option === max && max !== 0
                    ? "Max"
                    : formatCurrency(option, { compact: true })}
                </button>
              ))}
            </div>

            <div
              id="investment-helper"
              className="mt-5 flex items-start gap-2 rounded-xl bg-cream/70 px-3 py-2.5 text-[10px] leading-4 text-muted"
            >
              <Check className="mt-0.5 size-3 shrink-0 text-[#167a4b]" />
              <p>
                {draft === 0
                  ? "A pass is a valid decision. Your full budget rolls into the next deal."
                  : `${shareOfFund}% of your fund, concentrated in one company. You keep ${formatCurrency(max - draft)} for later deals.`}
              </p>
            </div>

            <button
              type="submit"
              className={buttonClass({
                variant: draft > 0 ? "primary" : "outline",
                size: "lg",
                className: "mt-5 w-full",
              })}
            >
              {draft > 0
                ? `Invest ${formatCurrency(draft)}`
                : "Pass on this one"}
              <ArrowRight className="size-4" />
            </button>
          </form>

          {previous.length > 0 && (
            <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/45">
                  Portfolio so far
                </h3>
                <span className="text-[10px] font-bold text-muted">
                  {previous.length}/5 closed
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {previous.map((item) => {
                  const amount = amounts[item.id] ?? 0;
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-2 font-semibold text-ink/65">
                        <span aria-hidden="true">{item.emoji}</span>
                        {item.name}
                      </span>
                      <span
                        className={cn(
                          "font-extrabold tabular-nums",
                          amount === 0 ? "text-ink/30" : "text-ink",
                        )}
                      >
                        {amount === 0 ? "Passed" : formatCurrency(amount)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
