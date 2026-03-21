// -------------------------------------------------------
// Sentence bank for sentence mining.
// Structure: word → array of { en, wordTranslation }
// -------------------------------------------------------

export interface Sentence {
  id: string;
  word: string;        // keyword used in the sentence
  en: string;          // full sentence in English
  wordTranslation: string; // translation of the keyword only
}

type SentenceBank = Record<string, { en: string; wordTranslation: string }[]>;

const SENTENCE_BANK: SentenceBank = {
  get: [
    { en: "I need to get a new passport before the trip.", wordTranslation: "conseguir / obter" },
    { en: "She didn't get the joke at first.", wordTranslation: "entender" },
    { en: "Can you get me a glass of water, please?", wordTranslation: "pegar / trazer" },
    { en: "He gets up at six every morning to go running.", wordTranslation: "levantar" },
    { en: "We need to get this project done by Friday.", wordTranslation: "fazer / concluir" },
    { en: "I'll get back to you as soon as I can.", wordTranslation: "retornar / responder" },
    { en: "Did you get my message last night?", wordTranslation: "receber" },
  ],
  take: [
    { en: "Could you take a photo of us, please?", wordTranslation: "tirar (foto)" },
    { en: "It will take about two hours to get there.", wordTranslation: "levar (tempo)" },
    { en: "She decided to take a day off to rest.", wordTranslation: "tirar (folga)" },
    { en: "Don't forget to take your medicine after lunch.", wordTranslation: "tomar (remédio)" },
    { en: "He can't take criticism very well.", wordTranslation: "lidar com" },
    { en: "We should take this opportunity seriously.", wordTranslation: "aproveitar" },
    { en: "Take your time — there's no rush.", wordTranslation: "levar o seu tempo" },
  ],
  run: [
    { en: "I run three miles every morning before work.", wordTranslation: "correr" },
    { en: "The company has been run by the same family for decades.", wordTranslation: "administrar / gerir" },
    { en: "She ran out of coffee and had to buy more.", wordTranslation: "ficar sem" },
    { en: "We need someone to run the marketing department.", wordTranslation: "dirigir / gerenciar" },
    { en: "The software runs perfectly on the new computer.", wordTranslation: "rodar / executar" },
    { en: "I'll run some tests to check the results.", wordTranslation: "realizar / fazer" },
    { en: "He runs a small restaurant downtown.", wordTranslation: "tocar / administrar" },
  ],
  make: [
    { en: "I'll make dinner tonight if you do the dishes.", wordTranslation: "fazer / preparar" },
    { en: "She makes good decisions under pressure.", wordTranslation: "tomar (decisões)" },
    { en: "He made a promise he couldn't keep.", wordTranslation: "fazer / cumprir" },
    { en: "You really made a difference in people's lives.", wordTranslation: "fazer diferença" },
    { en: "Let's make the most of this beautiful day.", wordTranslation: "aproveitar ao máximo" },
    { en: "Can you make sure the door is locked?", wordTranslation: "certificar-se" },
  ],
  go: [
    { en: "Let's go for a walk in the park this afternoon.", wordTranslation: "dar (uma volta)" },
    { en: "Things don't always go as planned.", wordTranslation: "correr / sair" },
    { en: "She went back to school to finish her degree.", wordTranslation: "voltar" },
    { en: "How is everything going at work?", wordTranslation: "estar indo / ir" },
    { en: "He goes to the gym every other day.", wordTranslation: "ir" },
  ],
  know: [
    { en: "I know how difficult this situation must be for you.", wordTranslation: "saber / entender" },
    { en: "She knows three languages fluently.", wordTranslation: "falar / dominar" },
    { en: "Do you know where the nearest pharmacy is?", wordTranslation: "saber" },
    { en: "You never know what might happen tomorrow.", wordTranslation: "saber / prever" },
    { en: "I knew it! I had a feeling this would happen.", wordTranslation: "sabia!" },
  ],
  think: [
    { en: "I think we should leave early to avoid traffic.", wordTranslation: "achar / pensar" },
    { en: "She thinks outside the box when solving problems.", wordTranslation: "pensar fora da caixa" },
    { en: "He was thinking about quitting his job.", wordTranslation: "pensar em" },
    { en: "Think carefully before making any decisions.", wordTranslation: "pensar / refletir" },
  ],
  come: [
    { en: "Come over whenever you feel like it.", wordTranslation: "vir / aparecer" },
    { en: "He came up with a brilliant solution to the problem.", wordTranslation: "pensar em / inventar" },
    { en: "She came across an old photo in the drawer.", wordTranslation: "encontrar por acaso" },
    { en: "It all comes down to how hard you work.", wordTranslation: "resumir-se a" },
  ],
  see: [
    { en: "I see what you mean, but I disagree.", wordTranslation: "entender / compreender" },
    { en: "She sees a therapist every two weeks.", wordTranslation: "consultar / ver" },
    { en: "Can you see the mountains from your window?", wordTranslation: "ver / enxergar" },
    { en: "Let me see if I can find the receipt.", wordTranslation: "ver / verificar" },
  ],
  give: [
    { en: "She gave a wonderful speech at the conference.", wordTranslation: "fazer (discurso)" },
    { en: "Can you give me a hand with these boxes?", wordTranslation: "dar uma mão" },
    { en: "He gave up smoking two years ago.", wordTranslation: "desistir / largar" },
    { en: "Give it a try before deciding it's not for you.", wordTranslation: "tentar / experimentar" },
  ],
  work: [
    { en: "Hard work and dedication always pay off eventually.", wordTranslation: "trabalho / esforço" },
    { en: "She works best when she has a quiet environment.", wordTranslation: "trabalhar / render" },
    { en: "The plan didn't work out as we expected.", wordTranslation: "dar certo / funcionar" },
    { en: "This machine doesn't work properly anymore.", wordTranslation: "funcionar" },
  ],
};

const FALLBACK: { en: string; wordTranslation: string }[] = [
  { en: "Learning English opens many doors in life.", wordTranslation: "aprender" },
  { en: "Practice makes perfect — keep going!", wordTranslation: "praticar" },
  { en: "Every word you learn brings you closer to fluency.", wordTranslation: "aprender" },
];

export function generateSentences(words: string[]): Sentence[] {
  const normalised = words.map((w) => w.trim().toLowerCase()).filter(Boolean);
  if (normalised.length === 0) return [];

  const result: Sentence[] = [];
  const perWord = Math.max(2, Math.round(8 / normalised.length));

  normalised.forEach((word) => {
    const pool = SENTENCE_BANK[word] ?? FALLBACK;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, perWord);
    picked.forEach((s, i) => {
      result.push({ id: `${word}-${i}-${Date.now()}`, word, en: s.en, wordTranslation: s.wordTranslation });
    });
  });

  return result.sort(() => Math.random() - 0.5).slice(0, 10);
}

export const ALL_AVAILABLE_WORDS = Object.keys(SENTENCE_BANK);
