import { useTheme } from '../context/ThemeContext'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      className={`grid h-9 w-9 place-items-center rounded-md border border-border text-fg-muted transition hover:bg-hover hover:text-fg ${className}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
