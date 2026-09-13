import { useState, type FormEvent } from 'react'
import { changePassword, updateProfile } from '../api/profile'
import { Button, Field, Input, Select } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import type { Gender } from '../types'

const GENDER_LABEL: Record<Gender, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro',
  PREFER_NOT_TO_SAY: 'Prefiro não informar',
}

const ROLE_LABEL: Record<string, string> = {
  ATHLETE: 'Atleta',
  ORGANIZER: 'Organizador',
}

export function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [cpf, setCpf] = useState(user?.cpf ?? '')
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? '')
  const [gender, setGender] = useState<Gender | ''>(user?.gender ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [state, setState] = useState(user?.state ?? '')
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  if (!user) return null

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(false)
    setSavingProfile(true)
    try {
      const updated = await updateProfile({ name, phone, cpf, birthDate, gender, city, state })
      updateUser(updated)
      setProfileSuccess(true)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Falha ao atualizar perfil')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    setSavingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPasswordSuccess(true)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Falha ao trocar senha')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl px-4 pb-16">
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-brand-blue-dark p-6 text-white">
        <div className="font-head grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-yellow text-2xl font-black text-brand-blue-dark">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-head text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-white/70">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
            {ROLE_LABEL[user.role] ?? user.role}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-6">
        <h2 className="font-head mb-4 text-xl font-bold text-brand-blue-dark">Dados pessoais</h2>
        <form onSubmit={handleProfileSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome">
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Telefone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="CPF">
            <Input value={cpf} onChange={(e) => setCpf(e.target.value)} />
          </Field>
          <Field label="Data de nascimento">
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </Field>
          <Field label="Gênero">
            <Select value={gender} onChange={(e) => setGender(e.target.value as Gender | '')}>
              <option value="">Prefiro não informar agora</option>
              {(Object.keys(GENDER_LABEL) as Gender[]).map((g) => (
                <option key={g} value={g}>
                  {GENDER_LABEL[g]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cidade">
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="Estado">
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </Field>
          <div className="flex items-end sm:col-span-2">
            <div className="flex w-full flex-wrap items-center gap-3">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? 'Salvando...' : 'Salvar alterações'}
              </Button>
              {profileSuccess && <span className="text-sm text-emerald-600">Perfil atualizado!</span>}
              {profileError && (
                <span role="alert" className="text-sm text-red-600">
                  {profileError}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 p-6">
        <h2 className="font-head mb-4 text-xl font-bold text-brand-blue-dark">Trocar senha</h2>
        <form onSubmit={handlePasswordSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Senha atual">
            <Input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>
          <Field label="Nova senha (mín. 6 caracteres)">
            <Input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <div className="flex items-end sm:col-span-2">
            <div className="flex w-full flex-wrap items-center gap-3">
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? 'Salvando...' : 'Trocar senha'}
              </Button>
              {passwordSuccess && <span className="text-sm text-emerald-600">Senha alterada!</span>}
              {passwordError && (
                <span role="alert" className="text-sm text-red-600">
                  {passwordError}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
