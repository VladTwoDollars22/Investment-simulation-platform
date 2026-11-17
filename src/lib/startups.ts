import source from "@/data/startups.json";
import {
  roundMoney,
  SIMULATION_YEARS,
  STARTING_BUDGET,
  type StartupDataSource,
  type StartupLocale,
  type StartupOutcome,
  type StartupCard,
  type StartupRecord,
  type StartupTeaser,
} from "@/lib/startup-types";

const data = source as StartupDataSource;

export const startupRecords: StartupRecord[] = data.startups;
export const startupIds = startupRecords.map((startup) => startup.id);

export type AllocationMap = Record<string, number>;

export type AllocationBreakdownRow = {
  startupId: string;
  allocation: number;
  multiplier2015to2020: number;
  finalValue: number;
  profit: number;
  timeline: number[];
  outcomes: Record<StartupLocale, StartupOutcome>;
};

export function getPlayerStartups(): StartupCard[] {
  return startupRecords.map((startup) => ({
    id: startup.id,
    name: startup.name,
    logoIcon: startup.logoIcon,
    look: startup.look,
  }));
}

export function getHomeStartups(): StartupTeaser[] {
  return startupRecords.map((startup) => ({
    id: startup.id,
    name: startup.name,
    ticker: startup.ticker,
    logoIcon: startup.logoIcon,
    look: startup.look,
  }));
}

export function buildTimeline(startup: StartupRecord): number[] {
  const first = startup.annualClose[0];

  return startup.annualClose.map((price, index) => {
    if (index === 0) return 1;
    if (index === SIMULATION_YEARS) return startup.multiplier2015to2020;
    return Math.round((price / first) * 1_000_000) / 1_000_000;
  });
}

export function allocationTotal(allocations: AllocationMap) {
  return roundMoney(
    Object.values(allocations).reduce((total, amount) => total + amount, 0),
  );
}

export function buildBreakdown(
  allocations: AllocationMap,
): AllocationBreakdownRow[] {
  return startupRecords.map((startup) => {
    const allocation = roundMoney(allocations[startup.id] ?? 0);
    const finalValue = roundMoney(
      allocation * startup.multiplier2015to2020,
    );

    return {
      startupId: startup.id,
      allocation,
      multiplier2015to2020: startup.multiplier2015to2020,
      finalValue,
      profit: roundMoney(finalValue - allocation),
      timeline: buildTimeline(startup),
      outcomes: startup.outcomes,
    };
  });
}

export function buildPortfolioSeries(
  allocations: AllocationMap,
  uninvestedCash: number,
): number[] {
  const timelines = new Map(
    startupRecords.map((startup) => [
      startup.id,
      buildTimeline(startup),
    ]),
  );

  return Array.from({ length: SIMULATION_YEARS + 1 }, (_, year) => {
    const investedValue = startupRecords.reduce((total, startup) => {
      const amount = allocations[startup.id] ?? 0;
      const timeline = timelines.get(startup.id) ?? [];
      return total + amount * (timeline[year] ?? 0);
    }, 0);

    return roundMoney(uninvestedCash + investedValue);
  });
}

export function buildPortfolioResult(
  allocations: AllocationMap,
  uninvestedCash: number,
) {
  const breakdown = buildBreakdown(allocations);
  const invested = allocationTotal(allocations);
  const rawInvestedValue = breakdown.reduce(
    (total, row) =>
      total + row.allocation * row.multiplier2015to2020,
    0,
  );
  const investedValue = roundMoney(rawInvestedValue);
  const finalBalance = roundMoney(uninvestedCash + rawInvestedValue);
  const series = buildPortfolioSeries(allocations, uninvestedCash);

  if (series.length > 0) {
    series[series.length - 1] = finalBalance;
  }

  const profit = roundMoney(finalBalance - STARTING_BUDGET);
  const roi = roundMoney((profit / STARTING_BUDGET) * 100);

  return {
    breakdown,
    invested,
    investedValue,
    uninvestedCash: roundMoney(uninvestedCash),
    finalBalance,
    profit,
    roi,
    series,
  };
}

