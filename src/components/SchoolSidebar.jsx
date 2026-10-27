import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  UserCog,
  Settings,
  ChevronRight,
  LogOut,
  GraduationCap,
  LifeBuoy,
  MoreHorizontal,
  UserRound,
  School,
} from 'lucide-react'

import './SchoolSidebar.css'

const navigation = [
  {
    title: 'WORKSPACE',
    items: [
      {
        name: 'Overview',
        path: '/school/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'Classes',
        path: '/school/classes',
        icon: School,
      },
      {
        name: 'Students',
        path: '/school/students',
        icon: Users,
      },
      {
        name: 'Internships',
        path: '/school/internships',
        icon: BriefcaseBusiness,
      },
      {
        name: 'Reports',
        path: '/school/reports',
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      {
        name: 'School staff',
        path: '/school/staff',
        icon: UserCog,
      },
      {
        name: 'Settings',
        path: '/school/settings',
        icon: Settings,
      },
    ],
  },
]

export default function SchoolSidebar({ onNavigate }) {
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/login')
    onNavigate?.()
  }

  return (
    <aside className="school-sidebar">
      <div className="school-sidebar-navigation">
        {navigation.map((group) => (
          <section className="school-nav-group" key={group.title}>
            <p className="school-nav-heading">{group.title}</p>

            <div className="school-nav-items">
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `school-nav-link${isActive ? ' school-nav-link-active' : ''}`
                    }
                  >
                    <Icon className="school-nav-icon" size={18} />
                    <span className="school-nav-label">{item.name}</span>
                    <ChevronRight
                      className="school-nav-chevron"
                      size={15}
                    />
                  </NavLink>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="school-sidebar-bottom">
        <a
          className="school-help-card"
          href="mailto:support@internmi.com"
        >
          <span className="school-help-icon">
            <LifeBuoy size={18} />
          </span>

          <span className="school-help-text">
            <strong>Need assistance?</strong>
            <span>Contact the Internmi support team.</span>
          </span>

          <ChevronRight size={16} className="school-help-arrow" />
        </a>

        <button
          type="button"
          className="school-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>

        <div className="school-account">
          <div className="school-account-avatar">
            <GraduationCap size={19} />
          </div>

          <div className="school-account-details">
            <strong>School Admin</strong>
            <span>School Administrator</span>
          </div>

          <button
            type="button"
            className="school-account-menu"
            aria-label="Open school account"
            title="School account"
            onClick={() => navigate('/school/user-profile')}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}
