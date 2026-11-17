"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonClass } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/play", label: dict.nav.invest },
    { href: "/host", label: dict.nav.host },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-cream/80 backdrop-blur-xl">
      <div className="shell flex h-[70px] items-center justify-between gap-3">
        <Wordmark />

        <nav
          aria-label={dict.nav.main}
          className="hidden items-center gap-1 rounded-full border border-white/70 bg-paper/60 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-md lg:flex"
        >
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors",
                  active
                    ? "bg-[#1E1B4B] text-paper"
                    : "text-[#1E1B4B]/65 hover:bg-white/70 hover:text-[#1E1B4B]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/play"
            className={buttonClass({
              variant: "primary",
              size: "sm",
              className: "hidden xl:inline-flex",
            })}
          >
            {dict.nav.playNow}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="grid size-10 place-items-center rounded-full border-2 border-ink bg-paper text-ink lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-ink/10 bg-cream px-5 pb-5 pt-3 lg:hidden"
        >
          <nav aria-label={dict.nav.mobile} className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3 text-sm font-bold",
                    active
                      ? "bg-[#1E1B4B] text-paper"
                      : "hover:bg-ink/5",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/play"
              onClick={() => setOpen(false)}
              className={buttonClass({
                variant: "primary",
                size: "md",
                className: "mt-3 w-full",
              })}
            >
              {dict.nav.playNow}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}


