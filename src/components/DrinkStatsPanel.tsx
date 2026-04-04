import type { Player } from '../types/game'
import { getPlayerColor } from '../state/gameReducer'
import { computeStats } from '../utils/playerStats'

interface DrinkStatsPanelProps {
  players: Player[]
  open?: boolean
  onToggle?: () => void
  variant?: 'inline' | 'sidebar'
}

function dangerDot(level: string) {
  switch (level) {
    case 'critical':
      return 'bg-[#ED1C24] shadow-[0_0_6px_rgba(237,28,36,0.5)] animate-dot-pulse'
    case 'hot':
      return 'bg-[#FFDE00] shadow-[0_0_6px_rgba(255,222,0,0.4)]'
    case 'mild':
      return 'bg-[#0956BF]/50'
    default:
      return 'bg-[#00A651]/40'
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

export default function DrinkStatsPanel({ players, open, onToggle, variant = 'inline' }: DrinkStatsPanelProps) {
  const totalTaken = players.reduce((s, p) => s + p.shotsTaken + p.sipsTaken, 0)

  const table = (
    <>
      {/* Header */}
      <div className={`grid ${variant === 'sidebar' ? 'grid-cols-[1fr_auto_auto] gap-2 px-4' : 'grid-cols-[1fr_auto_auto] gap-4 px-5'} py-3 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span>Player</span>
        <span className={`${variant === 'sidebar' ? 'w-16' : 'w-28'} text-center`}>Owed</span>
        <span className={`${variant === 'sidebar' ? 'w-16' : 'w-28'} text-center`}>Cleared</span>
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
            className={`grid ${variant === 'sidebar' ? 'grid-cols-[1fr_auto_auto] gap-2 px-4 py-3' : 'grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5'} items-center hover:bg-white/[0.02] transition-colors`}
            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${dangerDot(stats.dangerLevel)}`} />
              <span className="font-bold text-sm truncate" style={{ color }}>
                {player.name}
              </span>
            </div>
            <span className={`${variant === 'sidebar' ? 'w-16' : 'w-28'} text-center text-sm font-medium ${owed === 'None' ? 'text-text-muted/40' : ''}`}
              style={owed !== 'None' ? { color: '#FFDE00' } : undefined}>
              {owed}
            </span>
            <span className={`${variant === 'sidebar' ? 'w-16' : 'w-28'} text-center text-sm font-medium ${cleared === 'None' ? 'text-text-muted/40' : ''}`}
              style={cleared !== 'None' ? { color: '#00A651' } : undefined}>
              {cleared}
            </span>
          </div>
        )
      })}
    </>
  )

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 px-4 py-3.5 flex items-center gap-2.5" style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(180deg, rgba(28,28,36,0.95) 0%, rgba(24,24,32,0.90) 100%)',
        }}>
          <span className="text-sm font-black" style={{ fontFamily: 'var(--font-display)', color: '#FFDE00' }}>
            Drink Tally
          </span>
          {totalTaken > 0 && (
            <span className="text-xs text-text-muted font-normal bg-white/[0.04] px-2 py-0.5 rounded-md">
              {totalTaken} taken
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {table}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        style={{
          background: open ? 'rgba(28,28,36,0.7)' : 'rgba(28,28,36,0.4)',
          border: '2px solid rgba(255,255,255,0.06)',
          color: open ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        }}
      >
        <span className="text-xs" style={{ color: '#FFDE00' }}>{open ? '▾' : '▸'}</span>
        <span>Drink Tally</span>
        {totalTaken > 0 && (
          <span className="text-xs text-text-muted font-normal ml-1 bg-white/[0.04] px-2 py-0.5 rounded-md">
            {totalTaken} taken
          </span>
        )}
      </button>

      {open && (
        <div className="mt-2 rounded-xl overflow-hidden animate-slide-up" style={{
          background: 'rgba(28,28,36,0.7)',
          border: '2px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {table}
        </div>
      )}
    </div>
  )
}
