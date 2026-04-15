import { X, Calendar, Ticket, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  event: any;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const BookingModal = ({ event, onClose, onConfirm, isSubmitting }: BookingModalProps) => {
  
  // Correction Image : On vérifie si c'est event.image ou event.imageUrl
  const displayImage = event.image || event.imageUrl || "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400";

  const eventDate = event.date 
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "Date à venir";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-white text-slate-950 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        
        <div className="p-6 flex justify-between items-start border-b border-slate-100">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">
              <span>Confirmation</span>
            </h2>
            <h3 className="text-xl font-black tracking-tighter italic uppercase leading-none">
              <span>Votre Billet</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-6 mb-8">
            {/* Image sécurisée */}
            <img 
              src={displayImage} 
              className="w-24 h-24 object-cover rounded-2xl shadow-md border border-slate-100"
              alt={event.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400";
              }}
            />
            <div className="space-y-2">
              <h4 className="text-lg font-black tracking-tight leading-tight uppercase italic">
                <span>{event.title}</span>
              </h4>
              <div className="flex items-center gap-2 text-indigo-600">
                <Calendar size={14} strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-widest">
                  <span>{eventDate}</span>
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                <span>{event.price}</span><span>€</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 text-center">
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
              <span>En cliquant sur confirmer, votre billet sera généré instantanément dans votre page client.</span>
            </p>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isSubmitting}
            className="w-full bg-[#FF0000] hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <CheckCircle2 className="animate-bounce" size={24} />
            ) : (
              <span className="flex items-center gap-2">
                <span>Confirmer</span> <Ticket size={20} />
              </span>
            )}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            <span>Annuler</span>
          </button>
        </div>
      </div>
    </div>
  );
};