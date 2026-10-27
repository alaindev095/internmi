
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, BriefcaseBusiness } from 'lucide-react'
import './Student.css'

const internships = [
  {
    id: '1',
    title: 'Frontend Development Intern',
    company: 'Kigali Digital Labs',
    location: 'Kigali',
    trade: 'Software Development',
    duration: '3 months',
    openings: 2,
    description:
      'Support the team in building and improving responsive web applications.',
    requirements: [
      'Currently studying a relevant TVET trade.',
      'Basic knowledge of HTML, CSS, and JavaScript.',
      'Willingness to learn and work with a team.',
    ],
  },
  {
    id: '2',
    title: 'Backend Development Intern',
    company: 'Kigali Digital Labs',
    location: 'Kigali',
    trade: 'Software Development',
    duration: '4 months',
    openings: 2,
    description:
      'Learn to develop APIs, work with databases, and test backend services.',
    requirements: [
      'Basic programming knowledge.',
      'Interest in APIs and databases.',
      'Willingness to learn.',
    ],
  },
  {
    id: '3',
    title: 'IT Support Intern',
    company: 'Rwanda Network Services',
    location: 'Huye',
    trade: 'IT & Networking',
    duration: '3 months',
    openings: 3,
    description:
      'Help troubleshoot computer systems, networks, and technical issues.',
    requirements: [
      'Interest in computer maintenance and networking.',
      'Basic troubleshooting skills.',
    ],
  },
  {
    id: '4',
    title: 'Database Assistant Intern',
    company: 'Future Systems Rwanda',
    location: 'Kigali',
    trade: 'Database Administration',
    duration: '3 months',
    openings: 1,
    description:
      'Assist with database organization, data quality, and basic SQL queries.',
    requirements: [
      'Basic SQL knowledge.',
      'Attention to detail.',
    ],
  },
]

function InternshipDetails() {
  const { internshipId } = useParams()

  const internship = internships.find(
    (item) => item.id === internshipId,
  )

  if (!internship) {
    return (
      <div className="empty-state">
        <h1>Internship not found</h1>
        <p>This opportunity may no longer be available.</p>
        <Link to="/student/internships">
          Back to internships
        </Link>
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <Link to="/student/internships" className="text-link">
        <ArrowLeft size={16} /> Back to internships
      </Link>

      <section className="internship-details-card">
        <div className="company-logo">
          <BriefcaseBusiness size={26} />
        </div>

        <p className="eyebrow">{internship.trade}</p>
        <h1>{internship.title}</h1>
        <h3>{internship.company}</h3>

        <p className="internship-meta">
          <MapPin size={15} /> {internship.location}
          {' · '}
          {internship.duration}
          {' · '}
          {internship.openings} open positions
        </p>

        <hr />

        <h2>About this internship</h2>
        <p className="internship-description">
          {internship.description}
        </p>

        <h2>Requirements</h2>
        <ul>
          {internship.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>

        <Link
          to={`/student/applications?internshipId=${internship.id}`}
          className="primary-button"
        >
          Continue to applications
        </Link>
      </section>
    </div>
  )
}

export default InternshipDetails
