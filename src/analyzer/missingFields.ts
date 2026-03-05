import { PromptAnalysis } from "../types/promptTypes"

const IMPORTANT_FIELDS: (keyof PromptAnalysis)[] = [
  "subject",
  "action",
  "environment",
  "lighting",
  "style",
  "camera"
]

export function detectMissingFields(
  analysis: PromptAnalysis
): (keyof PromptAnalysis)[] {

  const missing: (keyof PromptAnalysis)[] = []

  for (const field of IMPORTANT_FIELDS) {

    const value = analysis[field]

    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)

    if (isEmpty) {
      missing.push(field)
    }

  }

  return missing
}