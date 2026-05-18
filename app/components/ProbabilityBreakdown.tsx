"use client";

import type { GameRound, RoundAverages } from "@/game/types";

interface Props {
  round: GameRound;
  averages: RoundAverages;
}

export default function ProbabilityBreakdown({ round, averages }: Props) {
  const { final } = averages;

  return (
    <div className="mx-auto w-full max-w-lg space-y-2 rounded-xl bg-black/80 px-4 py-3 backdrop-blur-sm">
      <p className="text-center text-xs text-zinc-400">
        다음 토큰 분포 — 🅰️ + 🅱️ + 기타(다른 단어) = 100%
      </p>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div
          className="bg-indigo-500"
          style={{ width: `${final.a}%` }}
          title={round.candidateA}
        />
        <div
          className="bg-purple-500"
          style={{ width: `${final.b}%` }}
          title={round.candidateB}
        />
        <div
          className="bg-zinc-600"
          style={{ width: `${final.other}%` }}
          title="기타"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-white">
        <span>
          🅰️ {round.candidateA}{" "}
          <span className="font-mono text-indigo-300">{final.a}%</span>
        </span>
        <span>
          🅱️ {round.candidateB}{" "}
          <span className="font-mono text-purple-300">{final.b}%</span>
        </span>
        <span>
          기타 <span className="font-mono text-zinc-400">{final.other}%</span>
        </span>
      </div>
    </div>
  );
}
