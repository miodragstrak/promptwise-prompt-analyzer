import { PromptAnalysis } from "../types/promptTypes";

function normalizeLoose(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function containsLoose(haystack: string, needle: string): boolean {
  const h = normalizeLoose(haystack);
  const n = normalizeLoose(needle);
  if (!n) return true;
  return h.includes(n);
}

function fallback(val: string | undefined, alt: string) {
  return val && val.trim().length ? val : alt;
}

function appendIfMissing(base: string, phrase: string): string {
  if (!phrase || !phrase.trim()) return base;
  if (containsLoose(base, phrase)) return base;
  return `${base} ${phrase}`.replace(/\s+/g, " ").trim();
}

export function enhancePrompt(original: string, a: PromptAnalysis): string {
  const style = fallback(a.style, "cinematic");
  const camera = fallback(a.camera, "wide shot");
  const subject = fallback(a.subject, "main subject");

  // Start with a strong base sentence
  let out = `${style} ${camera} of ${subject}`.replace(/\s+/g, " ").trim();

  // Add action only if it's not already contained
  if (a.action) {
    out = appendIfMissing(out, a.action);
  }

  // Add environment as a phrase, but avoid duplicates
  if (a.environment) {
    out = appendIfMissing(out, `over a ${a.environment}`);
  }

  // Add lighting (avoid duplicates)
  if (a.lighting) {
    out = appendIfMissing(out, `at ${a.lighting}`);
  }

  // Add objects (avoid duplicates)
  if (a.objects && a.objects.length > 0) {
    out = appendIfMissing(out, `with ${a.objects.join(", ")}`);
  }

  // Mood: if prompt already has mood word, don't re-add generic dramatic
  const moodPhrase = a.mood ? `${a.mood} atmosphere` : "dramatic atmosphere";
  out = appendIfMissing(out, moodPhrase);

  // Quality tail (safe defaults); also avoid duplicates if user already had them
  const qualityTail = "ultra-detailed, high contrast, volumetric lighting, sharp focus";
  if (!containsLoose(out, qualityTail)) {
    out = `${out}. ${qualityTail}`;
  } else {
    out = `${out}.`;
  }

  return out.replace(/\s+/g, " ").trim();
}