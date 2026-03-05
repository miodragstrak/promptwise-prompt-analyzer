import { PromptAnalysis } from "../types/promptTypes"

export function calculatePromptRichness(
  prompt: string,
  analysis: PromptAnalysis
): number {

  let score = 0

  const words = prompt.split(/\s+/)

  // base richness from length
  score += Math.min(words.length / 12, 0.3)

  if (analysis.subject) score += 0.2
  if (analysis.action) score += 0.1
  if (analysis.environment) score += 0.1
  if (analysis.camera) score += 0.1
  if (analysis.lighting) score += 0.1
  if (analysis.style) score += 0.1

  if (analysis.objects && analysis.objects.length > 0) {
    score += Math.min(analysis.objects.length * 0.05, 0.1)
  }

  return Math.min(score, 1)
}