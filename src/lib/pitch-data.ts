import {
  accentForNiche,
  type PitchCard,
  type StartupDraft,
  type Vote,
} from "@/lib/pitch-types";

export const DEMO_VOTER_COUNT = 32;

export const seedStartups: PitchCard[] = [
  {
    id: "campus-bite",
    title: "CampusBite",
    pitch:
      "Half-price meals from campus cafés, rescued before closing time. Students save money, kitchens earn from food that would be binned, and nobody has to eat another sad meal deal.",
    niche: "Marketplace",
    targetMarket: "12,000 students across 3 campuses",
    fundingNeeded: 25_000,
    founderName: "Maya K.",
    emoji: "🍜",
    accent: accentForNiche("Marketplace"),
    createdAt: "2026-10-01T09:00:00.000Z",
    demo: true,
  },
  {
    id: "notewave",
    title: "NoteWave",
    pitch:
      "AI that turns messy lecture recordings into structured notes, flashcards, and a weekly revision plan — trained on your course, in your university's own language.",
    niche: "AI & EdTech",
    targetMarket: "First-year STEM students",
    fundingNeeded: 40_000,
    founderName: "Noah & Priya",
    emoji: "📚",
    accent: accentForNiche("AI & EdTech"),
    createdAt: "2026-10-01T09:05:00.000Z",
    demo: true,
  },
  {
    id: "greenloop",
    title: "GreenLoop",
    pitch:
      "Reusable takeaway boxes with a €2 deposit, tracked in an app. Cafés ditch single-use packaging without hiring extra staff, and students get their deposit back.",
    niche: "Sustainability",
    targetMarket: "Campus cafés and 40 local eateries",
    fundingNeeded: 30_000,
    founderName: "Team Loop",
    emoji: "🌱",
    accent: accentForNiche("Sustainability"),
    createdAt: "2026-10-01T09:10:00.000Z",
    demo: true,
  },
  {
    id: "skillswap",
    title: "SkillSwap",
    pitch:
      "A skill-bartering board where students trade an hour of guitar for an hour of calculus. No money, just verified campus reputation and a reason to meet people offline.",
    niche: "Community",
    targetMarket: "Students in their first two years",
    fundingNeeded: 15_000,
    founderName: "Jonas R.",
    emoji: "🤝",
    accent: accentForNiche("Community"),
    createdAt: "2026-10-01T09:15:00.000Z",
    demo: true,
  },
  {
    id: "mindfulu",
    title: "MindfulU",
    pitch:
      "Five-minute, exam-week mental health check-ins with peer-trained responders and instant links to campus support. Private by design, built for the 2am panic before a deadline.",
    niche: "Health & Wellbeing",
    targetMarket: "Students during exam season",
    fundingNeeded: 20_000,
    founderName: "Aisha B.",
    emoji: "🧠",
    accent: accentForNiche("Health & Wellbeing"),
    createdAt: "2026-10-01T09:20:00.000Z",
    demo: true,
  },
  {
    id: "rentmate",
    title: "RentMate",
    pitch:
      "Verified student housing matching, rent splitting, and contract checks in one place. No more Facebook groups, ghost landlords, or discovering the kitchen is a curtain.",
    niche: "PropTech",
    targetMarket: "Second and third-year students",
    fundingNeeded: 50_000,
    founderName: "The RentMate crew",
    emoji: "🏠",
    accent: accentForNiche("PropTech"),
    createdAt: "2026-10-01T09:25:00.000Z",
    demo: true,
  },
];

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
