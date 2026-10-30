
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  House,
  GraduationCap,
  FileText,
  Bell,
  UserRound,
  LogOut,
  X
} from 'lucide-react'

import Nav from '../components/nav'
import './ParentLayout.css'

const parentLinks = [
  {
    label: 'Dashboard',
    path: '/parent/dashboard',
    icon: House
  },
  {
    label: 'My Student',
    path: '/parent/student',
    icon: GraduationCap
  },
  {
    label: 'Applications',
    path: '/parent/applications',
    icon: FileText
  },
  {
    label: 'Notifications',
    path: '/parent/notifications',
    icon: Bell
  }
]

export default function ParentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Temporary demo user; replace with logged-in user data later.
  const userName = 'Parent Account'
  const userEmail = 'parent@example.com'

  function closeSidebar() {
    setSidebarOpen(false)
  }

  function handleLogout() {
    closeSidebar()
    navigate('/login')
  }

  return (
    <div className="parent-layout">
      <Nav
        onMenuClick={() => setSidebarOpen(open => !open)}
        menuOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="parent-sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      <div className="parent-workspace">
        <aside
          className={`parent-sidebar ${
            sidebarOpen ? 'parent-sidebar-open' : ''
          }`}
        >
          <div className="parent-sidebar-heading">
            <span>WORKSPACE</span>
            <button
              type="button"
              className="parent-sidebar-close"
              aria-label="Close navigation"
              onClick={closeSidebar}
            >
              <X size={19} />
            </button>
          </div>

          <nav className="parent-sidebar-links" aria-label="Parent navigation">
            {parentLinks.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `parent-sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="parent-sidebar-bottom">
            <button
              type="button"
              className="parent-sidebar-logout"
              onClick={handleLogout}
            >
              <LogOut size={19} strokeWidth={1.8} />
              <span>Log out</span>
            </button>

            <NavLink
              to="/parent/profile"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `parent-sidebar-account ${isActive ? 'active' : ''}`
              }
              aria-label="Open profile"
            >
              <div className="parent-sidebar-avatar" aria-hidden="true">
                <UserRound size={21} />
              </div>
              <div className="parent-sidebar-user">
                <div className="name">{userName}</div>
                <div className="email">{userEmail}</div>
              </div>
            </NavLink>
          </div>
        </aside>

        <main className="parent-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
