"use client";

import { useEffect, useState } from "react";
import { AllocationStep } from "@/components/play/allocation-step";
import { JoinStep } from "@/components/play/join-step";
import { LockedStep } from "@/components/play/locked-step";
import { PlayStepper, type PlayStep } from "@/components/play/play-stepper";
import { ResultsStep } from "@/components/play/results-step";
import type {
  SubmissionSummary,
  UnlockResponse,
} from "@/lib/game-types";
import { submitGame } from "@/lib/game-client";
import {
  STARTING_BUDGET,
  type StartupCard,
} from "@/lib/startup-types";

const PLAYER_KEY = "starcup.playerName";
const submissionKey = (roomCode: string) =>
  `starcup.submission.${roomCode}`;

function readStoredSubmission(roomCode: string): SubmissionSummary | null {
  try {
    const raw = window.localStorage.getItem(submissionKey(roomCode));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SubmissionSummary>;

    if (
      typeof parsed.id === "string" &&
      typeof parsed.playerName === "string" &&
      parsed.roomCode === roomCode
    ) {
      return {
        id: parsed.id,
        playerName: parsed.playerName,
        roomCode,
        createdAt:
          typeof parsed.createdAt === "string"
            ? parsed.createdAt
            : new Date().toISOString(),
      };
    }

    return null;
  } catch {
    return null;
  }
}

function totalAllocated(amounts: Record<string, number>) {
  return Object.values(amounts).reduce((sum, amount) => sum + amount, 0);
}

export function PlayGame({
  roomCode,
  startups,
}: {
  roomCode: string;
  startups: StartupCard[];
}) {
  const [step, setStep] = useState<PlayStep>("join");
  const [playerName, setPlayerName] = useState("");
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [submission, setSubmission] = useState<SubmissionSummary | null>(
    null,
  );
  const [unlocked, setUnlocked] = useState<UnlockResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let storedName = "";

      try {
        storedName = window.localStorage.getItem(PLAYER_KEY) ?? "";
      } catch {
        storedName = "";
      }

      if (storedName) setPlayerName(storedName);

      const storedSubmission = readStoredSubmission(roomCode);

      if (storedSubmission) {
        setPlayerName(storedSubmission.playerName);
        setSubmission(storedSubmission);
        setStep("locked");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [roomCode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function handleJoined(name: string) {
    setPlayerName(name);
    setStep("allocate");

    try {
      window.localStorage.setItem(PLAYER_KEY, name);
    } catch {
      // Storage can be unavailable in private mode; the game still works.
    }
  }

  function handleAllocation(startupId: string, amount: number) {
    setSubmitError(false);
    setAmounts((current) => {
      const others = Object.entries(current).reduce(
        (sum, [id, value]) => (id === startupId ? sum : sum + value),
        0,
      );
      const maxForStartup = STARTING_BUDGET - others;
      const normalized = Math.round(amount / 500) * 500;
      const safe = Math.min(Math.max(normalized, 0), maxForStartup);

      return { ...current, [startupId]: safe };
    });
  }

  async function handleSubmit() {
    const total = totalAllocated(amounts);
    const uninvestedCash = STARTING_BUDGET - total;

    setSubmitting(true);
    setSubmitError(false);

    try {
      const saved = await submitGame({
        roomCode,
        playerName,
        allocations: amounts,
        uninvestedCash,
      });

      setSubmission(saved);

      try {
        window.localStorage.setItem(
          submissionKey(roomCode),
          JSON.stringify(saved),
        );
      } catch {
        // Recovery is optional; the current session still has the submission.
      }

      setStep("locked");
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-10 size-[380px] rounded-full bg-[#6366F1]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-10 size-[320px] rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="shell relative py-6 md:py-10">
        <PlayStepper current={step} />

        <div className="mt-6 md:mt-8">
          {step === "join" && (
            <JoinStep
              key={playerName}
              roomCode={roomCode}
              initialName={playerName}
              onJoined={handleJoined}
            />
          )}

          {step === "allocate" && (
            <AllocationStep
              roomCode={roomCode}
              playerName={playerName}
              startups={startups}
              amounts={amounts}
              onAllocationChange={handleAllocation}
              onSubmit={() => void handleSubmit()}
              submitting={submitting}
              submitError={submitError}
            />
          )}

          {step === "locked" && (
            <LockedStep
              roomCode={roomCode}
              playerName={playerName}
              submission={submission}
              onUnlocked={(payload) => {
                setUnlocked(payload);
                setStep("results");
              }}
            />
          )}

          {step === "results" && unlocked && (
            <ResultsStep
              roomCode={roomCode}
              playerName={playerName}
              startups={startups}
              result={unlocked}
            />
          )}
        </div>
      </div>
    </div>
  );
}

