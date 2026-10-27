"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/invest", label: "Invest Simulator" },
  { href: "/pitch", label: "Pitch Arena" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b-[1.5px] border-ink/10 bg-cream/85 backdrop-blur-xl">
      <div className="shell flex h-[70px] items-center justify-between gap-4">
        <Wordmark />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-ink/10 bg-paper/70 p-1.5 md:flex"
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
                  "rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
                  active
                    ? "bg-ink text-paper"
                    : "text-ink/65 hover:bg-ink/5 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/invest"
            className={buttonClass({
              variant: "primary",
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Play now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border-2 border-ink bg-paper text-ink md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-ink/10 bg-cream px-5 pb-5 pt-3 md:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
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
                    active ? "bg-ink text-paper" : "hover:bg-ink/5",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/invest"
              onClick={() => setOpen(false)}
              className={buttonClass({
                variant: "primary",
                size: "md",
                className: "mt-3 w-full",
              })}
            >
              Play now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
