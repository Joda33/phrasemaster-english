import { useState, useRef, KeyboardEvent } from "react";
import { Sparkles, X, Plus } from "lucide-react";
import { ALL_AVAILABLE_WORDS } from "@/lib/sentenceData";

interface WordInputProps {
  onGenerate: (words: string[]) => void;
  isLoading: boolean;
}

export function WordInput({ onGenerate, isLoading }: WordInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = ALL_AVAILABLE_WORDS.filter(
    (w) => !words.includes(w)
  ).slice(0, 8);

  function addWord(word: string) {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed || words.includes(trimmed) || words.length >= 5) return;
    setWords((prev) => [...prev, trimmed]);
    setInputValue("");
    inputRef.current?.focus();
  }

  function removeWord(word: string) {
    setWords((prev) => prev.filter((w) => w !== word));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addWord(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && words.length > 0) {
      removeWord(words[words.length - 1]);
    }
  }

  function handleGenerate() {
    // Garante que não haverá duplicatas usando um Set
    const uniqueWords = new Set([...words]);
    
    // Trata e limpa o texto que ainda estiver solto no input
    const rawInput = inputValue.trim().toLowerCase();
    if (rawInput) {
      uniqueWords.add(rawInput);
    }

    const finalWords = Array.from(uniqueWords);
    if (finalWords.length === 0) return;

    // Dispara a função principal com os dados higienizados
    onGenerate(finalWords);
    
    // Reseta o input e limpa o array local de tags na tela para o próximo ciclo
    setInputValue("");
    setWords([]);
  }

  return (
    <div className="animate-fade-up space-y-4">
      {/* Word tag input */}
      <div className="relative">
        <div
          className="flex flex-wrap gap-2 items-center p-3 rounded-2xl border-2 border-input bg-card
            focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200 min-h-[52px] cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {words.map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              {word}
              <button
                onClick={(e) => { e.stopPropagation(); removeWord(word); }}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={words.length === 0 ? "Digite uma palavra em inglês (ex: get, take)..." : "Adicionar mais..."}
            className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {words.length > 0 && (
          <p className="absolute -bottom-5 left-1 text-xs text-muted-foreground">
            {words.length}/5 palavras · pressione Enter para adicionar
          </p>
        )}
      </div>

      {/* Suggestions */}
      <div className="pt-1">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Sugestões populares:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((word) => (
            <button
              key={word}
              onClick={() => addWord(word)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-muted/60 text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-150 active:scale-95"
            >
              <Plus size={11} />
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button - Estrutura estável sem remover o nó do DOM */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || (words.length === 0 && !inputValue.trim())}
        className={`
          w-full flex items-center justify-center gap-2 py-4 rounded-2xl
          text-base font-bold text-primary-foreground bg-primary
          hover:bg-primary-hover active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-score transition-all duration-200
          ${isLoading ? "cursor-wait" : ""}
        `}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            <span>Gerando frases...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Gerar frases</span>
          </>
        )}
      </button>
    </div>
  );
}