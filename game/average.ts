import type {
  CandidateChoice,
  GameRound,
  ModelTokenProbs,
  RoundAverages,
  TokenProbs,
} from "./types";

function averageTokenProbs(probs: ModelTokenProbs): TokenProbs {
  const a = Math.round((probs.gpt.a + probs.claude.a + probs.gemini.a) / 3);
  const b = Math.round((probs.gpt.b + probs.claude.b + probs.gemini.b) / 3);
  const other = Math.max(0, 100 - a - b);
  return { a, b, other };
}

export function computeRoundAverages(round: GameRound): RoundAverages {
  const final = averageTokenProbs(round.modelProbs);

  return {
    gpt: round.modelProbs.gpt,
    claude: round.modelProbs.claude,
    gemini: round.modelProbs.gemini,
    final,
    finalAnswer: final.a >= final.b ? "A" : "B",
  };
}

export function percentForChoice(
  averages: RoundAverages,
  choice: CandidateChoice,
): number {
  const p = averages.final;
  if (choice === "A") return p.a;
  if (choice === "B") return p.b;
  return p.other;
}

export function modelPercentForChoice(
  probs: TokenProbs,
  choice: CandidateChoice | "other",
): number {
  if (choice === "A") return probs.a;
  if (choice === "B") return probs.b;
  return probs.other;
}
