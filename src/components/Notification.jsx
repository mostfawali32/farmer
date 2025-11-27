import { useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Notification.css'

function Notification({ message, type = 'info', onClose, duration = 3000 }) {
  const { language } = useLanguage()

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success'
      case 'error':
        return 'notification-error'
      case 'warning':
        return 'notification-warning'
      default:
        return 'notification-info'
    }
  }

  return (
    <div className={`notification ${getTypeClass()}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default Notification

