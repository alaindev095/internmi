import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  LifeBuoy,
  MoreHorizontal,
  School,
  Building2,
  Megaphone,
  ScrollText,
} from 'lucide-react'

import { useAdminData } from '../context/AdminDataContext'
import './AdminSidebar.css'

const navigation = [
  {
    title: 'PLATFORM',
    items: [
      { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Schools', path: '/admin/schools', icon: School },
      { name: 'Companies', path: '/admin/companies', icon: Building2 },
      { name: 'Internships', path: '/admin/internships', icon: BriefcaseBusiness },
      { name: 'Users & access', path: '/admin/users', icon: Users },
    ],
  },
  {
    title: 'INSIGHTS & COMMS',
    items: [
      { name: 'Reports', path: '/admin/reports', icon: ChartNoAxesCombined },
      { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
      { name: 'Audit log', path: '/admin/audit', icon: ScrollText },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
]

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate()
  const { me } = useAdminData()

  function handleLogout() {
    navigate('/login')
    onNavigate?.()
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-navigation">
        {navigation.map((group) => (
          <section className="admin-nav-group" key={group.title}>
            <p className="admin-nav-heading">{group.title}</p>

            <div className="admin-nav-items">
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/school/dashboard'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `admin-nav-link${isActive ? ' admin-nav-link-active' : ''}`
                    }
                  >
                    <Icon className="admin-nav-icon" size={18} />
                    <span className="admin-nav-label">{item.name}</span>
                    <ChevronRight
                      className="admin-nav-chevron"
                      size={15}
                    />
                  </NavLink>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="admin-sidebar-bottom">
        <a
          className="admin-help-card"
          href="mailto:support@umunaralink.example"
        >
          <span className="admin-help-icon">
            <LifeBuoy size={18} />
          </span>

          <span className="admin-help-text">
            <strong>Need assistance?</strong>
            <span>Contact the Umunaralink support team.</span>
          </span>

          <ChevronRight size={16} className="admin-help-arrow" />
        </a>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>

        <div className="admin-account">
          <div className="admin-account-avatar">
            <ShieldCheck size={19} />
          </div>

          <div className="admin-account-details">
            <strong>{me.name}</strong>
            <span>Platform administrator</span>
          </div>

          <button
            type="button"
            className="admin-account-menu"
            aria-label="Open admin profile"
            title="Admin profile"
            onClick={() => { navigate('/admin/profile'); onNavigate?.() }}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}
