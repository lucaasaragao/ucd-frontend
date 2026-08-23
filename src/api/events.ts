import { apiClient } from './client'
import type { Event } from '../types'

export function listEvents() {
  return apiClient.get<Event[]>('/api/events').then((r) => r.data)
}

export function getEvent(eventId: number | string) {
  return apiClient.get<Event>(`/api/events/${eventId}`).then((r) => r.data)
}
