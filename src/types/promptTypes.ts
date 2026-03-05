export interface PromptAnalysis {
  subject?: string
  action?: string
  environment?: string
  lighting?: string
  style?: string
  camera?: string
  mood?: string
  objects?: string[]
}

export type BuilderMode = "guided" | "refine" | "advanced"

export type PromptComplexity = "simple" | "moderate" | "complex" | "cinematic"

export type PromptIntent =
  | "image"
  | "video"
  | "audio"
  | "unknown"

export interface PromptResult {
  analysis: PromptAnalysis
  confidence: number
  builder_mode: string
  missing_fields: string[]
  enhanced_prompt: string
  complexity: string
  intent: string
  richness: number
}