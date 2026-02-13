import { useState, useEffect, useRef } from 'react'
import type { Player } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import DrinkTracker from './DrinkTracker'
import ScoreEntry from './ScoreEntry'
import RoundWinButton from './RoundWinButton'

interface PlayerCardProps {
  player: Player
  allPlayers: Player[]
  color: string
  index: number
  dispatch: React.Dispatch<GameAction>
}

export default function PlayerCard({ player, allPlayers, color, index, dispatch }: PlayerCardProps) {
  const [showHistory, setShowHistory] = useState(false)
  const prevPoints = useRef(player.totalPoints)
  const [animating, setAnimating] = useState(false)
  const [flashing, setFlashing] = useState(false)

  const shotsAvailable = Math.floor(player.totalPoints / 100)
  const sipsAvailable = Math.floor((player.totalPoints % 100) / 10)

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

  const handleAddScore = (points: number) => {
    dispatch({ type: 'ADD_SCORE', playerId: player.id, points })
  }

  return (
    <div
      className="relative glass-card rounded-2xl p-5 space-y-4 animate-card-enter overflow-hidden"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: color,
        boxShadow: `0 0 20px ${color}12, 0 0 40px ${color}06`,
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Color flash on score change */}
      {flashing && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
            animation: 'card-flash 0.6s ease-out forwards',
          }}
        />
      )}

      {/* Top gradient */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none opacity-[0.12]"
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }}
      />

      {/* UNO watermark */}
      <div
        className="absolute top-3 right-3 text-sm font-bold opacity-[0.1] select-none"
        style={{ fontFamily: "var(--font-display)", color, transform: 'rotate(-5deg)' }}
      >
        UNO
      </div>

      {/* Name + Score */}
      <div className="relative">
        <h3
          className="font-bold text-base tracking-wide mb-1"
          style={{ fontFamily: "var(--font-display)", color }}
        >
          {player.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span
            className={`score-display text-5xl md:text-6xl ${animating ? 'animate-score-pop' : ''}`}
            style={{ textShadow: `0 0 25px ${color}40, 0 0 50px ${color}15` }}
          >
            {player.totalPoints}
          </span>
          <span className="text-sm font-medium text-text-muted">pts</span>
        </div>
      </div>

      <DrinkTracker
        totalPoints={player.totalPoints}
        shotsTaken={player.shotsTaken}
        sipsTaken={player.sipsTaken}
      />

      {/* Sip / Shot buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'TAKE_SIP', playerId: player.id })}
          disabled={sipsAvailable <= 0}
          className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            sipsAvailable > 0
              ? 'bg-neon-amber/12 text-neon-amber border border-neon-amber/20 animate-glow-pulse'
              : 'bg-bg-input/40 text-text-muted border border-white/[0.04]'
          }`}
          style={sipsAvailable > 0 ? { '--glow-color': '#ffb80030' } as React.CSSProperties : undefined}
        >
          Sip {sipsAvailable > 0 && <span className="opacity-60">(-10)</span>}
        </button>
        <button
          onClick={() => dispatch({ type: 'TAKE_SHOT', playerId: player.id })}
          disabled={shotsAvailable <= 0}
          className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            shotsAvailable > 0
              ? 'bg-neon-red/12 text-neon-red border border-neon-red/20 animate-glow-pulse'
              : 'bg-bg-input/40 text-text-muted border border-white/[0.04]'
          }`}
          style={shotsAvailable > 0 ? { '--glow-color': '#ff2d5530' } as React.CSSProperties : undefined}
        >
          Shot {shotsAvailable > 0 && <span className="opacity-60">(-100)</span>}
        </button>
      </div>

      {/* Divider */}
      <div
        className="h-px"
        style={{ background: `linear-gradient(to right, transparent, ${color}25, transparent)` }}
      />

      <ScoreEntry onSubmit={handleAddScore} />

      <RoundWinButton winnerId={player.id} allPlayers={allPlayers} dispatch={dispatch} />

      {/* Round history */}
      {player.roundHistory.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1"
          >
            <span className={`transition-transform inline-block ${showHistory ? 'rotate-90' : ''}`}>&#9656;</span>
            Round history
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1">
              {player.roundHistory.map((entry, i) => (
                <div key={i} className="text-xs text-text-secondary flex justify-between">
                  <span className="text-text-muted">R{entry.round}</span>
                  <span className={
                    entry.source === 'win-bonus' ? 'text-neon-amber' :
                    entry.source === 'drink-shot' ? 'text-neon-red' :
                    entry.source === 'drink-sip' ? 'text-neon-amber' : 'text-text-secondary'
                  }>
                    {entry.pointsAdded > 0 ? '+' : ''}{entry.pointsAdded}
                    {entry.source === 'win-bonus' ? ' bonus' :
                     entry.source === 'drink-shot' ? ' shot' :
                     entry.source === 'drink-sip' ? ' sip' : ' pts'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
