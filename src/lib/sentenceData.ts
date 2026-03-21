// -------------------------------------------------------
// Sentence bank for sentence mining.
// Structure: word → array of { en, pt }
// Easily replaceable by an AI API call later.
// -------------------------------------------------------

export interface Sentence {
  id: string;
  word: string;
  en: string;
  pt: string;
}

type SentenceBank = Record<string, { en: string; pt: string }[]>;

const SENTENCE_BANK: SentenceBank = {
  get: [
    { en: "I need to get a new passport before the trip.", pt: "Preciso tirar um passaporte novo antes da viagem." },
    { en: "She didn't get the joke at first.", pt: "Ela não entendeu a piada de início." },
    { en: "Can you get me a glass of water, please?", pt: "Você pode me pegar um copo d'água, por favor?" },
    { en: "He gets up at six every morning to go running.", pt: "Ele acorda às seis toda manhã para correr." },
    { en: "We need to get this project done by Friday.", pt: "Precisamos terminar este projeto até sexta-feira." },
    { en: "I'll get back to you as soon as I can.", pt: "Retornarei para você assim que puder." },
    { en: "Did you get my message last night?", pt: "Você recebeu minha mensagem ontem à noite?" },
  ],
  take: [
    { en: "Could you take a photo of us, please?", pt: "Você poderia tirar uma foto de nós, por favor?" },
    { en: "It will take about two hours to get there.", pt: "Vai levar cerca de duas horas para chegar lá." },
    { en: "She decided to take a day off to rest.", pt: "Ela decidiu tirar um dia de folga para descansar." },
    { en: "Don't forget to take your medicine after lunch.", pt: "Não se esqueça de tomar seu remédio depois do almoço." },
    { en: "He can't take criticism very well.", pt: "Ele não lida bem com críticas." },
    { en: "We should take this opportunity seriously.", pt: "Devemos levar essa oportunidade a sério." },
    { en: "Take your time — there's no rush.", pt: "Leve o seu tempo — não há pressa." },
  ],
  run: [
    { en: "I run three miles every morning before work.", pt: "Corro três milhas toda manhã antes do trabalho." },
    { en: "The company has been run by the same family for decades.", pt: "A empresa é gerida pela mesma família há décadas." },
    { en: "She ran out of coffee and had to buy more.", pt: "Ela ficou sem café e teve que comprar mais." },
    { en: "We need someone to run the marketing department.", pt: "Precisamos de alguém para administrar o departamento de marketing." },
    { en: "The software runs perfectly on the new computer.", pt: "O software roda perfeitamente no novo computador." },
    { en: "I'll run some tests to check the results.", pt: "Vou fazer alguns testes para verificar os resultados." },
    { en: "He runs a small restaurant downtown.", pt: "Ele gerencia um pequeno restaurante no centro." },
  ],
  make: [
    { en: "I'll make dinner tonight if you do the dishes.", pt: "Eu faço o jantar hoje se você lavar a louça." },
    { en: "She makes good decisions under pressure.", pt: "Ela toma boas decisões sob pressão." },
    { en: "The noise made it hard to concentrate.", pt: "O barulho tornou difícil concentrar." },
    { en: "He made a promise he couldn't keep.", pt: "Ele fez uma promessa que não conseguiu cumprir." },
    { en: "You really made a difference in people's lives.", pt: "Você realmente fez diferença na vida das pessoas." },
    { en: "Let's make the most of this beautiful day.", pt: "Vamos aproveitar ao máximo esse dia lindo." },
    { en: "Can you make sure the door is locked?", pt: "Você pode verificar se a porta está trancada?" },
  ],
  go: [
    { en: "Let's go for a walk in the park this afternoon.", pt: "Vamos dar uma caminhada no parque esta tarde." },
    { en: "Things don't always go as planned.", pt: "As coisas nem sempre saem como planejado." },
    { en: "She went back to school to finish her degree.", pt: "Ela voltou para a escola para terminar seu diploma." },
    { en: "The meeting went really well today.", pt: "A reunião foi muito bem hoje." },
    { en: "How is everything going at work?", pt: "Como está indo tudo no trabalho?" },
    { en: "He goes to the gym every other day.", pt: "Ele vai à academia a cada dois dias." },
    { en: "I need to go grocery shopping this weekend.", pt: "Preciso fazer compras este fim de semana." },
  ],
  know: [
    { en: "I know how difficult this situation must be for you.", pt: "Eu sei o quão difícil essa situação deve ser para você." },
    { en: "She knows three languages fluently.", pt: "Ela fala três idiomas fluentemente." },
    { en: "Do you know where the nearest pharmacy is?", pt: "Você sabe onde fica a farmácia mais próxima?" },
    { en: "He doesn't know what he wants to do with his life.", pt: "Ele não sabe o que quer fazer com sua vida." },
    { en: "As far as I know, the store closes at nine.", pt: "Até onde eu sei, a loja fecha às nove." },
    { en: "You never know what might happen tomorrow.", pt: "Você nunca sabe o que pode acontecer amanhã." },
    { en: "I knew it! I had a feeling this would happen.", pt: "Eu sabia! Eu tinha um pressentimento que isso aconteceria." },
  ],
  think: [
    { en: "I think we should leave early to avoid traffic.", pt: "Acho que devemos sair cedo para evitar o trânsito." },
    { en: "She thinks outside the box when solving problems.", pt: "Ela pensa fora da caixa ao resolver problemas." },
    { en: "What do you think about moving to a new city?", pt: "O que você acha de se mudar para uma nova cidade?" },
    { en: "He was thinking about quitting his job.", pt: "Ele estava pensando em largar o emprego." },
    { en: "Think carefully before making any decisions.", pt: "Pense com cuidado antes de tomar qualquer decisão." },
    { en: "I didn't think it would be this cold today.", pt: "Não pensei que estaria tão frio hoje." },
    { en: "She thinks highly of everyone on her team.", pt: "Ela tem uma boa opinião de todos no seu time." },
  ],
  come: [
    { en: "Come over whenever you feel like it.", pt: "Venha quando quiser." },
    { en: "The results will come out next week.", pt: "Os resultados sairão na semana que vem." },
    { en: "He came up with a brilliant solution to the problem.", pt: "Ele veio com uma solução brilhante para o problema." },
    { en: "She came across an old photo in the drawer.", pt: "Ela encontrou uma foto antiga na gaveta." },
    { en: "It all comes down to how hard you work.", pt: "Tudo se resume a quanto esforço você dedica." },
    { en: "The idea came to me in the middle of the night.", pt: "A ideia me veio no meio da madrugada." },
    { en: "Come on, you can do better than that!", pt: "Vamos lá, você pode fazer melhor do que isso!" },
  ],
  see: [
    { en: "I see what you mean, but I disagree.", pt: "Entendo o que você quer dizer, mas discordo." },
    { en: "We'll see how things go after the meeting.", pt: "Vamos ver como as coisas caminham depois da reunião." },
    { en: "She sees a therapist every two weeks.", pt: "Ela vê um terapeuta a cada duas semanas." },
    { en: "Can you see the mountains from your window?", pt: "Você consegue ver as montanhas pela sua janela?" },
    { en: "I'm seeing someone new — we've been dating for a month.", pt: "Estou saindo com alguém novo — namoramos há um mês." },
    { en: "Let me see if I can find the receipt.", pt: "Deixa eu ver se consigo encontrar o recibo." },
    { en: "I haven't seen him since the graduation party.", pt: "Não o vejo desde a festa de formatura." },
  ],
  give: [
    { en: "She gave a wonderful speech at the conference.", pt: "Ela fez um discurso maravilhoso na conferência." },
    { en: "Can you give me a hand with these boxes?", pt: "Você pode me dar uma mão com essas caixas?" },
    { en: "He gave up smoking two years ago.", pt: "Ele parou de fumar há dois anos." },
    { en: "Don't give up — you're almost there!", pt: "Não desista — você está quase lá!" },
    { en: "Give it a try before deciding it's not for you.", pt: "Experimente antes de decidir que não é para você." },
    { en: "The teacher gave the students extra time on the exam.", pt: "A professora deu mais tempo para os alunos na prova." },
    { en: "I'd give anything to be there right now.", pt: "Eu daria tudo para estar lá agora." },
  ],
  work: [
    { en: "Hard work and dedication always pay off eventually.", pt: "Trabalho duro e dedicação sempre compensam eventualmente." },
    { en: "She works best when she has a quiet environment.", pt: "Ela trabalha melhor quando tem um ambiente tranquilo." },
    { en: "We need to work together to solve this issue.", pt: "Precisamos trabalhar juntos para resolver esse problema." },
    { en: "The plan didn't work out as we expected.", pt: "O plano não deu certo como esperávamos." },
    { en: "He works from home three days a week.", pt: "Ele trabalha de casa três dias por semana." },
    { en: "Keep working on your English — you're improving!", pt: "Continue praticando seu inglês — você está melhorando!" },
    { en: "This machine doesn't work properly anymore.", pt: "Esta máquina não funciona mais direito." },
  ],
  say: [
    { en: "What did she say when she heard the news?", pt: "O que ela disse quando ouviu a notícia?" },
    { en: "I have to say, the food here is amazing.", pt: "Tenho que dizer, a comida aqui é incrível." },
    { en: "Say what you mean and mean what you say.", pt: "Diga o que você pensa e pense o que você diz." },
    { en: "He said he would call back, but never did.", pt: "Ele disse que ligaria de volta, mas nunca ligou." },
    { en: "It goes without saying that honesty is important.", pt: "Nem é preciso dizer que honestidade é importante." },
    { en: "That's easier said than done, you know.", pt: "Isso é mais fácil de dizer do que fazer, sabe." },
    { en: "Say hello to your family for me!", pt: "Dê um olá para sua família de minha parte!" },
  ],
  put: [
    { en: "Put your phone away during the meeting.", pt: "Guarde o celular durante a reunião." },
    { en: "She put a lot of effort into this project.", pt: "Ela colocou muito esforço neste projeto." },
    { en: "Don't put off what you can do today.", pt: "Não adie o que você pode fazer hoje." },
    { en: "He put on his coat and walked out the door.", pt: "Ele colocou o casaco e saiu pela porta." },
    { en: "We should put together a plan before moving forward.", pt: "Devemos montar um plano antes de prosseguir." },
    { en: "Put yourself in her shoes for a moment.", pt: "Se coloque no lugar dela por um momento." },
    { en: "The doctor put him on a strict diet.", pt: "O médico o colocou em uma dieta rigorosa." },
  ],
};

// Fallback sentences for words not in the bank
const FALLBACK_SENTENCES: { en: string; pt: string }[] = [
  { en: "Learning English opens many doors in life.", pt: "Aprender inglês abre muitas portas na vida." },
  { en: "Practice makes perfect — keep going!", pt: "A prática leva à perfeição — continue assim!" },
  { en: "Every word you learn brings you closer to fluency.", pt: "Cada palavra que você aprende aproxima você da fluência." },
  { en: "Reading books in English is a great habit.", pt: "Ler livros em inglês é um ótimo hábito." },
  { en: "Watching movies with English subtitles helps a lot.", pt: "Assistir filmes com legendas em inglês ajuda muito." },
];

/**
 * Generate sentences for the given words.
 * Returns 5–10 unique sentences distributed across all words.
 *
 * Replace this function body with an AI API call when ready.
 */
export function generateSentences(words: string[]): Sentence[] {
  const normalised = words.map((w) => w.trim().toLowerCase()).filter(Boolean);
  if (normalised.length === 0) return [];

  const result: Sentence[] = [];
  const perWord = Math.max(2, Math.round(8 / normalised.length));

  normalised.forEach((word) => {
    const pool = SENTENCE_BANK[word] ?? FALLBACK_SENTENCES;
    // Shuffle and pick `perWord` sentences
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, perWord);
    picked.forEach((s, i) => {
      result.push({ id: `${word}-${i}-${Date.now()}`, word, en: s.en, pt: s.pt });
    });
  });

  // Shuffle the final list
  return result.sort(() => Math.random() - 0.5).slice(0, 10);
}

export const ALL_AVAILABLE_WORDS = Object.keys(SENTENCE_BANK);
