import { Link } from 'react-router-dom'
import logo from '../assets/ucd-runner-logo.jpg'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <header className="border-b border-chrome-border bg-chrome">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-head flex items-center gap-2 text-lg font-bold text-chrome-fg">
          <img src={logo} alt="UCD Runner" className="h-8 w-8 rounded-full" />
          UCD <span className="text-brand-yellow">RUNNER</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="text-sm text-chrome-fg-muted hover:text-chrome-fg">
            Entrar
          </Link>
          <Link
            to="/registrar"
            className="rounded-md bg-brand-yellow px-3 py-1.5 text-sm font-bold text-black hover:bg-brand-yellow-hover"
          >
            Criar conta
          </Link>
        </div>
      </nav>
    </header>
  )
}
