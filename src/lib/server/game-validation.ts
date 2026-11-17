import { randomInt, timingSafeEqual } from "node:crypto";
import { roundMoney, STARTING_BUDGET } from "@/lib/startup-types";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_PATTERN = /^[A-Z0-9]{4,6}$/;
const UNLOCK_CODE_PATTERN = /^[A-Z0-9]{4,12}$/;

export type AllocationValidation =
  | { ok: true; allocations: Record<string, number>; total: number }
  | { ok: false; code: "invalid_allocations" | "budget_exceeded" };

function randomCode(length: number) {
  let code = "";

  for (let index = 0; index < length; index += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }

  return code;
}

export function generateRoomCode() {
  return randomCode(5);
}

export function generateUnlockCode() {
  return randomCode(6);
}

export function normalizeRoomCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return ROOM_CODE_PATTERN.test(normalized) ? normalized : null;
}

export function normalizeUnlockCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return UNLOCK_CODE_PATTERN.test(normalized) ? normalized : null;
}

export function normalizePlayerName(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length < 2 || normalized.length > 30) return null;

  return normalized;
}

export function sanitizeAllocations(
  value: unknown,
  validStartupIds: string[],
): AllocationValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, code: "invalid_allocations" };
  }

  const allowed = new Set(validStartupIds);
  const allocations: Record<string, number> = {};
  let total = 0;

  for (const [startupId, rawAmount] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (!allowed.has(startupId)) {
      return { ok: false, code: "invalid_allocations" };
    }

    if (
      typeof rawAmount !== "number" ||
      !Number.isFinite(rawAmount) ||
      rawAmount < 0 ||
      rawAmount > STARTING_BUDGET
    ) {
      return { ok: false, code: "invalid_allocations" };
    }

    const amount = roundMoney(rawAmount);
    total = roundMoney(total + amount);

    if (amount > 0) {
      allocations[startupId] = amount;
    }
  }

  if (total > STARTING_BUDGET) {
    return { ok: false, code: "budget_exceeded" };
  }

  return { ok: true, allocations, total };
}

export function uninvestedCashMatches(
  value: unknown,
  allocationsTotal: number,
) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return false;
  }

  const expected = roundMoney(STARTING_BUDGET - allocationsTotal);
  return Math.abs(roundMoney(value) - expected) < 0.005;
}

export function unlockCodeMatches(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided.toUpperCase(), "utf8");
  const expectedBuffer = Buffer.from(expected.toUpperCase(), "utf8");

  if (providedBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
