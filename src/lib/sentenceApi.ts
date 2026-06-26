import { createClient } from "@supabase/supabase-js";
import type { Sentence } from "@/lib/sentenceData";

// Instancia o cliente do Supabase usando as variáveis de ambiente que o projeto já possui
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface GenerateResult {
  sentences?: Sentence[];
  error?: string;
}

export async function generateSentencesAI(words: string[]): Promise<GenerateResult> {
  try {
    // Filtra e limpa a lista de palavras enviadas pelo input
    const cleanedWords = words.map((w) => w.trim().toLowerCase()).filter(Boolean);
    if (cleanedWords.length === 0) return { error: "Nenhuma palavra válida fornecida." };

    // Chama a Edge Function 'generate-sentences' criada no seu Supabase
    const { data, error } = await supabase.functions.invoke("generate-sentences", {
      body: { words: cleanedWords },
    });

    // Se a Edge Function retornar algum erro
    if (error) {
      console.error("Erro na Edge Function:", error);
      return { error: `Erro na Edge Function do Supabase: ${error.message || error}` };
    }

    // Se a resposta não contiver a propriedade 'sentences' ou não for um array
    if (!data || !Array.isArray(data.sentences)) {
      return { error: "O servidor não retornou a lista de frases no formato esperado." };
    }

    // Formata os dados recebidos da IA/Groq para o formato padrão dos cards
    const sentences: Sentence[] = data.sentences.map((s: any, i: number) => ({
      id: `ai-${String(s.word).toLowerCase()}-${i}-${Date.now()}`,
      word: String(s.word).toLowerCase().trim(),
      en: String(s.en).trim(),
      wordTranslation: String(s.wordTranslation).trim(),
    }));

    return { sentences };
  } catch (err) {
    console.error("Falha na requisição:", err);
    return { error: `Falha na conexão com o servidor: ${err instanceof Error ? err.message : String(err)}` };
  }
}