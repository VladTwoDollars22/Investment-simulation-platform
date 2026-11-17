"use client";

import { ArrowRight, Radio, Ticket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function FindRoom() {
  const { dict } = useI18n();
  const copy = dict.play.find;
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = roomCode.trim().toUpperCase();

    if (!/^[A-Z0-9]{4,6}$/.test(normalized)) {
      setError(true);
      return;
    }

    router.push(`/play/${normalized}`);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-10 size-[380px] rounded-full bg-[#6366F1]/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 size-[320px] rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="shell relative grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1E1B4B]/60 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[#7C3AED]" />
            {copy.badge}
          </div>
          <h1 className="mt-6 text-[clamp(2.8rem,6vw,4.8rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-[#1E1B4B]">
            {copy.title}
            <span className="serif-accent block text-[#7C3AED]">
              {copy.titleAccent}
            </span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            {copy.body}
          </p>
          <Link
            href="/host"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#7C3AED] transition-colors hover:text-[#4C1D95]"
          >
            <Radio className="size-4" />
            {copy.hostLink}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[0_30px_80px_-45px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl [animation-delay:100ms] sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C3AED]">
                {copy.badge}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#1E1B4B]">
                {copy.roomCode}
              </h2>
            </div>
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25">
              <Ticket className="size-5" />
            </span>
          </div>

          <label
            htmlFor="find-room-code"
            className="mt-6 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500"
          >
            {copy.roomCode}
          </label>
          <input
            id="find-room-code"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            value={roomCode}
            onChange={(event) => {
              setRoomCode(
                event.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 6),
              );
              setError(false);
            }}
            placeholder={copy.placeholder}
            className={cn(
              "mt-2 h-16 w-full rounded-2xl border bg-white/80 px-4 text-center text-3xl font-extrabold uppercase tracking-[0.22em] text-[#1E1B4B] outline-none transition-all placeholder:text-slate-300 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10",
              error ? "border-rose-300" : "border-white/70",
            )}
          />

          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
              {copy.errors.roomFormat}
            </p>
          )}

          <button
            type="submit"
            className={buttonClass({
              variant: "primary",
              size: "lg",
              className: "mt-5 w-full",
            })}
          >
            {copy.continue}
            <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
