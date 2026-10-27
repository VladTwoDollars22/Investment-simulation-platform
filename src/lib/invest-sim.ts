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

export type InvestorProfile = {
  label: string;
  emoji: string;
  blurb: string;
};

export type Lesson = {
  title: string;
  body: string;
  tone: "positive" | "warning" | "neutral";
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
  return historicalStartups.flatMap((startup) => {
    if ((amounts[startup.id] ?? 0) <= 0) return [];
    return startup.milestones
      .filter((milestone) => milestone.year === year)
      .map((milestone) => ({ startup, text: milestone.text }));
  });
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
    return {
      label: "Armchair Capitalist",
      emoji: "🛋️",
      blurb:
        "You kept every dollar. Safe, comfortable, and completely unexposed to the upside.",
    };
  }

  if (finalValue >= 30_000) {
    return {
      label: "Unicorn Whisperer",
      emoji: "🦄",
      blurb:
        "You found the outliers and gave them enough room to compound. That is rarer than it looks.",
    };
  }

  if (finalValue >= 14_000) {
    return {
      label: "Seed-Stage Savant",
      emoji: "🚀",
      blurb:
        "You balanced conviction with enough diversification to catch a winner without needing a perfect call.",
    };
  }

  if (finalValue >= 10_000) {
    return {
      label: "Steady Hand",
      emoji: "⚖️",
      blurb:
        "You protected the downside and still put money to work. Not flashy — but the fund survives.",
    };
  }

  if (finalValue >= 5_000) {
    return {
      label: "Tuition Paid",
      emoji: "🎓",
      blurb:
        "The portfolio took a hit, but the lesson is worth more than the paper loss. Most LPs never get this cheap a lesson.",
    };
  }

  if (hitCount > 0) {
    return {
      label: "Hype Survivor",
      emoji: "🫠",
      blurb:
        "One good call could not carry the book. Concentration in the wrong places did the damage.",
    };
  }

  if (largestBetShare > 0.5) {
    return {
      label: "Full-Send Historian",
      emoji: "💀",
      blurb:
        "You went all in on a story. History has a funny way of charging tuition for that.",
    };
  }

  return {
    label: "Risk Appetite, Meet Reality",
    emoji: "📉",
    blurb:
      "You spread the bets but found the zeros. Diversification helps — it does not turn bad businesses into good ones.",
  };
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
    lessons.push({
      title: "Dry powder has a cost",
      body: `You finished with ${cash.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })} untouched. Cash protects you from ruin, but every dollar sitting out also sits out of the upside.`,
      tone: "warning",
    });
  } else if (cash === 0 && funded.length > 0) {
    lessons.push({
      title: "You deployed every dollar",
      body: "Full deployment signals conviction. It also removes your ability to double down when a company starts winning. Reserves are a strategic asset.",
      tone: "neutral",
    });
  } else {
    lessons.push({
      title: "You kept a real reserve",
      body: "You put money to work without emptying the tank. That optionality is how funds survive their first bad vintage.",
      tone: "positive",
    });
  }

  if (largestShare > 0.55 && largest) {
    lessons.push({
      title: "Concentration cuts both ways",
      body: `More than half of your invested capital went into ${largest.startup.name}. When it works, that feels like genius. When it does not, one decision owns the whole story.`,
      tone: largest.multiple > 1 ? "positive" : "warning",
    });
  } else if (funded.length >= 3) {
    lessons.push({
      title: "You built a portfolio, not a lottery ticket",
      body: `You spread capital across ${funded.length} companies. That does not guarantee a win, but it keeps any single failure from ending the game.`,
      tone: "positive",
    });
  } else if (funded.length > 0) {
    lessons.push({
      title: "Few bets, high variance",
      body: `You only backed ${funded.length} ${
        funded.length === 1 ? "company" : "companies"
      }. Fewer positions means every call matters more — in both directions.`,
      tone: "neutral",
    });
  }

  if (lossMaking.length > 0) {
    const worst = lossMaking[0];
    lessons.push({
      title: "A great story is not a business",
      body: `${worst.startup.name} had attention, capital, and a narrative. What it lacked was durable unit economics. ${worst.startup.outcome.lesson}`,
      tone: "warning",
    });
  } else if (winners.length > 0) {
    lessons.push({
      title: "Signal hides inside weird",
      body: "None of these companies looked normal at the start. You looked past the surface and backed evidence of a real behaviour change.",
      tone: "positive",
    });
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

export function simulationEventLine(
  startup: HistoricalStartup,
  year: number,
) {
  return startup.milestones.find((milestone) => milestone.year === year)?.text;
}
