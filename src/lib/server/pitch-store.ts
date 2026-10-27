import { promises as fs } from "node:fs";
import path from "node:path";
import type { PitchCard, Vote } from "@/lib/pitch-types";

type PersistedBoard = {
  startups: PitchCard[];
  votes: Vote[];
};

type StoreState = {
  data: PersistedBoard | null;
  persistent: boolean;
  writeChain: Promise<void>;
  warned: boolean;
};

const globalForStore = globalThis as unknown as {
  __ventureUPitchStore?: StoreState;
};

const state: StoreState =
  globalForStore.__ventureUPitchStore ??
  (globalForStore.__ventureUPitchStore = {
    data: null,
    persistent: true,
    writeChain: Promise.resolve(),
    warned: false,
  });

const MAX_STARTUPS = 200;
const MAX_VOTES = 50_000;

function dataFile() {
  return (
    process.env.PITCH_DATA_FILE ??
    path.join(process.cwd(), "data", "pitch-board.json")
  );
}

async function load(): Promise<PersistedBoard> {
  if (state.data) return state.data;

  try {
    const raw = await fs.readFile(/* turbopackIgnore: true */ dataFile(), "utf8");
    const parsed = JSON.parse(raw) as Partial<PersistedBoard>;
    state.data = {
      startups: Array.isArray(parsed.startups) ? parsed.startups : [],
      votes: Array.isArray(parsed.votes) ? parsed.votes : [],
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT" && !state.warned) {
      console.warn(
        "[starcup] Could not read pitch board data. Starting fresh.",
        error,
      );
      state.warned = true;
    }
    state.data = { startups: [], votes: [] };
  }

  return state.data;
}

async function persist() {
  if (!state.data) return;

  try {
    const file = dataFile();
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(state.data, null, 2), "utf8");
    state.persistent = true;
  } catch (error) {
    state.persistent = false;
    if (!state.warned) {
      console.warn(
        "[starcup] Pitch board is running in memory-only mode. Set PITCH_DATA_FILE to a writable path to persist submissions.",
        error,
      );
      state.warned = true;
    }
  }
}

function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const run = state.writeChain.then(operation, operation);
  state.writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function getBoard() {
  await state.writeChain;
  const data = await load();
  return {
    startups: data.startups,
    votes: data.votes,
    persistent: state.persistent,
  };
}

export function addStartup(card: PitchCard) {
  return withWriteLock(async () => {
    const data = await load();
    if (data.startups.length >= MAX_STARTUPS) {
      throw new Error("The pitch board is full for this event.");
    }
    if (data.startups.some((startup) => startup.id === card.id)) {
      throw new Error("That startup already exists on the board.");
    }
    data.startups.push(card);
    await persist();
    return { startup: card, persistent: state.persistent };
  });
}

export function castVote(vote: Vote) {
  return withWriteLock(async () => {
    const data = await load();
    const existing = data.votes.find(
      (entry) =>
        entry.voterId === vote.voterId && entry.startupId === vote.startupId,
    );

    if (existing) {
      existing.decision = vote.decision;
      existing.createdAt = vote.createdAt;
    } else {
      if (data.votes.length >= MAX_VOTES) {
        throw new Error("The vote limit for this event has been reached.");
      }
      data.votes.push(vote);
    }

    await persist();
    return { vote: existing ?? vote, persistent: state.persistent };
  });
}

export function removeVotes(voterId: string, startupId?: string) {
  return withWriteLock(async () => {
    const data = await load();
    const before = data.votes.length;
    data.votes = data.votes.filter(
      (vote) =>
        !(
          vote.voterId === voterId &&
          (startupId === undefined || vote.startupId === startupId)
        ),
    );
    const removed = before - data.votes.length;
    if (removed > 0) await persist();
    return { removed, persistent: state.persistent };
  });
}
