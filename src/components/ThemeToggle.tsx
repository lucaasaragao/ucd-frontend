import { useTheme } from '../context/ThemeContext'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      className={`grid h-9 w-9 place-items-center rounded-md border border-chrome-border text-chrome-fg-muted transition hover:bg-white/10 hover:text-chrome-fg ${className}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
