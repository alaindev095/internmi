import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Nav from '../components/nav'
import SchoolSidebar from '../components/SchoolSidebar'
import './SchoolLayout.css'

export default function SchoolLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="school-layout">
      <Nav
        onMenuClick={() => setSidebarOpen(open => !open)}
        menuOpen={sidebarOpen}
      />

      <div className="school-workspace">
        {sidebarOpen && (
          <button
            type="button"
            className="school-sidebar-overlay"
            aria-label="Close navigation"
            onClick={closeSidebar}
          />
        )}

        <div
          className={`school-sidebar-container ${
            sidebarOpen ? 'school-sidebar-container-open' : ''
          }`}
        >
          <SchoolSidebar onNavigate={closeSidebar} />
        </div>

        <div className="school-main">
          <main className="school-content">
            <Outlet />
          </main>

          <footer className="school-footer">
            <span>© {new Date().getFullYear()} Internmi</span>
            <span>Connecting students with internship opportunities.</span>
          </footer>
        </div>
      </div>
    </div>
  )
}