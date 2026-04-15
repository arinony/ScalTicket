import { useState } from 'react';
import { X, Mail, User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';

export const AdminProfileModal = ({ user, onClose }: { user: any; onClose: () => void }) => {
  // CORRECT : Le hook doit être appelé à l'intérieur du composant
  const { updateProfile } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    newPassword: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        newPassword: formData.newPassword
      });
      
      toast.success("Profil mis à jour !");
      onClose(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de mise à jour");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header Dynamique */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {isAdmin ? "Paramètres Admin" : "Mon Compte Client"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
               <div className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 Session {user?.role} Active
               </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Section Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800 my-2" />

          {/* Section Sécurité */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Lock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sécurité</span>
            </div>
            
            <div className="space-y-2">
              <input 
                type="password" 
                autoComplete="new-password"
                placeholder="Nouveau mot de passe (laisser vide si inchangé)"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer dynamique */}
        <div className={`p-4 border-t border-slate-800 text-center ${isAdmin ? 'bg-indigo-600/10' : 'bg-slate-900'}`}>
            <p className="text-[9px] text-indigo-400 font-medium uppercase tracking-tighter italic">
              {isAdmin 
                ? "Attention : Les modifications d'email impactent les permissions du cluster GKE."
                : "Vos données sont protégées par le protocole de chiffrement ScalTicket."
              }
            </p>
        </div>
      </div>
    </div>
  );
};