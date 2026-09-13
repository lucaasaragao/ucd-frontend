import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/ucd-runner-logo.jpg'
import { useAuth } from '../context/AuthContext'

interface NavItem {
  to: string
  label: string
  icon: string
}

export function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/eventos', label: 'Eventos', icon: '🏁' },
    ...(user?.role === 'ATHLETE'
      ? [{ to: '/minhas-inscricoes', label: 'Minhas inscrições', icon: '🎽' }]
      : []),
    { to: '/perfil', label: 'Perfil', icon: '👤' },
  ]

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <>
      <Link to="/dashboard" className="font-head flex items-center gap-2 px-5 py-6 text-lg font-bold text-white">
        <img src={logo} alt="UCD Runner" className="h-9 w-9 rounded-full" />
        UCD <span className="text-brand-yellow">RUNNER</span>
      </Link>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-brand-yellow/10 text-brand-yellow' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <span className="text-lg">🚪</span>
          Sair
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-ink">
      {/* sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-surface md:flex">
        {sidebarContent}
      </aside>

      {/* sidebar (mobile overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col border-r border-white/10 bg-surface">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              aria-label="Abrir menu"
              onClick={() => setMobileOpen(true)}
              className="text-xl text-white md:hidden"
            >
              ☰
            </button>
            <h1 className="font-head text-xl font-bold text-white">{title}</h1>
          </div>
          {user && (
            <Link to="/perfil" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <span className="font-head grid h-8 w-8 place-items-center rounded-full bg-brand-yellow text-sm font-black text-black">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{user.name}</span>
            </Link>
          )}
        </header>
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  )
}
