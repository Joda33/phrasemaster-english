import { Crown, Medal, Trophy } from "lucide-react";

interface Player {
  name: string;
  avatar: string;
  score: number;
  country: string;
}

interface LeaderboardProps {
  userScore: number;
}

function generateMockPlayers(userScore: number): Player[] {
  const basePlayers: Omit<Player, "score">[] = [
    { name: "Beatriz Monteiro", avatar: "BM", country: "🇧🇷" },
    { name: "Carlos Ferreira", avatar: "CF", country: "🇧🇷" },
    { name: "Larissa Gomes",   avatar: "LG", country: "🇧🇷" },
    { name: "Rafael Costa",   avatar: "RC", country: "🇧🇷" },
    { name: "Jade Silva",     avatar: "JS", country: "🇧🇷" },
    { name: "Thiago Alves",   avatar: "TA", country: "🇧🇷" },
    { name: "Ana Lima",       avatar: "AL", country: "🇧🇷" },
    { name: "Pedro Ramos",    avatar: "PR", country: "🇧🇷" },
    { name: "Fernanda Dias",  avatar: "FD", country: "🇧🇷" },
  ];

  const scores = [340, 290, 250, 200, 170, 140, 110, 80, 50];

  return basePlayers.map((p, i) => ({ ...p, score: scores[i] }));
}

const RANK_COLORS = [
  "from-amber-400 to-yellow-500",  // 1st
  "from-slate-400 to-slate-500",   // 2nd
  "from-amber-600 to-amber-700",   // 3rd
];

const RANK_ICONS = [
  <Crown size={14} key="crown" />,
  <Trophy size={14} key="trophy" />,
  <Medal size={14} key="medal" />,
];

export function Leaderboard({ userScore }: LeaderboardProps) {
  const mockPlayers = generateMockPlayers(userScore);

  // Build combined list: insert the real user
  const allPlayers: (Player & { isUser?: boolean })[] = [
    ...mockPlayers,
    { name: "Você", avatar: "EU", country: "🇧🇷", score: userScore, isUser: true },
  ].sort((a, b) => b.score - a.score);

  // Limit to top 10
  const top10 = allPlayers.slice(0, 10);

  return (
    <div className="animate-fade-in space-y-3">
      <p className="text-xs text-muted-foreground">Ranking da semana · pontos acumulados</p>
      <div className="space-y-2">
        {top10.map((player, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;

          return (
            <div
              key={player.name}
              className={`
                animate-fade-up stagger-${Math.min(idx + 1, 8)}
                flex items-center gap-3 p-3 rounded-2xl border
                transition-all duration-200
                ${player.isUser
                  ? "bg-primary/8 border-primary/25 ring-2 ring-primary/20"
                  : "bg-card border-border hover:border-border/80"
                }
              `}
            >
              {/* Rank badge */}
              <div
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0
                  ${isTop3
                    ? `bg-gradient-to-br ${RANK_COLORS[rank - 1]} text-white shadow-sm`
                    : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isTop3 ? RANK_ICONS[rank - 1] : rank}
              </div>

              {/* Avatar */}
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${player.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                  }
                `}
              >
                {player.avatar}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${player.isUser ? "text-primary" : "text-foreground"}`}>
                  {player.country} {player.name}
                  {player.isUser && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(você)</span>}
                </p>
              </div>

              {/* Score */}
              <div className="shrink-0 text-right">
                <p className={`text-sm font-bold tabular-nums ${player.isUser ? "text-primary" : "text-foreground"}`}>
                  {player.score.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">pts</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
