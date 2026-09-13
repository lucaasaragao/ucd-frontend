import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../api/events'
import type { Event } from '../types'

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
      <p aria-busy="true" className="mx-auto mt-16 max-w-4xl px-4 text-slate-500">
        Carregando eventos...
      </p>
    )
  if (error)
    return (
      <p role="alert" className="mx-auto mt-16 max-w-4xl px-4 text-red-600">
        {error}
      </p>
    )

  return (
    <div className="mx-auto mt-10 max-w-4xl px-4">
      <h1 className="font-head mb-6 text-3xl font-bold text-brand-blue-dark">Eventos disponíveis</h1>
      {events.length === 0 ? (
        <p className="text-slate-500">Nenhum evento publicado no momento. Volte em breve!</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                to={`/eventos/${event.id}`}
                className="block h-full rounded-lg border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-brand-blue hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-medium text-slate-900">{event.name}</h2>
                  <span className="shrink-0 text-sm text-slate-500">{event.eventDate}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {event.city}/{event.state} · {event.eventType}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
