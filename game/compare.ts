import type { CandidateChoice, GameRound, ModelJudgment } from "./types";

export function isPlayerCorrect(
  round: GameRound,
  choice: CandidateChoice,
): boolean {
  return choice === round.answer;
}

export function averagePercents(judgments: ModelJudgment[]): {
  averageA: number;
  averageB: number;
  averageOther: number;
} {
  if (judgments.length === 0) return { averageA: 0, averageB: 0, averageOther: 0 };
  const sumA = judgments.reduce((s, j) => s + j.percentA, 0);
  const sumB = judgments.reduce((s, j) => s + j.percentB, 0);
  const sumO = judgments.reduce((s, j) => s + j.percentOther, 0);
  const n = judgments.length;
  const averageA = Math.round(sumA / n);
  const averageB = Math.round(sumB / n);
  const averageOther = Math.max(0, 100 - averageA - averageB);
  return { averageA, averageB, averageOther: sumO ? Math.round(sumO / n) : averageOther };
}

export function getOpinionDifferenceComment(judgments: ModelJudgment[]): string {
  if (judgments.length < 2) {
    return "판정이 부족해 모델 간 비교를 할 수 없습니다.";
  }

  const aValues = judgments.map((j) => j.percentA);
  const spread = Math.max(...aValues) - Math.min(...aValues);
  const unanimous = judgments.every((j) => j.majority === judgments[0].majority);

  if (unanimous && spread <= 10) {
    return "세 모델이 같은 쪽을 골랐고, 확률도 비슷합니다.";
  }
  if (unanimous && spread > 10) {
    return `방향은 같지만 🅰️ 확률이 최대 ${spread}%p 차이 납니다.`;
  }
  if (!unanimous && spread <= 15) {
    return "다수결과 소수 의견이 갈렸지만, 확률 격차는 크지 않습니다.";
  }
  return `모델마다 의견이 엇갈렸고, 🅰️ 확률 차이는 최대 ${spread}%p입니다.`;
}
