
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Users,
  Clock3,
  UserCheck,
  CheckCircle2,
  Eye,
  ChevronDown,
} from 'lucide-react'
import './CompanyApplications.css'

const initialApplications = [
  {
    id: 1,
    name: 'Jean Mugisha',
    initials: 'JM',
    internship: 'Frontend Developer Intern',
    trade: 'Software Development',
    school: 'IPRC Kigali',
    applied: '2026-10-24',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Alice Kayitesi',
    initials: 'AK',
    internship: 'Network Support Intern',
    trade: 'Networking & Internet Technology',
    school: 'IPRC Huye',
    applied: '2026-10-23',
    status: 'Shortlisted',
  },
  {
    id: 3,
    name: 'Patrick Niyonzima',
    initials: 'PN',
    internship: 'IT Support Intern',
    trade: 'Information Technology',
    school: 'Tumba College',
    applied: '2026-10-22',
    status: 'Reviewing',
  },
  {
    id: 4,
    name: 'Uwase Marie',
    initials: 'UM',
    internship: 'Frontend Developer Intern',
    trade: 'Software Development',
    school: 'IPRC Kigali',
    applied: '2026-10-21',
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Eric Habimana',
    initials: 'EH',
    internship: 'Database Intern',
    trade: 'Computer Systems & Architecture',
    school: 'IPRC Musanze',
    applied: '2026-10-20',
    status: 'Accepted',
  },
]

const statuses = [
  'Pending',
  'Reviewing',
  'Shortlisted',
  'Accepted',
  'Rejected',
]

export default function CompanyApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState(initialApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesSearch = [
        application.name,
        application.internship,
        application.trade,
        application.school,
      ].some((value) => value.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === 'All' ||
        application.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, search, statusFilter])

  const stats = [
    {
      label: 'Total applications',
      value: applications.length,
      icon: Users,
    },
    {
      label: 'Pending review',
      value: applications.filter((a) => a.status === 'Pending').length,
      icon: Clock3,
    },
    {
      label: 'Shortlisted',
      value: applications.filter((a) => a.status === 'Shortlisted').length,
      icon: UserCheck,
    },
    {
      label: 'Accepted',
      value: applications.filter((a) => a.status === 'Accepted').length,
      icon: CheckCircle2,
    },
  ]

  function updateStatus(id, status) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? { ...application, status }
          : application
      )
    )
  }

  return (
    <section className="company-applications-page">
      <header className="company-page-heading">
        <div>
          <span className="company-eyebrow">COMPANY WORKSPACE</span>
          <h1>Applications</h1>
          <p>Review candidates and manage your recruitment process.</p>
        </div>
      </header>

      <div className="company-application-stats">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="company-application-stat" key={label}>
            <div className="company-stat-top">
              <span>{label}</span>
              <Icon size={19} />
            </div>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="company-applications-toolbar">
        <label className="company-applications-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search candidates, internships, or schools..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className="company-applications-filter">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="company-applications-panel">
        <div className="company-applications-panel-heading">
          <div>
            <h2>Candidate applications</h2>
            <p>
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
        </div>

        {filteredApplications.length > 0 ? (
          <div className="company-applications-list">
            {filteredApplications.map((application) => (
              <article
                className="company-application-row"
                key={application.id}
              >
                <div className="company-candidate-avatar">
                  {application.initials}
                </div>

                <div className="company-candidate-info">
                  <h3>{application.name}</h3>
                  <p>{application.internship}</p>
                  <span>{application.trade}</span>
                  <small>
                    {application.school} · Applied {application.applied}
                  </small>
                </div>

                <div className="company-candidate-actions">
                  <span
                    className={`company-application-status status-${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>

                  <label className="company-status-select">
                    <span className="sr-only">
                      Update status for {application.name}
                    </span>
                    <select
                      value={application.status}
                      onChange={(event) =>
                        updateStatus(application.id, event.target.value)
                      }
                      aria-label={`Application status for ${application.name}`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </label>

                  <button
                    type="button"
                    className="company-view-application"
                    onClick={() =>
                      navigate(`/company/applications/${application.id}`)
                    }
                    aria-label={`View application from ${application.name}`}
                    title="View application"
                  >
                    <Eye size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="company-applications-empty">
            <Users size={30} />
            <h3>No applications found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </div>
    </section>
  )
}
