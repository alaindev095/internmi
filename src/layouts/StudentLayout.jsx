import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  House,
  Building2,
  BriefcaseBusiness,
  FileText,
  UserRound
} from 'lucide-react'
import Nav from '../components/nav'
import Sidebar from '../components/sidebar'
import './StudentLayout.css'

const mobileLinks = [
  { label: 'Home', to: '/student/dashboard', Icon: House },
  { label: 'Companies', to: '/student/companies', Icon: Building2 },
  { label: 'Internships', to: '/student/internships', Icon: BriefcaseBusiness },
  { label: 'Applications', to: '/student/applications', Icon: FileText },
  { label: 'Profile', to: '/student/profile', Icon: UserRound }
]

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="student-layout">
      <Nav
        onMenuClick={() => setSidebarOpen((open) => !open)}
        menuOpen={sidebarOpen}
      />

      <nav className="mobile-navigation" aria-label="Student navigation">
        {mobileLinks.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={label === 'Home'}
            className={({ isActive }) =>
              `mobile-navigation-link${isActive ? ' active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="student-layout-body">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        <main className="student-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StudentLayout
