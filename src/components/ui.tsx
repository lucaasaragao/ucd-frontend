import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const fieldClass =
  'w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-white/60">{label}</label>
      {children}
    </div>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldClass} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${fieldClass} [&>option]:bg-surface [&>option]:text-white`} />
  )
}

const buttonVariants = {
  primary: 'bg-brand-yellow text-black hover:bg-brand-yellow-hover',
  secondary: 'border border-white/15 text-white hover:bg-white/5',
  danger: 'border border-red-500/30 text-red-400 hover:bg-red-500/10',
  success: 'bg-emerald-500 text-black hover:bg-emerald-400',
} as const

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${buttonVariants[variant]} ${className}`}
    />
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md border border-white/10 bg-surface p-5 ${className}`}>{children}</div>
}

export function StatTile({
  label,
  value,
  icon,
  accent = 'text-brand-yellow',
}: {
  label: string
  value: string | number
  icon?: ReactNode
  accent?: string
}) {
  return (
    <Card className="flex items-center gap-4">
      {icon && (
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white/5 text-xl ${accent}`}>
          {icon}
        </div>
      )}
      <div>
        <p className={`font-head text-2xl font-black ${accent}`}>{value}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-white/50">{label}</p>
      </div>
    </Card>
  )
}
