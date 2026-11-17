import type { GameApiErrorCode } from "@/lib/game-types";
import {
  SupabaseConfigError,
  SupabaseRequestError,
} from "@/lib/server/supabase";

const NO_STORE = {
  "Cache-Control": "no-store, max-age=0",
};

export function gameError(
  code: GameApiErrorCode,
  message: string,
  status: number,
) {
  return Response.json(
    { error: { code, message } },
    { status, headers: NO_STORE },
  );
}

export function gameJson<T>(data: T, status = 200) {
  return Response.json(data, { status, headers: NO_STORE });
}

export function handleGameApiError(error: unknown) {
  if (error instanceof SupabaseConfigError) {
    console.error("[starcup] Supabase configuration error:", error.message);
    return gameError(
      "server_config",
      "The game database is not configured on this server.",
      503,
    );
  }

  if (error instanceof SupabaseRequestError) {
    console.error(
      "[starcup] Supabase request failed:",
      error.status,
      error.code,
      error.message,
    );
    return gameError("server_error", "The game database request failed.", 502);
  }

  console.error("[starcup] Unexpected game API error:", error);
  return gameError("server_error", "Something went wrong.", 500);
}

export async function readJsonBody(
  request: Request,
  options: { allowEmpty?: boolean } = {},
) {
  let raw: string;

  try {
    raw = await request.text();
  } catch {
    return null;
  }

  if (!raw.trim()) {
    return options.allowEmpty ? {} : null;
  }

  try {
    const body = JSON.parse(raw) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}
