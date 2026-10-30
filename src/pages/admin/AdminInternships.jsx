import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Download, Flag, Lock, Search, Trash2, Clock3 } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { Badge, ConfirmDialog, Empty, PageHeader, StatCard, downloadCsv, formatDate, useToast } from './ui'

export default function AdminInternships() {
  const { internships, settings, setInternshipStatus, deleteInternship } = useAdminData()
  const [toast, toastNode] = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [del, setDel] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return internships.filter((i) => (status === 'All' || i.status === status) &&
      (!q || [i.title, i.company, i.trade, i.district].some((v) => v.toLowerCase().includes(q))))
  }, [internships, search, status])

  const count = (s) => internships.filter((i) => i.status === s).length
  const act = (i, s, msg) => { setInternshipStatus(i.id, s); toast(msg) }

  return (
    <div className="adm-page">
      <PageHeader title="Internships" description={settings.requireInternshipApproval
        ? 'New postings need your approval before students can see them.'
        : 'Oversee every internship posted on the platform.'}>
        <button type="button" className="adm-btn" onClick={() => downloadCsv('internships.csv', [
          ['ID', 'Title', 'Company', 'District', 'Trade', 'Slots', 'Applicants', 'Status', 'Posted'],
          ...filtered.map((i) => [i.id, i.title, i.company, i.district, i.trade, i.slots, i.applicants, i.status, i.postedAt]),
        ])}><Download size={15} /> Export</button>
      </PageHeader>

      <section className="adm-stats">
        <StatCard icon={CheckCircle2} label="Open" value={count('Open')} tone="success" />
        <StatCard icon={Clock3} label="Pending review" value={count('Pending review')} tone="warn" />
        <StatCard icon={AlertTriangle} label="Flagged" value={count('Flagged')} tone="danger" />
        <StatCard icon={Lock} label="Closed" value={count('Closed')} />
      </section>

      <section className="adm-card">
        <div className="adm-toolbar">
          <label className="adm-search"><Search size={16} />
            <input placeholder="Search title, company, trade..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search internships" />
          </label>
          <select className="adm-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            {['All', 'Open', 'Pending review', 'Flagged', 'Closed'].map((s) => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <Empty title="No internships found" /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Internship</th><th>Trade</th><th>Status</th><th className="adm-num">Slots</th><th className="adm-num">Applicants</th><th>Posted</th><th /></tr></thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id}>
                    <td><strong>{i.title}</strong><small>{i.company} · {i.district}</small></td>
                    <td>{i.trade}</td>
                    <td><Badge>{i.status}</Badge></td>
                    <td className="adm-num">{i.slots}</td>
                    <td className="adm-num">{i.applicants}</td>
                    <td>{formatDate(i.postedAt)}</td>
                    <td>
                      <div className="adm-row-actions">
                        {(i.status === 'Pending review' || i.status === 'Flagged' || i.status === 'Closed') && (
                          <button type="button" className="adm-icon-btn" title={i.status === 'Closed' ? 'Reopen' : 'Approve'} aria-label={`Approve ${i.title}`} onClick={() => act(i, 'Open', i.status === 'Closed' ? 'Internship reopened' : 'Internship approved')}><CheckCircle2 size={16} /></button>
                        )}
                        {i.status !== 'Flagged' && (
                          <button type="button" className="adm-icon-btn" title="Flag" aria-label={`Flag ${i.title}`} onClick={() => act(i, 'Flagged', 'Internship flagged')}><Flag size={16} /></button>
                        )}
                        {i.status === 'Open' && (
                          <button type="button" className="adm-icon-btn" title="Close" aria-label={`Close ${i.title}`} onClick={() => act(i, 'Closed', 'Internship closed')}><Lock size={16} /></button>
                        )}
                        <button type="button" className="adm-icon-btn is-danger" title="Remove" aria-label={`Remove ${i.title}`} onClick={() => setDel(i)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {del && <ConfirmDialog danger title="Remove this internship?" confirmLabel="Remove"
        message={`“${del.title}” by ${del.company} will be permanently removed, including its applications.`}
        onClose={() => setDel(null)} onConfirm={() => { deleteInternship(del.id); toast('Internship removed') }} />}
      {toastNode}
    </div>
  )
}
