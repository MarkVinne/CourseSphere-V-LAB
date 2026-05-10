import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/client'
import ThemeToggle from '../components/ThemeToggle'
import logo from '../assets/logo.svg'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCourses = async (q = '') => {
    setLoading(true)
    try {
      const { data } = await api.get('/courses', { params: q ? { q } : {} })
      setCourses(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  const handleSearch = e => {
    e.preventDefault()
    fetchCourses(search)
  }

  const handleDelete = async id => {
    if (!confirm('Excluir este curso?')) return
    await api.delete(`/courses/${id}`)
    fetchCourses()
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="CourseSphere" style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />
          CourseSphere
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Olá, {user?.name}</span>
          <ThemeToggle />
          <button onClick={logout} className="btn-secondary">Sair</button>
        </div>
      </header>

      <div className="page-content">
        <div className="toolbar">
          <form onSubmit={handleSearch} className="search-form">
            <input placeholder="Buscar cursos..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <button type="submit">Buscar</button>
          </form>
          <Link to="/courses/new" className="btn-primary">+ Novo Curso</Link>
        </div>

        {loading ? <p className="loading">Carregando...</p> : (
          <div className="course-grid">
            {courses.length === 0 && <p>Nenhum curso encontrado.</p>}
            {courses.map((c) => (
              <div key={c.id} className="course-card">
                <img
                  src={`https://picsum.photos/seed/course-${c.id}/600/160`}
                  alt="capa"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                />
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <p className="dates">{c.start_date} → {c.end_date}</p>
                <p className="meta">{c.lessons_count} aula(s)</p>
                <div className="card-actions">
                  <Link to={`/courses/${c.id}`}>Ver</Link>
                  {c.creator_id === user?.id && (
                    <>
                      <Link to={`/courses/${c.id}/edit`}>Editar</Link>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-small">Excluir</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}