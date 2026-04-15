// src/pages/EventPage.tsx
import { useEffect, useState } from 'react';
import { useTicketStore } from '../store/useTicketStore'; 
import { Plus, Calendar, MapPin, Edit3, Trash2, Loader2, Music } from 'lucide-react';
import CreateEventModal from '../features/events/CreateEventModal';
import toast from 'react-hot-toast'; // Import du système de notifications

export default function EventPage() {
  const { events, fetchEvents, isLoading, deleteEvent } = useTicketStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Ouvrir pour créer
  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  // Ouvrir pour modifier
  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Suppression avec confirmation et Toast
  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await deleteEvent(id);
        toast.success("Événement masqué avec succès !"); // Notification succès
      } catch (error: any) {
        // Affiche l'erreur précise venant du backend (ex: 409 si tickets liés)
        toast.error(error.response?.data?.message || "Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="space-y-8 p-4">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">
            Gestion <span className="text-indigo-500">Events</span>
          </h1>
          <p className="text-slate-400">Planifiez et gérez vos prochains succès musicaux.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          <Plus size={20} /> Nouveau Concert
        </button>
      </div>

      {/* --- LISTE OU LOADER --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Mise à jour du catalogue...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-slate-800 rounded-[3rem] text-center">
          <Music className="w-16 h-16 text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium text-lg">Aucun événement actif pour le moment.</p>
          <button onClick={handleCreate} className="text-indigo-500 hover:underline mt-2">Créez votre première annonce</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any) => (
            <div key={event.id} className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group flex flex-col shadow-2xl">
              
              {/* Image Section */}
              <div className="relative h-52 w-full overflow-hidden">
                <img 
                  src={event.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-lg">
                  {event.available} / {event.totalSlots} TICKETS
                </div>
              </div>

              {/* Contenu Card */}
              <div className="p-7 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-indigo-400/80 text-xs font-black uppercase tracking-widest">{event.artist}</p>
                  </div>
                  <span className="text-2xl font-black text-white ml-2">{event.price}€</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Calendar size={14} className="text-indigo-500" />
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <MapPin size={14} className="text-indigo-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-800/50 mt-auto flex justify-between items-center gap-4">
                  <button 
                    onClick={() => handleDelete(event.id)} // Utilise handleDelete avec toast
                    className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    title="Supprimer l'événement"
                  >
                    <Trash2 size={20} />
                  </button>

                  <button 
                    onClick={() => handleEdit(event)}
                    className="flex-grow flex items-center justify-center gap-2 bg-slate-800 hover:bg-white hover:text-black text-white py-3 rounded-2xl font-bold transition-all transform active:scale-95"
                  >
                    <Edit3 size={18} /> Éditer l'event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODALE --- */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }} 
        initialData={selectedEvent}
      />
    </div>
  );
}