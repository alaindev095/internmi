import { useState } from 'react';
import {
  School,
  BriefcaseBusiness,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import './SchoolPages.css';
import './SchoolSettings.css';

const initialSettings = {
  schoolName: 'Demo Technical School',
  schoolCode: 'DTS-001',
  email: 'info@demotechnical.rw',
  phone: '+250 788 000 000',
  address: 'Kigali, Rwanda',
  schoolType: 'TVET',
  trades: ['Software Development', 'Network and Internet Technology'],
  requireCV: true,
  requireMotivationLetter: false,
  allowApplications: true,
  applicationNotifications: true,
  internshipNotifications: true,
  weeklyReports: false,
  twoFactor: false,
};

const tradeOptions = [
  'Software Development',
  'Network and Internet Technology',
  'Computer Systems Architecture',
  'Electrical Technology',
  'Electronics',
  'Accountancy',
  'Other',
];

export default function SchoolSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const updateSetting = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const toggleTrade = (trade) => {
    setSettings((current) => ({
      ...current,
      trades: current.trades.includes(trade)
        ? current.trades.filter((item) => item !== trade)
        : [...current.trades, trade],
    }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      window.alert('Please fill in all password fields.');
      return;
    }

    if (passwords.next.length < 8) {
      window.alert('Your new password must contain at least 8 characters.');
      return;
    }

    if (passwords.next !== passwords.confirm) {
      window.alert('The new passwords do not match.');
      return;
    }

    window.alert(
      'Demo only: connect your authentication backend to change the password securely.'
    );
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const tabs = [
    { id: 'profile', label: 'School Profile', icon: School },
    { id: 'internships', label: 'Internship Preferences', icon: BriefcaseBusiness },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
  ];

  return (
    <div className="school-page school-settings-page">
      <div className="school-page-heading school-settings-heading">
        <div>
          <span className="school-settings-eyebrow">SCHOOL MANAGEMENT</span>
          <h1>School Settings</h1>
          <p>Manage your school's information, internship preferences, and access.</p>
        </div>

        <button className="school-settings-reset" type="button" onClick={handleReset}>
          <RotateCcw size={16} />
          Reset changes
        </button>
      </div>

      <div className="school-settings-layout">
        <aside className="school-settings-nav" aria-label="Settings sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`school-settings-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}

          <div className="school-settings-help">
            <ShieldCheck size={19} />
            <strong>Keep information accurate</strong>
            <p>Updated school details help companies and students identify your institution.</p>
          </div>
        </aside>

        <form className="school-settings-content" onSubmit={handleSave}>
          {activeTab === 'profile' && (
            <section className="school-settings-card">
              <div className="school-settings-section-heading">
                <div className="school-settings-icon">
                  <School size={20} />
                </div>
                <div>
                  <h2>School Profile</h2>
                  <p>Basic information about your institution.</p>
                </div>
              </div>

              <div className="school-settings-form-grid">
                <label className="school-settings-field">
                  School name
                  <input
                    required
                    value={settings.schoolName}
                    onChange={(e) => updateSetting('schoolName', e.target.value)}
                    placeholder="Enter school name"
                  />
                </label>

                <label className="school-settings-field">
                  School code
                  <input
                    required
                    value={settings.schoolCode}
                    onChange={(e) => updateSetting('schoolCode', e.target.value)}
                    placeholder="Enter school code"
                  />
                </label>

                <label className="school-settings-field">
                  School email
                  <input
                    required
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    placeholder="school@example.com"
                  />
                </label>

                <label className="school-settings-field">
                  Phone number
                  <input
                    required
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => updateSetting('phone', e.target.value)}
                    placeholder="+250..."
                  />
                </label>

                <label className="school-settings-field school-settings-full">
                  Address
                  <input
                    required
                    value={settings.address}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    placeholder="District, City, Rwanda"
                  />
                </label>

                <label className="school-settings-field school-settings-full">
                  School type
                  <select
                    value={settings.schoolType}
                    onChange={(e) => updateSetting('schoolType', e.target.value)}
                  >
                    <option value="TVET">TVET</option>
                    <option value="Secondary">General Secondary</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>
            </section>
          )}

          {activeTab === 'internships' && (
            <section className="school-settings-card">
              <div className="school-settings-section-heading">
                <div className="school-settings-icon">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <h2>Internship Preferences</h2>
                  <p>Choose the trades and requirements relevant to your students.</p>
                </div>
              </div>

              <div className="school-settings-subsection">
                <h3>Supported trades</h3>
                <p className="school-settings-description">
                  Select the trades your school offers.
                </p>
                <div className="school-settings-trades">
                  {tradeOptions.map((trade) => (
                    <label className="school-settings-check" key={trade}>
                      <input
                        type="checkbox"
                        checked={settings.trades.includes(trade)}
                        onChange={() => toggleTrade(trade)}
                      />
                      <span>{trade}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="school-settings-divider" />

              <div className="school-settings-subsection">
                <h3>Application requirements</h3>
                <SettingToggle
                  title="Require CV"
                  description="Students should attach a CV when applying."
                  checked={settings.requireCV}
                  onChange={(value) => updateSetting('requireCV', value)}
                />
                <SettingToggle
                  title="Require motivation letter"
                  description="Ask students to include a motivation letter."
                  checked={settings.requireMotivationLetter}
                  onChange={(value) => updateSetting('requireMotivationLetter', value)}
                />
                <SettingToggle
                  title="Allow internship applications"
                  description="Enable or pause applications through Internmi."
                  checked={settings.allowApplications}
                  onChange={(value) => updateSetting('allowApplications', value)}
                />
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="school-settings-card">
              <div className="school-settings-section-heading">
                <div className="school-settings-icon">
                  <Bell size={20} />
                </div>
                <div>
                  <h2>Notifications</h2>
                  <p>Choose the updates school staff should receive.</p>
                </div>
              </div>

              <div className="school-settings-subsection">
                <SettingToggle
                  title="Application updates"
                  description="Updates when students submit internship applications."
                  checked={settings.applicationNotifications}
                  onChange={(value) => updateSetting('applicationNotifications', value)}
                />
                <SettingToggle
                  title="Internship updates"
                  description="Updates about internship opportunities and placements."
                  checked={settings.internshipNotifications}
                  onChange={(value) => updateSetting('internshipNotifications', value)}
                />
                <SettingToggle
                  title="Weekly reports"
                  description="Receive a weekly summary of school internship activity."
                  checked={settings.weeklyReports}
                  onChange={(value) => updateSetting('weeklyReports', value)}
                />
              </div>

              <p className="school-settings-note">
                These are interface preferences only. Email or in-app delivery must be
                connected to your backend.
              </p>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="school-settings-card">
              <div className="school-settings-section-heading">
                <div className="school-settings-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2>Security & Access</h2>
                  <p>Manage password-related preferences and account protection.</p>
                </div>
              </div>

              <SettingToggle
                title="Two-factor authentication"
                description="A future option for adding another layer of account security."
                checked={settings.twoFactor}
                onChange={(value) => updateSetting('twoFactor', value)}
              />

              <div className="school-settings-divider" />

              <form className="school-settings-password-form" onSubmit={handlePasswordChange}>
                <h3>Change password</h3>
                <p className="school-settings-description">
                  Use at least 8 characters for your new password.
                </p>

                {[
                  { key: 'current', label: 'Current password' },
                  { key: 'next', label: 'New password' },
                  { key: 'confirm', label: 'Confirm new password' },
                ].map(({ key, label }) => (
                  <label className="school-settings-field" key={key}>
                    {label}
                    <div className="school-settings-password-input">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="off"
                        value={passwords[key]}
                        onChange={(e) =>
                          setPasswords((current) => ({
                            ...current,
                            [key]: e.target.value,
                          }))
                        }
                      />
                      {key !== 'current' && (
                        <button
                          type="button"
                          className="school-settings-eye"
                          aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                          onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      )}
                    </div>
                  </label>
                ))}

                <button className="school-settings-secondary-button" type="submit">
                  Validate password form
                </button>
                <p className="school-settings-note">
                  Demo only: this form does not change a real account password.
                </p>
              </form>
            </section>
          )}

          <div className="school-settings-footer">
            <span className={saved ? 'school-settings-save-status success' : 'school-settings-save-status'}>
              {saved ? (
                <>
                  <Check size={16} /> Changes applied in this session
                </>
              ) : (
                'Changes have not been saved'
              )}
            </span>

            <button className="school-settings-save" type="submit">
              <Save size={17} />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingToggle({ title, description, checked, onChange }) {
  return (
    <div className="school-settings-toggle-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`school-settings-switch ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
