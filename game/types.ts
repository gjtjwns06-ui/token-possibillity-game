import type { ModelId } from "@/lib/prompts/word-probability";

export type Difficulty = "easy" | "medium" | "hard";
export type CandidateChoice = "A" | "B";

/** 빈칸 다음 토큰 분포 — a + b + other = 100 */
export interface TokenProbs {
  a: number;
  b: number;
  other: number;
}

export interface ModelTokenProbs {
  gpt: TokenProbs;
  claude: TokenProbs;
  gemini: TokenProbs;
}

export interface GameRound {
  id: number;
  difficulty: Difficulty;
  before: string;
  after: string;
  candidateA: string;
  hintA: string;
  candidateB: string;
  hintB: string;
  imageA: string;
  imageB: string;
  imageCreditA?: string;
  imageCreditB?: string;
  answer: CandidateChoice;
  completedSentence: string;
  modelProbs: ModelTokenProbs;
}

export interface ModelJudgment {
  model: ModelId;
  percentA: number;
  percentB: number;
  percentOther: number;
  majority: CandidateChoice;
  raw: string;
}

export interface RoundAverages {
  gpt: TokenProbs;
  claude: TokenProbs;
  gemini: TokenProbs;
  final: TokenProbs;
  /** 🅰️ vs 🅱️ 중 더 높은 토큰 확률 */
  finalAnswer: CandidateChoice;
}

export interface RoundResult {
  round: GameRound;
  playerChoice: CandidateChoice;
  playerCorrect: boolean;
  judgments: ModelJudgment[];
  averageA: number;
  averageB: number;
  averageOther: number;
  averageMajority: CandidateChoice;
}

export type GamePhase =
  | "idle"
  | "playing"
  | "revealed"
  | "finished";
