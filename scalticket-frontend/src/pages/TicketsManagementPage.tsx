import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { useAuthStore } from '../store/authStore';
import { 
  Download, Wallet, Ticket, Ban, TrendingUp, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Imports des composants modulaires
import { StatCard } from '../features/admin/components/StatCard';
import { TicketFilters } from '../features/admin/components/TicketFilters';
import { TicketRow } from '../features/admin/components/TicketRow';
import { Pagination } from '../features/admin/components/Pagination';
import { TicketPreviewModal } from '../features/admin/components/TicketPreviewModal';
import { exportTicketsToCSV } from '../utils/csvExport';

export default function TicketsManagementPage() {
  // --- ÉTATS & STORES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  
  const itemsPerPage = 8;
  const { orders, fetchAllOrders, cancelOrder, isLoading } = useTicketStore();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // --- LOGIQUE FILTRAGE (Correction finale de l'erreur ID) ---
  const filteredOrders = useMemo(() => {
    let allOrders = Array.isArray(orders) ? orders : [];

    // Filtrage par utilisateur si Client
    if (!isAdmin) {
      allOrders = allOrders.filter(order => {
        // "as any" permet d'accéder à l'id si TS ne le voit pas dans l'interface
        const orderUserId = (order.user as any)?.id;
        return orderUserId === user?.id;
      });
    }

    // Filtrage par recherche et statut
    return allOrders.filter(order => {
      const userName = (order.user as any)?.name || '';
      const eventTitle = order.event?.title || '';
      const orderId = order.id || '';
      
      const matchesSearch = (userName + eventTitle + orderId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === '' || 
        (order.status || '').trim().toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter, isAdmin, user?.id]);

  // --- LOGIQUE STATISTIQUES ---
  const stats = useMemo(() => {
    if (!isAdmin || !orders || orders.length === 0) {
        return { revenue: 0, confirmedCount: 0, cancelledCount: 0, totalCount: 0 };
    }

    const confirmed = orders.filter(o => {
        const s = (o.status || '').trim().toUpperCase();
        return s === 'CONFIRMED' || s === 'SUCCESS' || s === 'COMPLETED';
    });

    const cancelled = orders.filter(o => {
        const s = (o.status || '').trim().toUpperCase();
        return s === 'CANCELLED' || s === 'ANNULÉ' || s === 'REJECTED';
    });

    const revenue = confirmed.reduce((acc, curr: any) => {
        const amount = Number(curr.event?.price || 0);
        return acc + amount;
    }, 0);

    return {
      revenue,
      confirmedCount: confirmed.length,
      cancelledCount: cancelled.length,
      totalCount: orders.length
    };
  }, [orders, isAdmin]);

  // --- LOGIQUE PAGINATION ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // --- ACTIONS ---
  const handleCancel = useCallback(async (orderId: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Voulez-vous vraiment annuler ce billet ?")) return;
    
    const loadingToast = toast.loading("Annulation en cours...");
    try {
      await cancelOrder(orderId);
      toast.success("Billet annulé avec succès !", { id: loadingToast });
    } catch (error) {
      toast.error("Erreur lors de l'annulation.", { id: loadingToast });
    }
  }, [cancelOrder, isAdmin]);

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">
            {isAdmin ? "Gestion des " : "Mes "}
            <span className="text-indigo-500">Billets</span>
          </h1>
          <p className="text-slate-400 mt-1 italic font-medium text-sm">
            {isAdmin ? "Console d'administration • Données PostgreSQL" : "Consultez et gérez vos accès"}
          </p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => exportTicketsToCSV(filteredOrders)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-white hover:text-black text-white rounded-xl font-bold transition-all shadow-xl active:scale-95 group"
          >
            <Download size={18} className="group-hover:animate-bounce" /> 
            <span>Export CSV</span>
          </button>
        )}
      </header>

      {/* STATS (ADMIN UNIQUEMENT) */}
      {isAdmin && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Revenu Global" value={`${stats.revenue.toLocaleString()}€`} icon={<Wallet className="text-emerald-500" />} color="emerald" />
          <StatCard title="Billets Actifs" value={stats.confirmedCount} icon={<Ticket className="text-indigo-500" />} color="indigo" />
          <StatCard title="Annulés" value={stats.cancelledCount} icon={<Ban className="text-red-500" />} color="red" />
          <StatCard title="Total" value={stats.totalCount} icon={<TrendingUp className="text-slate-400" />} color="slate" />
        </section>
      )}

      <TicketFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6">ID Commande</th>
                {isAdmin && <th className="px-8 py-6">Client</th>}
                <th className="px-8 py-6">Événement</th>
                <th className="px-8 py-6">Statut</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30 font-medium text-white">
              {paginatedOrders.map((order) => (
                <TicketRow 
                  key={order.id} 
                  order={order} 
                  onCancel={isAdmin ? handleCancel : () => {}} 
                  onView={(ticket) => setSelectedTicket(ticket)}
                  isAdmin={isAdmin}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {selectedTicket && (
        <TicketPreviewModal order={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}