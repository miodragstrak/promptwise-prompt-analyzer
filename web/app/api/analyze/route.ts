import { runPromptPipeline } from "../../../lib/pipeline/analyzePrompt"
import { generateVariations } from "../../../lib/analyzer/promptVariations"
import { generateCinematic } from "../../../lib/analyzer/promptCinematic"
import { generateScenePlan } from "@/lib/analyzer/scenePlanner"

export async function POST(req: Request) {

  const { prompt, mode } = await req.json()

  if (mode === "variations") {

    const variations = await generateVariations(prompt)

    return Response.json({ variations })

  }

  if (mode === "cinematic") {

    const cinematic = await generateCinematic(prompt)

    return Response.json({ cinematic })

  }

  if (mode === "scene") {

    const scenePlan = await generateScenePlan(prompt)

    return Response.json({ scenePlan })

  }

  const result = await runPromptPipeline(prompt)

  return Response.json(result)

}