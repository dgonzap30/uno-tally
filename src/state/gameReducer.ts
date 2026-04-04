import type { GameState, Player } from '../types/game'

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'START_GAME' }
  | { type: 'ADD_SCORE'; playerId: string; points: number }
  | { type: 'WIN_ROUND'; winnerId: string; loserId: string }
  | { type: 'TAKE_SHOT'; playerId: string }
  | { type: 'TAKE_SIP'; playerId: string }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; state: GameState }

export const initialState: GameState = {
  phase: 'setup',
  players: [],
  currentRound: 1,
  roundSubmissions: [],
}

const PLAYER_COLORS = ['#ED1C24', '#0956BF', '#00A651', '#FFDE00', '#ED1C24', '#0956BF']

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

export function getPlayerTextColor(index: number): string {
  const color = getPlayerColor(index)
  return color === '#FFDE00' ? '#1a1a2e' : '#ffffff'
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
      }

    case 'START_GAME':
      return { ...state, phase: 'playing', roundSubmissions: [] }

    case 'ADD_SCORE': {
      return {
        ...state,
        players: state.players.map(p =>
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
        ),
      }
    }

    case 'WIN_ROUND': {
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
      return {
        ...state,
        players: updatedPlayers,
        currentRound: state.currentRound + 1,
        roundSubmissions: [],
      }
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

    case 'RENAME_PLAYER':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId ? { ...p, name: action.name } : p
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
