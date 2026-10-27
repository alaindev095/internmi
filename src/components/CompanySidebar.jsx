
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  ChartNoAxesCombined,
  Building2,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import "./CompanySidebar.css";

const menuItems = [
  {
    label: "Overview",
    path: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Internship posts",
    path: "/company/internships",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    path: "/company/applications",
    icon: Users,
  },
  {
    label: "Analytics",
    path: "/company/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Company profile",
    path: "/company/profile",
    icon: Building2,
  },
];

export default function CompanySidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          className="company-sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`company-sidebar ${open ? "is-open" : ""}`}
        aria-label="Company navigation"
      >
        <button
          className="company-sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={19} />
        </button>

        <div className="company-sidebar-label">WORKSPACE</div>

        <nav className="company-sidebar-nav">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/company/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `company-sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="company-sidebar-bottom">
          <div className="company-sidebar-label">PREFERENCES</div>

          <NavLink
            to="/company/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `company-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </NavLink>

          <button
            type="button"
            className="company-sidebar-link company-logout"
            onClick={() => {
              alert("Connect this button to your logout function.");
            }}
          >
            <LogOut size={19} strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
