import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMyRegistrations } from '../api/registrations'
import { listMyResults } from '../api/results'
import { confirmPayment, rejectPayment } from '../api/payments'
import { Button, StatTile } from '../components/ui'
import type { PaymentStatus, RaceResult, Registration } from '../types'

const STATUS_LABEL: Record<Registration['status'], string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmada',
  CANCELED: 'Cancelada',
}

const STATUS_BADGE: Record<Registration['status'], string> = {
  PENDING_PAYMENT: 'bg-amber-400/10 text-amber-400',
  CONFIRMED: 'bg-emerald-400/10 text-emerald-400',
  CANCELED: 'bg-red-400/10 text-red-400',
}

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  PENDING: 'bg-amber-400/10 text-amber-400',
  APPROVED: 'bg-emerald-400/10 text-emerald-400',
  REJECTED: 'bg-red-400/10 text-red-400',
}

export function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [results, setResults] = useState<RaceResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyPaymentId, setBusyPaymentId] = useState<number | null>(null)

  async function loadRegistrations() {
    const data = await listMyRegistrations()
    setRegistrations(data)
  }

  useEffect(() => {
    Promise.all([listMyRegistrations(), listMyResults()])
      .then(([regs, res]) => {
        setRegistrations(regs)
        setResults(res)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar inscrições'))
      .finally(() => setLoading(false))
  }, [])

  async function handleConfirm(paymentId: number) {
    setBusyPaymentId(paymentId)
    setError(null)
    try {
      await confirmPayment(paymentId)
      await loadRegistrations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao confirmar pagamento')
    } finally {
      setBusyPaymentId(null)
    }
  }

  async function handleReject(paymentId: number) {
    setBusyPaymentId(paymentId)
    setError(null)
    try {
      await rejectPayment(paymentId)
      await loadRegistrations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao rejeitar pagamento')
    } finally {
      setBusyPaymentId(null)
    }
  }

  if (loading) return <p aria-busy="true" className="text-fg-subtle">Carregando...</p>

  const confirmedCount = registrations.filter((r) => r.status === 'CONFIRMED').length
  const pendingCount = registrations.filter((r) => r.status === 'PENDING_PAYMENT').length

  return (
    <div>
      {registrations.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Inscrições" value={registrations.length} icon="🎽" accent="text-fg" />
          <StatTile label="Confirmadas" value={confirmedCount} icon="✅" accent="text-emerald-400" />
          <StatTile label="Aguardando pagamento" value={pendingCount} icon="⏳" accent="text-amber-400" />
          <StatTile label="Resultados" value={results.length} icon="🏅" accent="text-brand-yellow" />
        </div>
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}
      {registrations.length === 0 ? (
        <p className="text-fg-subtle">
          Você ainda não se inscreveu em nenhum evento.{' '}
          <Link to="/eventos" className="font-medium text-brand-yellow hover:underline">
            Ver eventos abertos
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {registrations.map((registration) => {
            const result = results.find((r) => r.registrationId === registration.id)
            const payment = registration.payment

            return (
              <li key={registration.id} className="rounded-md border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-fg">{registration.eventName}</p>
                    <p className="text-sm text-fg-subtle">
                      {registration.categoryName} · Código {registration.registrationCode}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[registration.status]}`}
                  >
                    {STATUS_LABEL[registration.status]}
                  </span>
                </div>

                {payment && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-hover px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-fg-muted">
                      Pagamento: R$ {payment.amount.toFixed(2)}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${PAYMENT_BADGE[payment.status]}`}>
                        {payment.status}
                      </span>
                    </span>
                    {payment.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => handleConfirm(payment.id)}
                          disabled={busyPaymentId === payment.id}
                          className="px-3 py-1.5 text-xs"
                        >
                          Simular pagamento aprovado
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleReject(payment.id)}
                          disabled={busyPaymentId === payment.id}
                          className="px-3 py-1.5 text-xs"
                        >
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {result && (
                  <div className="mt-3 rounded-md bg-emerald-400/10 px-3 py-2 text-sm text-emerald-400">
                    Resultado: {result.finishTime} (ritmo {result.pace}/km)
                    {result.overallPosition && ` · ${result.overallPosition}º geral`}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
