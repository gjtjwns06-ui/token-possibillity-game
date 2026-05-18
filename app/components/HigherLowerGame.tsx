"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ComparisonPanel from "./ComparisonPanel";
import ProbabilityBreakdown from "./ProbabilityBreakdown";
import {
  pickSessionRounds,
  POOL_SIZE,
  ROUNDS_PER_SESSION,
} from "@/game/pick-rounds";
import { computeRoundAverages } from "@/game/average";
import type { CandidateChoice, GamePhase, GameRound } from "@/game/types";

const HIGH_SCORE_KEY = "genspark-hack-high-score";

export default function HigherLowerGame() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<CandidateChoice | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [sessionRounds, setSessionRounds] = useState<GameRound[]>(() =>
    pickSessionRounds(),
  );

  const round = sessionRounds[roundIndex];
  const totalRounds = sessionRounds.length;
  const averages = useMemo(
    () => (round ? computeRoundAverages(round) : null),
    [round],
  );

  useEffect(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) setHighScore(Number(saved));
  }, []);

  const persistHighScore = useCallback((value: number) => {
    setHighScore(value);
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  }, []);

  const startGame = useCallback(() => {
    setSessionRounds(pickSessionRounds());
    setPhase("playing");
    setRoundIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
  }, []);

  const handlePick = (choice: CandidateChoice) => {
    if (revealed || !round || !averages) return;
    setSelected(choice);
    setRevealed(true);

    if (choice === averages.finalAnswer) {
      setScore((s) => {
        const next = s + 1;
        if (next > highScore) persistHighScore(next);
        return next;
      });
    }
  };

  const handleNext = () => {
    if (roundIndex + 1 >= totalRounds) {
      setPhase("finished");
      return;
    }
    setRoundIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  if (phase === "idle") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-white">
        <p className="mb-2 text-5xl">🧠</p>
        <h1 className="text-4xl font-extrabold tracking-tight">
          다음 단어 확률 맞추기
        </h1>
        <p className="mt-3 max-w-md text-center text-zinc-400">
          Higher or Lower 스타일로 두 후보 중 빈칸에 더 잘 맞는 단어를
          고르세요. 토큰 확률은 🅰️+🅱️+기타=100%이며, 다른 단어도 항상
          존재합니다. 새로고침 시 문장 {POOL_SIZE}개 중 {ROUNDS_PER_SESSION}
          개가 랜덤으로 나옵니다.
        </p>
        <button
          type="button"
          onClick={startGame}
          className="mt-10 rounded-full bg-white px-10 py-4 text-lg font-bold text-black transition hover:scale-105"
        >
          시작
        </button>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-white">
        <h2 className="text-3xl font-bold">게임 종료</h2>
        <p className="mt-4 text-6xl font-mono font-bold text-emerald-400">
          {score}/{totalRounds}
        </p>
        <p className="mt-2 text-zinc-400">최고 점수: {highScore}</p>
        <button
          type="button"
          onClick={startGame}
          className="mt-10 rounded-full bg-white px-10 py-4 text-lg font-bold text-black"
        >
          다시 시작
        </button>
      </div>
    );
  }

  if (!round || !averages) return null;

  const winner = averages.finalAnswer;
  const playerCorrect = revealed && selected === winner;
  const winnerPercent =
    winner === "A" ? averages.final.a : averages.final.b;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black">
      <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-4 text-sm font-medium text-white">
        <span>High score: {highScore}</span>
        <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur">
          라운드 {roundIndex + 1}/{totalRounds}
        </span>
        <span>Score: {score}</span>
      </header>

      <div className="absolute left-0 right-0 top-14 z-30 px-4">
        <p className="mx-auto max-w-3xl rounded-lg bg-black/60 px-4 py-2 text-center text-sm leading-relaxed text-white backdrop-blur md:text-base">
          {round.before}{" "}
          <span className="font-bold text-amber-300">[?????]</span> {round.after}
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <ComparisonPanel
          side="A"
          round={round}
          averages={averages}
          revealed={revealed}
          selected={selected === "A"}
          isWinner={revealed && winner === "A"}
          onPick={() => handlePick("A")}
        />
        <ComparisonPanel
          side="B"
          round={round}
          averages={averages}
          revealed={revealed}
          selected={selected === "B"}
          isWinner={revealed && winner === "B"}
          onPick={() => handlePick("B")}
        />

        {!revealed && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl">
            <span className="text-xl font-black text-black">OR</span>
          </div>
        )}
      </div>

      {revealed && (
        <footer className="absolute bottom-0 left-0 right-0 z-30 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent px-4 pb-6 pt-12">
          <p className="text-center text-sm text-zinc-300">
            <span className="font-semibold text-white">정답 문장:</span>{" "}
            {round.completedSentence}
          </p>
          <ProbabilityBreakdown round={round} averages={averages} />
          <p
            className={`text-center text-lg font-bold ${
              playerCorrect ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {playerCorrect
              ? "✅ 정답! 평균 확률과 같은 선택이에요."
              : `❌ 오답. A·B 중 더 높은 토큰 확률: ${
                  winner === "A" ? round.candidateA : round.candidateB
                } (${winnerPercent}%, 기타 ${averages.final.other}%)`}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="mx-auto block rounded-full bg-white px-8 py-3 font-bold text-black"
          >
            {roundIndex + 1 >= totalRounds ? "결과 보기" : "다음 라운드 →"}
          </button>
        </footer>
      )}

      {!revealed && (
        <p className="absolute bottom-6 left-0 right-0 z-20 text-center text-xs text-white/70">
          더 높은 확률의 단어 쪽을 클릭하세요
        </p>
      )}
    </div>
  );
}
