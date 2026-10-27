import {
  Users,
  BriefcaseBusiness,
  FileText,
  CircleCheck,
  CalendarDays,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Building2,
  GraduationCap,
  ClipboardList,
  CalendarCheck,
  CircleAlert,
  Plus,
  ChartNoAxesCombined,
  UserCog,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import './SchoolDashboard.css'

const stats = [
  {
    label: 'Total students',
    value: '1,248',
    detail: 'Registered students',
    trend: '+8.2%',
    tone: 'blue',
    icon: Users,
  },
  {
    label: 'Seeking internships',
    value: '186',
    detail: 'Students need placement',
    trend: '+12',
    tone: 'purple',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Active applications',
    value: '94',
    detail: 'Awaiting a decision',
    trend: '23 pending',
    tone: 'orange',
    icon: FileText,
  },
  {
    label: 'Confirmed placements',
    value: '142',
    detail: 'Students placed',
    trend: '76.3%',
    tone: 'green',
    icon: CircleCheck,
  },
]

const applications = [
  {
    initials: 'EN',
    student: 'Eric Niyonzima',
    trade: 'Software Development',
    company: 'Kigali Digital Labs',
    date: 'Oct 24, 2026',
    status: 'Under review',
    tone: 'review',
  },
  {
    initials: 'AK',
    student: 'Alice Kayitesi',
    trade: 'Networking & Internet Technology',
    company: 'TechVision Rwanda',
    date: 'Oct 23, 2026',
    status: 'Shortlisted',
    tone: 'shortlisted',
  },
  {
    initials: 'PN',
    student: 'Patrick Niyonzima',
    trade: 'Computer Systems & Architecture',
    company: 'Rwanda Systems Ltd',
    date: 'Oct 22, 2026',
    status: 'Pending',
    tone: 'pending',
  },
  {
    initials: 'UM',
    student: 'Uwase Marie',
    trade: 'Software Development',
    company: 'Digital Solutions',
    date: 'Oct 21, 2026',
    status: 'Placed',
    tone: 'placed',
  },
]

const placementStages = [
  { label: 'Seeking placement', value: 186, percent: 100, tone: 'purple' },
  { label: 'Applications submitted', value: 94, percent: 51, tone: 'blue' },
  { label: 'Shortlisted', value: 58, percent: 31, tone: 'orange' },
  { label: 'Confirmed placements', value: 142, percent: 76, tone: 'green' },
]

const tasks = [
  {
    icon: CalendarCheck,
    title: 'Review internship applications',
    detail: '23 applications awaiting a decision',
    tag: 'Action needed',
    tone: 'orange',
    path: '/school/internships',
  },
  {
    icon: ClipboardList,
    title: 'Update student records',
    detail: 'Check student internship readiness',
    tag: 'Student records',
    tone: 'blue',
    path: '/school/students',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Prepare placement report',
    detail: 'Review your school placement progress',
    tag: 'Reports',
    tone: 'purple',
    path: '/school/reports',
  },
]

function SectionHeading({ title, description, action }) {
  return (
    <div className="school-section-heading">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

function SchoolDashboard() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="school-dashboard">
      <header className="school-page-header">
        <div className="school-page-heading">
          <span className="school-eyebrow">
            <GraduationCap size={14} />
            SCHOOL MANAGEMENT
          </span>
          <h1>School dashboard</h1>
          <p>
            Monitor student internships, applications, and placement progress.
          </p>
        </div>

        <div className="school-page-actions">
          <span className="school-current-date">
            <CalendarDays size={15} />
            {today}
          </span>
          <Link to="/school/reports" className="school-primary-button">
            <FileText size={16} />
            View reports
          </Link>
        </div>
      </header>

      <section className="school-welcome-banner">
        <div className="school-welcome-copy">
          <span className="school-banner-eyebrow">YOUR SCHOOL WORKSPACE</span>
          <h2>Every student deserves an opportunity.</h2>
          <p>
            Track your students from internship applications to confirmed
            placements, all in one place.
          </p>
          <Link to="/school/students" className="school-banner-link">
            Manage students <ArrowRight size={17} />
          </Link>
        </div>

        <div className="school-banner-illustration" aria-hidden="true">
          <div className="school-orbit school-orbit-one" />
          <div className="school-orbit school-orbit-two" />
          <div className="school-graduation-icon">
            <GraduationCap size={54} strokeWidth={1.4} />
          </div>
          <div className="school-floating-label school-floating-top">
            <CircleCheck size={15} />
            Placement confirmed
          </div>
          <div className="school-floating-label school-floating-bottom">
            <Users size={15} />
            Student success
          </div>
        </div>
      </section>

      <section className="school-stats-grid" aria-label="School statistics">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="school-stat-card" key={stat.label}>
              <div className="school-stat-top">
                <span className={`school-stat-icon ${stat.tone}`}>
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className={`school-stat-badge ${stat.tone}`}>
                  {stat.trend}
                  {stat.tone !== 'orange' && (
                    <ArrowUpRight size={13} />
                  )}
                </span>
              </div>

              <p className="school-stat-label">{stat.label}</p>
              <strong className="school-stat-value">{stat.value}</strong>
              <span className="school-stat-detail">{stat.detail}</span>
            </article>
          )
        })}
      </section>

      <div className="school-dashboard-main-grid">
        <section className="school-panel school-applications-panel">
          <SectionHeading
            title="Recent applications"
            description="The latest student internship applications"
            action={
              <Link to="/school/internships" className="school-text-link">
                View all <ArrowRight size={15} />
              </Link>
            }
          />

          <div className="school-table-wrapper">
            <table className="school-applications-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>COMPANY</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.initials}>
                    <td>
                      <div className="school-student-cell">
                        <span className="school-student-avatar">
                          {application.initials}
                        </span>
                        <span className="school-student-info">
                          <strong>{application.student}</strong>
                          <span>{application.trade}</span>
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="school-company-cell">
                        <Building2 size={15} />
                        {application.company}
                      </span>
                    </td>

                    <td className="school-application-date">
                      {application.date}
                    </td>

                    <td>
                      <span
                        className={`school-status-badge ${application.tone}`}
                      >
                        <span />
                        {application.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="school-panel-footer">
            <span>Showing {applications.length} recent applications</span>
            <Link to="/school/internships">
              All applications <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <section className="school-panel school-placement-panel">
          <SectionHeading
            title="Placement progress"
            description="Student internship pipeline"
            action={
              <span className="school-placement-heading-icon">
                <BriefcaseBusiness size={18} />
              </span>
            }
          />

          <div className="school-placement-summary">
            <strong>186</strong>
            <span>students seeking placement</span>
          </div>

          <div className="school-progress-list">
            {placementStages.map((stage) => (
              <div className="school-progress-item" key={stage.label}>
                <div className="school-progress-meta">
                  <span>{stage.label}</span>
                  <strong>{stage.value}</strong>
                </div>
                <div
                  className="school-progress-track"
                  role="img"
                  aria-label={`${stage.label}: ${stage.percent}%`}
                >
                  <span
                    className={`school-progress-fill ${stage.tone}`}
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link to="/school/reports" className="school-placement-link">
            View placement report <ArrowRight size={15} />
          </Link>
        </section>
      </div>

      <div className="school-dashboard-bottom-grid">
        <section className="school-panel school-tasks-panel">
          <SectionHeading
            title="Upcoming tasks"
            description="Things that may need your attention"
            action={
              <span className="school-tasks-count">
                <CircleAlert size={14} />
                3 tasks
              </span>
            }
          />

          <div className="school-task-list">
            {tasks.map((task) => {
              const Icon = task.icon

              return (
                <Link
                  to={task.path}
                  className="school-task-item"
                  key={task.title}
                >
                  <span className={`school-task-icon ${task.tone}`}>
                    <Icon size={18} />
                  </span>

                  <span className="school-task-copy">
                    <strong>{task.title}</strong>
                    <span>{task.detail}</span>
                  </span>

                  <ArrowRight
                    className="school-task-arrow"
                    size={17}
                  />
                </Link>
              )
            })}
          </div>
        </section>

        <section className="school-panel school-quick-actions-panel">
          <SectionHeading
            title="Quick actions"
            description="Common school management tasks"
          />

          <div className="school-quick-actions">
            <Link to="/school/students" className="school-quick-action">
              <span className="school-quick-action-icon">
                <Users size={18} />
              </span>
              <span>
                <strong>Manage students</strong>
                <small>Review student records</small>
              </span>
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/school/staff" className="school-quick-action">
              <span className="school-quick-action-icon">
                <UserCog size={18} />
              </span>
              <span>
                <strong>Manage school staff</strong>
                <small>View staff and responsibilities</small>
              </span>
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/school/settings" className="school-quick-action">
              <span className="school-quick-action-icon">
                <Plus size={18} />
              </span>
              <span>
                <strong>School settings</strong>
                <small>Manage school preferences</small>
              </span>
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </div>

      <div className="school-dashboard-note">
        <Clock3 size={14} />
        Dashboard figures and application records are sample data. Connect
        your API to display live school information.
      </div>
    </div>
  )
}

export default SchoolDashboard
