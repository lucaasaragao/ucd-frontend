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

  if (loading) return <p aria-busy="true" className="text-fg-subtle">Carregando...</p>
  if (!event) return <p role="alert" className="text-red-400">{error ?? 'Evento não encontrado'}</p>

  return (
    <div>
      <h2 className="font-head text-2xl font-bold text-fg">{event.name}</h2>
      <p className="mt-1 text-sm text-fg-subtle">
        {event.location} · {event.city}/{event.state} · {event.eventDate}
      </p>
      <p className="mt-4 max-w-2xl text-fg-muted">{event.description}</p>

      <h3 className="font-head mb-3 mt-8 text-lg font-bold text-fg">Categorias</h3>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-400">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {event.categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-4"
          >
            <div>
              <p className="font-medium text-fg">{category.name}</p>
              <p className="text-sm text-fg-subtle">
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
              <span className="shrink-0 text-sm text-fg-subtle">Entre como atleta para se inscrever</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
