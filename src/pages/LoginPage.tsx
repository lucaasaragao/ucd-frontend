import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/ucd-runner-logo.jpg'
import { Button, Field, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-head mb-8 flex items-center justify-center gap-2 text-xl font-bold text-white">
          <img src={logo} alt="UCD Runner" className="h-9 w-9 rounded-full" />
          UCD <span className="text-brand-yellow">RUNNER</span>
        </Link>
        <div className="rounded-md border border-white/10 bg-surface p-6">
          <h1 className="font-head mb-6 text-2xl font-bold text-white">Entrar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Senha">
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-white/50">
            Não tem conta?{' '}
            <Link to="/registrar" className="font-medium text-brand-yellow hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
