import type {
  CandidateChoice,
  Difficulty,
  ModelTokenProbs,
  TokenProbs,
} from "./types";

/** 🅰️ + 🅱️ + 기타 = 100% (전체 다음 토큰 분포) */
export function tokenProbs(a: number, b: number): TokenProbs {
  let ai = Math.max(0, Math.min(97, Math.round(a)));
  let bi = Math.max(0, Math.min(97, Math.round(b)));
  if (ai + bi > 98) {
    const scale = 98 / (ai + bi);
    ai = Math.round(ai * scale);
    bi = Math.round(bi * scale);
  }
  return { a: ai, b: bi, other: 100 - ai - bi };
}

export function buildModelProbs(
  difficulty: Difficulty,
  answer: CandidateChoice,
): ModelTokenProbs {
  const tier =
    difficulty === "easy"
      ? { favored: 46, other: 7 }
      : difficulty === "medium"
        ? { favored: 36, other: 11 }
        : { favored: 30, other: 24 };

  const aBase = answer === "A" ? tier.favored : tier.other;
  const bBase = answer === "A" ? tier.other : tier.favored;

  return {
    gpt: tokenProbs(aBase, bBase),
    claude: tokenProbs(aBase + 3, Math.max(4, bBase - 1)),
    gemini: tokenProbs(Math.max(4, aBase - 2), bBase + 2),
  };
}

export function sumTokenProbs(p: TokenProbs): number {
  return p.a + p.b + p.other;
}
