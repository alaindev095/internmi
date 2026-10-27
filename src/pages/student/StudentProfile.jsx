
import { useState } from 'react'
import {
  UserRound,
  Mail,
  Phone,
  School,
  MapPin,
  BriefcaseBusiness,
  Save,
  Pencil,
  CheckCircle2,
} from 'lucide-react'
import './Student.css'

const initialProfile = {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '',
  school: 'Your School',
  classLevel: 'S6',
  trade: 'Software Development',
  preferredIndustry: 'Technology',
  preferredLocation: 'Kigali',
  bio: '',
}

function ProfileField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = 'text',
  readOnly = false,
}) {
  return (
    <label className="profile-field">
      <span className="profile-field-label">{label}</span>

      <span className="profile-input-wrap">
        <Icon size={18} aria-hidden="true" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          readOnly={readOnly}
        />
      </span>
    </label>
  )
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(initialProfile)
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')

  const initials = profile.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'S'

  const handleChange = (event) => {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSave = (event) => {
    event.preventDefault()

    setEditing(false)
    setNotice('Your changes are saved in this demo session.')
  }

  const handleCancel = () => {
    setProfile(initialProfile)
    setEditing(false)
    setNotice('')
  }

  return (
    <div className="student-page profile-page">
      <div className="profile-page-heading">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>My profile</h1>
          <p className="page-description">
            Manage your personal information and internship preferences.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {
              setEditing(true)
              setNotice('')
            }}
          >
            <Pencil size={16} />
            Edit profile
          </button>
        )}
      </div>

      {notice && (
        <div className="profile-notice" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      <section className="profile-summary">
        <div className="profile-avatar" aria-label="Student initials">
          {initials}
        </div>

        <div className="profile-summary-info">
          <h2>{profile.fullName || 'Student name'}</h2>
          <p>{profile.trade || 'Trade not specified'}</p>
          <span className="profile-school-label">
            <School size={15} />
            {profile.school || 'School not specified'}
          </span>
        </div>
      </section>

      <form onSubmit={handleSave}>
        <section className="profile-section">
          <div className="profile-section-heading">
            <div>
              <h2>Personal information</h2>
              <p>Your contact details and identity.</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            <ProfileField
              label="Full name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              icon={UserRound}
              readOnly={!editing}
              placeholder="Enter your full name"
            />

            <ProfileField
              label="Email address"
              name="email"
              value={profile.email}
              onChange={handleChange}
              icon={Mail}
              type="email"
              readOnly={!editing}
              placeholder="you@example.com"
            />

            <ProfileField
              label="Phone number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              icon={Phone}
              type="tel"
              readOnly={!editing}
              placeholder="+250 7XX XXX XXX"
            />

            <ProfileField
              label="School"
              name="school"
              value={profile.school}
              onChange={handleChange}
              icon={School}
              readOnly={!editing}
              placeholder="Your school name"
            />
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <div>
              <h2>Education</h2>
              <p>Help companies understand your current studies.</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            <label className="profile-field">
              <span className="profile-field-label">Class / Level</span>
              <select
                name="classLevel"
                value={profile.classLevel}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select level</option>
                <option value="S4">S4</option>
                <option value="S5">S5</option>
                <option value="S6">S6</option>
                <option value="L3">L3</option>
                <option value="L4">L4</option>
                <option value="L5">L5</option>
              </select>
            </label>

            <label className="profile-field">
              <span className="profile-field-label">Trade / Field of study</span>
              <select
                name="trade"
                value={profile.trade}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select your trade</option>
                <option value="Software Development">Software Development</option>
                <option value="Networking and Internet Technology">
                  Networking and Internet Technology
                </option>
                <option value="Computer Systems Architecture">
                  Computer Systems Architecture
                </option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <div>
              <h2>Internship preferences</h2>
              <p>Tell us what opportunities interest you.</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            <label className="profile-field">
              <span className="profile-field-label">Preferred industry</span>
              <select
                name="preferredIndustry"
                value={profile.preferredIndustry}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="IT & Networking">IT &amp; Networking</option>
                <option value="Business">Business</option>
                <option value="Design & Media">Design &amp; Media</option>
                <option value="Engineering">Engineering</option>
                <option value="Any industry">Any industry</option>
              </select>
            </label>

            <ProfileField
              label="Preferred location"
              name="preferredLocation"
              value={profile.preferredLocation}
              onChange={handleChange}
              icon={MapPin}
              readOnly={!editing}
              placeholder="e.g. Kigali, Huye"
            />
          </div>

          <label className="profile-field profile-bio-field">
            <span className="profile-field-label">About me</span>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              readOnly={!editing}
              rows={4}
              maxLength={500}
              placeholder="Introduce yourself, describe your skills, and explain what you hope to learn during an internship."
            />
            <span className="profile-character-count">
              {profile.bio.length}/500 characters
            </span>
          </label>
        </section>

        {editing && (
          <div className="profile-form-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit" className="profile-save-button">
              <Save size={17} />
              Save changes
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
