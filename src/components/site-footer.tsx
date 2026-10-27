import Link from "next/link";
import { Wordmark } from "@/components/brand";

const columns = [
  {
    title: "Games",
    links: [
      { href: "/invest", label: "Investment Simulator" },
      { href: "/pitch", label: "Founder Tinder" },
      { href: "/pitch#submit", label: "Submit a startup" },
    ],
  },
  {
    title: "Event",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#why-play", label: "Why play" },
      { href: "/pitch", label: "Live leaderboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-[1.5px] border-ink/10 bg-cream">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-4 text-sm leading-6 text-muted">
              Two quick games that turn startup theory into decisions you can
              feel. Built for university startup weeks, pitch nights and
              founder mixers.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              <span className="size-1.5 rounded-full bg-grape" />
              Student-built · event-ready
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
          <p>© VentureU. Play boldly, learn loudly.</p>
          <p className="max-w-xl sm:text-right">
            Educational simulation. Multiples are simplified and not financial
            advice. Pitch votes are event feedback, not investment offers.
          </p>
        </div>
      </div>
    </footer>
  );
}
