
import { useMemo, useState } from 'react'
import { Search, MapPin, ArrowUpRight, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Student.css'

const companies = [
  {
    id: 1,
    name: 'Kigali Digital Labs',
    industry: 'Technology',
    location: 'Kigali',
    description: 'Software development, web applications, and digital solutions.',
    openings: 4,
  },
  {
    id: 2,
    name: 'Rwanda Network Services',
    industry: 'IT & Networking',
    location: 'Huye',
    description: 'Networking, IT support, infrastructure, and systems maintenance.',
    openings: 3,
  },
  {
    id: 3,
    name: 'Future Systems Rwanda',
    industry: 'Technology',
    location: 'Kigali',
    description: 'Database management, software systems, and business technology.',
    openings: 2,
  },
  {
    id: 4,
    name: 'Creative Digital Studio',
    industry: 'Design & Media',
    location: 'Musanze',
    description: 'Digital design, multimedia, and creative technology projects.',
    openings: 0,
  },
]

function Companies() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All industries')

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = [
        company.name,
        company.location,
        company.industry,
        company.description,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesIndustry =
        industry === 'All industries' || company.industry === industry

      return matchesSearch && matchesIndustry
    })
  }, [search, industry])

  return (
    <div className="student-dashboard">
      <header className="companies-header">
        <div>
          <p className="eyebrow">EXPLORE OPPORTUNITIES</p>
          <h1>Companies</h1>
          <p className="muted">
            Discover companies where you can develop your skills through
            internship opportunities.
          </p>
        </div>
      </header>

      <div className="company-filters">
        <label className="company-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search companies, industries, locations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          aria-label="Filter by industry"
        >
          <option>All industries</option>
          <option>Technology</option>
          <option>IT & Networking</option>
          <option>Design & Media</option>
        </select>
      </div>

      <p className="muted">
        {filteredCompanies.length} companies found
      </p>

      <section className="companies-grid">
        {filteredCompanies.map((company) => (
          <article className="company-card" key={company.id}>
            <div className="company-card-top">
              <div className="company-logo">
                <Building2 size={25} />
              </div>

              <span
                className={
                  company.openings > 0
                    ? 'opening-badge'
                    : 'closed-badge'
                }
              >
                {company.openings > 0
                  ? `${company.openings} openings`
                  : 'No open positions'}
              </span>
            </div>

            <h2>{company.name}</h2>
            <p className="company-industry">{company.industry}</p>

            <p className="company-description">
              {company.description}
            </p>

            <p className="company-location">
              <MapPin size={16} />
              {company.location}
            </p>

            <Link
              to={`/student/internships?company=${encodeURIComponent(company.name)}`}
              className="company-link"
            >
              View internships <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </section>

      {filteredCompanies.length === 0 && (
        <div className="empty-state">
          <Building2 size={30} />
          <h2>No companies found</h2>
          <p>Try another search term or choose a different industry.</p>
        </div>
      )}
    </div>
  )
}

export default Companies
