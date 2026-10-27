"use client";

import { LANGUAGES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, dict } = useI18n();

  return (
    <div
      role="group"
      aria-label={dict.language.label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/70 bg-white/55 p-0.5 shadow-[0_8px_24px_-18px_rgba(30,27,75,.8),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-md",
        className,
      )}
    >
      <span aria-hidden="true" className="pl-1.5 pr-0.5 text-[#1E1B4B]/45">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
          <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M2.5 8h11M8 2.25c1.6 1.6 2.4 3.5 2.4 5.75S9.6 12.15 8 13.75C6.4 12.15 5.6 10.25 5.6 8s.8-4.15 2.4-5.75Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {LANGUAGES.map((code) => {
        const active = code === language;

        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLanguage(code)}
            className={cn(
              "rounded-full px-2 py-1 text-[10px] font-extrabold tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E1B4B]/40",
              active
                ? "bg-[#1E1B4B] text-white shadow-sm"
                : "text-[#1E1B4B]/55 hover:bg-white/80 hover:text-[#1E1B4B]",
            )}
          >
            {dict.language[code]}
          </button>
        );
      })}
    </div>
  );
}
