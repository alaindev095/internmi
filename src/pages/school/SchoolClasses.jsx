
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Search,
  Users,
  GraduationCap,
  X,
  Eye,
  UserPlus,
  Upload,
  Download,
  MoreHorizontal,
} from 'lucide-react'
import './SchoolClasses.css'

const initialClasses = [
  {
    id: 'class-1',
    name: 'L5 Software Development A',
    level: 'L5',
    trade: 'Software Development',
    year: '2026',
    teacher: 'Jean Claude',
    students: [
      { id: 'ST001', name: 'Eric Niyonzima', email: 'eric@example.com' },
      { id: 'ST002', name: 'Alice Kayitesi', email: 'alice@example.com' },
      { id: 'ST003', name: 'Patrick Mugisha', email: 'patrick@example.com' },
    ],
  },
  {
    id: 'class-2',
    name: 'L5 Networking A',
    level: 'L5',
    trade: 'Networking',
    year: '2026',
    teacher: 'Marie Uwase',
    students: [
      { id: 'ST004', name: 'David Habimana', email: 'david@example.com' },
      { id: 'ST005', name: 'Grace Mukamana', email: 'grace@example.com' },
    ],
  },
  {
    id: 'class-3',
    name: 'L4 Software Development B',
    level: 'L4',
    trade: 'Software Development',
    year: '2026',
    teacher: 'Jean Claude',
    students: [
      { id: 'ST006', name: 'Kevin Iradukunda', email: 'kevin@example.com' },
      { id: 'ST007', name: 'Diane Uwamahoro', email: 'diane@example.com' },
    ],
  },
]

const emptyForm = {
  name: '',
  level: 'L5',
  trade: 'Software Development',
  year: '2026',
  teacher: '',
}

function downloadTemplate() {
  const csv = [
    'student_id,full_name,email',
    'ST001,Eric Niyonzima,eric@example.com',
    'ST002,Alice Kayitesi,alice@example.com',
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'internmi-student-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function SchoolClasses() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [classes, setClasses] = useState(initialClasses)
  const [search, setSearch] = useState('')
  const [tradeFilter, setTradeFilter] = useState('All trades')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [newStudent, setNewStudent] = useState({ name: '', email: '' })
  const [studentError, setStudentError] = useState('')
  const [classError, setClassError] = useState('')
  const [importMessage, setImportMessage] = useState('')

  const selectedClass = classes.find((item) => item.id === id)

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase()

    return classes.filter((item) => {
      const matchesSearch = [
        item.name,
        item.trade,
        item.level,
        item.teacher,
      ].some((value) => value.toLowerCase().includes(query))

      return (
        matchesSearch &&
        (tradeFilter === 'All trades' || item.trade === tradeFilter)
      )
    })
  }, [classes, search, tradeFilter])

  function createClass(event) {
    event.preventDefault()
    setClassError('')

    if (!form.name.trim()) {
      setClassError('Please enter a class name.')
      return
    }

    const newClass = {
      ...form,
      id: `class-${Date.now()}`,
      name: form.name.trim(),
      teacher: form.teacher.trim() || 'Not assigned',
      students: [],
    }

    setClasses((current) => [...current, newClass])
    setShowCreate(false)
    setForm(emptyForm)
  }

  function addStudent(event) {
    event.preventDefault()
    setStudentError('')

    if (!newStudent.name.trim()) {
      setStudentError('Please enter the student name.')
      return
    }

    if (!newStudent.email.trim() || !newStudent.email.includes('@')) {
      setStudentError('Please enter a valid email address.')
      return
    }

    const duplicate = classes.some((classItem) =>
      classItem.students.some(
        (student) =>
          student.email.toLowerCase() === newStudent.email.trim().toLowerCase(),
      ),
    )

    if (duplicate) {
      setStudentError('A student with this email already exists in the demo data.')
      return
    }

    setClasses((current) =>
      current.map((classItem) => {
        if (classItem.id !== id) return classItem

        return {
          ...classItem,
          students: [
            ...classItem.students,
            {
              id: `ST${Date.now().toString().slice(-6)}`,
              name: newStudent.name.trim(),
              email: newStudent.email.trim(),
            },
          ],
        }
      }),
    )

    setNewStudent({ name: '', email: '' })
  }

  function importStudents(event) {
    const file = event.target.files?.[0]
    if (!file || !selectedClass) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setImportMessage('For this prototype, please upload a CSV file.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const text = String(reader.result || '')
      const lines = text.split(/\r?\n/).filter((line) => line.trim())

      if (lines.length < 2) {
        setImportMessage('The CSV file has no student rows to import.')
        return
      }

      const parsed = lines.slice(1).map((line) => {
        const [studentId, ...rest] = line.split(',')
        const email = rest.pop()?.trim() || ''
        const name = rest.join(',').trim()

        return {
          id: studentId?.trim() || `ST${Date.now()}`,
          name,
          email,
        }
      })

      const valid = parsed.filter(
        (student) =>
          student.name &&
          student.email.includes('@'),
      )

      const existingEmails = new Set(
        classes.flatMap((item) =>
          item.students.map((student) => student.email.toLowerCase()),
        ),
      )

      const unique = valid.filter(
        (student) => !existingEmails.has(student.email.toLowerCase()),
      )

      if (!unique.length) {
        setImportMessage('No valid new students were found. Check the CSV columns and duplicate emails.')
        return
      }

      setClasses((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, students: [...item.students, ...unique] }
            : item,
        ),
      )

      setImportMessage(
        `Imported ${unique.length} student(s). ${parsed.length - unique.length} row(s) were skipped or invalid.`,
      )
    }

    reader.onerror = () => {
      setImportMessage('Could not read the selected file.')
    }

    reader.readAsText(file)
    event.target.value = ''
  }

  if (id) {
    if (!selectedClass) {
      return (
        <div className="school-classes">
          <button className="sc-back-button" onClick={() => navigate('/school/classes')}>
            <ArrowLeft size={16} /> Back to classes
          </button>
          <h2>Class not found</h2>
          <p>This class may not exist in the current demonstration data.</p>
        </div>
      )
    }

    return (
      <div className="school-classes">
        <button
          className="sc-back-button"
          onClick={() => navigate('/school/classes')}
        >
          <ArrowLeft size={16} /> All classes
        </button>

        <header className="sc-page-header">
          <div>
            <span className="sc-eyebrow">CLASS MANAGEMENT</span>
            <h1>{selectedClass.name}</h1>
            <p>
              {selectedClass.trade} · {selectedClass.year} ·{' '}
              {selectedClass.teacher}
            </p>
          </div>

          <button className="sc-primary-button" onClick={downloadTemplate}>
            <Download size={16} /> CSV template
          </button>
        </header>

        <div className="sc-notice">
          Demonstration mode — changes are temporary and are not saved to your database.
        </div>

        <div className="sc-summary-grid">
          <article className="sc-summary-card">
            <span><Users size={18} /></span>
            <p>Students in class</p>
            <strong>{selectedClass.students.length}</strong>
          </article>
          <article className="sc-summary-card">
            <span><BookOpen size={18} /></span>
            <p>Trade</p>
            <strong className="sc-summary-trade">{selectedClass.trade}</strong>
          </article>
          <article className="sc-summary-card">
            <span><GraduationCap size={18} /></span>
            <p>Academic year</p>
            <strong>{selectedClass.year}</strong>
          </article>
        </div>

        <section className="sc-panel">
          <div className="sc-panel-header">
            <div>
              <h2>Class roster</h2>
              <p>Students assigned to this class.</p>
            </div>
            <span className="sc-count">{selectedClass.students.length} students</span>
          </div>

          <form className="sc-add-student" onSubmit={addStudent}>
            <label>
              Student full name
              <input
                value={newStudent.name}
                onChange={(event) =>
                  setNewStudent({ ...newStudent, name: event.target.value })
                }
                placeholder="Enter full name"
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={newStudent.email}
                onChange={(event) =>
                  setNewStudent({ ...newStudent, email: event.target.value })
                }
                placeholder="student@example.com"
              />
            </label>
            <button className="sc-primary-button" type="submit">
              <UserPlus size={16} /> Add student
            </button>
          </form>

          {studentError && <p className="sc-error">{studentError}</p>}
          {importMessage && <p className="sc-import-message">{importMessage}</p>}

          <div className="sc-import-row">
            <label className="sc-secondary-button sc-upload-label">
              <Upload size={15} /> Import students from CSV
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={importStudents}
              />
            </label>
            <button className="sc-text-button" onClick={downloadTemplate}>
              Download template
            </button>
          </div>

          <div className="sc-table-wrap">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>STUDENT ID</th>
                  <th>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {selectedClass.students.map((student) => (
                  <tr key={`${student.id}-${student.email}`}>
                    <td>
                      <div className="sc-student-name">
                        <span>
                          {student.name
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </span>
                        <strong>{student.name}</strong>
                      </div>
                    </td>
                    <td>{student.id}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
                {selectedClass.students.length === 0 && (
                  <tr>
                    <td colSpan={3} className="sc-empty">
                      No students in this class yet. Add a student or import a CSV.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  const studentTotal = classes.reduce(
    (total, item) => total + item.students.length,
    0,
  )

  return (
    <div className="school-classes">
      <header className="sc-page-header">
        <div>
          <span className="sc-eyebrow">SCHOOL MANAGEMENT</span>
          <h1>Classes</h1>
          <p>Organize classes, assign trades, and manage student rosters.</p>
        </div>
        <button
          className="sc-primary-button"
          onClick={() => {
            setClassError('')
            setShowCreate(true)
          }}
        >
          <Plus size={17} /> Create class
        </button>
      </header>

      <div className="sc-notice">
        Demonstration data — classes and student changes are stored only in this page's temporary state.
      </div>

      <div className="sc-summary-grid">
        <article className="sc-summary-card">
          <span><BookOpen size={18} /></span>
          <p>Total classes</p>
          <strong>{classes.length}</strong>
        </article>
        <article className="sc-summary-card">
          <span><Users size={18} /></span>
          <p>Students in classes</p>
          <strong>{studentTotal}</strong>
        </article>
        <article className="sc-summary-card">
          <span><GraduationCap size={18} /></span>
          <p>Trades represented</p>
          <strong>{new Set(classes.map((item) => item.trade)).size}</strong>
        </article>
      </div>

      <section className="sc-panel">
        <div className="sc-panel-header">
          <div>
            <h2>All classes</h2>
            <p>View and manage the classes in your school.</p>
          </div>
          <span className="sc-count">{filteredClasses.length} classes</span>
        </div>

        <div className="sc-toolbar">
          <label className="sc-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search classes, trades, teachers..."
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </label>

          <select
            value={tradeFilter}
            onChange={(event) => setTradeFilter(event.target.value)}
            aria-label="Filter classes by trade"
            className="sc-filter"
          >
            <option>All trades</option>
            <option>Software Development</option>
            <option>Networking</option>
            <option>Computer Systems</option>
          </select>
        </div>

        <div className="sc-class-grid">
          {filteredClasses.map((item) => (
            <article className="sc-class-card" key={item.id}>
              <div className="sc-class-card-top">
                <span className="sc-class-icon"><BookOpen size={20} /></span>
                <button
                  className="sc-more-button"
                  title="View class"
                  onClick={() => navigate(`/school/classes/${item.id}`)}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <span className="sc-level">{item.level} · {item.year}</span>
              <h3>{item.name}</h3>
              <p className="sc-trade">{item.trade}</p>

              <div className="sc-class-meta">
                <span><Users size={15} /> {item.students.length} students</span>
                <span><GraduationCap size={15} /> {item.teacher}</span>
              </div>

              <button
                className="sc-open-class"
                onClick={() => navigate(`/school/classes/${item.id}`)}
              >
                Manage class <Eye size={15} />
              </button>
            </article>
          ))}

          {filteredClasses.length === 0 && (
            <div className="sc-no-results">
              <BookOpen size={26} />
              <strong>No classes found</strong>
              <p>Try another search or trade filter.</p>
            </div>
          )}
        </div>
      </section>

      {showCreate && (
        <div
          className="sc-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCreate(false)
          }}
        >
          <section className="sc-modal" role="dialog" aria-modal="true" aria-labelledby="sc-create-title">
            <header className="sc-modal-header">
              <div>
                <span className="sc-eyebrow">SCHOOL SETUP</span>
                <h2 id="sc-create-title">Create a class</h2>
                <p>Enter the class details below.</p>
              </div>
              <button className="sc-close-button" onClick={() => setShowCreate(false)} aria-label="Close">
                <X size={18} />
              </button>
            </header>

            <form className="sc-create-form" onSubmit={createClass}>
              <label>
                Class name *
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="e.g. L5 Software Development A"
                />
              </label>

              <div className="sc-form-row">
                <label>
                  Level
                  <select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
                    <option>L3</option>
                    <option>L4</option>
                    <option>L5</option>
                    <option>L6</option>
                  </select>
                </label>
                <label>
                  Academic year
                  <input
                    value={form.year}
                    onChange={(event) => setForm({ ...form, year: event.target.value })}
                    placeholder="2026"
                    required
                  />
                </label>
              </div>

              <label>
                Trade
                <select value={form.trade} onChange={(event) => setForm({ ...form, trade: event.target.value })}>
                  <option>Software Development</option>
                  <option>Networking</option>
                  <option>Computer Systems</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Class teacher (optional)
                <input
                  value={form.teacher}
                  onChange={(event) => setForm({ ...form, teacher: event.target.value })}
                  placeholder="Enter teacher name"
                />
              </label>

              {classError && <p className="sc-error">{classError}</p>}

              <div className="sc-modal-actions">
                <button type="button" className="sc-secondary-button" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="sc-primary-button">
                  <Plus size={16} /> Create class
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
