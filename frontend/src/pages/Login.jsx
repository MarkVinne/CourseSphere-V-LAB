import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import logo from '../assets/logo.svg'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError('Digite um email válido')
      return
    }
    setEmailError('')
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <ThemeToggle floating />
      <div className="auth-card">
        <img src={logo} alt="CourseSphere" style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
        <h1>CourseSphere</h1>
        <h2>Entrar</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={e => { setForm({...form, email: e.target.value}); setEmailError('') }}
          />
          {emailError && <p className="error">{emailError}</p>}
          <input
            type="password"
            placeholder="Senha"
            required
            minLength={6}
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p>Não tem conta? <Link to="/register">Registre-se</Link></p>
      </div>
    </div>
  )
} 