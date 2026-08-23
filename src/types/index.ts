export type Role = 'ATHLETE' | 'ORGANIZER'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  cpf: string | null
  birthDate: string | null
  gender: string | null
  city: string | null
  state: string | null
  role: Role
  status: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  user: User
}

export interface EventCategory {
  id: number
  eventId: number
  name: string
  distanceMeters: number
  price: number
  maxParticipants: number
  confirmedCount: number
  status: string
  hasAvailableSlots: boolean
}

export interface Event {
  id: number
  organizerId: number
  organizerName: string
  name: string
  description: string
  eventType: string
  eventDate: string
  registrationStart: string
  registrationEnd: string
  location: string
  city: string
  state: string
  status: string
  createdAt: string
  categories: EventCategory[]
}

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Payment {
  id: number
  registrationId: number
  amount: number
  method: string
  status: PaymentStatus
  provider: string | null
  externalId: string | null
  createdAt: string
  paidAt: string | null
}

export type RegistrationStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELED'

export interface Registration {
  id: number
  registrationCode: string
  userId: number
  userName: string
  eventId: number
  eventName: string
  categoryId: number
  categoryName: string
  status: RegistrationStatus
  price: number
  createdAt: string
  confirmedAt: string | null
  payment: Payment | null
}

export interface RaceResult {
  id: number
  registrationId: number
  registrationCode: string
  userName: string
  categoryName: string
  distanceMeters: number
  finishTime: string
  finishTimeSeconds: number
  paceSeconds: number
  pace: string
  overallPosition: number | null
  categoryPosition: number | null
  createdAt: string
}

export interface ApiError {
  message: string
  status?: number
}
