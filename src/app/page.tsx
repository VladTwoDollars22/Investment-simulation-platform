import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Lightbulb,
  LineChart,
  Rocket,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { PitchCardView } from "@/components/pitch/pitch-card-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonClass } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { seedStartups } from "@/lib/pitch-data";

const marqueeItems = [
  "Due diligence",
  "Swipe right",
  "Lose it all",
  "Pivot",
  "Run it back",
  "Unit economics",
  "Conviction",
  "Try again",
];

const lessons = [
  {
    icon: LineChart,
    number: "01",
    title: "Risk only feels real when it is yours",
    body: "Allocating someone else's money is easy. Watching a $2,500 cheque become zero teaches more than a lecture slide ever will.",
    tint: "bg-sky/40",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "The best story does not always win",
    body: "Juicero had design, capital, and headlines. Airbnb had air mattresses. History rewards evidence, not volume.",
    tint: "bg-acid/60",
  },
  {
    icon: Users,
    number: "03",
    title: "A room has a personality",
    body: "Swipe data exposes what your audience actually rewards: niche, ask size, founder signal, or raw memorability.",
    tint: "bg-coral/15",
  },
];

export default function Home() {
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
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/60">
                <span className="size-1.5 rounded-full bg-grape" />
                University startup week
                <span className="text-ink/25">/</span>
                Two games, one room
              </div>

              <h1 className="mt-6 text-[clamp(3rem,7.2vw,5.6rem)] font-extrabold leading-[0.9] tracking-[-0.06em]">
                Back the next
                <br />
                big thing.{" "}
                <span className="serif-accent block text-grape">
                  Or lose $10k trying.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-ink/65 md:text-lg">
                A $10,000 portfolio. Five real startups. One room full of
                student pitches. Play the two games that turn startup theory
                into decisions you can feel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/invest"
                  className={buttonClass({
                    variant: "primary",
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  <LineChart className="size-4" />
                  Play the investment game
                </Link>
                <Link
                  href="/pitch"
                  className={buttonClass({
                    variant: "outline",
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  <Heart className="size-4" />
                  Swipe on pitches
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex -space-x-2">
                  {[
                    { initials: "MK", className: "bg-grape text-white" },
                    { initials: "NP", className: "bg-acid text-ink" },
                    { initials: "AR", className: "bg-coral text-white" },
                    { initials: "+9", className: "bg-ink text-paper" },
                  ].map((avatar) => (
                    <span
                      key={avatar.initials}
                      className={`grid size-8 place-items-center rounded-full border-2 border-cream text-[9px] font-extrabold ${avatar.className}`}
                    >
                      {avatar.initials}
                    </span>
                  ))}
                </div>
                <p className="max-w-[230px] text-[11px] font-semibold leading-4 text-muted">
                  Built for founders, aspiring investors, and the merely
                  curious. No finance degree required.
                </p>
              </div>
            </div>

            <div className="relative mx-auto h-[460px] w-full max-w-[520px] animate-fade-up [animation-delay:120ms] sm:h-[520px]">
              <div className="absolute left-1/2 top-1/2 size-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10 bg-paper/40 sm:size-[390px]" />
              <div className="absolute left-1/2 top-1/2 size-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/15 sm:size-[300px]" />

              <div className="animate-float absolute left-0 top-3 z-10 w-[80%] sm:top-6">
                <div className="hard-card-lg rounded-[26px] bg-ink p-5 text-paper">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.14em] text-paper/60">
                      <span className="size-1.5 rounded-full bg-acid" />
                      Fund I · Year 5
                    </span>
                    <TrendingUp className="size-4 text-acid" />
                  </div>
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-paper/40">
                    Portfolio value
                  </p>
                  <p className="mt-0.5 text-4xl font-extrabold tracking-[-0.05em] tabular-nums">
                    $41,800
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-acid px-2 py-1 text-[9px] font-extrabold text-ink">
                    <TrendingUp className="size-3" />
                    +318% return
                  </div>
                  <Sparkline
                    values={[10_000, 13_200, 11_800, 26_000, 35_500, 41_800]}
                    stroke="#d6f56d"
                    fill="rgba(214, 245, 109, 0.12)"
                    className="mt-4 h-16"
                  />
                  <div className="mt-2 flex justify-between text-[8px] font-bold uppercase tracking-wider text-paper/35">
                    <span>Start</span>
                    <span>Airbnb · Slack · Twitter</span>
                    <span>Y5</span>
                  </div>
                </div>
              </div>

              <div className="animate-float-slow absolute bottom-2 right-0 z-20 w-[74%] [animation-delay:1.2s]">
                <div className="hard-card rounded-[24px] bg-paper p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#E1EDFF] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#1557A8]">
                      AI & EdTech
                    </span>
                    <span className="rounded-full bg-cream px-2.5 py-1 text-[8px] font-extrabold text-ink/60">
                      $40k
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#E1EDFF] text-xl">
                      📚
                    </span>
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-ink/35">
                        Student pitch
                      </p>
                      <p className="text-xl font-extrabold tracking-[-0.04em]">
                        NoteWave
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] leading-4 text-ink/60">
                    AI that turns messy lecture recordings into notes,
                    flashcards, and a weekly revision plan.
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink/10 pt-2.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-muted">
                      Noah &amp; Priya
                    </span>
                    <span className="inline-flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wider text-[#0b6749]">
                      <Check className="size-3" />
                      Would invest
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-1 top-16 z-30 rotate-[7deg] rounded-xl border-2 border-ink bg-acid px-3 py-2 shadow-[3px_3px_0_0_#14131a] sm:right-2">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-ink/55">
                  Swipe right
                </p>
                <p className="flex items-center gap-1 text-sm font-extrabold">
                  <Heart className="size-3.5" /> Invest
                </p>
              </div>

              <div className="absolute -left-2 bottom-20 z-30 -rotate-6 rounded-xl border-2 border-ink bg-paper px-3 py-2 shadow-[3px_3px_0_0_#14131a] sm:-left-4">
                <p className="flex items-center gap-1 text-xs font-extrabold">
                  <X className="size-3.5 text-coral" /> Pass
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-y-[1.5px] border-ink bg-ink py-3.5 text-paper">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center"
                aria-hidden={copy === 1}
              >
                {marqueeItems.map((item) => (
                  <span
                    key={`${copy}-${item}`}
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

        <section id="games" className="shell scroll-mt-24 py-16 md:py-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
                Pick your game
              </p>
              <h2 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                Two ways to play.{" "}
                <span className="serif-accent font-normal text-grape">
                  One honest mirror.
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              Play in any order. Each game takes less time than a coffee break
              and ends with something to argue about.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Link
              href="/invest"
              className="group relative overflow-hidden rounded-[30px] border-[1.5px] border-ink bg-paper p-6 shadow-[5px_5px_0_0_#14131a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#14131a] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-ink/55">
                    <LineChart className="size-3" />
                    Portfolio simulator
                  </span>
                  <h3 className="mt-5 max-w-sm text-3xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-4xl">
                    Startup Investment Simulator
                  </h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-acid transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-ink/60">
                Start with $10,000. Back five real companies before you know
                how they ended. Then fast-forward five years and live with it.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["5 real startups", "5-year simulation", "Custom cheque sizes"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-ink/10 px-2.5 py-1 text-[9px] font-bold text-ink/50"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-ink/10 bg-cream/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                      Example portfolio
                    </p>
                    <p className="text-xl font-extrabold tabular-nums">
                      $10,000 → $24,600
                    </p>
                  </div>
                  <Sparkline
                    values={[10_000, 11_500, 9_800, 16_400, 21_000, 24_600]}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-grape">
                  Play game 01
                </span>
                <span className="text-[10px] font-semibold text-muted">
                  6–8 min
                </span>
              </div>
            </Link>

            <Link
              href="/pitch"
              className="group relative overflow-hidden rounded-[30px] border-[1.5px] border-ink bg-grape p-6 text-white shadow-[5px_5px_0_0_#14131a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#14131a] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                    <Heart className="size-3" />
                    Swipe + pitch voting
                  </span>
                  <h3 className="mt-5 max-w-sm text-3xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-4xl">
                    Founder Tinder
                  </h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-white/70 bg-acid text-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>

              <p className="relative mt-4 max-w-md text-sm leading-6 text-white/70">
                Swipe on real student pitches. Submit your own card. Then see
                which niches, ask sizes, and ideas the room actually rewards.
              </p>

              <div className="relative mt-5 flex flex-wrap gap-2">
                {["Swipe deck", "Founder submissions", "Live results"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-bold text-white/65"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>

              <div className="relative mt-6 flex items-center gap-2">
                <div className="relative h-[132px] flex-1">
                  <div className="absolute inset-x-3 top-0 h-full rotate-2 rounded-2xl border border-white/15 bg-white/10" />
                  <div className="absolute inset-x-1.5 top-2 h-full -rotate-1 rounded-2xl border border-white/20 bg-white/15" />
                  <div className="absolute inset-x-0 top-4 flex h-[116px] items-center gap-3 rounded-2xl border border-ink bg-paper p-3 text-ink">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#DDF7E7] text-xl">
                      🌱
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold">GreenLoop</p>
                      <p className="truncate text-[9px] text-muted">
                        Reusable takeaway boxes, tracked by app.
                      </p>
                      <div className="mt-1.5 flex gap-1">
                        <span className="rounded-full bg-mint px-1.5 py-0.5 text-[7px] font-extrabold uppercase text-[#0b6749]">
                          Invest
                        </span>
                        <span className="rounded-full bg-cream px-1.5 py-0.5 text-[7px] font-bold uppercase text-muted">
                          $30k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-acid">
                  Play game 02
                </span>
                <span className="text-[10px] font-semibold text-white/50">
                  3–6 min
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section id="why-play" className="shell scroll-mt-24 pb-16 md:pb-24">
          <div className="rounded-[32px] border-[1.5px] border-ink bg-ink p-7 text-paper shadow-[6px_6px_0_0_#d6f56d] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-acid">
                  Why play
                </p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                  Startup theory is tidy.
                  <span className="serif-accent block text-acid">
                    Decisions are not.
                  </span>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                  These games are built around the messy part: choosing under
                  uncertainty, then discovering what your choices reveal about
                  you.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div>
                    <p className="text-2xl font-extrabold">2</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Games
                    </p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-2xl font-extrabold">5</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Historical bets
                    </p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-2xl font-extrabold">1</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Live room
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {lessons.map((lesson) => {
                  const Icon = lesson.icon;
                  return (
                    <div
                      key={lesson.number}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl text-ink ${lesson.tint}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-extrabold tracking-[0.16em] text-white/30">
                            {lesson.number}
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

        <section className="border-y border-ink/10 bg-paper/50">
          <div className="shell py-16 md:py-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
                  On the board
                </p>
                <h2 className="mt-2 text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                  Student pitches, ready for your verdict.
                </h2>
              </div>
              <Link
                href="/pitch"
                className={buttonClass({ variant: "outline", size: "md" })}
              >
                Enter the arena
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {seedStartups.slice(0, 3).map((startup) => (
                <div key={startup.id} className="h-[360px]">
                  <PitchCardView startup={startup} compact />
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-ink/25 bg-cream/50 p-5">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-acid">
                  <Rocket className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold">
                    Got a startup of your own?
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-muted">
                    Build a card in two minutes. No deck, no login.
                  </p>
                </div>
                <Link
                  href="/pitch#submit"
                  className="shrink-0 rounded-full border-2 border-ink bg-paper px-3.5 py-2 text-[10px] font-extrabold transition-colors hover:bg-ink hover:text-paper"
                >
                  Submit
                </Link>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/60 p-5">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky/50">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">
                    Every vote becomes a data point.
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-muted">
                    See niche heat, ask-size bias, and what the room rewards
                    most.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shell py-16 md:py-24">
          <div className="relative overflow-hidden rounded-[32px] border-[1.5px] border-ink bg-acid p-7 shadow-[6px_6px_0_0_#14131a] sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full border border-ink/10" />
            <div className="pointer-events-none absolute -bottom-16 right-20 size-56 rounded-full bg-white/30 blur-2xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/40 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em]">
                  <Zap className="size-3" />
                  Your first $10k is waiting
                </div>
                <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.055em]">
                  Make a call.
                  <br />
                  <span className="serif-accent font-normal">
                    Then find out.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-ink/60">
                  The best way to understand risk is to make a decision and see
                  what happens next. We made that loop fit inside a coffee
                  break.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/invest"
                  className={buttonClass({
                    variant: "dark",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <LineChart className="size-4" />
                  Deploy $10,000
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/pitch"
                  className={buttonClass({
                    variant: "outline",
                    size: "lg",
                    className: "w-full bg-white/40",
                  })}
                >
                  <Heart className="size-4" />
                  Swipe the pitch deck
                </Link>
                <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40">
                  No sign-up · no real money · all the lessons
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
