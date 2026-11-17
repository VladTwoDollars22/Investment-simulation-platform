export const STARTING_BUDGET = 10_000;
export const SIMULATION_YEARS = 5;

export const STARTUP_LOCALES = ["en", "lt", "ru"] as const;

export type StartupLocale = (typeof STARTUP_LOCALES)[number];

export type StartupLook = {
  from: string;
  to: string;
  ink: string;
  chip: string;
};

export type StartupProfileCopy = {
  sector: string;
  tagline: string;
  description: string;
  pitch: string;
  risk: string;
};

export type StartupOutcome = {
  headline: string;
  summary: string;
  lesson: string;
};

export type StartupRecord = {
  id: string;
  name: string;
  ticker: string;
  logoIcon: string;
  founded: number;
  annualClose: [number, number, number, number, number, number];
  multiplier2015to2020: number;
  look: StartupLook;
  locales: Record<StartupLocale, StartupProfileCopy>;
  outcomes: Record<StartupLocale, StartupOutcome>;
};

export type StartupDataSource = {
  startYear: number;
  endYear: number;
  startups: StartupRecord[];
};

/** Full public profile shape; player/home pages receive narrower cards. */
export type StartupPublic = {
  id: string;
  name: string;
  ticker: string;
  logoIcon: string;
  founded: number;
  look: StartupLook;
  locales: Record<StartupLocale, StartupProfileCopy>;
};

/** Minimal startup shape safe to send to the player device. */
export type StartupCard = Pick<
  StartupPublic,
  "id" | "name" | "logoIcon" | "look"
>;

/** Minimal startup shape used by the landing page. */
export type StartupTeaser = Pick<
  StartupPublic,
  "id" | "name" | "ticker" | "logoIcon" | "look"
>;


export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}


