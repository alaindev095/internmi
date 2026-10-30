import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  ArrowUpRight,
  ArrowRight,
  Plus,
  MapPin,
  Clock3,
  FileText,
} from "lucide-react";
import "./CompanyDashboard.css";

const stats = [
  {
    label: "Active internship posts",
    value: "08",
    note: "Currently accepting applications",
    icon: BriefcaseBusiness,
  },
  {
    label: "Total applications",
    value: "124",
    note: "Across all internship posts",
    icon: Users,
  },
  {
    label: "Shortlisted candidates",
    value: "18",
    note: "Ready for the next stage",
    icon: UserCheck,
  },
];

const applicants = [
  {
    initials: "JM",
    name: "Jean Mugisha",
    trade: "Software Development",
    position: "Frontend Developer Intern",
    date: "Oct 24, 2026",
    status: "Pending",
  },
  {
    initials: "AK",
    name: "Alice Kayitesi",
    trade: "Networking & Internet Technology",
    position: "Network Support Intern",
    date: "Oct 23, 2026",
    status: "Shortlisted",
  },
  {
    initials: "PN",
    name: "Patrick Niyonzima",
    trade: "Computer Systems & Architecture",
    position: "IT Support Intern",
    date: "Oct 22, 2026",
    status: "Reviewing",
  },
  {
    initials: "UM",
    name: "Uwase Marie",
    trade: "Software Development",
    position: "Backend Developer Intern",
    date: "Oct 21, 2026",
    status: "Pending",
  },
];

const statusClass = {
  Pending: "pending",
  Shortlisted: "shortlisted",
  Reviewing: "reviewing",
};

export default function CompanyDashboard() {
  return (
    <div className="company-dashboard">
      <section className="company-welcome">
        <div>
          <div className="company-eyebrow">COMPANY WORKSPACE</div>
          <h1>Good morning, Acme Company.</h1>
          <p>
            Manage internship opportunities and discover your next great
            talent.
          </p>
        </div>

        <Link to="/company/internships/new" className="company-primary-button">
          <Plus size={18} />
          Post an internship
        </Link>
      </section>

      <section className="company-stats-grid">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <article className="company-stat-card" key={label}>
            <div className="company-stat-top">
              <span>{label}</span>
              <div className="company-stat-icon">
                <Icon size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="company-stat-value">{value}</div>
            <p>{note}</p>
          </article>
        ))}
      </section>

      <section className="company-dashboard-grid">
        <div className="company-panel company-applicants-panel">
          <div className="company-panel-header">
            <div>
              <h2>Recent applications</h2>
              <p>Review candidates who recently applied.</p>
            </div>

            <Link
              to="/company/applications"
              className="company-text-link"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="company-applicants-list">
            {applicants.map((applicant) => (
              <article className="company-applicant" key={applicant.name}>
                <div className="company-applicant-avatar">
                  {applicant.initials}
                </div>

                <div className="company-applicant-info">
                  <strong>{applicant.name}</strong>
                  <span>{applicant.position}</span>
                  <small>{applicant.trade}</small>
                </div>

                <div className="company-applicant-meta">
                  <span
                    className={`company-status ${
                      statusClass[applicant.status]
                    }`}
                  >
                    {applicant.status}
                  </span>
                  <small>{applicant.date}</small>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="company-dashboard-side">
          <section className="company-panel company-quick-panel">
            <div className="company-panel-header">
              <div>
                <h2>Quick actions</h2>
                <p>Common tasks for your team.</p>
              </div>
            </div>

            <Link
              to="/company/applications"
              className="company-quick-action"
            >
              <span className="company-quick-icon">
                <FileText size={19} />
              </span>
              <span>
                <strong>Review applications</strong>
                <small>Evaluate student applications</small>
              </span>
              <ArrowUpRight size={17} />
            </Link>
            
          </section>

          <section className="company-panel company-posts-panel">
            <div className="company-panel-header">
              <div>
                <h2>Top internship post</h2>
                <p>Your most active opportunity.</p>
              </div>
            </div>

            <div className="company-featured-post">
              <div className="company-featured-post-icon">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <h3>Frontend Developer Intern</h3>
                <span>Software Development</span>
              </div>
            </div>

            <div className="company-post-detail">
              <Users size={16} />
              <span>32 applications</span>
            </div>

            <div className="company-post-detail">
              <MapPin size={16} />
              <span>Kigali, Rwanda</span>
            </div>

            <div className="company-post-detail">
              <Clock3 size={16} />
              <span>Applications open</span>
            </div>

            <Link
              to="/company/internships"
              className="company-post-link"
            >
              Manage internship posts <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </section>

    </div>
  );
}