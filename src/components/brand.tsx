"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid size-10 shrink-0 place-items-center rounded-[14px] border border-white/70 bg-white/45 p-1 shadow-[0_12px_30px_-18px_rgba(30,27,75,.75),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-md",
        className,
      )}
    >
      <Image
        src="/starcup-mark.svg"
        alt=""
        width={64}
        height={64}
        priority
        unoptimized
        className="size-8"
      />
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
  const { dict } = useI18n();

  return (
    <Link
      href="/"
      aria-label={dict.brand.home}
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
          <span className="text-[1.08rem] font-extrabold tracking-[-0.045em] text-[#1E1B4B]">
            Starcup
          </span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#1E1B4B]/50">
            {dict.brand.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
