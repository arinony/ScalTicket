import { useEffect, useState, useCallback } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { useAuthStore } from '../store/authStore';
import { 
  Loader2, Zap, ShieldCheck, Globe, 
  MessageCircle, Send, Share2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Imports des composants modulaires
import Navbar from '../layouts/Navbar';
import { EventCard } from '../features/events/components/EventCard';
import { HeroSection } from '../features/events/components/HeroSection';
import { BookingModal } from '../features/events/components/BookingModal';

export default function ClientStorePage() {
  // --- STORE & STATES ---
  const { events, fetchEvents, buyTicket, isLoading } = useTicketStore();
  const { isAuthenticated } = useAuthStore();
  
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setCartCount] = useState(0);

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --- HANDLERS ---
  
  // Ouvre la modale de confirmation
  const handleOpenBooking = useCallback((event: any) => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour réserver.");
      return;
    }
    setSelectedEvent(event);
  }, [isAuthenticated]);

  // Logique de confirmation finale (Appelée par BookingModal)
 const handleFinalConfirm = async () => {
  // Sécurité double : évite les clics frénétiques
  if (!selectedEvent || isSubmitting) return;

  setIsSubmitting(true);
  
  try {
    // On lance l'achat
    await buyTicket(selectedEvent.id); 
    
    // ACTION PRIORITAIRE : On ferme la modale immédiatement pour libérer le DOM
    setSelectedEvent(null); 

    // MISE À JOUR SYNCHRONE : 
    // On force la mise à jour de l'état local du compteur
    setCartCount((prev) => prev + 1);
    
    // Notification visuelle
    toast.success("Billet réservé avec succès !");

    // RAFRAÎCHISSEMENT SILENCIEUX : 
    // On recharge les événements pour mettre à jour les stocks/boutons 
    // sans bloquer l'utilisateur
    await fetchEvents(); 

  } catch (error) {
    console.error("Erreur critique lors de l'achat:", error);
    toast.error("Une erreur est survenue lors de la réservation.");
  } finally {
    // Très important de remettre à false pour débloquer le bouton si erreur
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 font-sans">
      {/* NAVIGATION */}
      <Navbar />
      
      {/* HERO SECTION */}
      <HeroSection />

      {/* SECTION RÉASSURANCE (Value Props) */}
      <section className="py-20 px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-white/5 bg-white/[0.01]">
        <FeatureItem 
          icon={<Zap className="text-indigo-500" size={32} />}
          title="Accès Instantané"
          desc="Vos billets sont générés en temps réel sur notre cluster GKE."
        />
        <FeatureItem 
          icon={<ShieldCheck className="text-emerald-500" size={32} />}
          title="Sécurisation SQL"
          desc="Intégrité des données garantie par PostgreSQL & Prisma."
        />
        <FeatureItem 
          icon={<Globe className="text-purple-500" size={32} />}
          title="Partout au Monde"
          desc="Une plateforme disponible 24/7 pour tous vos événements."
        />
      </section>

      {/* LISTE DES ÉVÉNEMENTS */}
      <section id="events-list" className="py-24 px-6 md:px-20">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
                <h2 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">
                    Concerts <span className="text-indigo-500">Prochains</span>
                </h2>
                <p className="text-slate-500 font-medium italic">
                    <span>Flux de données synchronisé avec le backend Node.js.</span>
                </p>
            </div>
            <div className="flex gap-4 p-2 bg-slate-900/50 rounded-2xl border border-white/5">
                <button className="px-8 py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                    <span>Tous</span>
                </button>
                <button className="px-8 py-3 hover:bg-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 transition-all">
                    <span>Festivals</span>
                </button>
            </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem]">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
                <span>Chargement de la base PostgreSQL...</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <EventCard 
                    event={event} 
                    onBooking={() => handleOpenBooking(event)} 
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800 text-slate-500 italic">
                <span>Aucun événement disponible pour le moment.</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* MODALE DE RÉSERVATION - CLÉ UNIQUE POUR LA STABILITÉ */}
      {selectedEvent && (
        <BookingModal 
          key={`modal-${selectedEvent.id}`}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onConfirm={handleFinalConfirm}
          isSubmitting={isSubmitting}
        />
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 p-16 bg-[#010409]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-xs">S</div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                <span>ScalTicket</span>
              </span>
            </div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] text-center md:text-left">
              <span>Infrastructure & Application by @ ANDRITINARINONY Jeanselm victorio </span>
            </p>
          </div>

          <div className="flex gap-4">
            <SocialIcon icon={<MessageCircle size={20}/>} />
            <SocialIcon icon={<Send size={20}/>} />
            <SocialIcon icon={<Share2 size={20}/>} />
          </div>

          <div className="text-right hidden md:block">
            <p className="text-[10px] font-mono text-slate-800 uppercase tracking-[0.4em]">
              <span>PostgreSQL • Node.js • Prisma • Docker</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SOUS-COMPOSANTS DE STRUCTURE ---

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600/10 group-hover:scale-110 transition-all duration-500">
        {icon}
    </div>
    <h3 className="font-black uppercase tracking-widest text-sm mb-2">
        <span>{title}</span>
    </h3>
    <p className="text-slate-500 text-xs max-w-[250px] leading-relaxed">
        <span>{desc}</span>
    </p>
  </div>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-indigo-600 text-slate-400 hover:text-white transition-all hover:-translate-y-1">
    {icon}
  </a>
);