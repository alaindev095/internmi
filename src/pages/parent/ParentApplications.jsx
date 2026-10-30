
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
} from 'lucide-react';
import './ParentApplications.css';

const STATUS_LABELS = {
  pending: 'Pending',
  reviewing: 'Under review',
  accepted: 'Accepted',
  rejected: 'Unsuccessful',
  withdrawn: 'Withdrawn',
};

function normalizeStatus(status = '') {
  const value = String(status).toLowerCase().trim();

  if (['accepted', 'approved', 'successful'].includes(value)) {
    return 'accepted';
  }

  if (['rejected', 'declined', 'unsuccessful'].includes(value)) {
    return 'rejected';
  }

  if (['reviewing', 'under review', 'in_review', 'shortlisted'].includes(value)) {
    return 'reviewing';
  }

  if (['withdrawn', 'cancelled', 'canceled'].includes(value)) {
    return 'withdrawn';
  }

  return 'pending';
}

function formatDate(value) {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getApplicationId(application) {
  return application.id ?? application.applicationId ?? '';
}

function getStudentId(application) {
  return application.studentId ?? application.student?.id ?? '';
}

function getStudentName(application) {
  return (
    application.studentName ??
    application.student?.fullName ??
    application.student?.name ??
    'Linked student'
  );
}

export default function ParentApplications({ applications = [] }) {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId') ?? '';

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const safeApplications = Array.isArray(applications) ? applications : [];

  const studentApplications = useMemo(() => {
    if (!studentId) return safeApplications;

    return safeApplications.filter(
      (application) => String(getStudentId(application)) === studentId
    );
  }, [safeApplications, studentId]);

  const stats = useMemo(() => {
    const counts = {
      total: studentApplications.length,
      pending: 0,
      accepted: 0,
      unsuccessful: 0,
    };

    studentApplications.forEach((application) => {
      const status = normalizeStatus(
        application.status ?? application.applicationStatus
      );

      if (status === 'accepted') counts.accepted += 1;
      else if (status === 'rejected') counts.unsuccessful += 1;
      else counts.pending += 1;
    });

    return counts;
  }, [studentApplications]);

  const filteredApplications = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return studentApplications.filter((application) => {
      const status = normalizeStatus(
        application.status ?? application.applicationStatus
      );

      const company =
        application.companyName ??
        application.company?.name ??
        application.company ??
        '';

      const position =
        application.positionTitle ??
        application.internshipTitle ??
        application.internship?.title ??
        application.position ??
        '';

      const matchesSearch =
        !query ||
        String(company).toLowerCase().includes(query) ||
        String(position).toLowerCase().includes(query) ||
        getStudentName(application).toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [studentApplications, searchText, statusFilter]);

  const selectedStudentName = studentApplications.length
    ? getStudentName(studentApplications[0])
    : '';

  return (
    <section className="parent-applications-page">
      <header className="parent-applications-header">
        <div>
          <span className="parent-applications-eyebrow">
            PARENT PORTAL
          </span>

          <h1>Applications</h1>

          <p>
            Follow your student&apos;s internship applications and their
            progress.
          </p>

          {studentId && (
            <div className="parent-applications-student-filter">
              Showing applications for{' '}
              <strong>{selectedStudentName || 'selected student'}</strong>
            </div>
          )}
        </div>
      </header>

      <div className="parent-applications-stats">
        <article className="parent-applications-stat">
          <div className="parent-applications-stat-icon purple">
            <FileText size={20} />
          </div>
          <div>
            <span>Total applications</span>
            <strong>{stats.total}</strong>
          </div>
        </article>

        <article className="parent-applications-stat">
          <div className="parent-applications-stat-icon orange">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Pending / reviewing</span>
            <strong>{stats.pending}</strong>
          </div>
        </article>

        <article className="parent-applications-stat">
          <div className="parent-applications-stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Accepted</span>
            <strong>{stats.accepted}</strong>
          </div>
        </article>

        <article className="parent-applications-stat">
          <div className="parent-applications-stat-icon red">
            <XCircle size={20} />
          </div>
          <div>
            <span>Unsuccessful</span>
            <strong>{stats.unsuccessful}</strong>
          </div>
        </article>
      </div>

      <div className="parent-applications-content">
        <div className="parent-applications-section-heading">
          <div>
            <h2>Application history</h2>
            <p>
              View the companies and internship positions your student has
              applied to.
            </p>
          </div>

          <span className="parent-applications-count">
            {filteredApplications.length}{' '}
            {filteredApplications.length === 1 ? 'application' : 'applications'}
          </span>
        </div>

        <div className="parent-applications-toolbar">
          <label className="parent-applications-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search company, position or student..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              aria-label="Search applications"
            />
          </label>

          <label className="parent-applications-status-filter">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter applications by status"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Unsuccessful</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </label>
        </div>

        {filteredApplications.length > 0 ? (
          <div className="parent-applications-list">
            {filteredApplications.map((application, index) => {
              const status = normalizeStatus(
                application.status ?? application.applicationStatus
              );

              const company =
                application.companyName ??
                application.company?.name ??
                application.company ??
                'Company not specified';

              const position =
                application.positionTitle ??
                application.internshipTitle ??
                application.internship?.title ??
                application.position ??
                'Internship position not specified';

              const submittedDate =
                application.appliedAt ??
                application.submittedAt ??
                application.createdAt;

              const id = getApplicationId(application) || index;

              return (
                <article
                  className="parent-application-card"
                  key={id}
                >
                  <div className="parent-application-company-icon">
                    <Building2 size={22} />
                  </div>

                  <div className="parent-application-main">
                    <div className="parent-application-title-row">
                      <h3>{position}</h3>
                      <span
                        className={`parent-application-status status-${status}`}
                      >
                        <span className="parent-application-status-dot" />
                        {STATUS_LABELS[status]}
                      </span>
                    </div>

                    <div className="parent-application-company">
                      <Building2 size={15} />
                      <span>{company}</span>
                    </div>

                    <div className="parent-application-meta">
                      <span>
                        <CalendarDays size={15} />
                        Applied {formatDate(submittedDate)}
                      </span>

                      <span>
                        <BriefcaseBusiness size={15} />
                        {getStudentName(application)}
                      </span>
                    </div>

                    {application.statusMessage && (
                      <p className="parent-application-message">
                        {application.statusMessage}
                      </p>
                    )}
                  </div>

                  <div className="parent-application-action">
                    <Eye size={17} />
                    <span>View status</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="parent-applications-empty">
            <div className="parent-applications-empty-icon">
              {studentApplications.length > 0 ? (
                <Search size={28} />
              ) : (
                <FileText size={28} />
              )}
            </div>

            <h3>
              {studentApplications.length === 0
                ? 'No applications yet'
                : 'No matching applications'}
            </h3>

            <p>
              {studentApplications.length === 0
                ? 'When your linked student submits internship applications, their application history and status will appear here.'
                : 'Try another search term or change the status filter to see applications.'}
            </p>

            {(searchText || statusFilter !== 'all') &&
              studentApplications.length > 0 && (
                <button
                  type="button"
                  className="parent-applications-reset"
                  onClick={() => {
                    setSearchText('');
                    setStatusFilter('all');
                  }}
                >
                  Clear filters
                </button>
              )}
          </div>
        )}

        <p className="parent-applications-note">
          Application statuses are provided by the internship platform.
          Parents can monitor progress here; application decisions are handled
          by the relevant company.
        </p>
      </div>
    </section>
  );
}
