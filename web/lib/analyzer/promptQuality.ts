import { PromptAnalysis } from "../types/promptTypes"

export function calculatePromptQuality(
  prompt: string,
  analysis: PromptAnalysis
): number {

  let score = 0

  const wordCount = prompt.split(/\s+/).length

  // prompt length factor
  if (wordCount >= 3) score += 0.1
  if (wordCount >= 6) score += 0.1
  if (wordCount >= 10) score += 0.1

  // subject is essential
  if (analysis.subject) score += 0.25

  // actions improve prompts
  if (analysis.action) score += 0.15

  // environments help scene understanding
  if (analysis.environment) score += 0.15

  // visual detail
  if (analysis.lighting) score += 0.1
  if (analysis.style) score += 0.05
  if (analysis.camera) score += 0.05

  // objects increase complexity
  if (analysis.objects && analysis.objects.length > 0) {
    score += Math.min(analysis.objects.length * 0.05, 0.1)
  }

  return Math.min(1, Number(score.toFixed(2)))
}