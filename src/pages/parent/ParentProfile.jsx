
import { useState } from 'react';
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Pencil,
  Save,
  X,
  LockKeyhole,
  CircleHelp,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ParentProfile.css';

const initialProfile = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  relationship: '',
};

export default function ParentProfile({ profile = initialProfile }) {
  const [formData, setFormData] = useState({
    ...initialProfile,
    ...profile,
  });

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSavedMessage('');
  }

  function handleSave(event) {
    event.preventDefault();

    // Connect this handler to your profile API before using it
    // to persist changes to the server.
    setSavedMessage(
      'Changes are currently stored in this page only. Backend saving is not connected yet.'
    );
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData({
      ...initialProfile,
      ...profile,
    });
    setIsEditing(false);
    setSavedMessage('');
  }

  const displayName = formData.fullName.trim() || 'Parent account';
  const initials =
    formData.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'P';

  return (
    <section className="parent-profile-page">
      <header className="parent-profile-header">
        <div>
          <span className="parent-profile-eyebrow">PARENT PORTAL</span>
          <h1>My Profile</h1>
          <p>
            View your account information and manage your parent profile.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="parent-profile-edit-button"
            onClick={() => {
              setIsEditing(true);
              setSavedMessage('');
            }}
          >
            <Pencil size={16} />
            Edit profile
          </button>
        ) : (
          <button
            type="button"
            className="parent-profile-cancel-button"
            onClick={handleCancel}
          >
            <X size={17} />
            Cancel
          </button>
        )}
      </header>

      {savedMessage && (
        <div className="parent-profile-notice" role="status">
          {savedMessage}
        </div>
      )}

      <div className="parent-profile-grid">
        <aside className="parent-profile-sidebar">
          <div className="parent-profile-identity">
            <div className="parent-profile-avatar">{initials}</div>
            <h2>{displayName}</h2>
            <p>{formData.email || 'Email not provided'}</p>
            <span className="parent-profile-role">
              <ShieldCheck size={14} />
              Parent account
            </span>
          </div>

          <button
            type="button"
            className="parent-profile-logout-button"
            onClick={() => navigate('/login')}
          >
            <LogOut size={16} />
            Log out
          </button>

          <div className="parent-profile-sidebar-divider" />

          <div className="parent-profile-sidebar-info">
            <div>
              <span>Account type</span>
              <strong>Parent</strong>
            </div>
            <div>
              <span>Relationship</span>
              <strong>{formData.relationship || 'Not specified'}</strong>
            </div>
          </div>
        </aside>

        <div className="parent-profile-main">
          <form onSubmit={handleSave}>
            <section className="parent-profile-card">
              <div className="parent-profile-card-heading">
                <div className="parent-profile-card-heading-icon">
                  <UserRound size={19} />
                </div>
                <div>
                  <h2>Personal information</h2>
                  <p>Your basic account details.</p>
                </div>
              </div>

              <div className="parent-profile-fields">
                <label className="parent-profile-field">
                  <span>Full name</span>
                  <div className="parent-profile-input-wrap">
                    <UserRound size={17} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      readOnly={!isEditing}
                      autoComplete="name"
                    />
                  </div>
                </label>

                <label className="parent-profile-field">
                  <span>Email address</span>
                  <div className="parent-profile-input-wrap">
                    <Mail size={17} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      readOnly={!isEditing}
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="parent-profile-field">
                  <span>Phone number</span>
                  <div className="parent-profile-input-wrap">
                    <Phone size={17} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      readOnly={!isEditing}
                      autoComplete="tel"
                    />
                  </div>
                </label>

                <label className="parent-profile-field">
                  <span>Location</span>
                  <div className="parent-profile-input-wrap">
                    <MapPin size={17} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="District, city or province"
                      readOnly={!isEditing}
                      autoComplete="address-level2"
                    />
                  </div>
                </label>

                <label className="parent-profile-field">
                  <span>Relationship to student</span>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="">Not specified</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              {isEditing && (
                <div className="parent-profile-form-actions">
                  <button
                    type="button"
                    className="parent-profile-cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="parent-profile-save-button"
                  >
                    <Save size={16} />
                    Save changes
                  </button>
                </div>
              )}
            </section>
          </form>

          <section className="parent-profile-card">
            <div className="parent-profile-card-heading">
              <div className="parent-profile-card-heading-icon">
                <LockKeyhole size={19} />
              </div>
              <div>
                <h2>Account and security</h2>
                <p>Information about protecting your account.</p>
              </div>
            </div>

            <div className="parent-profile-security-row">
              <div className="parent-profile-security-icon">
                <ShieldCheck size={19} />
              </div>
              <div>
                <strong>Account access</strong>
                <p>
                  Your account should only be accessed using your own
                  credentials.
                </p>
              </div>
              <span className="parent-profile-security-label">
                <ShieldCheck size={14} />
                Parent
              </span>
            </div>

            <div className="parent-profile-security-row">
              <div className="parent-profile-security-icon">
                <CircleHelp size={19} />
              </div>
              <div>
                <strong>Need help?</strong>
                <p>
                  Contact your school administrator if your account details
                  need to be corrected.
                </p>
              </div>
            </div>
          </section>

          <p className="parent-profile-footnote">
            Your profile information should be managed securely through
            your Internmi account.
          </p>
        </div>
      </div>
    </section>
  );
}
