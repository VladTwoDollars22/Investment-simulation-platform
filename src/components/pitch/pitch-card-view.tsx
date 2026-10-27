import { ACCENTS, type PitchCard } from "@/lib/pitch-types";
import { cn, formatCurrency } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => part && part !== "&")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function PitchCardView({
  startup,
  compact = false,
  className,
}: {
  startup: PitchCard;
  compact?: boolean;
  className?: string;
}) {
  const accent = ACCENTS[startup.accent];

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-paper",
        compact
          ? "rounded-2xl shadow-none"
          : "shadow-[5px_5px_0_0_#14131a]",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br",
          accent.gradient,
          compact ? "px-4 pb-3 pt-4" : "px-5 pb-5 pt-5",
        )}
      >
        <div className="dot-paper pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border border-ink/10 bg-white/55 px-2.5 py-1 font-extrabold uppercase tracking-[0.12em]",
              accent.text,
              compact ? "text-[8px]" : "text-[9px]",
            )}
          >
            {startup.niche}
          </span>
          <span className="inline-flex items-center rounded-full border border-ink/10 bg-white/55 px-2.5 py-1 text-[9px] font-extrabold text-ink/70">
            {formatCurrency(startup.fundingNeeded, { compact: true })}
          </span>
        </div>

        <div
          className={cn(
            "relative mt-4 flex items-end gap-3",
            compact ? "mt-3" : "mt-5",
          )}
        >
          <div
            className={cn(
              "grid shrink-0 place-items-center rounded-2xl border border-ink/10 bg-white/55 shadow-sm",
              compact ? "size-12 text-2xl" : "size-16 text-3xl",
            )}
          >
            <span aria-hidden="true">{startup.emoji}</span>
          </div>
          <div className="min-w-0 pb-0.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/40">
              Student pitch
            </p>
            <h3
              className={cn(
                "font-extrabold leading-[0.98] tracking-[-0.05em]",
                compact ? "text-xl" : "text-[2rem] sm:text-[2.35rem]",
              )}
            >
              {startup.title}
            </h3>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          compact ? "p-3.5" : "p-5",
        )}
      >
        <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-ink/40">
          The pitch
        </p>
        <p
          className={cn(
            "mt-1.5 leading-6 text-ink/75",
            compact ? "text-[11px] leading-5" : "text-[13px]",
          )}
        >
          {startup.pitch}
        </p>

        <div
          className={cn(
            "mt-auto grid grid-cols-2 gap-2",
            compact ? "pt-3" : "pt-4",
          )}
        >
          <div className="rounded-xl bg-cream px-2.5 py-2">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
              Target market
            </p>
            <p
              className={cn(
                "mt-0.5 font-bold leading-4 text-ink/75",
                compact ? "text-[9px]" : "text-[10px]",
              )}
            >
              {startup.targetMarket}
            </p>
          </div>
          <div className="rounded-xl bg-cream px-2.5 py-2">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
              Funding needed
            </p>
            <p
              className={cn(
                "mt-0.5 font-extrabold tabular-nums text-ink",
                compact ? "text-sm" : "text-base",
              )}
            >
              {formatCurrency(startup.fundingNeeded)}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-between gap-2",
            compact ? "mt-3" : "mt-4",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "grid shrink-0 place-items-center rounded-full font-extrabold",
                accent.tile,
                accent.text,
                compact ? "size-6 text-[8px]" : "size-7 text-[9px]",
              )}
            >
              {initials(startup.founderName)}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate font-extrabold",
                  compact ? "text-[9px]" : "text-[10px]",
                )}
              >
                {startup.founderName}
              </p>
              <p className="text-[8px] font-medium uppercase tracking-wider text-muted">
                {startup.demo ? "Showcase founder" : "Student founder"}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-ink/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted">
            {startup.demo ? "Demo" : "Live"}
          </span>
        </div>
      </div>
    </article>
  );
}
