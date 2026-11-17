import type { SubmitGameResponse } from "@/lib/game-types";
import {
  gameError,
  gameJson,
  handleGameApiError,
  readJsonBody,
} from "@/lib/server/api-response";
import {
  normalizePlayerName,
  normalizeRoomCode,
  sanitizeAllocations,
  uninvestedCashMatches,
} from "@/lib/server/game-validation";
import {
  buildPortfolioResult,
  startupIds,
} from "@/lib/startups";
import { roundMoney, STARTING_BUDGET } from "@/lib/startup-types";
import {
  getGameByRoomCode,
  upsertSubmission,
} from "@/lib/server/supabase";

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body) {
    return gameError("invalid_json", "A JSON body is required.", 400);
  }

  const roomCode = normalizeRoomCode(body.roomCode);
  if (!roomCode) {
    return gameError(
      "invalid_room_code",
      "Room codes must be 4–6 letters or numbers.",
      400,
    );
  }

  const playerName = normalizePlayerName(body.playerName);
  if (!playerName) {
    return gameError(
      "invalid_player_name",
      "Player names must be 2–30 characters.",
      400,
    );
  }

  const sanitized = sanitizeAllocations(body.allocations, startupIds);
  if (!sanitized.ok) {
    return gameError(
      sanitized.code,
      sanitized.code === "budget_exceeded"
        ? "Allocations cannot exceed the $10,000 starting budget."
        : "Allocations must map known startups to non-negative amounts.",
      400,
    );
  }

  if (!uninvestedCashMatches(body.uninvestedCash, sanitized.total)) {
    return gameError(
      "cash_mismatch",
      "Uninvested cash must equal the starting budget minus allocations.",
      400,
    );
  }

  try {
    const game = await getGameByRoomCode(roomCode);

    if (!game) {
      return gameError("room_not_found", "That room does not exist.", 404);
    }

    const uninvestedCash = roundMoney(STARTING_BUDGET - sanitized.total);
    const result = buildPortfolioResult(
      sanitized.allocations,
      uninvestedCash,
    );

    const submission = await upsertSubmission({
      gameId: game.id,
      playerName,
      allocations: sanitized.allocations,
      uninvestedCash,
      finalBalance: result.finalBalance,
    });

    const payload: SubmitGameResponse = {
      submission: {
        id: submission.id,
        roomCode,
        playerName: submission.playerName,
        createdAt: submission.createdAt,
      },
    };

    return gameJson(payload, 201);
  } catch (error) {
    return handleGameApiError(error);
  }
}
