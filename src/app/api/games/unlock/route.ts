import type { UnlockResponse } from "@/lib/game-types";
import {
  gameError,
  gameJson,
  handleGameApiError,
  readJsonBody,
} from "@/lib/server/api-response";
import {
  normalizePlayerName,
  normalizeRoomCode,
  normalizeUnlockCode,
  unlockCodeMatches,
} from "@/lib/server/game-validation";
import { buildPortfolioResult } from "@/lib/startups";
import {
  STARTUP_LOCALES,
  STARTING_BUDGET,
  type StartupLocale,
} from "@/lib/startup-types";
import {
  getGameByRoomCode,
  getSubmissionById,
  getSubmissionByPlayerName,
} from "@/lib/server/supabase";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveLanguage(value: unknown): StartupLocale {
  return typeof value === "string" &&
    (STARTUP_LOCALES as readonly string[]).includes(value)
    ? (value as StartupLocale)
    : "en";
}

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

  const unlockCode = normalizeUnlockCode(body.unlockCode);
  if (!unlockCode) {
    return gameError(
      "invalid_unlock_code",
      "Unlock codes must be 4–12 letters or numbers.",
      400,
    );
  }

  const language = resolveLanguage(body.language);

  try {
    const game = await getGameByRoomCode(roomCode);

    if (!game) {
      return gameError("room_not_found", "That room does not exist.", 404);
    }

    if (!unlockCodeMatches(unlockCode, game.unlockCode)) {
      return gameError(
        "invalid_unlock_code",
        "That unlock code is not correct for this room.",
        401,
      );
    }

    const submissionId =
      typeof body.submissionId === "string" &&
      UUID_PATTERN.test(body.submissionId)
        ? body.submissionId
        : null;
    const playerNameFromBody = normalizePlayerName(body.playerName);

    let submission = submissionId
      ? await getSubmissionById(game.id, submissionId)
      : null;

    if (!submission && playerNameFromBody) {
      submission = await getSubmissionByPlayerName(
        game.id,
        playerNameFromBody,
      );
    }

    if (!submission) {
      return gameError(
        "submission_not_found",
        "No matching submission was found in this room.",
        404,
      );
    }

    const result = buildPortfolioResult(
      submission.allocations,
      submission.uninvestedCash,
    );

    const payload: UnlockResponse = {
      roomCode,
      playerName: submission.playerName,
      submittedAt: submission.createdAt,
      language,
      startingBudget: STARTING_BUDGET,
      totalInvested: result.invested,
      investedValue: result.investedValue,
      uninvestedCash: result.uninvestedCash,
      finalBalance: result.finalBalance,
      profit: result.profit,
      roi: result.roi,
      series: result.series,
      breakdown: result.breakdown,
    };

    return gameJson(payload);
  } catch (error) {
    return handleGameApiError(error);
  }
}
