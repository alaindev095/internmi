
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  Phone,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Clock3,
  UserRound,
} from 'lucide-react'
import './ApplicationDetails.css'

const demoApplications = [
  {
    id: '1',
    name: 'Jean Mugisha',
    initials: 'JM',
    email: 'jean.mugisha@example.com',
    phone: '+250 78X XXX XXX',
    school: 'IPRC Kigali',
    trade: 'Software Development',
    internship: 'Frontend Developer Intern',
    location: 'Kigali, Rwanda',
    applied: '2026-10-24',
    status: 'Pending',
    bio: 'Software development student interested in building accessible, responsive web applications and learning from experienced developers.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    documents: [
      { name: 'CV_Jean_Mugisha.pdf', type: 'Curriculum Vitae' },
      { name: 'Academic_Transcript.pdf', type: 'Academic transcript' },
    ],
  },
  {
    id: '2',
    name: 'Alice Kayitesi',
    initials: 'AK',
    email: 'alice.kayitesi@example.com',
    phone: '+250 78X XXX XXX',
    school: 'IPRC Huye',
    trade: 'Networking & Internet Technology',
    internship: 'Network Support Intern',
    location: 'Huye, Rwanda',
    applied: '2026-10-23',
    status: 'Shortlisted',
    bio: 'Networking student looking for practical experience with network configuration, troubleshooting, and IT support.',
    skills: ['Networking', 'Linux', 'Troubleshooting', 'TCP/IP'],
    documents: [
      { name: 'Alice_Kayitesi_CV.pdf', type: 'Curriculum Vitae' },
    ],
  },
]

const statuses = ['Pending', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected']

export default function ApplicationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const application = demoApplications.find((item) => item.id === id)

  const [status, setStatus] = useState(application?.status ?? 'Pending')
  const [notes, setNotes] = useState('')

  if (!application) {
    return (
      <section className="application-details-page">
        <button className="application-back-button" onClick={() => navigate('/company/applications')}>
          <ArrowLeft size={17} />
          Back to applications
        </button>
        <div className="application-not-found">
          <UserRound size={32} />
          <h1>Application not found</h1>
          <p>This demo application may not exist or may not be available.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="application-details-page">
      <button
        className="application-back-button"
        onClick={() => navigate('/company/applications')}
      >
        <ArrowLeft size={17} />
        Back to applications
      </button>

      <header className="application-details-heading">
        <div>
          <span className="company-eyebrow">CANDIDATE REVIEW</span>
          <h1>Application details</h1>
          <p>Review this candidate's information and application.</p>
        </div>

        <span className={`company-application-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </header>

      <div className="application-details-grid">
        <div className="application-details-main">
          <article className="application-detail-card candidate-profile-card">
            <div className="application-profile-top">
              <div className="application-profile-avatar">{application.initials}</div>
              <div>
                <h2>{application.name}</h2>
                <p>{application.trade} student</p>
              </div>
            </div>

            <p className="application-candidate-bio">{application.bio}</p>

            <div className="application-skills">
              {application.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>

          <article className="application-detail-card">
            <h2>Contact information</h2>
            <div className="application-info-list">
              <div>
                <Mail size={17} />
                <span>{application.email}</span>
              </div>
              <div>
                <Phone size={17} />
                <span>{application.phone}</span>
              </div>
              <div>
                <MapPin size={17} />
                <span>{application.location}</span>
              </div>
            </div>
          </article>

          <article className="application-detail-card">
            <h2>Education</h2>
            <div className="application-education-row">
              <div className="application-detail-icon">
                <GraduationCap size={20} />
              </div>
              <div>
                <strong>{application.school}</strong>
                <p>{application.trade}</p>
              </div>
            </div>
          </article>

          <article className="application-detail-card">
            <h2>Documents</h2>
            <div className="application-documents">
              {application.documents.map((document) => (
                <div className="application-document" key={document.name}>
                  <div className="application-document-icon">
                    <FileText size={19} />
                  </div>
                  <div className="application-document-info">
                    <strong>{document.name}</strong>
                    <span>{document.type}</span>
                  </div>
                  <button
                    type="button"
                    className="application-download-button"
                    aria-label={`Download ${document.name}`}
                    title="Demo only — document download not connected"
                    onClick={() => alert('Document downloads will be connected to the backend later.')}
                  >
                    <Download size={17} />
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="application-details-side">
          <article className="application-detail-card">
            <h2>Internship applied for</h2>
            <div className="application-internship-summary">
              <div className="application-detail-icon">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <strong>{application.internship}</strong>
                <p>{application.location}</p>
              </div>
            </div>

            <div className="application-applied-date">
              <CalendarDays size={16} />
              <span>Applied on {application.applied}</span>
            </div>
          </article>

          <article className="application-detail-card">
            <h2>Recruitment decision</h2>
            <label className="application-decision-label" htmlFor="application-status">
              Application status
            </label>
            <select
              id="application-status"
              className="application-decision-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statuses.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>

            <label className="application-decision-label" htmlFor="company-review-notes">
              Internal notes
            </label>
            <textarea
              id="company-review-notes"
              className="application-review-notes"
              rows={4}
              placeholder="Add notes for your recruitment team..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            <button
              className="application-save-decision"
              onClick={() => alert(`Demo only: status is now "${status}". Notes are not saved to a database.`)}
            >
              <CheckCircle2 size={17} />
              Save decision
            </button>

            <p className="application-decision-help">
              Changes are local to this demo page and will reset when you leave.
            </p>
          </article>
        </aside>
      </div>
    </section>
  )
}
