"use client";

import { useCallback, useState } from "react";
import {
  MODEL_LABELS,
  OUTPUT_FORMAT_EXAMPLE,
  type ModelId,
  buildWordProbabilityPrompt,
} from "@/lib/prompts/word-probability";

const MODELS: ModelId[] = ["gpt", "claude", "gemini"];

export default function WordProbabilityGame() {
  const [model, setModel] = useState<ModelId>("gpt");
  const [round, setRound] = useState("");
  const [copied, setCopied] = useState(false);

  const fullPrompt = buildWordProbabilityPrompt(model, round);

  const copyPrompt = useCallback(async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [fullPrompt]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          GenSpark Hack
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          다음 단어 확률 맞추기
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          AI에게 빈칸에 들어갈 두 후보 단어의 확률을 추정하게 합니다. 프롬프트를
          복사해 채팅에 붙여넣거나, 라운드 내용을 입력한 뒤 전송하세요.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          모델 선택
        </h2>
        <div className="flex flex-wrap gap-2">
          {MODELS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setModel(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                model === id
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {MODEL_LABELS[id]}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <label
          htmlFor="round"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          라운드 내용 (문장, 후보 단어 등)
        </label>
        <textarea
          id="round"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          placeholder={`예시:\n문장: 나는 어제 ___ 를 먹었다.\n🅰️ 라면\n🅱️ 피자`}
          rows={8}
          className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            생성된 프롬프트
          </h2>
          <button
            type="button"
            onClick={copyPrompt}
            className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {copied ? "복사됨" : "프롬프트 복사"}
          </button>
        </div>
        <pre className="max-h-64 overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed whitespace-pre-wrap text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          {fullPrompt}
        </pre>
      </section>

      <section className="space-y-2 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-600">
        <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          AI 응답 형식 (예시)
        </h2>
        <pre className="text-xs leading-relaxed whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
          {OUTPUT_FORMAT_EXAMPLE.replace("GPT", MODEL_LABELS[model])}
        </pre>
      </section>
    </div>
  );
}
