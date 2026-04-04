import { useState } from 'react'
import type { GameState } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { getPlayerColor } from '../state/gameReducer'
import { rankPlayers } from '../utils/playerStats'
import PlayerCard from './PlayerCard'
import GameStatsBar from './GameStatsBar'
import DrinkStatsPanel from './DrinkStatsPanel'
import AddPlayerInline from './AddPlayerInline'

interface GameBoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

function getGridClass(count: number): string {
  switch (count) {
    case 2: return 'grid-cols-1 sm:grid-cols-2 max-w-5xl lg:max-w-none'
    case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl lg:max-w-none'
    case 4: return 'grid-cols-2 max-w-6xl lg:max-w-none'
    case 5:
    case 6: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
}

export default function GameBoard({ state, dispatch }: GameBoardProps) {
  const rankings = rankPlayers(state.players)
  const [drinkPanelOpen, setDrinkPanelOpen] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)

  const manyPlayers = state.players.length > 4

  return (
    <div className="flex flex-col h-[calc(100dvh-44px)] overflow-hidden">
      {/* Compact session bar */}
      <div className="shrink-0 px-2.5 sm:px-4 pt-1 pb-0.5">
        <GameStatsBar
          players={state.players}
          currentRound={state.currentRound}
          onAddPlayer={() => setShowAddPlayer(true)}
        />
      </div>

      {/* Add player form (slides in below stats bar) */}
      {showAddPlayer && (
        <div className="shrink-0 px-2.5 sm:px-4 pb-1.5">
          <div className="max-w-sm">
            <AddPlayerInline
              existingNames={state.players.map(p => p.name)}
              onAdd={(name) => { dispatch({ type: 'ADD_PLAYER', name }); setShowAddPlayer(false) }}
              onCancel={() => setShowAddPlayer(false)}
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Mobile/tablet: collapsible drink panel */}
        <div className="shrink-0 px-2.5 sm:px-4 pb-1 lg:hidden">
          <DrinkStatsPanel
            players={state.players}
            open={drinkPanelOpen}
            onToggle={() => setDrinkPanelOpen(o => !o)}
          />
        </div>

        {/* Player cards grid — scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2.5 sm:px-4 pb-3" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className={`grid ${manyPlayers ? 'gap-2' : 'gap-2.5 sm:gap-3'} mx-auto ${getGridClass(state.players.length)}`}>
            {state.players.map((player, i) => (
              <PlayerCard
                key={player.id}
                player={player}
                allPlayers={state.players}
                color={getPlayerColor(i)}
                index={i}
                rank={rankings.get(player.id) ?? i + 1}
                totalPlayers={state.players.length}
                dispatch={dispatch}
                manyPlayers={manyPlayers}
              />
            ))}
          </div>
        </div>

        {/* Desktop: always-visible drink sidebar */}
        <aside
          className="hidden lg:flex lg:flex-col w-72 xl:w-80 shrink-0 overflow-y-auto"
          style={{
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(24,24,32,0.5)',
          }}
        >
          <DrinkStatsPanel players={state.players} variant="sidebar" />
        </aside>
      </div>
    </div>
  )
}
