
import { useMemo, useState } from 'react'
import {
  Users,
  BriefcaseBusiness,
  FileText,
  CircleCheck,
  Download,
  ChartNoAxesCombined,
} from 'lucide-react'
import './SchoolPages.css'
import './SchoolReports.css'

const reportData = {
  totalStudents: 1248,
  seekingInternships: 186,
  applications: 94,
  placements: 142,
  applicationsByStatus: [
    { label: 'Pending', value: 23 },
    { label: 'Accepted', value: 48 },
    { label: 'Rejected', value: 23 },
  ],
  classes: [
    { name: 'L5 Software Development A', trade: 'Software Development', students: 42, seeking: 12, placed: 30 },
    { name: 'L5 Networking A', trade: 'Networking', students: 38, seeking: 8, placed: 24 },
    { name: 'L4 Software Development B', trade: 'Software Development', students: 46, seeking: 15, placed: 25 },
    { name: 'L5 Computer Systems A', trade: 'Computer Systems', students: 35, seeking: 9, placed: 22 },
    { name: 'L4 Networking B', trade: 'Networking', students: 40, seeking: 11, placed: 27 },
  ],
}

const reports = [
  {
    title: 'Student enrollment',
    description: 'Enrollment across classes and trades.',
    file: 'student-enrollment',
  },
  {
    title: 'Internship participation',
    description: 'Students seeking internships and confirmed placements.',
    file: 'internship-participation',
  },
  {
    title: 'Application summary',
    description: 'Applications grouped by current status.',
    file: 'application-summary',
  },
]

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? '')
          return `"${text.replace(/"/g, '""')}"`
        })
        .join(','),
    )
    .join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function getReportRows(reportTitle) {
  if (reportTitle === 'Student enrollment') {
    return [
      ['Class', 'Trade', 'Students'],
      ...reportData.classes.map((item) => [
        item.name,
        item.trade,
        item.students,
      ]),
    ]
  }

  if (reportTitle === 'Internship participation') {
    return [
      ['Class', 'Students', 'Seeking placement', 'Placed'],
      ...reportData.classes.map((item) => [
        item.name,
        item.students,
        item.seeking,
        item.placed,
      ]),
    ]
  }

  return [
    ['Application status', 'Count'],
    ...reportData.applicationsByStatus.map((item) => [
      item.label,
      item.value,
    ]),
  ]
}

export default function SchoolReports() {
  const [period, setPeriod] = useState('2026')
  const [trade, setTrade] = useState('All trades')
  const [exportMessage, setExportMessage] = useState('')

  const filteredClasses = useMemo(() => {
    return reportData.classes.filter(
      (item) => trade === 'All trades' || item.trade === trade,
    )
  }, [trade])

  const filteredStudentCount = filteredClasses.reduce(
    (total, item) => total + item.students,
    0,
  )

  const filteredSeeking = filteredClasses.reduce(
    (total, item) => total + item.seeking,
    0,
  )

  const filteredPlaced = filteredClasses.reduce(
    (total, item) => total + item.placed,
    0,
  )

  function exportReport(title) {
    downloadCsv(
      `internmi-${title.toLowerCase().replace(/\s+/g, '-')}-${period}`,
      getReportRows(title),
    )
    setExportMessage(`${title} CSV export started.`)
  }

  function exportAll() {
    downloadCsv(`internmi-school-report-${period}`, [
      ['Internmi School Report', period],
      [],
      ['Summary', 'Value'],
      ['Total students', reportData.totalStudents],
      ['Students seeking internships', reportData.seekingInternships],
      ['Applications', reportData.applications],
      ['Confirmed placements', reportData.placements],
      [],
      ['Class', 'Trade', 'Students', 'Seeking placement', 'Placed'],
      ...filteredClasses.map((item) => [
        item.name,
        item.trade,
        item.students,
        item.seeking,
        item.placed,
      ]),
      [],
      ['Application status', 'Count'],
      ...reportData.applicationsByStatus.map((item) => [
        item.label,
        item.value,
      ]),
    ])
    setExportMessage('School report CSV export started.')
  }

  const stats = [
    {
      label: 'Total students',
      value: reportData.totalStudents.toLocaleString(),
      detail: 'Registered students',
      Icon: Users,
    },
    {
      label: 'Seeking internships',
      value: reportData.seekingInternships.toLocaleString(),
      detail: 'Students seeking placement',
      Icon: BriefcaseBusiness,
    },
    {
      label: 'Applications',
      value: reportData.applications.toLocaleString(),
      detail: 'Recorded applications',
      Icon: FileText,
    },
    {
      label: 'Confirmed placements',
      value: reportData.placements.toLocaleString(),
      detail: 'Students placed',
      Icon: CircleCheck,
    },
  ]

  return (
    <div className="school-page school-reports">
      <header className="school-page-heading">
        <div>
          <span className="school-report-eyebrow">SCHOOL MANAGEMENT</span>
          <h1>School reports</h1>
          <p>
            Review enrollment, internship participation, applications, and
            student placement progress.
          </p>
        </div>

        <button className="school-report-export-all" onClick={exportAll}>
          <Download size={16} />
          Export report
        </button>
      </header>

      <div className="school-report-demo-notice">
        Demonstration data — these figures are examples and are not yet
        connected to your school's database.
      </div>

      <div className="school-report-filters">
        <label>
          Academic year
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </label>

        <label>
          Trade
          <select value={trade} onChange={(event) => setTrade(event.target.value)}>
            <option>All trades</option>
            <option>Software Development</option>
            <option>Networking</option>
            <option>Computer Systems</option>
          </select>
        </label>
      </div>

      <section className="school-page-stats">
        {stats.map(({ label, value, detail, Icon }) => (
          <article key={label}>
            <Icon />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <section className="school-page-panel">
        <div className="school-report-section-heading">
          <div>
            <h2>Internship placement progress</h2>
            <p>
              Class-level placement figures for {period}
              {trade !== 'All trades' ? ` · ${trade}` : ''}.
            </p>
          </div>
          <ChartNoAxesCombined size={22} />
        </div>

        <div className="school-report-overview">
          <div>
            <span>Students in filtered classes</span>
            <strong>{filteredStudentCount.toLocaleString()}</strong>
          </div>
          <div>
            <span>Seeking placement</span>
            <strong>{filteredSeeking.toLocaleString()}</strong>
          </div>
          <div>
            <span>Placed in internships</span>
            <strong>{filteredPlaced.toLocaleString()}</strong>
          </div>
        </div>

        <div className="school-report-bars">
          {filteredClasses.map((item) => {
            const placementRate = item.students
              ? Math.min(100, Math.round((item.placed / item.students) * 100))
              : 0

            return (
              <div className="school-report-row" key={item.name}>
                <div className="school-report-label">
                  <strong>{item.name}</strong>
                  <span>
                    {item.placed} of {item.students} placed · {placementRate}%
                  </span>
                </div>
                <div className="school-report-track">
                  <div style={{ width: `${placementRate}%` }} />
                </div>
              </div>
            )
          })}

          {filteredClasses.length === 0 && (
            <p className="school-page-note">
              No classes match this trade.
            </p>
          )}
        </div>
      </section>

      <section className="school-page-panel">
        <div className="school-report-section-heading">
          <div>
            <h2>Application status</h2>
            <p>Example breakdown of recorded applications.</p>
          </div>
        </div>

        <div className="school-report-status-grid">
          {reportData.applicationsByStatus.map((item) => {
            const percent = reportData.applications
              ? Math.round((item.value / reportData.applications) * 100)
              : 0

            return (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <div className="school-report-track">
                  <div style={{ width: `${percent}%` }} />
                </div>
                <small>{percent}% of applications</small>
              </article>
            )
          })}
        </div>
      </section>

      <section className="school-page-panel">
        <div className="school-report-section-heading">
          <div>
            <h2>Available reports</h2>
            <p>Export report data as CSV for further analysis.</p>
          </div>
        </div>

        <div className="school-report-download-list">
          {reports.map((report) => (
            <article key={report.file}>
              <div className="school-report-file-icon">
                <FileText size={19} />
              </div>
              <div className="school-report-file-info">
                <strong>{report.title}</strong>
                <span>{report.description}</span>
              </div>
              <button onClick={() => exportReport(report.title)}>
                <Download size={15} />
                <span>CSV</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {exportMessage && (
        <p className="school-report-feedback" role="status">
          {exportMessage}
        </p>
      )}
    </div>
  )
}
