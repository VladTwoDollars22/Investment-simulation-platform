import type { PublicGameInfo } from "@/lib/game-types";
import {
  gameError,
  gameJson,
  handleGameApiError,
} from "@/lib/server/api-response";
import { normalizeRoomCode } from "@/lib/server/game-validation";
import {
  getGameByRoomCode,
  listLeaderboard,
} from "@/lib/server/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomCode: string }> },
) {
  const { roomCode: rawRoomCode } = await params;
  const roomCode = normalizeRoomCode(rawRoomCode);

  if (!roomCode) {
    return gameError(
      "invalid_room_code",
      "Room codes must be 4–6 letters or numbers.",
      400,
    );
  }

  try {
    const game = await getGameByRoomCode(roomCode);

    if (!game) {
      return gameError("room_not_found", "That room does not exist.", 404);
    }

    const submissions = await listLeaderboard(game.id);
    const payload: PublicGameInfo = {
      roomCode,
      exists: true,
      submissionCount: submissions.length,
      createdAt: game.createdAt,
    };

    return gameJson(payload);
  } catch (error) {
    return handleGameApiError(error);
  }
}
