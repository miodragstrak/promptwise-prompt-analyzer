import { runPromptPipeline } from "../pipeline/analyzePrompt"
import { TEST_PROMPTS } from "../examples/testPrompts"

async function run() {

  for (const prompt of TEST_PROMPTS) {

    const result = await runPromptPipeline(prompt)

    console.log("\n---------------------------------")
    console.log("Prompt:", prompt)

    console.log("Confidence:", result.confidence)
    console.log("Builder Mode:", result.builder_mode)
    console.log("Complexity:", result.complexity)
    console.log("Intent:", result.intent)

    if (result.missing_fields.length > 0) {
      console.log("Missing:", result.missing_fields.join(", "))
    }

    console.log("Enhanced Prompt:")
    console.log(result.enhanced_prompt)

  }

}

run()