import { apiClient } from './client'
import type { Gender, User } from '../types'

export interface UpdateProfilePayload {
  name: string
  phone: string
  cpf: string
  birthDate: string
  gender: Gender | ''
  city: string
  state: string
}

export function updateProfile(payload: UpdateProfilePayload) {
  return apiClient.put<User>('/api/me', {
    ...payload,
    birthDate: payload.birthDate || null,
    gender: payload.gender || null,
  }).then((r) => r.data)
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiClient.put<void>('/api/me/password', { currentPassword, newPassword })
}
