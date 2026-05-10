import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import ThemeToggle from '../components/ThemeToggle'

export default function Landing() {
  return (
    <div className="landing">
      <ThemeToggle floating />

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-logo">
            <img src={logo} alt="CourseSphere" style={{ width: '64px', height: '64px' }} />
          </div>
          <h1 className="landing-title">
            Course<span>Sphere</span>
          </h1>
          <p className="landing-subtitle">
            Crie, organize e gerencie seus cursos online em um só lugar.
            <br />Simples, colaborativo e bonito.
          </p>
          <div className="landing-actions">
            <Link to="/register" className="landing-btn-primary">
              Começar agora →
            </Link>
            <Link to="/login" className="landing-btn-secondary">
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="landing-blob landing-blob-1" />
        <div className="landing-blob landing-blob-2" />
        <div className="landing-blob landing-blob-3" />
      </section>

      <section className="landing-features">
        <h2 className="landing-section-title">Tudo que você precisa</h2>
        <div className="landing-features-grid">
          {[
            { icon: '🎓', title: 'Crie cursos', desc: 'Monte seus cursos com nome, descrição, datas de início e fim.' },
            { icon: '🎬', title: 'Gerencie aulas', desc: 'Adicione aulas, controle o status entre rascunho e publicado.' },
            { icon: '👥', title: 'Colaborativo', desc: 'Outros usuários podem visualizar e acompanhar seus cursos.' },
          ].map(f => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      

      <section className="landing-cta">
        <h2>Pronto para começar?</h2>
        <p>Crie sua conta gratuitamente e comece a organizar seus cursos agora.</p>
        <Link to="/register" className="landing-btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
          Criar conta grátis →
        </Link>
      </section>


      <footer className="landing-footer">
        <img src={logo} alt="CourseSphere" style={{ width: '24px', height: '24px', opacity: 0.6 }} />
        <span>CourseSphere © 2026</span>
      </footer>
    </div>
  )
}