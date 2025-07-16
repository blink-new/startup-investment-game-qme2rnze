import { Trophy, Star, Target, TrendingUp, Award, Crown } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Player, Investment } from '../types/game'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  requirement: number
  currentProgress: number
  isUnlocked: boolean
  category: 'investment' | 'performance' | 'reputation' | 'special'
  reward: string
}

interface AchievementSystemProps {
  player: Player
  investments: Investment[]
}

export function AchievementSystem({ player, investments }: AchievementSystemProps) {
  const calculateAchievements = (): Achievement[] => {
    const totalInvestments = investments.length
    const profitableInvestments = investments.filter(inv => inv.currentValue > inv.purchasePrice).length
    const totalReturn = investments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchasePrice), 0)
    const winRate = totalInvestments > 0 ? (profitableInvestments / totalInvestments) * 100 : 0

    return [
      {
        id: 'first_investment',
        title: 'First Steps',
        description: 'Make your first investment',
        icon: <Target className="h-5 w-5" />,
        requirement: 1,
        currentProgress: totalInvestments,
        isUnlocked: totalInvestments >= 1,
        category: 'investment',
        reward: '+50 Reputation'
      },
      {
        id: 'portfolio_builder',
        title: 'Portfolio Builder',
        description: 'Invest in 5 different startups',
        icon: <TrendingUp className="h-5 w-5" />,
        requirement: 5,
        currentProgress: totalInvestments,
        isUnlocked: totalInvestments >= 5,
        category: 'investment',
        reward: '+100 Reputation'
      },
      {
        id: 'diversified_investor',
        title: 'Diversified Investor',
        description: 'Invest in 10 different startups',
        icon: <Star className="h-5 w-5" />,
        requirement: 10,
        currentProgress: totalInvestments,
        isUnlocked: totalInvestments >= 10,
        category: 'investment',
        reward: '+200 Reputation'
      },
      {
        id: 'profit_maker',
        title: 'Profit Maker',
        description: 'Earn $50,000 in total returns',
        icon: <Trophy className="h-5 w-5" />,
        requirement: 50000,
        currentProgress: Math.max(0, totalReturn),
        isUnlocked: totalReturn >= 50000,
        category: 'performance',
        reward: '+150 Reputation'
      },
      {
        id: 'high_roller',
        title: 'High Roller',
        description: 'Earn $200,000 in total returns',
        icon: <Crown className="h-5 w-5" />,
        requirement: 200000,
        currentProgress: Math.max(0, totalReturn),
        isUnlocked: totalReturn >= 200000,
        category: 'performance',
        reward: '+500 Reputation'
      },
      {
        id: 'consistent_winner',
        title: 'Consistent Winner',
        description: 'Achieve 80% win rate with 5+ investments',
        icon: <Award className="h-5 w-5" />,
        requirement: 80,
        currentProgress: totalInvestments >= 5 ? winRate : 0,
        isUnlocked: totalInvestments >= 5 && winRate >= 80,
        category: 'performance',
        reward: '+300 Reputation'
      },
      {
        id: 'reputation_novice',
        title: 'Rising Star',
        description: 'Reach 2000 reputation',
        icon: <Star className="h-5 w-5" />,
        requirement: 2000,
        currentProgress: player.reputationScore,
        isUnlocked: player.reputationScore >= 2000,
        category: 'reputation',
        reward: 'Unlock Elite Startups'
      },
      {
        id: 'reputation_expert',
        title: 'Investment Expert',
        description: 'Reach 3000 reputation',
        icon: <Trophy className="h-5 w-5" />,
        requirement: 3000,
        currentProgress: player.reputationScore,
        isUnlocked: player.reputationScore >= 3000,
        category: 'reputation',
        reward: 'Unlock Legendary Startups'
      }
    ]
  }

  const achievements = calculateAchievements()
  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const lockedAchievements = achievements.filter(a => !a.isUnlocked)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'investment': return 'bg-blue-100 text-blue-800'
      case 'performance': return 'bg-green-100 text-green-800'
      case 'reputation': return 'bg-purple-100 text-purple-800'
      case 'special': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
        <Badge variant="secondary" className="ml-auto">
          {unlockedAchievements.length}/{achievements.length}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Unlocked</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getCategoryColor(achievement.category)}`}>
                        {achievement.category}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">
                        {achievement.reward}
                      </span>
                    </div>
                  </div>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">In Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAchievements.map((achievement) => {
                const progressPercent = Math.min(100, (achievement.currentProgress / achievement.requirement) * 100)
                
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={progressPercent} className="flex-1 h-2" />
                        <span className="text-xs text-gray-500">
                          {achievement.currentProgress.toLocaleString()}/{achievement.requirement.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Reward: {achievement.reward}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {unlockedAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600">Start investing to unlock achievements!</p>
        </div>
      )}
    </Card>
  )
}