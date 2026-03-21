import { useState } from "react";
import { Volume2, CheckCircle2, Clock, Check } from "lucide-react";
import type { TrackedSentence } from "@/hooks/useLearning";

interface SentenceCardProps {
  sentence: TrackedSentence;
  index: number;
  onLearn: (id: string) => void;
  onReview: (id: string) => void;
}

export function SentenceCard({ sentence, index, onLearn, onReview }: SentenceCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  function handleSpeak() {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(sentence.en);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  const isLearned = sentence.status === "learned";
  const isReview = sentence.status === "review";

  return (
    <div
      className={`
        animate-fade-up ${staggerClass}
        relative rounded-2xl bg-card border border-border shadow-card
        transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5
        overflow-hidden
        ${isLearned ? "ring-2 ring-success/40 bg-success/5" : ""}
        ${isReview ? "ring-2 ring-accent/50 bg-accent/5" : ""}
      `}
    >
      {/* Word tag */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          #{sentence.word}
        </span>
        {isLearned && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} /> Aprendida
          </span>
        )}
        {isReview && !isLearned && (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-accent/20 px-2.5 py-0.5 rounded-full">
            <Clock size={12} /> Revisar depois
          </span>
        )}
      </div>

      {/* Sentence */}
      <div className="px-5 pb-3">
        <p className="text-base font-semibold text-foreground leading-relaxed">
          {sentence.en}
        </p>

        {/* Translation reveal */}
        <button
          className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-dashed underline-offset-4 cursor-pointer"
          onClick={() => setShowTranslation((v) => !v)}
          aria-expanded={showTranslation}
        >
          {showTranslation ? "Ocultar tradução" : "Ver tradução"}
        </button>

        {showTranslation && (
          <p className="mt-1.5 text-sm text-muted-foreground animate-fade-in italic">
            {sentence.pt}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-5 pb-4 pt-1">
        {/* Audio button */}
        <button
          onClick={handleSpeak}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border
            transition-all duration-200 active:scale-95
            ${speaking
              ? "bg-primary/10 text-primary border-primary/30 animate-pulse"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground"
            }
          `}
          title="Ouvir pronúncia"
        >
          <Volume2 size={13} />
          {speaking ? "Falando..." : "Ouvir"}
        </button>

        <div className="flex-1" />

        {/* Review button */}
        {!isLearned && (
          <button
            onClick={() => onReview(sentence.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border
              transition-all duration-200 active:scale-95
              ${isReview
                ? "bg-accent text-accent-foreground border-accent/60"
                : "bg-accent/10 text-amber-700 border-accent/40 hover:bg-accent/20"
              }
            `}
          >
            <Clock size={13} />
            Revisar
          </button>
        )}

        {/* Learn button */}
        <button
          onClick={() => onLearn(sentence.id)}
          disabled={isLearned}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border
            transition-all duration-200 active:scale-95
            ${isLearned
              ? "bg-success/15 text-success border-success/30 cursor-default"
              : "bg-success text-success-foreground border-success/60 hover:bg-primary-hover shadow-sm"
            }
          `}
        >
          <Check size={13} />
          {isLearned ? "Aprendida!" : "Aprendi"}
        </button>
      </div>
    </div>
  );
}
