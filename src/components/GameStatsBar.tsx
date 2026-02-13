import type { Player } from '../types/game'

interface GameStatsBarProps {
  players: Player[]
  currentRound: number
  submittedCount: number
}

export default function GameStatsBar({ players, currentRound, submittedCount }: GameStatsBarProps) {
  const sorted = [...players].sort((a, b) => a.totalPoints - b.totalPoints)
  const totalShots = players.reduce((s, p) => s + p.shotsTaken, 0)
  const totalSips = players.reduce((s, p) => s + p.sipsTaken, 0)

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-bg-surface/60 border border-white/[0.04] text-xs text-text-secondary overflow-x-auto scrollbar-none max-w-4xl mx-auto">
      {/* Round + submission progress */}
      <span className="shrink-0 font-bold text-text-primary">
        R{currentRound}
      </span>
      {submittedCount > 0 && submittedCount < players.length && (
        <span className="shrink-0 text-neon-blue">
          {submittedCount}/{players.length}
        </span>
      )}

      <div className="w-px h-4 bg-white/[0.08] shrink-0" />

      {/* Leaderboard */}
      <div className="flex items-center gap-2.5 shrink-0">
        {sorted.map((p, i) => (
          <span
            key={p.id}
            className={`flex items-center gap-1 shrink-0 ${
              i === 0 ? 'text-neon-green' :
              i === sorted.length - 1 && sorted.length > 1 ? 'text-neon-red' :
              'text-text-muted'
            }`}
          >
            <span className="font-semibold truncate max-w-[60px]">{p.name}</span>
            <span className="tabular-nums font-mono">{p.totalPoints}</span>
          </span>
        ))}
      </div>

      {(totalShots > 0 || totalSips > 0) && (
        <>
          <div className="w-px h-4 bg-white/[0.08] shrink-0" />
          <span className="shrink-0 text-text-muted">
            {[
              totalShots > 0 && `${totalShots} shot${totalShots !== 1 ? 's' : ''}`,
              totalSips > 0 && `${totalSips} sip${totalSips !== 1 ? 's' : ''}`,
            ].filter(Boolean).join(' + ')}{' '}
            taken
          </span>
        </>
      )}
    </div>
  )
}
