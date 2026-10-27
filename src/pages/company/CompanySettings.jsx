
import { useEffect, useState } from 'react'
import {
  Settings,
  Bell,
  ShieldCheck,
  Save,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react'
import './CompanySettings.css'

const defaultSettings = {
  emailNotifications: true,
  newApplications: true,
  applicationUpdates: true,
  internshipReminders: true,
  profileVisibility: true,
}

function CompanySettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [message, setMessage] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('internmi-company-settings')
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) })
      }
    } catch {
      // Use default settings if saved data cannot be read.
    }
  }, [])

  function toggleSetting(name) {
    setSettings((current) => ({
      ...current,
      [name]: !current[name],
    }))
    setMessage('')
  }

  function saveSettings(event) {
    event.preventDefault()

    try {
      localStorage.setItem(
        'internmi-company-settings',
        JSON.stringify(settings)
      )
      setMessage('Your preferences have been saved on this device.')
    } catch {
      setMessage('Unable to save preferences in this browser.')
    }
  }

  function handlePasswordSubmit(event) {
    event.preventDefault()

    if (newPassword.length < 8) {
      setMessage('Your new password must contain at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('The new passwords do not match.')
      return
    }

    setMessage(
      'Password form validated. Connect your authentication backend to change your real password.'
    )
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  function SettingToggle({ name, title, description }) {
    return (
      <div className="setting-row">
        <div className="setting-copy">
          <strong>{title}</strong>
          <p>{description}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={settings[name]}
          aria-label={title}
          className={`setting-switch ${settings[name] ? 'is-on' : ''}`}
          onClick={() => toggleSetting(name)}
        >
          <span />
        </button>
      </div>
    )
  }

  return (
    <div className="company-settings-page">
      <div className="settings-heading">
        <div>
          <span className="company-eyebrow">WORKSPACE PREFERENCES</span>
          <h1>Company settings</h1>
          <p>Manage notifications, privacy, and account preferences.</p>
        </div>
        <div className="settings-heading-icon">
          <Settings size={23} />
        </div>
      </div>

      {message && (
        <div className="settings-message" role="status">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={saveSettings}>
        <section className="company-settings-card">
          <div className="settings-section-title">
            <Bell size={20} />
            <div>
              <h2>Notifications</h2>
              <p>Choose which updates you want to receive.</p>
            </div>
          </div>

          <SettingToggle
            name="emailNotifications"
            title="Email notifications"
            description="Allow Internmi to send updates to your company email."
          />
          <SettingToggle
            name="newApplications"
            title="New applications"
            description="Receive an alert when a student applies for an internship."
          />
          <SettingToggle
            name="applicationUpdates"
            title="Application status updates"
            description="Keep track of changes to application statuses."
          />
          <SettingToggle
            name="internshipReminders"
            title="Internship reminders"
            description="Get reminders about closing dates and active listings."
          />
        </section>

        <section className="company-settings-card">
          <div className="settings-section-title">
            <ShieldCheck size={20} />
            <div>
              <h2>Privacy and visibility</h2>
              <p>Control how your organization appears to students.</p>
            </div>
          </div>

          <SettingToggle
            name="profileVisibility"
            title="Public company profile"
            description="Allow students to discover your company profile."
          />
        </section>

        <div className="settings-actions">
          <span>Preferences are saved in this browser only.</span>
          <button type="submit" className="company-profile-save">
            <Save size={17} />
            Save preferences
          </button>
        </div>
      </form>

      <section className="company-settings-card">
        <div className="settings-section-title">
          <LockKeyhole size={20} />
          <div>
            <h2>Change password</h2>
            <p>Validate your password change request.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="settings-password-form">
          <label>
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <label>
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <button type="submit" className="company-profile-save">
            <LockKeyhole size={17} />
            Validate password change
          </button>
          <p className="settings-security-note">
            This prototype does not change or store your real password.
          </p>
        </form>
      </section>
    </div>
  )
}

export default CompanySettings
