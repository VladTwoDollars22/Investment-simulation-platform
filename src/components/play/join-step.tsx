"use client";

import { ArrowRight, Loader2, LogIn, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { checkRoom, GameClientError } from "@/lib/game-client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type JoinError = "name" | "roomNotFound" | "network";

export function JoinStep({
  roomCode,
  initialName,
  onJoined,
}: {
  roomCode: string;
  initialName: string;
  onJoined: (name: string) => void;
}) {
  const { dict, t } = useI18n();
  const copy = dict.play.join;
  const [name, setName] = useState(initialName);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<JoinError | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = name.replace(/\s+/g, " ").trim();

    if (normalized.length < 2 || normalized.length > 30) {
      setError("name");
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const room = await checkRoom(roomCode);

      if (!room.exists) {
        setError("roomNotFound");
        return;
      }

      onJoined(normalized);
    } catch (caught) {
      setError(
        caught instanceof GameClientError &&
          (caught.code === "room_not_found" ||
            caught.code === "invalid_room_code")
          ? "roomNotFound"
          : "network",
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1E1B4B]/60 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#7C3AED]" />
          {t("play.join.badge", { roomCode })}
        </div>
        <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#1E1B4B]">
          {copy.title}
          <span className="serif-accent block text-[#7C3AED]">
            {copy.titleAccent}
          </span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          {copy.body}
        </p>
        <Link
          href="/play"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#7C3AED] transition-colors hover:text-[#4C1D95]"
        >
          <LogIn className="size-4" />
          {copy.changeRoom}
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-up rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[0_30px_80px_-45px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl [animation-delay:100ms] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C3AED]">
              {copy.room}: {roomCode}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#1E1B4B]">
              {copy.nameLabel}
            </h2>
          </div>
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25">
            <UserRound className="size-5" />
          </span>
        </div>

        <label
          htmlFor="player-name"
          className="sr-only"
        >
          {copy.nameLabel}
        </label>
        <input
          id="player-name"
          type="text"
          autoComplete="nickname"
          maxLength={30}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          placeholder={copy.namePlaceholder}
          className={cn(
            "mt-6 h-14 w-full rounded-2xl border bg-white/80 px-4 text-lg font-bold text-[#1E1B4B] outline-none transition-all placeholder:font-medium placeholder:text-slate-300 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10",
            error === "name" ? "border-rose-300" : "border-white/70",
          )}
        />

        {error && (
          <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
            {copy.errors[error]}
          </p>
        )}

        <button
          type="submit"
          disabled={checking}
          className={buttonClass({
            variant: "primary",
            size: "lg",
            className: "mt-5 w-full",
          })}
        >
          {checking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {copy.checking}
            </>
          ) : (
            <>
              {copy.continue}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[10px] font-semibold text-slate-400">
          {copy.footnote}
        </p>
      </form>
    </div>
  );
}
