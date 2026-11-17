import type { CreateGameResponse } from "@/lib/game-types";
import {
  gameError,
  gameJson,
  handleGameApiError,
  readJsonBody,
} from "@/lib/server/api-response";
import {
  generateRoomCode,
  generateUnlockCode,
  normalizeUnlockCode,
} from "@/lib/server/game-validation";
import {
  createGameRecord,
  SupabaseRequestError,
} from "@/lib/server/supabase";

const MAX_ROOM_ATTEMPTS = 5;

export async function POST(request: Request) {
  const body = await readJsonBody(request, { allowEmpty: true });

  if (!body) {
    return gameError("invalid_json", "A JSON body is required.", 400);
  }

  let unlockCode = generateUnlockCode();

  if (body.unlockCode !== undefined && body.unlockCode !== null) {
    const normalized = normalizeUnlockCode(body.unlockCode);

    if (!normalized) {
      return gameError(
        "invalid_unlock_code",
        "Unlock codes must be 4–12 letters or numbers.",
        400,
      );
    }

    unlockCode = normalized;
  }

  try {
    for (let attempt = 0; attempt < MAX_ROOM_ATTEMPTS; attempt += 1) {
      const roomCode = generateRoomCode();

      try {
        const game = await createGameRecord(roomCode, unlockCode);
        const payload: CreateGameResponse = { game };

        return gameJson(payload, 201);
      } catch (error) {
        const collision =
          error instanceof SupabaseRequestError &&
          (error.status === 409 || error.code === "23505");

        if (!collision) {
          throw error;
        }
      }
    }

    return gameError(
      "room_code_collision",
      "Could not generate a unique room code. Try again.",
      503,
    );
  } catch (error) {
    return handleGameApiError(error);
  }
}
