import { apiClient } from './client'
import type { Payment } from '../types'

export function confirmPayment(paymentId: number) {
  return apiClient.post<Payment>(`/api/payments/${paymentId}/confirm`).then((r) => r.data)
}

export function rejectPayment(paymentId: number) {
  return apiClient.post<Payment>(`/api/payments/${paymentId}/reject`).then((r) => r.data)
}
