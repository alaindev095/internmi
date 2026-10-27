
import { useMemo, useState } from 'react'
import {
  Search,
  Users,
  Download,
  Eye,
  X,
  GraduationCap,
  BriefcaseBusiness,
  Clock3,
  SlidersHorizontal,
  ChevronDown,
  UserRound,
  FileText,
  ArrowUpRight,
} from 'lucide-react'
import './SchoolStudents.css'

const demoStudents = [
  {
    id: 'ST001',
    name: 'Aline Uwase',
    trade: 'Software Development',
    status: 'Seeking internship',
    email: 'aline.uwase@example.com',
    applications: 2,
  },
  {
    id: 'ST002',
    name: 'Eric Niyonzima',
    trade: 'Networking',
    status: 'Placed',
    email: 'eric.niyonzima@example.com',
    applications: 3,
  },
  {
    id: 'ST003',
    name: 'Diane Mukamana',
    trade: 'Computer Systems',
    status: 'Seeking internship',
    email: 'diane.mukamana@example.com',
    applications: 1,
  },
  {
    id: 'ST004',
    name: 'Patrick Habimana',
    trade: 'Software Development',
    status: 'Application pending',
    email: 'patrick.habimana@example.com',
    applications: 2,
  },
  {
    id: 'ST005',
    name: 'Grace Ingabire',
    trade: 'Networking',
    status: 'Placed',
    email: 'grace.ingabire@example.com',
    applications: 4,
  },
]

const statusOptions = [
  'All statuses',
  'Seeking internship',
  'Application pending',
  'Placed',
]

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function statusClass(status) {
  if (status === 'Placed') return 'is-placed'
  if (status === 'Application pending') return 'is-pending'
  return 'is-seeking'
}

export default function SchoolStudents() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [tradeFilter, setTradeFilter] = useState('All trades')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const trades = useMemo(
    () => [...new Set(demoStudents.map((student) => student.trade))],
    [],
  )

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return demoStudents.filter((student) => {
      const matchesSearch = [
        student.name,
        student.id,
        student.trade,
        student.email,
      ].some((value) => value.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === 'All statuses' ||
        student.status === statusFilter

      const matchesTrade =
        tradeFilter === 'All trades' ||
        student.trade === tradeFilter

      return matchesSearch && matchesStatus && matchesTrade
    })
  }, [search, statusFilter, tradeFilter])

  const stats = useMemo(
    () => [
      {
        label: 'Total students',
        value: demoStudents.length.toLocaleString(),
        detail: 'Sample student records',
        icon: Users,
        color: 'blue',
      },
      {
        label: 'Seeking internship',
        value: demoStudents.filter(
          (student) => student.status === 'Seeking internship',
        ).length.toLocaleString(),
        detail: 'Need placement',
        icon: BriefcaseBusiness,
        color: 'purple',
      },
      {
        label: 'Applications pending',
        value: demoStudents.filter(
          (student) => student.status === 'Application pending',
        ).length.toLocaleString(),
        detail: 'Awaiting a decision',
        icon: Clock3,
        color: 'orange',
      },
      {
        label: 'Confirmed placements',
        value: demoStudents.filter(
          (student) => student.status === 'Placed',
        ).length.toLocaleString(),
        detail: 'Successfully placed',
        icon: GraduationCap,
        color: 'green',
      },
    ],
    [],
  )

  function exportStudents() {
    const headers = [
      'Student ID',
      'Name',
      'Trade',
      'Status',
      'Email',
      'Applications',
    ]

    const escapeCsv = (value) =>
      `"${String(value).replaceAll('"', '""')}"`

    const rows = filteredStudents.map((student) => [
      student.id,
      student.name,
      student.trade,
      student.status,
      student.email,
      student.applications,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n')

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'internmi-school-students.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('All statuses')
    setTradeFilter('All trades')
  }

  return (
    <section className="school-students">
      <header className="school-students-header">
        <div className="school-students-heading">
          <span className="school-students-eyebrow">
            <GraduationCap size={14} />
            SCHOOL MANAGEMENT
          </span>

          <h1>Students</h1>
          <p>
            Manage student records and monitor internship progress.
          </p>
        </div>

        <button
          type="button"
          className="school-students-export"
          onClick={exportStudents}
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </header>

      <div className="school-students-demo-notice">
        <span className="school-students-demo-dot" />
        <span>
          Demonstration mode — these are sample records, not real student data.
        </span>
      </div>

      <section
        className="school-students-stats"
        aria-label="Student statistics"
      >
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              className="school-students-stat-card"
              key={stat.label}
            >
              <div className="school-students-stat-top">
                <span
                  className={`school-students-stat-icon ${stat.color}`}
                >
                  <Icon size={19} />
                </span>
                <ArrowUpRight
                  size={15}
                  className="school-students-stat-arrow"
                />
              </div>

              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span className="school-students-stat-detail">
                {stat.detail}
              </span>
            </article>
          )
        })}
      </section>

      <section className="school-students-panel">
        <div className="school-students-panel-heading">
          <div>
            <h2>Student directory</h2>
            <p>Search and review students registered with your school.</p>
          </div>

          <span className="school-students-record-count">
            {filteredStudents.length}{' '}
            {filteredStudents.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        <div className="school-students-toolbar">
          <label className="school-students-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, ID, trade or email..."
              aria-label="Search students"
            />
            {search && (
              <button
                type="button"
                className="school-students-clear-search"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <X size={15} />
              </button>
            )}
          </label>

          <div className="school-students-filters">
            <label className="school-students-select-wrap">
              <SlidersHorizontal size={15} />
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>

            <label className="school-students-select-wrap">
              <select
                aria-label="Filter by trade"
                value={tradeFilter}
                onChange={(event) => setTradeFilter(event.target.value)}
              >
                <option>All trades</option>
                {trades.map((trade) => (
                  <option key={trade}>{trade}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
        </div>

        {(search ||
          statusFilter !== 'All statuses' ||
          tradeFilter !== 'All trades') && (
          <div className="school-students-active-filters">
            <span>Filtered results</span>
            <button type="button" onClick={clearFilters}>
              Clear filters <X size={13} />
            </button>
          </div>
        )}

        <div className="school-students-table-wrap">
          <table className="school-students-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>TRADE / PROGRAM</th>
                <th>APPLICATIONS</th>
                <th>INTERNSHIP STATUS</th>
                <th className="school-students-action-heading">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="school-students-person">
                      <span className="school-students-avatar">
                        {getInitials(student.name)}
                      </span>

                      <span className="school-students-person-info">
                        <strong>{student.name}</strong>
                        <small>{student.id}</small>
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="school-students-trade">
                      {student.trade}
                    </span>
                  </td>

                  <td>
                    <span className="school-students-application-count">
                      {student.applications}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`school-students-status ${statusClass(student.status)}`}
                    >
                      <span />
                      {student.status}
                    </span>
                  </td>

                  <td className="school-students-action-cell">
                    <button
                      type="button"
                      className="school-students-view-button"
                      title={`View ${student.name}`}
                      aria-label={`View ${student.name}`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="school-students-empty">
                      <Search size={25} />
                      <strong>No students found</strong>
                      <p>
                        Try another search term or change your filters.
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

        <footer className="school-students-panel-footer">
          <span>
            Showing {filteredStudents.length} of {demoStudents.length} sample
            students
          </span>
          <span>Demo data only</span>
        </footer>
      </section>

      {selectedStudent && (
        <div
          className="school-students-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null)
            }
          }}
        >
          <section
            className="school-students-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="school-students-modal-title"
          >
            <header className="school-students-modal-header">
              <div>
                <span className="school-students-eyebrow">
                  STUDENT RECORD
                </span>
                <h2 id="school-students-modal-title">Student details</h2>
              </div>

              <button
                type="button"
                className="school-students-modal-close"
                aria-label="Close student details"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={19} />
              </button>
            </header>

            <div className="school-students-modal-person">
              <span className="school-students-avatar large">
                {getInitials(selectedStudent.name)}
              </span>
              <div>
                <h3>{selectedStudent.name}</h3>
                <p>{selectedStudent.id}</p>
                <span
                  className={`school-students-status ${statusClass(selectedStudent.status)}`}
                >
                  <span />
                  {selectedStudent.status}
                </span>
              </div>
            </div>

            <div className="school-students-detail-list">
              <div>
                <span><GraduationCap size={16} /> Trade / program</span>
                <strong>{selectedStudent.trade}</strong>
              </div>
              <div>
                <span><UserRound size={16} /> Email</span>
                <strong>{selectedStudent.email}</strong>
              </div>
              <div>
                <span><FileText size={16} /> Applications</span>
                <strong>{selectedStudent.applications}</strong>
              </div>
            </div>

            <p className="school-students-modal-note">
              This is a demonstration record. Connect the backend to load
              verified student information.
            </p>

            <button
              type="button"
              className="school-students-modal-done"
              onClick={() => setSelectedStudent(null)}
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </section>
  )
}
