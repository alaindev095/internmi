
import { useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  Search,
  Download,
  Eye,
  MapPin,
  CalendarDays,
  Users,
  CircleCheck,
  Clock3,
  XCircle,
  Building2,
  X,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react'

import './SchoolInternships.css'

const demoInternships = [
  {
    id: 'INT001',
    title: 'Junior Software Developer',
    company: 'Kigali Digital Labs',
    trade: 'Software Development',
    location: 'Kigali',
    positions: 8,
    applications: 24,
    deadline: '2026-11-15',
    status: 'Open',
    description:
      'Students will assist with developing, testing, and maintaining web applications under the supervision of experienced developers.',
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Understanding of Git and collaborative development',
      'Willingness to learn and work in a team',
    ],
  },
  {
    id: 'INT002',
    title: 'IT Support Intern',
    company: 'TechVision Rwanda',
    trade: 'Computer Systems',
    location: 'Kigali',
    positions: 5,
    applications: 16,
    deadline: '2026-11-20',
    status: 'Open',
    description:
      'Support IT operations, troubleshoot computer problems, and assist with maintaining school and office computer systems.',
    requirements: [
      'Basic computer troubleshooting skills',
      'Understanding of operating systems',
      'Good communication skills',
    ],
  },
  {
    id: 'INT003',
    title: 'Network Support Intern',
    company: 'Connect Rwanda',
    trade: 'Networking',
    location: 'Huye',
    positions: 0,
    applications: 12,
    deadline: '2026-10-20',
    status: 'Closed',
    description:
      'Assist network engineers with connectivity troubleshooting, network monitoring, and equipment installation.',
    requirements: [
      'Basic networking concepts',
      'Understanding of IP addressing',
      'Interest in network infrastructure',
    ],
  },
  {
    id: 'INT004',
    title: 'Database Assistant',
    company: 'Insight Systems',
    trade: 'Software Development',
    location: 'Kigali',
    positions: 3,
    applications: 9,
    deadline: '2026-11-30',
    status: 'Open',
    description:
      'Assist with database maintenance, data validation, SQL queries, and documentation.',
    requirements: [
      'Basic SQL knowledge',
      'Understanding of relational databases',
      'Attention to detail',
    ],
  },
  {
    id: 'INT005',
    title: 'Computer Maintenance Trainee',
    company: 'Digital Care Ltd',
    trade: 'Computer Systems',
    location: 'Musanze',
    positions: 4,
    applications: 7,
    deadline: '2026-12-05',
    status: 'Open',
    description:
      'Learn how to diagnose hardware faults, perform routine maintenance, and support computer users.',
    requirements: [
      'Basic hardware knowledge',
      'Interest in computer repair',
      'Ability to follow technical instructions',
    ],
  },
  {
    id: 'INT006',
    title: 'Network Technician',
    company: 'Kivu Technology',
    trade: 'Networking',
    location: 'Rubavu',
    positions: 0,
    applications: 18,
    deadline: '2026-10-18',
    status: 'Closed',
    description:
      'Assist technicians with network installations, cable management, and connectivity testing.',
    requirements: [
      'Basic networking knowledge',
      'Ability to work with technical equipment',
      'Good problem-solving skills',
    ],
  },
]

const statusOptions = ['All statuses', 'Open', 'Closed']
const tradeOptions = [
  'All trades',
  'Software Development',
  'Networking',
  'Computer Systems',
]

function formatDate(dateString) {
  if (!dateString) return 'Not specified'

  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getDeadlineState(deadline, status) {
  if (status === 'Closed') return 'closed'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadlineDate = new Date(`${deadline}T00:00:00`)

  if (Number.isNaN(deadlineDate.getTime())) return 'normal'
  if (deadlineDate < today) return 'expired'

  const remainingDays = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / 86400000,
  )

  return remainingDays <= 7 ? 'soon' : 'normal'
}

function getStatusClass(status) {
  return status === 'Open' ? 'is-open' : 'is-closed'
}

export default function SchoolInternships() {
  const [internships, setInternships] = useState(demoInternships)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [tradeFilter, setTradeFilter] = useState('All trades')
  const [selectedInternship, setSelectedInternship] = useState(null)

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase()

    return internships.filter((internship) => {
      const matchesSearch = [
        internship.id,
        internship.title,
        internship.company,
        internship.trade,
        internship.location,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)

      const matchesStatus =
        statusFilter === 'All statuses' ||
        internship.status === statusFilter

      const matchesTrade =
        tradeFilter === 'All trades' ||
        internship.trade === tradeFilter

      return matchesSearch && matchesStatus && matchesTrade
    })
  }, [internships, search, statusFilter, tradeFilter])

  const statistics = useMemo(() => {
    const open = internships.filter(
      (internship) => internship.status === 'Open',
    )
    const closed = internships.filter(
      (internship) => internship.status === 'Closed',
    )

    return {
      total: internships.length,
      open: open.length,
      positions: open.reduce(
        (total, internship) => total + internship.positions,
        0,
      ),
      applications: internships.reduce(
        (total, internship) => total + internship.applications,
        0,
      ),
      closed: closed.length,
    }
  }, [internships])

  function exportCSV() {
    const headers = [
      'ID',
      'Internship title',
      'Company',
      'Trade',
      'Location',
      'Available positions',
      'Applications',
      'Deadline',
      'Status',
    ]

    const rows = filteredInternships.map((internship) => [
      internship.id,
      internship.title,
      internship.company,
      internship.trade,
      internship.location,
      internship.positions,
      internship.applications,
      internship.deadline,
      internship.status,
    ])

    const escapeCSV = (value) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\r\n')

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'internmi-school-internships.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function toggleStatus(internshipId) {
    setInternships((current) =>
      current.map((internship) => {
        if (internship.id !== internshipId) return internship

        const nextStatus =
          internship.status === 'Open' ? 'Closed' : 'Open'

        return {
          ...internship,
          status: nextStatus,
          positions:
            nextStatus === 'Closed' ? 0 : internship.positions || 1,
        }
      }),
    )

    setSelectedInternship((current) => {
      if (!current || current.id !== internshipId) return current

      const nextStatus = current.status === 'Open' ? 'Closed' : 'Open'

      return {
        ...current,
        status: nextStatus,
        positions:
          nextStatus === 'Closed' ? 0 : current.positions || 1,
      }
    })
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('All statuses')
    setTradeFilter('All trades')
  }

  return (
    <div className="school-internships">
      <header className="school-internships-header">
        <div className="school-internships-heading">
          <div className="school-internships-eyebrow">
            <BriefcaseBusiness size={13} />
            SCHOOL MANAGEMENT
          </div>

          <h1>Internships</h1>

          <p>
            Monitor company opportunities, available positions, and
            internship deadlines.
          </p>
        </div>

        <button
          type="button"
          className="school-internships-export"
          onClick={exportCSV}
        >
          <Download size={16} />
          Export CSV
        </button>
      </header>

      <div className="school-internships-demo-notice">
        <span className="school-internships-demo-dot" />
        <span>
          Demonstration data — these internships are examples, not live
          opportunities from partner companies.
        </span>
      </div>

      <section
        className="school-internships-stats"
        aria-label="Internship statistics"
      >
        <article className="school-internships-stat-card">
          <div className="school-internships-stat-top">
            <span className="school-internships-stat-icon blue">
              <BriefcaseBusiness size={18} />
            </span>
          </div>
          <p>Total internships</p>
          <strong>{statistics.total}</strong>
          <span className="school-internships-stat-detail">
            Listed opportunities
          </span>
        </article>

        <article className="school-internships-stat-card">
          <div className="school-internships-stat-top">
            <span className="school-internships-stat-icon green">
              <CircleCheck size={18} />
            </span>
          </div>
          <p>Open internships</p>
          <strong>
            {internships.filter((item) => item.status === 'Open').length}
          </strong>
          <span className="school-internships-stat-detail">
            Currently accepting applications
          </span>
        </article>

        <article className="school-internships-stat-card">
          <div className="school-internships-stat-top">
            <span className="school-internships-stat-icon purple">
              <Users size={18} />
            </span>
          </div>
          <p>Available positions</p>
          <strong>{statistics.positions}</strong>
          <span className="school-internships-stat-detail">
            Across open internships
          </span>
        </article>

        <article className="school-internships-stat-card">
          <div className="school-internships-stat-top">
            <span className="school-internships-stat-icon orange">
              <Clock3 size={18} />
            </span>
          </div>
          <p>Total applications</p>
          <strong>{statistics.applications}</strong>
          <span className="school-internships-stat-detail">
            Recorded in sample data
          </span>
        </article>
      </section>

      <section className="school-internships-panel">
        <div className="school-internships-panel-heading">
          <div>
            <h2>Internship directory</h2>
            <p>
              Browse opportunities available to students at your school.
            </p>
          </div>

          <span className="school-internships-record-count">
            {filteredInternships.length}{' '}
            {filteredInternships.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        <div className="school-internships-toolbar">
          <label className="school-internships-search">
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, company, trade..."
              aria-label="Search internships"
            />

            {search && (
              <button
                type="button"
                className="school-internships-clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <div className="school-internships-filters">
            <label className="school-internships-select-wrap">
              <SlidersHorizontal size={15} />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="school-internships-select-wrap">
              <select
                value={tradeFilter}
                onChange={(event) => setTradeFilter(event.target.value)}
                aria-label="Filter by trade"
              >
                {tradeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {(search ||
          statusFilter !== 'All statuses' ||
          tradeFilter !== 'All trades') && (
          <div className="school-internships-active-filters">
            <span>
              Showing {filteredInternships.length} of {internships.length}{' '}
              internships
            </span>

            <button type="button" onClick={clearFilters}>
              <X size={13} />
              Clear filters
            </button>
          </div>
        )}

        <div className="school-internships-table-wrap">
          <table className="school-internships-table">
            <thead>
              <tr>
                <th>INTERNSHIP</th>
                <th>COMPANY</th>
                <th>AVAILABLE</th>
                <th>DEADLINE</th>
                <th>STATUS</th>
                <th className="school-internships-action-heading">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInternships.map((internship) => {
                const deadlineState = getDeadlineState(
                  internship.deadline,
                  internship.status,
                )

                return (
                  <tr key={internship.id}>
                    <td>
                      <div className="school-internships-title-cell">
                        <span className="school-internships-company-avatar">
                          {getInitials(internship.company)}
                        </span>

                        <div className="school-internships-title-info">
                          <strong>{internship.title}</strong>
                          <small>
                            {internship.id} · {internship.trade}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="school-internships-company-cell">
                        <Building2 size={14} />
                        <span>{internship.company}</span>
                      </div>
                      <div className="school-internships-location">
                        <MapPin size={11} />
                        {internship.location}
                      </div>
                    </td>

                    <td>
                      <div className="school-internships-position-count">
                        <strong>{internship.positions}</strong>
                        <span>positions</span>
                      </div>
                    </td>

                    <td>
                      <div
                        className={`school-internships-deadline ${deadlineState}`}
                      >
                        <CalendarDays size={13} />
                        <span>{formatDate(internship.deadline)}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`school-internships-status ${getStatusClass(
                          internship.status,
                        )}`}
                      >
                        <span />
                        {internship.status}
                      </span>
                    </td>

                    <td className="school-internships-action-cell">
                      <button
                        type="button"
                        className="school-internships-view-button"
                        onClick={() => setSelectedInternship(internship)}
                        aria-label={`View ${internship.title}`}
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredInternships.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="school-internships-empty">
                      <Search size={25} />
                      <strong>No internships found</strong>
                      <p>
                        Try a different search term or remove some filters.
                      </p>
                      <button type="button" onClick={clearFilters}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="school-internships-panel-footer">
          <span>
            Showing {filteredInternships.length} of {internships.length}{' '}
            demonstration records
          </span>
          <span>Internmi · School workspace</span>
        </footer>
      </section>

      {selectedInternship && (
        <div
          className="school-internships-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInternship(null)
            }
          }}
        >
          <section
            className="school-internships-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="school-internship-modal-title"
          >
            <header className="school-internships-modal-header">
              <div>
                <div className="school-internships-eyebrow">
                  INTERNSHIP DETAILS
                </div>
                <h2 id="school-internship-modal-title">
                  {selectedInternship.title}
                </h2>
              </div>

              <button
                type="button"
                className="school-internships-modal-close"
                onClick={() => setSelectedInternship(null)}
                aria-label="Close internship details"
              >
                <X size={18} />
              </button>
            </header>

            <div className="school-internships-modal-company">
              <span className="school-internships-company-avatar large">
                {getInitials(selectedInternship.company)}
              </span>

              <div>
                <strong>{selectedInternship.company}</strong>
                <p>{selectedInternship.id}</p>
              </div>

              <span
                className={`school-internships-status ${getStatusClass(
                  selectedInternship.status,
                )}`}
              >
                <span />
                {selectedInternship.status}
              </span>
            </div>

            <p className="school-internships-description">
              {selectedInternship.description}
            </p>

            <div className="school-internships-detail-grid">
              <div>
                <span>
                  <BriefcaseBusiness size={14} /> Trade
                </span>
                <strong>{selectedInternship.trade}</strong>
              </div>

              <div>
                <span>
                  <MapPin size={14} /> Location
                </span>
                <strong>{selectedInternship.location}</strong>
              </div>

              <div>
                <span>
                  <Users size={14} /> Available positions
                </span>
                <strong>{selectedInternship.positions}</strong>
              </div>

              <div>
                <span>
                  <CalendarDays size={14} /> Deadline
                </span>
                <strong>
                  {formatDate(selectedInternship.deadline)}
                </strong>
              </div>

              <div>
                <span>
                  <ArrowUpRight size={14} /> Applications
                </span>
                <strong>{selectedInternship.applications}</strong>
              </div>
            </div>

            <div className="school-internships-requirements">
              <h3>Example requirements</h3>
              <ul>
                {selectedInternship.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="school-internships-modal-note">
              This is sample information for UI testing. It is not a verified
              company listing or an actual internship offer.
            </div>

            <div className="school-internships-modal-actions">
              <button
                type="button"
                className="school-internships-secondary-button"
                onClick={() => setSelectedInternship(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="school-internships-primary-button"
                onClick={() => toggleStatus(selectedInternship.id)}
              >
                {selectedInternship.status === 'Open'
                  ? 'Close internship'
                  : 'Reopen internship'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
