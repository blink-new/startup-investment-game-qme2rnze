import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { LeaderboardEntry } from '../types/game'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-amber-600" />
      default: return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getReputationTier = (score: number) => {
    if (score >= 5000) return { tier: 'Legendary', color: 'bg-purple-500' }
    if (score >= 3000) return { tier: 'Elite', color: 'bg-yellow-500' }
    if (score >= 2000) return { tier: 'Expert', color: 'bg-blue-500' }
    if (score >= 1500) return { tier: 'Advanced', color: 'bg-green-500' }
    if (score >= 1000) return { tier: 'Intermediate', color: 'bg-orange-500' }
    return { tier: 'Novice', color: 'bg-gray-500' }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900">Reputation Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => {
          const rank = index + 1
          const isCurrentUser = entry.userId === currentUserId
          const reputation = getReputationTier(entry.reputationScore)

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                isCurrentUser 
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-opacity-20' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                    {entry.username}
                  </span>
                  {isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Rep: {entry.reputationScore.toLocaleString()}</span>
                  <span>Exits: {entry.successfulExits}</span>
                  <span>Win Rate: {(entry.winRate * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="text-right">
                <Badge className={`text-xs text-white ${reputation.color} mb-1`}>
                  {reputation.tier}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">
                    {entry.totalReturns.toFixed(1)}x
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Reputation System</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Higher reputation unlocks exclusive investment opportunities</p>
          <p>• Gain reputation through successful exits (IPOs, acquisitions)</p>
          <p>• Lose reputation for failed investments and poor performance</p>
          <p>• Elite investors get first access to high-growth startups</p>
        </div>
      </div>
    </Card>
  )
}