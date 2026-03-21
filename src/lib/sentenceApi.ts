import { supabase } from "@/integrations/supabase/client";
import type { Sentence } from "@/lib/sentenceData";

export interface GenerateResult {
  sentences?: Sentence[];
  error?: string;
}

export async function generateSentencesAI(words: string[]): Promise<GenerateResult> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-sentences", {
      body: { words },
    });

    if (error) return { error: error.message };
    if (data?.error) return { error: data.error };
    if (!data?.sentences || !Array.isArray(data.sentences)) {
      return { error: "Resposta inválida da IA." };
    }

    const sentences: Sentence[] = (data.sentences as Record<string, unknown>[])
      .filter((s) => s.word && s.en && s.wordTranslation)
      .map((s, i) => ({
        id: String(s.id ?? `${s.word}-${i}-${Date.now()}`),
        word: String(s.word),
        en: String(s.en),
        wordTranslation: String(s.wordTranslation),
      }));

    return { sentences };
  } catch (err) {
    return { error: `Falha na conexão: ${err}` };
  }
}
