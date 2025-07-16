import { useState } from 'react'
import { TrendingUp, TrendingDown, Calendar, DollarSign, Building2 } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Investment } from '../types/game'

interface InvestmentHistoryProps {
  investments: Investment[]
  onSellInvestment?: (investmentId: string) => void
}

export function InvestmentHistory({ investments, onSellInvestment }: InvestmentHistoryProps) {
  const [sortBy, setSortBy] = useState<'date' | 'performance' | 'value'>('date')

  const sortedInvestments = [...investments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.purchaseTime).getTime() - new Date(a.purchaseTime).getTime()
      case 'performance':
        const aReturn = ((a.currentValue - a.purchasePrice) / a.purchasePrice) * 100
        const bReturn = ((b.currentValue - b.purchasePrice) / b.purchasePrice) * 100
        return bReturn - aReturn
      case 'value':
        return b.currentValue - a.currentValue
      default:
        return 0
    }
  })

  const getPerformanceColor = (investment: Investment) => {
    const returnPercent = ((investment.currentValue - investment.purchasePrice) / investment.purchasePrice) * 100
    if (returnPercent > 0) return 'text-green-600'
    if (returnPercent < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPerformanceIcon = (investment: Investment) => {
    const returnPercent = ((investment.currentValue - investment.purchasePrice) / investment.purchasePrice) * 100
    if (returnPercent > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (returnPercent < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <DollarSign className="h-4 w-4 text-gray-600" />
  }

  if (investments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Investments Yet</h3>
        <p className="text-gray-600">
          Start investing in startups to build your portfolio and track your performance here.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Investment Portfolio</h3>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('date')}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Date
          </Button>
          <Button
            variant={sortBy === 'performance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('performance')}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Performance
          </Button>
          <Button
            variant={sortBy === 'value' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('value')}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            Value
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedInvestments.map((investment) => {
          const returnAmount = investment.currentValue - investment.purchasePrice
          const returnPercent = (returnAmount / investment.purchasePrice) * 100
          const isProfit = returnAmount > 0

          return (
            <div
              key={investment.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{investment.startup.logo}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{investment.startup.name}</h4>
                  <p className="text-sm text-gray-600">{investment.startup.industry}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {investment.sharesPurchased} shares
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(investment.purchaseTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {getPerformanceIcon(investment)}
                  <span className="font-medium text-gray-900">
                    ${investment.currentValue.toLocaleString()}
                  </span>
                </div>
                <div className={`text-sm ${getPerformanceColor(investment)}`}>
                  {isProfit ? '+' : ''}${returnAmount.toLocaleString()} 
                  ({isProfit ? '+' : ''}{returnPercent.toFixed(1)}%)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Cost: ${investment.purchasePrice.toLocaleString()}
                </div>
              </div>

              {onSellInvestment && investment.status === 'active' && (
                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSellInvestment(investment.id)}
                    className="text-xs"
                  >
                    Sell
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="font-bold text-gray-900">
              ${investments.reduce((sum, inv) => sum + inv.purchasePrice, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="font-bold text-gray-900">
              ${investments.reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Return</p>
            <p className={`font-bold ${
              investments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchasePrice), 0) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {investments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchasePrice), 0) >= 0 ? '+' : ''}
              ${investments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchasePrice), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}