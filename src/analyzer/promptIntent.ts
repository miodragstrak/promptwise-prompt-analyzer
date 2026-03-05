import { PromptIntent } from "../types/promptTypes"

const VIDEO_KEYWORDS = [
  "drone shot",
  "camera",
  "tracking shot",
  "pan",
  "zoom",
  "cinematic shot",
  "slow motion",
  "timelapse"
]

const AUDIO_KEYWORDS = [
  "music",
  "song",
  "beat",
  "melody",
  "sound",
  "lofi",
  "audio"
]

export function detectPromptIntent(prompt: string): PromptIntent {

  const p = prompt.toLowerCase()

  for (const word of VIDEO_KEYWORDS) {
    if (p.includes(word)) return "video"
  }

  for (const word of AUDIO_KEYWORDS) {
    if (p.includes(word)) return "audio"
  }

  return "image"
}