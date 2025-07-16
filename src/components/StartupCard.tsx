import { useState } from 'react'
import { TrendingUp, Shield, AlertTriangle, Lock, DollarSign } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Startup } from '../types/game'

interface StartupCardProps {
  startup: Startup
  playerReputation: number
  availableCash: number
  onInvest: (startupId: string, shares: number, amount: number) => void
}

export function StartupCard({ 
  startup, 
  playerReputation, 
  availableCash, 
  onInvest 
}: StartupCardProps) {
  const [shares, setShares] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const pricePerShare = startup.currentValuation / startup.availableShares
  const totalInvestment = shares * pricePerShare
  const canAccess = playerReputation >= startup.reputationRequired
  const canAfford = totalInvestment <= availableCash

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="h-3 w-3" />
      case 'medium': return <TrendingUp className="h-3 w-3" />
      case 'high': return <AlertTriangle className="h-3 w-3" />
      default: return null
    }
  }

  const handleInvest = () => {
    if (canAccess && canAfford && shares > 0) {
      onInvest(startup.id, shares, totalInvestment)
      setIsDialogOpen(false)
      setShares(1)
    }
  }

  return (
    <Card className={`p-4 transition-all hover:shadow-lg ${!canAccess ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{startup.logo}</span>
          <div>
            <h3 className="font-bold text-gray-900">{startup.name}</h3>
            <p className="text-sm text-gray-600">{startup.industry}</p>
          </div>
        </div>
        {!canAccess && <Lock className="h-4 w-4 text-gray-400" />}
      </div>

      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{startup.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Valuation:</span>
          <span className="font-medium">${(startup.currentValuation / 1000000).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Stage:</span>
          <Badge variant="outline" className="text-xs">
            {startup.fundingStage.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Growth Potential:</span>
          <span className="font-medium text-green-600">{startup.growthPotential}x</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available Shares:</span>
          <span className="font-medium">{startup.availableShares.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Badge className={`text-xs ${getRiskColor(startup.riskLevel)}`}>
          {getRiskIcon(startup.riskLevel)}
          <span className="ml-1">{startup.riskLevel.toUpperCase()} RISK</span>
        </Badge>
        <span className="text-xs text-gray-500">
          Min. Rep: {startup.reputationRequired.toLocaleString()}
        </span>
      </div>

      {!canAccess ? (
        <Button disabled className="w-full">
          <Lock className="h-4 w-4 mr-2" />
          Reputation Required: {startup.reputationRequired.toLocaleString()}
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Invest Now
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invest in {startup.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Price per share:</span>
                  <p className="font-medium">${pricePerShare.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Available cash:</span>
                  <p className="font-medium">${availableCash.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="shares">Number of shares</Label>
                <Input
                  id="shares"
                  type="number"
                  min="1"
                  max={Math.min(startup.availableShares, Math.floor(availableCash / pricePerShare))}
                  value={shares}
                  onChange={(e) => setShares(Number(e.target.value))}
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Investment:</span>
                  <span className="font-bold">${totalInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Return ({startup.growthPotential}x):</span>
                  <span className="font-bold text-green-600">
                    ${(totalInvestment * startup.growthPotential).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleInvest}
                disabled={!canAfford || shares <= 0}
                className="w-full"
              >
                {!canAfford ? 'Insufficient Funds' : `Invest $${totalInvestment.toLocaleString()}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}