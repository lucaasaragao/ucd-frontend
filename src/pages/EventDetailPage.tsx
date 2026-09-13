import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEvent } from '../api/events'
import { createRegistration } from '../api/registrations'
import { Button } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import type { Event } from '../types'

export function EventDetailPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState<number | null>(null)

  useEffect(() => {
    if (!eventId) return
    getEvent(eventId)
      .then(setEvent)
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar evento'))
      .finally(() => setLoading(false))
  }, [eventId])

  async function handleRegister(categoryId: number) {
    setError(null)
    setRegistering(categoryId)
    try {
      await createRegistration(categoryId)
      navigate('/minhas-inscricoes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao se inscrever')
    } finally {
      setRegistering(null)
    }
  }

  if (loading)
    return (
      <p aria-busy="true" className="mx-auto mt-16 max-w-4xl px-4 text-slate-500">
        Carregando...
      </p>
    )
  if (!event)
    return (
      <p role="alert" className="mx-auto mt-16 max-w-4xl px-4 text-red-600">
        {error ?? 'Evento não encontrado'}
      </p>
    )

  return (
    <div className="mx-auto mt-10 max-w-4xl px-4">
      <h1 className="font-head text-3xl font-bold text-brand-blue-dark">{event.name}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {event.location} · {event.city}/{event.state} · {event.eventDate}
      </p>
      <p className="mt-4 text-slate-700">{event.description}</p>

      <h2 className="font-head mb-3 mt-8 text-xl font-bold text-brand-blue-dark">Categorias</h2>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {event.categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{category.name}</p>
              <p className="text-sm text-slate-500">
                {category.distanceMeters}m · R$ {category.price.toFixed(2)} ·{' '}
                {category.confirmedCount}/{category.maxParticipants} vagas
              </p>
            </div>
            {user?.role === 'ATHLETE' ? (
              <Button
                onClick={() => handleRegister(category.id)}
                disabled={!category.hasAvailableSlots || registering === category.id}
                className="shrink-0"
              >
                {registering === category.id
                  ? 'Inscrevendo...'
                  : category.hasAvailableSlots
                    ? 'Inscrever-se'
                    : 'Esgotado'}
              </Button>
            ) : !user ? (
              <span className="shrink-0 text-sm text-slate-400">Entre como atleta para se inscrever</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
