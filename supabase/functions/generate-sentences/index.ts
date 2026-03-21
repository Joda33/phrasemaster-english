import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tool schema for structured sentence output
const SENTENCE_TOOL = {
  type: "function",
  function: {
    name: "return_sentences",
    description:
      "Return a list of English sentences based on the provided words, each with a Brazilian Portuguese translation.",
    parameters: {
      type: "object",
      properties: {
        sentences: {
          type: "array",
          minItems: 5,
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              word: {
                type: "string",
                description: "The key word used in the sentence (one of the input words).",
              },
              en: {
                type: "string",
                description: "A natural, everyday English sentence using the word.",
              },
              pt: {
                type: "string",
                description: "The Brazilian Portuguese translation of the English sentence.",
              },
            },
            required: ["word", "en", "pt"],
            additionalProperties: false,
          },
        },
      },
      required: ["sentences"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { words } = await req.json() as { words: string[] };

    if (!words || !Array.isArray(words) || words.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide at least one word." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const wordList = words.slice(0, 5).join(", ");
    const count = Math.min(10, Math.max(5, words.length * 2));

    const systemPrompt = `You are an English language learning assistant. 
Your task is to create natural, useful example sentences for language learners.
Focus on everyday situations, common phrases, and varied sentence structures.
Each sentence should clearly demonstrate how the word is used in context.
Vary the sentence complexity (simple, compound, complex) and tense (present, past, future, conditional).`;

    const userPrompt = `Generate exactly ${count} English sentences (5 to 10) using the following words: ${wordList}.
Rules:
- Distribute the sentences evenly among all provided words
- Use each word in its natural, most common everyday context
- Mix different tenses and sentence structures
- Sentences should be at B1–B2 level (intermediate English learner)
- For each sentence, provide the accurate Brazilian Portuguese translation
- Do NOT use overly formal or academic language`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [SENTENCE_TOOL],
        tool_choice: { type: "function", function: { name: "return_sentences" } },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      console.error("AI Gateway error:", response.status, text);
      throw new Error(`AI Gateway error [${response.status}]: ${text}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call returned by AI model");
    }

    const parsed = JSON.parse(toolCall.function.arguments) as {
      sentences: { word: string; en: string; pt: string }[];
    };

    return new Response(
      JSON.stringify({ sentences: parsed.sentences }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("generate-sentences error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
