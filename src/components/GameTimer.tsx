import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { Card } from './ui/card'
import { Progress } from './ui/progress'

interface GameTimerProps {
  durationMinutes: number
  onTimeUp: () => void
  isActive: boolean
}

export function GameTimer({ durationMinutes, onTimeUp, isActive }: GameTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60)
  const totalSeconds = durationMinutes * 60

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const progressPercentage = ((totalSeconds - timeRemaining) / totalSeconds) * 100
  const isUrgent = timeRemaining < 300 // Last 5 minutes

  return (
    <Card className={`p-4 ${isUrgent ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isUrgent ? 'bg-red-100' : 'bg-blue-100'}`}>
          {isUrgent ? (
            <AlertTriangle className={`h-5 w-5 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />
          ) : (
            <Clock className={`h-5 w-5 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Time Remaining</span>
            <span className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isUrgent ? 'bg-red-200' : 'bg-blue-200'}`}
          />
        </div>
      </div>
      {isUrgent && (
        <div className="mt-2 text-xs text-red-600 font-medium">
          ⚠️ Time is running out! Make your final investment decisions.
        </div>
      )}
    </Card>
  )
}