import OpenAI from "openai"
import { z } from "zod"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const PromptSchema = z.object({
  subject: z.string().nullable(),
  action: z.string().nullable(),
  environment: z.string().nullable(),
  lighting: z.string().nullable(),
  style: z.string().nullable(),
  camera: z.string().nullable(),
  objects: z.array(z.string()).nullable(),
  mood: z.string().nullable()
})

function normalizeLLMOutput(data: PromptSchemaType) {
  return {
    subject: data.subject ?? undefined,
    action: data.action ?? undefined,
    environment: data.environment ?? undefined,
    lighting: data.lighting ?? undefined,
    style: data.style ?? undefined,
    camera: data.camera ?? undefined,
    objects: data.objects ?? undefined,
    mood: data.mood ?? undefined
  }
}

export type PromptSchemaType = z.infer<typeof PromptSchema>

import { PromptAnalysis } from "../types/promptTypes"

export async function parsePromptWithLLM(prompt: string): Promise<PromptAnalysis>{

  const response = await openai.responses.parse({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "Extract structured prompt data for AI media generation."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "prompt_structure",
        schema: PromptSchema.shape
      }
    }
  })

  const parsed = response.output_parsed

if (!parsed) {
  throw new Error("LLM returned empty response")
}

return normalizeLLMOutput(parsed)
}