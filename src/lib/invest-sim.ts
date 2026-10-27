import type { Dictionary } from "@/lib/i18n";
import {
  historicalStartups,
  SIMULATION_YEARS,
  STARTING_BUDGET,
  type HistoricalStartup,
  type StartupVerdict,
} from "@/lib/invest-data";

export type InvestmentAmounts = Record<string, number>;

export type PositionResult = {
  startup: HistoricalStartup;
  amount: number;
  value: number;
  multiple: number;
  profit: number;
  verdict: StartupVerdict;
};

export type InvestorProfileId = keyof Dictionary["invest"]["profiles"];

export type InvestorProfile = {
  id: InvestorProfileId;
  emoji: string;
};

export type LessonId = keyof Dictionary["invest"]["lessons"];

export type Lesson = {
  id: LessonId;
  tone: "positive" | "warning" | "neutral";
  cash?: number;
  count?: number;
  startup?: HistoricalStartup;
};

export type SimulationResult = {
  positions: PositionResult[];
  invested: number;
  cash: number;
  finalValue: number;
  profit: number;
  roi: number;
  hitCount: number;
  lossCount: number;
  passCount: number;
  best: PositionResult | null;
  worst: PositionResult | null;
  series: number[];
  profile: InvestorProfile;
  lessons: Lesson[];
};

export const POSITION_STEP = 100;

export function totalInvested(amounts: InvestmentAmounts) {
  return historicalStartups.reduce(
    (total, startup) => total + (amounts[startup.id] ?? 0),
    0,
  );
}

export function remainingBudget(amounts: InvestmentAmounts) {
  return Math.max(0, STARTING_BUDGET - totalInvested(amounts));
}

export function portfolioValueAt(amounts: InvestmentAmounts, year: number) {
  const clampedYear = Math.min(Math.max(year, 0), SIMULATION_YEARS);
  const invested = totalInvested(amounts);

  return historicalStartups.reduce((total, startup) => {
    const amount = amounts[startup.id] ?? 0;
    return total + amount * startup.timeline[clampedYear];
  }, STARTING_BUDGET - invested);
}

export function buildPortfolioSeries(amounts: InvestmentAmounts) {
  return Array.from({ length: SIMULATION_YEARS + 1 }, (_, year) =>
    portfolioValueAt(amounts, year),
  );
}

export function eventsForYear(amounts: InvestmentAmounts, year: number) {
  return historicalStartups
    .filter((startup) => (amounts[startup.id] ?? 0) > 0)
    .map((startup) => ({ startup, year }));
}

function buildProfile({
  finalValue,
  invested,
  hitCount,
  largestBetShare,
}: {
  finalValue: number;
  invested: number;
  hitCount: number;
  largestBetShare: number;
}): InvestorProfile {
  if (invested === 0) {
    return { id: "armchair", emoji: "🛋️" };
  }

  if (finalValue >= 30_000) {
    return { id: "unicorn", emoji: "🦄" };
  }

  if (finalValue >= 14_000) {
    return { id: "seedSavant", emoji: "🚀" };
  }

  if (finalValue >= 10_000) {
    return { id: "steady", emoji: "⚖️" };
  }

  if (finalValue >= 5_000) {
    return { id: "tuition", emoji: "🎓" };
  }

  if (hitCount > 0) {
    return { id: "hype", emoji: "🫠" };
  }

  if (largestBetShare > 0.5) {
    return { id: "fullSend", emoji: "💀" };
  }

  return { id: "reality", emoji: "📉" };
}

function buildLessons(
  positions: PositionResult[],
  invested: number,
  cash: number,
): Lesson[] {
  const funded = positions.filter((position) => position.amount > 0);
  const lossMaking = funded.filter((position) => position.multiple === 0);
  const winners = funded.filter((position) => position.multiple > 1);
  const largest = [...funded].sort((a, b) => b.amount - a.amount)[0];
  const largestShare = invested > 0 && largest ? largest.amount / invested : 0;
  const lessons: Lesson[] = [];

  if (cash >= 4_000) {
    lessons.push({ id: "dryPowder", tone: "warning", cash });
  } else if (cash === 0 && funded.length > 0) {
    lessons.push({ id: "fullDeploy", tone: "neutral" });
  } else {
    lessons.push({ id: "reserve", tone: "positive" });
  }

  if (largestShare > 0.55 && largest) {
    lessons.push({
      id: "concentration",
      tone: largest.multiple > 1 ? "positive" : "warning",
      startup: largest.startup,
    });
  } else if (funded.length >= 3) {
    lessons.push({ id: "portfolio", tone: "positive", count: funded.length });
  } else if (funded.length > 0) {
    lessons.push({ id: "fewBets", tone: "neutral", count: funded.length });
  }

  if (lossMaking.length > 0) {
    lessons.push({
      id: "greatStory",
      tone: "warning",
      startup: lossMaking[0].startup,
    });
  } else if (winners.length > 0) {
    lessons.push({ id: "signal", tone: "positive" });
  }

  return lessons.slice(0, 3);
}

export function simulate(amounts: InvestmentAmounts): SimulationResult {
  const positions: PositionResult[] = historicalStartups.map((startup) => {
    const amount = amounts[startup.id] ?? 0;
    const multiple = startup.timeline[SIMULATION_YEARS];
    const value = amount * multiple;

    return {
      startup,
      amount,
      value,
      multiple,
      profit: value - amount,
      verdict: startup.outcome.verdict,
    };
  });

  const invested = totalInvested(amounts);
  const cash = STARTING_BUDGET - invested;
  const series = buildPortfolioSeries(amounts);
  const finalValue = series[series.length - 1];
  const funded = positions.filter((position) => position.amount > 0);
  const hitCount = funded.filter((position) => position.value > position.amount)
    .length;
  const lossCount = funded.filter(
    (position) => position.value < position.amount,
  ).length;
  const best = funded.length
    ? funded.reduce((top, position) =>
        position.value / position.amount > top.value / top.amount
          ? position
          : top,
      )
    : null;
  const worst = funded.length
    ? funded.reduce((bottom, position) =>
        position.value / position.amount < bottom.value / bottom.amount
          ? position
          : bottom,
      )
    : null;
  const largestShare =
    invested > 0
      ? Math.max(...funded.map((position) => position.amount)) / invested
      : 0;

  return {
    positions,
    invested,
    cash,
    finalValue,
    profit: finalValue - STARTING_BUDGET,
    roi: ((finalValue - STARTING_BUDGET) / STARTING_BUDGET) * 100,
    hitCount,
    lossCount,
    passCount: positions.filter((position) => position.amount === 0).length,
    best,
    worst,
    series,
    profile: buildProfile({
      finalValue,
      invested,
      hitCount,
      largestBetShare: largestShare,
    }),
    lessons: buildLessons(positions, invested, cash),
  };
}
