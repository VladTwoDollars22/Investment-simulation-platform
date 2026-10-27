import type { Dictionary } from "@/lib/i18n";

export type StartupVerdict = "moonshot" | "modest" | "loss";

export type StartupLook = {
  from: string;
  to: string;
  ink: string;
  chip: string;
};

export type StartupId = keyof Dictionary["invest"]["startups"];

type StartupCopy = Dictionary["invest"]["startups"][StartupId];

export type HistoricalStartup = {
  id: StartupId;
  name: string;
  founded: number;
  emoji: string;
  look: StartupLook;
  /** Illustrative value of $1 invested at year 0, sampled at years 1–5. */
  timeline: [number, number, number, number, number, number];
  outcome: {
    verdict: StartupVerdict;
    multiple: number;
  };
  milestones: Array<{ year: number }>;
};

export type LocalizedStartup = Omit<
  HistoricalStartup,
  "outcome" | "milestones"
> &
  Omit<StartupCopy, "milestones"> & {
    outcome: HistoricalStartup["outcome"] & StartupCopy["outcome"];
    milestones: Array<{ year: number; text: string }>;
  };

export const STARTING_BUDGET = 10_000;
export const SIMULATION_YEARS = 5;

export const historicalStartups: HistoricalStartup[] = [
  {
    id: "juicero",
    name: "Juicero",
    founded: 2013,
    emoji: "🥤",
    look: {
      from: "#EDE7FF",
      to: "#D5C8FF",
      ink: "#4B2AC7",
      chip: "#E8E0FF",
    },
    timeline: [1, 1.18, 1.05, 0.55, 0, 0],
    outcome: { verdict: "loss", multiple: 0 },
    milestones: [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }, { year: 5 }],
  },
  {
    id: "pets-com",
    name: "Pets.com",
    founded: 1998,
    emoji: "🐶",
    look: {
      from: "#FFE4D8",
      to: "#FFC5AE",
      ink: "#A93218",
      chip: "#FFDDCD",
    },
    timeline: [1, 1.65, 0.22, 0, 0, 0],
    outcome: { verdict: "loss", multiple: 0 },
    milestones: [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }, { year: 5 }],
  },
  {
    id: "airbnb",
    name: "Airbnb",
    founded: 2008,
    emoji: "🛏️",
    look: {
      from: "#FFDCE4",
      to: "#FFB9CA",
      ink: "#A81D45",
      chip: "#FFD3DE",
    },
    timeline: [1, 1.3, 2.2, 4.1, 7.2, 11],
    outcome: { verdict: "moonshot", multiple: 11 },
    milestones: [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }, { year: 5 }],
  },
  {
    id: "slack",
    name: "Slack",
    founded: 2013,
    emoji: "💬",
    look: {
      from: "#D9F8E5",
      to: "#AFEBC9",
      ink: "#0B6749",
      chip: "#CFF5DF",
    },
    timeline: [1, 1.2, 2.0, 3.2, 4.4, 5.2],
    outcome: { verdict: "modest", multiple: 5.2 },
    milestones: [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }, { year: 5 }],
  },
  {
    id: "twitter",
    name: "Twitter",
    founded: 2006,
    emoji: "🐦",
    look: {
      from: "#DCEBFF",
      to: "#B6D5FF",
      ink: "#1557A8",
      chip: "#D3E5FF",
    },
    timeline: [1, 1.15, 0.9, 1.9, 4.2, 8.5],
    outcome: { verdict: "moonshot", multiple: 8.5 },
    milestones: [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }, { year: 5 }],
  },
];

export function getStartupCopy(dict: Dictionary, id: StartupId): StartupCopy {
  return dict.invest.startups[id];
}

export function localizeStartup(
  startup: HistoricalStartup,
  dict: Dictionary,
): LocalizedStartup {
  const copy = getStartupCopy(dict, startup.id);

  return {
    ...startup,
    ...copy,
    outcome: { ...startup.outcome, ...copy.outcome },
    milestones: startup.milestones.map((milestone, index) => ({
      year: milestone.year,
      text: copy.milestones[index] ?? "",
    })),
  };
}

export function localizeStartups(dict: Dictionary): LocalizedStartup[] {
  return historicalStartups.map((startup) => localizeStartup(startup, dict));
}

export const startupById = new Map(
  historicalStartups.map((startup) => [startup.id, startup]),
);
