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

  const btnStyle = {
    background: 'linear-gradient(180deg, rgba(0,166,81,0.18) 0%, rgba(0,166,81,0.08) 100%)',
    border: '2px solid rgba(0,166,81,0.30)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  }

  if (opponents.length === 1) {
    return (
      <button
        onClick={() => handleWin(opponents[0].id)}
        className="shrink-0 h-9 px-4 rounded-xl text-sm font-black transition-all active:scale-90"
        style={{ ...btnStyle, fontFamily: 'var(--font-display)', color: '#00A651' }}
        title={`+50 pts to ${opponents[0].name}`}
      >
        WON
      </button>
    )
  }

  if (picking) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-text-muted font-bold">Who lost?</span>
        {opponents.map(opp => (
          <button
            key={opp.id}
            onClick={() => handleWin(opp.id)}
            className="h-8 px-3 rounded-lg text-xs font-bold transition-all active:scale-90 truncate max-w-[90px]"
            style={{
              color: '#FFDE00',
              background: 'linear-gradient(180deg, rgba(255,222,0,0.18) 0%, rgba(255,222,0,0.08) 100%)',
              border: '2px solid rgba(255,222,0,0.30)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {opp.name}
          </button>
        ))}
        <button
          onClick={() => setPicking(false)}
          className="text-text-muted text-xs px-1.5 hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setPicking(true)}
      className="shrink-0 h-9 px-4 rounded-xl text-sm font-black transition-all active:scale-90"
      style={{ ...btnStyle, fontFamily: 'var(--font-display)', color: '#00A651' }}
    >
      WON
    </button>
  )
}
