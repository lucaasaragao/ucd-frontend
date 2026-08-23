import { apiClient } from './client'
import type { RaceResult } from '../types'

export function listMyResults() {
  return apiClient.get<RaceResult[]>('/api/me/results').then((r) => r.data)
}
