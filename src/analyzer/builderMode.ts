import { BuilderMode } from "../types/promptTypes";

export function decideBuilderMode(confidence: number): BuilderMode {
  if (confidence < 0.3) return "guided";
  if (confidence <= 0.7) return "refine";
  return "advanced";
}