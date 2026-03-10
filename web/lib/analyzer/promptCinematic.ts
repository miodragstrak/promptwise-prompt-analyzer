import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateCinematic(prompt: string) {

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Rewrite this prompt as a cinematic film-style prompt.

Include camera framing, lighting, atmosphere and cinematic tone.

Prompt:
${prompt}`
  })

  return response.output_text
}