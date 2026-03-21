import { BookOpen, CheckCircle2, Trash2, Volume2 } from "lucide-react";
import type { TrackedSentence } from "@/hooks/useLearning";
import { useState } from "react";

interface ReviewSectionProps {
  sentences: TrackedSentence[];
  onLearn: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ReviewSection({ sentences, onLearn, onRemove }: ReviewSectionProps) {
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});

  function toggleTranslation(id: string) {
    setShowTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSpeak(text: string) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  if (sentences.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Nenhuma frase para revisar</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Quando você marcar frases como "Revisar depois", elas aparecerão aqui.
        </p>
      </div>
    );
  }

  const learned = sentences.filter((s) => s.status === "learned");
  const pending = sentences.filter((s) => s.status !== "learned");

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{pending.length}</span> para revisar
          {learned.length > 0 && (
            <> · <span className="font-semibold text-success">{learned.length}</span> aprendidas</>
          )}
        </p>
      </div>

      <div className="space-y-3">
        {sentences.map((sentence, idx) => {
          const isLearned = sentence.status === "learned";
          return (
            <div
              key={sentence.id}
              className={`
                animate-fade-up stagger-${Math.min(idx + 1, 8)}
                rounded-2xl bg-card border border-border shadow-card p-4
                transition-all duration-300
                ${isLearned ? "opacity-60 ring-2 ring-success/30 bg-success/5" : ""}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    #{sentence.word}
                  </span>
                  <p className="text-sm font-semibold text-foreground leading-relaxed">{sentence.en}</p>
                  <button
                    onClick={() => toggleTranslation(sentence.id)}
                    className="mt-1 text-xs text-muted-foreground hover:text-foreground underline decoration-dashed underline-offset-2 transition-colors"
                  >
                    {showTranslations[sentence.id] ? "Ocultar" : "Ver tradução"}
                  </button>
                  {showTranslations[sentence.id] && (
                    <p className="mt-1 text-xs text-muted-foreground animate-fade-in italic">{sentence.pt}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleSpeak(sentence.en)}
                    className="w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-95"
                    title="Ouvir"
                  >
                    <Volume2 size={14} />
                  </button>
                  {!isLearned && (
                    <button
                      onClick={() => onLearn(sentence.id)}
                      className="w-8 h-8 rounded-xl bg-success/10 hover:bg-success text-success hover:text-success-foreground flex items-center justify-center transition-all active:scale-95"
                      title="Marcar como aprendida"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(sentence.id)}
                    className="w-8 h-8 rounded-xl bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground flex items-center justify-center transition-all active:scale-95"
                    title="Remover da revisão"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
