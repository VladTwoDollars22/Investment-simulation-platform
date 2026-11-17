import type {
  StartupLocale,
  StartupOutcome,
} from "@/lib/startup-types";

export type GameRoom = {
  id: string;
  roomCode: string;
  createdAt: string;
};

export type CreatedGame = GameRoom & {
  unlockCode: string;
};

export type CreateGameResponse = {
  game: CreatedGame;
};

export type PublicGameInfo = {
  roomCode: string;
  exists: boolean;
  submissionCount: number;
  createdAt: string;
};

export type SubmitGameRequest = {
  roomCode: string;
  playerName: string;
  allocations: Record<string, number>;
  uninvestedCash: number;
};

export type SubmissionSummary = {
  id: string;
  roomCode: string;
  playerName: string;
  createdAt: string;
};

export type SubmitGameResponse = {
  submission: SubmissionSummary;
};

export type UnlockRequest = {
  roomCode: string;
  submissionId?: string;
  playerName?: string;
  unlockCode: string;
  language?: StartupLocale;
};

export type UnlockBreakdownItem = {
  startupId: string;
  allocation: number;
  multiplier2015to2020: number;
  finalValue: number;
  profit: number;
  timeline: number[];
  outcomes: Record<StartupLocale, StartupOutcome>;
};

export type UnlockResponse = {
  roomCode: string;
  playerName: string;
  submittedAt: string;
  language: StartupLocale;
  startingBudget: number;
  totalInvested: number;
  investedValue: number;
  uninvestedCash: number;
  finalBalance: number;
  profit: number;
  roi: number;
  series: number[];
  breakdown: UnlockBreakdownItem[];
};

export type LeaderboardEntry = {
  id: string;
  playerName: string;
  finalBalance: number;
  uninvestedCash: number;
  createdAt: string;
};

export type LeaderboardResponse = {
  roomCode: string;
  submissions: LeaderboardEntry[];
};

export type GameApiErrorCode =
  | "invalid_json"
  | "invalid_room_code"
  | "invalid_unlock_code"
  | "invalid_player_name"
  | "invalid_allocations"
  | "budget_exceeded"
  | "cash_mismatch"
  | "room_not_found"
  | "submission_not_found"
  | "room_code_collision"
  | "server_config"
  | "server_error";

export type GameApiError = {
  error: {
    code: GameApiErrorCode;
    message: string;
  };
};
