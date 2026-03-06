"use client"

import { useState } from "react"
import type { PromptResult } from "../lib/types/promptTypes"

function Chip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-[#1F1F1F] text-white">
      {label}
    </span>
  )
}

function MetricCard({
  title,
  value
}: {
  title: string
  value: string
}) {
  return (
    <div className="border border-[#1F1F1F] rounded-lg p-4 bg-[#0B0B0B]">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  )
}

type SceneShot = {
  shot: string
  description: string
}

function parseScenePlan(sceneText: string): SceneShot[] {

  try {

    const cleaned = sceneText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^json/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    if (Array.isArray(parsed)) {
      return parsed
    }

    if (parsed.shots) {
      return parsed.shots
    }

    return []

  } catch (err) {

    console.warn("Scene parsing failed:", err)

    return []

  }

}

export default function Home() {

  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<PromptResult | null>(null)

  async function analyze() {

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()

    setResult(data)
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto bg-[#0B0B0B] p-8 rounded-xl border border-[#1F1F1F]">

      <h1 className="text-3xl font-bold mb-6">
        PromptWise Prompt Analyzer
      </h1>

      <textarea
        className="w-full p-3 rounded-lg border border-[#1F1F1F] bg-[#0B0B0B] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B6FF00]"
        rows={4}
        placeholder="Type your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />  

      <button
        onClick={analyze}
        className="border border-[#1F1F1F] bg-black text-white p-3 w-full rounded-lg">
        Analyze Prompt
      </button>

      {result && (
      <div className="mt-8 space-y-6">

        {/* Prompt Structure */}
        <div className="border border-[#1F1F1F] p-4 rounded-lg bg-[#0B0B0B]">
          <h2 className="font-bold mb-2">Prompt Structure</h2>

          <p><b>Subject:</b> {result.analysis.subject || "-"}</p>
          <p><b>Action:</b> {result.analysis.action || "-"}</p>
          <p><b>Environment:</b> {result.analysis.environment || "-"}</p>
          <p><b>Lighting:</b> {result.analysis.lighting || "-"}</p>
          <p><b>Style:</b> {result.analysis.style || "-"}</p>
          <p><b>Camera:</b> {result.analysis.camera || "-"}</p>

        </div>


        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <MetricCard
          title="Confidence"
          value={`${Math.round(result.confidence * 100)}%`}
        />

        <MetricCard
          title="Complexity"
          value={result.complexity}
        />

        <MetricCard
          title="Intent"
          value={result.intent}
        />

        <MetricCard
          title="Richness"
          value={result.richness.toFixed(2)}
        />

      </div>

      <div className="mt-6">

        <p className="text-gray-400 text-sm mb-2">Builder Mode</p>

        <Chip label={result.builder_mode} />

      </div>

      <div className="mt-4">

      <p className="text-sm text-gray-400 mb-1">Confidence Level</p>

      <div className="w-full bg-[#1F1F1F] rounded h-3">

        <div
          className="bg-[#B6FF00] h-3 rounded"
          style={{ width: `${result.confidence * 100}%` }}
        />

      </div>

    </div>


        {/* Missing fields */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Missing Fields</h2>

          {result.missing_fields.length > 0 ? (
            <ul className="list-disc pl-6">
              {result.missing_fields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}

        </div>


        {/* Enhanced Prompt */}
        <div className="border p-4 rounded bg-[#0B0B0B]">
          <h2 className="font-bold mb-2">Enhanced Prompt</h2>
          <p>{result.enhanced_prompt}</p>
        </div>

        {/* Scene Plan */}

          {result.scenePlan && (

        <div className="border border-[#1F1F1F] rounded-lg p-6 bg-[#0B0B0B]">

          <h2 className="text-lg font-semibold mb-4">
            Scene Plan
          </h2>

          <div className="grid gap-4">

            {parseScenePlan(result.scenePlan).map((shot: SceneShot, i: number) => (

              <div
                key={i}
                className="border border-[#1F1F1F] rounded-md p-4 bg-[#111111]"
              >

                <p className="text-xs text-gray-400 mb-1">
                  Shot {i + 1}
                </p>

                <p className="text-sm font-medium">
                  {shot.shot}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {shot.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

      </div>
    )}

    </div>

    </main>
  )
}