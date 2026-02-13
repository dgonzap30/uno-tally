import { useState, useEffect, useRef } from 'react'
import type { Player } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { computeStats, formatRelativeTime } from '../utils/playerStats'
import DrinkTracker from './DrinkTracker'
import ScoreEntry from './ScoreEntry'
import RoundWinButton from './RoundWinButton'

interface PlayerCardProps {
  player: Player
  allPlayers: Player[]
  color: string
  index: number
  rank: number
  totalPlayers: number
  hasSubmitted: boolean
  dispatch: React.Dispatch<GameAction>
}

function getDangerClasses(dangerLevel: string): string {
  switch (dangerLevel) {
    case 'hot':
      return 'ring-1 ring-neon-amber/15'
    case 'critical':
      return 'ring-2 ring-neon-red/25 animate-glow-pulse'
    default:
      return ''
  }
}

function getDangerBackground(dangerLevel: string): string {
  switch (dangerLevel) {
    case 'critical':
      return 'linear-gradient(135deg, rgba(255,45,85,0.06) 0%, rgba(20,20,32,0.65) 50%)'
    case 'hot':
      return 'linear-gradient(135deg, rgba(255,184,0,0.04) 0%, rgba(20,20,32,0.65) 50%)'
    case 'safe':
      return 'linear-gradient(135deg, rgba(57,255,20,0.03) 0%, rgba(20,20,32,0.65) 50%)'
    default:
      return 'rgba(20,20,32,0.65)'
  }
}

export default function PlayerCard({
  player, allPlayers, color, index, rank, totalPlayers, hasSubmitted, dispatch,
}: PlayerCardProps) {
  const [scoreExpanded, setScoreExpanded] = useState(false)
  const prevPoints = useRef(player.totalPoints)
  const [animating, setAnimating] = useState(false)
  const [flashing, setFlashing] = useState(false)

  const stats = computeStats(player)
  const shotsAvailable = stats.shotsOwed
  const sipsAvailable = stats.sipsOwed

  useEffect(() => {
    if (player.totalPoints !== prevPoints.current) {
      setAnimating(true)
      setFlashing(true)
      const t1 = setTimeout(() => setAnimating(false), 500)
      const t2 = setTimeout(() => setFlashing(false), 600)
      prevPoints.current = player.totalPoints
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [player.totalPoints])

  const scoreSize = player.totalPoints >= 1000
    ? 'text-3xl sm:text-4xl'
    : player.totalPoints >= 100
      ? 'text-4xl sm:text-5xl'
      : 'text-5xl sm:text-6xl'

  return (
    <div
      className={`relative glass-card rounded-xl p-3 sm:p-4 space-y-2.5 animate-card-enter overflow-hidden ${getDangerClasses(stats.dangerLevel)} ${hasSubmitted ? 'opacity-60' : ''}`}
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: color,
        background: getDangerBackground(stats.dangerLevel),
        boxShadow: `0 0 20px ${color}10`,
        animationDelay: `${index * 100}ms`,
        '--glow-color': stats.dangerLevel === 'critical' ? '#ff2d5530' : undefined,
      } as React.CSSProperties}
    >
      {/* Color flash on score change */}
      {flashing && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
            animation: 'card-flash 0.6s ease-out forwards',
          }}
        />
      )}

      {/* Top gradient */}
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none opacity-[0.10]"
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }}
      />

      {/* Name + Rank + Win button row */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black"
            style={{
              background: rank === 1 ? 'var(--color-neon-green)' :
                          rank === totalPlayers && totalPlayers > 1 ? 'var(--color-neon-red)' :
                          'rgba(255,255,255,0.08)',
              color: rank === 1 || (rank === totalPlayers && totalPlayers > 1) ? '#0a0a0f' : 'var(--color-text-muted)',
              boxShadow: rank === 1 ? '0 0 10px #39ff1440' :
                         rank === totalPlayers && totalPlayers > 1 ? '0 0 10px #ff2d5540' :
                         'none',
              fontFamily: 'var(--font-score)',
            }}
          >
            {rank}
          </span>
          <h3
            className="font-bold text-sm tracking-wide truncate min-w-0"
            style={{ fontFamily: 'var(--font-display)', color }}
          >
            {player.name}
          </h3>
        </div>
        {!hasSubmitted && (
          <RoundWinButton winnerId={player.id} allPlayers={allPlayers} dispatch={dispatch} />
        )}
        {hasSubmitted && (
          <span className="text-[10px] text-text-muted bg-bg-input/60 px-2 py-0.5 rounded-full shrink-0">
            Waiting...
          </span>
        )}
      </div>

      {/* Score */}
      <div className="relative flex items-baseline gap-2">
        <span
          className={`score-display ${scoreSize} ${animating ? 'animate-score-pop' : ''}`}
          style={{ textShadow: `0 0 25px ${color}40, 0 0 50px ${color}15` }}
        >
          {player.totalPoints}
        </span>
        <span className="text-sm font-medium text-text-muted">pts</span>
      </div>

      <DrinkTracker
        totalPoints={player.totalPoints}
        shotsTaken={player.shotsTaken}
        sipsTaken={player.sipsTaken}
      />

      {/* Action row: + Points / Sip / Shot */}
      {!hasSubmitted && (
        <>
          {scoreExpanded ? (
            <ScoreEntry
              onSubmit={(points) => dispatch({ type: 'ADD_SCORE', playerId: player.id, points })}
              onClose={() => setScoreExpanded(false)}
            />
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setScoreExpanded(true)}
                className="flex-1 h-10 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-sm font-bold transition-all active:scale-95 hover:bg-neon-blue/15"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                + Points
              </button>
              <button
                onClick={() => dispatch({ type: 'TAKE_SIP', playerId: player.id })}
                disabled={sipsAvailable <= 0}
                className={`h-10 px-3 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  sipsAvailable > 0
                    ? 'bg-neon-amber/12 text-neon-amber border border-neon-amber/20'
                    : 'bg-bg-input/40 text-text-muted border border-white/[0.04]'
                }`}
              >
                Sip
              </button>
              <button
                onClick={() => dispatch({ type: 'TAKE_SHOT', playerId: player.id })}
                disabled={shotsAvailable <= 0}
                className={`h-10 px-3 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  shotsAvailable > 0
                    ? 'bg-neon-red/12 text-neon-red border border-neon-red/20'
                    : 'bg-bg-input/40 text-text-muted border border-white/[0.04]'
                }`}
              >
                Shot
              </button>
            </div>
          )}
        </>
      )}

      {/* Sip/Shot still available when submitted (drinking is independent) */}
      {hasSubmitted && (shotsAvailable > 0 || sipsAvailable > 0) && (
        <div className="flex gap-2">
          {sipsAvailable > 0 && (
            <button
              onClick={() => dispatch({ type: 'TAKE_SIP', playerId: player.id })}
              className="flex-1 h-9 rounded-xl bg-neon-amber/12 text-neon-amber border border-neon-amber/20 text-xs font-bold transition-all active:scale-95"
            >
              Sip (-10)
            </button>
          )}
          {shotsAvailable > 0 && (
            <button
              onClick={() => dispatch({ type: 'TAKE_SHOT', playerId: player.id })}
              className="flex-1 h-9 rounded-xl bg-neon-red/12 text-neon-red border border-neon-red/20 text-xs font-bold transition-all active:scale-95"
            >
              Shot (-100)
            </button>
          )}
        </div>
      )}

      {/* Last action */}
      {stats.lastAction && (
        <div className="text-[11px] text-text-muted flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-text-muted/40" />
          <span>{stats.lastAction}</span>
          {stats.lastActionTime && (
            <span className="text-text-muted/50">{formatRelativeTime(stats.lastActionTime)}</span>
          )}
        </div>
      )}
    </div>
  )
}
