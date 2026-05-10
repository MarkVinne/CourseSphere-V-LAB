import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import logo from '../assets/logo.svg'
import ReactMarkdown from 'react-markdown'

export default function CourseForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)
  const [form, setForm]       = useState({ name: '', description: '', start_date: '', end_date: '' })
  const [errors, setErrors]   = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get(`/courses/${id}`).then(r => {
        const c = r.data
        setForm({ name: c.name, description: c.description || '',
                  start_date: c.start_date, end_date: c.end_date })
      })
    }
  }, [id])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    try {
      if (isEdit) await api.put(`/courses/${id}`, form)
      else        await api.post('/courses', form)
      navigate(isEdit ? `/courses/${id}` : '/dashboard')
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Erro ao salvar'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="CourseSphere" style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />
          CourseSphere
        </h1>
        <Link to={isEdit ? `/courses/${id}` : '/dashboard'} style={{ color: '#fff', fontSize: '0.9rem' }}>
          ← Voltar
        </Link>
      </header>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <h1>{isEdit ? 'Editar Curso' : 'Novo Curso'}</h1>
          {errors.map(e => <p key={e} className="error">{e}</p>)}
          <form onSubmit={handleSubmit} className="course-form">
            <label>Nome *
              <input required minLength={3} value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />
            </label>
            <label>Descrição
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Suporta **negrito**, *itálico*, listas, etc."
              />
            </label>
            {form.description && (
              <div style={{
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                borderRadius: '10px', padding: '10px 14px',
                fontSize: '0.875rem', color: 'var(--text2)', lineHeight: '1.7'
              }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '6px' }}>Preview:</p>
                <ReactMarkdown>{form.description}</ReactMarkdown>
              </div>
            )}
            <label>Data de Início *
              <input type="date" required value={form.start_date}
                onChange={e => setForm({...form, start_date: e.target.value})} />
            </label>
            <label>Data de Fim *
              <input type="date" required value={form.end_date}
                onChange={e => setForm({...form, end_date: e.target.value})} />
            </label>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}