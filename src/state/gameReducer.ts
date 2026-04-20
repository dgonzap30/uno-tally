import type { GameState, HistoryEntry, Player } from '../types/game'

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'START_GAME' }
  | { type: 'ADD_SCORE'; playerId: string; points: number; entryId: string }
  | { type: 'ADD_WIN_PENALTY'; loserId: string; entryId: string }
  | { type: 'TAKE_SHOT'; playerId: string; entryId: string }
  | { type: 'TAKE_SIP'; playerId: string; entryId: string }
  | { type: 'UNDO_LAST'; playerId: string; entryId: string }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string }
  | { type: 'RESET_GAME' }

// UI-facing actions — what components dispatch. The undo hook injects entryId
// for the 4 mutating types before forwarding to the reducer / wire.
export type UIAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'START_GAME' }
  | { type: 'ADD_SCORE'; playerId: string; points: number }
  | { type: 'ADD_WIN_PENALTY'; loserId: string }
  | { type: 'TAKE_SHOT'; playerId: string }
  | { type: 'TAKE_SIP'; playerId: string }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string }
  | { type: 'RESET_GAME' }

export const initialState: GameState = {
  phase: 'setup',
  players: [],
}

export const PLAYER_COLORS = [
  '#ED1C24', // UNO red
  '#0956BF', // UNO blue
  '#00A651', // UNO green
  '#FFDE00', // UNO yellow
  '#FF6B35', // orange
  '#9B59B6', // purple
]

const MAX_NAME_LENGTH = 20
const MAX_SCORE_POINTS = 10000
const WIN_PENALTY_POINTS = 50
const SHOT_COST = 100
const SIP_COST = 10

function pickColor(players: Player[]): string {
  const used = new Set(players.map(p => p.color))
  const unused = PLAYER_COLORS.find(c => !used.has(c))
  return unused ?? PLAYER_COLORS[players.length % PLAYER_COLORS.length]
}

export function migrateState(saved: unknown): GameState {
  const state = saved as Record<string, unknown>
  const rawPlayers = ((state.players ?? []) as Record<string, unknown>[])
  const players: Player[] = rawPlayers.map((p, i) => {
    const rawHistory = ((p.history ?? p.roundHistory ?? []) as Record<string, unknown>[])
    const history: HistoryEntry[] = rawHistory.map(h => ({
      id: (h.id as string) ?? crypto.randomUUID(),
      pointsAdded: (h.pointsAdded as number) ?? 0,
      source: (h.source as HistoryEntry['source']) ?? 'score',
      timestamp: (h.timestamp as number) ?? Date.now(),
    }))
    return {
      id: (p.id as string) ?? crypto.randomUUID(),
      name: (p.name as string) ?? '',
      color: (p.color as string) ?? PLAYER_COLORS[i % PLAYER_COLORS.length],
      totalPoints: (p.totalPoints as number) ?? 0,
      history,
      shotsTaken: (p.shotsTaken as number) ?? 0,
      sipsTaken: (p.sipsTaken as number) ?? 0,
    }
  })
  return {
    phase: (state.phase as 'setup' | 'playing') ?? 'setup',
    players,
  }
}

function isValidPoints(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && Number.isInteger(n) && n > 0 && n <= MAX_SCORE_POINTS
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const trimmed = typeof action.name === 'string' ? action.name.trim() : ''
      if (!trimmed || trimmed.length > MAX_NAME_LENGTH) return state
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: trimmed,
        color: pickColor(state.players),
        totalPoints: 0,
        history: [],
        shotsTaken: 0,
        sipsTaken: 0,
      }
      return { ...state, players: [...state.players, newPlayer] }
    }

    case 'REMOVE_PLAYER': {
      const remaining = state.players.filter(p => p.id !== action.playerId)
      if (remaining.length === state.players.length) return state
      return {
        phase: remaining.length === 0 ? 'setup' : state.phase,
        players: remaining,
      }
    }

    case 'START_GAME':
      if (state.players.length < 2) return state
      return { ...state, phase: 'playing' }

    case 'ADD_SCORE': {
      if (!isValidPoints(action.points)) return state
      if (!state.players.some(p => p.id === action.playerId)) return state
      const timestamp = Date.now()
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId
            ? {
                ...p,
                totalPoints: p.totalPoints + action.points,
                history: [...p.history, { id: action.entryId, pointsAdded: action.points, source: 'score', timestamp }],
              }
            : p
        ),
      }
    }

    case 'ADD_WIN_PENALTY': {
      if (!state.players.some(p => p.id === action.loserId)) return state
      const timestamp = Date.now()
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.loserId
            ? {
                ...p,
                totalPoints: p.totalPoints + WIN_PENALTY_POINTS,
                history: [...p.history, { id: action.entryId, pointsAdded: WIN_PENALTY_POINTS, source: 'win-bonus', timestamp }],
              }
            : p
        ),
      }
    }

    case 'TAKE_SHOT': {
      const target = state.players.find(p => p.id === action.playerId)
      if (!target || target.totalPoints < SHOT_COST) return state
      const timestamp = Date.now()
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId
            ? {
                ...p,
                totalPoints: p.totalPoints - SHOT_COST,
                shotsTaken: p.shotsTaken + 1,
                history: [...p.history, { id: action.entryId, pointsAdded: -SHOT_COST, source: 'drink-shot', timestamp }],
              }
            : p
        ),
      }
    }

    case 'TAKE_SIP': {
      const target = state.players.find(p => p.id === action.playerId)
      if (!target || target.totalPoints < SIP_COST) return state
      const timestamp = Date.now()
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId
            ? {
                ...p,
                totalPoints: p.totalPoints - SIP_COST,
                sipsTaken: p.sipsTaken + 1,
                history: [...p.history, { id: action.entryId, pointsAdded: -SIP_COST, source: 'drink-sip', timestamp }],
              }
            : p
        ),
      }
    }

    case 'UNDO_LAST': {
      const player = state.players.find(p => p.id === action.playerId)
      if (!player) return state
      const idx = player.history.findIndex(h => h.id === action.entryId)
      if (idx === -1) return state
      const entry = player.history[idx]
      return {
        ...state,
        players: state.players.map(p => {
          if (p.id !== action.playerId) return p
          return {
            ...p,
            totalPoints: p.totalPoints - entry.pointsAdded,
            shotsTaken: entry.source === 'drink-shot' ? Math.max(0, p.shotsTaken - 1) : p.shotsTaken,
            sipsTaken: entry.source === 'drink-sip' ? Math.max(0, p.sipsTaken - 1) : p.sipsTaken,
            history: [...p.history.slice(0, idx), ...p.history.slice(idx + 1)],
          }
        }),
      }
    }

    case 'RENAME_PLAYER': {
      const trimmed = typeof action.name === 'string' ? action.name.trim() : ''
      if (!trimmed || trimmed.length > MAX_NAME_LENGTH) return state
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId ? { ...p, name: trimmed } : p
        ),
      }
    }

    case 'RESET_GAME':
      return { ...initialState }

    default:
      return state
  }
}
