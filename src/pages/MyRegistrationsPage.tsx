import { useEffect, useState } from 'react'
import { listMyRegistrations } from '../api/registrations'
import { listMyResults } from '../api/results'
import { confirmPayment, rejectPayment } from '../api/payments'
import type { RaceResult, Registration } from '../types'

const STATUS_LABEL: Record<Registration['status'], string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmada',
  CANCELED: 'Cancelada',
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

  if (loading) return <p className="mx-auto mt-16 max-w-4xl px-4 text-slate-500">Carregando...</p>

  return (
    <div className="mx-auto mt-10 max-w-4xl px-4">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Minhas inscrições</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {registrations.length === 0 ? (
        <p className="text-slate-500">Você ainda não se inscreveu em nenhum evento.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {registrations.map((registration) => {
            const result = results.find((r) => r.registrationId === registration.id)
            const payment = registration.payment

            return (
              <li key={registration.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{registration.eventName}</p>
                    <p className="text-sm text-slate-500">
                      {registration.categoryName} · Código {registration.registrationCode}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {STATUS_LABEL[registration.status]}
                  </span>
                </div>

                {payment && (
                  <div className="mt-3 flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                    <span className="text-slate-600">
                      Pagamento: R$ {payment.amount.toFixed(2)} · {payment.status}
                    </span>
                    {payment.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(payment.id)}
                          disabled={busyPaymentId === payment.id}
                          className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          Simular pagamento aprovado
                        </button>
                        <button
                          onClick={() => handleReject(payment.id)}
                          disabled={busyPaymentId === payment.id}
                          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {result && (
                  <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
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
