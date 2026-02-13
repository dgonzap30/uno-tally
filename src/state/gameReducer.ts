import type { GameState, Player } from '../types/game'

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'START_GAME' }
  | { type: 'ADD_SCORE'; playerId: string; points: number }
  | { type: 'WIN_ROUND'; winnerId: string; loserId: string }
  | { type: 'TAKE_SHOT'; playerId: string }
  | { type: 'TAKE_SIP'; playerId: string }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; state: GameState }

export const initialState: GameState = {
  phase: 'setup',
  players: [],
  currentRound: 1,
  roundSubmissions: [],
}

const PLAYER_COLORS = ['#ff2d55', '#00d4ff', '#39ff14', '#bf5af2', '#ff6d00', '#00fff5']

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

function advanceIfComplete(
  players: Player[],
  submissions: string[],
  currentRound: number,
): { currentRound: number; roundSubmissions: string[] } {
  const allSubmitted = players.every(p => submissions.includes(p.id))
  if (allSubmitted) {
    return { currentRound: currentRound + 1, roundSubmissions: [] }
  }
  return { currentRound, roundSubmissions: submissions }
}

export function migrateState(saved: unknown): GameState {
  const state = saved as Record<string, unknown>
  const players = (state.players as Player[]).map(p => ({
    ...p,
    shotsTaken: p.shotsTaken ?? 0,
    sipsTaken: p.sipsTaken ?? 0,
  }))
  return {
    phase: state.phase as 'setup' | 'playing',
    players,
    currentRound: state.currentRound as number,
    roundSubmissions: (state.roundSubmissions as string[] | undefined) ?? [],
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const timestamp = Date.now()

  switch (action.type) {
    case 'ADD_PLAYER': {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: action.name,
        totalPoints: 0,
        roundHistory: [],
        shotsTaken: 0,
        sipsTaken: 0,
      }
      return { ...state, players: [...state.players, newPlayer] }
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.playerId),
        roundSubmissions: state.roundSubmissions.filter(id => id !== action.playerId),
      }

    case 'START_GAME':
      return { ...state, phase: 'playing', roundSubmissions: [] }

    case 'ADD_SCORE': {
      if (state.roundSubmissions.includes(action.playerId)) return state
      const updatedPlayers = state.players.map(p =>
        p.id === action.playerId
          ? {
              ...p,
              totalPoints: p.totalPoints + action.points,
              roundHistory: [
                ...p.roundHistory,
                { round: state.currentRound, pointsAdded: action.points, source: 'score' as const, timestamp },
              ],
            }
          : p
      )
      const newSubmissions = [...state.roundSubmissions, action.playerId]
      const roundState = advanceIfComplete(updatedPlayers, newSubmissions, state.currentRound)
      return { ...state, players: updatedPlayers, ...roundState }
    }

    case 'WIN_ROUND': {
      if (state.roundSubmissions.includes(action.winnerId)) return state
      const updatedPlayers = state.players.map(p =>
        p.id === action.loserId
          ? {
              ...p,
              totalPoints: p.totalPoints + 50,
              roundHistory: [
                ...p.roundHistory,
                { round: state.currentRound, pointsAdded: 50, source: 'win-bonus' as const, timestamp },
              ],
            }
          : p
      )
      const newSubmissions = [...state.roundSubmissions, action.winnerId]
      const roundState = advanceIfComplete(updatedPlayers, newSubmissions, state.currentRound)
      return { ...state, players: updatedPlayers, ...roundState }
    }

    case 'TAKE_SHOT':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId && p.totalPoints >= 100
            ? {
                ...p,
                totalPoints: p.totalPoints - 100,
                shotsTaken: p.shotsTaken + 1,
                roundHistory: [
                  ...p.roundHistory,
                  { round: state.currentRound, pointsAdded: -100, source: 'drink-shot' as const, timestamp },
                ],
              }
            : p
        ),
      }

    case 'TAKE_SIP':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId && p.totalPoints >= 10
            ? {
                ...p,
                totalPoints: p.totalPoints - 10,
                sipsTaken: p.sipsTaken + 1,
                roundHistory: [
                  ...p.roundHistory,
                  { round: state.currentRound, pointsAdded: -10, source: 'drink-sip' as const, timestamp },
                ],
              }
            : p
        ),
      }

    case 'RESET_GAME':
      return { ...initialState }

    case 'LOAD_STATE':
      return migrateState(action.state)

    default:
      return state
  }
}
