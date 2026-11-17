"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type PlayStep = "join" | "allocate" | "locked" | "results";

const order: PlayStep[] = ["join", "allocate", "locked", "results"];

export function PlayStepper({ current }: { current: PlayStep }) {
  const { dict, t } = useI18n();
  const copy = dict.play.steps;
  const index = order.indexOf(current);

  return (
    <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        {t("play.steps.stepOf", { current: index + 1 })}
      </p>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {order.map((step, stepIndex) => (
          <div key={step} className="flex items-center gap-1.5 sm:gap-2.5">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full text-[10px] font-extrabold transition-colors sm:size-8",
                stepIndex < index
                  ? "bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white"
                  : stepIndex === index
                    ? "border-2 border-[#6366F1] bg-white text-[#4C1D95]"
                    : "bg-white/60 text-slate-300 ring-1 ring-white/80",
              )}
            >
              {stepIndex + 1}
            </span>
            <span
              className={cn(
                "hidden text-[9px] font-extrabold uppercase tracking-[0.12em] sm:inline",
                stepIndex <= index ? "text-[#1E1B4B]/65" : "text-slate-300",
              )}
            >
              {copy[step]}
            </span>
            {stepIndex < order.length - 1 && (
              <span
                className={cn(
                  "h-px w-3 sm:w-5",
                  stepIndex < index ? "bg-[#7C3AED]/50" : "bg-slate-200",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
