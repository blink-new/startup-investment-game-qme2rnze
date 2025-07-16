import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Investment } from '../types/game'

interface PortfolioOverviewProps {
  investments: Investment[]
  availableCash: number
  totalPortfolioValue: number
  startingValue: number
}

export function PortfolioOverview({ 
  investments, 
  availableCash, 
  totalPortfolioValue, 
  startingValue 
}: PortfolioOverviewProps) {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.purchasePrice, 0)
  const currentInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalReturn = totalPortfolioValue - startingValue
  const returnPercentage = ((totalPortfolioValue - startingValue) / startingValue) * 100
  const isPositive = totalReturn >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Portfolio</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalPortfolioValue.toLocaleString()}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <PieChart className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Available Cash</p>
            <p className="text-2xl font-bold text-gray-900">
              ${availableCash.toLocaleString()}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Return</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}${totalReturn.toLocaleString()}
            </p>
          </div>
          <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <TrendingUp className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Return %</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{returnPercentage.toFixed(1)}%
            </p>
          </div>
          <Badge 
            variant={isPositive ? 'default' : 'destructive'}
            className="text-xs"
          >
            {investments.length} investments
          </Badge>
        </div>
      </Card>
    </div>
  )
}