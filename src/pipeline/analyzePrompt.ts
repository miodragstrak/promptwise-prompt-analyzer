import { PromptResult } from "../types/promptTypes"
import { analyzePrompt } from "../analyzer/promptAnalyzer"
import { detectPromptIntent } from "../analyzer/promptIntent"
import { classifyPromptComplexity } from "../analyzer/promptComplexity"
import { calculatePromptQuality } from "../analyzer/promptQuality"
import { decideBuilderMode } from "../analyzer/builderMode"
import { detectMissingFields } from "../analyzer/missingFields"
import { enhancePrompt } from "../analyzer/promptEnhancer"
import { parsePromptWithLLM } from "../analyzer/llmPromptParser"
import { calculatePromptRichness } from "../analyzer/promptRichness"
import { number } from "zod"

export async function runPromptPipeline(prompt: string): Promise<PromptResult> {

  // 1️⃣ Fast heuristic analysis
  let analysis = analyzePrompt(prompt)

  // 2️⃣ Intent detection
  const intent = detectPromptIntent(prompt)

  // 3️⃣ Complexity classification
  const complexity = classifyPromptComplexity(prompt, analysis)

  // 4️⃣ Prompt quality score
  const confidence = calculatePromptQuality(prompt, analysis)

  // 5️⃣ LLM fallback if heuristic analysis is weak
  if (confidence < 0.6) {
    try {
      const llmAnalysis = await parsePromptWithLLM(prompt)
      analysis = { ...analysis, ...llmAnalysis }
    } catch (err) {
      console.error("LLM parsing failed:", err)
    }
  }

  // 6️⃣ Builder decision
  const builder_mode = decideBuilderMode(confidence)

  // 7️⃣ Missing fields
  const missing_fields = detectMissingFields(analysis)

  // 8️⃣ Prompt enhancement
  const enhanced_prompt = enhancePrompt(prompt, analysis)

  const richness = calculatePromptRichness(prompt, analysis)

  return {
    analysis,
    confidence,
    builder_mode,
    missing_fields,
    enhanced_prompt,
    complexity,
    intent,
    richness
  }
}