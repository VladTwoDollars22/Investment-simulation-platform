import { cn } from "@/lib/utils";

type Variant = "primary" | "acid" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "border-2 border-ink bg-grape text-white shadow-[3px_3px_0_0_#14131a] hover:-translate-y-0.5 hover:bg-grape-dark hover:shadow-[5px_5px_0_0_#14131a] active:translate-y-0 active:shadow-[1px_1px_0_0_#14131a]",
  acid:
    "border-2 border-ink bg-acid text-ink shadow-[3px_3px_0_0_#14131a] hover:-translate-y-0.5 hover:bg-[#c7ec4f] hover:shadow-[5px_5px_0_0_#14131a] active:translate-y-0 active:shadow-[1px_1px_0_0_#14131a]",
  outline:
    "border-2 border-ink bg-transparent text-ink hover:-translate-y-0.5 hover:bg-paper hover:shadow-[3px_3px_0_0_#14131a] active:translate-y-0",
  ghost:
    "border-2 border-transparent bg-transparent text-ink hover:border-ink/15 hover:bg-ink/5",
  dark:
    "border-2 border-ink bg-ink text-paper shadow-[3px_3px_0_0_#5438f5] hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-[5px_5px_0_0_#5438f5] active:translate-y-0 active:shadow-[1px_1px_0_0_#5438f5]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
