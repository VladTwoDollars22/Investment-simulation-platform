"use client";

import { useEffect, useMemo, useState } from "react";
import { GameHud, type GamePhase } from "@/components/invest/game-hud";
import { IntroStage } from "@/components/invest/intro-stage";
import { InvestStage } from "@/components/invest/invest-stage";
import { ResultsStage } from "@/components/invest/results-stage";
import { SimulationStage } from "@/components/invest/simulation-stage";
import { localizeStartups } from "@/lib/invest-data";
import {
  remainingBudget,
  simulate,
  type InvestmentAmounts,
  type SimulationResult,
} from "@/lib/invest-sim";
import { useI18n } from "@/lib/i18n";
import { clamp } from "@/lib/utils";

export function InvestmentGame() {
  const { dict } = useI18n();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [amounts, setAmounts] = useState<InvestmentAmounts>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const startups = useMemo(() => localizeStartups(dict), [dict]);

  const currentStartup = startups[roundIndex];
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

    if (roundIndex === startups.length - 1) {
      setResult(simulate(nextAmounts));
      setPhase("sim");
      return;
    }

    setRoundIndex((index) => index + 1);
  }

  function restartGame() {
    if (phase !== "intro") {
      const confirmed = window.confirm(dict.invest.results.restartConfirm);
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
