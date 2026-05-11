import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/client'
import logo from '../assets/logo.svg'
import ReactMarkdown from 'react-markdown'

export default function CourseDetail() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse]         = useState(null)
  const [lessons, setLessons]       = useState([])
  const [instructor, setInstructor] = useState(null)
  const [students, setStudents]     = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [lessonForm, setLessonForm] = useState({ title: '', status: 'draft', video_url: '' })
  const [lessonErrors, setLessonErrors] = useState([])
  const [loading, setLoading]       = useState(true)

  const fetchData = async () => {
    const [c, l] = await Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/lessons`, { params: statusFilter ? { status: statusFilter } : {} })
    ])
    setCourse(c.data)
    setLessons(l.data)
    setLoading(false)
  }

  const fetchPeople = async () => {
    const res  = await fetch('https://randomuser.me/api/?results=6')
    const data = await res.json()
    setInstructor(data.results[0])
    setStudents(data.results.slice(1))
  }

  useEffect(() => { fetchData(); fetchPeople() }, [id])
  useEffect(() => { if (!loading) fetchData() }, [statusFilter])

  const isCreator = course?.creator_id === user?.id
  const visibleLessons = isCreator
    ? lessons
    : lessons.filter(l => l.status === 'published')

  const handleDeleteCourse = async () => {
  if (!confirm('Excluir este curso?')) return
  await api.delete(`/courses/${id}`)
  navigate('/dashboard')
  }

  const handleCreateLesson = async e => {
    e.preventDefault()
    setLessonErrors([])
    try {
      await api.post(`/courses/${id}/lessons`, lessonForm)
      setLessonForm({ title: '', status: 'draft', video_url: '' })
      fetchData()
    } catch (err) {
      setLessonErrors(err.response?.data?.errors || ['Erro ao criar aula'])
    }
  }

  const handleDeleteLesson = async lessonId => {
    if (!confirm('Excluir esta aula?')) return
    await api.delete(`/courses/${id}/lessons/${lessonId}`)
    fetchData()
  }

  const toggleStatus = async lesson => {
    const newStatus = lesson.status === 'draft' ? 'published' : 'draft'
    await api.patch(`/courses/${id}/lessons/${lesson.id}`, { status: newStatus })
    fetchData()
  }

  const publishedCount = lessons.filter(l => l.status === 'published').length
  const progress = lessons.length > 0 ? Math.round((publishedCount / lessons.length) * 100) : 0
  const bannerUrl = `https://picsum.photos/seed/course-${id}/1200/340`

  if (loading) return <div className="loading">Carregando...</div>
  if (!course)  return <div>Curso não encontrado</div>

  return (
    <div className="page">
      <header className="page-header">
        
        <Link to="/dashboard" style={{ color: '#fff', fontSize: '0.9rem' }}>← Voltar</Link>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logo} alt="CourseSphere" style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />
            CourseSphere
        </h1>
        {isCreator && (
          <div>
            <Link to={`/courses/${id}/edit`} className="btn-secondary">Editar Curso</Link>
            <button onClick={handleDeleteCourse} className="btn-danger">Excluir</button>
          </div>
          
        )}
        
      </header>

      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={bannerUrl}
          alt="Capa do curso"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,14,26,0.85) 0%, rgba(15,14,26,0.2) 60%, transparent 100%)'
        }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
          <h1 style={{ color: '#fff', fontSize: '1.6rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {course.name}
          </h1>
          
        </div>
      </div>

      <div className="page-content">

        <div className="cd-stats-row">
          <div className="cd-stat">
            <span className="cd-stat-icon">📅</span>
            <div>
              <p className="cd-stat-label">Período</p>
              <p className="cd-stat-value">{course.start_date} → {course.end_date}</p>
            </div>
          </div>
          <div className="cd-stat">
            <span className="cd-stat-icon">🎬</span>
            <div>
              <p className="cd-stat-label">Total de aulas</p>
              <p className="cd-stat-value">{lessons.length}</p>
            </div>
          </div>
          <div className="cd-stat">
            <span className="cd-stat-icon">✅</span>
            <div>
              <p className="cd-stat-label">Publicadas</p>
              <p className="cd-stat-value">{publishedCount}</p>
            </div>
          </div>
          <div className="cd-stat">
            <span className="cd-stat-icon">👥</span>
            <div>
              <p className="cd-stat-label">Alunos</p>
              <p className="cd-stat-value">{students.length}</p>
            </div>
          </div>
        </div>


        {course.description && (
          <div className="cd-card" style={{ marginBottom: '1.25rem' }}>
            <h3 className="cd-card-title">📋 Sobre o curso</h3>
            <div style={{ color: 'var(--text2)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="cd-two-col">

          <div style={{ flex: 1, minWidth: 0 }}>

            {/* INSTRUTOR */}
            {instructor && (
              <div className="cd-card" style={{ marginBottom: '1.25rem' }}>
                <h3 className="cd-card-title">👨‍🏫 Instrutor</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={instructor.picture.large} alt="Instrutor"
                    style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--primary-bg2)', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>
                      {instructor.name.first} {instructor.name.last}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>
                      {instructor.location.country}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '2px' }}>
                      {instructor.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {students.length > 0 && (
              <div className="cd-card">
                <h3 className="cd-card-title">👥 Turma ({students.length} alunos)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {students.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={s.picture.medium} alt={s.name.first}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
                          {s.name.first} {s.name.last}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{s.location.country}</p>
                      </div>
                      <span className={`badge ${i % 2 === 0 ? 'published' : 'draft'}`}
                        style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                        {i % 2 === 0 ? 'Ativo' : 'Ausente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: 2, minWidth: 0 }}>
            <div className="cd-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <h3 className="cd-card-title" style={{ margin: 0 }}>🎬 Aulas</h3>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '6px 12px', borderRadius: '20px' }}>
                  <option value="">Todos os status</option>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              {visibleLessons.length === 0 ? (
                <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '2rem 0' }}>
                  Nenhuma aula ainda.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {visibleLessons.map((l, i) => (
                    <li key={l.id} className="cd-lesson-item">
                      {/* miniatura da aula */}
                      <img
                        src={`https://picsum.photos/seed/lesson-${l.id}/80/50`}
                        alt="capa"
                        style={{ width: '64px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div className="cd-lesson-num">{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {l.title}
                        </p>
                        {l.video_url && (
                          <a href={l.video_url} target="_blank" rel="noreferrer"
                            style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                            🎥 Ver vídeo
                          </a>
                        )}
                      </div>
                      <span className={`badge ${l.status}`} style={{ flexShrink: 0 }}>
                        {l.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      {isCreator && (
                        <>
                          <button onClick={() => toggleStatus(l)} className="btn-small btn-secondary">
                            {l.status === 'draft' ? 'Publicar' : 'Rascunho'}
                          </button>
                          <button onClick={() => handleDeleteLesson(l.id)} className="btn-danger btn-small">
                            Excluir
                          </button>
                        </>
                      )}
                    </div>
                    </li>
                  ))}
                </ul>
              )}

              {isCreator && (
              <>
              <hr style={{ margin: '1.25rem 0' }} />
              <h3 className="cd-card-title">+ Nova Aula</h3>
              {lessonErrors.map(e => <p key={e} className="error">{e}</p>)}
              <form onSubmit={handleCreateLesson} className="lesson-form" style={{ background: 'var(--bg)', marginTop: '0.5rem' }}>
                <input placeholder="Título da aula" required minLength={3}
                  value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} />
                <select value={lessonForm.status} onChange={e => setLessonForm({...lessonForm, status: e.target.value})}>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
                <input placeholder="URL do vídeo (opcional)"
                  value={lessonForm.video_url} onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})} />
                <button type="submit" className="btn-primary">Adicionar Aula</button>
              </form>
              </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}