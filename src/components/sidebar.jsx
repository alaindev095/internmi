
import {
  House,
  Building2,
  BriefcaseBusiness,
  FileText,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import './sidebar.css'

const menuItems = [
  {
    label: 'Home',
    to: '/student/dashboard',
    Icon: House,
  },
  {
    label: 'Companies',
    to: '/student/companies',
    Icon: Building2,
  },
  {
    label: 'Internships',
    to: '/student/internships',
    Icon: BriefcaseBusiness,
  },
  {
    label: 'Applications',
    to: '/student/applications',
    Icon: FileText,
  },

]

function Sidebar({ open = false, onClose }) {
  // Temporary demo user; replace with logged-in user data later.
  const userName = 'John Doe'
  const userEmail = 'john@example.com'

  return (
    <>
      {open && (
        <button
          type="button"
          className="student-sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

    <aside className={`sidebar${open ? ' is-open' : ''}`}>
      <div className="sidebar-section">
        <p className="sidebar-label">WORKSPACE</p>

        <nav aria-label="Main navigation">
          <ul className="sidebar-menu">
            {menuItems.map(({ label, to, Icon }) => (
              <li key={label} >
                <NavLink
                  to={to}
                  end={label === 'Home'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive ? 'active' : ''
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="avatar-container">
          <div className="user-avatar" aria-label="User avatar">
            <UserRound size={21} />
          </div>
        </div>

        <div className="user-info">
          <NavLink to="/student/profile" onClick={onClose}>
            <div className="name">{userName}</div>
            <div className="email">{userEmail}</div>
          </NavLink>
        </div>
      </div>
    </aside>
    </>
  )
}

export default Sidebar
