import { PromptAnalysis, PromptComplexity } from "../types/promptTypes"

export function classifyPromptComplexity(
  prompt: string,
  analysis: PromptAnalysis
): PromptComplexity {

  const wordCount = prompt.split(/\s+/).length

  const cinematicSignals =
    analysis.camera ||
    analysis.lighting ||
    analysis.style

  if (cinematicSignals && wordCount >= 8) {
    return "cinematic"
  }

  if (analysis.environment && analysis.action && wordCount >= 6) {
    return "complex"
  }

  if (analysis.action || wordCount >= 3) {
    return "moderate"
  }

  return "simple"
}