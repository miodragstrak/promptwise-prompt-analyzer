export function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findFirstKeyword(text: string, keywords: string[]): string | undefined {
  const t = normalize(text);
  return keywords.find(k => t.includes(k)) || undefined;
}

export function findAllKeywords(text: string, keywords: string[]): string[] {
  const t = normalize(text);
  return keywords.filter(k => t.includes(k));
}

// naive extraction: text after a marker word until end
export function extractAfterAny(text: string, markers: string[]): string | undefined {
  const t = normalize(text);
  for (const m of markers) {
    const idx = t.indexOf(` ${m} `);
    if (idx !== -1) {
      return t.slice(idx + m.length + 2).trim();
    }
  }
  // handle marker at the beginning: "with flying cars"
  for (const m of markers) {
    if (t.startsWith(`${m} `)) return t.slice(m.length + 1).trim();
  }
  return undefined;
}