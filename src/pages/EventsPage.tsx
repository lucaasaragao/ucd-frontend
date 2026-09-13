import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../api/events'
import type { Event } from '../types'

const EVENT_TYPE_ICON: Record<string, string> = {
  STREET_RACE: '🏃',
  TRAIL_RUN: '⛰️',
  WALK: '🚶',
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  STREET_RACE: 'Corrida de rua',
  TRAIL_RUN: 'Trail run',
  WALK: 'Caminhada',
}

function startingPrice(event: Event) {
  if (event.categories.length === 0) return null
  return Math.min(...event.categories.map((c) => c.price))
}

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listEvents()
      .then(setEvents)
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar eventos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p aria-busy="true" className="text-fg-subtle">Carregando eventos...</p>
  if (error) return <p role="alert" className="text-red-400">{error}</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-2">
        <h2 className="font-head text-2xl font-bold text-fg">Eventos disponíveis</h2>
        <span className="rounded-full bg-brand-yellow/10 px-3 py-1 text-sm font-semibold text-brand-yellow">
          {events.length} aberto{events.length === 1 ? '' : 's'}
        </span>
      </div>
      {events.length === 0 ? (
        <p className="text-fg-subtle">Nenhum evento publicado no momento. Volte em breve!</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const price = startingPrice(event)
            return (
              <li key={event.id}>
                <Link
                  to={`/eventos/${event.id}`}
                  className="block h-full rounded-md border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand-yellow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{EVENT_TYPE_ICON[event.eventType] ?? '🏁'}</span>
                      <h3 className="font-head text-lg font-bold text-fg">{event.name}</h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-hover px-2.5 py-1 text-xs font-semibold text-fg-muted">
                      {event.eventDate}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-fg-subtle">
                    📍 {event.city}/{event.state} · {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                    <span className="font-medium text-fg-muted">
                      {event.categories.length} categoria{event.categories.length === 1 ? '' : 's'}
                    </span>
                    {price !== null && (
                      <span className="font-head font-bold text-brand-yellow">A partir de R$ {price.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
