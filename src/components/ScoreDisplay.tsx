import { Zap } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  pop: boolean;
}

export function ScoreDisplay({ score, pop }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-primary text-primary-foreground shadow-score
          transition-transform duration-200
          ${pop ? "animate-score-pop" : ""}
        `}
      >
        <Zap size={15} className="fill-current" />
        <span className="text-sm font-bold tabular-nums">{score.toLocaleString("pt-BR")} pts</span>
      </div>
    </div>
  );
}
