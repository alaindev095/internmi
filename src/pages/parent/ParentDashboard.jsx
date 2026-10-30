
import {
  GraduationCap,
  BriefcaseBusiness,
  FileCheck2,
  Clock3,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './ParentDashboard.css'

const summaryCards = [
  {
    label: 'Student',
    value: 'Your student',
    detail: 'Linked student profile',
    icon: GraduationCap
  },
  {
    label: 'Applications',
    value: '0',
    detail: 'Applications submitted',
    icon: FileCheck2
  },
  {
    label: 'Internship status',
    value: 'Not placed',
    detail: 'Current placement status',
    icon: BriefcaseBusiness
  },
  {
    label: 'Pending updates',
    value: '0',
    detail: 'Updates to review',
    icon: Clock3
  }
]

export default function ParentDashboard() {
  return (
    <div className="parent-dashboard">
      <header className="parent-dashboard-header">
        <div>
          <p className="parent-eyebrow">PARENT PORTAL</p>
          <h1>Welcome back</h1>
          <p className="parent-subtitle">
            Keep track of your student's internship journey.
          </p>
        </div>
      </header>

      <section className="parent-summary-grid" aria-label="Student overview">
        {summaryCards.map(({ label, value, detail, icon: Icon }) => (
          <article className="parent-summary-card" key={label}>
            <div className="parent-summary-top">
              <span>{label}</span>
              <span className="parent-summary-icon">
                <Icon size={19} />
              </span>
            </div>
            <h2>{value}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="parent-dashboard-section">
        <div className="parent-section-heading">
          <div>
            <h2>Student overview</h2>
            <p>Information about your linked student will appear here.</p>
          </div>
          <GraduationCap size={22} />
        </div>

        <div className="parent-empty-state">
          <div className="parent-empty-icon">
            <GraduationCap size={27} />
          </div>
          <h3>No student information yet</h3>
          <p>
            Once your student account is linked, you can view their profile,
            applications, and internship progress here.
          </p>
          <Link to="/parent/student" className="parent-primary-link">
            View student page <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="parent-dashboard-section">
        <div className="parent-section-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Recent application and internship updates.</p>
          </div>
        </div>

        <div className="parent-activity-empty">
          No recent activity to display.
        </div>
      </section>
    </div>
  )
}
