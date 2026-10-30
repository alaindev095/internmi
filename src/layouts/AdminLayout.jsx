import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Nav from '../components/nav'
import AdminSidebar from '../components/AdminSidebar'
import { AdminDataProvider } from '../context/AdminDataContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <AdminDataProvider>
    <div className="admin-layout">
      <Nav
        onMenuClick={() => setSidebarOpen(open => !open)}
        menuOpen={sidebarOpen}
      />

      <div className="admin-workspace">
        {sidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-overlay"
            aria-label="Close navigation"
            onClick={closeSidebar}
          />
        )}

        <div
          className={`admin-sidebar-container ${
            sidebarOpen ? 'admin-sidebar-container-open' : ''
          }`}
        >
          <AdminSidebar onNavigate={closeSidebar} />
        </div>

        <div className="admin-main">
          <main className="admin-content">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
    </AdminDataProvider>
  )
}
