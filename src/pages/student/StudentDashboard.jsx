
import { Link } from 'react-router-dom'
import {
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  Clock3,
  ArrowRight,
} from 'lucide-react'
import './Student.css'

const stats = [
  {
    label: 'Available internships',
    value: '24',
    icon: BriefcaseBusiness,
  },
  {
    label: 'My applications',
    value: '5',
    icon: FileText,
  },
  {
    label: 'Accepted',
    value: '2',
    icon: CheckCircle2,
  },
  {
    label: 'Pending',
    value: '3',
    icon: Clock3,
  },
]

const internships = [
  {
    id: 1,
    company: 'Example Technology Ltd',
    title: 'Web Development Intern',
    location: 'Kigali',
    trade: 'Software Development',
  },
  {
    id: 2,
    company: 'Example Digital Ltd',
    title: 'IT Support Intern',
    location: 'Huye',
    trade: 'Information Technology',
  },
  {
    id: 3,
    company: 'Example Systems Ltd',
    title: 'Database Intern',
    location: 'Kigali',
    trade: 'Database Administration',
  },
]

function StudentDashboard() {
  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Welcome back, Alain</h1>
          <p className="muted">
            Find opportunities and take the next step in your career.
          </p>
        </div>

        <Link to="/student/internships" className="primary-button">
          Find internships <ArrowRight size={17} />
        </Link>
      </header>

      <section className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={21} />
            </div>
            <p className="muted">{label}</p>
            <h2>{value}</h2>
          </article>
        ))}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Recommended internships</h2>
            <p className="muted">
              Explore opportunities that may match your trade.
            </p>
          </div>

          <Link to="/student/internships" className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="internship-list">
          {internships.map((internship) => (
            <article className="internship-card" key={internship.id}>
              <div>
                <h3>{internship.title}</h3>
                <p className="muted">{internship.company}</p>
                <div className="internship-meta">
                  <span>{internship.trade}</span>
                  <span>{internship.location}</span>
                </div>
              </div>

              <Link
                to={`/student/internships/${internship.id}`}
                className="secondary-button"
              >
                View details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default StudentDashboard
