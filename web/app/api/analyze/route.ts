import { runPromptPipeline } from "../../../../src/pipeline/analyzePrompt"

export async function POST(req: Request) {

  console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "FOUND" : "MISSING")

  const { prompt } = await req.json()

  const result = await runPromptPipeline(prompt)

  return Response.json(result)
}