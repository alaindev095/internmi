
import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Users,
} from 'lucide-react'
import './CompanyAnalytics.css'

const weeklyData = [
  { day: 'Mon', applications: 12 },
  { day: 'Tue', applications: 19 },
  { day: 'Wed', applications: 15 },
  { day: 'Thu', applications: 28 },
  { day: 'Fri', applications: 23 },
  { day: 'Sat', applications: 35 },
  { day: 'Sun', applications: 30 },
]

const monthlyData = [
  { day: 'Week 1', applications: 42 },
  { day: 'Week 2', applications: 58 },
  { day: 'Week 3', applications: 49 },
  { day: 'Week 4', applications: 76 },
]

const quarterlyData = [
  { day: 'Aug', applications: 110 },
  { day: 'Sep', applications: 145 },
  { day: 'Oct', applications: 182 },
]

const statusData = [
  { label: 'Pending', count: 34, color: '#94a3b8' },
  { label: 'Reviewing', count: 26, color: '#64748b' },
  { label: 'Shortlisted', count: 18, color: '#2563eb' },
  { label: 'Accepted', count: 12, color: '#16a34a' },
  { label: 'Rejected', count: 10, color: '#dc2626' },
]

const internshipData = [
  { title: 'Frontend Developer Intern', trade: 'SWD', applications: 42 },
  { title: 'Network Support Intern', trade: 'NIT', applications: 31 },
  { title: 'Database Intern', trade: 'CSA', applications: 24 },
  { title: 'IT Support Intern', trade: 'NIT', applications: 18 },
]

const tradeData = [
  { trade: 'SWD', label: 'Software Development', count: 42 },
  { trade: 'NIT', label: 'Networking & IT', count: 49 },
  { trade: 'CSA', label: 'Computer Systems & Architecture', count: 24 },
]

function CompanyAnalytics() {
  const [period, setPeriod] = useState('30 days')

  const chartData = useMemo(() => {
    if (period === '7 days') return weeklyData
    if (period === '90 days') return quarterlyData
    return monthlyData
  }, [period])

  const maxApplications = Math.max(
    ...chartData.map((item) => item.applications),
    1
  )

  const totalStatusApplications = statusData.reduce(
    (sum, item) => sum + item.count,
    0
  )

  const totalTradeApplications = tradeData.reduce(
    (sum, item) => sum + item.count,
    0
  )

  function exportReport() {
    const rows = [
      ['Internmi Company Analytics'],
      ['Report period', period],
      [],
      ['Application status', 'Count'],
      ...statusData.map((item) => [item.label, item.count]),
      [],
      ['Internship', 'Trade', 'Applications'],
      ...internshipData.map((item) => [
        item.title,
        item.trade,
        item.applications,
      ]),
      [],
      ['Trade', 'Description', 'Applications'],
      ...tradeData.map((item) => [
        item.trade,
        item.label,
        item.count,
      ]),
    ]

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'internmi-company-analytics.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="company-analytics">
      <div className="analytics-heading">
        <div>
          <span className="company-eyebrow">PERFORMANCE</span>
          <h1>Analytics</h1>
          <p>
            Understand your recruitment performance and internship
            applications.
          </p>
        </div>

        <div className="analytics-heading-actions">
          <label className="analytics-period">
            <span className="sr-only">Report period</span>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
            </select>
            <ChevronDown size={16} />
          </label>

          <button
            className="analytics-export"
            type="button"
            onClick={exportReport}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="analytics-demo-notice">
        <Activity size={18} />
        <span>
          Demo analytics — these figures are sample data, not live
          company records.
        </span>
      </div>

      <section className="analytics-metrics">
        <article className="analytics-metric-card">
          <div className="analytics-metric-top">
            <span>Total applications</span>
            <span className="analytics-icon-box">
              <FileText size={19} />
            </span>
          </div>
          <strong>125</strong>
          <div className="analytics-metric-foot">
            <span className="analytics-positive">
              <ArrowUpRight size={15} /> 12%
            </span>
            <span>vs. previous period</span>
          </div>
        </article>

        <article className="analytics-metric-card">
          <div className="analytics-metric-top">
            <span>Active internships</span>
            <span className="analytics-icon-box">
              <BriefcaseBusiness size={19} />
            </span>
          </div>
          <strong>4</strong>
          <div className="analytics-metric-foot">
            <span className="analytics-neutral">3 published</span>
            <span>1 draft</span>
          </div>
        </article>

        <article className="analytics-metric-card">
          <div className="analytics-metric-top">
            <span>Shortlisted</span>
            <span className="analytics-icon-box">
              <Users size={19} />
            </span>
          </div>
          <strong>18</strong>
          <div className="analytics-metric-foot">
            <span className="analytics-positive">
              <ArrowUpRight size={15} /> 8%
            </span>
            <span>vs. previous period</span>
          </div>
        </article>

        <article className="analytics-metric-card">
          <div className="analytics-metric-top">
            <span>Acceptance rate</span>
            <span className="analytics-icon-box">
              <CheckCircle2 size={19} />
            </span>
          </div>
          <strong>12%</strong>
          <div className="analytics-metric-foot">
            <span className="analytics-negative">
              <ArrowDownRight size={15} /> 2%
            </span>
            <span>vs. previous period</span>
          </div>
        </article>
      </section>

      <section className="analytics-main-grid">
        <article className="analytics-panel analytics-trend-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Application trends</h2>
              <p>Applications received over time</p>
            </div>
            <span className="analytics-panel-icon">
              <Activity size={19} />
            </span>
          </div>

          <div className="analytics-chart-summary">
            <strong>
              {chartData
                .reduce((sum, item) => sum + item.applications, 0)}
            </strong>
            <span> applications in selected view</span>
          </div>

          <div
            className="analytics-bar-chart"
            role="img"
            aria-label={`Application trend chart for ${period}`}
          >
            {chartData.map((item) => (
              <div className="analytics-bar-column" key={item.day}>
                <span className="analytics-bar-value">
                  {item.applications}
                </span>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar"
                    style={{
                      height: `${(item.applications / maxApplications) * 100}%`,
                    }}
                  />
                </div>
                <span className="analytics-bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Application status</h2>
              <p>Breakdown by recruitment stage</p>
            </div>
          </div>

          <div className="analytics-status-total">
            <strong>{totalStatusApplications}</strong>
            <span>sample applications</span>
          </div>

          <div className="analytics-status-list">
            {statusData.map((item) => (
              <div className="analytics-status-item" key={item.label}>
                <div className="analytics-status-label">
                  <span
                    className="analytics-status-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="analytics-progress-track">
                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${(item.count / totalStatusApplications) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="analytics-lower-grid">
        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Top internships</h2>
              <p>Positions attracting the most applications</p>
            </div>
          </div>

          <div className="analytics-internship-list">
            {internshipData.map((item, index) => (
              <div className="analytics-internship-item" key={item.title}>
                <span className="analytics-rank">{index + 1}</span>
                <div className="analytics-internship-info">
                  <strong>{item.title}</strong>
                  <span>{item.trade}</span>
                  <div className="analytics-progress-track">
                    <div
                      className="analytics-progress-fill analytics-internship-fill"
                      style={{
                        width: `${(item.applications / internshipData[0].applications) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <strong className="analytics-internship-count">
                  {item.applications}
                </strong>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Applications by trade</h2>
              <p>Which fields attract the most candidates?</p>
            </div>
          </div>

          <div className="analytics-trade-total">
            <strong>{totalTradeApplications}</strong>
            <span>applications across all trades</span>
          </div>

          <div className="analytics-trade-list">
            {tradeData.map((item) => (
              <div className="analytics-trade-item" key={item.trade}>
                <div className="analytics-trade-symbol">{item.trade}</div>
                <div className="analytics-trade-info">
                  <strong>{item.label}</strong>
                  <div className="analytics-progress-track">
                    <div
                      className="analytics-progress-fill analytics-trade-fill"
                      style={{
                        width: `${(item.count / Math.max(...tradeData.map((trade) => trade.count))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <p className="analytics-footer-note">
        Analytics update automatically once connected to real application
        and internship records.
      </p>
    </div>
  )
}

export default CompanyAnalytics
