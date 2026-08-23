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

  if (loading) return <p className="mx-auto mt-16 max-w-4xl px-4 text-slate-500">Carregando eventos...</p>
  if (error) return <p className="mx-auto mt-16 max-w-4xl px-4 text-red-600">{error}</p>

  return (
    <div className="mx-auto mt-10 max-w-4xl px-4">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Eventos disponíveis</h1>
      {events.length === 0 ? (
        <p className="text-slate-500">Nenhum evento publicado no momento.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                to={`/eventos/${event.id}`}
                className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-slate-900">{event.name}</h2>
                  <span className="text-sm text-slate-500">{event.eventDate}</span>
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
