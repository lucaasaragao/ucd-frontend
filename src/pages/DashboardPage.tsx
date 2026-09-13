import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../api/events'
import { listMyRegistrations } from '../api/registrations'
import { listMyResults } from '../api/results'
import { Card, StatTile } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import type { Event, RaceResult, Registration } from '../types'

const STATUS_LABEL: Record<Registration['status'], string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmada',
  CANCELED: 'Cancelada',
}

const STATUS_DOT: Record<Registration['status'], string> = {
  PENDING_PAYMENT: 'bg-amber-400',
  CONFIRMED: 'bg-emerald-400',
  CANCELED: 'bg-red-400',
}

function daysUntil(isoDate: string) {
  const target = new Date(`${isoDate}T00:00:00`).getTime()
  const diff = target - Date.now()
  return Math.ceil(diff / 86_400_000)
}

export function DashboardPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<Registration[] | null>(null)
  const [results, setResults] = useState<RaceResult[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    if (user?.role !== 'ATHLETE') return
    Promise.all([listMyRegistrations(), listMyResults(), listEvents()])
      .then(([regs, res, evts]) => {
        setRegistrations(regs)
        setResults(res)
        setEvents(evts)
      })
      .catch(() => setRegistrations([]))
  }, [user])

  const confirmedCount = registrations?.filter((r) => r.status === 'CONFIRMED').length ?? 0
  const pendingCount = registrations?.filter((r) => r.status === 'PENDING_PAYMENT').length ?? 0
  const canceledCount = registrations?.filter((r) => r.status === 'CANCELED').length ?? 0
  const total = registrations?.length ?? 0

  const nextRace = useMemo(() => {
    if (!registrations) return null
    return registrations
      .filter((r) => r.status !== 'CANCELED')
      .map((r) => ({ registration: r, event: events.find((e) => e.id === r.eventId) }))
      .filter((r) => r.event && daysUntil(r.event.eventDate) >= 0)
      .sort((a, b) => daysUntil(a.event!.eventDate) - daysUntil(b.event!.eventDate))[0] ?? null
  }, [registrations, events])

  const statusRing = useMemo(() => {
    if (total === 0) return null
    const confirmedPct = (confirmedCount / total) * 360
    const pendingPct = (pendingCount / total) * 360
    return `conic-gradient(#34d399 0deg ${confirmedPct}deg, #fbbf24 ${confirmedPct}deg ${confirmedPct + pendingPct}deg, #f87171 ${confirmedPct + pendingPct}deg 360deg)`
  }, [total, confirmedCount, pendingCount])

  if (user?.role !== 'ATHLETE') {
    return (
      <Card>
        <p className="text-fg-muted">
          Métricas de organizador ainda não disponíveis nesta versão. Veja{' '}
          <Link to="/eventos" className="font-medium text-brand-yellow hover:underline">
            eventos publicados
          </Link>
          .
        </p>
      </Card>
    )
  }

  if (registrations === null) return <p className="text-fg-subtle">Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-head text-2xl font-bold text-fg">Olá, {user.name.split(' ')[0]} 👋</h2>
        <p className="mt-1 text-sm text-fg-subtle">Aqui está um resumo da sua jornada como corredor.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Inscrições" value={total} icon="🎽" accent="text-fg" />
        <StatTile label="Confirmadas" value={confirmedCount} icon="✅" accent="text-emerald-400" />
        <StatTile label="Aguardando pagamento" value={pendingCount} icon="⏳" accent="text-amber-400" />
        <StatTile label="Resultados" value={results.length} icon="🏅" accent="text-brand-yellow" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-head mb-4 text-lg font-bold text-fg">Próxima corrida</h3>
          {nextRace?.event ? (
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="font-head grid h-20 w-20 shrink-0 place-items-center rounded-md bg-brand-yellow/10 text-center text-brand-yellow">
                <div>
                  <p className="text-2xl font-black leading-none">{daysUntil(nextRace.event.eventDate)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide">dias</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-head text-lg font-bold text-fg">{nextRace.event.name}</p>
                <p className="text-sm text-fg-subtle">
                  {nextRace.registration.categoryName} · 📍 {nextRace.event.city}/{nextRace.event.state} · 📅{' '}
                  {nextRace.event.eventDate}
                </p>
              </div>
              <Link
                to="/minhas-inscricoes"
                className="shrink-0 rounded-md bg-brand-yellow px-4 py-2 text-sm font-bold uppercase text-black hover:bg-brand-yellow-hover"
              >
                Ver detalhes
              </Link>
            </div>
          ) : (
            <p className="text-fg-subtle">
              Nenhuma corrida futura confirmada.{' '}
              <Link to="/eventos" className="font-medium text-brand-yellow hover:underline">
                Ver eventos abertos
              </Link>
            </p>
          )}
        </Card>

        <Card>
          <h3 className="font-head mb-4 text-lg font-bold text-fg">Status das inscrições</h3>
          {statusRing ? (
            <div className="flex items-center gap-5">
              <div
                className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
                style={{ background: statusRing }}
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-surface">
                  <span className="font-head text-xl font-black text-fg">{total}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 text-xs text-fg-muted">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Confirmadas ({confirmedCount})
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Pendentes ({pendingCount})
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" /> Canceladas ({canceledCount})
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-fg-subtle">Sem inscrições ainda.</p>
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-head text-lg font-bold text-fg">Atividade recente</h3>
          <Link to="/minhas-inscricoes" className="text-sm font-medium text-brand-yellow hover:underline">
            Ver todas →
          </Link>
        </div>
        {registrations.length === 0 ? (
          <p className="text-sm text-fg-subtle">Você ainda não se inscreveu em nenhum evento.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {registrations.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 py-3">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[r.status]}`} />
                  <div>
                    <p className="text-sm font-medium text-fg">{r.eventName}</p>
                    <p className="text-xs text-fg-subtle">{r.categoryName}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-fg-muted">{STATUS_LABEL[r.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
