import { PromptAnalysis } from "../types/promptTypes";

const WEIGHTS: Record<keyof PromptAnalysis, number> = {
  subject: 0.25,
  action: 0.15,
  environment: 0.15,
  lighting: 0.10,
  style: 0.10,
  camera: 0.10,
  mood: 0.05,
  objects: 0.10,
};

export function scorePrompt(analysis: PromptAnalysis): number {
  let score = 0;

  for (const key of Object.keys(WEIGHTS) as (keyof PromptAnalysis)[]) {
    const w = WEIGHTS[key];
    const val = analysis[key];

    const present =
      Array.isArray(val) ? val.length > 0 :
      typeof val === "string" ? val.trim().length > 0 :
      Boolean(val);

    if (present) score += w;
  }

  // clamp
  return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}