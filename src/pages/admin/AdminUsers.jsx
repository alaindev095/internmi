import { useMemo, useState } from 'react'
import { KeyRound, Plus, Power, Search, ShieldCheck, Trash2 } from 'lucide-react'
import { ADMIN_ROLES, useAdminData } from '../../context/AdminDataContext'
import {
  Badge, ConfirmDialog, CredentialsDialog, Empty, Field, Modal, PageHeader, Tabs, formatDate, initials, isEmail, useToast,
} from './ui'

function AdminForm({ users, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', role: ADMIN_ROLES[1] })
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  function submit(e) {
    e.preventDefault()
    const n = {}
    if (!form.name.trim()) n.name = 'Name is required'
    if (!isEmail(form.email)) n.email = 'Enter a valid email'
    else if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) n.email = 'This email already has an account'
    setErrors(n)
    if (!Object.keys(n).length) onSubmit({ ...form, name: form.name.trim(), email: form.email.trim() })
  }
  return (
    <Modal title="Add platform admin" subtitle="Super admins manage everything, support admins handle accounts, analysts can only view." onClose={onClose}
      footer={<>
        <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
        <button type="submit" form="admin-form" className="adm-btn adm-btn-primary">Create admin</button>
      </>}>
      <form id="admin-form" className="adm-form" onSubmit={submit} noValidate>
        <div className="adm-full"><Field label="Full name" error={errors.name}><input className="adm-input" value={form.name} onChange={set('name')} autoFocus /></Field></div>
        <Field label="Email" error={errors.email}><input className="adm-input" type="email" value={form.email} onChange={set('email')} /></Field>
        <Field label="Role"><select className="adm-select" value={form.role} onChange={set('role')}>{ADMIN_ROLES.map((r) => <option key={r}>{r}</option>)}</select></Field>
      </form>
    </Modal>
  )
}

export default function AdminUsers() {
  const { users, me, addAdmin, setUserStatus, resetPassword, deleteUser } = useAdminData()
  const [toast, toastNode] = useToast()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [creds, setCreds] = useState(null)

  const tabs = [
    { value: 'all', label: 'All', count: users.length },
    { value: 'admin', label: 'Platform admins', count: users.filter((u) => u.kind === 'admin').length },
    { value: 'school', label: 'School admins', count: users.filter((u) => u.kind === 'school').length },
    { value: 'company', label: 'Companies', count: users.filter((u) => u.kind === 'company').length },
  ]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => (tab === 'all' || u.kind === tab) &&
      (!q || [u.name, u.email, u.org, u.role].some((v) => v.toLowerCase().includes(q))))
  }, [users, tab, search])

  const isSelf = (u) => u.email.toLowerCase() === me.email.toLowerCase()

  return (
    <div className="adm-page">
      <PageHeader title="Users & access" description="Every account on the platform. There is no self-registration: accounts are created by admins (platform), school admins (staff, students) and companies (their team).">
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setModal({ type: 'add' })}><Plus size={15} /> Add platform admin</button>
      </PageHeader>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <section className="adm-card">
        <div className="adm-toolbar">
          <label className="adm-search"><Search size={16} />
            <input placeholder="Search name, email, organisation..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search users" />
          </label>
        </div>
        {filtered.length === 0 ? <Empty title="No users found" /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>User</th><th>Role</th><th>Organisation</th><th>Status</th><th>Last sign-in</th><th /></tr></thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td><div className="adm-cell-user"><span className="adm-avatar">{initials(u.name)}</span><div><strong>{u.name}{isSelf(u) ? ' (you)' : ''}</strong><small>{u.email}</small></div></div></td>
                    <td>{u.kind === 'admin' ? <Badge tone="info"><ShieldCheck size={11} style={{ verticalAlign: -1 }} /> {u.role}</Badge> : u.role}</td>
                    <td>{u.org}</td>
                    <td><Badge>{u.status}</Badge></td>
                    <td>{formatDate(u.lastLogin)}</td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" className="adm-icon-btn" title="Reset password" aria-label={`Reset password for ${u.name}`} onClick={() => setModal({ type: 'reset', user: u })}><KeyRound size={16} /></button>
                        {!isSelf(u) && (
                          <>
                            <button type="button" className="adm-icon-btn" title={u.status === 'Active' ? 'Deactivate' : 'Activate'} aria-label={`${u.status === 'Active' ? 'Deactivate' : 'Activate'} ${u.name}`}
                              onClick={() => { setUserStatus(u.id, u.status === 'Active' ? 'Inactive' : 'Active'); toast(u.status === 'Active' ? 'User deactivated' : 'User activated') }}><Power size={16} /></button>
                            {u.kind === 'admin' && (
                              <button type="button" className="adm-icon-btn is-danger" title="Remove" aria-label={`Remove ${u.name}`} onClick={() => setModal({ type: 'delete', user: u })}><Trash2 size={16} /></button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="adm-note" style={{ margin: 0 }}>Deactivating a school admin or company contact blocks only that login. To block a whole school or company, suspend it from its own page.</p>
      </section>

      {modal?.type === 'add' && <AdminForm users={users} onClose={() => setModal(null)}
        onSubmit={(f) => { const { user, tempPassword } = addAdmin(f); setModal(null); setCreds({ title: 'Admin created', name: user.name, email: user.email, password: tempPassword }) }} />}
      {modal?.type === 'reset' && <ConfirmDialog title={`Reset password for ${modal.user.name}?`} confirmLabel="Reset password"
        message="A new temporary password will be generated; the user must change it at next sign-in."
        onClose={() => setModal(null)}
        onConfirm={() => setCreds({ title: 'Password reset', name: modal.user.name, email: modal.user.email, password: resetPassword(modal.user.id) })} />}
      {modal?.type === 'delete' && <ConfirmDialog danger title={`Remove ${modal.user.name}?`} confirmLabel="Remove admin"
        message="This admin will lose all access immediately."
        onClose={() => setModal(null)} onConfirm={() => { deleteUser(modal.user.id); toast('Admin removed') }} />}
      {creds && <CredentialsDialog {...creds} onClose={() => setCreds(null)} />}
      {toastNode}
    </div>
  )
}
