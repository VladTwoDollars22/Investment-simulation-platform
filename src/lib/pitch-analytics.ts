import {
  NICHES,
  type Niche,
  type PitchCard,
  type Vote,
} from "@/lib/pitch-types";
import { percent } from "@/lib/utils";

export type StartupVoteStats = {
  startup: PitchCard;
  invests: number;
  passes: number;
  total: number;
  investRate: number;
};

export type NicheVoteStats = {
  niche: Niche;
  startups: number;
  invests: number;
  passes: number;
  total: number;
  investRate: number;
};

export type FundingBucket = {
  id: "small" | "mid" | "large";
  label: string;
  range: string;
  invests: number;
  passes: number;
  total: number;
  investRate: number;
};

export type VoterProfile = {
  votesCast: number;
  invests: number;
  passes: number;
  investRate: number;
  favouriteNiche: Niche | null;
  averageAsk: number;
  archetype: {
    label: string;
    emoji: string;
    blurb: string;
  };
};

export type PitchInsight = {
  title: string;
  body: string;
  tone: "positive" | "neutral" | "warning";
};

export function tallyStartupVotes(
  startups: PitchCard[],
  votes: Vote[],
): StartupVoteStats[] {
  const byStartup = new Map<string, { invests: number; passes: number }>();

  votes.forEach((vote) => {
    const current = byStartup.get(vote.startupId) ?? {
      invests: 0,
      passes: 0,
    };
    if (vote.decision === "invest") current.invests += 1;
    else current.passes += 1;
    byStartup.set(vote.startupId, current);
  });

  return startups
    .map((startup) => {
      const counts = byStartup.get(startup.id) ?? { invests: 0, passes: 0 };
      const total = counts.invests + counts.passes;
      return {
        startup,
        invests: counts.invests,
        passes: counts.passes,
        total,
        investRate: percent(counts.invests, total),
      };
    })
    .sort((a, b) => {
      if (b.investRate !== a.investRate) return b.investRate - a.investRate;
      if (b.invests !== a.invests) return b.invests - a.invests;
      return a.startup.title.localeCompare(b.startup.title);
    });
}

export function tallyNicheVotes(
  startups: PitchCard[],
  votes: Vote[],
): NicheVoteStats[] {
  const stats = tallyStartupVotes(startups, votes);

  return NICHES.map((niche) => {
    const relevant = stats.filter((stat) => stat.startup.niche === niche);
    const invests = relevant.reduce((total, stat) => total + stat.invests, 0);
    const passes = relevant.reduce((total, stat) => total + stat.passes, 0);
    const total = invests + passes;

    return {
      niche,
      startups: relevant.length,
      invests,
      passes,
      total,
      investRate: percent(invests, total),
    };
  })
    .filter((niche) => niche.startups > 0)
    .sort((a, b) => b.investRate - a.investRate);
}

export function tallyFundingBuckets(
  startups: PitchCard[],
  votes: Vote[],
): FundingBucket[] {
  const stats = tallyStartupVotes(startups, votes);
  const buckets: FundingBucket[] = [
    {
      id: "small",
      label: "Small ask",
      range: "Under $20k",
      invests: 0,
      passes: 0,
      total: 0,
      investRate: 0,
    },
    {
      id: "mid",
      label: "Mid ask",
      range: "$20k–$35k",
      invests: 0,
      passes: 0,
      total: 0,
      investRate: 0,
    },
    {
      id: "large",
      label: "Big ask",
      range: "Over $35k",
      invests: 0,
      passes: 0,
      total: 0,
      investRate: 0,
    },
  ];

  stats.forEach((stat) => {
    const bucket =
      stat.startup.fundingNeeded < 20_000
        ? buckets[0]
        : stat.startup.fundingNeeded <= 35_000
          ? buckets[1]
          : buckets[2];
    bucket.invests += stat.invests;
    bucket.passes += stat.passes;
    bucket.total += stat.total;
  });

  return buckets.map((bucket) => ({
    ...bucket,
    investRate: percent(bucket.invests, bucket.total),
  }));
}

export function buildPitchInsights({
  startupStats,
  nicheStats,
  fundingBuckets,
}: {
  startupStats: StartupVoteStats[];
  nicheStats: NicheVoteStats[];
  fundingBuckets: FundingBucket[];
}): PitchInsight[] {
  const insights: PitchInsight[] = [];
  const topStartup = startupStats.find((stat) => stat.total >= 5);
  const topNiche = nicheStats.find((niche) => niche.total >= 10);
  const small = fundingBuckets.find((bucket) => bucket.id === "small");
  const large = fundingBuckets.find((bucket) => bucket.id === "large");

  if (topStartup) {
    insights.push({
      title: "Attention is not evenly distributed",
      body: `${topStartup.startup.title} converts ${topStartup.investRate}% of views into interest — ${topStartup.invests} yes votes from ${topStartup.total} swipes. In a deck of six, being memorable matters as much as being good.`,
      tone: "positive",
    });
  }

  if (topNiche) {
    insights.push({
      title: `${topNiche.niche} is having a moment`,
      body: `Pitches in ${topNiche.niche} earn a ${topNiche.investRate}% invest rate across ${topNiche.total} votes. The room is rewarding the category as much as the company — a real advantage, and a real trend risk.`,
      tone: "neutral",
    });
  }

  if (small && large && small.total >= 5 && large.total >= 5) {
    const difference = small.investRate - large.investRate;
    insights.push({
      title:
        difference >= 0
          ? "Smaller cheques are easier to say yes to"
          : "Big asks are not scaring the room",
      body:
        difference >= 0
          ? `Startups asking under $20k get a ${small.investRate}% invest rate versus ${large.investRate}% for asks above $35k. Lower risk is attractive — but the biggest companies rarely start cheap.`
          : `Startups asking above $35k still convert at ${large.investRate}%, ahead of the small-ask group at ${small.investRate}%. Ambition is not being penalised here.`,
      tone: "neutral",
    });
  }

  return insights;
}

export function buildVoterProfile({
  startups,
  votes,
  voterId,
}: {
  startups: PitchCard[];
  votes: Vote[];
  voterId: string | null;
}): VoterProfile | null {
  if (!voterId) return null;

  const mine = votes.filter((vote) => vote.voterId === voterId);
  if (mine.length === 0) return null;

  const startupMap = new Map(startups.map((startup) => [startup.id, startup]));
  const invested = mine.filter(
    (vote) => vote.decision === "invest" && startupMap.has(vote.startupId),
  );
  const investedStartups = invested
    .map((vote) => startupMap.get(vote.startupId))
    .filter((startup): startup is PitchCard => Boolean(startup));
  const nicheCounts = new Map<Niche, number>();

  investedStartups.forEach((startup) => {
    nicheCounts.set(startup.niche, (nicheCounts.get(startup.niche) ?? 0) + 1);
  });

  const favouriteNiche =
    [...nicheCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const averageAsk = investedStartups.length
    ? Math.round(
        investedStartups.reduce(
          (total, startup) => total + startup.fundingNeeded,
          0,
        ) / investedStartups.length,
      )
    : 0;
  const investRate = percent(invested.length, mine.length);

  const archetype =
    investRate >= 75
      ? {
          label: "Conviction Investor",
          emoji: "💛",
          blurb:
            "You say yes more than most. That gives founders momentum, but it also means you need a strong filter for the ideas you do not back.",
        }
      : investRate >= 50
        ? {
            label: "Balanced Backer",
            emoji: "⚖️",
            blurb:
              "You are open, not automatic. Roughly half the room earns your interest — a useful mix of curiosity and discernment.",
          }
        : investRate >= 25
          ? {
              label: "Selective Skeptic",
              emoji: "🔍",
              blurb:
                "You make founders work for it. Fewer yes votes, but the ones you give carry more signal.",
            }
          : {
              label: "Tough Room",
              emoji: "🧊",
              blurb:
                "You passed on almost everything. Either the bar is high, or the pitches have work to do. Both are useful data.",
            };

  return {
    votesCast: mine.length,
    invests: invested.length,
    passes: mine.length - invested.length,
    investRate,
    favouriteNiche,
    averageAsk,
    archetype,
  };
}
