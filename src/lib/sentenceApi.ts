import type { Sentence } from "@/lib/sentenceData";

const GATEWAY_URL = "https://api.ai.lovable.app/openai/v1";

// This is the publishable Lovable AI key — safe to use in frontend
const LOVABLE_API_KEY = import.meta.env.VITE_LOVABLE_API_KEY as string | undefined;

export interface GenerateResult {
  sentences?: Sentence[];
  error?: string;
}

export async function generateSentencesAI(words: string[]): Promise<GenerateResult> {
  if (!LOVABLE_API_KEY) {
    return { error: "Chave de API não configurada." };
  }

  try {
    const wordList = words.map((w) => w.trim()).filter(Boolean).join(", ");
    const count = Math.min(Math.max(words.length * 2, 5), 10);

    const userPrompt = `You are an English learning assistant for Brazilian Portuguese speakers.
Generate exactly ${count} example sentences in English using these words: ${wordList}.
For each sentence, provide ONLY the translation of the keyword (1-5 words in Portuguese), NOT the full sentence.

Respond ONLY with a valid JSON array, no markdown, no extra text:
[{"word":"keyword in base form","en":"Full sentence in English.","wordTranslation":"tradução da palavra"}]`;

    const response = await fetch(`${GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
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
      if (response.status === 429) {
        return { error: "Limite de requisições atingido. Tente novamente em alguns segundos. (429)" };
      }
      if (response.status === 402) {
        return { error: "Créditos insuficientes para gerar frases via IA. (402)" };
      }
      return { error: `Erro na API: ${response.status} - ${errText}` };
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";

    // Strip markdown code blocks if present
    const jsonMatch = content.match(/\[[\s\S]*?\]/s);
    if (!jsonMatch) {
      return { error: "Formato de resposta inválido da IA." };
    }

    const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>[];
    const sentences: Sentence[] = raw
      .filter((s) => s.word && s.en && s.wordTranslation)
      .map((s, i) => ({
        id: `ai-${String(s.word).toLowerCase()}-${i}-${Date.now()}`,
        word: String(s.word).toLowerCase().trim(),
        en: String(s.en).trim(),
        wordTranslation: String(s.wordTranslation).trim(),
      }));

    if (sentences.length === 0) {
      return { error: "O modelo não retornou frases. Tente novamente." };
    }

    return { sentences };
  } catch (err) {
    return { error: `Falha na conexão: ${err instanceof Error ? err.message : String(err)}` };
  }
}
