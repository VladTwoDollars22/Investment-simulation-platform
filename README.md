# Starcup — Startup Games

Two interactive mini-games for university startup events, built with Next.js and Tailwind CSS. The interface is fully localized in English, Lithuanian, and Russian.

1. **Startup Investment Simulator** — start with a virtual $10,000, back five real historical startups before seeing the outcomes, then watch a five-year portfolio simulation and unpack the lessons.
2. **Founder Tinder** — founders publish startup cards, participants swipe right (invest) or left (pass), and a live results dashboard shows which pitches, niches, and funding asks the room actually rewards.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Lucide React** icons
- **Client-side i18n** with EN / LT / RU dictionaries and persisted language choice
- **Route Handlers** for the shared pitch board
- File-backed JSON persistence with an in-memory fallback

No database, auth provider, or external API keys are required.

## Getting started

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # production server
npm run lint    # ESLint
npm run typecheck
```

## The games

### Game 01 — Startup Investment Simulator

- $10,000 starting budget across five deals: Juicero, Pets.com, Airbnb, Slack, and Twitter.
- Custom cheque sizes with a slider, numeric input, quick amounts, or a full pass.
- Outcomes stay hidden until every deal is closed.
- Animated five-year simulation with portfolio chart, yearly events, and current positions.
- Final report with ROI, hit rate, best/worst call, per-startup breakdown, historical context, and a personalised investor profile.
- Shareable result summary (copied to the clipboard).

Multiples are intentionally simplified for gameplay and are not financial advice. The historical summaries are real, the five-year return paths are illustrative.

### Game 02 — Founder Tinder

- Swipeable card deck with pointer drag, buttons, and keyboard arrows (`←` / `→`).
- Founder submission form with client/server validation and a live card preview.
- Cards store title, pitch, niche, target market, funding needed, founder name, and an icon.
- Results dashboard: startup leaderboard, niche "heat" bars, cheque-size bias, room-wide insights, and a personal investor archetype.
- A deterministic **demo cohort of 32 investors** (192 seeded votes) makes the dashboard useful on first load. Live votes are added on top and clearly labelled.
- Founders cannot vote on their own cards.

## Shared board persistence

The pitch board is served by:

| Route | Purpose |
| --- | --- |
| `GET /api/board` | Seed startups, submitted startups, live votes, demo votes |
| `POST /api/startups` | Publish a pitch card |
| `POST /api/votes` | Cast or update a vote |
| `DELETE /api/votes` | Clear one vote or all votes for a voter |

By default, submissions and votes are written to `data/pitch-board.json`. Set `PITCH_DATA_FILE` to use another writable path:

```bash
PITCH_DATA_FILE=/var/data/starcup-board.json npm run start
```

If the filesystem is read-only or the write fails, the app keeps working in **session-only memory mode** and labels the UI accordingly. Each participant also has a local fallback for offline/demo use.

### Running the event

For votes and submissions to be shared across phones:

1. Run the app on one machine (or deploy to a persistent Node host).
2. Make sure all participants can reach the same URL.
3. Keep the server process alive for the event.

Deploying to a serverless platform works, but `data/` does not persist across instances/restarts there. For a real multi-device event, use a host with a persistent disk or replace `src/lib/server/pitch-store.ts` with your database of choice.

## Project structure

```text
src/
├── app/
│   ├── api/                 # board, startups, votes route handlers
│   ├── invest/              # Game 01 page
│   ├── pitch/               # Game 02 page
│   ├── globals.css          # Tailwind v4 theme + design system
│   ├── layout.tsx
│   └── page.tsx             # landing page
├── components/
│   ├── invest/              # investment game stages + chart
│   ├── pitch/               # swipe deck, submission form, dashboard
│   ├── ui/                  # button styles, sparkline
│   ├── brand.tsx
│   ├── site-header.tsx
│   └── site-footer.tsx
└── lib/
    ├── invest-data.ts       # historical startup dataset
    ├── invest-sim.ts        # portfolio engine + scoring
    ├── pitch-analytics.ts   # vote aggregation + insights
    ├── pitch-data.ts        # seed pitches + demo cohort
    ├── pitch-types.ts
    ├── pitch-validation.ts
    ├── server/pitch-store.ts
    └── use-pitch-board.ts   # client board state + offline fallback
```

## Design notes

- Warm editorial palette (cream, ink, grape, acid) with hard offset shadows, serif display accents, and student-friendly typography.
- Fully responsive layouts for phones and projectors.
- Keyboard-accessible voting, labelled controls, reduced-motion support, and visible focus states.
- No real money, no real investment advice. Pitch votes are event feedback, not investment offers.
