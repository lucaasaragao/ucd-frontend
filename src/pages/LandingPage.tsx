import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../api/events'
import logo from '../assets/ucd-runner-logo.jpg'
import { Reveal } from '../components/Reveal'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useCountdown } from '../hooks/useCountdown'
import type { Event } from '../types'

const EVENT_TYPE_LABEL: Record<string, string> = {
  STREET_RACE: 'Corrida de rua',
  TRAIL_RUN: 'Trail run',
  WALK: 'Caminhada',
}

export function LandingPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[] | null>(null)

  useEffect(() => {
    listEvents()
      .then((data) => setEvents([...data].sort((a, b) => a.eventDate.localeCompare(b.eventDate))))
      .catch(() => setEvents([]))
  }, [])

  const featured = events?.[0] ?? null
  const others = events?.slice(1) ?? []

  const countdownTarget = useMemo(
    () => (featured ? new Date(`${featured.eventDate}T00:00:00`) : null),
    [featured],
  )
  const countdown = useCountdown(countdownTarget)

  const stats = useMemo(() => {
    if (!events || events.length === 0) return null
    const categories = events.flatMap((e) => e.categories)
    return {
      events: events.length,
      slots: categories.reduce((sum, c) => sum + c.maxParticipants, 0),
      confirmed: categories.reduce((sum, c) => sum + c.confirmedCount, 0),
    }
  }, [events])

  return (
    <div className="font-body bg-ink text-fg">
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 h-[70px] border-b border-chrome-border bg-chrome backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="font-head flex items-center gap-2 text-2xl font-black uppercase tracking-wide text-chrome-fg">
            <img src={logo} alt="UCD Runner" className="h-10 w-10 rounded-full" />
            UCD <span className="text-brand-yellow">RUNNER</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-chrome-fg-muted md:flex">
            <a href="#proximo-evento" className="hover:text-brand-yellow">
              Próximo evento
            </a>
            <a href="#eventos" className="hover:text-brand-yellow">
              Eventos
            </a>
            <a href="#como-funciona" className="hover:text-brand-yellow">
              Como funciona
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link
                to="/dashboard"
                className="font-head rounded-md bg-brand-yellow px-5 py-2 text-sm font-bold uppercase tracking-wide text-black hover:bg-brand-yellow-hover"
              >
                Ir para a plataforma
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-chrome-fg-muted hover:text-chrome-fg sm:block">
                  Entrar
                </Link>
                <Link
                  to="/registrar"
                  className="font-head rounded-md bg-brand-yellow px-5 py-2 text-sm font-bold uppercase tracking-wide text-black hover:bg-brand-yellow-hover"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border pt-[70px]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          {featured && (
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-1.5 font-head text-sm font-bold uppercase tracking-wide text-black">
                🏃 Próxima corrida em {countdown.days} dias
              </span>
            </Reveal>
          )}
          <Reveal delay={100}>
            <p className="font-head mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-fg-subtle">
              UCD · Eventos de corrida de rua
            </p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-head mt-3 max-w-3xl text-6xl font-black uppercase leading-[0.95] text-fg sm:text-7xl">
              Organize e corra. <br />
              <em className="text-brand-yellow not-italic">Tudo em um só lugar.</em>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Inscrições, pagamento e resultados de corridas de rua em uma plataforma só. Encontre um evento e
              garanta sua vaga, ou crie o seu como organizador.
            </p>
          </Reveal>
          <Reveal delay={400} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#eventos"
              className="font-head inline-flex items-center gap-2 rounded-md bg-brand-yellow px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-brand-yellow-hover"
            >
              Ver eventos abertos
            </a>
            <Link to="/registrar" className="border-b border-dotted border-border pb-0.5 text-fg-muted hover:border-brand-yellow hover:text-brand-yellow">
              Criar conta grátis →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      {stats && (
        <section className="border-b border-border bg-surface py-8">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-6 text-center">
            <div>
              <span className="font-head block text-4xl font-black text-brand-yellow">{stats.events}</span>
              <span className="text-sm font-medium uppercase tracking-wide text-fg-muted">
                Evento{stats.events === 1 ? '' : 's'} publicado{stats.events === 1 ? '' : 's'}
              </span>
            </div>
            <div>
              <span className="font-head block text-4xl font-black text-brand-yellow">{stats.confirmed}</span>
              <span className="text-sm font-medium uppercase tracking-wide text-fg-muted">Inscrições confirmadas</span>
            </div>
            <div>
              <span className="font-head block text-4xl font-black text-brand-yellow">{stats.slots}</span>
              <span className="text-sm font-medium uppercase tracking-wide text-fg-muted">Vagas no total</span>
            </div>
          </div>
        </section>
      )}

      {/* PRÓXIMO EVENTO */}
      <section id="proximo-evento" className="border-b border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          {featured ? (
            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface-2">
                <div className="flex h-full items-center justify-center text-8xl">🏁</div>
                <span className="font-head absolute left-4 top-4 rounded-full bg-brand-yellow px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-black">
                  Inscrições abertas
                </span>
              </Reveal>
              <Reveal delay={150}>
                <SectionLabel>Próximo evento</SectionLabel>
                <h2 className="font-head text-4xl font-black uppercase leading-tight text-fg sm:text-5xl">
                  {featured.name}
                </h2>
                <ul className="mt-6 flex flex-col gap-3 text-fg-muted">
                  <li>📅 <strong className="text-fg">Data:</strong> {formatDate(featured.eventDate)}</li>
                  <li>📍 <strong className="text-fg">Local:</strong> {featured.location} · {featured.city}/{featured.state}</li>
                  <li>
                    🏃 <strong className="text-fg">Modalidade:</strong> {EVENT_TYPE_LABEL[featured.eventType] ?? featured.eventType}
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    🎽 <strong className="text-fg">Categorias:</strong>
                    {featured.categories.map((c) => (
                      <span key={c.id} className="rounded-full bg-surface-2 px-3 py-0.5 text-xs font-semibold text-fg">
                        {c.name} · R$ {c.price.toFixed(2)}
                      </span>
                    ))}
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to={`/eventos/${featured.id}`}
                    className="font-head rounded-md bg-brand-yellow px-7 py-3.5 text-lg font-bold uppercase tracking-wide text-black hover:bg-brand-yellow-hover"
                  >
                    Garantir minha vaga →
                  </Link>
                </div>
              </Reveal>
            </div>
          ) : events === null ? (
            <p className="text-center text-fg-subtle">Carregando eventos...</p>
          ) : (
            <p className="text-center text-fg-subtle">Nenhum evento publicado no momento. Volte em breve!</p>
          )}
        </div>
      </section>

      {/* OUTROS EVENTOS */}
      {others.length > 0 && (
        <section id="eventos" className="border-b border-border bg-surface py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionLabel>Mais eventos</SectionLabel>
              <h2 className="font-head text-4xl font-black uppercase text-fg">Outros eventos abertos</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((event, i) => (
                <Reveal key={event.id} delay={i * 80}>
                  <Link
                    to={`/eventos/${event.id}`}
                    className="block h-full rounded-md border border-border bg-ink p-6 transition hover:-translate-y-1 hover:border-brand-yellow"
                  >
                    <p className="font-head text-xl font-bold uppercase text-fg">{event.name}</p>
                    <p className="mt-1 text-sm text-fg-subtle">
                      📅 {formatDate(event.eventDate)} · 📍 {event.city}/{event.state}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-brand-yellow">
                      {event.categories.length} categoria{event.categories.length === 1 ? '' : 's'} disponível{event.categories.length === 1 ? '' : 'is'}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="border-b border-border py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <SectionLabel center>Como participar</SectionLabel>
            <h2 className="font-head text-4xl font-black uppercase text-fg">Simples assim</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { n: '01', title: 'Crie sua conta', desc: 'Cadastre-se como atleta em segundos para se inscrever em eventos.' },
              { n: '02', title: 'Escolha um evento', desc: 'Veja os eventos abertos, escolha sua modalidade e faça sua inscrição.' },
              { n: '03', title: 'Confirme e corra', desc: 'Simule o pagamento, acompanhe o status e confira seu resultado depois da prova.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="font-head mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-brand-yellow text-3xl font-black text-black">
                  {step.n}
                </div>
                <p className="font-head mt-4 text-xl font-bold uppercase text-fg">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARA ATLETAS / ORGANIZADORES */}
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          <Reveal className="rounded-md border border-border bg-ink p-10">
            <p className="text-3xl">🏃</p>
            <h3 className="font-head mt-3 text-2xl font-black uppercase text-fg">Sou atleta</h3>
            <p className="mt-2 text-fg-muted">Encontre eventos, inscreva-se em uma categoria e acompanhe seu pagamento e resultado.</p>
            <Link
              to="/registrar"
              className="font-head mt-6 inline-block rounded-md bg-brand-yellow px-6 py-3 text-sm font-bold uppercase tracking-wide text-black hover:bg-brand-yellow-hover"
            >
              Criar conta de atleta
            </Link>
          </Reveal>
          <Reveal delay={100} className="rounded-md border border-border bg-ink p-10">
            <p className="text-3xl">🏆</p>
            <h3 className="font-head mt-3 text-2xl font-black uppercase text-fg">Sou organizador</h3>
            <p className="mt-2 text-fg-muted">Publique seu evento, defina categorias e vagas, e acompanhe as inscrições.</p>
            <Link
              to="/registrar"
              className="font-head mt-6 inline-block rounded-md border border-border px-6 py-3 text-sm font-bold uppercase tracking-wide text-fg hover:border-brand-yellow hover:text-brand-yellow"
            >
              Criar conta de organizador
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal>
            <h2 className="font-head text-5xl font-black uppercase leading-tight text-fg">
              Sua próxima corrida <br /> começa aqui.
            </h2>
            <p className="mt-4 text-fg-muted">Crie sua conta gratuita e garanta sua vaga no próximo evento.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/registrar"
                className="font-head rounded-md bg-brand-yellow px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-brand-yellow-hover"
              >
                Criar conta →
              </Link>
              <a
                href="#eventos"
                className="font-head rounded-md border-2 border-border px-8 py-4 text-lg font-bold uppercase tracking-wide text-fg hover:border-brand-yellow"
              >
                Ver eventos
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface py-12 text-fg-subtle">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
            <span className="font-head flex items-center gap-2 text-xl font-black uppercase text-fg">
              <img src={logo} alt="UCD Runner" className="h-8 w-8 rounded-full" />
              UCD <span className="text-brand-yellow">RUNNER</span>
            </span>
            <nav className="flex flex-wrap gap-6 text-sm">
              <a href="#proximo-evento" className="hover:text-brand-yellow">Próximo evento</a>
              <a href="#eventos" className="hover:text-brand-yellow">Eventos</a>
              <Link to="/login" className="hover:text-brand-yellow">Entrar</Link>
              <Link to="/registrar" className="hover:text-brand-yellow">Criar conta</Link>
            </nav>
          </div>
          <p className="mt-6 text-sm">© {new Date().getFullYear()} UCD · Plataforma de eventos de corrida de rua</p>
        </div>
      </footer>
    </div>
  )
}

function SectionLabel({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`font-head mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-yellow ${center ? 'justify-center' : ''}`}>
      <span className="h-px w-8 bg-brand-yellow" />
      {children}
      {center && <span className="h-px w-8 bg-brand-yellow" />}
    </div>
  )
}

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
