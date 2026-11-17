"use client";

import {
  ArrowRight,
  ArrowUpRight,
  KeyRound,
  LineChart,
  LockKeyhole,
  Radio,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { StartupIcon } from "@/components/invest/startup-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonClass } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { useI18n } from "@/lib/i18n";
import { STARTING_BUDGET, type StartupTeaser } from "@/lib/startup-types";
import { formatCurrency } from "@/lib/utils";

const lessonIcons = [LineChart, LockKeyhole, Users];
const lessonTints = ["bg-sky/40", "bg-acid/60", "bg-coral/15"];
const howIcons = [Ticket, Wallet, KeyRound];

export function HomeContent({ startups }: { startups: StartupTeaser[] }) {
  const { dict } = useI18n();
  const home = dict.home;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="grid-paper pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
          <div className="pointer-events-none absolute -right-24 top-10 size-[420px] rounded-full bg-grape/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-0 size-[360px] rounded-full bg-acid/25 blur-3xl" />

          <div className="shell relative grid items-center gap-12 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:py-24">
            <div className="animate-fade-up">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1E1B4B]/60 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-grape" />
                {home.hero.badge}
                <span className="text-[#1E1B4B]/25">
                  {home.hero.badgeDivider}
                </span>
                {home.hero.badgeSecond}
              </div>

              <h1 className="mt-6 text-[clamp(3rem,7.2vw,5.6rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-[#1E1B4B]">
                {home.hero.title1}
                <br />
                {home.hero.title2}{" "}
                <span className="serif-accent block text-grape">
                  {home.hero.titleAccent}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-ink/65 md:text-lg">
                {home.hero.body}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/play"
                  className={buttonClass({
                    variant: "primary",
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  <LineChart className="size-4" />
                  {home.hero.playInvest}
                </Link>
                <Link
                  href="/host"
                  className={buttonClass({
                    variant: "outline",
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  <Radio className="size-4" />
                  {home.hero.playHost}
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex -space-x-2" aria-hidden="true">
                  {startups.slice(0, 4).map((startup) => (
                    <span
                      key={startup.id}
                      className="grid size-9 place-items-center rounded-full border-2 border-cream text-[9px] font-extrabold"
                      style={{
                        backgroundColor: startup.look.chip,
                        color: startup.look.ink,
                      }}
                    >
                      <StartupIcon
                        icon={startup.logoIcon}
                        className="size-4"
                      />
                    </span>
                  ))}
                  <span className="grid size-9 place-items-center rounded-full border-2 border-cream bg-ink text-[9px] font-extrabold text-paper">
                    +{Math.max(0, startups.length - 4)}
                  </span>
                </div>
                <p className="max-w-[250px] text-[11px] font-semibold leading-4 text-muted">
                  {home.hero.social}
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] animate-fade-up [animation-delay:120ms]">
              <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10 bg-white/30 sm:size-[430px]" />
              <div className="absolute left-1/2 top-1/2 size-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/15 sm:size-[330px]" />

              <div className="animate-float relative z-10">
                <div className="hard-card-lg rounded-[28px] bg-ink p-5 text-paper sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.14em] text-paper/60">
                      <span className="size-1.5 rounded-full bg-acid" />
                      {home.showcase.fundYear}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-coral px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-ink">
                      <LockKeyhole className="size-3" />
                      {home.showcase.locked}
                    </span>
                  </div>

                  <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.14em] text-paper/40">
                    {home.showcase.portfolioValue}
                  </p>
                  <p className="mt-0.5 text-4xl font-extrabold tracking-[-0.05em] tabular-nums">
                    {home.showcase.maskedValue}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[9px] font-extrabold text-paper/60">
                    <KeyRound className="size-3 text-acid" />
                    {home.showcase.return}
                  </div>

                  <Sparkline
                    values={[10_000, 9_800, 10_400, 9_600, 10_300, 10_100]}
                    stroke="#d6f56d"
                    fill="rgba(214, 245, 109, 0.12)"
                    className="mt-5 h-20"
                  />

                  <div className="mt-3 flex justify-between text-[8px] font-bold uppercase tracking-wider text-paper/35">
                    <span>{home.showcase.start}</span>
                    <span>{home.showcase.match}</span>
                    <span>{home.showcase.y5}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                    {startups.map((startup) => (
                      <span
                        key={startup.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[8px] font-extrabold tracking-[0.08em] text-paper/55"
                      >
                        <span
                          className="grid size-3.5 place-items-center rounded"
                          style={{
                            backgroundColor: startup.look.chip,
                            color: startup.look.ink,
                          }}
                        >
                          <StartupIcon
                            icon={startup.logoIcon}
                            className="size-2.5"
                          />
                        </span>
                        {startup.ticker}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="animate-float-slow absolute -bottom-8 -left-2 z-20 w-[78%] [animation-delay:1.2s] sm:-left-6">
                <div className="rounded-[22px] border border-white/70 bg-white/75 p-4 shadow-[0_25px_60px_-35px_rgba(30,27,75,.55)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-grape">
                      {home.showcase.unlocked}
                    </span>
                    <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white">
                      <Trophy className="size-3.5" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-extrabold tracking-tight text-[#1E1B4B]">
                    {home.showcase.revealTitle}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    {home.showcase.revealBody}
                  </p>
                </div>
              </div>

              <div className="absolute -right-1 top-20 z-30 rotate-[6deg] rounded-xl border-2 border-ink bg-acid px-3 py-2 shadow-[3px_3px_0_0_#14131a] sm:right-2">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-ink/55">
                  {home.showcase.roomLabel}
                </p>
                <p className="flex items-center gap-1 text-sm font-extrabold text-ink">
                  <Radio className="size-3.5" /> {home.showcase.roomLive}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-y-[1.5px] border-ink bg-ink py-3.5 text-paper">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                className="flex shrink-0 items-center"
                aria-hidden={copyIndex === 1}
              >
                {home.marquee.map((item) => (
                  <span
                    key={`${copyIndex}-${item}`}
                    className="flex items-center gap-6 px-6 text-[10px] font-extrabold uppercase tracking-[0.2em]"
                  >
                    {item}
                    <span className="text-acid">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section id="how-it-works" className="shell scroll-mt-24 py-16 md:py-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
                {home.games.eyebrow}
              </p>
              <h2 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                {home.games.title}{" "}
                <span className="serif-accent font-normal text-grape">
                  {home.games.titleAccent}
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              {home.games.body}
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Link
              href="/play"
              className="group relative overflow-hidden rounded-[30px] border-[1.5px] border-ink bg-paper p-6 shadow-[5px_5px_0_0_#14131a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#14131a] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-ink/55">
                    <Ticket className="size-3" />
                    {home.games.investBadge}
                  </span>
                  <h3 className="mt-5 max-w-sm text-3xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-4xl">
                    {home.games.investTitle}
                  </h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-acid transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-ink/60">
                {home.games.investBody}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {home.games.investTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink/10 px-2.5 py-1 text-[9px] font-bold text-ink/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-ink/10 bg-cream/70 p-4">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                    {home.games.example}
                  </p>
                  <p className="text-xl font-extrabold tabular-nums">
                    {formatCurrency(STARTING_BUDGET)} → {home.showcase.maskedValue}
                  </p>
                </div>
                <Sparkline
                  values={[10_000, 9_700, 10_200, 9_900, 10_500, 10_100]}
                  className="w-32"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-grape">
                  {home.games.play01}
                </span>
                <span className="text-[10px] font-semibold text-muted">
                  {home.games.investTime}
                </span>
              </div>
            </Link>

            <Link
              href="/host"
              className="group relative overflow-hidden rounded-[30px] border-[1.5px] border-ink bg-[#1E1B4B] p-6 text-white shadow-[5px_5px_0_0_#14131a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#14131a] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#6366F1]/40 blur-2xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                    <Radio className="size-3" />
                    {home.games.hostBadge}
                  </span>
                  <h3 className="mt-5 max-w-sm text-3xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-4xl">
                    {home.games.hostTitle}
                  </h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-white/70 bg-acid text-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>

              <p className="relative mt-4 max-w-md text-sm leading-6 text-white/70">
                {home.games.hostBody}
              </p>

              <div className="relative mt-5 flex flex-wrap gap-2">
                {home.games.hostTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-bold text-white/65"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">
                    {home.games.hostCodeLabel}
                  </p>
                  <p className="mt-1 text-xl font-extrabold tracking-[0.16em]">
                    {home.games.hostExampleCode}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200/30 bg-amber-200/10 p-3 backdrop-blur-md">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-amber-100/60">
                    {home.games.hostUnlockLabel}
                  </p>
                  <p className="mt-1 text-xl font-extrabold tracking-[0.16em] text-amber-100">
                    {home.games.hostExampleUnlock}
                  </p>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-acid">
                  {home.games.hostCta}
                </span>
                <span className="text-[10px] font-semibold text-white/50">
                  {home.games.hostTime}
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {home.how.steps.map((step, index) => {
              const Icon = howIcons[index] ?? Sparkles;

              return (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/70 bg-white/60 p-5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[11px] font-extrabold tracking-[0.16em] text-grape">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#1E1B4B]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="why-play" className="shell scroll-mt-24 pb-16 md:pb-24">
          <div className="rounded-[32px] border-[1.5px] border-ink bg-ink p-7 text-paper shadow-[6px_6px_0_0_#d6f56d] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-acid">
                  {home.why.eyebrow}
                </p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                  {home.why.title}
                  <span className="serif-accent block text-acid">
                    {home.why.titleAccent}
                  </span>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                  {home.why.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div>
                    <p className="text-2xl font-extrabold">
                      {startups.length}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      {home.why.statGames}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-2xl font-extrabold">
                      {home.why.statWindow}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      {home.why.statBets}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-2xl font-extrabold">1</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      {home.why.statRoom}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {home.why.lessons.map((lesson, index) => {
                  const Icon = lessonIcons[index] ?? Sparkles;

                  return (
                    <div
                      key={lesson.title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl text-ink ${lessonTints[index] ?? "bg-acid/60"}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-extrabold tracking-[0.16em] text-white/30">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-xs font-extrabold">
                            {lesson.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-white/50">
                          {lesson.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="shell pb-16 md:pb-24">
          <div className="relative overflow-hidden rounded-[32px] border-[1.5px] border-ink bg-acid p-7 shadow-[6px_6px_0_0_#14131a] sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full border border-ink/10" />
            <div className="pointer-events-none absolute -bottom-16 right-20 size-56 rounded-full bg-white/30 blur-2xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/40 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em]">
                  <Zap className="size-3" />
                  {home.cta.badge}
                </div>
                <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.055em]">
                  {home.cta.title1}
                  <br />
                  <span className="serif-accent font-normal">
                    {home.cta.titleAccent}
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-ink/60">
                  {home.cta.body}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/play"
                  className={buttonClass({
                    variant: "dark",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <LineChart className="size-4" />
                  {home.cta.invest}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/host"
                  className={buttonClass({
                    variant: "outline",
                    size: "lg",
                    className: "w-full bg-white/40",
                  })}
                >
                  <Radio className="size-4" />
                  {home.cta.host}
                </Link>
                <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40">
                  {home.cta.footnote}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

