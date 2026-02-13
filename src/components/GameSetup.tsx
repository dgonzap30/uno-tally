import { useState } from 'react'
import type { Player } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { getPlayerColor } from '../state/gameReducer'

interface GameSetupProps {
  players: Player[]
  dispatch: React.Dispatch<GameAction>
}

export default function GameSetup({ players, dispatch }: GameSetupProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const addPlayer = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Name already taken')
      setTimeout(() => setError(null), 2000)
      return
    }
    dispatch({ type: 'ADD_PLAYER', name: trimmed })
    setName('')
    setError(null)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8 animate-slide-up">
        <div className="card-fan mb-4" style={{ transform: 'scale(0.8)' }}>
          <div className="card-fan-card">U</div>
          <div className="card-fan-card">N</div>
          <div className="card-fan-card">O</div>
        </div>
        <h2 className="text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Game Setup</h2>
        <p className="text-text-secondary text-sm">Add at least 2 players to begin</p>
      </div>

      <div className="flex gap-2 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPlayer()}
          placeholder="Player name"
          className="flex-1 h-12 px-4 rounded-xl bg-bg-input/60 border border-white/[0.06] text-text-primary placeholder:text-text-muted outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
          style={{ fontSize: '16px' }}
          maxLength={20}
        />
        <button
          onClick={addPlayer}
          disabled={!name.trim()}
          className="h-12 px-6 rounded-xl bg-neon-blue/90 text-white font-bold disabled:opacity-20 transition-all active:scale-95 hover:shadow-[0_0_15px_#00d4ff30]"
        >
          Add
        </button>
      </div>

      {error && (
        <p className="text-neon-red text-xs mb-2 animate-slide-up">{error}</p>
      )}

      {players.length > 0 && (
        <div className="space-y-2 mb-8">
          {players.map((player, i) => (
            <div
              key={player.id}
              className="flex items-center justify-between h-12 px-4 rounded-xl glass-card border-l-4 animate-card-enter"
              style={{ borderLeftColor: getPlayerColor(i), animationDelay: `${i * 80}ms` }}
            >
              <span className="font-semibold">{player.name}</span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: player.id })}
                className="text-text-muted hover:text-neon-red transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => dispatch({ type: 'START_GAME' })}
        disabled={players.length < 2}
        className="w-full h-14 rounded-xl bg-neon-green text-black text-lg font-bold disabled:opacity-20 transition-all active:scale-[0.98] hover:shadow-[0_0_30px_#39ff1430,0_0_60px_#39ff1415] animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        Start Game ({players.length} player{players.length !== 1 ? 's' : ''})
      </button>

      <div className="mt-8 text-center text-text-muted text-xs space-y-1">
        <p>100 pts = 1 shot · 10 pts = 1 sip</p>
        <p>Win bonus: +50 pts to opponent</p>
      </div>
    </div>
  )
}
