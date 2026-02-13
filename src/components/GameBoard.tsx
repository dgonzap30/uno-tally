import type { GameState } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { getPlayerColor } from '../state/gameReducer'
import PlayerCard from './PlayerCard'

interface GameBoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

function getGridClass(count: number): string {
  switch (count) {
    case 2: return 'grid-cols-1 md:grid-cols-2'
    case 3: return 'grid-cols-1 md:grid-cols-3'
    case 4: return 'grid-cols-2 lg:grid-cols-4'
    default: return 'grid-cols-2 md:grid-cols-3'
  }
}

export default function GameBoard({ state, dispatch }: GameBoardProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className={`grid gap-5 ${getGridClass(state.players.length)}`}>
        {state.players.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            allPlayers={state.players}
            color={getPlayerColor(i)}
            index={i}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  )
}
