export interface Player {
  id: string
  name: string
  totalPoints: number
  history: HistoryEntry[]
  shotsTaken: number
  sipsTaken: number
}

export interface HistoryEntry {
  pointsAdded: number
  source: 'score' | 'win-bonus' | 'drink-shot' | 'drink-sip'
  timestamp: number
}

export interface GameState {
  phase: 'setup' | 'playing'
  players: Player[]
}
