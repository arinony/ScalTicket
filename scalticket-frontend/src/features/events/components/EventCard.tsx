import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: any;
  onBooking: (id: string) => void;
}

export const EventCard = ({ event, onBooking }: EventCardProps) => (
  <div className="group bg-slate-900/40 rounded-[2.5rem] border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-500 shadow-2xl">
    <div className="relative h-64 overflow-hidden">
      <img 
        src={event.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"} 
        alt={event.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black border border-white/10 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${event.available > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
        {event.available} PLACES
      </div>
    </div>
    
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 mb-1">{event.title}</h3>
          <p className="text-indigo-400/80 font-semibold uppercase text-xs">{event.artist}</p>
        </div>
        <p className="text-3xl font-black text-white">{event.price}€</p>
      </div>

      <div className="space-y-3 mb-8 text-slate-400 text-sm">
        <div className="flex items-center gap-3">
          <Calendar size={14} className="text-indigo-400" />
          {new Date(event.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={14} className="text-indigo-400" />
          {event.location}
        </div>
      </div>

      <button 
        onClick={() => onBooking(event.id)}
        disabled={event.available <= 0}
        className={`w-full font-bold py-4 rounded-2xl transition-all transform active:scale-95 ${
          event.available > 0 
          ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
          : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        {event.available > 0 ? "Réserver mon ticket" : "Épuisé"}
      </button>
    </div>
  </div>
);