"use client";

import {
  ArrowRight,
  Check,
  Heart,
  RotateCcw,
  Sparkles,
  Trophy,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PitchCardView } from "@/components/pitch/pitch-card-view";
import { buttonClass } from "@/components/ui/button";
import type {
  PitchCard,
  Vote,
  VoteDecision,
} from "@/lib/pitch-types";
import { clamp, cn } from "@/lib/utils";

export function VoteDeck({
  startups,
  voterId,
  myVotes,
  status,
  active = true,
  onVote,
  onRemoveVote,
  onResetVotes,
  onSeeResults,
  onOpenSubmit,
}: {
  startups: PitchCard[];
  voterId: string | null;
  myVotes: Vote[];
  status: "syncing" | "ready" | "offline";
  active?: boolean;
  onVote: (startupId: string, decision: VoteDecision) => void;
  onRemoveVote: (startupId: string) => void;
  onResetVotes: () => void;
  onSeeResults: () => void;
  onOpenSubmit: () => void;
}) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [flying, setFlying] = useState<"left" | "right" | null>(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const dragX = useRef(0);
  const actionRef = useRef<(decision: VoteDecision) => void>(() => {});
  const timer = useRef<number | null>(null);

  const ownIds = new Set(
    startups
      .filter((startup) => voterId && startup.creatorId === voterId)
      .map((startup) => startup.id),
  );
  const deck = startups.filter((startup) => !ownIds.has(startup.id));
  const votedIds = new Set(myVotes.map((vote) => vote.startupId));
  const remaining = deck.filter((startup) => !votedIds.has(startup.id));
  const current = remaining[0];
  const next = remaining[1];
  const third = remaining[2];
  const reviewed = deck.length - remaining.length;
  const deckIds = new Set(deck.map((startup) => startup.id));
  const investedCount = myVotes.filter(
    (vote) => vote.decision === "invest" && deckIds.has(vote.startupId),
  ).length;
  const passedCount = myVotes.filter(
    (vote) => vote.decision === "pass" && deckIds.has(vote.startupId),
  ).length;
  const latestVote = [...myVotes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];

  function decide(decision: VoteDecision) {
    if (!current || flying) return;
    const direction = decision === "invest" ? "right" : "left";
    setFlying(direction);
    setDrag({
      x: direction === "right" ? 640 : -640,
      y: 0,
      active: false,
    });

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      onVote(current.id, decision);
      setFlying(null);
      setDrag({ x: 0, y: 0, active: false });
      dragX.current = 0;
    }, 240);
  }

  useEffect(() => {
    actionRef.current = decide;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        actionRef.current("pass");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        actionRef.current("invest");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (flying || !current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startPoint.current = { x: event.clientX, y: event.clientY };
    dragX.current = 0;
    setDrag({ x: 0, y: 0, active: true });
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.active || flying) return;
    const nextDrag = {
      x: event.clientX - startPoint.current.x,
      y: event.clientY - startPoint.current.y,
    };
    dragX.current = nextDrag.x;
    setDrag({ ...nextDrag, active: true });
  }

  function onPointerEnd() {
    if (!drag.active || flying) return;
    const x = dragX.current;
    if (x > 96) {
      decide("invest");
      return;
    }
    if (x < -96) {
      decide("pass");
      return;
    }
    setDrag({ x: 0, y: 0, active: false });
  }

  const rotate = drag.x / 22;
  const investGlow = clamp(drag.x / 110, 0, 1);
  const passGlow = clamp(-drag.x / 110, 0, 1);
  const cardStyle: React.CSSProperties = {
    transform: flying
      ? `translate(${flying === "right" ? 560 : -560}px, -20px) rotate(${flying === "right" ? 26 : -26}deg)`
      : `translate(${drag.x}px, ${drag.y * 0.14}px) rotate(${rotate}deg)`,
    transition: drag.active
      ? "none"
      : flying
        ? "transform 260ms ease-in, opacity 260ms ease-in"
        : "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
    opacity: flying ? 0.2 : 1,
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-grape" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
              Founder Tinder
            </span>
            {status === "syncing" && (
              <span className="rounded-full bg-cream px-2 py-0.5 text-[9px] font-bold text-muted">
                syncing board…
              </span>
            )}
          </div>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
            Swipe with{" "}
            <span className="serif-accent font-normal text-grape">
              your wallet.
            </span>
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
            Right means you would take a meeting. Left means pass. Judge the
            pitch, not the polish — founders only get a few seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-2 w-28 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-grape transition-all duration-500"
              style={{
                width: `${deck.length > 0 ? (reviewed / deck.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-extrabold tabular-nums text-muted">
            {reviewed}/{deck.length}
          </span>
        </div>
      </div>

      <div className="mt-7 flex justify-center">
        <div className="relative w-full max-w-[430px]">
          {current ? (
            <>
              {third && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 -z-20 origin-top scale-[0.92] opacity-45"
                >
                  <PitchCardView startup={third} className="min-h-[540px]" />
                </div>
              )}
              {next && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 -z-10 origin-top translate-y-2.5 scale-[0.96] opacity-75"
                >
                  <PitchCardView startup={next} className="min-h-[540px]" />
                </div>
              )}

              <div className="relative z-10 select-none">
                <div
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerEnd}
                  onPointerCancel={() => {
                    setDrag({ x: 0, y: 0, active: false });
                    dragX.current = 0;
                  }}
                  style={cardStyle}
                  className={cn(
                    "touch-pan-y",
                    drag.active ? "cursor-grabbing" : "cursor-grab",
                  )}
                >
                  <PitchCardView
                    startup={current}
                    className="min-h-[540px]"
                  />

                  <div
                    className="pointer-events-none absolute left-5 top-6 z-20 -rotate-[10deg] rounded-xl border-[3px] border-[#0b6749] bg-mint px-4 py-2 text-xl font-extrabold tracking-tight text-[#0b6749]"
                    style={{ opacity: investGlow }}
                    aria-hidden="true"
                  >
                    INVEST
                  </div>
                  <div
                    className="pointer-events-none absolute right-5 top-6 z-20 rotate-[10deg] rounded-xl border-[3px] border-[#b3341c] bg-[#ffd9d1] px-4 py-2 text-xl font-extrabold tracking-tight text-[#b3341c]"
                    style={{ opacity: passGlow }}
                    aria-hidden="true"
                  >
                    PASS
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start justify-center gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (latestVote) onRemoveVote(latestVote.startupId);
                    }}
                    disabled={!latestVote || Boolean(flying)}
                    aria-label="Undo my last vote"
                    title="Undo last vote"
                    className="grid size-11 place-items-center rounded-full border-2 border-ink/20 bg-paper text-ink/40 transition-all hover:border-ink/50 hover:text-ink disabled:opacity-30"
                  >
                    <Undo2 className="size-4" />
                  </button>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
                    Undo
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => decide("pass")}
                    disabled={Boolean(flying)}
                    aria-label="Pass on this startup"
                    className="grid size-16 place-items-center rounded-full border-2 border-ink bg-paper text-coral shadow-[3px_3px_0_0_#14131a] transition-all hover:-translate-y-0.5 hover:bg-[#fff0ec] hover:shadow-[5px_5px_0_0_#14131a] active:translate-y-0 active:shadow-[1px_1px_0_0_#14131a] disabled:opacity-50"
                  >
                    <X className="size-7" strokeWidth={2.5} />
                  </button>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
                    Pass
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => decide("invest")}
                    disabled={Boolean(flying)}
                    aria-label="I would invest in this startup"
                    className="grid size-16 place-items-center rounded-full border-2 border-ink bg-acid text-ink shadow-[3px_3px_0_0_#14131a] transition-all hover:-translate-y-0.5 hover:bg-[#c7ec4f] hover:shadow-[5px_5px_0_0_#14131a] active:translate-y-0 active:shadow-[1px_1px_0_0_#14131a] disabled:opacity-50"
                  >
                    <Heart className="size-7" strokeWidth={2.5} />
                  </button>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
                    Invest
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] font-semibold text-muted">
                Drag the card, tap a button, or use{" "}
                <kbd className="rounded border border-ink/15 bg-paper px-1.5 py-0.5 font-mono text-[9px]">
                  ←
                </kbd>{" "}
                <kbd className="rounded border border-ink/15 bg-paper px-1.5 py-0.5 font-mono text-[9px]">
                  →
                </kbd>
              </p>
            </>
          ) : (
            <div className="flex min-h-[520px] flex-col justify-center rounded-[28px] border-[1.5px] border-ink bg-paper p-7 text-center shadow-[5px_5px_0_0_#14131a] sm:p-10">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-acid">
                {deck.length === 0 ? (
                  <Sparkles className="size-7" />
                ) : (
                  <Trophy className="size-7" />
                )}
              </div>

              {deck.length === 0 ? (
                <>
                  <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.04em]">
                    Your pitch is on the board.
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
                    Founders cannot swipe on their own startup. Share the board
                    with the room and watch the votes come in.
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={onSeeResults}
                      className={buttonClass({ variant: "primary", size: "md" })}
                    >
                      See the results
                      <ArrowRight className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onOpenSubmit}
                      className={buttonClass({ variant: "outline", size: "md" })}
                    >
                      Submit another
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-grape">
                    Deck complete
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">
                    You reviewed {reviewed}{" "}
                    {reviewed === 1 ? "startup" : "startups"}.
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
                    {investedCount} would get a meeting, {passedCount} would
                    not. Your votes are now part of the room&apos;s signal.
                  </p>

                  <div className="mx-auto mt-5 grid w-full max-w-xs grid-cols-2 gap-2">
                    <div className="rounded-xl bg-mint/50 px-3 py-2.5">
                      <p className="text-xl font-extrabold tabular-nums text-[#0b6749]">
                        {investedCount}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                        Invested
                      </p>
                    </div>
                    <div className="rounded-xl bg-coral/10 px-3 py-2.5">
                      <p className="text-xl font-extrabold tabular-nums text-[#b3341c]">
                        {passedCount}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                        Passed
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={onSeeResults}
                      className={buttonClass({ variant: "primary", size: "md" })}
                    >
                      See what the room thinks
                      <ArrowRight className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Clear all your votes and review the deck again?",
                          )
                        ) {
                          onResetVotes();
                        }
                      }}
                      className={buttonClass({ variant: "outline", size: "md" })}
                    >
                      <RotateCcw className="size-4" />
                      Change votes
                    </button>
                  </div>
                </>
              )}

              <p className="mt-5 flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
                <Check className="size-3 text-[#0b6749]" />
                No real money changes hands
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
