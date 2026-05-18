"use client";

import { useEffect, useState } from "react";
import {
  modelPercentForChoice,
  percentForChoice,
} from "@/game/average";
import type { CandidateChoice, GameRound, RoundAverages } from "@/game/types";

const MODEL_ROWS = [
  { key: "gpt" as const, label: "GPT", emoji: "🤖" },
  { key: "claude" as const, label: "Claude", emoji: "🟣" },
  { key: "gemini" as const, label: "Gemini", emoji: "🔵" },
];

const FALLBACK_GRADIENT: Record<CandidateChoice, string> = {
  A: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
  B: "linear-gradient(135deg, #4a1942 0%, #1a0a2e 100%)",
};

interface Props {
  side: CandidateChoice;
  round: GameRound;
  averages: RoundAverages;
  revealed: boolean;
  selected: boolean;
  isWinner: boolean;
  onPick: () => void;
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

export default function ComparisonPanel({
  side,
  round,
  averages,
  revealed,
  selected,
  isWinner,
  onPick,
}: Props) {
  const word = side === "A" ? round.candidateA : round.candidateB;
  const hint = side === "A" ? round.hintA : round.hintB;
  const image = side === "A" ? round.imageA : round.imageB;
  const [imgError, setImgError] = useState(false);

  const finalPercent = percentForChoice(averages, side);
  const displayPercent = useCountUp(finalPercent, revealed);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  return (
    <button
      type="button"
      onClick={() => !revealed && onPick()}
      disabled={revealed}
      className={`group relative h-full min-h-[200px] w-1/2 overflow-hidden border-0 outline-none transition-[filter,transform] duration-300 ${
        revealed ? "cursor-default" : "cursor-pointer hover:brightness-110"
      } ${selected && !revealed ? "ring-4 ring-inset ring-white/80" : ""}`}
    >
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${image}?v=3`}
          alt={word}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: FALLBACK_GRADIENT[side] }}
        />
      )}

      <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 py-8">
        <div className="rounded-sm bg-white px-5 py-3 shadow-lg md:px-6">
          <p className="text-center text-xl font-bold tracking-tight text-black md:text-3xl">
            {word}
          </p>
          {!revealed && (
            <p className="mt-1 text-center text-xs text-zinc-500">{hint}</p>
          )}
        </div>

        {revealed && (
          <div className="flex w-full max-w-xs flex-col items-center gap-2">
            <div
              className={`w-full rounded-sm px-4 py-2 text-center font-mono text-2xl font-bold tabular-nums md:text-3xl ${
                isWinner
                  ? "bg-emerald-500 text-white"
                  : "bg-black text-white"
              }`}
            >
              {displayPercent}%
            </div>
            <p className="text-center text-[10px] text-white/70">
              이 단어의 토큰 확률 (전체 100% 중)
            </p>

            <div className="w-full space-y-1 rounded-lg bg-black/80 px-3 py-2 backdrop-blur-sm">
              {MODEL_ROWS.map(({ key, label, emoji }) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-xs text-white/90"
                >
                  <span>
                    {emoji} {label}
                  </span>
                  <span className="font-mono font-semibold tabular-nums">
                    {modelPercentForChoice(averages[key], side)}%
                  </span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2 text-sm font-bold text-white">
                <span>평균 토큰</span>
                <span
                  className={`font-mono tabular-nums ${
                    isWinner ? "text-emerald-400" : ""
                  }`}
                >
                  {finalPercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
