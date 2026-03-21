import type { Sentence } from "@/lib/sentenceData";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export interface GenerateResult {
  sentences?: Sentence[];
  error?: string;
}

/**
 * Calls the generate-sentences edge function.
 * The edge function uses the Lovable AI Gateway (google/gemini-3-flash-preview)
 * to create real, contextual sentences with Brazilian Portuguese translations.
 */
export async function generateSentencesAI(words: string[]): Promise<GenerateResult> {
  const url = `${SUPABASE_URL}/functions/v1/generate-sentences`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ words }),
  });

  const data = await response.json() as { sentences?: { word: string; en: string; pt: string }[]; error?: string };

  if (!response.ok || data.error) {
    return { error: data.error ?? `Erro ${response.status}` };
  }

  if (!data.sentences || data.sentences.length === 0) {
    return { error: "O modelo não retornou frases. Tente novamente." };
  }

  // Assign unique IDs
  const sentences: Sentence[] = data.sentences.map((s, i) => ({
    id: `${s.word}-${i}-${Date.now()}`,
    word: s.word,
    en: s.en,
    pt: s.pt,
  }));

  return { sentences };
}
