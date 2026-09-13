import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/ucd-runner-logo.jpg'
import { Button, Field, Input, Select } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('ATHLETE')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ name, email, password, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-head mb-8 flex items-center justify-center gap-2 text-xl font-bold text-white">
          <img src={logo} alt="UCD Runner" className="h-9 w-9 rounded-full" />
          UCD <span className="text-brand-yellow">RUNNER</span>
        </Link>
        <div className="rounded-md border border-white/10 bg-surface p-6">
          <h1 className="font-head mb-6 text-2xl font-bold text-white">Criar conta</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nome">
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Senha (mín. 6 caracteres)">
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field label="Perfil">
              <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="ATHLETE">Atleta (inscrever-se em eventos)</option>
                <option value="ORGANIZER">Organizador (criar eventos)</option>
              </Select>
            </Field>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-white/50">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-brand-yellow hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
