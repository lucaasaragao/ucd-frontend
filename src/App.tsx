import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/DashboardLayout'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { DashboardPage } from './pages/DashboardPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventsPage } from './pages/EventsPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MyRegistrationsPage } from './pages/MyRegistrationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

/** Eventos e detalhe do evento sao publicos: dentro do dashboard quando logado, pagina simples quando nao. */
function EventsShell({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth()
  if (user) return <DashboardLayout title={title}>{children}</DashboardLayout>
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrar" element={<RegisterPage />} />
      <Route
        path="/eventos"
        element={
          <EventsShell title="Eventos">
            <EventsPage />
          </EventsShell>
        }
      />
      <Route
        path="/eventos/:eventId"
        element={
          <EventsShell title="Detalhes do evento">
            <EventDetailPage />
          </EventsShell>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Dashboard">
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/minhas-inscricoes"
        element={
          <ProtectedRoute requiredRole="ATHLETE">
            <DashboardLayout title="Minhas inscrições">
              <MyRegistrationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Perfil">
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
