import { runPromptPipeline } from "../../../../src/pipeline/analyzePrompt"

export async function POST(req: Request) {

  const { prompt } = await req.json()

  const result = await runPromptPipeline(prompt)

  return Response.json(result)

}