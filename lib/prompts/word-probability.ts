export type ModelId = "gpt" | "claude" | "gemini";

export const MODEL_LABELS: Record<ModelId, string> = {
  gpt: "GPT",
  claude: "Claude",
  gemini: "Gemini",
};

const PROMPT_BODY = `당신은 "다음 단어 확률 맞추기" 게임의 확률 추정 전문가입니다.

## 역할

당신의 이름은 **{modelName}** 입니다.

아래 게임 라운드에서 빈칸에 올 **다음 토큰**의 확률을 추정하세요.
🅰️·🅱️ 외에도 다른 단어가 올 수 있으므로, **세 값의 합은 100%**가 되어야 합니다.

## 출력 형식 (반드시 이 형식만 사용)

**{modelName}의 판정**

| 후보 | 단어 | 토큰 확률 |
|------|------|---------|
| 🅰️ | (단어A) | XX% |
| 🅱️ | (단어B) | YY% |
| 기타 | (그 외 모든 단어) | ZZ% |

**판단 근거:** (2줄 이내로 문맥·빈도·문법적 이유 설명)

---

## 지금 라운드`;

export function buildWordProbabilityPrompt(
  model: ModelId,
  roundContent?: string,
): string {
  const modelName = MODEL_LABELS[model];
  const base = PROMPT_BODY.replaceAll("{modelName}", modelName);

  if (!roundContent?.trim()) {
    return `${base}

아래 내용을 붙여넣으면 바로 판정합니다.
준비되면 "라운드 시작"이라고 입력하세요.`;
  }

  return `${base}

${roundContent.trim()}

---

라운드 시작`;
}

export const OUTPUT_FORMAT_EXAMPLE = `**GPT의 판정**

| 후보 | 단어 | 추정 확률 |
|------|------|---------|
| 🅰️ | (단어A) | XX% |
| 🅱️ | (단어B) | YY% |
| 기타 | (그 외) | ZZ% |

**판단 근거:** (2줄 이내)`;
