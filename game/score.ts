import type { ModelId } from "@/lib/prompts/word-probability";
import { buildModelJudgment } from "./parse-judgment";
import { averagePercents, isPlayerCorrect } from "./compare";
import type { CandidateChoice, GameRound, RoundResult } from "./types";

export function resolveRound(
  round: GameRound,
  playerChoice: CandidateChoice,
  pastes: Record<ModelId, string>,
): {
  result: RoundResult;
  parseErrors: ModelId[];
} {
  const parseErrors: ModelId[] = [];
  const judgments = (Object.keys(pastes) as ModelId[])
    .map((model) => {
      const raw = pastes[model]?.trim() ?? "";
      if (!raw) {
        parseErrors.push(model);
        return null;
      }
      const j = buildModelJudgment(model, raw);
      if (!j) parseErrors.push(model);
      return j;
    })
    .filter((j): j is NonNullable<typeof j> => j !== null);

  const { averageA, averageB, averageOther } = averagePercents(judgments);
  const averageMajority: CandidateChoice = averageA >= averageB ? "A" : "B";

  const result: RoundResult = {
    round,
    playerChoice,
    playerCorrect: isPlayerCorrect(round, playerChoice),
    judgments,
    averageA,
    averageB,
    averageOther,
    averageMajority,
  };

  return { result, parseErrors };
}

export function countScore(results: RoundResult[]): number {
  return results.filter((r) => r.playerCorrect).length;
}
