import { useState, useEffect, useRef, useCallback } from 'react'
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
  player, allPlayers, color, index, rank, totalPlayers, dispatch, manyPlayers,
}: PlayerCardProps) {
  const [scoreExpanded, setScoreExpanded] = useState(false)
  const prevPoints = useRef(player.totalPoints)
  const [animating, setAnimating] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [drinkBurst, setDrinkBurst] = useState<string | null>(null)
  const prevDrinks = useRef(player.shotsTaken + player.sipsTaken)

  const [confirmRemove, setConfirmRemove] = useState(false)

  // Editable name state
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState(player.name)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const blurReady = useRef(false)

  useEffect(() => {
    if (!isEditingName) setEditName(player.name)
  }, [player.name, isEditingName])

  useEffect(() => {
    if (isEditingName) {
      blurReady.current = false
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
      const t = setTimeout(() => { blurReady.current = true }, 200)
      return () => clearTimeout(t)
    }
  }, [isEditingName])

  const commitRename = useCallback(() => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== player.name) {
      dispatch({ type: 'RENAME_PLAYER', playerId: player.id, name: trimmed })
    }
    setIsEditingName(false)
  }, [editName, player.name, player.id, dispatch])

  const cancelRename = useCallback(() => {
    setEditName(player.name)
    setIsEditingName(false)
  }, [player.name])

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

  const scoreSize = manyPlayers
    ? (player.totalPoints >= 1000
        ? 'text-3xl sm:text-4xl'
        : player.totalPoints >= 100
          ? 'text-4xl sm:text-5xl'
          : 'text-5xl sm:text-6xl')
    : (player.totalPoints >= 1000
        ? 'text-4xl sm:text-5xl'
        : player.totalPoints >= 100
          ? 'text-5xl sm:text-7xl'
          : 'text-6xl sm:text-8xl')

  const dangerRing = stats.dangerLevel === 'critical'
    ? 'ring-2 ring-[#ED1C24]/30 animate-danger-pulse'
    : stats.dangerLevel === 'hot'
      ? 'ring-1 ring-[#FFDE00]/20'
      : ''

  return (
    <div
      className={`relative rounded-2xl flex flex-col animate-card-enter overflow-hidden
        ${dangerRing}`}
      style={{
        background: getDangerBg(stats.dangerLevel, color),
        boxShadow: `0 6px 24px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)`,
        animationDelay: `${index * 120}ms`,
        border: `2px solid rgba(255,255,255,0.06)`,
        borderTop: `4px solid ${color}`,
        touchAction: 'pan-y',
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
        className={`card-banner shrink-0 ${manyPlayers ? 'px-2.5 sm:px-4 py-1.5 sm:py-2' : 'px-3 sm:px-5 py-2.5 sm:py-3'} flex items-center justify-between gap-2`}
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
          borderBottom: `2px solid ${color}25`,
        }}
      >
        <div className="relative flex items-center gap-3 min-w-0">
          {/* Rank badge */}
          <div
            className={`shrink-0 ${manyPlayers ? 'w-6 h-6 rounded-md text-[10px]' : 'w-8 h-8 rounded-lg text-xs'} flex items-center justify-center font-black`}
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
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') cancelRename()
              }}
              onBlur={() => { if (blurReady.current) commitRename() }}
              maxLength={20}
              className={`${manyPlayers ? 'text-base' : 'text-lg'} tracking-wide min-w-0 w-full bg-transparent outline-none border-b-2`}
              style={{
                fontFamily: 'var(--font-display)',
                color,
                borderColor: `${color}60`,
                caretColor: color,
              }}
            />
          ) : (
            <button
              type="button"
              className={`${manyPlayers ? 'text-base' : 'text-lg'} tracking-wide truncate min-w-0 text-left bg-transparent border-none p-0`}
              style={{ fontFamily: 'var(--font-display)', color }}
              onClick={() => setIsEditingName(true)}
            >
              {player.name}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RoundWinButton winnerId={player.id} allPlayers={allPlayers} dispatch={dispatch} />
          {confirmRemove ? (
            <div className="flex items-center gap-1 animate-slide-up">
              <button
                onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: player.id })}
                className="h-7 px-2.5 rounded-lg text-[10px] font-black transition-all active:scale-90"
                style={{ color: '#ED1C24', background: 'rgba(237,28,36,0.15)', border: '1px solid rgba(237,28,36,0.30)' }}
              >
                Remove
              </button>
              <button
                onClick={() => setConfirmRemove(false)}
                className="text-text-muted text-xs px-1 hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRemove(true)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-text-muted/40 hover:text-[#ED1C24] hover:bg-[#ED1C24]/10 transition-all"
              title="Remove player"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* === Score zone — the hero === */}
      <div className={`flex flex-col items-start ${manyPlayers ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-4 sm:px-6 py-3 sm:py-5'}`}>
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
          <div className="flex items-center gap-3 mt-2">
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
      <div className={`shrink-0 ${manyPlayers ? 'px-2.5 sm:px-4 pb-2.5 sm:pb-3 space-y-2' : 'px-3 sm:px-5 pb-3 sm:pb-4 space-y-2.5'}`}>
        <DrinkTracker
          totalPoints={player.totalPoints}
          shotsTaken={player.shotsTaken}
          sipsTaken={player.sipsTaken}
        />

        {/* Action row */}
        {scoreExpanded ? (
          <ScoreEntry
            onSubmit={(points) => dispatch({ type: 'ADD_SCORE', playerId: player.id, points })}
            onClose={() => setScoreExpanded(false)}
          />
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setScoreExpanded(true)}
              className={`flex-1 ${manyPlayers ? 'h-9 sm:h-10' : 'h-11 sm:h-12'} rounded-xl text-sm sm:text-base font-black transition-all active:scale-93`}
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
              className={`drink-btn ${manyPlayers ? 'h-9 sm:h-10 px-3 sm:px-4' : 'h-11 sm:h-12 px-4 sm:px-5'} rounded-xl text-sm font-black uppercase tracking-wide ${
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
              className={`drink-btn ${manyPlayers ? 'h-9 sm:h-10 px-3 sm:px-4' : 'h-11 sm:h-12 px-4 sm:px-5'} rounded-xl text-sm font-black uppercase tracking-wide ${
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
