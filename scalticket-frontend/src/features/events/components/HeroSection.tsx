import { ChevronRight } from 'lucide-react';

export const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center px-6 md:px-20 overflow-hidden pt-20">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80" 
        className="w-full h-full object-cover opacity-20 scale-105" 
        alt="Hero background"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-[#020617]" />
    </div>
    
    <div className="relative z-10 max-w-4xl">
      <div className="inline-block px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full mb-6">
        <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">GKE Infrastructure Active</span>
      </div>
      <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1] tracking-tighter uppercase italic">
        Vivez le <span className="text-indigo-500">Live</span><br />en temps réel
      </h1>
      <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl font-medium leading-relaxed">
        Réservez vos places instantanément sur notre plateforme scalée. Données synchronisées avec PostgreSQL.
      </p>
      <button 
        onClick={() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' })}
        className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
      >
        Explorer les concerts <ChevronRight size={20} />
      </button>
    </div>
  </section>
);