import { useState } from 'react'
import { useAdminData } from '../../context/AdminDataContext'
import { Field, PageHeader, initials, isEmail, useToast } from './ui'

export default function AdminProfile() {
  const { me, settings, updateProfile, logPasswordChange } = useAdminData()
  const [toast, toastNode] = useToast()
  const [form, setForm] = useState(me)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [pwErrors, setPwErrors] = useState({})

  function saveProfile(e) {
    e.preventDefault()
    const n = {}
    if (!form.name.trim()) n.name = 'Name is required'
    if (!isEmail(form.email)) n.email = 'Enter a valid email'
    setErrors(n)
    if (Object.keys(n).length) return
    updateProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone })
    toast('Profile updated')
  }

  function savePassword(e) {
    e.preventDefault()
    const n = {}
    if (!pw.current) n.current = 'Enter your current password'
    if (pw.next.length < settings.minPasswordLength) n.next = `At least ${settings.minPasswordLength} characters`
    if (pw.next !== pw.confirm) n.confirm = 'Passwords do not match'
    setPwErrors(n)
    if (Object.keys(n).length) return
    // TODO(backend): POST /auth/change-password
    logPasswordChange()
    setPw({ current: '', next: '', confirm: '' })
    toast('Password changed')
  }

  return (
    <div className="adm-page">
      <PageHeader title="My profile" description="Your platform administrator account." />
      <div className="adm-grid-even">
        <section className="adm-card">
          <div className="adm-cell-user"><span className="adm-avatar" style={{ width: 52, height: 52, fontSize: 16 }}>{initials(me.name)}</span>
            <div><strong>{me.name}</strong><small style={{ display: 'block', color: '#858591' }}>Platform administrator</small></div></div>
          <form className="adm-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={saveProfile} noValidate>
            <Field label="Full name" error={errors.name}><input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Email" error={errors.email}><input className="adm-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone"><input className="adm-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <button type="submit" className="adm-btn adm-btn-primary" style={{ justifySelf: 'start' }}>Save profile</button>
          </form>
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h2>Change password</h2></div>
          <form className="adm-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={savePassword} noValidate>
            <Field label="Current password" error={pwErrors.current}><input className="adm-input" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></Field>
            <Field label="New password" error={pwErrors.next}><input className="adm-input" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
            <Field label="Confirm new password" error={pwErrors.confirm}><input className="adm-input" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></Field>
            <button type="submit" className="adm-btn adm-btn-primary" style={{ justifySelf: 'start' }}>Update password</button>
          </form>
        </section>
      </div>
      {toastNode}
    </div>
  )
}
