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
        className="shrink-0 h-7 px-3 rounded-lg bg-neon-green/10 text-neon-green border border-neon-green/25 text-xs font-bold hover:bg-neon-green/20 transition-all active:scale-95"
        title={`+50 pts to ${opponents[0].name}`}
      >
        Won Round
      </button>
    )
  }

  if (picking) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-text-muted">Who lost?</span>
        {opponents.map(opp => (
          <button
            key={opp.id}
            onClick={() => handleWin(opp.id)}
            className="h-6 px-2.5 rounded-md bg-neon-amber/15 text-neon-amber border border-neon-amber/30 text-[10px] font-bold hover:bg-neon-amber/25 transition-all active:scale-95 truncate max-w-[80px]"
          >
            {opp.name}
          </button>
        ))}
        <button
          onClick={() => setPicking(false)}
          className="text-text-muted text-xs px-1 hover:text-text-primary"
        >
          x
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setPicking(true)}
      className="shrink-0 h-7 px-3 rounded-lg bg-neon-green/10 text-neon-green border border-neon-green/25 text-xs font-bold hover:bg-neon-green/20 transition-all active:scale-95"
    >
      Won Round
    </button>
  )
}
