import {
  EMOJIS,
  NICHES,
  type Niche,
  type StartupDraft,
} from "@/lib/pitch-types";

export type DraftErrors = Partial<Record<keyof StartupDraft, string>>;

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

  if (title.length < 3) errors.title = "Give your startup a name (3+ characters).";
  if (title.length > 48) errors.title = "Keep the name under 48 characters.";

  if (pitch.length < 30)
    errors.pitch = "Tell us a little more — at least 30 characters.";
  if (pitch.length > pitchLimit)
    errors.pitch = `Keep the pitch under ${pitchLimit} characters.`;

  if (!NICHES.includes(nicheValue as Niche))
    errors.niche = "Pick a niche from the list.";

  if (targetMarket.length < 3)
    errors.targetMarket = "Describe who this is for (3+ characters).";
  if (targetMarket.length > 80)
    errors.targetMarket = "Keep the target market under 80 characters.";

  if (founderName.length < 2)
    errors.founderName = "Add a founder or team name.";

  if (fundingNeeded < 1_000)
    errors.fundingNeeded = "Minimum ask is $1,000.";
  if (fundingNeeded > 250_000)
    errors.fundingNeeded = "Maximum ask is $250,000.";

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
