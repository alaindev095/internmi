import { useState } from 'react'
import { Megaphone, Send, Trash2 } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { Badge, ConfirmDialog, Empty, Field, PageHeader, formatDate, useToast } from './ui'

const AUDIENCES = ['Everyone', 'School admins', 'Companies', 'Students', 'Parents']

export default function AdminAnnouncements() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useAdminData()
  const [toast, toastNode] = useToast()
  const [form, setForm] = useState({ title: '', body: '', audience: 'Everyone', priority: 'Normal' })
  const [errors, setErrors] = useState({})
  const [del, setDel] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    const n = {}
    if (!form.title.trim()) n.title = 'Title is required'
    if (!form.body.trim()) n.body = 'Message is required'
    setErrors(n)
    if (Object.keys(n).length) return
    addAnnouncement({ ...form, title: form.title.trim(), body: form.body.trim() })
    setForm({ title: '', body: '', audience: 'Everyone', priority: 'Normal' })
    toast('Announcement published')
  }

  return (
    <div className="adm-page">
      <PageHeader title="Announcements" description="Broadcast notices to schools, companies, students or parents." />
      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head"><h2>Published</h2></div>
          {announcements.length === 0 ? <Empty title="No announcements yet" /> : announcements.map((a) => (
            <article className="adm-announcement" key={a.id}>
              <div className="adm-card-head"><h3>{a.title}</h3>
                <button type="button" className="adm-icon-btn is-danger" aria-label={`Delete ${a.title}`} onClick={() => setDel(a)}><Trash2 size={16} /></button>
              </div>
              <p>{a.body}</p>
              <div className="adm-announcement-meta"><Badge tone="info">{a.audience}</Badge>{a.priority === 'High' && <Badge>High</Badge>}<span>{formatDate(a.createdAt)}</span></div>
            </article>
          ))}
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h2><Megaphone size={16} style={{ verticalAlign: -2 }} /> New announcement</h2></div>
          <form className="adm-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={submit} noValidate>
            <Field label="Title" error={errors.title}><input className="adm-input" value={form.title} onChange={set('title')} /></Field>
            <Field label="Message" error={errors.body}><textarea className="adm-textarea" value={form.body} onChange={set('body')} /></Field>
            <Field label="Audience"><select className="adm-select" value={form.audience} onChange={set('audience')}>{AUDIENCES.map((a) => <option key={a}>{a}</option>)}</select></Field>
            <Field label="Priority"><select className="adm-select" value={form.priority} onChange={set('priority')}><option>Normal</option><option>High</option></select></Field>
            <button type="submit" className="adm-btn adm-btn-primary"><Send size={15} /> Publish</button>
          </form>
        </section>
      </div>
      {del && <ConfirmDialog danger title="Delete announcement?" confirmLabel="Delete" message={`“${del.title}” will no longer be shown.`}
        onClose={() => setDel(null)} onConfirm={() => { deleteAnnouncement(del.id); toast('Announcement deleted') }} />}
      {toastNode}
    </div>
  )
}
