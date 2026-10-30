import { useMemo, useState } from 'react'
import { Ban, BadgeCheck, Download, KeyRound, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { PROVINCES, useAdminData } from '../../context/AdminDataContext'
import {
  Badge, ConfirmDialog, CredentialsDialog, Empty, Field, Modal, PageHeader, StatCard,
  downloadCsv, formatDate, isEmail, useToast,
} from './ui'

const SECTORS = ['Software & ICT', 'Networking & Telecom', 'Construction', 'Hospitality', 'Agriculture', 'Automotive', 'Manufacturing', 'Energy', 'Health', 'Other']
const DISTRICTS = Object.values(PROVINCES).flat().sort()
const empty = { name: '', sector: SECTORS[0], district: 'Gasabo', email: '', phone: '', contact: '' }

function CompanyForm({ initial, companies, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || empty)
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    const n = {}
    if (!form.name.trim()) n.name = 'Company name is required'
    else if (companies.some((c) => c.name.toLowerCase() === form.name.trim().toLowerCase() && c.id !== initial?.id)) n.name = 'A company with this name exists'
    if (!form.contact.trim()) n.contact = 'Contact person is required'
    if (!isEmail(form.email)) n.email = 'Enter a valid email'
    setErrors(n)
    if (Object.keys(n).length) return
    onSubmit({ ...form, name: form.name.trim(), contact: form.contact.trim(), email: form.email.trim() })
  }

  return (
    <Modal title={initial ? 'Edit company' : 'Onboard a company'}
      subtitle={initial ? undefined : 'Creates the company and its login. Companies cannot register themselves.'}
      onClose={onClose}
      footer={<>
        <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
        <button type="submit" form="company-form" className="adm-btn adm-btn-primary">{initial ? 'Save changes' : 'Create company'}</button>
      </>}>
      <form id="company-form" className="adm-form" onSubmit={submit} noValidate>
        <div className="adm-full"><Field label="Company name" error={errors.name}><input className="adm-input" value={form.name} onChange={set('name')} autoFocus /></Field></div>
        <Field label="Sector"><select className="adm-select" value={form.sector} onChange={set('sector')}>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="District"><select className="adm-select" value={form.district} onChange={set('district')}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Contact person" error={errors.contact}><input className="adm-input" value={form.contact} onChange={set('contact')} /></Field>
        <Field label="Email (used to sign in)" error={errors.email}><input className="adm-input" type="email" value={form.email} onChange={set('email')} /></Field>
        <Field label="Phone"><input className="adm-input" value={form.phone} onChange={set('phone')} /></Field>
      </form>
    </Modal>
  )
}

export default function AdminCompanies() {
  const { companies, internships, users, addCompany, updateCompany, setCompanyStatus, deleteCompany, resetPassword } = useAdminData()
  const [toast, toastNode] = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [modal, setModal] = useState(null)
  const [creds, setCreds] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return companies.filter((c) => (status === 'All' || c.status === status) &&
      (!q || [c.name, c.sector, c.district, c.contact, c.email].some((v) => v.toLowerCase().includes(q))))
  }, [companies, search, status])

  const count = (s) => companies.filter((c) => c.status === s).length
  const postings = (name) => internships.filter((i) => i.company === name).length

  return (
    <div className="adm-page">
      <PageHeader title="Companies" description="Onboard and verify the companies that offer internships to TVET students.">
        <button type="button" className="adm-btn" onClick={() => downloadCsv('companies.csv', [
          ['ID', 'Name', 'Sector', 'District', 'Contact', 'Email', 'Phone', 'Status', 'Onboarded'],
          ...filtered.map((c) => [c.id, c.name, c.sector, c.district, c.contact, c.email, c.phone, c.status, c.createdAt]),
        ])}><Download size={15} /> Export</button>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setModal({ type: 'form' })}><Plus size={15} /> Onboard company</button>
      </PageHeader>

      <section className="adm-stats">
        <StatCard icon={BadgeCheck} label="Verified" value={count('Verified')} tone="success" />
        <StatCard icon={KeyRound} label="Pending verification" value={count('Pending verification')} tone="warn" />
        <StatCard icon={Ban} label="Suspended" value={count('Suspended')} tone="danger" />
      </section>

      <section className="adm-card">
        <div className="adm-toolbar">
          <label className="adm-search"><Search size={16} />
            <input placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search companies" />
          </label>
          <select className="adm-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            {['All', 'Verified', 'Pending verification', 'Suspended'].map((s) => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <Empty title="No companies found" /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Company</th><th>Sector</th><th>Contact</th><th>Status</th><th className="adm-num">Postings</th><th>Onboarded</th><th /></tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong><small>{c.district}</small></td>
                    <td>{c.sector}</td>
                    <td>{c.contact}<small>{c.email}</small></td>
                    <td><Badge>{c.status}</Badge></td>
                    <td className="adm-num">{postings(c.name)}</td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <div className="adm-row-actions">
                        {c.status !== 'Verified' && (
                          <button type="button" className="adm-icon-btn" title="Verify" aria-label={`Verify ${c.name}`} onClick={() => { setCompanyStatus(c.id, 'Verified'); toast(`${c.name} verified`) }}><BadgeCheck size={16} /></button>
                        )}
                        <button type="button" className="adm-icon-btn" title="Edit" aria-label={`Edit ${c.name}`} onClick={() => setModal({ type: 'form', company: c })}><Pencil size={16} /></button>
                        <button type="button" className="adm-icon-btn" title="Reset password" aria-label={`Reset password for ${c.name}`} onClick={() => setModal({ type: 'reset', company: c })}><KeyRound size={16} /></button>
                        {c.status !== 'Suspended' && (
                          <button type="button" className="adm-icon-btn" title="Suspend" aria-label={`Suspend ${c.name}`} onClick={() => setModal({ type: 'suspend', company: c })}><Ban size={16} /></button>
                        )}
                        <button type="button" className="adm-icon-btn is-danger" title="Delete" aria-label={`Delete ${c.name}`} onClick={() => setModal({ type: 'delete', company: c })}><Trash2 size={16} /></button>
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
        <CompanyForm initial={modal.company} companies={companies} onClose={() => setModal(null)}
          onSubmit={(f) => {
            if (modal.company) { updateCompany(modal.company.id, f); setModal(null); toast('Company updated') }
            else {
              const { company, tempPassword } = addCompany(f)
              setModal(null)
              setCreds({ title: 'Company onboarded', name: company.contact, email: company.email, password: tempPassword })
            }
          }} />
      )}
      {modal?.type === 'suspend' && (
        <ConfirmDialog danger title={`Suspend ${modal.company.name}?`} confirmLabel="Suspend company"
          message="The company will be blocked from signing in and its internships stay hidden until reactivated."
          onClose={() => setModal(null)} onConfirm={() => { setCompanyStatus(modal.company.id, 'Suspended'); toast('Company suspended') }} />
      )}
      {modal?.type === 'reset' && (
        <ConfirmDialog title={`Reset password for ${modal.company.contact}?`} confirmLabel="Reset password"
          message="A new temporary password will be generated."
          onClose={() => setModal(null)}
          onConfirm={() => {
            const u = users.find((x) => x.orgId === modal.company.id && x.kind === 'company')
            setCreds({ title: 'Password reset', name: modal.company.contact, email: modal.company.email, password: resetPassword(u?.id) })
          }} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDialog danger title={`Delete ${modal.company.name}?`} confirmLabel="Delete company"
          message="Removes the company and its login. This cannot be undone."
          onClose={() => setModal(null)} onConfirm={() => { deleteCompany(modal.company.id); toast('Company deleted') }} />
      )}
      {creds && <CredentialsDialog {...creds} onClose={() => setCreds(null)} />}
      {toastNode}
    </div>
  )
}
