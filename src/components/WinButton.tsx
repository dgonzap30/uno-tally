import { useState } from 'react'
import type { Player } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { getPlayerColor } from '../state/gameReducer'

interface WinButtonProps {
  playerId: string
  allPlayers: Player[]
  dispatch: React.Dispatch<GameAction>
}

export default function WinButton({ playerId, allPlayers, dispatch }: WinButtonProps) {
  const [picking, setPicking] = useState(false)
  const opponents = allPlayers.filter(p => p.id !== playerId)

  const handleWin = (loserId: string) => {
    dispatch({ type: 'ADD_WIN_PENALTY', loserId })
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
        +50
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setPicking(p => !p)}
        className="shrink-0 h-9 px-4 rounded-xl text-sm font-black transition-all active:scale-90"
        style={{ ...btnStyle, fontFamily: 'var(--font-display)', color: '#00A651' }}
      >
        +50
      </button>

      {picking && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPicking(false)}
        >
          <div
            className="w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-2xl overflow-hidden animate-slide-up"
            style={{
              background: 'rgba(28,28,36,0.95)',
              border: '2px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-base font-black" style={{ fontFamily: 'var(--font-display)' }}>
                Who gets +50?
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Select the player who lost</p>
            </div>

            <div className="px-3 pb-3 space-y-1.5 max-h-[50vh] overflow-y-auto">
              {opponents.map((opp) => {
                const color = getPlayerColor(allPlayers.indexOf(opp))
                return (
                  <button
                    key={opp.id}
                    onClick={() => handleWin(opp.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.97] hover:bg-white/[0.04]"
                    style={{
                      background: `linear-gradient(135deg, ${color}10 0%, rgba(28,28,36,0.6) 40%)`,
                      border: '2px solid rgba(255,255,255,0.05)',
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <span className="font-bold text-sm truncate" style={{ color, fontFamily: 'var(--font-display)' }}>
                      {opp.name}
                    </span>
                    <span className="ml-auto text-xs text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-score)' }}>
                      {opp.totalPoints} pts
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{ color: '#FFDE00', background: 'rgba(255,222,0,0.12)' }}>
                      +50
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="px-3 pb-3">
              <button
                onClick={() => setPicking(false)}
                className="w-full h-10 rounded-xl text-sm font-bold text-text-muted transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.06)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
