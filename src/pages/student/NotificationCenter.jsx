
import { useEffect, useState, useCallback } from 'react'
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  X,
  FileText,
  CalendarDays,
} from 'lucide-react'
import '../../components/nav.css'

const initialNotifications = [
  {
    id: 1,
    type: 'accepted',
    title: 'Internship application accepted',
    message:
      'Kigali Digital Labs accepted your application for Frontend Development Intern.',
    time: '5 minutes ago',
    unread: true,
  },
  {
    id: 2,
    type: 'email',
    title: 'Company email update',
    message:
      'A company has sent an email to your registered email address. Check your inbox for details.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'review',
    title: 'Application under review',
    message:
      'Your application for Backend Development Intern is now under review.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 4,
    type: 'interview',
    title: 'Interview reminder',
    message:
      'Remember to check your email for interview details and instructions.',
    time: '2 days ago',
    unread: false,
  },
]

const notificationIcons = {
  accepted: CheckCircle2,
  email: Mail,
  review: FileText,
  interview: CalendarDays,
  message: MessageSquare,
}

function NotificationCenter({ onClose, onUnreadCountChange }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length

  // Keep the navbar's unread badge synchronized with this panel.
  const reportUnreadCount = useCallback(() => {
    onUnreadCountChange?.(unreadCount)
  }, [unreadCount, onUnreadCountChange])

  useEffect(() => {
    reportUnreadCount()
  }, [reportUnreadCount])

  const visibleNotifications = notifications.filter((notification) =>
    filter === 'unread' ? notification.unread : true
  )

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    )
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    )
  }

  return (
    <div className="notification-backdrop" onMouseDown={onClose}>
      <section
        className="notification-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-heading"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="notification-header">
          <div className="notification-heading-copy">
            <h2 id="notification-heading">Notifications</h2>
            <p>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : "You're all caught up"}
            </p>
          </div>

          <button
            type="button"
            className="notification-close"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X size={21} />
          </button>
        </header>

        <div className="notification-toolbar">
          <div className="notification-filters">
            <button
              type="button"
              className={filter === 'all' ? 'selected' : ''}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              type="button"
              className={filter === 'unread' ? 'selected' : ''}
              aria-pressed={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
            </button>
          </div>

          <button
            type="button"
            className="mark-all-read"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} />
            <span>Mark all read</span>
          </button>
        </div>

        <div className="notification-list">
          {visibleNotifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell

            return (
              <article
                key={notification.id}
                className={`notification-item ${
                  notification.unread ? 'unread' : ''
                }`}
              >
                <div
                  className={`notification-type-icon ${notification.type}`}
                >
                  <Icon size={20} />
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {notification.unread && (
                      <span
                        className="notification-unread-dot"
                        aria-label="Unread"
                      />
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-time">
                    <Clock3 size={13} />
                    {notification.time}
                  </span>

                  {notification.unread && (
                    <button
                      type="button"
                      className="notification-read-action"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </article>
            )
          })}

          {visibleNotifications.length === 0 && (
            <div className="notification-empty">
              <CheckCircle2 size={32} />
              <h3>You're all caught up</h3>
              <p>You have no unread notifications.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default NotificationCenter
