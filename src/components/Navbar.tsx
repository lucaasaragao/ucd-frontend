import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/ucd-runner-logo.jpg'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/eventos" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <img src={logo} alt="UCD Runner" className="h-8 w-8 rounded-full" />
          UCD
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/eventos" className="text-slate-600 hover:text-slate-900">
            Eventos
          </Link>
          {user?.role === 'ATHLETE' && (
            <Link to="/minhas-inscricoes" className="text-slate-600 hover:text-slate-900">
              Minhas inscrições
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-500">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 hover:text-slate-900">
                Entrar
              </Link>
              <Link
                to="/registrar"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
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
