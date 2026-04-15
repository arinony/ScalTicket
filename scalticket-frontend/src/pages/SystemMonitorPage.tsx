import { useEffect, useMemo } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { 
  TrendingUp, Calendar as CalendarIcon, Activity, 
  Layout, Loader2
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';

export default function SystemMonitorPage() {
  const { orders, events, fetchEvents, fetchAllOrders, isLoading } = useTicketStore();

  useEffect(() => {
    fetchEvents();
    fetchAllOrders();
  }, [fetchEvents, fetchAllOrders]);

  const revenuePerEvent = useMemo(() => {
    return events.map(event => {
      const eventOrders = orders.filter(o => 
        String(o.eventId) === String(event.id) && 
        (o.status?.toUpperCase() === 'CONFIRMED' || o.status?.toUpperCase() === 'SUCCESS')
      );
      const revenue = eventOrders.length * (event.price || 0);
      const attendanceRate = event.totalSlots > 0 ? (eventOrders.length / event.totalSlots) * 100 : 0;
      return {
        id: event.id,
        title: event.title,
        revenue,
        salesCount: eventOrders.length,
        attendanceRate: Math.min(attendanceRate, 100).toFixed(1)
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [events, orders]);

  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.date,
      backgroundColor: '#6366f1',
    }));
  }, [events]);

  if (isLoading && events.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          Dashboard <span className="text-indigo-500">Business</span>
        </h1>
        <p className="text-slate-400 mt-1 font-medium italic">Analyse réelle et planification.</p>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Concerts</p>
            <p className="text-3xl font-black text-white">{events.length}</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Revenue Total</p>
            <p className="text-3xl font-black text-white">
              {revenuePerEvent.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}€
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Layout size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Places Totales</p>
            <p className="text-3xl font-black text-white">
              {events.reduce((acc, curr) => acc + (curr.totalSlots || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TOP REVENUS */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <h3 className="text-white font-black uppercase text-[10px] mb-8 tracking-[0.3em] flex items-center gap-3">
            <TrendingUp size={16} className="text-indigo-500" /> Performances
          </h3>
          <div className="space-y-8">
            {revenuePerEvent.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-white font-bold text-xs truncate w-28 uppercase italic">{item.title}</span>
                  <span className="text-indigo-400 font-mono text-xs font-black">{item.revenue}€</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${item.attendanceRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CALENDRIER SANS DOUBLONS ET AVEC TITRES */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
           <h3 className="text-white font-black uppercase text-[10px] mb-8 tracking-[0.3em] flex items-center gap-3">
            <CalendarIcon size={16} className="text-indigo-500" /> Planification Annuelle
          </h3>
          
          <div className="calendar-fix">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale={frLocale}
              events={calendarEvents}
              // Paramètres pour éviter les textes doublés
              dayHeaderFormat={{ weekday: 'short' }}
              headerToolbar={{ left: 'prev,next', center: 'title', right: 'today' }}
              // Paramètre crucial pour afficher le titre au lieu du "+1"
              dayMaxEvents={false} 
              height="550px"
              eventContent={(eventInfo) => (
                <div className="px-2 py-1 overflow-hidden">
                  <p className="text-[9px] font-black uppercase text-white truncate">
                    {eventInfo.event.title}
                  </p>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <style>{`
        /* 1. SUPPRESSION TOTALE DU DOUBLAGE (Boutons, Titres, Headers) */
        .fc-toolbar-title, 
        .fc-col-header-cell-cushion, 
        .fc-daygrid-day-number,
        .fc-button {
          display: inline-block !important;
        }

        .fc-toolbar-title::before,
        .fc-col-header-cell-cushion::before,
        .fc-daygrid-day-number::before,
        .fc-button::before {
          content: none !important;
          display: none !important;
        }

        /* 2. STYLE DU CALENDRIER */
        .fc { --fc-border-color: #1e293b; background: transparent; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid #1e293b !important; }
        
        .fc-col-header-cell { padding: 12px 0 !important; background: #0f172a; }
        .fc-col-header-cell-cushion { 
          font-size: 10px !important; 
          text-transform: uppercase; 
          font-weight: 900; 
          letter-spacing: 1px; 
          color: #64748b !important; 
          text-decoration: none !important;
        }

        .fc-daygrid-day-number { 
          padding: 10px !important; 
          font-size: 10px !important; 
          font-family: monospace; 
          color: #475569 !important; 
          text-decoration: none !important;
        }

        /* Style des tickets dans le calendrier */
        .fc-event {
          background: #4f46e5 !important;
          border: none !important;
          border-radius: 6px !important;
          margin: 2px 4px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .fc-toolbar-title { 
          font-size: 14px !important; 
          font-weight: 900; 
          text-transform: uppercase; 
          color: white; 
          font-style: italic; 
        }

        .fc-button { 
          background: #1e293b !important; 
          border: none !important; 
          font-size: 10px !important; 
          font-weight: 900 !important; 
          text-transform: uppercase !important; 
          padding: 8px 12px !important;
          border-radius: 8px !important;
          color: white !important;
        }

        .fc-button-active { background: #4f46e5 !important; }
        .fc-day-today { background: rgba(99, 102, 241, 0.05) !important; }
        
        /* Cacher les indicateurs "+1" au cas où */
        .fc-daygrid-more-link { display: none !important; }
      `}</style>
    </div>
  );
}