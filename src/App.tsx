import { useState, useEffect } from 'react'
import { Play, RotateCcw, Trophy, Clock } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { GameTimer } from './components/GameTimer'
import { ReputationDisplay } from './components/ReputationDisplay'
import { StartupCard } from './components/StartupCard'
import { PortfolioOverview } from './components/PortfolioOverview'
import { Leaderboard } from './components/Leaderboard'
import { MarketNews } from './components/MarketNews'
import { InvestmentHistory } from './components/InvestmentHistory'
import { AchievementSystem } from './components/AchievementSystem'
import { NotificationToast } from './components/NotificationToast'
import { blink } from './blink/client'
import { mockStartups, mockMarketEvents, mockLeaderboard } from './data/mockData'
import { Player, GameSession, Investment, MarketEvent } from './types/game'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [player, setPlayer] = useState<Player>({
    id: 'player_1',
    userId: 'user_1',
    username: 'Rookie Investor',
    reputationScore: 0, // Start from zero reputation
    totalPortfolioValue: 100000,
    availableCash: 100000,
    gamesPlayed: 0,
    successfulExits: 0, // Start with no successful exits
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [investments, setInvestments] = useState<Investment[]>([])
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>(mockMarketEvents)
  const [gameEndDialog, setGameEndDialog] = useState(false)
  const [finalResults, setFinalResults] = useState<any>(null)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'success' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
  }>>([])

  const addNotification = (notification: {
    type: 'success' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
  }) => {
    const id = `notification_${Date.now()}`
    setNotifications(prev => [...prev, { ...notification, id, duration: notification.duration || 5000 }])
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const startNewGame = () => {
    const session: GameSession = {
      id: `session_${Date.now()}`,
      userId: user?.id || 'demo_user',
      sessionName: `Investment Round ${player.gamesPlayed + 1}`,
      startTime: new Date().toISOString(),
      durationMinutes: 15, // 15-minute rounds for intense gameplay
      status: 'active',
      finalPortfolioValue: 0,
      reputationGained: 0,
      timeRemaining: 15 * 60
    }
    
    setGameSession(session)
    setInvestments([])
    setPlayer(prev => ({
      ...prev,
      availableCash: 100000,
      totalPortfolioValue: 100000
    }))
  }

  const handleInvestment = (startupId: string, shares: number, amount: number) => {
    const startup = mockStartups.find(s => s.id === startupId)
    if (!startup || amount > player.availableCash) return

    const investment: Investment = {
      id: `inv_${Date.now()}`,
      userId: user?.id || 'demo_user',
      sessionId: gameSession?.id || '',
      startupId,
      sharesPurchased: shares,
      purchasePrice: amount,
      purchaseTime: new Date().toISOString(),
      currentValue: amount, // Initially same as purchase price
      status: 'active',
      startup
    }

    setInvestments(prev => [...prev, investment])
    setPlayer(prev => ({
      ...prev,
      availableCash: prev.availableCash - amount,
      totalPortfolioValue: prev.totalPortfolioValue // Will be updated by market events
    }))
  }

  const handleSellInvestment = (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId)
    if (!investment || investment.status !== 'active') return

    // Update investment status to exited
    setInvestments(prev => prev.map(inv => 
      inv.id === investmentId 
        ? { ...inv, status: 'exited' as const }
        : inv
    ))

    // Add cash back to player
    setPlayer(prev => ({
      ...prev,
      availableCash: prev.availableCash + investment.currentValue,
      totalPortfolioValue: prev.totalPortfolioValue // Will be recalculated
    }))
  }

  const handleMarketEvent = (event: MarketEvent) => {
    // Update investment values based on market events
    setInvestments(prev => prev.map(inv => {
      if (inv.startupId === event.startupId) {
        const newValue = inv.currentValue * event.impactMultiplier
        return { ...inv, currentValue: newValue }
      }
      return inv
    }))

    // Update total portfolio value
    const updatedInvestmentValue = investments.reduce((sum, inv) => {
      if (inv.startupId === event.startupId) {
        return sum + (inv.currentValue * event.impactMultiplier)
      }
      return sum + inv.currentValue
    }, 0)

    setPlayer(prev => ({
      ...prev,
      totalPortfolioValue: prev.availableCash + updatedInvestmentValue
    }))
  }

  const handleGameEnd = () => {
    if (!gameSession) return

    const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const finalValue = player.availableCash + totalInvestmentValue
    const totalReturn = finalValue - 100000
    const returnPercentage = (totalReturn / 100000) * 100
    
    // Calculate reputation gain/loss
    let reputationChange = 0
    if (returnPercentage > 50) reputationChange = 200
    else if (returnPercentage > 20) reputationChange = 100
    else if (returnPercentage > 0) reputationChange = 50
    else if (returnPercentage > -20) reputationChange = -25
    else reputationChange = -100

    const results = {
      finalValue,
      totalReturn,
      returnPercentage,
      reputationChange,
      newReputation: player.reputationScore + reputationChange,
      successfulInvestments: investments.filter(inv => inv.currentValue > inv.purchasePrice).length
    }

    setFinalResults(results)
    setGameSession(prev => prev ? { ...prev, status: 'completed', finalPortfolioValue: finalValue } : null)
    setPlayer(prev => ({
      ...prev,
      reputationScore: prev.reputationScore + reputationChange,
      gamesPlayed: prev.gamesPlayed + 1,
      successfulExits: prev.successfulExits + (returnPercentage > 20 ? 1 : 0)
    }))
    setGameEndDialog(true)
  }

  const resetGame = () => {
    setGameSession(null)
    setInvestments([])
    setGameEndDialog(false)
    setFinalResults(null)
    setPlayer(prev => ({
      ...prev,
      availableCash: 100000,
      totalPortfolioValue: 100000
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Startup Investment Game...</p>
        </div>
      </div>
    )
  }

  const availableStartups = mockStartups.filter(startup => 
    startup.reputationRequired <= player.reputationScore
  )

  const lockedStartups = mockStartups.filter(startup => 
    startup.reputationRequired > player.reputationScore
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Startup Investment Game
          </h1>
          <p className="text-lg text-gray-600">
            Start as a rookie investor and work your way up. Better reputation unlocks exclusive deals with higher returns.
          </p>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!gameSession ? (
            <Button onClick={startNewGame} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-5 w-5 mr-2" />
              Start New Investment Round
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button onClick={resetGame} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset Game
              </Button>
              {gameSession.status === 'active' && (
                <Button onClick={handleGameEnd} variant="destructive" size="lg">
                  <Clock className="h-5 w-5 mr-2" />
                  End Round Early
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Game Timer */}
        {gameSession && gameSession.status === 'active' && (
          <div className="mb-8">
            <GameTimer
              durationMinutes={gameSession.durationMinutes}
              onTimeUp={handleGameEnd}
              isActive={true}
            />
          </div>
        )}

        {/* Reputation Display */}
        <div className="mb-8">
          <ReputationDisplay
            reputationScore={player.reputationScore}
            successfulExits={player.successfulExits}
            winRate={player.gamesPlayed > 0 ? player.successfulExits / player.gamesPlayed : 0}
            totalReturns={2.3}
          />
        </div>

        {/* Portfolio Overview */}
        {gameSession && (
          <div className="mb-8">
            <PortfolioOverview
              investments={investments}
              availableCash={player.availableCash}
              totalPortfolioValue={player.totalPortfolioValue}
              startingValue={100000}
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="startups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="startups">Available Startups</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="news">Market News</TabsTrigger>
          </TabsList>

          <TabsContent value="startups" className="space-y-6">
            {gameSession ? (
              <>
                {player.reputationScore === 0 && (
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🥚</span>
                      <h3 className="font-bold text-yellow-800">Welcome, Rookie Investor!</h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                      As a new investor, you only have access to high-risk, low-reward deals. 
                      Make smart investments to build your reputation and unlock better opportunities!
                    </p>
                  </Card>
                )}
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Investment Opportunities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableStartups.map((startup) => (
                      <StartupCard
                        key={startup.id}
                        startup={startup}
                        playerReputation={player.reputationScore}
                        availableCash={player.availableCash}
                        onInvest={handleInvestment}
                      />
                    ))}
                  </div>

                  {lockedStartups.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-700 mb-4">
                        🔒 Exclusive Deals (Higher Reputation Required)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lockedStartups.map((startup) => (
                          <StartupCard
                            key={startup.id}
                            startup={startup}
                            playerReputation={player.reputationScore}
                            availableCash={player.availableCash}
                            onInvest={handleInvestment}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Investing?
                </h2>
                <p className="text-gray-600 mb-6">
                  You have 15 minutes to research startups, make investment decisions, 
                  and build your portfolio. Higher reputation unlocks exclusive deals!
                </p>
                <Button onClick={startNewGame} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-5 w-5 mr-2" />
                  Begin Investment Round
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio">
            <InvestmentHistory 
              investments={investments} 
              onSellInvestment={gameSession?.status === 'active' ? handleSellInvestment : undefined}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystem player={player} investments={investments} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard entries={mockLeaderboard} currentUserId={user?.id} />
          </TabsContent>

          <TabsContent value="news">
            <MarketNews events={marketEvents} onEventImpact={handleMarketEvent} />
          </TabsContent>
        </Tabs>

        {/* Game End Dialog */}
        <Dialog open={gameEndDialog} onOpenChange={setGameEndDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                🎯 Investment Round Complete!
              </DialogTitle>
            </DialogHeader>
            {finalResults && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Final Results</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Final Portfolio Value:</span>
                      <span className="font-bold">${finalResults.finalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Return:</span>
                      <span className={`font-bold ${finalResults.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {finalResults.totalReturn >= 0 ? '+' : ''}${finalResults.totalReturn.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return %:</span>
                      <span className={`font-bold ${finalResults.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {finalResults.returnPercentage >= 0 ? '+' : ''}{finalResults.returnPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold mb-2">Reputation Update</h4>
                  <div className="flex justify-between items-center">
                    <span>{player.reputationScore - finalResults.reputationChange}</span>
                    <span className="text-2xl">→</span>
                    <span className="font-bold text-blue-600">{finalResults.newReputation}</span>
                  </div>
                  <span className={`text-sm ${finalResults.reputationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {finalResults.reputationChange >= 0 ? '+' : ''}{finalResults.reputationChange} reputation
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button onClick={startNewGame} className="flex-1">
                    Play Again
                  </Button>
                  <Button onClick={resetGame} variant="outline" className="flex-1">
                    Main Menu
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App