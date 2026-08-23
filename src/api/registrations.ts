import { apiClient } from './client'
import type { Registration } from '../types'

export function createRegistration(categoryId: number) {
  return apiClient.post<Registration>('/api/registrations', { categoryId }).then((r) => r.data)
}

export function listMyRegistrations() {
  return apiClient.get<Registration[]>('/api/me/registrations').then((r) => r.data)
}
