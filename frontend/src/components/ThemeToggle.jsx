import { useState } from 'react'

export default function ThemeToggle({ floating = false }) {
  const [dark, setDark] = useState(document.body.classList.contains('dark'))

  const toggle = () => {
    document.body.classList.toggle('dark')
    setDark(prev => !prev)
  }

  return (
    <button
      className={floating ? 'theme-toggle theme-toggle-floating' : 'theme-toggle'}
      onClick={toggle}
    >
      {dark ? '☀️ Claro' : '🌙 Escuro'}
    </button>
  )
}