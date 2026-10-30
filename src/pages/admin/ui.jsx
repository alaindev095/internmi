import { useEffect, useRef, useState } from 'react'
import { Check, Copy, KeyRound, X } from 'lucide-react'
import './AdminPages.css'

export function PageHeader({ eyebrow = 'PLATFORM ADMINISTRATION', title, description, children }) {
  return (
    <header className="adm-head">
      <div>
        <span className="adm-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="adm-head-actions">{children}</div>}
    </header>
  )
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'neutral' }) {
  return (
    <article className={`adm-stat adm-stat-${tone}`}>
      <span className="adm-stat-icon"><Icon size={18} /></span>
      <span className="adm-stat-label">{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </article>
  )
}

const BADGE_TONES = {
  Active: 'success', Verified: 'success', Open: 'success',
  'Pending activation': 'warn', 'Pending verification': 'warn', 'Pending review': 'warn',
  Suspended: 'danger', Flagged: 'danger', Inactive: 'neutral', Closed: 'neutral',
  High: 'danger', Normal: 'neutral',
}

export function Badge({ children, tone }) {
  return <span className={`adm-badge adm-badge-${tone || BADGE_TONES[children] || 'neutral'}`}>{children}</span>
}

export function Empty({ title, children }) {
  return (
    <div className="adm-empty">
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  )
}

export function Modal({ title, subtitle, onClose, children, footer, wide = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`adm-modal${wide ? ' adm-modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <div className="adm-modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="adm-icon-btn" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onClose }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={`adm-btn ${danger ? 'adm-btn-danger' : 'adm-btn-primary'}`}
            onClick={() => { onConfirm(); onClose() }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="adm-muted">{message}</p>
    </Modal>
  )
}

/* Shows a one-time temporary password after onboarding / reset. */
export function CredentialsDialog({ title, name, email, password, onClose }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = `Email: ${email}\nTemporary password: ${password}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: user can select the text manually */
    }
  }

  return (
    <Modal
      title={title}
      subtitle="Share these credentials securely. The password is shown only once."
      onClose={onClose}
      footer={<button type="button" className="adm-btn adm-btn-primary" onClick={onClose}>Done</button>}
    >
      <div className="adm-credentials">
        <KeyRound size={18} />
        <dl>
          <dt>Account</dt>
          <dd>{name}</dd>
          <dt>Email (username)</dt>
          <dd>{email}</dd>
          <dt>Temporary password</dt>
          <dd><code>{password}</code></dd>
        </dl>
        <button type="button" className="adm-btn adm-btn-sm" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="adm-note">The user must change this password at first sign-in.</p>
    </Modal>
  )
}

export function useToast() {
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  function show(message) {
    setToast(message)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2600)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  const node = toast ? <div className="adm-toast" role="status">{toast}</div> : null
  return [show, node]
}

export function Field({ label, error, children, hint }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="adm-field-error">{error}</small>}
    </label>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="adm-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          className={value === t.value ? 'is-active' : ''}
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {t.count !== undefined && <span>{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function formatDate(date) {
  if (!date || date === '—') return '—'
  const d = new Date(date.length === 10 ? `${date}T00:00:00` : date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}

export function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* Minimal RFC-4180 style CSV parser (quotes, commas, CRLF). */
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some((v) => v.trim() !== '')) rows.push(row)
      row = []
    } else cell += c
  }
  row.push(cell)
  if (row.some((v) => v.trim() !== '')) rows.push(row)
  return rows
}
