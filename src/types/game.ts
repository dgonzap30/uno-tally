export interface Player {
  id: string
  name: string
  totalPoints: number
  roundHistory: RoundEntry[]
  shotsTaken: number
  sipsTaken: number
}

export interface RoundEntry {
  round: number
  pointsAdded: number
  source: 'score' | 'win-bonus' | 'drink-shot' | 'drink-sip'
  timestamp: number
}

export interface GameState {
  phase: 'setup' | 'playing'
  players: Player[]
  currentRound: number
  roundSubmissions: string[]
}
