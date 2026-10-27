"use client";

import {
  ArrowRight,
  Check,
  Lightbulb,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PitchCardView } from "@/components/pitch/pitch-card-view";
import { buttonClass } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  accentForNiche,
  EMOJIS,
  NICHES,
  type PitchCard,
  type StartupDraft,
} from "@/lib/pitch-types";
import {
  sanitizeDraft,
  type DraftErrorCode,
  type DraftErrors,
} from "@/lib/pitch-validation";
import type { SubmitErrorCode } from "@/lib/use-pitch-board";
import { cn, formatCurrency } from "@/lib/utils";

const emptyDraft: StartupDraft = {
  title: "",
  pitch: "",
  niche: "AI & EdTech",
  targetMarket: "",
  fundingNeeded: 25_000,
  founderName: "",
  emoji: "🚀",
};

const inputClass =
  "w-full rounded-xl border-[1.5px] border-ink/15 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink/30 transition-colors focus:border-grape focus:outline-none";

const labelClass =
  "mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink/55";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[11px] font-semibold text-[#b3341c]">{message}</p>;
}

export function SubmitForm({
  submitStartup,
  onSeeResults,
}: {
  submitStartup: (
    draft: StartupDraft,
  ) => Promise<
    | { ok: true; startup: PitchCard; offline: boolean }
    | { ok: false; error: SubmitErrorCode; errors?: DraftErrors }
  >;
  onSeeResults: () => void;
}) {
  const { dict, t } = useI18n();
  const copy = dict.pitch.submit;
  const [draft, setDraft] = useState<StartupDraft>({ ...emptyDraft });
  const [errors, setErrors] = useState<DraftErrors>({});
  const [serverError, setServerError] = useState<SubmitErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<PitchCard | null>(null);
  const [offline, setOffline] = useState(false);

  const preview: PitchCard = {
    ...draft,
    id: "preview",
    accent: accentForNiche(draft.niche),
    createdAt: "",
  };

  useEffect(() => {
    if (!success) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSuccess(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [success]);

  function update<K extends keyof StartupDraft>(
    key: K,
    value: StartupDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerError(null);
  }

  function errorText(code?: DraftErrorCode) {
    return code ? copy.errors[code] : undefined;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const { draft: cleanDraft, errors: nextErrors } = sanitizeDraft(draft);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setServerError(null);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const result = await submitStartup(cleanDraft);
      if (!result.ok) {
        setErrors(result.errors ?? {});
        setServerError(result.error);
        return;
      }

      setSuccess(result.startup);
      setOffline(result.offline);
      setDraft({ ...emptyDraft });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  }

  const hasFieldErrors = Object.keys(errors).length > 0;

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[28px] border-[1.5px] border-ink/15 bg-paper p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-grape" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-grape">
                  {copy.badge}
                </span>
              </div>
              <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                {copy.title}{" "}
                <span className="serif-accent font-normal text-grape">
                  {copy.titleAccent}
                </span>
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                {copy.body}
              </p>
            </div>
            <span className="rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted">
              {copy.time}
            </span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="founder-name" className={labelClass}>
                {copy.founder}
              </label>
              <input
                id="founder-name"
                value={draft.founderName}
                onChange={(event) => update("founderName", event.target.value)}
                placeholder={copy.founderPlaceholder}
                maxLength={40}
                className={inputClass}
                aria-invalid={Boolean(errors.founderName)}
              />
              <FieldError message={errorText(errors.founderName)} />
            </div>

            <div>
              <label htmlFor="startup-title" className={labelClass}>
                {copy.startupName}
              </label>
              <input
                id="startup-title"
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder={copy.startupPlaceholder}
                maxLength={48}
                className={inputClass}
                aria-invalid={Boolean(errors.title)}
              />
              <FieldError message={errorText(errors.title)} />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="startup-pitch" className={labelClass}>
                {copy.pitch}
              </label>
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums",
                  draft.pitch.length > 240 ? "text-coral" : "text-muted",
                )}
              >
                {draft.pitch.length}/240
              </span>
            </div>
            <textarea
              id="startup-pitch"
              value={draft.pitch}
              onChange={(event) => update("pitch", event.target.value)}
              placeholder={copy.pitchPlaceholder}
              rows={4}
              maxLength={260}
              className={cn(inputClass, "resize-none leading-6")}
              aria-invalid={Boolean(errors.pitch)}
            />
            <FieldError message={errorText(errors.pitch)} />
          </div>

          <fieldset className="mt-4">
            <legend className={labelClass}>{copy.niche}</legend>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((niche) => {
                const selected = draft.niche === niche;
                return (
                  <button
                    key={niche}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("niche", niche)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-white text-ink/60 hover:border-ink/40 hover:text-ink",
                    )}
                  >
                    {dict.pitch.niches[niche]}
                  </button>
                );
              })}
            </div>
            <FieldError message={errorText(errors.niche)} />
          </fieldset>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="target-market" className={labelClass}>
                {copy.targetMarket}
              </label>
              <input
                id="target-market"
                value={draft.targetMarket}
                onChange={(event) =>
                  update("targetMarket", event.target.value)
                }
                placeholder={copy.targetPlaceholder}
                maxLength={80}
                className={inputClass}
                aria-invalid={Boolean(errors.targetMarket)}
              />
              <FieldError message={errorText(errors.targetMarket)} />
            </div>

            <div>
              <label htmlFor="funding-needed" className={labelClass}>
                {copy.funding}
              </label>
              <div className="flex items-center rounded-xl border-[1.5px] border-ink/15 bg-white px-3.5 transition-colors focus-within:border-grape">
                <span className="text-sm font-extrabold text-ink/30">$</span>
                <input
                  id="funding-needed"
                  type="number"
                  min={1000}
                  max={250000}
                  step={1000}
                  value={draft.fundingNeeded}
                  onChange={(event) =>
                    update("fundingNeeded", Number(event.target.value))
                  }
                  className="w-full bg-transparent px-1.5 py-2.5 text-sm font-bold tabular-nums outline-none"
                  aria-invalid={Boolean(errors.fundingNeeded)}
                />
              </div>
              <FieldError message={errorText(errors.fundingNeeded)} />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[10_000, 20_000, 30_000, 50_000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => update("fundingNeeded", amount)}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[9px] font-bold transition-colors",
                      draft.fundingNeeded === amount
                        ? "border-grape bg-grape text-white"
                        : "border-ink/10 text-muted hover:border-ink/30",
                    )}
                  >
                    {formatCurrency(amount, { compact: true })}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className={labelClass}>{copy.icon}</legend>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => update("emoji", emoji)}
                  aria-pressed={draft.emoji === emoji}
                  aria-label={t("pitch.submit.iconAria", { emoji })}
                  className={cn(
                    "grid size-9 place-items-center rounded-xl border text-lg transition-all",
                    draft.emoji === emoji
                      ? "border-ink bg-acid shadow-[2px_2px_0_0_#14131a]"
                      : "border-ink/10 bg-white hover:border-ink/30",
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </fieldset>

          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-xs font-semibold text-[#a93218]"
            >
              {copy.errors[serverError]}
            </div>
          )}

          {hasFieldErrors && !serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-xs font-semibold text-[#a93218]"
            >
              {copy.errorSummary}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({
              variant: "primary",
              size: "lg",
              className: "mt-6 w-full",
            })}
          >
            {submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {copy.publishing}
              </>
            ) : (
              <>
                {copy.publish}
                <Send className="size-4" />
              </>
            )}
          </button>

          <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-muted">
            <Check className="mt-0.5 size-3 shrink-0 text-[#0b6749]" />
            {copy.privacy}
          </p>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted">
                {copy.preview}
              </p>
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-grape">
                <Sparkles className="size-3" />
                {copy.updates}
              </span>
            </div>
            <div className="rounded-[24px] border border-ink/10 bg-cream/60 p-3">
              <PitchCardView
                startup={{
                  ...preview,
                  title: preview.title || copy.previewTitle,
                  pitch: preview.pitch || copy.previewPitch,
                  targetMarket:
                    preview.targetMarket || copy.previewMarket,
                  founderName: preview.founderName || copy.previewName,
                }}
                compact
              />
            </div>
          </div>

          <div className="rounded-[22px] border border-ink/10 bg-paper p-5">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-sun/40">
                <Lightbulb className="size-4" />
              </div>
              <h3 className="text-xs font-extrabold">{copy.tipsTitle}</h3>
            </div>
            <ul className="mt-3 space-y-2 text-[11px] leading-5 text-ink/60">
              {copy.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-grape" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {success && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pitch-published-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSuccess(null);
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-[28px] border-[1.5px] border-ink bg-paper p-5 shadow-[8px_8px_0_0_#d6f56d] sm:p-6">
            <button
              type="button"
              onClick={() => setSuccess(null)}
              aria-label={copy.close}
              className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full border border-ink/10 bg-white text-ink/50 transition-colors hover:text-ink"
            >
              <X className="size-4" />
            </button>

            <div className="grid size-12 place-items-center rounded-full bg-acid">
              <Check className="size-6" />
            </div>
            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-grape">
              {offline ? copy.saved : copy.live}
            </p>
            <h2
              id="pitch-published-title"
              className="mt-1 text-2xl font-extrabold tracking-[-0.04em]"
            >
              {copy.successTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {offline ? copy.successOffline : copy.successLive}
            </p>

            <div className="mt-4">
              <PitchCardView startup={success} compact />
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setSuccess(null);
                  onSeeResults();
                }}
                className={buttonClass({ variant: "primary", size: "md" })}
              >
                {copy.seeBoard}
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className={buttonClass({ variant: "outline", size: "md" })}
              >
                {copy.another}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
