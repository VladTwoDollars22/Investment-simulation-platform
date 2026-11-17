import type { LeaderboardEntry } from "@/lib/game-types";

type DatabaseGame = {
  id: string;
  room_code: string;
  unlock_code: string;
  created_at: string;
};

type DatabaseSubmission = {
  id: string;
  game_id: string;
  player_name: string;
  allocations: Record<string, number>;
  uninvested_cash: number;
  final_balance: number;
  created_at: string;
};

type SupabaseErrorBody = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

export class SupabaseRequestError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "SupabaseRequestError";
    this.status = status;
    this.code = code;
  }
}

function supabaseConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    "";
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "";

  if (!url || !secretKey) {
    throw new SupabaseConfigError(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY to the environment.",
    );
  }

  return {
    url: url.replace(/\/+$/, ""),
    secretKey,
  };
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit & { prefer?: string } = {},
): Promise<{ data: T; response: Response }> {
  const { url, secretKey } = supabaseConfig();
  const headers = new Headers(init.headers);

  headers.set("apikey", secretKey);
  headers.set("Authorization", `Bearer ${secretKey}`);
  headers.set("Content-Type", "application/json");

  if (init.prefer) {
    headers.set("Prefer", init.prefer);
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let body: SupabaseErrorBody = {};

    try {
      body = (await response.json()) as SupabaseErrorBody;
    } catch {
      body = {};
    }

    throw new SupabaseRequestError(
      response.status,
      body.message ?? `Supabase request failed with status ${response.status}.`,
      body.code,
    );
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : ([] as T);

  return { data, response };
}

function mapGame(game: DatabaseGame) {
  return {
    id: game.id,
    roomCode: game.room_code,
    unlockCode: game.unlock_code,
    createdAt: game.created_at,
  };
}

function mapSubmission(submission: DatabaseSubmission) {
  return {
    id: submission.id,
    gameId: submission.game_id,
    playerName: submission.player_name,
    allocations: submission.allocations,
    uninvestedCash: Number(submission.uninvested_cash),
    finalBalance: Number(submission.final_balance),
    createdAt: submission.created_at,
  };
}

export async function createGameRecord(roomCode: string, unlockCode: string) {
  const { data } = await supabaseRequest<DatabaseGame[]>("games", {
    method: "POST",
    body: JSON.stringify({
      room_code: roomCode,
      unlock_code: unlockCode,
    }),
    prefer: "return=representation",
  });

  const created = data[0];
  if (!created) {
    throw new SupabaseRequestError(502, "Supabase did not return the new room.");
  }

  return mapGame(created);
}

export async function getGameByRoomCode(roomCode: string) {
  const query = new URLSearchParams({
    room_code: `eq.${roomCode}`,
    select: "id,room_code,unlock_code,created_at",
    limit: "1",
  });
  const { data } = await supabaseRequest<DatabaseGame[]>(`games?${query}`);

  const game = data[0];
  return game ? mapGame(game) : null;
}

export async function upsertSubmission({
  gameId,
  playerName,
  allocations,
  uninvestedCash,
  finalBalance,
}: {
  gameId: string;
  playerName: string;
  allocations: Record<string, number>;
  uninvestedCash: number;
  finalBalance: number;
}) {
  const query = new URLSearchParams({
    on_conflict: "game_id,player_name",
  });
  const { data } = await supabaseRequest<DatabaseSubmission[]>(
    `submissions?${query}`,
    {
      method: "POST",
      body: JSON.stringify({
        game_id: gameId,
        player_name: playerName,
        allocations,
        uninvested_cash: uninvestedCash,
        final_balance: finalBalance,
      }),
      prefer: "resolution=merge-duplicates,return=representation",
    },
  );

  const submission = data[0];
  if (!submission) {
    throw new SupabaseRequestError(
      502,
      "Supabase did not return the saved submission.",
    );
  }

  return mapSubmission(submission);
}

export async function getSubmissionById(
  gameId: string,
  submissionId: string,
) {
  const query = new URLSearchParams({
    id: `eq.${submissionId}`,
    game_id: `eq.${gameId}`,
    select:
      "id,game_id,player_name,allocations,uninvested_cash,final_balance,created_at",
    limit: "1",
  });
  const { data } = await supabaseRequest<DatabaseSubmission[]>(
    `submissions?${query}`,
  );

  const submission = data[0];
  return submission ? mapSubmission(submission) : null;
}

export async function getSubmissionByPlayerName(
  gameId: string,
  playerName: string,
) {
  const query = new URLSearchParams({
    game_id: `eq.${gameId}`,
    player_name: `eq.${playerName}`,
    select:
      "id,game_id,player_name,allocations,uninvested_cash,final_balance,created_at",
    order: "created_at.desc",
    limit: "1",
  });
  const { data } = await supabaseRequest<DatabaseSubmission[]>(
    `submissions?${query}`,
  );

  const submission = data[0];
  return submission ? mapSubmission(submission) : null;
}

export async function listLeaderboard(
  gameId: string,
): Promise<LeaderboardEntry[]> {
  const query = new URLSearchParams({
    game_id: `eq.${gameId}`,
    select: "id,player_name,uninvested_cash,final_balance,created_at",
    order: "final_balance.desc,created_at.asc",
  });
  const { data } = await supabaseRequest<
    Array<
      Pick<
        DatabaseSubmission,
        "id" | "player_name" | "uninvested_cash" | "final_balance" | "created_at"
      >
    >
  >(`submissions?${query}`);

  return data.map((submission) => ({
    id: submission.id,
    playerName: submission.player_name,
    uninvestedCash: Number(submission.uninvested_cash),
    finalBalance: Number(submission.final_balance),
    createdAt: submission.created_at,
  }));
}
