"use client";

import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type {
  SubmissionSummary,
  UnlockResponse,
} from "@/lib/game-types";
import { GameClientError, unlockGame } from "@/lib/game-client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type UnlockError = "invalidCode" | "notFound" | "network";

export function LockedStep({
  roomCode,
  playerName,
  submission,
  onUnlocked,
}: {
  roomCode: string;
  playerName: string;
  submission: SubmissionSummary | null;
  onUnlocked: (payload: UnlockResponse) => void;
}) {
  const { dict, language } = useI18n();
  const copy = dict.play.locked;
  const [unlockCode, setUnlockCode] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<UnlockError | null>(null);

  async function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (unlockCode.trim().length < 4) {
      setError("invalidCode");
      return;
    }

    setUnlocking(true);
    setError(null);

    try {
      const payload = await unlockGame({
        roomCode,
        submissionId: submission?.id,
        playerName,
        unlockCode: unlockCode.trim(),
        language,
      });

      onUnlocked(payload);
    } catch (caught) {
      if (caught instanceof GameClientError) {
        if (caught.code === "invalid_unlock_code") {
          setError("invalidCode");
        } else if (caught.code === "submission_not_found") {
          setError("notFound");
        } else {
          setError("network");
        }
      } else {
        setError("network");
      }
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden rounded-[30px] border border-white/40 bg-[#1E1B4B] p-6 text-white shadow-[0_30px_80px_-40px_rgba(30,27,75,.8)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#6366F1]/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-[#7C3AED]/30 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/60 backdrop-blur-md">
              <LockKeyhole className="size-3.5 text-[#C4B5FD]" />
              {copy.badge}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
              {copy.room}: {roomCode}
            </span>
          </div>

          <h1 className="mt-7 text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            {copy.title}
            <span className="serif-accent block text-[#C4B5FD]">
              {copy.titleAccent}
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
            {copy.body}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
              <span className="size-1.5 rounded-full bg-[#A3E635]" />
              {copy.player}: {playerName}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
              <ShieldCheck className="size-3.5 text-[#C4B5FD]" />
              {copy.submitted}
            </span>
          </div>

          <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/45">
              <CheckCircle2 className="size-3.5 text-[#A3E635]" />
              {copy.waiting}
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className="h-1.5 flex-1 animate-pulse rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED]"
                  style={{ animationDelay: `${index * 140}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[0_30px_80px_-45px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C3AED]">
              {copy.unlockEyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#1E1B4B]">
              {copy.unlockTitle}
            </h2>
          </div>
          <span className="grid size-12 place-items-center rounded-2xl bg-white/80 text-[#7C3AED] shadow-sm ring-1 ring-white/70">
            <KeyRound className="size-5" />
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {copy.unlockBody}
        </p>

        <form onSubmit={handleUnlock} className="mt-6">
          <label
            htmlFor="unlock-code"
            className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500"
          >
            {copy.unlockCode}
          </label>
          <input
            id="unlock-code"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            value={unlockCode}
            onChange={(event) => {
              setUnlockCode(
                event.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 12),
              );
              setError(null);
            }}
            placeholder={copy.unlockPlaceholder}
            className={cn(
              "mt-2 h-14 w-full rounded-2xl border bg-white/80 px-4 text-2xl font-extrabold uppercase tracking-[0.18em] text-[#1E1B4B] outline-none transition-all placeholder:text-slate-300 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10",
              error ? "border-rose-300" : "border-white/70",
            )}
          />

          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
              {copy.errors[error]}
            </p>
          )}

          <button
            type="submit"
            disabled={unlocking}
            className={buttonClass({
              variant: "primary",
              size: "lg",
              className: "mt-5 w-full",
            })}
          >
            {unlocking ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.unlocking}
              </>
            ) : (
              <>
                {copy.unlock}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/40 px-4 py-3 text-[10px] leading-4 text-slate-400">
          {copy.footnote}
        </div>
      </section>
    </div>
  );
}
