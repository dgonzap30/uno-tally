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
  manyPlayers?: boolean
}

function getDangerBg(dangerLevel: string, color: string): string {
  switch (dangerLevel) {
    case 'critical':
      return `linear-gradient(160deg, rgba(237,28,36,0.10) 0%, rgba(28,28,36,0.85) 40%, rgba(24,24,32,0.90) 100%)`
    case 'hot':
      return `linear-gradient(160deg, rgba(255,222,0,0.07) 0%, rgba(28,28,36,0.85) 40%, rgba(24,24,32,0.90) 100%)`
    case 'safe':
      return `linear-gradient(160deg, ${color}08 0%, rgba(28,28,36,0.85) 40%, rgba(24,24,32,0.90) 100%)`
    default:
      return `linear-gradient(160deg, ${color}06 0%, rgba(28,28,36,0.85) 40%, rgba(24,24,32,0.90) 100%)`
  }
}

export default function PlayerCard({
  player, allPlayers, color, index, rank, totalPlayers, hasSubmitted, dispatch, manyPlayers,
}: PlayerCardProps) {
  const [scoreExpanded, setScoreExpanded] = useState(false)
  const prevPoints = useRef(player.totalPoints)
  const [animating, setAnimating] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [drinkBurst, setDrinkBurst] = useState<string | null>(null)
  const prevDrinks = useRef(player.shotsTaken + player.sipsTaken)

  const stats = computeStats(player)
  const shotsAvailable = stats.shotsOwed
  const sipsAvailable = stats.sipsOwed

  useEffect(() => {
    if (player.totalPoints !== prevPoints.current) {
      setAnimating(true)
      setFlashing(true)
      const t1 = setTimeout(() => setAnimating(false), 700)
      const t2 = setTimeout(() => setFlashing(false), 700)
      prevPoints.current = player.totalPoints
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [player.totalPoints])

  useEffect(() => {
    const currentDrinks = player.shotsTaken + player.sipsTaken
    if (currentDrinks > prevDrinks.current) {
      const wasShot = player.shotsTaken > prevDrinks.current - player.sipsTaken
      setDrinkBurst(wasShot ? '#ED1C24' : '#FFDE00')
      const t = setTimeout(() => setDrinkBurst(null), 900)
      prevDrinks.current = currentDrinks
      return () => clearTimeout(t)
    }
  }, [player.shotsTaken, player.sipsTaken])

  const scoreSize = player.totalPoints >= 1000
    ? 'text-4xl sm:text-5xl'
    : player.totalPoints >= 100
      ? 'text-5xl sm:text-7xl'
      : 'text-6xl sm:text-8xl'

  const dangerRing = stats.dangerLevel === 'critical'
    ? 'ring-2 ring-[#ED1C24]/30 animate-danger-pulse'
    : stats.dangerLevel === 'hot'
      ? 'ring-1 ring-[#FFDE00]/20'
      : ''

  return (
    <div
      className={`relative rounded-2xl flex flex-col animate-card-enter overflow-hidden
        ${dangerRing}
        ${hasSubmitted ? 'submitted-card' : ''}`}
      style={{
        background: getDangerBg(stats.dangerLevel, color),
        boxShadow: `0 6px 24px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)`,
        animationDelay: `${index * 120}ms`,
        minHeight: manyPlayers ? '300px' : undefined,
        border: `2px solid rgba(255,255,255,0.06)`,
        borderTop: `4px solid ${color}`,
      } as React.CSSProperties}
    >
      {/* === Color flash on score change === */}
      {flashing && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          style={{
            background: `radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            animation: 'card-flash 0.7s ease-out forwards',
          }}
        />
      )}

      {/* === Drink celebration burst === */}
      {drinkBurst && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div
            className="w-20 h-20 rounded-full animate-celebrate-burst"
            style={{ background: `radial-gradient(circle, ${drinkBurst}40 0%, transparent 70%)` }}
          />
        </div>
      )}

      {/* === Colored top banner === */}
      <div
        className="card-banner shrink-0 px-4 sm:px-5 py-3 flex items-center justify-between gap-2"
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
          borderBottom: `2px solid ${color}25`,
        }}
      >
        <div className="relative flex items-center gap-3 min-w-0">
          {/* Rank badge */}
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{
              background: rank === 1 ? '#00A651' :
                          rank === totalPlayers && totalPlayers > 1 ? '#ED1C24' :
                          `${color}25`,
              color: rank === 1 || (rank === totalPlayers && totalPlayers > 1) ? '#ffffff' : color,
              boxShadow: rank === 1 ? '0 2px 8px rgba(0,166,81,0.4)' :
                         rank === totalPlayers && totalPlayers > 1 ? '0 2px 8px rgba(237,28,36,0.4)' :
                         `0 2px 6px ${color}20`,
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
            }}
          >
            {rank}
          </div>
          <h3
            className="text-lg tracking-wide truncate min-w-0"
            style={{ fontFamily: 'var(--font-display)', color }}
          >
            {player.name}
          </h3>
        </div>
        {!hasSubmitted && (
          <RoundWinButton winnerId={player.id} allPlayers={allPlayers} dispatch={dispatch} />
        )}
        {hasSubmitted && (
          <div className="flex items-center gap-2 shrink-0 animate-check-appear">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,166,81,0.15)', boxShadow: '0 0 12px rgba(0,166,81,0.20)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#00A651" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#00A651' }}>Done</span>
          </div>
        )}
      </div>

      {/* === Score zone — the hero === */}
      <div className="flex-1 flex flex-col items-start justify-center px-5 sm:px-6 py-4 sm:py-6 min-h-0">
        <div className="flex items-baseline gap-2.5">
          <span
            className={`score-display ${scoreSize} ${animating ? 'animate-score-slam' : ''}`}
            style={{
              color: 'var(--color-text-primary)',
              textShadow: `0 2px 8px rgba(0,0,0,0.4)`,
            }}
          >
            {player.totalPoints}
          </span>
          <span
            className="text-lg font-bold uppercase tracking-widest"
            style={{ color: `${color}50`, fontFamily: 'var(--font-score)' }}
          >
            pts
          </span>
        </div>

        {/* Inline drink debt indicator */}
        {stats.shotsOwed + stats.sipsOwed > 0 && (
          <div className="flex items-center gap-3 mt-3">
            {stats.shotsOwed > 0 && (
              <span className="text-sm font-bold px-2.5 py-0.5 rounded-md"
                style={{ color: '#ED1C24', background: 'rgba(237,28,36,0.12)', border: '1px solid rgba(237,28,36,0.20)' }}>
                {stats.shotsOwed} shot{stats.shotsOwed > 1 ? 's' : ''} owed
              </span>
            )}
            {stats.sipsOwed > 0 && (
              <span className="text-sm font-bold px-2.5 py-0.5 rounded-md"
                style={{ color: '#FFDE00', background: 'rgba(255,222,0,0.12)', border: '1px solid rgba(255,222,0,0.20)' }}>
                {stats.sipsOwed} sip{stats.sipsOwed > 1 ? 's' : ''} owed
              </span>
            )}
          </div>
        )}
      </div>

      {/* === Bottom section: tracker + actions === */}
      <div className="shrink-0 px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
        <DrinkTracker
          totalPoints={player.totalPoints}
          shotsTaken={player.shotsTaken}
          sipsTaken={player.sipsTaken}
        />

        {/* Action row */}
        {!hasSubmitted && (
          <>
            {scoreExpanded ? (
              <ScoreEntry
                onSubmit={(points) => dispatch({ type: 'ADD_SCORE', playerId: player.id, points })}
                onClose={() => setScoreExpanded(false)}
              />
            ) : (
              <div className="flex gap-2.5">
                <button
                  onClick={() => setScoreExpanded(true)}
                  className="flex-1 h-13 rounded-xl text-base font-black transition-all active:scale-93"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: `linear-gradient(180deg, rgba(9,86,191,0.18) 0%, rgba(9,86,191,0.08) 100%)`,
                    border: '2px solid rgba(9,86,191,0.30)',
                    color: '#4d94ff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  + POINTS
                </button>
                <button
                  onClick={() => dispatch({ type: 'TAKE_SIP', playerId: player.id })}
                  disabled={sipsAvailable <= 0}
                  className={`drink-btn h-13 px-5 rounded-xl text-sm font-black uppercase tracking-wide ${
                    sipsAvailable <= 0 ? 'text-text-muted/40 cursor-default' : ''
                  }`}
                  style={sipsAvailable > 0 ? {
                    color: '#FFDE00',
                    background: 'linear-gradient(180deg, rgba(255,222,0,0.18) 0%, rgba(255,222,0,0.08) 100%)',
                    border: '2px solid rgba(255,222,0,0.30)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  } : {
                    background: 'rgba(28,28,36,0.5)',
                    border: '2px solid rgba(255,255,255,0.04)',
                  }}
                >
                  Sip
                </button>
                <button
                  onClick={() => dispatch({ type: 'TAKE_SHOT', playerId: player.id })}
                  disabled={shotsAvailable <= 0}
                  className={`drink-btn h-13 px-5 rounded-xl text-sm font-black uppercase tracking-wide ${
                    shotsAvailable <= 0 ? 'text-text-muted/40 cursor-default' : ''
                  }`}
                  style={shotsAvailable > 0 ? {
                    color: '#ED1C24',
                    background: 'linear-gradient(180deg, rgba(237,28,36,0.18) 0%, rgba(237,28,36,0.08) 100%)',
                    border: '2px solid rgba(237,28,36,0.30)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  } : {
                    background: 'rgba(28,28,36,0.5)',
                    border: '2px solid rgba(255,255,255,0.04)',
                  }}
                >
                  Shot
                </button>
              </div>
            )}
          </>
        )}

        {/* Drink buttons when submitted */}
        {hasSubmitted && (shotsAvailable > 0 || sipsAvailable > 0) && (
          <div className="flex gap-2.5">
            {sipsAvailable > 0 && (
              <button
                onClick={() => dispatch({ type: 'TAKE_SIP', playerId: player.id })}
                className="drink-btn flex-1 h-12 rounded-xl text-sm font-black uppercase tracking-wide"
                style={{
                  color: '#FFDE00',
                  background: 'linear-gradient(180deg, rgba(255,222,0,0.18) 0%, rgba(255,222,0,0.08) 100%)',
                  border: '2px solid rgba(255,222,0,0.30)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                Sip (-10)
              </button>
            )}
            {shotsAvailable > 0 && (
              <button
                onClick={() => dispatch({ type: 'TAKE_SHOT', playerId: player.id })}
                className="drink-btn flex-1 h-12 rounded-xl text-sm font-black uppercase tracking-wide"
                style={{
                  color: '#ED1C24',
                  background: 'linear-gradient(180deg, rgba(237,28,36,0.18) 0%, rgba(237,28,36,0.08) 100%)',
                  border: '2px solid rgba(237,28,36,0.30)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                Shot (-100)
              </button>
            )}
          </div>
        )}

        {/* Last action */}
        {stats.lastAction && (
          <div className="text-[11px] text-text-muted/60 flex items-center gap-1.5 pt-1">
            <span className="inline-block w-1 h-1 rounded-full" style={{ background: `${color}40` }} />
            <span>{stats.lastAction}</span>
            {stats.lastActionTime && (
              <span className="opacity-50">{formatRelativeTime(stats.lastActionTime)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
