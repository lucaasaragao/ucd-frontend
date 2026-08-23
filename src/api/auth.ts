import { apiClient } from './client'
import type { AuthResponse, Role } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: Role
  phone?: string
  cpf?: string
  city?: string
  state?: string
}

export function login(payload: LoginPayload) {
  return apiClient.post<AuthResponse>('/api/auth/login', payload).then((r) => r.data)
}

export function register(payload: RegisterPayload) {
  return apiClient.post<AuthResponse>('/api/auth/register', payload).then((r) => r.data)
}

export function logout() {
  return apiClient.post<void>('/api/auth/logout')
}
