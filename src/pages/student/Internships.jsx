
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  ArrowUpRight,
  Clock3,
} from 'lucide-react'
import './Student.css'

const internshipData = [
  {
    id: 1,
    title: 'Frontend Development Intern',
    company: 'Kigali Digital Labs',
    location: 'Kigali',
    trade: 'Software Development',
    type: 'On-site',
    duration: '3 months',
    openings: 2,
    description:
      'Support the team in building and improving responsive web applications.',
  },
  {
    id: 2,
    title: 'Backend Development Intern',
    company: 'Kigali Digital Labs',
    location: 'Kigali',
    trade: 'Software Development',
    type: 'Hybrid',
    duration: '4 months',
    openings: 2,
    description:
      'Learn to develop APIs, work with databases, and test backend services.',
  },
  {
    id: 3,
    title: 'IT Support Intern',
    company: 'Rwanda Network Services',
    location: 'Huye',
    trade: 'IT & Networking',
    type: 'On-site',
    duration: '3 months',
    openings: 3,
    description:
      'Help troubleshoot computer systems, networks, and technical issues.',
  },
  {
    id: 4,
    title: 'Database Assistant Intern',
    company: 'Future Systems Rwanda',
    location: 'Kigali',
    trade: 'Database Administration',
    type: 'On-site',
    duration: '3 months',
    openings: 1,
    description:
      'Assist with database organization, data quality, and basic SQL queries.',
  },
]

function Internships() {
  const [searchParams] = useSearchParams()
  const selectedCompany = searchParams.get('company') || ''

  const [search, setSearch] = useState('')
  const [trade, setTrade] = useState('All trades')
  const [location, setLocation] = useState('All locations')

  const filteredInternships = useMemo(() => {
    return internshipData.filter((internship) => {
      const matchesSearch = [
        internship.title,
        internship.company,
        internship.trade,
        internship.location,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCompany =
        !selectedCompany || internship.company === selectedCompany

      const matchesTrade =
        trade === 'All trades' || internship.trade === trade

      const matchesLocation =
        location === 'All locations' || internship.location === location

      return (
        internship.openings > 0 &&
        matchesSearch &&
        matchesCompany &&
        matchesTrade &&
        matchesLocation
      )
    })
  }, [search, trade, location, selectedCompany])

  function clearFilters() {
    setSearch('')
    setTrade('All trades')
    setLocation('All locations')
  }

  return (
    <div className="student-dashboard">
      <header className="companies-header">
        <p className="eyebrow">YOUR NEXT OPPORTUNITY</p>

        <h1>Find internships</h1>

        <p className="muted">
          Discover opportunities where you can gain practical skills
          and prepare for your career.
        </p>

        {selectedCompany && (
          <p className="selected-company">
            Company: <strong>{selectedCompany}</strong>
            {' · '}
            <Link to="/student/internships">View all companies</Link>
          </p>
        )}
      </header>

      <div className="internship-filters">
        <label className="company-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="Search roles, companies, or skills..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          value={trade}
          onChange={(event) => setTrade(event.target.value)}
          aria-label="Filter by trade"
        >
          <option>All trades</option>
          <option>Software Development</option>
          <option>IT & Networking</option>
          <option>Database Administration</option>
        </select>

        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-label="Filter by location"
        >
          <option>All locations</option>
          <option>Kigali</option>
          <option>Huye</option>
        </select>
      </div>

      <div className="internship-results-heading">
        <p className="muted">
          {filteredInternships.length}{' '}
          {filteredInternships.length === 1
            ? 'opportunity'
            : 'opportunities'}{' '}
          available
        </p>

        <button
          type="button"
          className="clear-filters"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>

      <section className="internship-list">
        {filteredInternships.map((internship) => (
          <article className="internship-card" key={internship.id}>
            <div className="internship-card-content">
              <div className="internship-card-heading">
                <div className="company-logo">
                  <BriefcaseBusiness size={23} />
                </div>

                <span className="opening-badge">
                  {internship.openings}{' '}
                  {internship.openings === 1 ? 'position' : 'positions'}
                </span>
              </div>

              <h3>{internship.title}</h3>

              <p className="muted">{internship.company}</p>

              <p className="internship-description">
                {internship.description}
              </p>

              <div className="internship-meta">
                <span>{internship.trade}</span>

                <span>
                  <MapPin size={13} />
                  {internship.location}
                </span>

                <span>
                  <Clock3 size={13} />
                  {internship.duration}
                </span>

                <span>{internship.type}</span>
              </div>
            </div>

            <Link
              to={`/student/internships/${internship.id}`}
              className="secondary-button"
            >
              View details <ArrowUpRight size={16} />
            </Link>
          </article>
        ))}
      </section>

      {filteredInternships.length === 0 && (
        <div className="empty-state">
          <BriefcaseBusiness size={30} />
          <h2>No internships found</h2>
          <p>Try changing your search or removing some filters.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              clearFilters()
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Internships
