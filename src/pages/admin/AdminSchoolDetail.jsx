import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Ban, CheckCircle2, KeyRound, Pencil, Users, School, GraduationCap, Briefcase } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import {
  Badge, ConfirmDialog, CredentialsDialog, Empty, PageHeader, StatCard, formatDate, formatDateTime, useToast,
} from './ui'
import { SchoolFormModal } from './AdminSchools'

export default function AdminSchoolDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { schools, users, audit, updateSchool, setSchoolStatus, resetPassword } = useAdminData()
  const [toast, toastNode] = useToast()
  const [modal, setModal] = useState(null)
  const [creds, setCreds] = useState(null)

  const school = schools.find((s) => s.id === id)
  if (!school) {
    return (
      <div className="adm-page">
        <Empty title="School not found">It may have been deleted.</Empty>
        <button type="button" className="adm-btn" onClick={() => navigate('/admin/schools')}><ArrowLeft size={15} /> Back to schools</button>
      </div>
    )
  }

  const account = users.find((u) => u.orgId === school.id && u.kind === 'school')
  const history = audit.filter((a) => a.target === school.name).slice(0, 8)
  const rate = school.students ? Math.round((school.placed / school.students) * 100) : 0

  return (
    <div className="adm-page">
      <button type="button" className="adm-btn adm-btn-sm" style={{ justifySelf: 'start' }} onClick={() => navigate('/admin/schools')}>
        <ArrowLeft size={14} /> All schools
      </button>

      <PageHeader eyebrow={`${school.code} · ${school.type}`} title={school.name}
        description={`${school.address ? school.address + ', ' : ''}${school.district}, ${school.province}`}>
        <Badge>{school.status}</Badge>
        <button type="button" className="adm-btn" onClick={() => setModal('edit')}><Pencil size={15} /> Edit</button>
        <button type="button" className="adm-btn" onClick={() => setModal('reset')}><KeyRound size={15} /> Reset admin password</button>
        {school.status === 'Active' ? (
          <button type="button" className="adm-btn adm-btn-danger" onClick={() => setModal('suspend')}><Ban size={15} /> Suspend</button>
        ) : (
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => { setSchoolStatus(school.id, 'Active'); toast('School activated') }}><CheckCircle2 size={15} /> Activate</button>
        )}
      </PageHeader>

      <section className="adm-stats">
        <StatCard icon={School} label="Classes" value={school.classes} />
        <StatCard icon={GraduationCap} label="Students" value={school.students} />
        <StatCard icon={Users} label="Staff" value={school.staff} />
        <StatCard icon={Briefcase} label="Placed" value={school.placed} hint={`${rate}% placement rate`} tone="success" />
      </section>

      <div className="adm-grid-even">
        <section className="adm-card">
          <div className="adm-card-head"><h2>School details</h2></div>
          <dl className="adm-detail-grid">
            <div><dt>Email</dt><dd>{school.email || '—'}</dd></div>
            <div><dt>Phone</dt><dd>{school.phone || '—'}</dd></div>
            <div><dt>Province</dt><dd>{school.province}</dd></div>
            <div><dt>District</dt><dd>{school.district}</dd></div>
            <div><dt>Onboarded</dt><dd>{formatDate(school.createdAt)}</dd></div>
            <div><dt>School ID</dt><dd>{school.id}</dd></div>
          </dl>
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h2>Administrator account</h2></div>
          <dl className="adm-detail-grid">
            <div><dt>Name</dt><dd>{school.adminName}</dd></div>
            <div><dt>Email (username)</dt><dd>{school.adminEmail}</dd></div>
            <div><dt>Account status</dt><dd>{account ? <Badge>{account.status}</Badge> : '—'}</dd></div>
            <div><dt>Last sign-in</dt><dd>{account ? formatDate(account.lastLogin) : '—'}</dd></div>
          </dl>
        </section>
      </div>

      <section className="adm-card">
        <div className="adm-card-head"><h2>Activity for this school</h2></div>
        {history.length === 0 ? <p className="adm-muted">No recorded admin actions yet.</p> : (
          <ul className="adm-list">
            {history.map((a) => (
              <li key={a.id}><span><strong>{a.action}</strong><small>by {a.actor}</small></span><small>{formatDateTime(a.at)}</small></li>
            ))}
          </ul>
        )}
      </section>

      {modal === 'edit' && (
        <SchoolFormModal initial={school} schools={schools} onClose={() => setModal(null)}
          onSubmit={(f) => { updateSchool(school.id, f); setModal(null); toast('School updated') }} />
      )}
      {modal === 'suspend' && (
        <ConfirmDialog danger title={`Suspend ${school.name}?`} confirmLabel="Suspend school"
          message="Everyone at this school will be blocked from signing in until you reactivate it."
          onClose={() => setModal(null)} onConfirm={() => { setSchoolStatus(school.id, 'Suspended'); toast('School suspended') }} />
      )}
      {modal === 'reset' && (
        <ConfirmDialog title="Reset administrator password?" confirmLabel="Reset password"
          message="A new temporary password will be generated."
          onClose={() => setModal(null)}
          onConfirm={() => setCreds({ title: 'Password reset', name: school.adminName, email: school.adminEmail, password: resetPassword(account?.id) })} />
      )}
      {creds && <CredentialsDialog {...creds} onClose={() => setCreds(null)} />}
      {toastNode}
    </div>
  )
}
