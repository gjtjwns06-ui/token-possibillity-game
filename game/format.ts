import type { ModelId } from "@/lib/prompts/word-probability";
import { ROUNDS_PER_SESSION } from "./pick-rounds";
import type {
  CandidateChoice,
  GameRound,
  ModelJudgment,
  RoundResult,
} from "./types";
import { getOpinionDifferenceComment } from "./compare";

const MODEL_EMOJI: Record<ModelId, string> = {
  gpt: "🤖 GPT",
  claude: "🟣 Claude",
  gemini: "🔵 Gemini",
};

export function maskedSentence(round: GameRound): string {
  return `${round.before} [?????] ${round.after}`;
}

export function formatRoundForModels(round: GameRound): string {
  return `문장: ${maskedSentence(round)}

🅰️ ${round.candidateA} (${round.hintA})
🅱️ ${round.candidateB} (${round.hintB})`;
}

export function formatRoundDisplay(round: GameRound): string {
  const n = round.id;
  return `---
### 🎮 라운드 ${n} / ${ROUNDS_PER_SESSION}

**문장:** "${maskedSentence(round)}"

**두 후보 중 어느 쪽이 이 자리에 올 확률이 더 높을까요?**

| | 단어 | 힌트 |
|--|------|------|
| 🅰️ | ${round.candidateA} | ${round.hintA} |
| 🅱️ | ${round.candidateB} | ${round.hintB} |

👉 A와 B 중 선택하세요.
그리고 GPT, Claude, Gemini에 이 라운드 내용을 복사해서
각각의 확률 판정을 받아 여기에 붙여넣어 주세요!

---`;
}

export function formatFinalComparison(
  result: RoundResult,
  score: number,
): string {
  const { round, playerChoice, playerCorrect, judgments, averageA, averageB } =
    result;
  const wordA = round.candidateA;
  const wordB = round.candidateB;
  const avgMajority: CandidateChoice = averageA >= averageB ? "A" : "B";
  const avgMatch =
    avgMajority === round.answer ? "✅" : "❌";

  const rows = judgments
    .map((j) => {
      const label = MODEL_EMOJI[j.model];
      return `| ${label} | ${j.percentA}% | ${j.percentB}% | ${j.majority} |`;
    })
    .join("\n");

  const playerLabel = playerChoice === "A" ? "A" : "B";
  const playerMark = playerCorrect ? "✅" : "❌";

  return `### ✅ 최종 비교표 — 라운드 ${round.id}

**정답 문장:** "${round.completedSentence}"

| 모델 | 🅰️ (${wordA}) | 🅱️ (${wordB}) | 다수결 정답 |
|------|-----------|-----------|-----------|
${rows}
| **평균** | **${averageA}%** | **${averageB}%** | ${avgMatch} |

**📊 모델 간 의견 차이:**
${getOpinionDifferenceComment(judgments)}

**🏆 플레이어 선택:** ${playerLabel} → ${playerMark}
**현재 점수: ${score}/${ROUNDS_PER_SESSION}**`;
}

export function formatGameIntro(): string {
  return `"다음 단어 확률 맞추기" — GPT · Claude · Gemini 비교 게임

총 ${ROUNDS_PER_SESSION}라운드 | 라운드 1~2 쉬움 · 3~4 중간 · 5 어려움

**시작** 버튼을 누르면 라운드 1이 시작됩니다.`;
}

export function formatGameOver(score: number): string {
  return `### 🎉 게임 종료

**최종 점수: ${score}/${ROUNDS_PER_SESSION}**

다시 하려면 **시작**을 누르세요.`;
}
