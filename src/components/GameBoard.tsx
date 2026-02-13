import type { GameState } from '../types/game'
import type { GameAction } from '../state/gameReducer'
import { getPlayerColor } from '../state/gameReducer'
import { rankPlayers } from '../utils/playerStats'
import PlayerCard from './PlayerCard'
import GameStatsBar from './GameStatsBar'

interface GameBoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

function getGridClass(count: number): string {
  switch (count) {
    case 2: return 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
    case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
    case 4: return 'grid-cols-2 lg:grid-cols-4 max-w-6xl'
    default: return 'grid-cols-2 sm:grid-cols-3 max-w-6xl'
  }
}

export default function GameBoard({ state, dispatch }: GameBoardProps) {
  const rankings = rankPlayers(state.players)

  return (
    <div className="mx-auto px-3 sm:px-4 py-3 space-y-3">
      <GameStatsBar
        players={state.players}
        currentRound={state.currentRound}
        submittedCount={state.roundSubmissions.length}
      />
      <div className={`grid gap-3 sm:gap-4 mx-auto ${getGridClass(state.players.length)}`}>
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
          />
        ))}
      </div>
    </div>
  )
}
