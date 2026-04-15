import { Link } from 'react-router-dom';
import { ShoppingCart, Ticket, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTicketStore } from '../store/useTicketStore'; // Import du store
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { myTicketsCount, fetchMyTicketsCount } = useTicketStore(); // Lecture du store
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Charger le nombre de tickets au montage si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyTicketsCount();
    }
  }, [isAuthenticated, fetchMyTicketsCount]);

  const navLinks = [
    { name: 'Événements', href: '#events-list' },
    { name: 'À propos', href: '#' },
    { name: 'Contacts', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
            <Ticket size={22} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-white">
            ScalTicket
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="relative p-2 text-slate-400 hover:text-white transition group">
            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            
            {/* BADGE DYNAMIQUE */}
            {myTicketsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF0000] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full text-white border-2 border-[#020617] animate-in zoom-in">
                {myTicketsCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Link to="/tickets" className="flex items-center gap-2 p-1 pr-4 bg-slate-900 border border-slate-800 rounded-full hover:border-indigo-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={16} />}
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline">Event</span>
            </Link>
          ) : (
            <Link to="/login" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-indigo-600/20">
              Connexion
            </Link>
          )}

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}