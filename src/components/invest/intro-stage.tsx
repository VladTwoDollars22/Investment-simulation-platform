"use client";

import {
  ArrowRight,
  BadgeDollarSign,
  Clock3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { historicalStartups } from "@/lib/invest-data";

const steps = [
  {
    number: "01",
    title: "Read the pitch",
    body: "Five real startups, frozen at the moment they needed money. You see the story and the risk — never the outcome.",
  },
  {
    number: "02",
    title: "Write the cheque",
    body: "Deploy any amount from your $10,000. Go big on one bet, spread it around, or pass entirely. No take-backs.",
  },
  {
    number: "03",
    title: "Fast-forward five years",
    body: "Watch the portfolio move year by year, then unpack what history did to your decisions and why.",
  },
];

export function IntroStage({ onStart }: { onStart: () => void }) {
  return (
    <div className="shell py-10 md:py-16 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/60">
            <span className="size-1.5 rounded-full bg-grape" />
            Game 01 · Portfolio simulator
          </div>

          <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.7rem)] font-extrabold leading-[0.95] tracking-[-0.055em]">
            You get $10,000.
            <br />
            Five startups.
            <br />
            <span className="serif-accent text-grape">Five years.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-ink/65 md:text-lg">
            Some of these companies became legends. Some became cautionary
            tales. All of them looked uncertain when the cheque was written.
            Your job: decide who gets your money before history reveals the
            answer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className={buttonClass({
                variant: "primary",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Open the deal flow
              <ArrowRight className="size-4" />
            </button>
            <a
              href="#rules"
              className={buttonClass({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Read the rules
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink/10 pt-5">
            <div>
              <p className="text-xl font-extrabold tracking-tight">$10,000</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Starting capital
              </p>
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">5 deals</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                No do-overs
              </p>
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">5 years</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                One simulation
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[470px] animate-fade-up [animation-delay:120ms]">
          <div className="absolute -right-2 -top-5 z-20 rotate-6 rounded-full border-2 border-ink bg-acid px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_0_#14131a]">
            High variance inside
          </div>

          <div className="hard-card-lg relative overflow-hidden rounded-[28px] bg-paper">
            <div className="flex items-center justify-between border-b-[1.5px] border-ink/10 bg-cream/70 px-6 py-4">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/55">
                Fund mandate
              </span>
              <span className="rounded-full border border-ink/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted">
                Confidential
              </span>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                    VentureU Student Capital
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">
                    Fund I
                  </h2>
                </div>
                <div className="grid size-12 place-items-center rounded-2xl bg-grape text-white">
                  <BadgeDollarSign className="size-6" />
                </div>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-dashed border-ink/15 pb-3">
                  <dt className="text-muted">Committed capital</dt>
                  <dd className="font-extrabold tabular-nums">$10,000.00</dd>
                </div>
                <div className="flex items-center justify-between border-b border-dashed border-ink/15 pb-3">
                  <dt className="text-muted">Target companies</dt>
                  <dd className="font-extrabold">5</dd>
                </div>
                <div className="flex items-center justify-between border-b border-dashed border-ink/15 pb-3">
                  <dt className="text-muted">Hold period</dt>
                  <dd className="font-extrabold">5 years</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Investment strategy</dt>
                  <dd className="rounded-full bg-acid px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                    You decide
                  </dd>
                </div>
              </dl>

              <div className="mt-6 rounded-2xl bg-cream p-4">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink/55">
                  <Sparkles className="size-3.5 text-grape" />
                  What you are really buying
                </div>
                <p className="mt-2 text-xs leading-5 text-ink/65">
                  A lesson in risk, timing, and the stories we tell ourselves
                  when a pitch sounds too good to fail.
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <div className="h-px w-32 bg-ink/25" />
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                    General partner
                  </p>
                </div>
                <span className="serif-accent text-lg text-grape/70">
                  You
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-3 z-20 flex items-center gap-3 rounded-2xl border-[1.5px] border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_0_#14131a] sm:-left-6">
            <div className="grid size-9 place-items-center rounded-full bg-ink text-acid">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                Portfolio value
              </p>
              <p className="text-sm font-extrabold tabular-nums">$10,000</p>
            </div>
          </div>

          <div className="absolute -right-2 bottom-14 z-10 flex rotate-3 items-center gap-2 rounded-xl border border-ink/15 bg-white px-3 py-2 text-[10px] font-bold text-ink/60 shadow-sm sm:-right-5">
            <Clock3 className="size-3.5 text-coral" />
            5-year horizon
          </div>
        </div>
      </div>

      <div id="rules" className="mt-20 scroll-mt-24 md:mt-28">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
              The rules
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">
              Three decisions. No safety net.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            There is no perfect portfolio. The point is to make a call, see the
            consequences, and notice your own pattern.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative rounded-3xl border-[1.5px] border-ink/15 bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/40 hover:shadow-[4px_4px_0_0_#14131a]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-[0.16em] text-grape">
                  {step.number}
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-cream text-[10px] font-bold text-ink/45 transition-colors group-hover:bg-acid group-hover:text-ink">
                  {index + 1}/3
                </span>
              </div>
              <h3 className="mt-8 text-lg font-extrabold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-ink/10 bg-paper/60 px-5 py-3.5 text-[11px] font-semibold text-muted">
          <span className="font-extrabold uppercase tracking-wider text-ink/55">
            Deal flow
          </span>
          {historicalStartups.map((startup) => (
            <span key={startup.id} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true">{startup.emoji}</span>
              {startup.name}
            </span>
          ))}
          <span className="text-ink/35">· outcomes hidden</span>
        </div>
      </div>
    </div>
  );
}
