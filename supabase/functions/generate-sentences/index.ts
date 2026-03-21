import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GATEWAY_URL = "https://api.ai.lovable.app/openai/v1";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { words } = await req.json() as { words: string[] };

    if (!words || words.length === 0) {
      return new Response(JSON.stringify({ error: "No words provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const wordList = words.map((w: string) => w.trim()).filter(Boolean).join(", ");
    const count = Math.min(Math.max(words.length * 2, 5), 10);

    const userPrompt = `You are an English learning assistant for Brazilian Portuguese speakers.
Generate exactly ${count} example sentences in English using these words: ${wordList}.
For each sentence, provide ONLY the translation of the keyword (1-5 words in Portuguese), NOT the full sentence.

Respond ONLY with a JSON array, no markdown:
[{"word":"keyword","en":"Full sentence.","wordTranslation":"tradução da palavra"}]`;

    const response = await fetch(`${GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
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
      const errText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente. (429)" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. (402)" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `Erro na API: ${response.status} - ${errText}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";

    // Strip markdown code blocks if present
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Invalid AI response format", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>[];
    const sentences = raw
      .filter((s) => s.word && s.en && s.wordTranslation)
      .map((s, i) => ({
        id: `ai-${String(s.word).toLowerCase()}-${i}-${Date.now()}`,
        word: String(s.word).toLowerCase().trim(),
        en: String(s.en).trim(),
        wordTranslation: String(s.wordTranslation).trim(),
      }));

    return new Response(JSON.stringify({ sentences }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Erro interno: ${msg}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
