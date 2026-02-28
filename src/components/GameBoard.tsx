import { useState } from 'react'
import type { GameState } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { getPlayerColor } from '../state/gameReducer'
import { rankPlayers } from '../utils/playerStats'
import PlayerCard from './PlayerCard'
import GameStatsBar from './GameStatsBar'
import DrinkStatsPanel from './DrinkStatsPanel'

interface GameBoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

function getGridClass(count: number): string {
  switch (count) {
    case 2: return 'grid-cols-1 sm:grid-cols-2 max-w-5xl auto-rows-fr'
    case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl auto-rows-fr'
    case 4: return 'grid-cols-2 max-w-6xl auto-rows-fr'
    default: return 'grid-cols-2 sm:grid-cols-3 max-w-6xl'
  }
}

export default function GameBoard({ state, dispatch }: GameBoardProps) {
  const rankings = rankPlayers(state.players)
  const [drinkPanelOpen, setDrinkPanelOpen] = useState(false)

  const manyPlayers = state.players.length > 4

  return (
    <div className="flex flex-col h-[calc(100dvh-58px)] overflow-hidden">
      {/* Stats section */}
      <div className="shrink-0 px-3 sm:px-4 pt-3 pb-2 space-y-2">
        <GameStatsBar
          players={state.players}
          currentRound={state.currentRound}
          submittedCount={state.roundSubmissions.length}
        />
        <DrinkStatsPanel
          players={state.players}
          open={drinkPanelOpen}
          onToggle={() => setDrinkPanelOpen(o => !o)}
        />
      </div>

      {/* Player cards grid - fills remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 pb-4">
        <div className={`grid gap-3 sm:gap-4 mx-auto ${manyPlayers ? 'h-auto' : 'h-full'} ${getGridClass(state.players.length)}`}>
          {state.players.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              allPlayers={state.players}
              color={getPlayerColor(i)}
              index={i}
              rank={rankings.get(player.id) ?? i + 1}
              totalPlayers={state.players.length}
              hasSubmitted={state.roundSubmissions.includes(player.id)}
              dispatch={dispatch}
              manyPlayers={manyPlayers}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
