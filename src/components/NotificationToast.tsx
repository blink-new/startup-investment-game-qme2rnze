import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, X, DollarSign } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface NotificationToastProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setVisibleNotifications(notifications)

    // Auto-dismiss notifications after their duration
    notifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          onDismiss(notification.id)
        }, notification.duration)
      }
    })
  }, [notifications, onDismiss])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'warning':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      case 'info':
        return <DollarSign className="h-5 w-5 text-blue-600" />
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 shadow-lg animate-in slide-in-from-right-full duration-300 ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}