
import { useMemo, useState } from 'react'
import {
  Users,
  UserPlus,
  UserRoundCheck,
  UserRoundX,
  Search,
  Plus,
  X,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  Pencil,
  Eye,
  UserCheck,
  UserX,
  Clock3,
} from 'lucide-react'
import './SchoolPages.css'
import './SchoolStaff.css'

const initialStaff = [
  {
    id: 'STF-001',
    name: 'Jean Claude',
    email: 'jean.claude@example.com',
    role: 'Headmaster',
    status: 'Active',
    createdAt: '2026-01-12',
  },
  {
    id: 'STF-002',
    name: 'Marie Uwase',
    email: 'marie.uwase@example.com',
    role: 'Director of Studies',
    status: 'Active',
    createdAt: '2026-01-15',
  },
  {
    id: 'STF-003',
    name: 'Patrick Nkurunziza',
    email: 'patrick.n@example.com',
    role: 'Teacher in Charge of Internship',
    status: 'Active',
    createdAt: '2026-02-02',
  },
  {
    id: 'STF-004',
    name: 'Alice Mukamana',
    email: 'alice.m@example.com',
    role: 'Teacher in Charge of Internship',
    status: 'Pending activation',
    createdAt: '2026-03-10',
  },
  {
    id: 'STF-005',
    name: 'David Habimana',
    email: 'david.h@example.com',
    role: 'Director of Studies',
    status: 'Inactive',
    createdAt: '2026-03-18',
  },
]

const roles = [
  'Headmaster',
  'Director of Studies',
  'Teacher in Charge of Internship',
]

const emptyForm = {
  name: '',
  email: '',
  role: 'Teacher in Charge of Internship',
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function downloadStaffCsv(staff) {
  const rows = [
    ['Staff ID', 'Full name', 'Email', 'Role', 'Status', 'Created date'],
    ...staff.map((person) => [
      person.id,
      person.name,
      person.email,
      person.role,
      person.status,
      person.createdAt,
    ]),
  ]

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'internmi-school-staff.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function SchoolStaff() {
  const [staff, setStaff] = useState(initialStaff)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [viewingId, setViewingId] = useState(null)
  const [menuId, setMenuId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const activeCount = staff.filter((person) => person.status === 'Active').length
  const inactiveCount = staff.filter((person) => person.status === 'Inactive').length
  const pendingCount = staff.filter(
    (person) => person.status === 'Pending activation',
  ).length

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase()

    return staff.filter((person) => {
      const matchesSearch = [
        person.name,
        person.email,
        person.role,
        person.id,
      ].some((value) => value.toLowerCase().includes(query))

      const matchesRole =
        roleFilter === 'All roles' || person.role === roleFilter

      const matchesStatus =
        statusFilter === 'All statuses' || person.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [staff, search, roleFilter, statusFilter])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setFeedback('')
    setShowForm(true)
  }

  function openEditForm(person) {
    setEditingId(person.id)
    setForm({
      name: person.name,
      email: person.email,
      role: person.role,
    })
    setError('')
    setFeedback('')
    setMenuId(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  function saveStaff(event) {
    event.preventDefault()
    setError('')
    setFeedback('')

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (!name || !email || !form.role) {
      setError('Please complete all required fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    const emailExists = staff.some(
      (person) =>
        person.email.toLowerCase() === email && person.id !== editingId,
    )

    if (emailExists) {
      setError('A staff account with this email already exists.')
      return
    }

    if (editingId) {
      setStaff((current) =>
        current.map((person) =>
          person.id === editingId
            ? { ...person, name, email, role: form.role }
            : person,
        ),
      )
      setFeedback('Staff details updated in demonstration data.')
    } else {
      const newPerson = {
        id: `STF-${String(Date.now()).slice(-6)}`,
        name,
        email,
        role: form.role,
        status: 'Pending activation',
        createdAt: new Date().toISOString().slice(0, 10),
      }

      setStaff((current) => [newPerson, ...current])
      setFeedback(
        'Demo staff record created with pending activation. No login or invitation has been created.',
      )
    }

    closeForm()
    setSearch('')
    setRoleFilter('All roles')
    setStatusFilter('All statuses')
  }

  function changeStatus(person) {
    setMenuId(null)

    if (person.status === 'Pending activation') {
      setStaff((current) =>
        current.map((item) =>
          item.id === person.id ? { ...item, status: 'Active' } : item,
        ),
      )
      setFeedback(
        `${person.name} marked active in demonstration data only. This does not activate a real login.`,
      )
      return
    }

    const nextStatus = person.status === 'Active' ? 'Inactive' : 'Active'

    setStaff((current) =>
      current.map((item) =>
        item.id === person.id ? { ...item, status: nextStatus } : item,
      ),
    )

    setFeedback(
      `${person.name} marked ${nextStatus.toLowerCase()} in demonstration data.`,
    )
  }

  const viewedPerson = staff.find((person) => person.id === viewingId)

  return (
    <div className="school-page school-staff-page">
      <header className="school-page-heading">
        <div>
          <span className="school-staff-eyebrow">SCHOOL MANAGEMENT</span>
          <h1>School staff</h1>
          <p>
            Manage staff accounts, assign responsibilities, and control access
            to your school's Internmi portal.
          </p>
        </div>

        <div className="school-staff-header-actions">
          <button
            className="school-staff-export"
            onClick={() => downloadStaffCsv(filteredStaff)}
          >
            <Users size={16} />
            Export CSV
          </button>
          <button className="school-staff-primary" onClick={openCreateForm}>
            <Plus size={17} />
            Add staff
          </button>
        </div>
      </header>

      <div className="school-staff-demo-notice">
        <ShieldCheck size={17} />
        <p>
          <strong>Demonstration mode.</strong> Staff records and status changes
          are temporary. Real account creation, password setup, and permissions
          require backend authentication.
        </p>
      </div>

      <section className="school-staff-stats">
        <article>
          <span className="school-staff-stat-icon staff-icon-purple">
            <Users size={19} />
          </span>
          <span className="school-staff-stat-label">Total staff</span>
          <strong>{staff.length}</strong>
          <small>Staff records in this demo</small>
        </article>

        <article>
          <span className="school-staff-stat-icon staff-icon-green">
            <UserRoundCheck size={19} />
          </span>
          <span className="school-staff-stat-label">Active accounts</span>
          <strong>{activeCount}</strong>
          <small>Marked active in this demo</small>
        </article>

        <article>
          <span className="school-staff-stat-icon staff-icon-orange">
            <Clock3 size={19} />
          </span>
          <span className="school-staff-stat-label">Pending activation</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting account setup</small>
        </article>

        <article>
          <span className="school-staff-stat-icon staff-icon-gray">
            <UserRoundX size={19} />
          </span>
          <span className="school-staff-stat-label">Inactive accounts</span>
          <strong>{inactiveCount}</strong>
          <small>Marked inactive in this demo</small>
        </article>
      </section>

      <section className="school-page-panel school-staff-directory">
        <div className="school-staff-section-heading">
          <div>
            <h2>Staff directory</h2>
            <p>Review staff members and manage their assigned roles.</p>
          </div>
          <span className="school-staff-count">
            {filteredStaff.length} staff
          </span>
        </div>

        <div className="school-page-toolbar school-staff-toolbar">
          <label className="school-page-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, role, or ID..."
              aria-label="Search staff"
            />
            {search && (
              <button
                type="button"
                className="school-staff-clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter by staff role"
          >
            <option>All roles</option>
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by account status"
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Pending activation</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="school-page-table-wrap">
          <table className="school-page-table school-staff-table">
            <thead>
              <tr>
                <th>STAFF MEMBER</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>DATE ADDED</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="school-staff-person">
                      <span className="school-staff-avatar">
                        {getInitials(person.name)}
                      </span>
                      <div className="school-staff-person-details">
                        <strong>{person.name}</strong>
                        <span>{person.email}</span>
                        <small>{person.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="school-staff-role">
                      {person.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`school-staff-status ${
                        person.status === 'Active'
                          ? 'status-active'
                          : person.status === 'Inactive'
                            ? 'status-inactive'
                            : 'status-pending'
                      }`}
                    >
                      <span />
                      {person.status}
                    </span>
                  </td>

                  <td>{formatDate(person.createdAt)}</td>

                  <td className="school-staff-actions-cell">
                    <div className="school-staff-action-wrap">
                      <button
                        className="school-staff-more"
                        aria-label={`Actions for ${person.name}`}
                        aria-expanded={menuId === person.id}
                        onClick={() =>
                          setMenuId(menuId === person.id ? null : person.id)
                        }
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {menuId === person.id && (
                        <div className="school-staff-action-menu">
                          <button
                            onClick={() => {
                              setViewingId(person.id)
                              setMenuId(null)
                            }}
                          >
                            <Eye size={15} /> View details
                          </button>
                          <button onClick={() => openEditForm(person)}>
                            <Pencil size={15} /> Edit staff
                          </button>
                          <button onClick={() => changeStatus(person)}>
                            {person.status === 'Active' ? (
                              <><UserX size={15} /> Deactivate</>
                            ) : (
                              <><UserCheck size={15} /> Mark active</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="school-staff-empty">
                      <Users size={28} />
                      <strong>No staff found</strong>
                      <span>Try different filters or add a staff member.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="school-staff-table-footer">
          <span>
            Showing {filteredStaff.length} of {staff.length} staff records
          </span>
          <button onClick={openCreateForm}>
            <UserPlus size={15} />
            Add staff member
          </button>
        </div>
      </section>

      {feedback && (
        <div className="school-staff-feedback" role="status">
          <ShieldCheck size={17} />
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback('')}
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {showForm && (
        <div
          className="school-staff-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm()
          }}
        >
          <section
            className="school-staff-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="school-staff-form-title"
          >
            <header className="school-staff-modal-header">
              <div>
                <span className="school-staff-eyebrow">STAFF MANAGEMENT</span>
                <h2 id="school-staff-form-title">
                  {editingId ? 'Edit staff member' : 'Add staff member'}
                </h2>
                <p>
                  {editingId
                    ? 'Update the staff member details and role.'
                    : 'Create a staff record ready for secure account activation.'}
                </p>
              </div>
              <button
                className="school-staff-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </header>

            {!editingId && (
              <div className="school-staff-activation-note">
                <Mail size={17} />
                <p>
                  The real system should send an activation link so the staff
                  member can set their own password. Never share a permanent
                  password manually.
                </p>
              </div>
            )}

            <form className="school-staff-form" onSubmit={saveStaff}>
              <label>
                Full name <span>*</span>
                <input
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter staff member's full name"
                />
              </label>

              <label>
                Email address <span>*</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="name@school.com"
                />
              </label>

              <label>
                School role <span>*</span>
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <small className="school-staff-field-help">
                  The role determines what the staff member should be allowed
                  to access. Enforce permissions on the server in production.
                </small>
              </label>

              {error && <p className="school-staff-form-error">{error}</p>}

              <div className="school-staff-modal-actions">
                <button
                  type="button"
                  className="school-staff-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="school-staff-primary"
                >
                  {editingId ? <Pencil size={16} /> : <UserPlus size={16} />}
                  {editingId ? 'Save changes' : 'Create staff record'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {viewedPerson && (
        <div
          className="school-staff-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setViewingId(null)
          }}
        >
          <section
            className="school-staff-modal school-staff-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="school-staff-detail-title"
          >
            <header className="school-staff-modal-header">
              <div>
                <span className="school-staff-eyebrow">STAFF PROFILE</span>
                <h2 id="school-staff-detail-title">Staff details</h2>
              </div>
              <button
                className="school-staff-close"
                onClick={() => setViewingId(null)}
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </header>

            <div className="school-staff-detail-profile">
              <span className="school-staff-avatar school-staff-avatar-large">
                {getInitials(viewedPerson.name)}
              </span>
              <h3>{viewedPerson.name}</h3>
              <p>{viewedPerson.role}</p>
              <span
                className={`school-staff-status ${
                  viewedPerson.status === 'Active'
                    ? 'status-active'
                    : viewedPerson.status === 'Inactive'
                      ? 'status-inactive'
                      : 'status-pending'
                }`}
              >
                <span />
                {viewedPerson.status}
              </span>
            </div>

            <div className="school-staff-detail-list">
              <div>
                <span>Staff ID</span>
                <strong>{viewedPerson.id}</strong>
              </div>
              <div>
                <span>Email address</span>
                <strong>{viewedPerson.email}</strong>
              </div>
              <div>
                <span>Date added</span>
                <strong>{formatDate(viewedPerson.createdAt)}</strong>
              </div>
            </div>

            <div className="school-staff-modal-actions">
              <button
                className="school-staff-cancel"
                onClick={() => setViewingId(null)}
              >
                Close
              </button>
              <button
                className="school-staff-primary"
                onClick={() => {
                  setViewingId(null)
                  openEditForm(viewedPerson)
                }}
              >
                <Pencil size={16} /> Edit details
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
