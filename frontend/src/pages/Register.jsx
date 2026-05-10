import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import logo from '../assets/logo.svg'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [errors, setErrors]   = useState([])
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
    setErrors([])
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Erro ao registrar'])
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
        <h2>Criar conta</h2>
        {errors.map(e => <p key={e} className="error">{e}</p>)}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nome"
            required
            minLength={2}
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={e => { setForm({...form, email: e.target.value}); setEmailError('') }}
          />
          {emailError && <p className="error">{emailError}</p>}
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            required
            minLength={6}
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
        <p>Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  )
}