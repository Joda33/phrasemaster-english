import { useState, useCallback } from "react";
import { BookOpen, Layers, Trophy, Sparkles } from "lucide-react";
import { generateSentences } from "@/lib/sentenceData";
import { generateSentencesAI } from "@/lib/sentenceApi";
import { useLearning } from "@/hooks/useLearning";
import { SentenceCard } from "@/components/SentenceCard";
import { AnkiReview } from "@/components/AnkiReview";
import { Leaderboard } from "@/components/Leaderboard";
import { WordInput } from "@/components/WordInput";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type Tab = "generate" | "review" | "leaderboard";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "generate",    label: "Gerar Frases", icon: <Sparkles size={15} /> },
  { id: "review",      label: "Revisão",      icon: <Layers size={15} /> },
  { id: "leaderboard", label: "Ranking",      icon: <Trophy size={15} /> },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const {
    sentences,
    score,
    scorePop,
    reviewCards,
    getDueCards,
    loadSentences,
    addToReview,
    markCorrect,
    markWrong,
    removeCard,
  } = useLearning();

  const handleGenerate = useCallback(async (words: string[]) => {
    setIsLoading(true);

    const result = await generateSentencesAI(words);

    if (result.error) {
      const isQuota = result.error.includes("429") || result.error.includes("Limite");
      const isPayment = result.error.includes("402") || result.error.includes("Créditos");

      if (isQuota || isPayment) {
        toast({
          title: isPayment ? "Créditos insuficientes" : "Muitas requisições",
          description: result.error,
          variant: "destructive",
        });
      }

      toast({
        title: "Usando banco de frases local",
        description: "Não foi possível conectar à IA. Usando exemplos pré-definidos.",
      });
      loadSentences(generateSentences(words));
    } else if (result.sentences) {
      loadSentences(result.sentences);
    }

    // Alteração segura na ordem de encerramento para mitigar erros de re-renderização no DOM
    setIsLoading(false);
    setGenerated(true);
  }, [loadSentences, toast]);

  const dueCards = getDueCards();
  const reviewBadge = dueCards.length > 0 ? dueCards.length : (reviewCards.length > 0 ? "·" : null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-tight">SentenceMiner</span>
          </div>
          <ScoreDisplay score={score} pop={scorePop} />
        </div>
      </header>

      {/* Tab bar */}
      <nav className="sticky top-14 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-1.5 flex-1 justify-center py-3 text-sm font-semibold
                    transition-all duration-200
                    ${isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === "review" && reviewBadge !== null && (
                    <span className="absolute top-2 right-[calc(50%-32px)] min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                      {reviewBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 py-6 pb-16">

        {/* ── GENERATE TAB ── */}
        {activeTab === "generate" && (
          <div className="space-y-6">
            {!generated && (
              <div className="animate-fade-up rounded-3xl p-6 text-primary-foreground text-center shadow-score hero-gradient">
                <div className="text-4xl mb-3 animate-bounce-small">📖</div>
                <h1 className="text-xl font-bold mb-1">Aprenda inglês com frases reais</h1>
                <p className="text-sm opacity-85">
                  Digite palavras que você quer dominar e gere frases contextualizadas com tradução da palavra-chave.
                </p>
              </div>
            )}

            <div className="bg-card rounded-3xl border border-border shadow-card p-5">
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                Escolha suas palavras
              </h2>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                  <Sparkles size={10} /> Powered by Edge Function & Groq
                </span>
              </div>
              <WordInput onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Loading skeletons */}
            {isLoading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-36 rounded-2xl bg-muted animate-pulse stagger-${i + 1}`} />
                ))}
              </div>
            )}

            {/* Sentence cards */}
            {!isLoading && sentences.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <BookOpen size={15} className="text-primary" />
                    Suas frases ({sentences.length})
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {sentences.filter(s => s.status === "added").length} adicionada{sentences.filter(s => s.status === "added").length !== 1 ? "s" : ""}
                  </span>
                </div>
                {sentences.map((sentence, idx) => (
                  <SentenceCard
                    key={sentence.id}
                    sentence={sentence}
                    index={idx}
                    onAddToReview={addToReview}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVIEW TAB ── */}
        {activeTab === "review" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Revisão Espaçada
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Estilo Anki: acerte para ver menos, erre para ver mais. +10pts por acerto, −5pts por erro.
              </p>
            </div>
            <AnkiReview
              cards={dueCards}
              allCards={reviewCards}
              onCorrect={markCorrect}
              onWrong={markWrong}
              onRemove={removeCard}
            />
          </div>
        )}

        {/* ── LEADERBOARD TAB ── */}
        {activeTab === "leaderboard" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Trophy size={16} className="text-primary" />
                Ranking da Semana
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                +10 pts por acerto · −5 pts por erro
              </p>
            </div>
            <Leaderboard userScore={score} />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}