import { useState, useCallback } from "react";
import { BookOpen, Layers, Trophy, Sparkles } from "lucide-react";
import { generateSentences } from "@/lib/sentenceData";
import { useLearning } from "@/hooks/useLearning";
import { SentenceCard } from "@/components/SentenceCard";
import { ReviewSection } from "@/components/ReviewSection";
import { Leaderboard } from "@/components/Leaderboard";
import { WordInput } from "@/components/WordInput";
import { ScoreDisplay } from "@/components/ScoreDisplay";

type Tab = "practice" | "review" | "leaderboard";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "practice",    label: "Praticar",  icon: <Sparkles size={16} /> },
  { id: "review",      label: "Revisão",   icon: <Layers size={16} /> },
  { id: "leaderboard", label: "Ranking",   icon: <Trophy size={16} /> },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("practice");
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const {
    sentences,
    score,
    scorePop,
    reviewSentences,
    loadSentences,
    markLearned,
    markReview,
    removeFromReview,
    markReviewedLearned,
  } = useLearning();

  const handleGenerate = useCallback((words: string[]) => {
    setIsLoading(true);
    // Simulate async call (replace with AI API call in future)
    setTimeout(() => {
      const result = generateSentences(words);
      loadSentences(result);
      setGenerated(true);
      setIsLoading(false);
    }, 800);
  }, [loadSentences]);

  const learnedCount = sentences.filter((s) => s.status === "learned").length;
  const pendingCount = sentences.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
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

      {/* ── Tab bar ── */}
      <nav className="sticky top-14 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const badge = tab.id === "review" && reviewSentences.length > 0
                ? reviewSentences.filter(s => s.status !== "learned").length
                : null;
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
                  {badge !== null && (
                    <span className="absolute top-2 right-[calc(50%-28px)] w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="max-w-xl mx-auto px-4 py-6 pb-16">

        {/* ── PRACTICE TAB ── */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            {/* Hero callout */}
            {!generated && (
              <div className="animate-fade-up rounded-3xl p-6 text-primary-foreground text-center shadow-score hero-gradient">
                <div className="text-4xl mb-3 animate-bounce-small">📖</div>
                <h1 className="text-xl font-bold mb-1">Aprenda inglês com frases reais</h1>
                <p className="text-sm opacity-85">
                  Digite palavras que você quer dominar e gere frases contextualizadas para memorizar de verdade.
                </p>
              </div>
            )}

            {/* Input section */}
            <div className="bg-card rounded-3xl border border-border shadow-card p-5">
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                Escolha suas palavras
              </h2>
              <WordInput onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Stats strip */}
            {generated && sentences.length > 0 && (
              <div className="animate-scale-in flex items-center gap-3 text-sm">
                <div className="flex-1 rounded-2xl bg-success/10 border border-success/20 py-3 px-4 text-center">
                  <p className="font-bold text-success text-lg tabular-nums">{learnedCount}</p>
                  <p className="text-xs text-muted-foreground">Aprendidas</p>
                </div>
                <div className="flex-1 rounded-2xl bg-muted border border-border py-3 px-4 text-center">
                  <p className="font-bold text-foreground text-lg tabular-nums">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
                <div className="flex-1 rounded-2xl bg-accent/10 border border-accent/30 py-3 px-4 text-center">
                  <p className="font-bold text-accent-foreground text-lg tabular-nums">
                    {reviewSentences.filter(s => s.status !== "learned").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Revisar</p>
                </div>
              </div>
            )}

            {/* Sentence cards */}
            {sentences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen size={15} className="text-primary" />
                  Suas frases ({sentences.length})
                </h2>
                {sentences.map((sentence, idx) => (
                  <SentenceCard
                    key={sentence.id}
                    sentence={sentence}
                    index={idx}
                    onLearn={markLearned}
                    onReview={markReview}
                  />
                ))}
              </div>
            )}

            {/* Empty state after generate */}
            {isLoading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-28 rounded-2xl bg-muted animate-pulse stagger-${i + 1}`}
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
              <h2 className="text-base font-bold text-foreground">Lista de Revisão</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Frases que você quer praticar mais antes de marcar como aprendidas.
              </p>
            </div>
            <ReviewSection
              sentences={reviewSentences}
              onLearn={markReviewedLearned}
              onRemove={removeFromReview}
            />
          </div>
        )}

        {/* ── LEADERBOARD TAB ── */}
        {activeTab === "leaderboard" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Trophy size={16} className="text-accent" />
                Ranking da Semana
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Continue aprendendo para subir no ranking! +10 pts por frase aprendida.
              </p>
            </div>
            <Leaderboard userScore={score} />
          </div>
        )}
      </main>
    </div>
  );
}
