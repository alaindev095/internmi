import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Megaphone,
  School,
  UserPlus,
  Users,
  GraduationCap,
  ChevronRight,
} from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { Badge, PageHeader, StatCard, formatDate, formatDateTime } from './ui'
import './AdminPages.css'

// Monthly placements are illustrative until the placements API exists.
const placementTrend = [
  { m: 'May', v: 38 }, { m: 'Jun', v: 54 }, { m: 'Jul', v: 61 },
  { m: 'Aug', v: 83 }, { m: 'Sep', v: 112 }, { m: 'Oct', v: 134 },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { schools, companies, internships, users, audit } = useAdminData()

  const s = useMemo(() => {
    const students = schools.reduce((n, x) => n + x.students, 0)
    const placed = schools.reduce((n, x) => n + x.placed, 0)
    return {
      students,
      placed,
      rate: students ? Math.round((placed / students) * 100) : 0,
      activeSchools: schools.filter((x) => x.status === 'Active').length,
      pendingSchools: schools.filter((x) => x.status === 'Pending activation'),
      pendingCompanies: companies.filter((x) => x.status === 'Pending verification'),
      pendingInternships: internships.filter((x) => x.status === 'Pending review'),
      flagged: internships.filter((x) => x.status === 'Flagged'),
      openInternships: internships.filter((x) => x.status === 'Open').length,
      neverSignedIn: users.filter((x) => x.status === 'Pending activation').length,
    }
  }, [schools, companies, internships, users])

  const todo = [
    { label: 'Schools awaiting activation', count: s.pendingSchools.length, to: '/admin/schools', icon: School },
    { label: 'Companies awaiting verification', count: s.pendingCompanies.length, to: '/admin/companies', icon: Building2 },
    { label: 'Internships awaiting review', count: s.pendingInternships.length, to: '/admin/internships', icon: Briefcase },
    { label: 'Flagged internships', count: s.flagged.length, to: '/admin/internships', icon: AlertTriangle },
    { label: 'Accounts not yet activated', count: s.neverSignedIn, to: '/admin/users', icon: Users },
  ].filter((t) => t.count > 0)

  const maxTrend = Math.max(...placementTrend.map((p) => p.v))
  const topSchools = [...schools].filter((x) => x.students > 0)
    .sort((a, b) => b.placed / b.students - a.placed / a.students).slice(0, 5)

  return (
    <div className="adm-page">
      <PageHeader
        title="Admin overview"
        description="Onboard schools, oversee companies and internships, and keep the platform healthy."
      >
        <button type="button" className="adm-btn" onClick={() => navigate('/admin/announcements')}>
          <Megaphone size={15} /> New announcement
        </button>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => navigate('/admin/schools?new=1')}>
          <UserPlus size={15} /> Onboard school
        </button>
      </PageHeader>

      <section className="adm-stats">
        <StatCard icon={School} label="Schools" value={schools.length}
          hint={`${s.activeSchools} active`} tone="accent" />
        <StatCard icon={GraduationCap} label="Students on platform" value={s.students.toLocaleString()}
          hint="Created by schools" />
        <StatCard icon={Building2} label="Companies" value={companies.length}
          hint={`${s.pendingCompanies.length} pending verification`} />
        <StatCard icon={Briefcase} label="Open internships" value={s.openInternships}
          hint={`${s.pendingInternships.length} awaiting review`} />
        <StatCard icon={Users} label="Placement rate" value={`${s.rate}%`}
          hint={`${s.placed} students placed`} tone="success" />
      </section>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h2>Placements over time</h2>
              <p>Students placed per month, all schools</p>
            </div>
          </div>
          <div className="adm-columns" role="img" aria-label="Placements per month">
            {placementTrend.map((p) => (
              <div className="adm-column" key={p.m}>
                <b>{p.v}</b>
                <div style={{ height: `${(p.v / maxTrend) * 100}%` }} />
                <span>{p.m}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Needs your attention</h2>
          </div>
          {todo.length === 0 ? (
            <p className="adm-muted">Nothing pending. You&apos;re all caught up.</p>
          ) : (
            <ul className="adm-list">
              {todo.map((t) => {
                const Icon = t.icon
                return (
                  <li key={t.label}>
                    <button type="button" className="adm-list-link" onClick={() => navigate(t.to)}>
                      <span className="adm-stat-icon" style={{ margin: 0 }}><Icon size={16} /></span>
                      <span>{t.label}</span>
                    </button>
                    <Badge tone="warn">{t.count}</Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Recently onboarded schools</h2>
            <button type="button" className="adm-btn adm-btn-sm" onClick={() => navigate('/admin/schools')}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>School</th><th>District</th><th>Status</th><th>Onboarded</th></tr>
              </thead>
              <tbody>
                {[...schools].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((x) => (
                  <tr key={x.id}>
                    <td>
                      <button type="button" className="adm-link" onClick={() => navigate(`/admin/schools/${x.id}`)}>{x.name}</button>
                      <small>{x.code}</small>
                    </td>
                    <td>{x.district}</td>
                    <td><Badge>{x.status}</Badge></td>
                    <td>{formatDate(x.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head"><h2>Top schools by placement rate</h2></div>
          {topSchools.map((x) => {
            const pct = Math.round((x.placed / x.students) * 100)
            return (
              <div className="adm-bar-row" key={x.id}>
                <div className="adm-bar-label"><strong>{x.name}</strong><span>{pct}%</span></div>
                <div className="adm-bar-track is-accent"><div style={{ width: `${pct}%` }} /></div>
              </div>
            )
          })}
        </section>
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Recent activity</h2>
          <button type="button" className="adm-btn adm-btn-sm" onClick={() => navigate('/admin/audit')}>
            Full audit log <ChevronRight size={14} />
          </button>
        </div>
        <ul className="adm-list">
          {audit.slice(0, 6).map((a) => (
            <li key={a.id}>
              <span>
                <strong>{a.action}</strong> · {a.target}
                <small>by {a.actor}</small>
              </span>
              <small>{formatDateTime(a.at)}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
