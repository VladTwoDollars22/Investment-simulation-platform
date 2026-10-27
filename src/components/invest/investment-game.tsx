"use client";

import { useEffect, useState } from "react";
import { GameHud, type GamePhase } from "@/components/invest/game-hud";
import { IntroStage } from "@/components/invest/intro-stage";
import { InvestStage } from "@/components/invest/invest-stage";
import { ResultsStage } from "@/components/invest/results-stage";
import { SimulationStage } from "@/components/invest/simulation-stage";
import { historicalStartups } from "@/lib/invest-data";
import {
  remainingBudget,
  simulate,
  type InvestmentAmounts,
  type SimulationResult,
} from "@/lib/invest-sim";
import { clamp } from "@/lib/utils";

export function InvestmentGame() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [amounts, setAmounts] = useState<InvestmentAmounts>({});
  const [result, setResult] = useState<SimulationResult | null>(null);

  const currentStartup = historicalStartups[roundIndex];
  const remaining = remainingBudget(amounts);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase, roundIndex]);

  function startGame() {
    setAmounts({});
    setRoundIndex(0);
    setResult(null);
    setPhase("invest");
  }

  function lockInvestment(amount: number) {
    const safeAmount = clamp(Math.round(amount), 0, remaining);
    const nextAmounts = {
      ...amounts,
      [currentStartup.id]: safeAmount,
    };

    setAmounts(nextAmounts);

    if (roundIndex === historicalStartups.length - 1) {
      setResult(simulate(nextAmounts));
      setPhase("sim");
      return;
    }

    setRoundIndex((index) => index + 1);
  }

  function restartGame() {
    if (phase !== "intro") {
      const confirmed = window.confirm(
        "Restart the simulation? Your current portfolio will be lost.",
      );
      if (!confirmed) return;
    }

    setAmounts({});
    setRoundIndex(0);
    setResult(null);
    setPhase("intro");
  }

  return (
    <>
      <GameHud
        phase={phase}
        roundIndex={roundIndex}
        remaining={remaining}
        onRestart={restartGame}
      />

      {phase === "intro" && <IntroStage onStart={startGame} />}

      {phase === "invest" && (
        <InvestStage
          key={currentStartup.id}
          startup={currentStartup}
          roundIndex={roundIndex}
          amounts={amounts}
          remaining={remaining}
          onLock={lockInvestment}
        />
      )}

      {phase === "sim" && result && (
        <SimulationStage
          amounts={amounts}
          result={result}
          onDone={() => setPhase("results")}
        />
      )}

      {phase === "results" && result && (
        <ResultsStage result={result} onRestart={startGame} />
      )}
    </>
  );
}
