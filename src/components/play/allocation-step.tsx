"use client";

import {
  ArrowRight,
  Loader2,
  LockKeyhole,
  Wallet,
} from "lucide-react";
import { StartupIcon } from "@/components/invest/startup-icon";
import { buttonClass } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  STARTING_BUDGET,
  type StartupCard,
} from "@/lib/startup-types";
import { formatCurrency } from "@/lib/utils";

export function AllocationStep({
  roomCode,
  playerName,
  startups,
  amounts,
  onAllocationChange,
  onSubmit,
  submitting,
  submitError,
}: {
  roomCode: string;
  playerName: string;
  startups: StartupCard[];
  amounts: Record<string, number>;
  onAllocationChange: (startupId: string, amount: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: boolean;
}) {
  const { dict, t } = useI18n();
  const copy = dict.play.allocate;
  const total = startups.reduce(
    (sum, startup) => sum + (amounts[startup.id] ?? 0),
    0,
  );
  const remaining = Math.max(0, STARTING_BUDGET - total);
  const investedShare = Math.round((total / STARTING_BUDGET) * 100);

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

      <div className="mt-4 overflow-hidden rounded-[28px] border border-white/40 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] p-5 text-white shadow-[0_30px_80px_-45px_rgba(30,27,75,.8)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">
              {copy.remaining}
            </p>
            <p className="mt-1 text-[clamp(2.4rem,7vw,3.8rem)] font-extrabold leading-none tracking-[-0.05em] tabular-nums">
              {formatCurrency(remaining)}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-[#C4B5FD]">
              <Wallet className="size-4" />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
                {copy.invested}
              </p>
              <p className="text-sm font-extrabold tabular-nums">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#C4B5FD] transition-all duration-300"
            style={{ width: `${investedShare}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-white/40">
          <span>{copy.invested}</span>
          <span>{copy.cash}</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C3AED]">
          {copy.eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#1E1B4B] sm:text-3xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
          {copy.body}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {startups.map((startup) => {
          const current = amounts[startup.id] ?? 0;
          const maxForStartup = remaining + current;

          return (
            <div
              key={startup.id}
              className="rounded-[24px] border border-white/40 bg-white/75 p-4 shadow-[0_18px_45px_-38px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-md sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-2xl sm:size-14"
                  style={{
                    backgroundColor: startup.look.chip,
                    color: startup.look.ink,
                  }}
                >
                  <StartupIcon
                    icon={startup.logoIcon}
                    className="size-6 sm:size-7"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold tracking-[-0.02em] text-[#1E1B4B] sm:text-lg">
                    {startup.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                      {copy.allocation}
                    </span>
                    <span className="text-lg font-extrabold tabular-nums text-[#4C1D95] sm:text-xl">
                      {formatCurrency(current)}
                    </span>
                  </div>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={maxForStartup}
                step={500}
                value={current}
                disabled={maxForStartup === 0}
                onChange={(event) => {
                  const next = Math.round(Number(event.target.value) / 500) * 500;
                  onAllocationChange(
                    startup.id,
                    Math.min(Math.max(next, 0), maxForStartup),
                  );
                }}
                aria-label={t("play.allocate.sliderLabel", {
                  name: startup.name,
                })}
                className="allocation-slider mt-4 w-full"
                style={{
                  background:
                    maxForStartup > 0
                      ? `linear-gradient(to right, #7C3AED 0%, #7C3AED ${(current / maxForStartup) * 100}%, #E9E5FF ${(current / maxForStartup) * 100}%, #E9E5FF 100%)`
                      : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
        <LockKeyhole className="size-3.5 shrink-0" />
        {copy.note}
      </p>

      {submitError && (
        <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
          {copy.submitError}
        </p>
      )}

      <div className="sticky bottom-4 z-30 mt-5 rounded-[22px] border border-white/60 bg-white/80 p-3 shadow-[0_24px_60px_-30px_rgba(30,27,75,.55)] backdrop-blur-xl sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4 sm:justify-start">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                {copy.remaining}
              </p>
              <p className="text-xl font-extrabold tabular-nums text-[#1E1B4B]">
                {formatCurrency(remaining)}
              </p>
            </div>
            <div className="text-right sm:ml-6 sm:text-left">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                {copy.invested}
              </p>
              <p className="text-sm font-extrabold tabular-nums text-slate-600">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className={buttonClass({
              variant: "primary",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.submitting}
              </>
            ) : (
              <>
                {copy.submit}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


