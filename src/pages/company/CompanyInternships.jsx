
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  BriefcaseBusiness,
  MapPin,
  Users,
  MoreHorizontal,
} from 'lucide-react'
import './CompanyInternships.css'

const STORAGE_KEY = 'internmi-company-internships'

const demoInternships = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    trade: 'Software Development',
    location: 'Kigali',
    positions: 3,
    applications: 24,
    status: 'Published',
    deadline: '2026-11-15',
  },
  {
    id: 2,
    title: 'Network Support Intern',
    trade: 'Networking & Internet Technology',
    location: 'Huye',
    positions: 2,
    applications: 16,
    status: 'Published',
    deadline: '2026-11-20',
  },
  {
    id: 3,
    title: 'Database Intern',
    trade: 'Computer Systems & Architecture',
    location: 'Kigali',
    positions: 2,
    applications: 8,
    status: 'Draft',
    deadline: '2026-12-01',
  },
  {
    id: 4,
    title: 'IT Support Intern',
    trade: 'Information Technology',
    location: 'Musanze',
    positions: 1,
    applications: 12,
    status: 'Closed',
    deadline: '2026-10-10',
  },
]

function loadInternships() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved !== null) {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : demoInternships
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoInternships))
  } catch (error) {
    console.error('Could not load internships:', error)
  }

  return demoInternships
}

export default function CompanyInternships() {
  const navigate = useNavigate()

  const [internships, setInternships] = useState(loadInternships)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const matchesSearch =
        `${item.title} ${item.trade} ${item.location}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        filter === 'All' || item.status === filter

      return matchesSearch && matchesStatus
    })
  }, [internships, search, filter])

  function closeInternship(id) {
    setInternships((current) => {
      const updated = current.map((item) =>
        item.id === id
          ? { ...item, status: 'Closed' }
          : item
      )

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Could not save internship status:', error)
      }

      return updated
    })
  }

  const counts = {
    All: internships.length,
    Published: internships.filter((item) => item.status === 'Published').length,
    Draft: internships.filter((item) => item.status === 'Draft').length,
    Closed: internships.filter((item) => item.status === 'Closed').length,
  }

  return (
    <section className="company-internships-page">
      <header className="company-page-heading">
        <div>
          <span className="company-eyebrow">COMPANY WORKSPACE</span>
          <h1>Internship posts</h1>
          <p>Manage your opportunities and find the right candidates.</p>
        </div>

        <button
          type="button"
          className="company-primary-button"
          onClick={() => navigate('/company/internships/new')}
        >
          <Plus size={18} />
          <span>Post an internship</span>
        </button>
      </header>

      <div className="company-post-stats">
        <div>
          <span>Total posts</span>
          <strong>{counts.All}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{counts.Published}</strong>
        </div>
        <div>
          <span>Drafts</span>
          <strong>{counts.Draft}</strong>
        </div>
        <div>
          <span>Closed</span>
          <strong>{counts.Closed}</strong>
        </div>
      </div>

      <div className="company-post-toolbar">
        <label className="company-post-search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search internship posts..."
          />
        </label>

        <label className="company-status-filter">
          <span className="sr-only">Filter by status</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </label>
      </div>

      <div className="company-post-list">
        {filteredInternships.map((item) => (
          <article className="company-post-card" key={item.id}>
            <div className="company-post-icon">
              <BriefcaseBusiness size={22} />
            </div>

            <div className="company-post-details">
              <div className="company-post-title-row">
                <h2>{item.title}</h2>
                <span
                  className={`company-status-badge status-${(
                    item.status || 'Draft'
                  ).toLowerCase()}`}
                >
                  {item.status || 'Draft'}
                </span>
              </div>

              <p>{item.trade}</p>

              <div className="company-post-meta">
                <span>
                  <MapPin size={14} /> {item.location}
                </span>
                <span>
                  <Users size={14} /> {item.positions} positions
                </span>
                <span>{item.applications ?? 0} applications</span>
              </div>

              <small>
                Application deadline: {item.deadline || 'Not set'}
              </small>
            </div>

            <div className="company-post-actions">
              <button
                type="button"
                className="company-secondary-button"
                onClick={() =>
                  navigate(`/company/internships/${item.id}/edit`)
                }
              >
                Edit
              </button>

              {item.status === 'Published' && (
                <button
                  type="button"
                  className="company-more-button"
                  title="Close internship"
                  aria-label={`Close ${item.title}`}
                  onClick={() => closeInternship(item.id)}
                >
                  <MoreHorizontal size={20} />
                </button>
              )}
            </div>
          </article>
        ))}

        {filteredInternships.length === 0 && (
          <div className="company-post-empty">
            <BriefcaseBusiness size={28} />
            <h2>No internships found</h2>
            <p>Try another search or change the status filter.</p>
          </div>
        )}
      </div>
    </section>
  )
}
