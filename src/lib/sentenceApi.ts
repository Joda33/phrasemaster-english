import type { Sentence } from "@/lib/sentenceData";

// Call the Lovable AI Gateway directly from the browser.
// The gateway accepts the Supabase project's anon key as auth.
const GATEWAY_URL = "https://api.ai.lovable.app/openai/v1";
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export interface GenerateResult {
  sentences?: Sentence[];
  error?: string;
}

export async function generateSentencesAI(words: string[]): Promise<GenerateResult> {
  try {
    const wordList = words.map((w) => w.trim()).filter(Boolean).join(", ");
    const count = Math.min(Math.max(words.length * 2, 5), 10);

    const userPrompt = `You are an English learning assistant for Brazilian Portuguese speakers.
Generate exactly ${count} example sentences in English using these words: ${wordList}.
For each sentence, provide ONLY the translation of the keyword (1-5 words in Portuguese), NOT the full sentence translation.

Respond ONLY with a valid JSON array (no markdown, no extra text):
[{"word":"keyword in base form as given","en":"Full English sentence.","wordTranslation":"tradução da palavra-chave"}]`;

    const response = await fetch(`${GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
        "x-lovable-project-id": import.meta.env.VITE_SUPABASE_PROJECT_ID as string,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      if (response.status === 429) return { error: "Limite de requisições atingido. Tente novamente em alguns segundos. (429)" };
      if (response.status === 402) return { error: "Créditos insuficientes para gerar frases via IA. (402)" };
      return { error: `Erro na API: ${response.status} - ${errText}` };
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";

    const jsonMatch = content.match(/\[[\s\S]*?\]/s);
    if (!jsonMatch) return { error: "Formato de resposta inválido da IA." };

    const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>[];
    const sentences: Sentence[] = raw
      .filter((s) => s.word && s.en && s.wordTranslation)
      .map((s, i) => ({
        id: `ai-${String(s.word).toLowerCase()}-${i}-${Date.now()}`,
        word: String(s.word).toLowerCase().trim(),
        en: String(s.en).trim(),
        wordTranslation: String(s.wordTranslation).trim(),
      }));

    if (sentences.length === 0) return { error: "O modelo não retornou frases. Tente novamente." };

    return { sentences };
  } catch (err) {
    return { error: `Falha na conexão: ${err instanceof Error ? err.message : String(err)}` };
  }
}
