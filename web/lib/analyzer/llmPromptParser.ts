import OpenAI from "openai"
import { PromptAnalysis } from "../types/promptTypes"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function parsePromptWithLLM(
  prompt: string
): Promise<PromptAnalysis> {

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
Extract the structure of the prompt.

Return ONLY JSON in this format:

{
 "subject": string | null,
 "action": string | null,
 "environment": string | null,
 "lighting": string | null,
 "style": string | null,
 "camera": string | null,
 "objects": string[] | null,
 "mood": string | null
}
`
      },
      {
        role: "user",
        content: prompt
      }
    ]
  })

  const text = response.output_text

  try {

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    return {
      subject: parsed.subject ?? undefined,
      action: parsed.action ?? undefined,
      environment: parsed.environment ?? undefined,
      lighting: parsed.lighting ?? undefined,
      style: parsed.style ?? undefined,
      camera: parsed.camera ?? undefined,
      objects: parsed.objects ?? undefined,
      mood: parsed.mood ?? undefined
    }

  } catch (err) {

    console.warn("LLM returned invalid JSON", err)

    return {
      subject: undefined,
      action: undefined,
      environment: undefined,
      lighting: undefined,
      style: undefined,
      camera: undefined,
      objects: undefined,
      mood: undefined
    }

  }

}