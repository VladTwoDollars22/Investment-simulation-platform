import {
  EMOJIS,
  NICHES,
  type Niche,
  type StartupDraft,
} from "@/lib/pitch-types";

export type DraftErrorCode =
  | "titleShort"
  | "titleLong"
  | "pitchShort"
  | "pitchLong"
  | "niche"
  | "marketShort"
  | "marketLong"
  | "founder"
  | "fundingMin"
  | "fundingMax";

export type DraftErrors = Partial<Record<keyof StartupDraft, DraftErrorCode>>;

const pitchLimit = 240;

export function sanitizeDraft(value: unknown): {
  draft: StartupDraft;
  errors: DraftErrors;
} {
  const input = (value ?? {}) as Record<string, unknown>;

  const title = typeof input.title === "string" ? input.title.trim() : "";
  const pitch = typeof input.pitch === "string" ? input.pitch.trim() : "";
  const nicheValue = typeof input.niche === "string" ? input.niche : "";
  const targetMarket =
    typeof input.targetMarket === "string" ? input.targetMarket.trim() : "";
  const founderName =
    typeof input.founderName === "string" ? input.founderName.trim() : "";
  const emojiValue = typeof input.emoji === "string" ? input.emoji : "🚀";
  const fundingRaw =
    typeof input.fundingNeeded === "number"
      ? input.fundingNeeded
      : Number(input.fundingNeeded);

  const niche = NICHES.includes(nicheValue as Niche)
    ? (nicheValue as Niche)
    : "AI & EdTech";

  const fundingNeeded = Number.isFinite(fundingRaw)
    ? Math.round(fundingRaw)
    : 0;

  const errors: DraftErrors = {};

  if (title.length < 3) errors.title = "titleShort";
  if (title.length > 48) errors.title = "titleLong";

  if (pitch.length < 30) errors.pitch = "pitchShort";
  if (pitch.length > pitchLimit) errors.pitch = "pitchLong";

  if (!NICHES.includes(nicheValue as Niche)) errors.niche = "niche";

  if (targetMarket.length < 3) errors.targetMarket = "marketShort";
  if (targetMarket.length > 80) errors.targetMarket = "marketLong";

  if (founderName.length < 2) errors.founderName = "founder";

  if (fundingNeeded < 1_000) errors.fundingNeeded = "fundingMin";
  if (fundingNeeded > 250_000) errors.fundingNeeded = "fundingMax";

  return {
    draft: {
      title,
      pitch,
      niche,
      targetMarket,
      fundingNeeded,
      founderName,
      emoji: EMOJIS.includes(emojiValue) ? emojiValue : "🚀",
    },
    errors,
  };
}
