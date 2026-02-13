import type { Player } from '../types/game'
import { getPlayerColor } from '../state/gameReducer'
import { computeStats } from '../utils/playerStats'

interface DrinkStatsPanelProps {
  players: Player[]
  open: boolean
  onToggle: () => void
}

function dangerDot(level: string) {
  switch (level) {
    case 'critical':
      return 'bg-neon-red animate-dot-pulse'
    case 'hot':
      return 'bg-neon-amber'
    case 'mild':
      return 'bg-neon-blue/60'
    default:
      return 'bg-neon-green/50'
  }
}

function formatOwed(shots: number, sips: number): string {
  if (shots === 0 && sips === 0) return 'None'
  return [
    shots > 0 && `${shots} shot${shots > 1 ? 's' : ''}`,
    sips > 0 && `${sips} sip${sips > 1 ? 's' : ''}`,
  ].filter(Boolean).join(', ')
}

function formatCleared(shotsTaken: number, sipsTaken: number): string {
  if (shotsTaken === 0 && sipsTaken === 0) return 'None'
  return [
    shotsTaken > 0 && `${shotsTaken} shot${shotsTaken > 1 ? 's' : ''}`,
    sipsTaken > 0 && `${sipsTaken} sip${sipsTaken > 1 ? 's' : ''}`,
  ].filter(Boolean).join(', ')
}

export default function DrinkStatsPanel({ players, open, onToggle }: DrinkStatsPanelProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary bg-bg-surface/40 hover:bg-bg-surface/70 border border-white/[0.04] transition-colors"
      >
        <span>{open ? '▾' : '▸'}</span>
        <span>Drink Tally</span>
      </button>

      {open && (
        <div className="mt-2 glass-card rounded-xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-white/[0.06] text-xs font-bold text-text-muted uppercase tracking-wider">
            <span>Player</span>
            <span className="w-28 text-center">Owed</span>
            <span className="w-28 text-center">Cleared</span>
          </div>

          {/* Rows */}
          {players.map((player, i) => {
            const stats = computeStats(player)
            const color = getPlayerColor(i)
            const owed = formatOwed(stats.shotsOwed, stats.sipsOwed)
            const cleared = formatCleared(player.shotsTaken, player.sipsTaken)

            return (
              <div
                key={player.id}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                {/* Name + danger dot */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 w-2 h-2 rounded-full ${dangerDot(stats.dangerLevel)}`} />
                  <span
                    className="font-semibold text-sm truncate"
                    style={{ color }}
                  >
                    {player.name}
                  </span>
                </div>

                {/* Owed */}
                <span className={`w-28 text-center text-sm ${owed === 'None' ? 'text-text-muted' : 'text-neon-amber font-medium'}`}>
                  {owed}
                </span>

                {/* Cleared */}
                <span className={`w-28 text-center text-sm ${cleared === 'None' ? 'text-text-muted' : 'text-neon-green/80'}`}>
                  {cleared}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
