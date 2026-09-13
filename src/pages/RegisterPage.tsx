import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
      navigate('/eventos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <h1 className="font-head mb-6 text-3xl font-bold text-brand-blue-dark">Criar conta</h1>
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
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-brand-blue hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
