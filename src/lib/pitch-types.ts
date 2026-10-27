export const NICHES = [
  "AI & EdTech",
  "Sustainability",
  "Marketplace",
  "Health & Wellbeing",
  "Community",
  "PropTech",
] as const;

export type Niche = (typeof NICHES)[number];

export const ACCENTS = {
  grape: {
    tile: "bg-[#EDE7FF]",
    text: "text-[#4B2AC7]",
    chip: "bg-[#E4DBFF]",
    gradient: "from-[#F3EEFF] via-[#E7DEFF] to-[#D6C8FF]",
  },
  acid: {
    tile: "bg-[#EBF9C4]",
    text: "text-[#4C6400]",
    chip: "bg-[#DDF4A4]",
    gradient: "from-[#F7FDE3] via-[#ECF9C8] to-[#DBF39E]",
  },
  coral: {
    tile: "bg-[#FFE3DC]",
    text: "text-[#A93218]",
    chip: "bg-[#FFD2C7]",
    gradient: "from-[#FFF0EB] via-[#FFDDD4] to-[#FFC5B6]",
  },
  sky: {
    tile: "bg-[#E1EDFF]",
    text: "text-[#1557A8]",
    chip: "bg-[#CCE0FF]",
    gradient: "from-[#F0F6FF] via-[#DDEBFF] to-[#C3DAFF]",
  },
  mint: {
    tile: "bg-[#DDF7E7]",
    text: "text-[#0B6749]",
    chip: "bg-[#C8F2D8]",
    gradient: "from-[#EFFBF3] via-[#DAF7E5] to-[#BFEFD2]",
  },
  sun: {
    tile: "bg-[#FFF1CC]",
    text: "text-[#8A5A00]",
    chip: "bg-[#FFE7A8]",
    gradient: "from-[#FFF9E8] via-[#FFEFC4] to-[#FFE29C]",
  },
} as const;

export type AccentKey = keyof typeof ACCENTS;

export const EMOJIS = [
  "🚀",
  "🍜",
  "📚",
  "🌱",
  "🤝",
  "🧠",
  "🏠",
  "💡",
  "🎧",
  "🛴",
  "🧪",
  "💸",
];

export type PitchCard = {
  id: string;
  title: string;
  pitch: string;
  niche: Niche;
  targetMarket: string;
  fundingNeeded: number;
  founderName: string;
  emoji: string;
  accent: AccentKey;
  createdAt: string;
  creatorId?: string;
  demo?: boolean;
};

export type StartupDraft = {
  title: string;
  pitch: string;
  niche: Niche;
  targetMarket: string;
  fundingNeeded: number;
  founderName: string;
  emoji: string;
};

export type VoteDecision = "invest" | "pass";

export type Vote = {
  startupId: string;
  decision: VoteDecision;
  voterId: string;
  createdAt: string;
};

export type BoardData = {
  startups: PitchCard[];
  votes: Vote[];
  demoVotes: Vote[];
  persistent: boolean;
};

const nicheAccent: Record<Niche, AccentKey> = {
  "AI & EdTech": "sky",
  Sustainability: "mint",
  Marketplace: "acid",
  "Health & Wellbeing": "coral",
  Community: "sun",
  PropTech: "grape",
};

export function accentForNiche(niche: Niche): AccentKey {
  return nicheAccent[niche];
}
