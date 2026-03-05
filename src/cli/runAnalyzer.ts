import { runPromptPipeline } from "../pipeline/analyzePrompt";

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
  console.error('Usage: npm run analyze "your prompt here"');
  process.exit(1);
}

const result = runPromptPipeline(prompt);
console.log(JSON.stringify(result, null, 2));