
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  XCircle,
  CircleDashed,
} from 'lucide-react'
import './Student.css'

const internshipData = [
  {
    id: '1',
    title: 'Frontend Development Intern',
    company: 'Kigali Digital Labs',
    location: 'Kigali',
    duration: '3 months',
  },
  {
    id: '2',
    title: 'Backend Development Intern',
    company: 'Kigali Digital Labs',
    location: 'Kigali',
    duration: '4 months',
  },
  {
    id: '3',
    title: 'IT Support Intern',
    company: 'Rwanda Network Services',
    location: 'Huye',
    duration: '3 months',
  },
  {
    id: '4',
    title: 'Database Assistant Intern',
    company: 'Future Systems Rwanda',
    location: 'Kigali',
    duration: '3 months',
  },
]

const initialApplications = [
  {
    id: 'APP-001',
    internshipId: '2',
    status: 'Under review',
    appliedAt: '20 Oct 2026',
  },
  {
    id: 'APP-002',
    internshipId: '3',
    status: 'Pending',
    appliedAt: '22 Oct 2026',
  },
]

function StatusBadge({ status }) {
  const icons = {
    Pending: <Clock3 size={15} />,
    'Under review': <CircleDashed size={15} />,
    Accepted: <CheckCircle2 size={15} />,
    Rejected: <XCircle size={15} />,
  }

  return (
    <span className={`application-status status-${status.toLowerCase().replaceAll(' ', '-')}`}>
      {icons[status]}
      {status}
    </span>
  )
}

export default function MyApplications() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [applications, setApplications] = useState(initialApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [notice, setNotice] = useState('')

  const selectedInternshipId = searchParams.get('internshipId')

  const selectedInternship = internshipData.find(
    (internship) => internship.id === selectedInternshipId
  )

  const alreadyApplied = applications.some(
    (application) => application.internshipId === selectedInternshipId
  )

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const internship = internshipData.find(
        (item) => item.id === application.internshipId
      )

      if (!internship) return false

      const matchesSearch = `${internship.title} ${internship.company}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' || application.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, search, statusFilter])

  const applyForInternship = () => {
    if (!selectedInternship || alreadyApplied) return

    const newApplication = {
      id: `APP-${String(applications.length + 1).padStart(3, '0')}`,
      internshipId: selectedInternship.id,
      status: 'Pending',
      appliedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }

    setApplications((current) => [newApplication, ...current])
    setNotice(`Demo application created for ${selectedInternship.title}.`)
    setSearchParams({})
  }

  const counts = {
    total: applications.length,
    pending: applications.filter((item) => item.status === 'Pending').length,
    review: applications.filter((item) => item.status === 'Under review').length,
    accepted: applications.filter((item) => item.status === 'Accepted').length,
  }

  return (
    <main className="student-page">
      <div className="student-page-heading">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>My applications</h1>
          <p className="page-description">
            Track your internship applications and follow their progress.
          </p>
        </div>

        <Link to="/student/internships" className="primary-button">
          Find internships <ArrowUpRight size={17} />
        </Link>
      </div>

      {notice && (
        <div className="application-notice" role="status">
          <CheckCircle2 size={18} />
          <span>{notice} This is a frontend demo; it has not been sent to a company.</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}

      {selectedInternship && (
        <section className="apply-prompt">
          <div>
            <p className="eyebrow">READY TO APPLY?</p>
            <h2>{selectedInternship.title}</h2>
            <p>{selectedInternship.company} · {selectedInternship.location}</p>
          </div>

          {alreadyApplied ? (
            <span className="already-applied">You have already applied</span>
          ) : (
            <button className="primary-button" onClick={applyForInternship}>
              Apply now <ArrowUpRight size={17} />
            </button>
          )}
        </section>
      )}

      <section className="application-stats">
        <article className="application-stat">
          <span>Total applications</span>
          <strong>{counts.total}</strong>
        </article>
        <article className="application-stat">
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </article>
        <article className="application-stat">
          <span>Under review</span>
          <strong>{counts.review}</strong>
        </article>
        <article className="application-stat">
          <span>Accepted</span>
          <strong>{counts.accepted}</strong>
        </article>
      </section>

      <section className="applications-section">
        <div className="applications-toolbar">
          <div>
            <h2>Application history</h2>
            <p>Review the status of each application.</p>
          </div>

          <label className="application-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search applications..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="application-filters">
          {['All', 'Pending', 'Under review', 'Accepted', 'Rejected'].map(
            (status) => (
              <button
                key={status}
                className={statusFilter === status ? 'active' : ''}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            )
          )}
        </div>

        {filteredApplications.length > 0 ? (
          <div className="applications-list">
            {filteredApplications.map((application) => {
              const internship = internshipData.find(
                (item) => item.id === application.internshipId
              )

              return (
                <article className="application-card" key={application.id}>
                  <div className="application-icon">
                    <FileText size={23} />
                  </div>

                  <div className="application-main">
                    <div className="application-title-row">
                      <h3>{internship.title}</h3>
                      <StatusBadge status={application.status} />
                    </div>

                    <p className="application-company">{internship.company}</p>

                    <div className="application-meta">
                      <span><MapPin size={15} /> {internship.location}</span>
                      <span><BriefcaseBusiness size={15} /> {internship.duration}</span>
                      <span><Clock3 size={15} /> Applied {application.appliedAt}</span>
                    </div>

                    <p className="application-reference">
                      Reference: {application.id}
                    </p>
                  </div>

                  <Link
                    to={`/student/internships/${internship.id}`}
                    className="application-view-link"
                  >
                    View internship <ArrowUpRight size={16} />
                  </Link>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={32} />
            <h3>No applications found</h3>
            <p>
              {applications.length === 0
                ? 'Explore available internships and apply for one that matches your interests.'
                : 'Try another search term or select a different status.'}
            </p>
            <Link to="/student/internships" className="primary-button">
              Browse internships
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
