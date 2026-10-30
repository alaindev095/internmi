import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/* ------------------------------------------------------------------ *
 * Platform-admin data store.
 *
 * This is a front-end store persisted in localStorage so the admin
 * portal works end to end without a backend. Every function exposed
 * here maps 1:1 to an API call you will add later (POST /schools,
 * PATCH /schools/:id/status, POST /users/:id/reset-password, ...).
 * Swap the bodies for fetch() calls and keep the components as is.
 * ------------------------------------------------------------------ */

const STORAGE_KEY = 'umunara-admin-data-v1'

export const PROVINCES = {
  'Kigali City': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  Northern: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  Southern: [
    'Gisagara', 'Huye', 'Kamonyi', 'Muhanga',
    'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
  ],
  Eastern: [
    'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe',
    'Ngoma', 'Nyagatare', 'Rwamagana',
  ],
  Western: [
    'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke',
    'Rubavu', 'Rusizi', 'Rutsiro',
  ],
}

export const SCHOOL_TYPES = ['Public', 'Government-aided', 'Private']
export const ADMIN_ROLES = ['Super admin', 'Support admin', 'Analyst (read-only)']

const seedSchools = [
  {
    id: 'SCH-001', name: 'Gasabo TVET School', code: 'GSB-TVET', type: 'Public',
    province: 'Kigali City', district: 'Gasabo', address: 'KG 11 Ave, Kimironko',
    email: 'info@gasabotvet.example.rw', phone: '+250 788 000 101',
    adminName: 'Jean Claude Habimana', adminEmail: 'jc.habimana@gasabotvet.example.rw',
    status: 'Active', createdAt: '2026-01-12', classes: 8, students: 312, staff: 18, placed: 141,
  },
  {
    id: 'SCH-002', name: 'Musanze Polytechnic School', code: 'MSZ-POLY', type: 'Public',
    province: 'Northern', district: 'Musanze', address: 'Muhoza Sector',
    email: 'admin@musanzepoly.example.rw', phone: '+250 788 000 102',
    adminName: 'Marie Uwase', adminEmail: 'm.uwase@musanzepoly.example.rw',
    status: 'Active', createdAt: '2026-01-20', classes: 6, students: 248, staff: 14, placed: 97,
  },
  {
    id: 'SCH-003', name: 'Huye Technical College', code: 'HYE-TECH', type: 'Government-aided',
    province: 'Southern', district: 'Huye', address: 'Ngoma Sector',
    email: 'contact@huyetech.example.rw', phone: '+250 788 000 103',
    adminName: 'Patrick Nkurunziza', adminEmail: 'p.nkurunziza@huyetech.example.rw',
    status: 'Active', createdAt: '2026-02-03', classes: 7, students: 276, staff: 16, placed: 118,
  },
  {
    id: 'SCH-004', name: 'Rubavu TVET School', code: 'RBV-TVET', type: 'Public',
    province: 'Western', district: 'Rubavu', address: 'Gisenyi',
    email: 'info@rubavutvet.example.rw', phone: '+250 788 000 104',
    adminName: 'Alice Mukamana', adminEmail: 'a.mukamana@rubavutvet.example.rw',
    status: 'Active', createdAt: '2026-02-18', classes: 5, students: 190, staff: 11, placed: 64,
  },
  {
    id: 'SCH-005', name: 'Nyagatare Vocational Centre', code: 'NYG-VOC', type: 'Private',
    province: 'Eastern', district: 'Nyagatare', address: 'Nyagatare Town',
    email: 'hello@nyagataravoc.example.rw', phone: '+250 788 000 105',
    adminName: 'David Habimana', adminEmail: 'd.habimana@nyagataravoc.example.rw',
    status: 'Pending activation', createdAt: '2026-10-20', classes: 0, students: 0, staff: 1, placed: 0,
  },
  {
    id: 'SCH-006', name: 'Rusizi Technical School', code: 'RSZ-TECH', type: 'Government-aided',
    province: 'Western', district: 'Rusizi', address: 'Kamembe',
    email: 'office@rusizitech.example.rw', phone: '+250 788 000 106',
    adminName: 'Grace Mukamana', adminEmail: 'g.mukamana@rusizitech.example.rw',
    status: 'Suspended', createdAt: '2026-03-05', classes: 4, students: 120, staff: 8, placed: 22,
  },
]

const seedCompanies = [
  { id: 'CMP-001', name: 'Kigali Software Labs', sector: 'Software & ICT', district: 'Gasabo',
    email: 'hr@kigalilabs.example.rw', phone: '+250 788 200 001', contact: 'Eric Niyonzima',
    status: 'Verified', createdAt: '2026-02-01' },
  { id: 'CMP-002', name: 'Rwanda NetWorks Ltd', sector: 'Networking & Telecom', district: 'Nyarugenge',
    email: 'careers@rwnet.example.rw', phone: '+250 788 200 002', contact: 'Diane Uwamahoro',
    status: 'Verified', createdAt: '2026-02-09' },
  { id: 'CMP-003', name: 'GreenBuild Construction', sector: 'Construction', district: 'Kicukiro',
    email: 'info@greenbuild.example.rw', phone: '+250 788 200 003', contact: 'Kevin Iradukunda',
    status: 'Verified', createdAt: '2026-03-14' },
  { id: 'CMP-004', name: 'Lakeside Hospitality Group', sector: 'Hospitality', district: 'Rubavu',
    email: 'hr@lakeside.example.rw', phone: '+250 788 200 004', contact: 'Sandra Ingabire',
    status: 'Pending verification', createdAt: '2026-10-18' },
  { id: 'CMP-005', name: 'AgriTech Rwanda', sector: 'Agriculture', district: 'Bugesera',
    email: 'jobs@agritech.example.rw', phone: '+250 788 200 005', contact: 'Olivier Mugisha',
    status: 'Pending verification', createdAt: '2026-10-25' },
  { id: 'CMP-006', name: 'QuickFix Garage', sector: 'Automotive', district: 'Huye',
    email: 'quickfix@example.rw', phone: '+250 788 200 006', contact: 'Jean Bosco',
    status: 'Suspended', createdAt: '2026-04-02' },
]

const seedInternships = [
  { id: 'INT-001', title: 'Junior Web Developer Intern', company: 'Kigali Software Labs', district: 'Gasabo',
    trade: 'Software Development', slots: 5, applicants: 38, status: 'Open', postedAt: '2026-09-02' },
  { id: 'INT-002', title: 'Network Support Intern', company: 'Rwanda NetWorks Ltd', district: 'Nyarugenge',
    trade: 'Networking', slots: 3, applicants: 21, status: 'Open', postedAt: '2026-09-10' },
  { id: 'INT-003', title: 'Site Supervisor Assistant', company: 'GreenBuild Construction', district: 'Kicukiro',
    trade: 'Building Construction', slots: 4, applicants: 12, status: 'Open', postedAt: '2026-09-15' },
  { id: 'INT-004', title: 'Front Office Intern', company: 'Lakeside Hospitality Group', district: 'Rubavu',
    trade: 'Hospitality', slots: 6, applicants: 0, status: 'Pending review', postedAt: '2026-10-24' },
  { id: 'INT-005', title: 'Farm Technology Intern', company: 'AgriTech Rwanda', district: 'Bugesera',
    trade: 'Agriculture', slots: 2, applicants: 0, status: 'Pending review', postedAt: '2026-10-26' },
  { id: 'INT-006', title: 'Auto Mechanic Trainee', company: 'QuickFix Garage', district: 'Huye',
    trade: 'Automotive', slots: 2, applicants: 9, status: 'Flagged', postedAt: '2026-08-20' },
  { id: 'INT-007', title: 'IT Helpdesk Intern', company: 'Kigali Software Labs', district: 'Gasabo',
    trade: 'Software Development', slots: 2, applicants: 44, status: 'Closed', postedAt: '2026-06-01' },
]

const seedUsers = [
  { id: 'USR-001', name: 'Platform Admin', email: 'alainmanzi336@gmail.com', role: 'Super admin',
    kind: 'admin', org: 'Umunaralink', status: 'Active', lastLogin: '2026-10-29' },
  { id: 'USR-002', name: 'Support Desk', email: 'support@umunaralink.example', role: 'Support admin',
    kind: 'admin', org: 'Umunaralink', status: 'Active', lastLogin: '2026-10-27' },
  ...seedSchools.map((s, i) => ({
    id: `USR-S${i + 1}`, name: s.adminName, email: s.adminEmail, role: 'School admin',
    kind: 'school', org: s.name, orgId: s.id,
    status: s.status === 'Active' ? 'Active' : s.status === 'Suspended' ? 'Inactive' : 'Pending activation',
    lastLogin: s.status === 'Active' ? '2026-10-28' : '—',
  })),
  ...seedCompanies.map((c, i) => ({
    id: `USR-C${i + 1}`, name: c.contact, email: c.email, role: 'Company',
    kind: 'company', org: c.name, orgId: c.id,
    status: c.status === 'Verified' ? 'Active' : c.status === 'Suspended' ? 'Inactive' : 'Pending activation',
    lastLogin: c.status === 'Verified' ? '2026-10-26' : '—',
  })),
]

const seedAudit = [
  { id: 'LOG-1', at: '2026-10-25T09:12:00', actor: 'Platform Admin', action: 'Onboarded company', target: 'AgriTech Rwanda' },
  { id: 'LOG-2', at: '2026-10-20T14:05:00', actor: 'Platform Admin', action: 'Onboarded school', target: 'Nyagatare Vocational Centre' },
  { id: 'LOG-3', at: '2026-10-12T11:40:00', actor: 'Support Desk', action: 'Reset password', target: 'Marie Uwase' },
  { id: 'LOG-4', at: '2026-09-30T16:22:00', actor: 'Platform Admin', action: 'Suspended school', target: 'Rusizi Technical School' },
]

const seedAnnouncements = [
  { id: 'ANN-1', title: 'Internship season opens 1 November',
    body: 'Schools can now publish internship requirements and companies can post openings for the coming term.',
    audience: 'Everyone', priority: 'Normal', createdAt: '2026-10-24' },
]

const seedSettings = {
  platformName: 'Umunaralink',
  supportEmail: 'support@umunaralink.example',
  academicYear: '2026',
  levels: ['L3', 'L4', 'L5'],
  trades: [
    'Software Development', 'Networking', 'Building Construction', 'Hospitality',
    'Agriculture', 'Automotive', 'Electricity', 'Tourism',
  ],
  requireInternshipApproval: true,
  requireCompanyVerification: true,
  forcePasswordChange: true,
  minPasswordLength: 8,
  sessionTimeoutMins: 60,
  maintenanceMode: false,
}

const seedData = {
  schools: seedSchools,
  companies: seedCompanies,
  internships: seedInternships,
  users: seedUsers,
  audit: seedAudit,
  announcements: seedAnnouncements,
  settings: seedSettings,
  me: { name: 'Platform Admin', email: 'alainmanzi336@gmail.com', phone: '' },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...seedData,
        ...parsed,
        settings: { ...seedSettings, ...(parsed.settings || {}) },
      }
    }
  } catch {
    /* ignore corrupt or blocked storage */
  }
  return seedData
}

export function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join('') + '#7'
}

function nextId(prefix, list) {
  const max = list.reduce((m, item) => {
    const n = Number(String(item.id).split('-').pop())
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}

const today = () => new Date().toISOString().slice(0, 10)

const AdminDataContext = createContext(null)

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* storage unavailable: keep working in memory */
    }
  }, [data])

  // Keep the latest state in a ref so actions can compute their result
  // (ids, temporary passwords) synchronously and return it to the caller.
  const ref = useRef(data)

  const patch = useCallback((fn) => {
    const next = fn(ref.current)
    ref.current = next
    setData(next)
  }, [])

  const withLog = (prev, action, target) => ({
    audit: [
      {
        id: nextId('LOG', prev.audit),
        at: new Date().toISOString(),
        actor: prev.me.name,
        action,
        target,
      },
      ...prev.audit,
    ].slice(0, 500),
  })

  const api = useMemo(() => ({
    /* ---------- schools ---------- */
    addSchool(form) {
      let result
      patch((prev) => {
        const id = nextId('SCH', prev.schools)
        const tempPassword = generatePassword()
        const school = {
          ...form, id, status: 'Pending activation', createdAt: today(),
          classes: 0, students: 0, staff: 1, placed: 0,
        }
        const user = {
          id: nextId('USR', prev.users), name: form.adminName, email: form.adminEmail,
          role: 'School admin', kind: 'school', org: form.name, orgId: id,
          status: 'Pending activation', lastLogin: '—',
        }
        result = { school, tempPassword }
        return {
          ...prev,
          schools: [school, ...prev.schools],
          users: [user, ...prev.users],
          ...withLog(prev, 'Onboarded school', form.name),
        }
      })
      return result
    },
    updateSchool(id, form) {
      patch((prev) => ({
        ...prev,
        schools: prev.schools.map((s) => (s.id === id ? { ...s, ...form } : s)),
        users: prev.users.map((u) =>
          u.orgId === id && u.kind === 'school'
            ? { ...u, name: form.adminName ?? u.name, email: form.adminEmail ?? u.email, org: form.name ?? u.org }
            : u),
        ...withLog(prev, 'Updated school', form.name || id),
      }))
    },
    setSchoolStatus(id, status) {
      patch((prev) => {
        const school = prev.schools.find((s) => s.id === id)
        const userStatus = status === 'Active' ? 'Active' : status === 'Suspended' ? 'Inactive' : 'Pending activation'
        return {
          ...prev,
          schools: prev.schools.map((s) => (s.id === id ? { ...s, status } : s)),
          users: prev.users.map((u) =>
            u.orgId === id && u.kind === 'school' ? { ...u, status: userStatus } : u),
          ...withLog(prev, status === 'Suspended' ? 'Suspended school' : 'Activated school', school?.name || id),
        }
      })
    },
    deleteSchool(id) {
      patch((prev) => {
        const school = prev.schools.find((s) => s.id === id)
        return {
          ...prev,
          schools: prev.schools.filter((s) => s.id !== id),
          users: prev.users.filter((u) => u.orgId !== id),
          ...withLog(prev, 'Deleted school', school?.name || id),
        }
      })
    },

    /* ---------- companies ---------- */
    addCompany(form) {
      let result
      patch((prev) => {
        const id = nextId('CMP', prev.companies)
        const tempPassword = generatePassword()
        const company = {
          ...form, id, createdAt: today(),
          status: prev.settings.requireCompanyVerification ? 'Pending verification' : 'Verified',
        }
        const user = {
          id: nextId('USR', prev.users), name: form.contact, email: form.email,
          role: 'Company', kind: 'company', org: form.name, orgId: id,
          status: 'Pending activation', lastLogin: '—',
        }
        result = { company, tempPassword }
        return {
          ...prev,
          companies: [company, ...prev.companies],
          users: [user, ...prev.users],
          ...withLog(prev, 'Onboarded company', form.name),
        }
      })
      return result
    },
    updateCompany(id, form) {
      patch((prev) => ({
        ...prev,
        companies: prev.companies.map((c) => (c.id === id ? { ...c, ...form } : c)),
        ...withLog(prev, 'Updated company', form.name || id),
      }))
    },
    setCompanyStatus(id, status) {
      patch((prev) => {
        const company = prev.companies.find((c) => c.id === id)
        const userStatus = status === 'Verified' ? 'Active' : status === 'Suspended' ? 'Inactive' : 'Pending activation'
        const verb = { Verified: 'Verified company', Suspended: 'Suspended company' }[status] || 'Updated company'
        return {
          ...prev,
          companies: prev.companies.map((c) => (c.id === id ? { ...c, status } : c)),
          users: prev.users.map((u) =>
            u.orgId === id && u.kind === 'company' ? { ...u, status: userStatus } : u),
          ...withLog(prev, verb, company?.name || id),
        }
      })
    },
    deleteCompany(id) {
      patch((prev) => {
        const company = prev.companies.find((c) => c.id === id)
        return {
          ...prev,
          companies: prev.companies.filter((c) => c.id !== id),
          users: prev.users.filter((u) => u.orgId !== id),
          ...withLog(prev, 'Deleted company', company?.name || id),
        }
      })
    },

    /* ---------- internships ---------- */
    setInternshipStatus(id, status) {
      patch((prev) => {
        const item = prev.internships.find((i) => i.id === id)
        const verb = { Open: 'Approved internship', Flagged: 'Flagged internship', Closed: 'Closed internship' }[status] || 'Updated internship'
        return {
          ...prev,
          internships: prev.internships.map((i) => (i.id === id ? { ...i, status } : i)),
          ...withLog(prev, verb, item?.title || id),
        }
      })
    },
    deleteInternship(id) {
      patch((prev) => {
        const item = prev.internships.find((i) => i.id === id)
        return {
          ...prev,
          internships: prev.internships.filter((i) => i.id !== id),
          ...withLog(prev, 'Removed internship', item?.title || id),
        }
      })
    },

    /* ---------- users ---------- */
    addAdmin(form) {
      let result
      patch((prev) => {
        const tempPassword = generatePassword()
        const user = {
          id: nextId('USR', prev.users), name: form.name, email: form.email, role: form.role,
          kind: 'admin', org: 'Umunaralink', status: 'Pending activation', lastLogin: '—',
        }
        result = { user, tempPassword }
        return {
          ...prev,
          users: [user, ...prev.users],
          ...withLog(prev, 'Added platform admin', form.name),
        }
      })
      return result
    },
    setUserStatus(id, status) {
      patch((prev) => {
        const user = prev.users.find((u) => u.id === id)
        return {
          ...prev,
          users: prev.users.map((u) => (u.id === id ? { ...u, status } : u)),
          ...withLog(prev, status === 'Active' ? 'Activated user' : 'Deactivated user', user?.name || id),
        }
      })
    },
    resetPassword(id) {
      const tempPassword = generatePassword()
      patch((prev) => {
        const user = prev.users.find((u) => u.id === id)
        return { ...prev, ...withLog(prev, 'Reset password', user?.name || id) }
      })
      return tempPassword
    },
    deleteUser(id) {
      patch((prev) => {
        const user = prev.users.find((u) => u.id === id)
        return {
          ...prev,
          users: prev.users.filter((u) => u.id !== id),
          ...withLog(prev, 'Removed user', user?.name || id),
        }
      })
    },

    /* ---------- announcements ---------- */
    addAnnouncement(form) {
      patch((prev) => ({
        ...prev,
        announcements: [
          { ...form, id: nextId('ANN', prev.announcements), createdAt: today() },
          ...prev.announcements,
        ],
        ...withLog(prev, 'Published announcement', form.title),
      }))
    },
    deleteAnnouncement(id) {
      patch((prev) => {
        const item = prev.announcements.find((a) => a.id === id)
        return {
          ...prev,
          announcements: prev.announcements.filter((a) => a.id !== id),
          ...withLog(prev, 'Deleted announcement', item?.title || id),
        }
      })
    },

    /* ---------- settings / profile ---------- */
    updateSettings(changes, label = 'Updated platform settings') {
      patch((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...changes },
        ...withLog(prev, label, 'Platform settings'),
      }))
    },
    updateProfile(changes) {
      patch((prev) => ({ ...prev, me: { ...prev.me, ...changes } }))
    },
    logPasswordChange() {
      patch((prev) => ({ ...prev, ...withLog(prev, 'Changed own password', prev.me.name) }))
    },
    resetDemoData() {
      ref.current = seedData
      setData(seedData)
    },
  }), [patch])

  const value = useMemo(() => ({ ...data, ...api }), [data, api])

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used inside <AdminDataProvider>')
  return ctx
}
