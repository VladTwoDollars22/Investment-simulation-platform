# Starcup — Startup Investment Quiz

One live investment quiz for university startup events. The host creates a room and displays a QR code. Players scan it, enter a name, allocate a virtual **$10,000** across five real companies from 2015 on a single mobile screen, and unlock the 2020 result when the host reveals the secret code.

The interface is fully localized in **English**, **Lithuanian**, and **Russian**.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Supabase** (Postgres + REST, called only from server Route Handlers)
- **Lucide React** icons
- **qrcode.react** for the host join QR
- Stateless REST endpoints — **no Supabase Realtime or WebSockets**

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

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor. It creates `games` and `submissions`, enables RLS, and leaves all access to the server secret key.
3. Add the environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-secret-key
```

The API also accepts `SUPABASE_URL`, `SECRET_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` as fallbacks. Never expose the secret key to the browser; it is only read in `src/lib/server/supabase.ts`.

The publishable key is not required because the browser never talks to Supabase directly.

## How the game runs

1. **Host** opens `/host` and presses **Create New Game**. The screen shows a 5-character room code, a secret unlock code, a large join URL, and a QR code pointing to `/play/[roomCode]`.
2. **Players** scan the QR or open `/play/[roomCode]`, then enter the name that should appear on the leaderboard.
3. The allocation screen renders all five companies at once with only a logo, name, $0–remaining slider (step $500), and allocated amount. Uninvested cash stays at 1:1.
4. `POST /api/games/submit` validates the budget, calculates the portfolio server-side, and saves it. The response does **not** include the final balance.
5. The player sees the locked waiting screen. When the host reveals the secret code, `POST /api/games/unlock` verifies it and returns the $10,000 starting budget, 2020 final balance, ROI, per-company breakdown, and localized outcomes.
6. The host leaderboard shows rank, player, initial $10,000 budget, 2020 balance, and percentage return. It supports manual refresh and an optional 10-second polling toggle. No WebSockets.

`/invest` redirects to `/play` for compatibility with older links.

For a live event, open the host screen from the same public or LAN URL that players can reach; the QR is built from the browser origin.

## API

| Route | Purpose |
| --- | --- |
| `POST /api/games/create` | Create a room with a generated or custom unlock code |
| `POST /api/games/submit` | Validate a portfolio and save it as locked |
| `POST /api/games/unlock` | Verify the unlock code and return results |
| `GET /api/games/[roomCode]/leaderboard` | All submissions, sorted by `final_balance` descending |
| `GET /api/games/[roomCode]` | Public room existence and submission count |

## Dataset

[`src/data/startups.json`](src/data/startups.json) contains five real 2015–2020 stock outcomes:

| Company | Ticker | 2015–2020 multiple |
| --- | --- | --- |
| Etsy | ETSY | 22.862069× |
| Wayfair | W | 4.754896× |
| Yelp | YELP | 1.1545× |
| GoPro | GPRO | 0.487872× |
| Fitbit | FIT | 0.217303× |

Each entry stores the annual closing prices, the exact `multiplier2015to2020`, a clean icon identifier, and localized profile and outcome copy for `en`, `lt`, and `ru`. The player bundle only receives the logo, name, and colour metadata; descriptions and outcomes stay on the server until unlock.

Multipliers are based on split-adjusted calendar-year closes and are simplified for gameplay. They are not financial advice.

## Project structure

```text
src/
├── app/
│   ├── api/games/           # create, submit, unlock, room + leaderboard
│   ├── host/                # projector host screen
│   ├── play/                # room-code landing + /play/[roomCode]
│   ├── invest/              # legacy redirect to /play
│   ├── globals.css          # Tailwind v4 theme + slider styles
│   ├── layout.tsx
│   └── page.tsx             # landing page
├── components/
│   ├── host/                # host dashboard, QR + leaderboard
│   ├── play/                # join, allocation, locked, results
│   ├── invest/              # shared startup icon
│   ├── ui/                  # button styles, sparkline
│   ├── brand.tsx
│   ├── home-content.tsx
│   ├── site-header.tsx
│   └── site-footer.tsx
├── data/
│   └── startups.json        # 2015–2020 dataset + localized outcomes
└── lib/
    ├── game-client.ts       # browser API wrapper
    ├── game-types.ts        # shared API contracts
    ├── startup-types.ts     # player-safe types and constants
    ├── startups.ts          # server-only dataset access + calculations
    └── server/
        ├── api-response.ts
        ├── game-validation.ts
        └── supabase.ts      # server-only Supabase REST client
```

## Design notes

- Deep indigo (`#1E1B4B`) text, violet gradients (`#6366F1` → `#7C3AED`), and frosted glass cards (`bg-white/75 backdrop-blur-md`).
- Mobile-first player flow with large touch sliders; desktop/projector host layout with a scannable QR and wide leaderboard.
- The player device never renders company descriptions or historical hints.
- No real money, no sign-up, no WebSocket connection limits.
