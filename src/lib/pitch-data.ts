import type { Dictionary } from "@/lib/i18n";
import {
  accentForNiche,
  type PitchCard,
  type StartupDraft,
  type Vote,
} from "@/lib/pitch-types";

export type SeedStartupId = keyof Dictionary["pitch"]["seed"];

const seedStartupMeta: Array<
  Omit<PitchCard, "title" | "pitch" | "targetMarket" | "founderName"> & {
    id: SeedStartupId;
  }
> = [
  {
    id: "campus-bite",
    niche: "Marketplace",
    fundingNeeded: 25_000,
    emoji: "🍜",
    accent: accentForNiche("Marketplace"),
    createdAt: "2026-10-01T09:00:00.000Z",
    demo: true,
  },
  {
    id: "notewave",
    niche: "AI & EdTech",
    fundingNeeded: 40_000,
    emoji: "📚",
    accent: accentForNiche("AI & EdTech"),
    createdAt: "2026-10-01T09:05:00.000Z",
    demo: true,
  },
  {
    id: "greenloop",
    niche: "Sustainability",
    fundingNeeded: 30_000,
    emoji: "🌱",
    accent: accentForNiche("Sustainability"),
    createdAt: "2026-10-01T09:10:00.000Z",
    demo: true,
  },
  {
    id: "skillswap",
    niche: "Community",
    fundingNeeded: 15_000,
    emoji: "🤝",
    accent: accentForNiche("Community"),
    createdAt: "2026-10-01T09:15:00.000Z",
    demo: true,
  },
  {
    id: "mindfulu",
    niche: "Health & Wellbeing",
    fundingNeeded: 20_000,
    emoji: "🧠",
    accent: accentForNiche("Health & Wellbeing"),
    createdAt: "2026-10-01T09:20:00.000Z",
    demo: true,
  },
  {
    id: "rentmate",
    niche: "PropTech",
    fundingNeeded: 50_000,
    emoji: "🏠",
    accent: accentForNiche("PropTech"),
    createdAt: "2026-10-01T09:25:00.000Z",
    demo: true,
  },
];

const seedIds = new Set<string>(seedStartupMeta.map((startup) => startup.id));

/**
 * Server-side seed cards only need IDs and numeric metadata. All copy is
 * hydrated from the active locale on the client.
 */
export const seedStartups: PitchCard[] = seedStartupMeta.map((startup) => ({
  ...startup,
  title: "",
  pitch: "",
  targetMarket: "",
  founderName: "",
}));

export function localizeSeedStartups(dict: Dictionary): PitchCard[] {
  return seedStartupMeta.map((startup) => ({
    ...startup,
    ...dict.pitch.seed[startup.id],
  }));
}

export function localizeSeedStartup(card: PitchCard, dict: Dictionary): PitchCard {
  if (!seedIds.has(card.id)) return card;

  return {
    ...card,
    ...dict.pitch.seed[card.id as SeedStartupId],
  };
}

export const DEMO_VOTER_COUNT = 32;

const demoInvestRate: Record<string, number> = {
  "campus-bite": 0.64,
  notewave: 0.78,
  greenloop: 0.69,
  skillswap: 0.47,
  mindfulu: 0.56,
  rentmate: 0.39,
};

function hashString(value: string) {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/**
 * Deterministic, demo-only votes so the results dashboard has a realistic
 * cohort on first load. Real votes are stored by the API.
 */
export function buildDemoVotes(
  startups: Array<Pick<PitchCard, "id">>,
): Vote[] {
  const votes: Vote[] = [];

  startups.forEach((startup) => {
    const rate = demoInvestRate[startup.id];
    if (rate === undefined) return;

    for (let voter = 0; voter < DEMO_VOTER_COUNT; voter += 1) {
      const random = mulberry32(hashString(`${startup.id}:${voter}`))();
      votes.push({
        startupId: startup.id,
        decision: random < rate ? "invest" : "pass",
        voterId: `demo-${String(voter + 1).padStart(2, "0")}`,
        createdAt: "2026-10-20T09:00:00.000Z",
      });
    }
  });

  return votes;
}

export function draftToCard(
  draft: StartupDraft,
  id: string,
  creatorId: string,
): PitchCard {
  return {
    ...draft,
    id,
    creatorId,
    accent: accentForNiche(draft.niche),
    createdAt: new Date().toISOString(),
  };
}
