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

  const shotsAvailable = Math.floor(player.totalPoints / 100)
  const sipsAvailable = Math.floor((player.totalPoints % 100) / 10)

  useEffect(() => {
    if (player.totalPoints !== prevPoints.current) {
      setAnimating(true)
      const t = setTimeout(() => setAnimating(false), 400)
      prevPoints.current = player.totalPoints
      return () => clearTimeout(t)
    }
  }, [player.totalPoints])

  const handleAddScore = (points: number) => {
    dispatch({ type: 'ADD_SCORE', playerId: player.id, points })
  }

  return (
    <div
      className="relative bg-bg-card rounded-2xl p-4 space-y-3 border border-white/[0.06] animate-card-enter overflow-hidden"
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: color,
        boxShadow: `0 0 15px ${color}15, 0 0 30px ${color}08, inset 0 1px 0 rgba(255,255,255,0.03)`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none opacity-[0.07]"
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }}
      />

      <div
        className="absolute top-2 right-3 text-[10px] font-bold opacity-[0.08] select-none"
        style={{ fontFamily: "var(--font-display)", color }}
      >
        UNO
      </div>

      <div className="relative">
        <h3
          className="font-bold text-lg tracking-wide"
          style={{ fontFamily: "var(--font-display)", color }}
        >
          {player.name}
        </h3>
        <div
          className={`text-3xl font-black tabular-nums ${animating ? 'animate-score-pop' : ''}`}
          style={animating ? { '--glow-color': color + '80' } as React.CSSProperties : undefined}
        >
          {player.totalPoints}
          <span className="text-sm font-medium text-text-muted ml-1">pts</span>
        </div>
      </div>

      <DrinkTracker
        totalPoints={player.totalPoints}
        shotsTaken={player.shotsTaken}
        sipsTaken={player.sipsTaken}
      />

      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'TAKE_SIP', playerId: player.id })}
          disabled={sipsAvailable <= 0}
          className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            sipsAvailable > 0
              ? 'bg-neon-amber/15 text-neon-amber border border-neon-amber/25 animate-glow-pulse'
              : 'bg-bg-input/50 text-text-muted border border-white/[0.06]'
          }`}
          style={sipsAvailable > 0 ? { '--glow-color': '#ffb80040' } as React.CSSProperties : undefined}
        >
          Sip {sipsAvailable > 0 && <span className="opacity-70">(-10)</span>}
        </button>
        <button
          onClick={() => dispatch({ type: 'TAKE_SHOT', playerId: player.id })}
          disabled={shotsAvailable <= 0}
          className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            shotsAvailable > 0
              ? 'bg-neon-red/15 text-neon-red border border-neon-red/25 animate-glow-pulse'
              : 'bg-bg-input/50 text-text-muted border border-white/[0.06]'
          }`}
          style={shotsAvailable > 0 ? { '--glow-color': '#ff2d5540' } as React.CSSProperties : undefined}
        >
          Shot {shotsAvailable > 0 && <span className="opacity-70">(-100)</span>}
        </button>
      </div>

      <div
        className="h-px"
        style={{ background: `linear-gradient(to right, transparent, ${color}30, transparent)` }}
      />

      <ScoreEntry onSubmit={handleAddScore} />

      <RoundWinButton winnerId={player.id} allPlayers={allPlayers} dispatch={dispatch} />

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
                  <span>Round {entry.round}</span>
                  <span className={
                    entry.source === 'win-bonus' ? 'text-neon-amber' :
                    entry.source === 'drink-shot' ? 'text-neon-red' :
                    entry.source === 'drink-sip' ? 'text-neon-amber' : ''
                  }>
                    {entry.pointsAdded > 0 ? '+' : ''}{entry.pointsAdded}
                    {entry.source === 'win-bonus' ? ' (win bonus)' :
                     entry.source === 'drink-shot' ? ' (shot taken)' :
                     entry.source === 'drink-sip' ? ' (sip taken)' : ' pts'}
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
