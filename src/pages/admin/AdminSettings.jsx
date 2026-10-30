import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { ConfirmDialog, Field, PageHeader, Tabs, isEmail, useToast } from './ui'

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="adm-switch-row">
      <span><strong>{label}</strong><small>{hint}</small></span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#25252b' }} />
    </label>
  )
}

function ChipEditor({ label, items, onChange, placeholder }) {
  const [value, setValue] = useState('')
  function add(e) {
    e.preventDefault()
    const v = value.trim()
    if (v && !items.some((i) => i.toLowerCase() === v.toLowerCase())) onChange([...items, v])
    setValue('')
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <strong style={{ fontSize: 13 }}>{label}</strong>
      <div className="adm-chips">
        {items.map((i) => (
          <span className="adm-chip" key={i}>{i}
            <button type="button" aria-label={`Remove ${i}`} onClick={() => onChange(items.filter((x) => x !== i))}><X size={12} /></button>
          </span>
        ))}
      </div>
      <form className="adm-toolbar" onSubmit={add}>
        <input className="adm-input" style={{ maxWidth: 260 }} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} aria-label={`Add ${label}`} />
        <button type="submit" className="adm-btn"><Plus size={15} /> Add</button>
      </form>
    </div>
  )
}

export default function AdminSettings() {
  const { settings, updateSettings, resetDemoData } = useAdminData()
  const [toast, toastNode] = useToast()
  const [tab, setTab] = useState('general')
  const [draft, setDraft] = useState(settings)
  const [errors, setErrors] = useState({})
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => setDraft(settings), [settings])
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }))
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings)

  function save() {
    const n = {}
    if (!draft.platformName.trim()) n.platformName = 'Required'
    if (!isEmail(draft.supportEmail)) n.supportEmail = 'Enter a valid email'
    const len = Number(draft.minPasswordLength)
    if (!(len >= 6 && len <= 64)) n.minPasswordLength = 'Between 6 and 64'
    const t = Number(draft.sessionTimeoutMins)
    if (!(t >= 5 && t <= 1440)) n.sessionTimeoutMins = 'Between 5 and 1440 minutes'
    setErrors(n)
    if (Object.keys(n).length) return
    updateSettings({ ...draft, minPasswordLength: len, sessionTimeoutMins: t })
    toast('Settings saved')
  }

  return (
    <div className="adm-page">
      <PageHeader title="Settings" description="Platform-wide configuration. Changes apply to every school and company.">
        <button type="button" className="adm-btn" disabled={!dirty} onClick={() => { setDraft(settings); setErrors({}) }}>Discard</button>
        <button type="button" className="adm-btn adm-btn-primary" disabled={!dirty} onClick={save}>Save changes</button>
      </PageHeader>

      <Tabs value={tab} onChange={setTab} tabs={[
        { value: 'general', label: 'General' }, { value: 'academic', label: 'Academic catalog' },
        { value: 'workflow', label: 'Approvals' }, { value: 'security', label: 'Security' },
      ]} />

      <section className="adm-card">
        {tab === 'general' && (
          <div className="adm-form">
            <Field label="Platform name" error={errors.platformName}><input className="adm-input" value={draft.platformName} onChange={(e) => set('platformName')(e.target.value)} /></Field>
            <Field label="Support email" error={errors.supportEmail}><input className="adm-input" value={draft.supportEmail} onChange={(e) => set('supportEmail')(e.target.value)} /></Field>
            <Field label="Current academic year"><input className="adm-input" value={draft.academicYear} onChange={(e) => set('academicYear')(e.target.value)} /></Field>
            <div className="adm-full">
              <Toggle label="Maintenance mode" hint="Blocks sign-in for everyone except platform admins." checked={draft.maintenanceMode} onChange={set('maintenanceMode')} />
            </div>
          </div>
        )}
        {tab === 'academic' && (
          <>
            <p className="adm-muted">Schools choose from these when they create classes.</p>
            <ChipEditor label="Levels" items={draft.levels} onChange={set('levels')} placeholder="e.g. L6" />
            <ChipEditor label="Trades / options" items={draft.trades} onChange={set('trades')} placeholder="e.g. Plumbing" />
          </>
        )}
        {tab === 'workflow' && (
          <div>
            <Toggle label="Verify companies before they go live" hint="New companies stay 'Pending verification' until you approve them." checked={draft.requireCompanyVerification} onChange={set('requireCompanyVerification')} />
            <Toggle label="Review internships before students see them" hint="New internship postings wait in 'Pending review'." checked={draft.requireInternshipApproval} onChange={set('requireInternshipApproval')} />
          </div>
        )}
        {tab === 'security' && (
          <div className="adm-form">
            <div className="adm-full"><Toggle label="Force password change at first sign-in" hint="Applies to every account created by an admin or school." checked={draft.forcePasswordChange} onChange={set('forcePasswordChange')} /></div>
            <Field label="Minimum password length" error={errors.minPasswordLength}><input className="adm-input" type="number" value={draft.minPasswordLength} onChange={(e) => set('minPasswordLength')(e.target.value)} /></Field>
            <Field label="Session timeout (minutes)" error={errors.sessionTimeoutMins}><input className="adm-input" type="number" value={draft.sessionTimeoutMins} onChange={(e) => set('sessionTimeoutMins')(e.target.value)} /></Field>
          </div>
        )}
      </section>

      <section className="adm-card">
        <div className="adm-card-head"><div><h2>Demo data</h2><p>Data is stored in this browser until the backend is connected.</p></div>
          <button type="button" className="adm-btn adm-btn-danger" onClick={() => setConfirmReset(true)}>Reset demo data</button></div>
      </section>

      {confirmReset && <ConfirmDialog danger title="Reset demo data?" confirmLabel="Reset"
        message="All schools, companies and changes made in this browser will be replaced with the sample data."
        onClose={() => setConfirmReset(false)} onConfirm={() => { resetDemoData(); toast('Demo data restored') }} />}
      {toastNode}
    </div>
  )
}
