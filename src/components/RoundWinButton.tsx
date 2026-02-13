import { useState } from 'react'
import type { Player } from '../types/game'
import type { GameAction } from '../state/gameReducer'

interface RoundWinButtonProps {
  winnerId: string
  allPlayers: Player[]
  dispatch: React.Dispatch<GameAction>
}

export default function RoundWinButton({ winnerId, allPlayers, dispatch }: RoundWinButtonProps) {
  const [picking, setPicking] = useState(false)
  const opponents = allPlayers.filter(p => p.id !== winnerId)

  const handleWin = (loserId: string) => {
    dispatch({ type: 'WIN_ROUND', winnerId, loserId })
    setPicking(false)
  }

  if (opponents.length === 1) {
    return (
      <button
        onClick={() => handleWin(opponents[0].id)}
        className="w-full h-11 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/25 text-sm font-bold animate-glow-pulse hover:bg-neon-green/15 hover:shadow-[0_0_25px_#39ff1420] transition-all active:scale-95"
        style={{
          fontFamily: "var(--font-display)",
          '--glow-color': '#39ff1425',
        } as React.CSSProperties}
      >
        Won!
      </button>
    )
  }

  if (picking) {
    return (
      <div className="flex gap-1.5 flex-wrap items-center">
        <span className="text-xs text-text-secondary mr-1">Who lost?</span>
        {opponents.map(opp => (
          <button
            key={opp.id}
            onClick={() => handleWin(opp.id)}
            className="h-9 px-4 rounded-lg bg-neon-amber/15 text-neon-amber border border-neon-amber/30 text-xs font-bold hover:bg-neon-amber/25 hover:shadow-[0_0_12px_#ffb80030] transition-all active:scale-95"
          >
            {opp.name}
          </button>
        ))}
        <button
          onClick={() => setPicking(false)}
          className="h-8 px-2 rounded-lg text-text-muted text-xs hover:text-text-primary"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setPicking(true)}
      className="w-full h-11 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/25 text-sm font-bold animate-glow-pulse hover:bg-neon-green/15 hover:shadow-[0_0_25px_#39ff1420] transition-all active:scale-95"
      style={{
        fontFamily: "var(--font-display)",
        '--glow-color': '#39ff1425',
      } as React.CSSProperties}
    >
      Won!
    </button>
  )
}
