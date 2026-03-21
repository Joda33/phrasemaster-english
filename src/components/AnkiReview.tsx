import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, RotateCcw, Volume2, BookOpen } from "lucide-react";
import type { ReviewCard } from "@/hooks/useLearning";

interface AnkiReviewProps {
  cards: ReviewCard[];
  allCards: ReviewCard[];
  onCorrect: (id: string) => void;
  onWrong: (id: string) => void;
  onRemove: (id: string) => void;
}

export function AnkiReview({ cards, allCards, onCorrect, onWrong, onRemove }: AnkiReviewProps) {
  const [revealed, setRevealed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);

  const dueCards = useMemo(() => cards, [cards]);
  const current = dueCards[currentIndex % Math.max(dueCards.length, 1)];

  function handleSpeak(text: string) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleAnswer(correct: boolean) {
    if (!current) return;
    setAnswered(correct ? "correct" : "wrong");

    setTimeout(() => {
      if (correct) onCorrect(current.id);
      else onWrong(current.id);

      setRevealed(false);
      setAnswered(null);
      setCurrentIndex((i) => i + 1);
    }, 600);
  }

  // Empty state
  if (allCards.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
          <BookOpen size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Nenhuma frase na revisão</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Na aba <strong>Gerar Frases</strong>, clique em <strong>"Adicionar à revisão"</strong> nas frases que quiser estudar.
        </p>
      </div>
    );
  }

  // All done for now
  if (dueCards.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-5">
          <CheckCircle2 size={36} className="text-success" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Sessão concluída! 🎉</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Você revisou todas as frases disponíveis agora. As demais aparecerão em breve conforme o sistema de repetição espaçada.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {allCards.length} carta{allCards.length !== 1 ? "s" : ""} no baralho total
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-bold text-foreground">{dueCards.length}</span> para revisar agora
        </span>
        <span>
          <span className="font-bold text-foreground">{allCards.length}</span> no baralho total
        </span>
      </div>

      {/* Flashcard */}
      {current && (
        <div
          className={`
            relative rounded-3xl border overflow-hidden shadow-card
            transition-all duration-300
            ${answered === "correct" ? "ring-4 ring-success/60 bg-success/5" : ""}
            ${answered === "wrong" ? "ring-4 ring-destructive/50 bg-destructive/5" : ""}
            ${!answered ? "bg-card border-border" : ""}
          `}
        >
          {/* Front */}
          <div className="px-6 pt-7 pb-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                #{current.word}
              </span>
              <button
                onClick={() => handleSpeak(current.en)}
                className="w-8 h-8 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-all active:scale-95"
              >
                <Volume2 size={15} />
              </button>
            </div>

            <p className="text-xl font-semibold text-foreground leading-relaxed mb-2">
              {current.en.split(new RegExp(`(\\b${current.word}\\w*\\b)`, "gi")).map((part, i) =>
                new RegExp(`^${current.word}`, "i").test(part) ? (
                  <mark key={i} className="bg-primary/15 text-primary font-bold rounded px-0.5 not-italic">
                    {part}
                  </mark>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-dashed border-border" />

          {/* Back (revealed) */}
          <div className="px-6 py-5">
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 active:scale-[0.98] shadow-sm"
              >
                Revelar tradução da palavra
              </button>
            ) : (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-center justify-center gap-3 py-2">
                  <span className="text-2xl font-bold text-primary">{current.word}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-2xl font-bold text-foreground">{current.wordTranslation}</span>
                </div>

                {/* Answer buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={!!answered}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/30 font-bold text-sm transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-[0.97] disabled:opacity-50"
                  >
                    <XCircle size={17} />
                    Errei
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={!!answered}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-success/10 text-success border border-success/30 font-bold text-sm transition-all hover:bg-success hover:text-success-foreground active:scale-[0.97] disabled:opacity-50"
                  >
                    <CheckCircle2 size={17} />
                    Acertei
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interval hint */}
      {revealed && current && (
        <p className="text-center text-xs text-muted-foreground animate-fade-in">
          Intervalo atual: <strong>{current.interval}</strong> round{current.interval !== 1 ? "s" : ""} •
          {" "}Acertar dobra o intervalo, errar reinicia para 1
        </p>
      )}

      {/* Reset button */}
      <button
        onClick={() => setCurrentIndex(0)}
        className="flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw size={12} />
        Reiniciar sessão
      </button>
    </div>
  );
}
