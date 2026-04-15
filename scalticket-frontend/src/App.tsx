import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useTicketStore } from './store/useTicketStore';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientStorePage from './pages/ClientStoragePage';
import DashboardLayout from './layouts/DashboardLayouts';
import AdminOverview from './features/dashboard/AdminOverview';
import EventsPage from './pages/EventPage';
import SystemMonitorPage from './pages/SystemMonitorPage';
import TicketsManagementPage from './pages/TicketsManagementPage';
import { WaitingRoom } from './features/queue/WaitingRoom';

// --- COMPOSANT DE PROTECTION ÉVOLUÉ ---
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Nouvelle option pour filtrer
}

function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la page demande d'être Admin mais que l'utilisateur est un simple 'user'
  if (requireAdmin && user?.role !== 'admin') {
    // On le renvoie vers l'aperçu général (accessible aux clients)
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();
  const { isInQueue } = useTicketStore();

  if (isInQueue) {
    return <WaitingRoom />;
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            zIndex: 9999,
          },
        }}
      />

      <Routes>
        {/* --- PUBLIC --- */}
        <Route path="/" element={<ClientStorePage />} />
        
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
        />

        {/* --- DASHBOARD (LOGIQUE FILTRÉE) --- */}
        
        {/* 1. Aperçu & Billets : Ouvert aux Admins ET Clients */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminOverview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TicketsManagementPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 2. Événements & Moniteur : STRICTEMENT RÉSERVÉ AUX ADMINS */}
        <Route
          path="/events"
          element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <EventsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout>
                <SystemMonitorPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;