import type {
  CreateGameResponse,
  CreatedGame,
  GameApiError,
  GameApiErrorCode,
  LeaderboardResponse,
  PublicGameInfo,
  SubmitGameRequest,
  SubmitGameResponse,
  UnlockRequest,
  UnlockResponse,
} from "@/lib/game-types";

export class GameClientError extends Error {
  code: GameApiErrorCode | "network";

  constructor(code: GameApiErrorCode | "network", message: string) {
    super(message);
    this.name = "GameClientError";
    this.code = code;
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = (payload as GameApiError | null)?.error;
    throw new GameClientError(
      error?.code ?? "server_error",
      error?.message ?? "The game server returned an error.",
    );
  }

  return payload as T;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    response = await fetch(input, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new GameClientError(
      "network",
      "Could not reach the game server.",
    );
  } finally {
    clearTimeout(timeout);
  }

  return readResponse<T>(response);
}

export async function createGame(unlockCode?: string) {
  const payload = await request<CreateGameResponse>("/api/games/create", {
    method: "POST",
    body: JSON.stringify(unlockCode ? { unlockCode } : {}),
  });

  return payload.game as CreatedGame;
}

export async function checkRoom(roomCode: string) {
  return request<PublicGameInfo>(
    `/api/games/${encodeURIComponent(roomCode)}`,
  );
}

export async function submitGame(body: SubmitGameRequest) {
  const payload = await request<SubmitGameResponse>("/api/games/submit", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return payload.submission;
}

export async function unlockGame(body: UnlockRequest) {
  return request<UnlockResponse>("/api/games/unlock", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchLeaderboard(roomCode: string) {
  return request<LeaderboardResponse>(
    `/api/games/${encodeURIComponent(roomCode)}/leaderboard`,
  );
}
