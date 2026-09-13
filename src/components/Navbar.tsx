import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/ucd-runner-logo.jpg'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function navLinkClass(to: string) {
    const active = pathname === to
    return `text-sm ${active ? 'font-semibold text-brand-blue' : 'text-slate-600 hover:text-slate-900'}`
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/eventos" className="font-head flex items-center gap-2 text-lg font-bold text-brand-blue-dark">
          <img src={logo} alt="UCD Runner" className="h-8 w-8 rounded-full" />
          UCD
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/eventos" className={navLinkClass('/eventos')}>
            Eventos
          </Link>
          {user?.role === 'ATHLETE' && (
            <Link to="/minhas-inscricoes" className={navLinkClass('/minhas-inscricoes')}>
              Minhas inscrições
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.name}</span>
              <Button variant="secondary" onClick={handleLogout} className="px-3 py-1.5 text-xs">
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={navLinkClass('/login')}>
                Entrar
              </Link>
              <Link
                to="/registrar"
                className="rounded-md bg-brand-blue px-3 py-1.5 text-sm text-white hover:bg-brand-blue-dark"
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
