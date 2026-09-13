import { createContext, useContext, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import { TOKEN_STORAGE_KEY } from '../api/client'
import type { User } from '../types'

const USER_STORAGE_KEY = 'ucd.user'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: authApi.RegisterPayload) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

function persistSession(token: string, user: User) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)

  async function login(email: string, password: string) {
    const auth = await authApi.login({ email, password })
    persistSession(auth.token, auth.user)
    setUser(auth.user)
  }

  async function register(payload: authApi.RegisterPayload) {
    const auth = await authApi.register(payload)
    persistSession(auth.token, auth.user)
    setUser(auth.user)
  }

  function logout() {
    authApi.logout().catch(() => {})
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  function updateUser(updated: User) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
