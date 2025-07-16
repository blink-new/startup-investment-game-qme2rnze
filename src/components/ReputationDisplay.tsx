import { Star, TrendingUp, Award } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface ReputationDisplayProps {
  reputationScore: number
  successfulExits: number
  winRate: number
  totalReturns: number
}

export function ReputationDisplay({ 
  reputationScore, 
  successfulExits, 
  winRate, 
  totalReturns 
}: ReputationDisplayProps) {
  const getReputationTier = (score: number) => {
    if (score >= 4000) return { tier: 'Legendary', color: 'bg-purple-500', icon: '👑', description: 'Access to the most exclusive deals' }
    if (score >= 3000) return { tier: 'Elite', color: 'bg-yellow-500', icon: '⭐', description: 'Top-tier investor with premium access' }
    if (score >= 2000) return { tier: 'Expert', color: 'bg-blue-500', icon: '💎', description: 'Proven track record, advanced deals' }
    if (score >= 1500) return { tier: 'Advanced', color: 'bg-green-500', icon: '🚀', description: 'Experienced investor, good opportunities' }
    if (score >= 1000) return { tier: 'Intermediate', color: 'bg-orange-500', icon: '📈', description: 'Building reputation, moderate deals' }
    if (score >= 500) return { tier: 'Developing', color: 'bg-blue-400', icon: '📊', description: 'Learning the ropes, basic deals' }
    if (score >= 200) return { tier: 'Beginner', color: 'bg-green-400', icon: '🌱', description: 'New investor, limited opportunities' }
    return { tier: 'Rookie', color: 'bg-gray-500', icon: '🥚', description: 'Starting out, high-risk deals only' }
  }

  const reputation = getReputationTier(reputationScore)
  const nextTierThreshold = Math.ceil(reputationScore / 500) * 500
  const progressToNext = ((reputationScore % 500) / 500) * 100

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${reputation.color} text-white text-xl`}>
            {reputation.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{reputation.tier} Investor</h3>
            <p className="text-sm text-gray-600">Reputation Score: {reputationScore.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{reputation.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          Level {Math.floor(reputationScore / 500) + 1}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress to next tier</span>
            <span>{reputationScore} / {nextTierThreshold}</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Award className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-lg font-bold text-gray-900">{successfulExits}</span>
            <span className="text-xs text-gray-600">Successful Exits</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-lg font-bold text-gray-900">{(winRate * 100).toFixed(0)}%</span>
            <span className="text-xs text-gray-600">Win Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="h-5 w-5 text-yellow-600 mb-1" />
            <span className="text-lg font-bold text-gray-900">{totalReturns.toFixed(1)}x</span>
            <span className="text-xs text-gray-600">Avg Returns</span>
          </div>
        </div>
      </div>
    </Card>
  )
}