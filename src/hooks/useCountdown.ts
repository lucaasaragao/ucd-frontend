import { useEffect, useState } from 'react'

export function useCountdown(target: Date | null) {
  const [remainingMs, setRemainingMs] = useState(() => (target ? target.getTime() - Date.now() : 0))

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setRemainingMs(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  const clamped = Math.max(remainingMs, 0)
  return {
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1_000),
  }
}
