import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid size-9 shrink-0 place-items-center overflow-hidden rounded-[11px] border-2 border-ink bg-ink",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none">
        <path
          d="M7.5 9.5h4.1l3 8.7 3.2-8.7h3.8L16 23.5h-3.5L7.5 9.5Z"
          fill="#d6f56d"
        />
        <path
          d="M20.5 9.5h4v10.2c0 2.4-1.5 4-3.9 4-.7 0-1.4-.1-2-.4v-3.1c.4.2.8.3 1.3.3.8 0 1.2-.5 1.2-1.4V9.5Z"
          fill="#ffffff"
        />
      </svg>
    </span>
  );
}

export function Wordmark({
  className,
  markClassName,
  compact = false,
}: {
  className?: string;
  markClassName?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="VentureU home"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:rounded-lg",
        className,
      )}
    >
      <BrandMark
        className={cn(
          "transition-transform duration-300 group-hover:-rotate-6",
          markClassName,
        )}
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[1.05rem] font-extrabold tracking-[-0.04em]">
            Venture<span className="text-grape">U</span>
          </span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
            Startup games
          </span>
        </span>
      )}
    </Link>
  );
}
