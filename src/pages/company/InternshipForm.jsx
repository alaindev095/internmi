
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import './InternshipForm.css'

const STORAGE_KEY = 'internmi-company-internships'

const emptyInternship = {
  title: '',
  trade: 'Software Development',
  location: 'Kigali',
  positions: 1,
  deadline: '',
  description: '',
  requirements: '',
  status: 'Draft',
}

export default function CompanyInternshipForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(emptyInternship)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    const internship = saved.find(
      (item) => String(item.id) === String(id)
    )

    if (!internship) {
      setError('Internship not found. It may have been removed.')
      return
    }

    setForm({
      ...emptyInternship,
      ...internship,
      positions: Number(internship.positions) || 1,
    })
  }, [id, isEditing])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: name === 'positions' ? Number(value) : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    if (isEditing) {
      const exists = saved.some(
        (item) => String(item.id) === String(id)
      )

      if (!exists) {
        setError(
          'This internship was not found in saved data. Return to the list and try again.'
        )
        return
      }

      const updated = saved.map((item) =>
        String(item.id) === String(id)
          ? { ...item, ...form, id: item.id }
          : item
      )

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else {
      const newInternship = {
        ...form,
        id: Date.now(),
        applications: 0,
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...saved, newInternship])
      )
    }

    navigate('/company/internships')
  }

  return (
    <section className="company-internship-form-page">
      <button
        type="button"
        className="internship-form-back"
        onClick={() => navigate('/company/internships')}
      >
        <ArrowLeft size={18} />
        Back to internships
      </button>

      <header className="company-page-heading">
        <div>
          <span className="company-eyebrow">COMPANY WORKSPACE</span>
          <h1>{isEditing ? 'Edit internship' : 'Post an internship'}</h1>
          <p>
            {isEditing
              ? 'Update the details of your internship opportunity.'
              : 'Provide the details students need to apply.'}
          </p>
        </div>
      </header>

      {error && (
        <p className="internship-form-error" role="alert">
          {error}
        </p>
      )}

      <form
        className="company-internship-form"
        onSubmit={handleSubmit}
      >
        <div className="internship-form-section">
          <h2>Internship information</h2>

          <label>
            Internship title *
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer Intern"
              required
            />
          </label>

          <div className="internship-form-grid">
            <label>
              Trade *
              <select
                name="trade"
                value={form.trade}
                onChange={handleChange}
                required
              >
                <option>Software Development</option>
                <option>Networking & Internet Technology</option>
                <option>Computer Systems & Architecture</option>
                <option>Information Technology</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Location *
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Kigali"
                required
              />
            </label>

            <label>
              Number of positions *
              <input
                type="number"
                name="positions"
                value={form.positions}
                onChange={handleChange}
                min="1"
                required
              />
            </label>

            <label>
              Application deadline *
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Description *
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the internship, responsibilities, and learning opportunities."
              rows="5"
              required
            />
          </label>

          <label>
            Requirements
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder="List the skills or qualifications applicants should have."
              rows="4"
            />
          </label>

          <label>
            Publication status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Draft">Save as draft</option>
              <option value="Published">Publish internship</option>
            </select>
          </label>
        </div>

        <div className="internship-form-actions">
          <button
            type="button"
            className="company-secondary-button"
            onClick={() => navigate('/company/internships')}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="company-primary-button"
          >
            <Save size={18} />
            {isEditing ? 'Save changes' : 'Save internship'}
          </button>
        </div>
      </form>
    </section>
  )
}
