import type { Player } from '../types/game'

export interface DerivedStats {
  rank: number
  shotsOwed: number
  sipsOwed: number
  ptsUntilNextSip: number
  totalDrinksTaken: number
  lastAction: string | null
  lastActionTime: number | null
  dangerLevel: 'safe' | 'mild' | 'hot' | 'critical'
}

export function computeStats(player: Player): Omit<DerivedStats, 'rank'> {
  const shotsOwed = Math.floor(player.totalPoints / 100)
  const sipsOwed = Math.floor((player.totalPoints % 100) / 10)
  const remainder = player.totalPoints % 10
  const ptsUntilNextSip = remainder === 0 ? 0 : 10 - remainder

  const lastEntry = player.roundHistory.length > 0
    ? player.roundHistory[player.roundHistory.length - 1]
    : null

  let lastAction: string | null = null
  if (lastEntry) {
    switch (lastEntry.source) {
      case 'score':
        lastAction = `+${lastEntry.pointsAdded} pts`
        break
      case 'win-bonus':
        lastAction = '+50 bonus'
        break
      case 'drink-shot':
        lastAction = 'took shot'
        break
      case 'drink-sip':
        lastAction = 'took sip'
        break
    }
  }

  let dangerLevel: DerivedStats['dangerLevel'] = 'safe'
  if (player.totalPoints >= 100) dangerLevel = 'critical'
  else if (player.totalPoints >= 50) dangerLevel = 'hot'
  else if (player.totalPoints > 0) dangerLevel = 'mild'

  return {
    shotsOwed,
    sipsOwed,
    ptsUntilNextSip,
    totalDrinksTaken: player.shotsTaken + player.sipsTaken,
    lastAction,
    lastActionTime: lastEntry?.timestamp ?? null,
    dangerLevel,
  }
}

export function rankPlayers(players: Player[]): Map<string, number> {
  const sorted = [...players].sort((a, b) => a.totalPoints - b.totalPoints)
  const ranks = new Map<string, number>()
  let currentRank = 1
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].totalPoints !== sorted[i - 1].totalPoints) {
      currentRank = i + 1
    }
    ranks.set(sorted[i].id, currentRank)
  }
  return ranks
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 10) return 'just now'
  if (diff < 60) return `${diff}s ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}
