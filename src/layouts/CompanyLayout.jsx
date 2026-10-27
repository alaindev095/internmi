
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/nav'
import CompanySidebar from '../components/CompanySidebar'
import './CompanyLayout.css'

export default function CompanyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarOpen((open) => !open)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="company-layout">
      <Nav
        onMenuClick={toggleSidebar}
        menuOpen={sidebarOpen}
      />

      <div className="company-layout-body">
        <CompanySidebar
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="company-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
