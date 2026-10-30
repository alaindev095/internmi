import { Link } from 'react-router-dom'
import {
  GraduationCap,
  School,
  BriefcaseBusiness,
  MapPin,
  UserRound,
  ArrowRight,
  Users,
  FileText
} from 'lucide-react'
import './ParentStudent.css'

/*
 * Pass linked students from your parent account/API when available:
 * <ParentStudent students={linkedStudents} />
 *
 * This page intentionally does not invent student records.
 */
export default function ParentStudent({ students = [] }) {
  const hasStudents = students.length > 0

  return (
    <div className="parent-students-page">
      <header className="parent-students-header">
        <div>
          <p className="parent-students-eyebrow">PARENT PORTAL</p>
          <h1>My Student</h1>
          <p>
            View your linked student's education details and internship
            journey.
          </p>
        </div>

        <div className="parent-students-count">
          <Users size={18} />
          <span>
            {students.length} linked {students.length === 1 ? 'student' : 'students'}
          </span>
        </div>
      </header>

      {hasStudents ? (
        <section className="parent-students-list" aria-label="Linked students">
          {students.map((student) => {
            const studentId = student.id
            const fullName = student.fullName || student.name || 'Student'
            const initials = fullName
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0].toUpperCase())
              .join('')

            return (
              <article className="parent-student-card" key={studentId}>
                <div className="parent-student-card-header">
                  <div className="parent-student-avatar">
                    {student.avatarUrl ? (
                      <img src={student.avatarUrl} alt="" />
                    ) : (
                      initials || <UserRound size={26} />
                    )}
                  </div>

                  <div className="parent-student-identity">
                    <h2>{fullName}</h2>
                    <p>
                      {student.studentNumber || 'Student number unavailable'}
                    </p>
                    <span className="parent-student-status">
                      <span className="parent-student-status-dot" />
                      Linked to your account
                    </span>
                  </div>
                </div>

                <div className="parent-student-details">
                  <div className="parent-student-detail">
                    <School size={18} />
                    <div>
                      <span>School</span>
                      <strong>{student.schoolName || 'Not available'}</strong>
                    </div>
                  </div>

                  <div className="parent-student-detail">
                    <GraduationCap size={18} />
                    <div>
                      <span>Trade / programme</span>
                      <strong>{student.trade || student.program || 'Not available'}</strong>
                    </div>
                  </div>

                  <div className="parent-student-detail">
                    <Users size={18} />
                    <div>
                      <span>Class / level</span>
                      <strong>{student.className || student.level || 'Not available'}</strong>
                    </div>
                  </div>

                  <div className="parent-student-detail">
                    <MapPin size={18} />
                    <div>
                      <span>Location</span>
                      <strong>{student.location || 'Not available'}</strong>
                    </div>
                  </div>
                </div>

                <div className="parent-student-internship">
                  <div className="parent-student-internship-icon">
                    <BriefcaseBusiness size={20} />
                  </div>
                  <div className="parent-student-internship-copy">
                    <span>Internship status</span>
                    <strong>
                      {student.internshipStatus || 'No placement information'}
                    </strong>
                  </div>
                  <Link
                    to={`/parent/applications?studentId=${encodeURIComponent(studentId)}`}
                    className="parent-student-view-link"
                  >
                    Applications <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <section className="parent-student-empty">
          <div className="parent-student-empty-icon">
            <GraduationCap size={30} />
          </div>
          <h2>No linked students yet</h2>
          <p>
            Students linked to your parent account will appear here
            automatically. Once a student is linked, you can view their school
            details and internship progress.
          </p>
          <div className="parent-student-empty-note">
            <FileText size={18} />
            <span>
              If you expected to see a student here, contact your school
              administrator to check the parent-student account link.
            </span>
          </div>
          <Link
            to="/parent/dashboard"
            className="parent-student-back-link"
          >
            Back to dashboard <ArrowRight size={16} />
          </Link>
        </section>
      )}
    </div>
  )
}