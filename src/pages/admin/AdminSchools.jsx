import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Ban, CheckCircle2, Download, Eye, KeyRound, Pencil, Plus, Search, Trash2, Upload,
} from 'lucide-react'
import {
  PROVINCES, SCHOOL_TYPES, useAdminData,
} from '../../context/AdminDataContext'
import {
  Badge, ConfirmDialog, CredentialsDialog, Empty, Field, Modal, PageHeader,
  StatCard, downloadCsv, formatDate, isEmail, parseCsv, useToast,
} from './ui'

const emptyForm = {
  name: '', code: '', type: 'Public', province: 'Kigali City', district: 'Gasabo',
  address: '', email: '', phone: '', adminName: '', adminEmail: '',
}

export function SchoolFormModal({ initial, onClose, onSubmit, schools }) {
  const editing = Boolean(initial)
  const [form, setForm] = useState(initial || emptyForm)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function setProvince(e) {
    const province = e.target.value
    setForm((f) => ({ ...f, province, district: PROVINCES[province][0] }))
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'School name is required'
    if (!form.code.trim()) next.code = 'School code is required'
    else if (schools.some((s) => s.code.toLowerCase() === form.code.trim().toLowerCase() && s.id !== initial?.id))
      next.code = 'This code is already used'
    if (!isEmail(form.email)) next.email = 'Enter a valid email'
    if (!form.adminName.trim()) next.adminName = 'Administrator name is required'
    if (!isEmail(form.adminEmail)) next.adminEmail = 'Enter a valid email'
    else if (schools.some((s) => s.adminEmail.toLowerCase() === form.adminEmail.trim().toLowerCase() && s.id !== initial?.id))
      next.adminEmail = 'This email already manages another school'
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit({
      ...form,
      name: form.name.trim(), code: form.code.trim().toUpperCase(),
      email: form.email.trim(), adminName: form.adminName.trim(), adminEmail: form.adminEmail.trim(),
    })
  }

  return (
    <Modal
      wide
      title={editing ? 'Edit school' : 'Onboard a school'}
      subtitle={editing ? undefined : 'Creates the school and its administrator account. The school admin then creates classes and students.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="school-form" className="adm-btn adm-btn-primary">
            {editing ? 'Save changes' : 'Create school'}
          </button>
        </>
      }
    >
      <form id="school-form" className="adm-form" onSubmit={submit} noValidate>
        <span className="adm-form-section">SCHOOL</span>
        <Field label="School name" error={errors.name}>
          <input className="adm-input" value={form.name} onChange={set('name')} autoFocus />
        </Field>
        <Field label="School code" error={errors.code} hint="Short unique code, e.g. GSB-TVET">
          <input className="adm-input" value={form.code} onChange={set('code')} />
        </Field>
        <Field label="Type">
          <select className="adm-select" value={form.type} onChange={set('type')}>
            {SCHOOL_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Province">
          <select className="adm-select" value={form.province} onChange={setProvince}>
            {Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="District">
          <select className="adm-select" value={form.district} onChange={set('district')}>
            {PROVINCES[form.province].map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Address / sector">
          <input className="adm-input" value={form.address} onChange={set('address')} />
        </Field>
        <Field label="School email" error={errors.email}>
          <input className="adm-input" type="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="School phone">
          <input className="adm-input" value={form.phone} onChange={set('phone')} />
        </Field>

        <span className="adm-form-section">SCHOOL ADMINISTRATOR (LOGIN ACCOUNT)</span>
        <Field label="Full name" error={errors.adminName}>
          <input className="adm-input" value={form.adminName} onChange={set('adminName')} />
        </Field>
        <Field label="Email (used to sign in)" error={errors.adminEmail}>
          <input className="adm-input" type="email" value={form.adminEmail} onChange={set('adminEmail')} />
        </Field>
      </form>
    </Modal>
  )
}

const TEMPLATE = [
  ['name', 'code', 'type', 'province', 'district', 'address', 'email', 'phone', 'admin_name', 'admin_email'],
  ['Example TVET School', 'EXM-TVET', 'Public', 'Eastern', 'Kayonza', 'Kayonza Town', 'info@example.rw', '+250788000000', 'Jane Doe', 'jane@example.rw'],
]

function ImportModal({ onClose, onImport }) {
  const fileRef = useRef(null)
  const [rows, setRows] = useState(null)
  const [problems, setProblems] = useState([])

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const parsed = parseCsv(await file.text())
    const [head, ...body] = parsed
    const idx = Object.fromEntries((head || []).map((h, i) => [h.trim().toLowerCase(), i]))
    const required = ['name', 'code', 'admin_name', 'admin_email']
    const missing = required.filter((k) => !(k in idx))
    if (missing.length) {
      setRows([]); setProblems([`Missing column(s): ${missing.join(', ')}`]); return
    }
    const get = (r, k) => (r[idx[k]] ?? '').trim()
    const list = []
    const issues = []
    body.forEach((r, i) => {
      const province = Object.keys(PROVINCES).find((p) => p.toLowerCase() === get(r, 'province').toLowerCase()) || 'Kigali City'
      const district = PROVINCES[province].find((d) => d.toLowerCase() === get(r, 'district').toLowerCase()) || PROVINCES[province][0]
      const school = {
        name: get(r, 'name'), code: get(r, 'code').toUpperCase(),
        type: SCHOOL_TYPES.find((t) => t.toLowerCase() === get(r, 'type').toLowerCase()) || 'Public',
        province, district, address: get(r, 'address'), email: get(r, 'email'), phone: get(r, 'phone'),
        adminName: get(r, 'admin_name'), adminEmail: get(r, 'admin_email'),
      }
      if (!school.name || !school.code || !school.adminName || !isEmail(school.adminEmail)) {
        issues.push(`Row ${i + 2}: name, code, admin name and a valid admin email are required`)
      } else list.push(school)
    })
    setRows(list); setProblems(issues)
  }

  return (
    <Modal
      title="Import schools from CSV"
      subtitle="Onboard many schools at once. Each row creates a school and its administrator."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="adm-btn adm-btn-primary" disabled={!rows?.length}
            onClick={() => onImport(rows)}>
            Import {rows?.length ? `${rows.length} school${rows.length > 1 ? 's' : ''}` : ''}
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 14 }}>
        <button type="button" className="adm-btn" onClick={() => downloadCsv('umunaralink-schools-template.csv', TEMPLATE)}>
          <Download size={15} /> Download template
        </button>
        <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} className="adm-input" style={{ paddingTop: 8 }} />
        {rows && rows.length > 0 && <p className="adm-muted"><strong>{rows.length}</strong> valid row(s) ready to import.</p>}
        {problems.length > 0 && (
          <ul className="adm-note" style={{ color: '#b91c1c', paddingLeft: 18, margin: 0 }}>
            {problems.slice(0, 6).map((p) => <li key={p}>{p}</li>)}
          </ul>
        )}
      </div>
    </Modal>
  )
}

export default function AdminSchools() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { schools, addSchool, updateSchool, setSchoolStatus, deleteSchool, resetPassword, users } = useAdminData()
  const [toast, toastNode] = useToast()

  const [search, setSearch] = useState(params.get('search') || '')
  const [status, setStatus] = useState('All')
  const [province, setProvince] = useState('All')
  const [modal, setModal] = useState(null) // {type, school}
  const [creds, setCreds] = useState(null)

  useEffect(() => {
    if (params.get('new')) {
      setModal({ type: 'form' })
      setParams((p) => { p.delete('new'); return p }, { replace: true })
    }
  }, [params, setParams])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return schools.filter((s) =>
      (status === 'All' || s.status === status) &&
      (province === 'All' || s.province === province) &&
      (!q || [s.name, s.code, s.district, s.adminName, s.adminEmail].some((v) => v.toLowerCase().includes(q))))
  }, [schools, search, status, province])

  const totals = {
    active: schools.filter((s) => s.status === 'Active').length,
    pending: schools.filter((s) => s.status === 'Pending activation').length,
    suspended: schools.filter((s) => s.status === 'Suspended').length,
  }

  function create(form) {
    const { school, tempPassword } = addSchool(form)
    setModal(null)
    setCreds({ title: 'School onboarded', name: school.adminName, email: school.adminEmail, password: tempPassword })
  }

  function importMany(list) {
    let n = 0
    const existing = new Set(schools.map((s) => s.code.toLowerCase()))
    list.forEach((f) => {
      if (existing.has(f.code.toLowerCase())) return
      existing.add(f.code.toLowerCase())
      addSchool(f); n++
    })
    setModal(null)
    toast(`${n} school${n === 1 ? '' : 's'} imported${n < list.length ? ` (${list.length - n} skipped: duplicate code)` : ''}`)
  }

  function reset(school) {
    const user = users.find((u) => u.orgId === school.id && u.kind === 'school')
    const password = resetPassword(user?.id)
    setCreds({ title: 'Password reset', name: school.adminName, email: school.adminEmail, password })
  }

  function exportCsv() {
    downloadCsv('schools.csv', [
      ['ID', 'Name', 'Code', 'Type', 'Province', 'District', 'Status', 'Admin', 'Admin email', 'Classes', 'Students', 'Placed', 'Onboarded'],
      ...filtered.map((s) => [s.id, s.name, s.code, s.type, s.province, s.district, s.status, s.adminName, s.adminEmail, s.classes, s.students, s.placed, s.createdAt]),
    ])
  }

  return (
    <div className="adm-page">
      <PageHeader title="Schools" description="Schools are onboarded only by platform admins. Each school administrator then creates classes and students.">
        <button type="button" className="adm-btn" onClick={() => setModal({ type: 'import' })}><Upload size={15} /> Import CSV</button>
        <button type="button" className="adm-btn" onClick={exportCsv}><Download size={15} /> Export</button>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setModal({ type: 'form' })}><Plus size={15} /> Onboard school</button>
      </PageHeader>

      <section className="adm-stats">
        <StatCard icon={CheckCircle2} label="Active" value={totals.active} tone="success" />
        <StatCard icon={KeyRound} label="Pending activation" value={totals.pending} tone="warn" hint="Admin has not signed in yet" />
        <StatCard icon={Ban} label="Suspended" value={totals.suspended} tone="danger" />
      </section>

      <section className="adm-card">
        <div className="adm-toolbar">
          <label className="adm-search"><Search size={16} />
            <input placeholder="Search name, code, district, admin..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search schools" />
          </label>
          <select className="adm-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            {['All', 'Active', 'Pending activation', 'Suspended'].map((s) => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
          </select>
          <select className="adm-select" value={province} onChange={(e) => setProvince(e.target.value)} aria-label="Filter by province">
            <option value="All">All provinces</option>
            {Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <Empty title="No schools found">Try another search or onboard a new school.</Empty>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>School</th><th>Location</th><th>Administrator</th><th>Status</th>
                  <th className="adm-num">Classes</th><th className="adm-num">Students</th><th>Onboarded</th><th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <button type="button" className="adm-link" onClick={() => navigate(`/admin/schools/${s.id}`)}>{s.name}</button>
                      <small>{s.code} · {s.type}</small>
                    </td>
                    <td>{s.district}<small>{s.province}</small></td>
                    <td>{s.adminName}<small>{s.adminEmail}</small></td>
                    <td><Badge>{s.status}</Badge></td>
                    <td className="adm-num">{s.classes}</td>
                    <td className="adm-num">{s.students}</td>
                    <td>{formatDate(s.createdAt)}</td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" className="adm-icon-btn" title="View" aria-label={`View ${s.name}`} onClick={() => navigate(`/admin/schools/${s.id}`)}><Eye size={16} /></button>
                        <button type="button" className="adm-icon-btn" title="Edit" aria-label={`Edit ${s.name}`} onClick={() => setModal({ type: 'form', school: s })}><Pencil size={16} /></button>
                        <button type="button" className="adm-icon-btn" title="Reset admin password" aria-label={`Reset password for ${s.name}`} onClick={() => setModal({ type: 'reset', school: s })}><KeyRound size={16} /></button>
                        {s.status === 'Suspended' || s.status === 'Pending activation' ? (
                          <button type="button" className="adm-icon-btn" title="Activate" aria-label={`Activate ${s.name}`} onClick={() => { setSchoolStatus(s.id, 'Active'); toast(`${s.name} activated`) }}><CheckCircle2 size={16} /></button>
                        ) : (
                          <button type="button" className="adm-icon-btn" title="Suspend" aria-label={`Suspend ${s.name}`} onClick={() => setModal({ type: 'suspend', school: s })}><Ban size={16} /></button>
                        )}
                        <button type="button" className="adm-icon-btn is-danger" title="Delete" aria-label={`Delete ${s.name}`} onClick={() => setModal({ type: 'delete', school: s })}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal?.type === 'form' && (
        <SchoolFormModal
          initial={modal.school}
          schools={schools}
          onClose={() => setModal(null)}
          onSubmit={(form) => {
            if (modal.school) { updateSchool(modal.school.id, form); setModal(null); toast('School updated') }
            else create(form)
          }}
        />
      )}
      {modal?.type === 'import' && <ImportModal onClose={() => setModal(null)} onImport={importMany} />}
      {modal?.type === 'suspend' && (
        <ConfirmDialog danger title={`Suspend ${modal.school.name}?`} confirmLabel="Suspend school"
          message="The school administrator and staff will be blocked from signing in. Data is kept and you can reactivate at any time."
          onClose={() => setModal(null)} onConfirm={() => { setSchoolStatus(modal.school.id, 'Suspended'); toast('School suspended') }} />
      )}
      {modal?.type === 'reset' && (
        <ConfirmDialog title={`Reset password for ${modal.school.adminName}?`} confirmLabel="Reset password"
          message="A new temporary password is generated. The administrator must change it at next sign-in."
          onClose={() => setModal(null)} onConfirm={() => reset(modal.school)} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDialog danger title={`Delete ${modal.school.name}?`} confirmLabel="Delete school"
          message="This removes the school and its administrator account from the platform. This cannot be undone. Consider suspending instead."
          onClose={() => setModal(null)} onConfirm={() => { deleteSchool(modal.school.id); toast('School deleted') }} />
      )}
      {creds && <CredentialsDialog {...creds} onClose={() => setCreds(null)} />}
      {toastNode}
    </div>
  )
}
