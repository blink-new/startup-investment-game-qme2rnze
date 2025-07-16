import { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { MarketEvent } from '../types/game'

interface MarketNewsProps {
  events: MarketEvent[]
  onEventImpact?: (event: MarketEvent) => void
}

export function MarketNews({ events, onEventImpact }: MarketNewsProps) {
  const [displayedEvents, setDisplayedEvents] = useState<MarketEvent[]>([])

  useEffect(() => {
    // Simulate real-time news updates
    const interval = setInterval(() => {
      if (events.length > displayedEvents.length) {
        const nextEvent = events[displayedEvents.length]
        setDisplayedEvents(prev => [nextEvent, ...prev])
        onEventImpact?.(nextEvent)
      }
    }, 10000) // New event every 10 seconds

    return () => clearInterval(interval)
  }, [events, displayedEvents.length, onEventImpact])

  const getEventIcon = (eventType: string, impact: number) => {
    const isPositive = impact > 1
    
    switch (eventType) {
      case 'acquisition':
      case 'ipo':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'funding_round':
        return isPositive ? 
          <TrendingUp className="h-4 w-4 text-green-600" /> : 
          <TrendingDown className="h-4 w-4 text-red-600" />
      case 'failure':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'growth':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getEventBadge = (eventType: string, impact: number) => {
    const isPositive = impact > 1
    
    switch (eventType) {
      case 'acquisition':
        return <Badge className="bg-green-100 text-green-800">Acquisition</Badge>
      case 'ipo':
        return <Badge className="bg-blue-100 text-blue-800">IPO</Badge>
      case 'funding_round':
        return <Badge className={isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          Funding Round
        </Badge>
      case 'failure':
        return <Badge className="bg-red-100 text-red-800">Company Failure</Badge>
      case 'growth':
        return <Badge className="bg-green-100 text-green-800">Growth</Badge>
      default:
        return <Badge variant="secondary">Market Event</Badge>
    }
  }

  const getImpactText = (impact: number) => {
    if (impact > 2) return `+${((impact - 1) * 100).toFixed(0)}% 🚀`
    if (impact > 1) return `+${((impact - 1) * 100).toFixed(0)}% 📈`
    if (impact < 0.5) return `-${((1 - impact) * 100).toFixed(0)}% 📉`
    return `-${((1 - impact) * 100).toFixed(0)}% ⚠️`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Market News</h2>
        <Badge variant="secondary" className="text-xs">Live</Badge>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Newspaper className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Monitoring market for breaking news...</p>
            <p className="text-sm">Events will appear here in real-time</p>
          </div>
        ) : (
          displayedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.eventType, event.impactMultiplier)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getEventBadge(event.eventType, event.impactMultiplier)}
                  <span className="text-xs text-gray-500">
                    {new Date(event.occurredAt).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-900 mb-2">{event.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Impact on valuation
                  </span>
                  <span className={`text-sm font-bold ${
                    event.impactMultiplier > 1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getImpactText(event.impactMultiplier)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {displayedEvents.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Pro Tip:</strong> Market events directly affect your portfolio value. 
            Stay alert for acquisition and IPO opportunities to maximize returns!
          </p>
        </div>
      )}
    </Card>
  )
}