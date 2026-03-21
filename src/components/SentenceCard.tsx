import { useState } from "react";
import { Volume2, BookmarkPlus, Check } from "lucide-react";
import type { Sentence } from "@/lib/sentenceData";

interface SentenceCardProps {
  sentence: Sentence & { status: "pending" | "added" };
  index: number;
  onAddToReview: (id: string) => void;
}

/** Highlights the keyword within the sentence text */
function HighlightedSentence({ text, keyword }: { text: string; keyword: string }) {
  const regex = new RegExp(`(\\b${keyword}\\w*\\b)`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/15 text-primary font-bold rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function SentenceCard({ sentence, index, onAddToReview }: SentenceCardProps) {
  const [speaking, setSpeaking] = useState(false);
  const isAdded = sentence.status === "added";
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

  return (
    <div
      className={`
        animate-fade-up ${staggerClass}
        rounded-2xl bg-card border border-border shadow-card
        transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5
        overflow-hidden
        ${isAdded ? "ring-2 ring-primary/30 bg-primary/5" : ""}
      `}
    >
      {/* Word tag */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          #{sentence.word}
        </span>
        {isAdded && (
          <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            <Check size={11} /> Na revisão
          </span>
        )}
      </div>

      {/* Sentence */}
      <div className="px-5 pb-2">
        <p className="text-base font-medium text-foreground leading-relaxed">
          <HighlightedSentence text={sentence.en} keyword={sentence.word} />
        </p>
      </div>

      {/* Keyword translation */}
      <div className="px-5 pb-3">
        <span className="inline-flex items-center gap-1.5 text-sm bg-muted rounded-xl px-3 py-1.5 text-foreground">
          <span className="font-bold text-primary">{sentence.word}</span>
          <span className="text-muted-foreground">=</span>
          <span className="font-semibold">{sentence.wordTranslation}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-5 pb-4 pt-1">
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
        >
          <Volume2 size={13} />
          {speaking ? "Falando..." : "Ouvir"}
        </button>

        <div className="flex-1" />

        <button
          onClick={() => !isAdded && onAddToReview(sentence.id)}
          disabled={isAdded}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border
            transition-all duration-200 active:scale-95
            ${isAdded
              ? "bg-primary/10 text-primary border-primary/30 cursor-default"
              : "bg-primary text-primary-foreground border-primary/60 hover:bg-primary/90 shadow-sm"
            }
          `}
        >
          <BookmarkPlus size={13} />
          {isAdded ? "Adicionada!" : "Adicionar à revisão"}
        </button>
      </div>
    </div>
  );
}
