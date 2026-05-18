import type { ModelId } from "@/lib/prompts/word-probability";
import { tokenProbs } from "./probabilities";
import type { CandidateChoice, ModelJudgment } from "./types";

function pickMajority(percentA: number, percentB: number): CandidateChoice {
  if (percentA > percentB) return "A";
  if (percentB > percentA) return "B";
  return "A";
}

/** 붙여넣은 판정에서 🅰️/🅱️/(기타) 토큰 확률 % 추출 */
export function parseJudgmentText(text: string): {
  percentA: number;
  percentB: number;
  percentOther: number;
} | null {
  const normalized = text.replace(/\r\n/g, "\n");

  const otherMatch =
    normalized.match(/기타[^\d%]*?(\d{1,3})\s*%/) ??
    normalized.match(/other[^\d%]*?(\d{1,3})\s*%/i);

  const pairPatterns: RegExp[] = [
    /🅰️[^\d%]*?(\d{1,3})\s*%[\s\S]*?🅱️[^\d%]*?(\d{1,3})\s*%/,
    /🅰️\s*\|[^|]*\|[^|]*\|\s*(\d{1,3})\s*%[\s\S]*?🅱️\s*\|[^|]*\|[^|]*\|\s*(\d{1,3})\s*%/,
  ];

  for (const re of pairPatterns) {
    const m = normalized.match(re);
    if (m) {
      const a = clampPercent(Number(m[1]));
      const b = clampPercent(Number(m[2]));
      if (a === null || b === null) continue;
      if (otherMatch) {
        const o = clampPercent(Number(otherMatch[1]));
        if (o !== null) return reconcile(a, b, o);
      }
      return fromPairOnly(a, b);
    }
  }

  return null;
}

function fromPairOnly(a: number, b: number) {
  if (a + b <= 100) {
    return { percentA: a, percentB: b, percentOther: 100 - a - b };
  }
  const t = tokenProbs(a, b);
  return { percentA: t.a, percentB: t.b, percentOther: t.other };
}

function reconcile(a: number, b: number, other: number) {
  const sum = a + b + other;
  if (sum === 100) return { percentA: a, percentB: b, percentOther: other };
  if (sum < 100) return { percentA: a, percentB: b, percentOther: other + (100 - sum) };
  const scale = 100 / sum;
  return {
    percentA: Math.round(a * scale),
    percentB: Math.round(b * scale),
    percentOther: Math.round(other * scale),
  };
}

function clampPercent(n: number): number | null {
  if (!Number.isFinite(n) || n < 0 || n > 100) return null;
  return Math.round(n);
}

export function buildModelJudgment(
  model: ModelId,
  raw: string,
): ModelJudgment | null {
  const parsed = parseJudgmentText(raw);
  if (!parsed) return null;

  const { percentA, percentB, percentOther } = parsed;

  return {
    model,
    percentA,
    percentB,
    percentOther,
    majority: pickMajority(percentA, percentB),
    raw: raw.trim(),
  };
}
