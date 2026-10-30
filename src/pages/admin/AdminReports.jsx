import { useMemo } from 'react'
import { Download, GraduationCap, Briefcase, School, TrendingUp } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { PageHeader, StatCard, downloadCsv } from './ui'

function Bars({ rows, accent, suffix = '' }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return rows.length === 0 ? <p className="adm-muted">No data yet.</p> : rows.map((r) => (
    <div className="adm-bar-row" key={r.label}>
      <div className="adm-bar-label"><strong>{r.label}</strong><span>{r.value}{suffix}{r.note ? ` · ${r.note}` : ''}</span></div>
      <div className={`adm-bar-track${accent ? ' is-accent' : ''}`}><div style={{ width: `${(r.value / max) * 100}%` }} /></div>
    </div>
  ))
}

export default function AdminReports() {
  const { schools, internships } = useAdminData()

  const d = useMemo(() => {
    const students = schools.reduce((n, s) => n + s.students, 0)
    const placed = schools.reduce((n, s) => n + s.placed, 0)
    const byDistrict = {}
    schools.forEach((s) => { byDistrict[s.district] = (byDistrict[s.district] || 0) + s.students })
    const byTrade = {}
    internships.forEach((i) => { byTrade[i.trade] = (byTrade[i.trade] || 0) + i.slots })
    return {
      students, placed,
      rate: students ? Math.round((placed / students) * 100) : 0,
      slots: internships.filter((i) => i.status === 'Open').reduce((n, i) => n + i.slots, 0),
      schoolRows: [...schools].filter((s) => s.students).map((s) => ({
        label: s.name, value: Math.round((s.placed / s.students) * 100), note: `${s.placed}/${s.students}`,
      })).sort((a, b) => b.value - a.value),
      districtRows: Object.entries(byDistrict).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      tradeRows: Object.entries(byTrade).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    }
  }, [schools, internships])

  return (
    <div className="adm-page">
      <PageHeader title="Reports" description="Platform-wide figures for ministries, partners and management.">
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => downloadCsv('placement-report.csv', [
          ['School', 'Code', 'Province', 'District', 'Status', 'Classes', 'Students', 'Placed', 'Placement rate %'],
          ...schools.map((s) => [s.name, s.code, s.province, s.district, s.status, s.classes, s.students, s.placed, s.students ? Math.round((s.placed / s.students) * 100) : 0]),
        ])}><Download size={15} /> Export school report</button>
      </PageHeader>

      <section className="adm-stats">
        <StatCard icon={School} label="Schools" value={schools.length} />
        <StatCard icon={GraduationCap} label="Students" value={d.students.toLocaleString()} />
        <StatCard icon={Briefcase} label="Open internship slots" value={d.slots} />
        <StatCard icon={TrendingUp} label="Placement rate" value={`${d.rate}%`} hint={`${d.placed} placed`} tone="success" />
      </section>

      <div className="adm-grid-even">
        <section className="adm-card"><div className="adm-card-head"><h2>Placement rate by school</h2></div><Bars rows={d.schoolRows} accent suffix="%" /></section>
        <section className="adm-card"><div className="adm-card-head"><h2>Students by district</h2></div><Bars rows={d.districtRows} /></section>
        <section className="adm-card"><div className="adm-card-head"><h2>Internship slots by trade</h2></div><Bars rows={d.tradeRows} /></section>
      </div>
    </div>
  )
}
