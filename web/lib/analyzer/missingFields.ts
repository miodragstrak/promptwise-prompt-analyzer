import { PromptAnalysis } from "../types/promptTypes"

const VISUAL_FIELDS: (keyof PromptAnalysis)[] = [
  "subject",
  "action",
  "environment",
  "lighting",
  "style",
  "camera"
]

const AUDIO_FIELDS: (keyof PromptAnalysis)[] = [
  "subject",
  "style"
]

export function detectMissingFields(
  analysis: PromptAnalysis,
  intent: string
): (keyof PromptAnalysis)[] {

  const missing: (keyof PromptAnalysis)[] = []

  const fields =
    intent === "audio"
      ? AUDIO_FIELDS
      : VISUAL_FIELDS

  for (const field of fields) {

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