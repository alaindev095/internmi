import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { Empty, PageHeader, downloadCsv, formatDateTime } from './ui'

export default function AdminAudit() {
  const { audit } = useAdminData()
  const [search, setSearch] = useState('')
  const [actor, setActor] = useState('All')
  const actors = [...new Set(audit.map((a) => a.actor))]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return audit.filter((a) => (actor === 'All' || a.actor === actor) &&
      (!q || [a.action, a.target, a.actor].some((v) => v.toLowerCase().includes(q))))
  }, [audit, search, actor])

  return (
    <div className="adm-page">
      <PageHeader title="Audit log" description="A record of every administrative action: who did what, and when.">
        <button type="button" className="adm-btn" onClick={() => downloadCsv('audit-log.csv', [['When', 'Admin', 'Action', 'Target'], ...filtered.map((a) => [a.at, a.actor, a.action, a.target])])}><Download size={15} /> Export</button>
      </PageHeader>
      <section className="adm-card">
        <div className="adm-toolbar">
          <label className="adm-search"><Search size={16} />
            <input placeholder="Search actions..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search audit log" />
          </label>
          <select className="adm-select" value={actor} onChange={(e) => setActor(e.target.value)} aria-label="Filter by admin">
            <option value="All">All admins</option>{actors.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <Empty title="No matching entries" /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Target</th></tr></thead>
              <tbody>{filtered.map((a) => (
                <tr key={a.id}><td>{formatDateTime(a.at)}</td><td>{a.actor}</td><td><strong>{a.action}</strong></td><td>{a.target}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
