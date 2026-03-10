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

function ControlButton({
  label
}: {
  label: string
}) {
  return (
    <button className="border border-[#1F1F1F] bg-black text-white px-4 py-2 rounded-lg text-sm hover:border-[#B6FF00] transition">
      {label}
    </button>
  )
}

function HealthItem({
  label,
  ok
}: {
  label: string
  ok: boolean
}) {

  return (
    <div className="flex justify-between text-sm border-b border-[#1F1F1F] pb-1">
      <span>{label}</span>
      <span>{ok ? "✔" : "❌"}</span>
    </div>
  )
}

function IconToolButton({
  icon,
  title,
  onClick,
  disabled
}: {
  icon: string
  title: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`transition text-lg ${disabled ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-[#B6FF00]"}`}
    >
      {icon}
    </button>
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
  const [aiPrompt, setAiPrompt] = useState(true)
  const [model, setModel] = useState("Google Nano Banana 2")
  const [showImproveModal, setShowImproveModal] = useState(false)
  const [health, setHealth] = useState<number | null>(null)
  const [missing, setMissing] = useState<string[]>([])
  const [variations, setVariations] = useState<string | null>(null)
  const [cinematic, setCinematic] = useState<string | null>(null)
  const [showSceneModal, setShowSceneModal] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [scenePlan, setScenePlan] = useState<SceneShot[] | null>(null)

async function handlePromptHealth() {

if (!result) {
  await analyzeSilent()
}

  const el = document.getElementById("prompt-health")
  if (el) el.scrollIntoView({ behavior: "smooth" })

}

async function handleVariations() {

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      mode: "variations"
    })
  })

  const data = await res.json()

  setVariations(data.variations)

}

async function handleCinematic() {

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      mode: "cinematic"
    })
  })

  const data = await res.json()

  setCinematic(data.cinematic)

}

async function handleImprovePrompt() {

if (!result) {
  await analyzeSilent()
}

  setShowImproveModal(true)

}

async function handleSceneBuilder() {
  const res = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      mode: "scene"
    })
  })

  const data = await res.json()

  setResult((prev) => ({
    ...prev,
    scenePlan: data.scenePlan
  } as PromptResult))

  setScenePlan(data.scenePlan)
  setShowSceneModal(true)
}

function parseVariations(text: unknown): string[] {

  if (!text) return []

  // If LLM returned array
  if (Array.isArray(text)) {
    return text as string[]
  }

  // If returned string
  if (typeof text === "string") {
    return text
      .split("\n")
      .map(v => v.replace(/^\d+\.\s*/, "").trim())
      .filter(v => v.length > 0)
  }

  // If returned OpenAI object
  if (typeof text === "object" && text !== null && "output_text" in text) {
    const output = (text as { output_text: string }).output_text
    return output
      .split("\n")
      .map(v => v.replace(/^\d+\.\s*/, "").trim())
      .filter(v => v.length > 0)
  }

  return []
}

async function analyzeSilent(): Promise<PromptResult> {

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ prompt })
  })

  const data = await res.json()

  setResult(data)
  setHealth(data.confidence)
  setMissing(data.missing_fields)

  return data
}

async function analyze() {

  const data = await analyzeSilent()

  setHealth(data.confidence)
  setMissing(data.missing_fields)

  setShowAnalysis(true)
}


  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto bg-[#0B0B0B] p-8 rounded-xl border border-[#1F1F1F]">

      <h1 className="text-3xl font-bold mb-6">
        PromptWise Prompt Analyzer
      </h1>

      <div className="mb-4">

        <p className="text-xs text-gray-400 mb-1">Model</p>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-lg p-2 text-sm"
        >
          <option>Google Nano Banana 2</option>
          <option>Flux</option>
          <option>Kling</option>
          <option>Stable Diffusion</option>
        </select>

      </div>

        <div className="mb-6">

          <p className="text-xs text-gray-400 mb-2">References</p>

          <div className="grid grid-cols-3 gap-4">

            <div className="border border-dashed border-[#2A2A2A] rounded-lg p-6 text-center text-sm text-gray-400 hover:border-[#B6FF00] transition">
              Style
            </div>

            <div className="border border-dashed border-[#2A2A2A] rounded-lg p-6 text-center text-sm text-gray-400 hover:border-[#B6FF00] transition">
              Character
            </div>

            <div className="border border-dashed border-[#2A2A2A] rounded-lg p-6 text-center text-sm text-gray-400 hover:border-[#B6FF00] transition">
              Upload
            </div>

          </div>

        </div>

      <textarea
        className="w-full p-3 rounded-lg border border-[#1F1F1F] bg-[#0B0B0B] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B6FF00]"
        rows={4}
        placeholder="Type your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Prompt Health */}

      {health !== null && (

      <div className="border border-[#1F1F1F] rounded-lg p-4 mt-4">

        <p className="text-sm text-gray-400 mb-2">
          Prompt Health
        </p>

        <div className="w-full bg-[#1F1F1F] rounded h-2 mb-3">
          <div
            className="bg-[#B6FF00] h-2 rounded"
            style={{ width: `${health * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">

          {missing.includes("subject")
            ? <span className="text-red-400">✘ subject</span>
            : <span className="text-green-400">✔ subject</span>}

          {missing.includes("action")
            ? <span className="text-red-400">✘ action</span>
            : <span className="text-green-400">✔ action</span>}

          {missing.includes("environment")
            ? <span className="text-red-400">✘ environment</span>
            : <span className="text-green-400">✔ environment</span>}

          {missing.includes("lighting")
            ? <span className="text-red-400">✘ lighting</span>
            : <span className="text-green-400">✔ lighting</span>}

          {missing.includes("style")
            ? <span className="text-red-400">✘ style</span>
            : <span className="text-green-400">✔ style</span>}

          {missing.includes("camera")
            ? <span className="text-red-400">✘ camera</span>
            : <span className="text-green-400">✔ camera</span>}

        </div>

      </div>

      )}

      {/* AI Prompt toggle already here */}

      <div className="flex items-center justify-between mt-2">

      {/* LEFT SIDE — AI Prompt */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.checked)}
        />

        <span className="text-sm text-gray-400">
          AI Prompt
        </span>
      </div>

      {/* RIGHT SIDE — ICON TOOLS */}

      <div className="flex items-center gap-4 text-lg">

        <p className="text-xs text-gray-500 mr-2">
          Prompt Tools
        </p>

        <IconToolButton
          icon="🌱"
          title="Prompt Health"
          onClick={handlePromptHealth}
          disabled={!prompt.trim()}
        />

        <IconToolButton
          icon="📝"
          title="Improve Prompt"
          onClick={handleImprovePrompt}
          disabled={!prompt.trim()}
        />

        <IconToolButton
          icon="🖼️"
          title="Prompt Variations"
          onClick={handleVariations}
          disabled={!prompt.trim()}
        />

        <IconToolButton
          icon="✨"
          title="Cinematic Prompt"
          onClick={handleCinematic}
          disabled={!prompt.trim()}
        />

        <IconToolButton
          icon="🎬"
          title="Scene Builder"
          onClick={handleSceneBuilder}
          disabled={!prompt.trim()}
        />

      </div>

    </div>

      <div className="flex gap-3 mt-4">

        <ControlButton label="- 1 +" />

        <ControlButton label="📦 1:1" />

        <ControlButton label="📄 1K" />

        <ControlButton label="∞ ON" />

      </div>

      <button
        onClick={analyze}
        className="border border-[#1F1F1F] bg-black text-white p-3 w-full rounded-lg">
        Full Prompt Analyzer
      </button>



      {showAnalysis && result && (
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

    {/* Prompt Health */}
      <div id="prompt-health" className="border border-[#1F1F1F] rounded-lg p-4 mt-4">

        <h2 className="font-bold mb-4">Prompt Health</h2>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

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

        {/* Checklist */}
        <div className="space-y-2 text-sm">

          <HealthItem label="Subject" ok={!!result.analysis.subject} />
          <HealthItem label="Environment" ok={!!result.analysis.environment} />
          <HealthItem label="Lighting" ok={!!result.analysis.lighting} />
          <HealthItem label="Style" ok={!!result.analysis.style} />
          <HealthItem label="Camera" ok={!!result.analysis.camera} />

        </div>

      </div>    


        {/* Missing fields */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Missing Fields</h2>

          {result.missing_fields.length > 0 ? (
            <ul className="list-disc pl-6">
              {result.missing_fields.map((field) => (
                <li key={field} className="capitalize">
                {field}
              </li>
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

        <button
            className="mt-3 text-sm text-[#B6FF00]"
            onClick={() => setPrompt(result.enhanced_prompt)}
          >
            Use this prompt
        </button>
          
        </div>

        {/* Scene Plan */}

          {result.scenePlan && (

        <div className="border border-[#1F1F1F] rounded-lg p-6 bg-[#0B0B0B]">

          <h2 className="text-lg font-semibold mb-4">
            Scene Plan
          </h2>

          <div className="grid gap-4">

            {(typeof result.scenePlan === 'string' ? parseScenePlan(result.scenePlan) : result.scenePlan).map((shot: SceneShot, i: number) => (

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

    {showImproveModal && result && (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl p-6 w-[500px]">

        <h2 className="text-lg font-semibold mb-3">
          Improved Prompt
        </h2>

        <p className="text-sm text-gray-300">
          {result.enhanced_prompt}
        </p>

        <div className="flex justify-between mt-4">

          <button
            className="text-sm text-gray-400"
            onClick={() => setShowImproveModal(false)}
          >
            Close
          </button>

          <button
            className="text-sm text-[#B6FF00]"
            onClick={() => {
              setPrompt(result.enhanced_prompt)
              setShowImproveModal(false)
            }}
          >
            Use this prompt
          </button>

        </div>

      </div>

    </div>

  )}

      {variations && (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">


        <h2 className="text-lg font-semibold mb-3">
          Prompt Variations
        </h2>

        <div className="grid gap-3">

        {parseVariations(variations).map((v, i) => (

          <div
            key={i}
            className="border border-[#1F1F1F] rounded-lg p-3 bg-[#111111] hover:border-[#B6FF00] cursor-pointer transition"
            onClick={() => {
              setPrompt(v)
              setVariations(null)
            }}
          >
            <p className="text-xs text-gray-400 mb-3">
              Click a variation to replace your prompt
            </p>

            <p className="text-xs text-gray-400 mb-1">
              Variation {i + 1}
            </p>

            <p className="text-sm">
              {v}
            </p>

          </div>

        ))}

      </div>

        <button
          className="mt-4 text-sm text-gray-400"
          onClick={() => setVariations(null)}
        >
          Close
        </button>

      </div>

    </div>

    )}

    {cinematic && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

  <div className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl p-6 w-[500px]">

    <h2 className="text-lg font-semibold mb-3">
      Cinematic Prompt
    </h2>

    <p className="text-sm">
      {cinematic}
    </p>

    <div className="flex justify-between mt-4">

      <button
        className="text-gray-400 text-sm"
        onClick={() => setCinematic(null)}
      >
        Close
      </button>

      <button
        className="text-[#B6FF00] text-sm"
        onClick={() => {
          setPrompt(cinematic)
          setCinematic(null)
        }}
      >
        Use Prompt
      </button>

    </div>

  </div>

</div>

)}

{showSceneModal && scenePlan && ( 

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

  <div className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">

    <h2 className="text-lg font-semibold mb-4">
      Scene Builder
    </h2>

    <div className="grid gap-4">

      {(typeof scenePlan === 'string' ? parseScenePlan(scenePlan) : scenePlan).map((shot: SceneShot, i: number) => (

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

    <div className="flex justify-end mt-6">

      <button
        className="text-sm text-gray-400"
        onClick={() => setShowSceneModal(false)}
      >
        Close
      </button>

    </div>

  </div>

</div>

)}

    </div>

    </main>
  )
}