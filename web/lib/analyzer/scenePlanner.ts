import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateScenePlan(prompt: string) {

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
            You are a cinematic scene planner.

            Break the user prompt into 3-5 video shots.
            Return a JSON list of shots.
            `
      },
      {
        role: "user",
        content: prompt
      }
    ]
  })

  return completion.choices[0].message.content
}