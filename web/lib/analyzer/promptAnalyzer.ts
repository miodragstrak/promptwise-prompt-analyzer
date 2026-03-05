import { PromptAnalysis } from "../types/promptTypes";
import {
  STYLE_KEYWORDS, CAMERA_KEYWORDS, LIGHTING_KEYWORDS, MOOD_KEYWORDS,
  ENVIRONMENT_KEYWORDS, ACTION_KEYWORDS, OBJECT_HINT_WORDS
} from "../utils/keywordDictionaries";
import { findFirstKeyword, findAllKeywords, normalize, extractAfterAny } from "../utils/textUtils";

function guessSubject(text: string): string | undefined {
  // Very naive: remove known keywords and keep what's left-ish.
  // v0 rule: take the "noun phrase" after "of" or "a/an" if present.
  const t = normalize(text);

  const ofIdx = t.indexOf(" of ");
  if (ofIdx !== -1) {
    // "a cinematic drone shot of a futuristic city skyline..."
    const after = t.slice(ofIdx + 4);
    // stop at " at " / " with " / " in " if present
    const stopWords = [" with ", " at ", " in ", " during ", " featuring ", " including "];
    let cut = after.length;
    for (const sw of stopWords) {
      const i = after.indexOf(sw);
      if (i !== -1) cut = Math.min(cut, i);
    }
    return after.slice(0, cut).trim();
  }

  // fallback: if prompt is single word(s), treat as subject
  // but avoid pure style/camera words
  const bad = [...STYLE_KEYWORDS, ...CAMERA_KEYWORDS, ...LIGHTING_KEYWORDS];
  if (!bad.some(k => t === k)) return t;
  return undefined;
}

function guessAction(text: string): string | undefined {
  // If "shot" mentioned, treat as a camera/action descriptor
  const t = normalize(text);
  if (t.includes("drone shot")) return "drone shot";
  if (t.includes("tracking shot")) return "tracking shot";
  const actions = findAllKeywords(t, ACTION_KEYWORDS);
  return actions[0];
}

function guessEnvironment(text: string): string | undefined {
  return findFirstKeyword(text, ENVIRONMENT_KEYWORDS);
}

function guessObjects(text: string): string[] | undefined {
  const after = extractAfterAny(text, OBJECT_HINT_WORDS);
  if (!after) return undefined;

  // split by commas / "and"
  const cleaned = after
    .replace(/\./g, "")
    .split(/,| and /)
    .map(s => s.trim())
    .filter(Boolean);

  return cleaned.length ? cleaned : undefined;
}

export function analyzePrompt(prompt: string): PromptAnalysis {
  return {
    subject: guessSubject(prompt),
    action: guessAction(prompt),
    environment: guessEnvironment(prompt),
    lighting: findFirstKeyword(prompt, LIGHTING_KEYWORDS),
    style: findFirstKeyword(prompt, STYLE_KEYWORDS),
    camera: findFirstKeyword(prompt, CAMERA_KEYWORDS),
    mood: findFirstKeyword(prompt, MOOD_KEYWORDS),
    objects: guessObjects(prompt),
  };
}