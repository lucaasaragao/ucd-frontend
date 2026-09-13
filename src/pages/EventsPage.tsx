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

  if (loading)
    return (
      <p aria-busy="true" className="mx-auto mt-16 max-w-5xl px-4 text-slate-500">
        Carregando eventos...
      </p>
    )
  if (error)
    return (
      <p role="alert" className="mx-auto mt-16 max-w-5xl px-4 text-red-600">
        {error}
      </p>
    )

  return (
    <div className="mx-auto mt-10 max-w-5xl px-4 pb-16">
      <div className="mb-6 flex items-center justify-between gap-2">
        <h1 className="font-head text-3xl font-bold text-brand-blue-dark">Eventos disponíveis</h1>
        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-semibold text-brand-blue">
          {events.length} aberto{events.length === 1 ? '' : 's'}
        </span>
      </div>
      {events.length === 0 ? (
        <p className="text-slate-500">Nenhum evento publicado no momento. Volte em breve!</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => {
            const price = startingPrice(event)
            return (
              <li key={event.id}>
                <Link
                  to={`/eventos/${event.id}`}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-blue hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{EVENT_TYPE_ICON[event.eventType] ?? '🏁'}</span>
                      <h2 className="font-head text-lg font-bold text-slate-900">{event.name}</h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {event.eventDate}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    📍 {event.city}/{event.state} · {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                    <span className="font-medium text-slate-600">
                      {event.categories.length} categoria{event.categories.length === 1 ? '' : 's'}
                    </span>
                    {price !== null && (
                      <span className="font-head font-bold text-brand-blue">A partir de R$ {price.toFixed(2)}</span>
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
