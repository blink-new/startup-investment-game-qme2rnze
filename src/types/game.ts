export interface Player {
  id: string
  userId: string
  username: string
  reputationScore: number
  totalPortfolioValue: number
  availableCash: number
  gamesPlayed: number
  successfulExits: number
  createdAt: string
  updatedAt: string
}

export interface GameSession {
  id: string
  userId: string
  sessionName: string
  startTime: string
  endTime?: string
  durationMinutes: number
  status: 'active' | 'completed' | 'expired'
  finalPortfolioValue: number
  reputationGained: number
  timeRemaining: number
}

export interface Startup {
  id: string
  name: string
  industry: string
  description: string
  currentValuation: number
  fundingStage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth'
  riskLevel: 'low' | 'medium' | 'high'
  growthPotential: number
  reputationRequired: number
  availableShares: number
  logo?: string
}

export interface Investment {
  id: string
  userId: string
  sessionId: string
  startupId: string
  sharesPurchased: number
  purchasePrice: number
  purchaseTime: string
  currentValue: number
  status: 'active' | 'exited'
  startup: Startup
}

export interface MarketEvent {
  id: string
  startupId: string
  eventType: 'acquisition' | 'ipo' | 'funding_round' | 'failure' | 'growth'
  impactMultiplier: number
  description: string
  occurredAt: string
}

export interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  reputationScore: number
  totalReturns: number
  successfulExits: number
  winRate: number
  lastUpdated: string
}