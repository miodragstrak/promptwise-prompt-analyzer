import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateVariations(prompt: string): Promise<string[]> {

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Generate 4 alternative prompts based on this prompt.

Prompt:
${prompt}

Return ONLY the prompts as plain text.

Format:
1. prompt
2. prompt
3. prompt
4. prompt`
  })

  const text = response.output_text || ""

  return text
    .split("\n")
    .map(v => v.replace(/^\d+\.\s*/, "").trim())
    .filter(v => v.length > 0)
}