import { useState, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, Calendar, Activity, Menu, Settings, LogOut, Ticket 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AdminProfileModal } from '../features/admin/components/AdminProfileModal';
import { ErrorFallback } from '../components/ErrorFallback';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // --- FILTRAGE DES RÔLES ---
  const navigation = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    // Ces pages ne s'affichent QUE pour l'admin
    ...(user?.role === 'admin' ? [
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'PILOTAGE', path: '/monitor', icon: Activity },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar Overlay Mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-slate-800 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-4 italic font-black uppercase tracking-tighter text-xl">
               <Ticket className="text-indigo-600" /> ScalTicket
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  <item.icon size={20} />
                  <span className="font-bold uppercase tracking-widest text-[11px]">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} className="w-10 h-10 rounded-xl" alt="Avatar"/>
              <div className="truncate">
                <p className="text-xs font-black uppercase italic">{user?.name}</p>
                <p className="text-slate-500 text-[10px]">{user?.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsProfileOpen(true)} className="flex-1 py-2 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all flex justify-center"><Settings size={16}/></button>
              <button onClick={logout} className="flex-1 py-2 bg-slate-800 hover:bg-red-600 rounded-xl transition-all flex justify-center"><LogOut size={16}/></button>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-5">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={20}/></button>
        </header>

        <main className="p-6 lg:p-10">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {isProfileOpen && <AdminProfileModal user={user} onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
}