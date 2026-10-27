export type StartupVerdict = "moonshot" | "modest" | "loss";

export type StartupLook = {
  from: string;
  to: string;
  ink: string;
  chip: string;
};

export type Milestone = {
  year: number;
  text: string;
};

export type HistoricalStartup = {
  id: string;
  name: string;
  founded: number;
  sector: string;
  emoji: string;
  tagline: string;
  description: string;
  pitch: string;
  risk: string;
  look: StartupLook;
  /** Illustrative value of $1 invested at year 0, sampled at years 1–5. */
  timeline: [number, number, number, number, number, number];
  outcome: {
    verdict: StartupVerdict;
    multiple: number;
    headline: string;
    summary: string;
    lesson: string;
  };
  milestones: Milestone[];
};

export const STARTING_BUDGET = 10_000;
export const SIMULATION_YEARS = 5;

export const historicalStartups: HistoricalStartup[] = [
  {
    id: "juicero",
    name: "Juicero",
    founded: 2013,
    sector: "Connected hardware",
    emoji: "🥤",
    tagline: "A $400 Wi-Fi juicer for $5 juice packs.",
    description:
      "Juicero raised $120M to make cold-press juice as easy as coffee. The press was beautifully engineered — and completely unnecessary. Its juice packs could be squeezed by hand.",
    pitch:
      "Cold-press juice at home without the cleanup. A connected press, compostable packs, and a subscription that keeps the fridge full.",
    risk:
      "Premium hardware, a recurring subscription on top, and a product customers may not actually need.",
    look: {
      from: "#EDE7FF",
      to: "#D5C8FF",
      ink: "#4B2AC7",
      chip: "#E8E0FF",
    },
    timeline: [1, 1.18, 1.05, 0.55, 0, 0],
    outcome: {
      verdict: "loss",
      multiple: 0,
      headline: "Squeezed out",
      summary:
        "A viral video showed the $400 press was no better than human hands. Juicero cut the price, then shut down in 2017.",
      lesson:
        "Hype can raise a round. It cannot manufacture a reason to exist.",
    },
    milestones: [
      {
        year: 1,
        text: "Juicero launches its $699 press to design-world applause.",
      },
      {
        year: 2,
        text: "Bloomberg shows the juice packs can be squeezed by hand. Uh-oh.",
      },
      {
        year: 3,
        text: "Price cut to $399. The internet remains unconvinced.",
      },
      {
        year: 4,
        text: "Juicero shuts down and tries to sell its machines.",
      },
      {
        year: 5,
        text: "The $400 press becomes an eBay curiosity.",
      },
    ],
  },
  {
    id: "pets-com",
    name: "Pets.com",
    founded: 1998,
    sector: "E-commerce",
    emoji: "🐶",
    tagline: "The sock puppet that raised $82.5M and died in 268 days.",
    description:
      "Pets.com became the poster child of the dot-com boom with a Super Bowl ad and a lovable sock puppet. The less cute part: selling 50-pound bags of dog food below cost.",
    pitch:
      "Everything your pet needs, delivered to the door. We will spend whatever it takes to own the category before anyone else does.",
    risk:
      "Heavy products, thin margins, and a customer acquisition cost that eats the entire basket.",
    look: {
      from: "#FFE4D8",
      to: "#FFC5AE",
      ink: "#A93218",
      chip: "#FFDDCD",
    },
    timeline: [1, 1.65, 0.22, 0, 0, 0],
    outcome: {
      verdict: "loss",
      multiple: 0,
      headline: "Dot-com casualty",
      summary:
        "Pets.com went public in February 2000 and liquidated nine months later. Its assets sold for roughly $11M after raising $300M in total.",
      lesson:
        "A memorable mascot is not a moat. Unit economics still have to work.",
    },
    milestones: [
      {
        year: 1,
        text: "A Super Bowl ad makes the sock puppet a household name.",
      },
      {
        year: 2,
        text: "IPO lands — then the dot-com bubble starts to hiss.",
      },
      {
        year: 3,
        text: "Liquidation. The sock puppet is sold off with the warehouse.",
      },
      {
        year: 4,
        text: "The domain changes hands. The lesson sticks around.",
      },
      {
        year: 5,
        text: "Pets.com is a case study in spending your way to nowhere.",
      },
    ],
  },
  {
    id: "airbnb",
    name: "Airbnb",
    founded: 2008,
    sector: "Marketplace",
    emoji: "🛏️",
    tagline: "Air mattresses on a living-room floor. Now a travel empire.",
    description:
      "In 2007, two designers could not pay rent. They put three air mattresses in their loft and charged conference-goers to stay. Investors called it weird. Guests called it magic.",
    pitch:
      "Stay in someone's spare room instead of a hotel. We handle trust, payments, and photos. Cheaper for guests, lucrative for hosts.",
    risk:
      "Strangers sleeping in your home. Regulation. And hotels with actual marketing budgets.",
    look: {
      from: "#FFDCE4",
      to: "#FFB9CA",
      ink: "#A81D45",
      chip: "#FFD3DE",
    },
    timeline: [1, 1.3, 2.2, 4.1, 7.2, 11],
    outcome: {
      verdict: "moonshot",
      multiple: 11,
      headline: "The weird one wins",
      summary:
        "Airbnb turned a spare-room hack into a global category. The early idea sounded embarrassing; the trust layer made it inevitable.",
      lesson:
        "The best ideas often sound embarrassing at seed stage. Distribution and trust were the real product.",
    },
    milestones: [
      {
        year: 1,
        text: "Airbnb launches. Critics call it a couch-surfing gimmick.",
      },
      {
        year: 2,
        text: "One million nights booked. The flywheel starts to spin.",
      },
      {
        year: 3,
        text: "International expansion. Hotels start paying attention.",
      },
      {
        year: 4,
        text: "Regulators circle. The model adapts city by city.",
      },
      {
        year: 5,
        text: "A travel giant is born — and the weirdness becomes the brand.",
      },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    founded: 2013,
    sector: "B2B SaaS",
    emoji: "💬",
    tagline: "A failed video game that accidentally became work software.",
    description:
      "Tiny Speck was building a multiplayer game called Glitch. The game died; the internal chat tool built to survive it did not. Slack launched to the public in 2013.",
    pitch:
      "Team chat that people actually enjoy. Channels, search, integrations — one place for work to happen.",
    risk:
      "A crowded workplace software market, giant incumbents, and a team that just shut down a game.",
    look: {
      from: "#D9F8E5",
      to: "#AFEBC9",
      ink: "#0B6749",
      chip: "#CFF5DF",
    },
    timeline: [1, 1.2, 2.0, 3.2, 4.4, 5.2],
    outcome: {
      verdict: "modest",
      multiple: 5.2,
      headline: "The pivot that printed",
      summary:
        "Slack grew to millions of daily users and was acquired by Salesforce for $27.7B in 2021. The chat tool outlived the game that birthed it.",
      lesson:
        "A pivot is not a failure. It is a second shot with better information.",
    },
    milestones: [
      {
        year: 1,
        text: "Slack opens to the public. Teams invite other teams.",
      },
      {
        year: 2,
        text: "One million daily active users. The bottom-up flywheel hums.",
      },
      {
        year: 3,
        text: "Enterprise deals begin. The fun chat app grows up.",
      },
      {
        year: 4,
        text: "Slack becomes a verb in offices everywhere.",
      },
      {
        year: 5,
        text: "Salesforce comes knocking with $27.7B.",
      },
    ],
  },
  {
    id: "twitter",
    name: "Twitter",
    founded: 2006,
    sector: "Social",
    emoji: "🐦",
    tagline: "A side project inside a failed podcast company.",
    description:
      "Odeo was a podcast platform that got steamrolled by Apple. During a hack week, Jack Dorsey pitched a tiny status-update tool. The first tweet: 'just setting up my twttr.'",
    pitch:
      "Send a short update to your friends. 140 characters. No friction, no blog, no pressure.",
    risk:
      "No revenue model, a niche of early adopters, and a name that sounds like a bird noise.",
    look: {
      from: "#DCEBFF",
      to: "#B6D5FF",
      ink: "#1557A8",
      chip: "#D3E5FF",
    },
    timeline: [1, 1.15, 0.9, 1.9, 4.2, 8.5],
    outcome: {
      verdict: "moonshot",
      multiple: 8.5,
      headline: "140 characters, global reach",
      summary:
        "Twitter became the world's real-time public square, went public in 2013 at a $14B+ valuation, and reshaped media, politics, and memes.",
      lesson:
        "Simple products can hide enormous network effects. The early dip was noise, not the story.",
    },
    milestones: [
      {
        year: 1,
        text: "SXSW explodes. A 140-character update feels like the future.",
      },
      {
        year: 2,
        text: "The fail whale era. Growth is real, uptime is not.",
      },
      {
        year: 3,
        text: "Hashtags and retweets turn users into a distribution engine.",
      },
      {
        year: 4,
        text: "News breaks on Twitter first. The public square forms.",
      },
      {
        year: 5,
        text: "IPO. The side project is worth billions.",
      },
    ],
  },
];

export const startupById = new Map(
  historicalStartups.map((startup) => [startup.id, startup]),
);
