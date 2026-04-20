import { useState } from 'react'
import type { Player } from '../types/game'
import type { UIAction } from '../state/gameReducer'

interface GameSetupProps {
  players: Player[]
  dispatch: React.Dispatch<UIAction>
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
    <div className="flex-1 min-h-0 overflow-y-auto">
    <div className="max-w-lg mx-auto px-5 py-10">
      <div className="text-center mb-10 animate-slide-up">
        <div className="card-fan mb-6">
          <div className="card-fan-card">U</div>
          <div className="card-fan-card">N</div>
          <div className="card-fan-card">O</div>
        </div>
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: "var(--font-display)", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
        >
          GAME SETUP
        </h2>
        <p className="text-text-secondary text-base">Add at least 2 players to begin</p>
      </div>

      {/* Input row */}
      <div className="flex gap-3 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPlayer()}
          placeholder="Player name"
          className="flex-1 h-13 px-5 rounded-xl text-text-primary placeholder:text-text-muted/50 outline-none transition-all text-base"
          style={{
            fontSize: '16px',
            background: 'rgba(22, 22, 32, 0.7)',
            border: '2px solid rgba(255,255,255,0.10)',
          }}
          maxLength={20}
        />
        <button
          onClick={addPlayer}
          disabled={!name.trim()}
          className="h-13 px-7 rounded-xl font-black disabled:opacity-15 transition-all active:scale-95"
          style={{
            background: 'linear-gradient(180deg, #0956BF 0%, #074da6 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(9, 86, 191, 0.25)',
          }}
        >
          Add
        </button>
      </div>

      {error && (
        <p className="text-sm font-bold mb-3 animate-slide-up" style={{ color: '#ED1C24' }}>{error}</p>
      )}

      {/* Player list */}
      {players.length > 0 && (
        <div className="space-y-2.5 mb-8">
          {players.map((player, i) => {
            const color = player.color
            return (
              <div
                key={player.id}
                className="flex items-center justify-between h-14 px-5 rounded-xl animate-card-enter"
                style={{
                  animationDelay: `${i * 80}ms`,
                  background: `linear-gradient(135deg, ${color}15 0%, rgba(28,28,36,0.80) 40%)`,
                  border: `2px solid rgba(255,255,255,0.06)`,
                  borderLeftWidth: '5px',
                  borderLeftColor: color,
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
                }}
              >
                <span
                  className="font-bold text-base"
                  style={{ fontFamily: 'var(--font-display)', color }}
                >
                  {player.name}
                </span>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: player.id })}
                  className="text-text-muted hover:text-[#ED1C24] hover:bg-[#ED1C24]/10 transition-colors text-lg leading-none w-8 h-8 flex items-center justify-center rounded-lg"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Start button */}
      <button
        onClick={() => dispatch({ type: 'START_GAME' })}
        disabled={players.length < 2}
        className="w-full h-16 rounded-2xl text-xl font-black disabled:opacity-15 transition-all active:scale-[0.96] animate-slide-up"
        style={{
          animationDelay: '200ms',
          fontFamily: 'var(--font-display)',
          background: players.length >= 2
            ? 'linear-gradient(135deg, #00A651 0%, #008a42 50%, #00A651 100%)'
            : 'rgba(0, 166, 81, 0.3)',
          backgroundSize: '200% 100%',
          color: '#ffffff',
          boxShadow: players.length >= 2
            ? '0 6px 20px rgba(0, 166, 81, 0.3), 0 2px 8px rgba(0,0,0,0.3)'
            : 'none',
        }}
      >
        START GAME ({players.length} player{players.length !== 1 ? 's' : ''})
      </button>

      {/* Rules */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#ED1C24' }} />
          <span className="text-text-muted text-xs">100 pts = 1 shot</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#FFDE00' }} />
          <span className="text-text-muted text-xs">10 pts = 1 sip</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#00A651' }} />
          <span className="text-text-muted text-xs">Win = +50 pts</span>
        </div>
      </div>
    </div>
    </div>
  )
}
