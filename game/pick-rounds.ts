import type { Difficulty, GameRound } from "./types";
import { IMAGE_SETS, type ImageSetId } from "./data/image-sets";
import { buildModelProbs } from "./probabilities";

type RoundTemplate = {
  difficulty: Difficulty;
  imageSet: ImageSetId;
  before: string;
  after: string;
  candidateA: string;
  hintA: string;
  candidateB: string;
  hintB: string;
  answer: GameRound["answer"];
  completedSentence: string;
};

const ROUND_POOL: RoundTemplate[] = [
  {
    difficulty: "easy",
    imageSet: "r1",
    before: "아침에 일어나서 물을 마시고",
    after: "을 했다.",
    candidateA: "양치",
    hintA: "아침 루틴",
    candidateB: "수영",
    hintB: "운동·물놀이",
    answer: "A",
    completedSentence: "아침에 일어나서 물을 마시고 양치를 했다.",
  },
  {
    difficulty: "easy",
    imageSet: "r2",
    before: "비가 와서 우산을 쓰고",
    after: "로 갔다.",
    candidateA: "지하철",
    hintA: "도심 이동",
    candidateB: "해변",
    hintB: "야외·여가",
    answer: "A",
    completedSentence: "비가 와서 우산을 쓰고 지하철로 갔다.",
  },
  {
    difficulty: "easy",
    imageSet: "r6",
    before: "나는 매일 아침 커피를 한 잔",
    after: ".",
    candidateA: "마신다",
    hintA: "음료 + 마시다",
    candidateB: "먹는다",
    hintB: "문법상 가능하나 드묾",
    answer: "A",
    completedSentence: "나는 매일 아침 커피를 한 잔 마신다.",
  },
  {
    difficulty: "easy",
    imageSet: "r7",
    before: "배가 고파서 점심으로",
    after: "을 먹었다.",
    candidateA: "김치찌개",
    hintA: "한국식 점심",
    candidateB: "아이스크림",
    hintB: "디저트",
    answer: "A",
    completedSentence: "배가 고파서 점심으로 김치찌개를 먹었다.",
  },
  {
    difficulty: "easy",
    imageSet: "r8",
    before: "겨울이라 두꺼운",
    after: "을 입었다.",
    candidateA: "코트",
    hintA: "계절에 맞음",
    candidateB: "반바지",
    hintB: "계절과 안 맞음",
    answer: "A",
    completedSentence: "겨울이라 두꺼운 코트를 입었다.",
  },
  {
    difficulty: "easy",
    imageSet: "r9",
    before: "강아지와 공원에서",
    after: "을 했다.",
    candidateA: "산책",
    hintA: "반려견·공원",
    candidateB: "수영",
    hintB: "공원에서 드묾",
    answer: "A",
    completedSentence: "강아지와 공원에서 산책을 했다.",
  },
  {
    difficulty: "medium",
    imageSet: "r3",
    before: "회의가 끝나고 동료와",
    after: "에 대해 이야기했다.",
    candidateA: "프로젝트",
    hintA: "업무 맥락",
    candidateB: "우주여행",
    hintB: "비일상 화제",
    answer: "A",
    completedSentence: "회의가 끝나고 동료와 프로젝트에 대해 이야기했다.",
  },
  {
    difficulty: "medium",
    imageSet: "r4",
    before: "생일 파티에서 친구들이",
    after: "을 불러줬다.",
    candidateA: "축하송",
    hintA: "생일 분위기",
    candidateB: "애국가",
    hintB: "공식 행사곡",
    answer: "A",
    completedSentence: "생일 파티에서 친구들이 축하송을 불러줬다.",
  },
  {
    difficulty: "medium",
    imageSet: "r10",
    before: "시험 전날 밤새",
    after: "했다.",
    candidateA: "공부",
    hintA: "시험 준비",
    candidateB: "게임",
    hintB: "놀이",
    answer: "A",
    completedSentence: "시험 전날 밤새 공부했다.",
  },
  {
    difficulty: "medium",
    imageSet: "r2",
    before: "휴가철에 가족과",
    after: "으로 여행을 갔다.",
    candidateA: "제주도",
    hintA: "국내 휴양",
    candidateB: "사무실",
    hintB: "업무 공간",
    answer: "A",
    completedSentence: "휴가철에 가족과 제주도로 여행을 갔다.",
  },
  {
    difficulty: "medium",
    imageSet: "r6",
    before: "추운 날 창가에 앉아 따뜻한",
    after: "을 마셨다.",
    candidateA: "차",
    hintA: "실내·추위",
    candidateB: "주스",
    hintB: "차갑게 마시는 편",
    answer: "A",
    completedSentence: "추운 날 창가에 앉아 따뜻한 차를 마셨다.",
  },
  {
    difficulty: "medium",
    imageSet: "r7",
    before: "주말에 친구와 영화관에서",
    after: "을 봤다.",
    candidateA: "영화",
    hintA: "영화관 맥락",
    candidateB: "뉴스",
    hintB: "TV·집",
    answer: "A",
    completedSentence: "주말에 친구와 영화관에서 영화를 봤다.",
  },
  {
    difficulty: "hard",
    imageSet: "r5",
    before: "출근길에 이어폰으로",
    after: "을 들었다.",
    candidateA: "음악",
    hintA: "가장 흔한 표현",
    candidateB: "팟캐스트",
    hintB: "요즘도 흔함",
    answer: "A",
    completedSentence: "출근길에 이어폰으로 음악을 들었다.",
  },
  {
    difficulty: "hard",
    imageSet: "r5",
    before: "자기 전에 침대에서",
    after: "을 들으며 잠들었다.",
    candidateA: "음악",
    hintA: "흔한 습관",
    candidateB: "라디오",
    hintB: "가능하지만 덜 흔함",
    answer: "A",
    completedSentence: "자기 전에 침대에서 음악을 들으며 잠들었다.",
  },
  {
    difficulty: "hard",
    imageSet: "r8",
    before: "점심 메뉴로",
    after: " 중 하나를 골랐다.",
    candidateA: "비빔밥",
    hintA: "흔한 한식",
    candidateB: "스테이크",
    hintB: "가능하지만 덜 흔함",
    answer: "A",
    completedSentence: "점심 메뉴로 비빔밥 중 하나를 골랐다.",
  },
];

export const ROUNDS_PER_SESSION = 5;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function templateToRound(t: RoundTemplate, id: number): GameRound {
  const imgs = IMAGE_SETS[t.imageSet];
  return {
    id,
    difficulty: t.difficulty,
    before: t.before,
    after: t.after,
    candidateA: t.candidateA,
    hintA: t.hintA,
    candidateB: t.candidateB,
    hintB: t.hintB,
    imageA: imgs.imageA,
    imageB: imgs.imageB,
    answer: t.answer,
    completedSentence: t.completedSentence,
    modelProbs: buildModelProbs(t.difficulty, t.answer),
  };
}

/** 쉬움 2 · 중간 2 · 어려움 1을 뽑아 순서를 섞습니다. */
export function pickSessionRounds(count = ROUNDS_PER_SESSION): GameRound[] {
  const easy = shuffle(ROUND_POOL.filter((r) => r.difficulty === "easy")).slice(
    0,
    2,
  );
  const medium = shuffle(
    ROUND_POOL.filter((r) => r.difficulty === "medium"),
  ).slice(0, 2);
  const hard = shuffle(ROUND_POOL.filter((r) => r.difficulty === "hard")).slice(
    0,
    1,
  );

  const picked = shuffle([...easy, ...medium, ...hard]).slice(0, count);
  return picked.map((t, i) => templateToRound(t, i + 1));
}

export const POOL_SIZE = ROUND_POOL.length;
