import type { Player } from '../types/game'

interface GameStatsBarProps {
  players: Player[]
  currentRound: number
  onAddPlayer: () => void
}

export default function GameStatsBar({ players, currentRound, onAddPlayer }: GameStatsBarProps) {
  const sorted = [...players].sort((a, b) => a.totalPoints - b.totalPoints)
  const totalShots = players.reduce((s, p) => s + p.shotsTaken, 0)
  const totalSips = players.reduce((s, p) => s + p.sipsTaken, 0)

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      {/* Round badge */}
      <span
        className="shrink-0 text-sm font-black px-2.5 py-1 rounded-lg"
        style={{
          fontFamily: 'var(--font-display)',
          color: '#4d94ff',
          background: 'rgba(9,86,191,0.12)',
          border: '1px solid rgba(9,86,191,0.25)',
        }}
      >
        R{currentRound}
      </span>

      {/* Leaderboard chips */}
      {sorted.map((p, i) => {
        const isLeader = i === 0
        const isLast = i === sorted.length - 1 && sorted.length > 1
        const accent = isLeader ? '#00A651' : isLast ? '#ED1C24' : 'var(--color-text-secondary)'

        return (
          <div
            key={p.id}
            className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg"
            style={{
              background: isLeader ? 'rgba(0,166,81,0.08)' :
                           isLast ? 'rgba(237,28,36,0.08)' :
                           'rgba(255,255,255,0.03)',
            }}
          >
            <span className="font-bold text-xs truncate max-w-[64px]" style={{ color: accent }}>
              {p.name}
            </span>
            <span className="tabular-nums text-xs font-black" style={{ fontFamily: 'var(--font-score)', color: accent }}>
              {p.totalPoints}
            </span>
          </div>
        )
      })}

      {/* Drink totals (compact) */}
      {(totalShots > 0 || totalSips > 0) && (
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {totalShots > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: '#ED1C24', background: 'rgba(237,28,36,0.10)' }}>
              {totalShots}🥃
            </span>
          )}
          {totalSips > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: '#FFDE00', background: 'rgba(255,222,0,0.10)' }}>
              {totalSips}🍺
            </span>
          )}
        </div>
      )}

      {/* Add player button */}
      <button
        onClick={onAddPlayer}
        className="shrink-0 ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary transition-all active:scale-90"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        title="Add player"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
