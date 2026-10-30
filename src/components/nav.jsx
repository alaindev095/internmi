
import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Sparkles,
  UserRound,
  X,
  Menu,
} from 'lucide-react'

import './nav.css'
import umunaraIcon from '../assets/icons/umunara-logo.svg'
import NotificationCenter from '../pages/student/NotificationCenter'

function Nav({ onMenuClick, menuOpen = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  const inputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isCompany = location.pathname.startsWith('/company')
  const isSchool = location.pathname.startsWith('/school')
  const isAdmin = location.pathname.startsWith('/admin')
  const isParent = location.pathname.startsWith('/parent')

const homePath = isAdmin
  ? '/admin/dashboard'
  : isCompany
  ? '/company/dashboard'
  : isSchool
    ? '/school/dashboard'
    : isParent
      ? '/parent/dashboard'
      : '/student/dashboard'

const profilePath = isAdmin
  ? '/admin/profile'
  : isCompany
  ? '/company/user-profile'
  : isSchool
    ? '/school/user-profile'
    : isParent
      ? '/parent/profile'
      : '/student/profile'

  const searchPlaceholder = isAdmin
    ? 'Search schools, companies or users...'
    : isCompany
    ? 'Search applications...'
    : isSchool
      ? 'Search students or internships...'
      : 'Search companies or internships...'

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  function getSearchDestination(query) {
    const encodedQuery = encodeURIComponent(query)

    if (isAdmin) {
      return `/admin/schools?search=${encodedQuery}`
    }

    if (isCompany) {
      return `/company/applications?search=${encodedQuery}`
    }

    if (isSchool) {
      return `/school/internships?search=${encodedQuery}`
    }

    return `/student/internships?search=${encodedQuery}`
  }

  function handleSearch(event) {
    event.preventDefault()

    const query = searchText.trim()

    if (!query) {
      inputRef.current?.focus()
      return
    }

    navigate(getSearchDestination(query))
    setIsOpen(false)
  }

  function handleSearchButton() {
    if (!isOpen) {
      setIsOpen(true)
      return
    }

    const query = searchText.trim()

    if (query) {
      navigate(getSearchDestination(query))
      setIsOpen(false)
    } else {
      inputRef.current?.focus()
    }
  }

  function closeSearch() {
    setIsOpen(false)
    setSearchText('')
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="right-nav">
        {(isAdmin || isCompany || isSchool || isParent || location.pathname.startsWith('/student')) && (
          <button
            type="button"
            className={`nav-action ${
              isAdmin
              ? 'admin-menu-trigger'
              : isCompany
              ? 'company-menu-trigger'
              : isSchool
                ? 'school-menu-trigger'
                : isParent
                  ? 'parent-menu-trigger'
                  : 'student-menu-trigger'
            }`}
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            onClick={onMenuClick}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        <NavLink
          to={homePath}
          className="logo"
          aria-label="Umunaralink home"
        >
          <img src={umunaraIcon} alt="Umunaralink logo" />
        </NavLink>

        <span className="brand-name">Umunara<span style={{ color: '#0c7bfa', fontWeight: 'bold', fontSize: '1.2rem' }}>link</span></span>
      </div>

      <div className="middle-nav">
        <form
          className={`search-form ${isOpen ? 'is-open' : ''}`}
          onSubmit={handleSearch}
          role="search"
        >
          <Search className="search-leading-icon" size={18} />

          <input
            ref={inputRef}
            className="search-text"
            type="search"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            aria-label="Search"
          />

          <button
            className="search-icon"
            type={isOpen ? 'submit' : 'button'}
            aria-label={isOpen ? 'Submit search' : 'Open search'}
            onClick={!isOpen ? handleSearchButton : undefined}
          >
            <Search size={19} />
          </button>

          {isOpen && (
            <button
              className="search-close"
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      <div className="left-nav">
        <button
          type="button"
          aria-label={`Notifications${
            unreadCount > 0 ? `, ${unreadCount} unread` : ''
          }`}
          className="nav-action notification-trigger"
          title="Notifications"
          aria-haspopup="dialog"
          aria-expanded={showNotifications}
          onClick={() => setShowNotifications((open) => !open)}
        >
          <Bell size={18} />

          {unreadCount > 0 && (
            <span className="notification-count">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-label="Ask AI"
          className="nav-action"
          title="Ask AI"
        >
          <Sparkles size={18} />
        </button>

        <NavLink
          to={profilePath}
          className="nav-action profile-btn"
          aria-label="Profile"
          title="Profile"
        >
          <UserRound size={18} />
        </NavLink>
      </div>

      {showNotifications && (
        <NotificationCenter
          onClose={() => setShowNotifications(false)}
          onUnreadCountChange={setUnreadCount}
        />
      )}
    </nav>
  )
}

export default Nav
