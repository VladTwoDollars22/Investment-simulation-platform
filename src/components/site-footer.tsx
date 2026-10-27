"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { dict } = useI18n();
  const columns = [
    {
      title: dict.footer.games,
      links: [
        { href: "/invest", label: dict.footer.gamesInvest },
        { href: "/pitch", label: dict.footer.gamesPitch },
        { href: "/pitch#submit", label: dict.footer.gamesSubmit },
      ],
    },
    {
      title: dict.footer.event,
      links: [
        { href: "/#games", label: dict.footer.eventHow },
        { href: "/#why-play", label: dict.footer.eventWhy },
        { href: "/pitch", label: dict.footer.eventLeaderboard },
      ],
    },
  ];

  return (
    <footer className="border-t-[1.5px] border-ink/10 bg-cream">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-4 text-sm leading-6 text-muted">
              {dict.footer.description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              <span className="size-1.5 rounded-full bg-grape" />
              {dict.footer.badge}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/45">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-ink/70 transition-colors hover:text-grape"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.footer.copyright}</p>
          <p className="max-w-xl sm:text-right">{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
