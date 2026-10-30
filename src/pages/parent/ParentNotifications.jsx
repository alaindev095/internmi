
import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCheck,
  FileText,
  BriefcaseBusiness,
  Info,
  Clock3,
  CheckCircle2,
  Search,
} from 'lucide-react';
import './ParentNotifications.css';

const notificationIcons = {
  application: FileText,
  internship: BriefcaseBusiness,
  reminder: Clock3,
  system: Info,
};

export default function ParentNotifications({ notifications = [] }) {
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  const safeNotifications = Array.isArray(notifications)
    ? notifications
    : [];

  const unreadCount = safeNotifications.filter(
    (notification) => !notification.isRead && !notification.readAt
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return safeNotifications.filter((notification) => {
      const isRead = Boolean(notification.isRead || notification.readAt);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !isRead) ||
        (filter === 'read' && isRead);

      const title = notification.title ?? '';
      const message = notification.message ?? notification.body ?? '';

      const matchesSearch =
        !query ||
        String(title).toLowerCase().includes(query) ||
        String(message).toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [safeNotifications, filter, searchText]);

  return (
    <section className="parent-notifications-page">
      <header className="parent-notifications-header">
        <div>
          <span className="parent-notifications-eyebrow">
            PARENT PORTAL
          </span>
          <h1>Notifications</h1>
          <p>
            Stay informed about your student&apos;s internship journey and
            important account updates.
          </p>
        </div>

        <div className="parent-notifications-header-icon">
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="parent-notifications-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </header>

      <div className="parent-notifications-summary">
        <div className="parent-notifications-summary-icon">
          <Bell size={21} />
        </div>
        <div>
          <strong>
            {unreadCount === 0
              ? 'You are all caught up'
              : `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`}
          </strong>
          <p>
            {unreadCount === 0
              ? 'New updates will appear here when they become available.'
              : 'Review your unread notifications to stay up to date.'}
          </p>
        </div>
      </div>

      <div className="parent-notifications-content">
        <div className="parent-notifications-section-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Your notifications and account updates.</p>
          </div>

          <span className="parent-notifications-count">
            {filteredNotifications.length}{' '}
            {filteredNotifications.length === 1
              ? 'notification'
              : 'notifications'}
          </span>
        </div>

        <div className="parent-notifications-toolbar">
          <label className="parent-notifications-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search notifications..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              aria-label="Search notifications"
            />
          </label>

          <div className="parent-notifications-filters">
            {[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'read', label: 'Read' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  filter === option.value
                    ? 'parent-notifications-filter active'
                    : 'parent-notifications-filter'
                }
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="parent-notifications-list">
            {filteredNotifications.map((notification, index) => {
              const isRead = Boolean(
                notification.isRead || notification.readAt
              );

              const type = notificationIcons[notification.type]
                ? notification.type
                : 'system';

              const Icon = notificationIcons[type];

              return (
                <article
                  className={`parent-notification-item ${
                    isRead ? 'is-read' : 'is-unread'
                  }`}
                  key={notification.id ?? index}
                >
                  <div className={`parent-notification-icon ${type}`}>
                    <Icon size={20} />
                  </div>

                  <div className="parent-notification-body">
                    <div className="parent-notification-title-row">
                      <h3>
                        {notification.title ?? 'Notification'}
                      </h3>

                      {!isRead && (
                        <span className="parent-notification-unread-dot" />
                      )}
                    </div>

                    <p>
                      {notification.message ??
                        notification.body ??
                        'You have a new update.'}
                    </p>

                    <span className="parent-notification-time">
                      {notification.createdAt
                        ? formatNotificationDate(notification.createdAt)
                        : 'Date unavailable'}
                    </span>
                  </div>

                  <div className="parent-notification-state">
                    {isRead ? (
                      <span>
                        <CheckCircle2 size={15} />
                        Read
                      </span>
                    ) : (
                      <span className="unread-label">Unread</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="parent-notifications-empty">
            <div className="parent-notifications-empty-icon">
              <Bell size={28} />
            </div>

            <h3>
              {safeNotifications.length === 0
                ? 'No notifications yet'
                : 'No matching notifications'}
            </h3>

            <p>
              {safeNotifications.length === 0
                ? 'When important updates become available, you will find them here.'
                : 'Try a different search or notification filter.'}
            </p>

            {(searchText || filter !== 'all') &&
              safeNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchText('');
                    setFilter('all');
                  }}
                >
                  Clear filters
                </button>
              )}
          </div>
        )}

        <p className="parent-notifications-note">
          Notifications are displayed from the information available to your
          parent account.
        </p>
      </div>
    </section>
  );
}

function formatNotificationDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
