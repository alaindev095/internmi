
import { useEffect, useState } from 'react'
import {
  Camera,
  UserRound,
  Mail,
  Phone,
  Building2,
  Save,
  CheckCircle2,
} from 'lucide-react'
import './EmployerProfile.css'

const defaultProfile = {
  firstName: '',
  lastName: '',
  jobTitle: 'Internship Coordinator',
  email: '',
  phone: '',
  department: 'Human Resources',
  bio: '',
}

function EmployerProfile() {
  const [profile, setProfile] = useState(defaultProfile)
  const [photo, setPhoto] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('internmi-employer-profile')

      if (stored) {
        setProfile({ ...defaultProfile, ...JSON.parse(stored) })
      }
    } catch {
      // Keep the default profile if saved data cannot be read.
    }
  }, [])

  useEffect(() => {
    return () => {
      if (photo.startsWith('blob:')) {
        URL.revokeObjectURL(photo)
      }
    }
  }, [photo])

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setMessage('')
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Your profile photo must be smaller than 2 MB.')
      return
    }

    setPhoto(URL.createObjectURL(file))
    setMessage('Photo preview updated. Save your profile to save your other details.')
  }

  function handleSubmit(event) {
    event.preventDefault()

    try {
      localStorage.setItem(
        'internmi-employer-profile',
        JSON.stringify(profile)
      )
      setMessage('Your profile has been saved in this browser.')
    } catch {
      setMessage('Unable to save your profile in this browser.')
    }
  }

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || 'Your name'

  return (
    <div className="employer-profile-page">
      <div className="employer-profile-heading">
        <div>
          <span className="company-eyebrow">PERSONAL ACCOUNT</span>
          <h1>Employer profile</h1>
          <p>Manage the personal details of the person managing internships.</p>
        </div>

        <button
          type="submit"
          form="employer-profile-form"
          className="company-profile-save"
        >
          <Save size={17} />
          Save profile
        </button>
      </div>

      {message && (
        <div className="employer-profile-message" role="status">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      <section className="employer-profile-card employer-profile-summary">
        <div className="employer-avatar">
          {photo ? (
            <img src={photo} alt="Employer profile" />
          ) : (
            <UserRound size={38} />
          )}
        </div>

        <div className="employer-summary-copy">
          <h2>{fullName}</h2>
          <p>{profile.jobTitle || 'Company team member'}</p>
          <span>{profile.department || 'Department not specified'}</span>
        </div>

        <label className="employer-photo-upload">
          <Camera size={16} />
          Change photo
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePhotoChange}
          />
        </label>
      </section>

      <form
        id="employer-profile-form"
        onSubmit={handleSubmit}
        className="employer-profile-form"
      >
        <section className="employer-profile-card">
          <div className="employer-profile-section-title">
            <UserRound size={20} />
            <div>
              <h2>Personal information</h2>
              <p>Keep your account details accurate and up to date.</p>
            </div>
          </div>

          <div className="employer-profile-grid">
            <div className="employer-profile-field">
              <label htmlFor="employer-first-name">First name *</label>
              <input
                id="employer-first-name"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                maxLength={80}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="employer-profile-field">
              <label htmlFor="employer-last-name">Last name *</label>
              <input
                id="employer-last-name"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                maxLength={80}
                autoComplete="family-name"
                required
              />
            </div>

            <div className="employer-profile-field">
              <label htmlFor="employer-job-title">Job title *</label>
              <input
                id="employer-job-title"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Internship Coordinator"
                required
              />
            </div>

            <div className="employer-profile-field">
              <label htmlFor="employer-department">Department</label>
              <select
                id="employer-department"
                name="department"
                value={profile.department}
                onChange={handleChange}
              >
                <option>Human Resources</option>
                <option>Internship Coordination</option>
                <option>Technical Department</option>
                <option>Administration</option>
                <option>Operations</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </section>

        <section className="employer-profile-card">
          <div className="employer-profile-section-title">
            <Mail size={20} />
            <div>
              <h2>Contact information</h2>
              <p>Contact details for your professional account.</p>
            </div>
          </div>

          <div className="employer-profile-grid">
            <div className="employer-profile-field">
              <label htmlFor="employer-email">Work email *</label>
              <div className="employer-input-with-icon">
                <Mail size={17} />
                <input
                  id="employer-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="employer-profile-field">
              <label htmlFor="employer-phone">Phone number</label>
              <div className="employer-input-with-icon">
                <Phone size={17} />
                <input
                  id="employer-phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="+250..."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="employer-profile-card">
          <div className="employer-profile-section-title">
            <Building2 size={20} />
            <div>
              <h2>About your role</h2>
              <p>Tell your team what you do at the company.</p>
            </div>
          </div>

          <div className="employer-profile-field">
            <label htmlFor="employer-bio">Professional bio</label>
            <textarea
              id="employer-bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              maxLength={800}
              rows={5}
              placeholder="Describe your responsibilities, experience, and role in coordinating internships..."
            />
            <span className="employer-character-count">
              {profile.bio.length}/800 characters
            </span>
          </div>
        </section>

        <div className="employer-profile-footer">
          <span>Your profile details are stored locally in this prototype.</span>
          <button type="submit" className="company-profile-save">
            <Save size={17} />
            Save profile
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmployerProfile
