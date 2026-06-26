import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { words } = await req.json()
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      throw new Error("Nenhuma palavra enviada.")
    }

    const wordList = words.map((w) => String(w).trim()).filter(Boolean).join(", ")
    const count = Math.min(Math.max(words.length * 2, 5), 10)

    const systemPrompt = `You are an English learning assistant for Brazilian Portuguese speakers.
Generate exactly ${count} example sentences in English using these words: ${wordList}.
For each sentence, provide ONLY the translation of the keyword (1-5 words in Portuguese), NOT the full sentence translation.
You must respond with a JSON object containing a "sentences" key with the array structure requested.`

    const userPrompt = `Respond ONLY with a valid JSON object matching this schema (no markdown formatting, no text before or after):
{
  "sentences": [
    {"word": "keyword in base form", "en": "Full English sentence.", "wordTranslation": "tradução da palavra chave"}
  ]
}`

    const apiKey = Deno.env.get("GROQ_API_KEY")
    if (!apiKey) {
      throw new Error("A variável de ambiente GROQ_API_KEY não está configurada no Supabase.")
    }

    // Chamada corrigida com a presença obrigatória da role 'user'
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt } // <- Incluído de volta para validar com a Groq
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Erro na API do Groq: ${response.status} - ${errText}`)
    }

    const data = await response.json()
    let content: string = data.choices?.[0]?.message?.content ?? ""

    content = content.trim()
    if (content.startsWith("```")) {
      content = content.replace(/^```json\s*/i, "").replace(/```$/, "").trim()
    }

    let parsedData
    try {
      parsedData = JSON.parse(content)
    } catch (e) {
      const arrayMatch = content.match(/\[[\s\S]*?\]/s)
      if (arrayMatch) {
        parsedData = { sentences: JSON.parse(arrayMatch[0]) }
      } else {
        throw new Error("Falha crítica na decodificação do JSON da IA.")
      }
    }

    if (Array.isArray(parsedData)) {
      parsedData = { sentences: parsedData }
    }

    if (!parsedData.sentences || !Array.isArray(parsedData.sentences)) {
      throw new Error("O JSON gerado não contém a propriedade 'sentences'.")
    }

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error("Erro interno detectado:", error.message)
    return new Response(
      JSON.stringify({ error: error.message, sentences: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})