export type ImageSetId =
  | "r1"
  | "r2"
  | "r3"
  | "r4"
  | "r5"
  | "r6"
  | "r7"
  | "r8"
  | "r9"
  | "r10";

export const IMAGE_SETS: Record<
  ImageSetId,
  { imageA: string; imageB: string }
> = {
  r1: { imageA: "/rounds/r1a.jpg", imageB: "/rounds/r1b.jpg" },
  r2: { imageA: "/rounds/r2a.jpg", imageB: "/rounds/r2b.jpg" },
  r3: { imageA: "/rounds/r3a.jpg", imageB: "/rounds/r3b.jpg" },
  r4: { imageA: "/rounds/r4a.jpg", imageB: "/rounds/r4b.jpg" },
  r5: { imageA: "/rounds/r5a.jpg", imageB: "/rounds/r5b.jpg" },
  r6: { imageA: "/rounds/r6a.jpg", imageB: "/rounds/r6b.jpg" },
  r7: { imageA: "/rounds/r7a.jpg", imageB: "/rounds/r7b.jpg" },
  r8: { imageA: "/rounds/r8a.jpg", imageB: "/rounds/r8b.jpg" },
  r9: { imageA: "/rounds/r9a.jpg", imageB: "/rounds/r9b.jpg" },
  r10: { imageA: "/rounds/r10a.jpg", imageB: "/rounds/r10b.jpg" },
};
