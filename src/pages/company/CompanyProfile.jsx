
import {
  Building2,
  Camera,
  Globe,
  MapPin,
  Mail,
  Phone,
  Save,
  CheckCircle2,
} from 'lucide-react'
import './CompanyProfile.css'
import { useEffect, useState } from 'react'

const initialProfile = {
  name: 'TechVision Rwanda',
  industry: 'Information Technology',
  companySize: '11–50 employees',
  website: 'https://example.com',
  location: 'Kigali, Rwanda',
  email: 'careers@example.com',
  phone: '+250 788 000 000',
  description:
    'We are a technology company helping businesses build reliable digital solutions. We welcome motivated students who want to learn, collaborate, and gain practical industry experience.',
  linkedin: '',
  facebook: '',
}

function CompanyProfile() {
  const [profile, setProfile] = useState(initialProfile)
  const [logo, setLogo] = useState('')
  const [saved, setSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    return () => {
      if (logo.startsWith('blob:')) {
        URL.revokeObjectURL(logo)
      }
    }
  }, [logo])

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setSaved(false)
    setSaveMessage('')
  }

  function handleLogoChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setSaveMessage('Please select an image file.')
      setSaved(false)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage('The logo must be smaller than 2 MB.')
      setSaved(false)
      return
    }

    setLogo(URL.createObjectURL(file))
    setSaved(false)
    setSaveMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    // Frontend prototype only: persist data in this browser.
    try {
      localStorage.setItem(
        'internmi-company-profile',
        JSON.stringify(profile)
      )

      setSaved(true)
      setSaveMessage('Your profile has been saved in this browser.')
    } catch {
      setSaved(false)
      setSaveMessage(
        'Unable to save locally. Your browser storage may be unavailable.'
      )
    }
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem('internmi-company-profile')

      if (stored) {
        setProfile({
          ...initialProfile,
          ...JSON.parse(stored),
        })
      }
    } catch {
      // Keep the initial demo profile if saved data cannot be read.
    }
  }, [])

  return (
    <div className="company-profile-page">
      <div className="company-profile-heading">
        <div>
          <span className="company-eyebrow">COMPANY SETTINGS</span>
          <h1>Company profile</h1>
          <p>
            Manage your company information and how students discover you
            on Internmi.
          </p>
        </div>

        <button
          className="company-profile-save"
          type="submit"
          form="company-profile-form"
        >
          <Save size={17} />
          Save changes
        </button>
      </div>

      {saveMessage && (
        <div
          className={`company-profile-message ${saved ? 'is-success' : 'is-error'}`}
          role="status"
        >
          {saved ? (
            <CheckCircle2 size={18} />
          ) : null}
          <span>{saveMessage}</span>
        </div>
      )}

      <form
        id="company-profile-form"
        onSubmit={handleSubmit}
        className="company-profile-form"
      >
        <section className="company-profile-card">
          <div className="company-profile-section-heading">
            <div className="company-profile-section-icon">
              <Building2 size={20} />
            </div>
            <div>
              <h2>Company identity</h2>
              <p>Your company name and brand identity.</p>
            </div>
          </div>

          <div className="company-logo-row">
            <div className="company-logo-preview">
              {logo ? (
                <img src={logo} alt="Company logo preview" />
              ) : (
                <Building2 size={34} />
              )}
            </div>

            <div className="company-logo-info">
              <strong>Company logo</strong>
              <p>Choose a clear square image. PNG, JPG or WebP, up to 2 MB.</p>
              <label className="company-logo-upload">
                <Camera size={15} />
                Upload logo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>

          <div className="company-profile-grid">
            <div className="company-profile-field">
              <label htmlFor="company-name">Company name *</label>
              <input
                id="company-name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                maxLength={120}
                placeholder="Your company name"
              />
            </div>

            <div className="company-profile-field">
              <label htmlFor="company-industry">Industry *</label>
              <input
                id="company-industry"
                name="industry"
                value={profile.industry}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="e.g. Information Technology"
              />
            </div>

            <div className="company-profile-field">
              <label htmlFor="company-size">Company size</label>
              <select
                id="company-size"
                name="companySize"
                value={profile.companySize}
                onChange={handleChange}
              >
                <option value="">Select company size</option>
                <option>1–10 employees</option>
                <option>11–50 employees</option>
                <option>51–200 employees</option>
                <option>201–500 employees</option>
                <option>501+ employees</option>
              </select>
            </div>

            <div className="company-profile-field">
              <label htmlFor="company-website">Website</label>
              <div className="company-profile-input-icon">
                <Globe size={17} />
                <input
                  id="company-website"
                  type="url"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="company-profile-card">
          <div className="company-profile-section-heading">
            <div className="company-profile-section-icon">
              <Building2 size={20} />
            </div>
            <div>
              <h2>About the company</h2>
              <p>Help students understand what your company does.</p>
            </div>
          </div>

          <div className="company-profile-field">
            <label htmlFor="company-description">Company description *</label>
            <textarea
              id="company-description"
              name="description"
              value={profile.description}
              onChange={handleChange}
              required
              maxLength={1500}
              rows={5}
              placeholder="Describe your mission, services, and opportunities for interns..."
            />
            <span className="company-profile-character-count">
              {profile.description.length}/1500 characters
            </span>
          </div>
        </section>

        <section className="company-profile-card">
          <div className="company-profile-section-heading">
            <div className="company-profile-section-icon">
              <Mail size={20} />
            </div>
            <div>
              <h2>Contact information</h2>
              <p>How students and Internmi can reach your company.</p>
            </div>
          </div>

          <div className="company-profile-grid">
            <div className="company-profile-field">
              <label htmlFor="company-email">Company email *</label>
              <div className="company-profile-input-icon">
                <Mail size={17} />
                <input
                  id="company-email"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                  placeholder="careers@yourcompany.com"
                />
              </div>
            </div>

            <div className="company-profile-field">
              <label htmlFor="company-phone">Phone number</label>
              <div className="company-profile-input-icon">
                <Phone size={17} />
                <input
                  id="company-phone"
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+250..."
                />
              </div>
            </div>

            <div className="company-profile-field company-profile-full">
              <label htmlFor="company-location">Location *</label>
              <div className="company-profile-input-icon">
                <MapPin size={17} />
                <input
                  id="company-location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="City, country"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="company-profile-card">
          <div className="company-profile-section-heading">
            <div className="company-profile-section-icon">
              <Globe size={20} />
            </div>
            <div>
              <h2>Social links</h2>
              <p>Let students learn more about your company online.</p>
            </div>
          </div>

          <div className="company-profile-grid">
            <div className="company-profile-field">
              <label htmlFor="company-linkedin">LinkedIn URL</label>
              <div className="company-profile-input-icon">
                <span className="company-linkedin-icon" aria-hidden="true">in</span>
                <input
                  id="company-linkedin"
                  type="url"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>

            <div className="company-profile-field">
              <label htmlFor="company-facebook">Facebook URL</label>
              <div className="company-profile-input-icon">
                <span className="company-facebook-icon" aria-hidden="true">f</span>
                <input
                  id="company-facebook"
                  type="url"
                  name="facebook"
                  value={profile.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>
        </section>

        <div className="company-profile-bottom-actions">
          <span>Remember to save your changes.</span>
          <button
            className="company-profile-save"
            type="submit"
          >
            <Save size={17} />
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default CompanyProfile
