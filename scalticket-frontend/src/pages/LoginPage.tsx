// ============================================
// Login Page - ScalTicket Dashboard
// ============================================

import { useState, type FormEvent } from 'react';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import crucial pour la navigation

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-600/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">ScalTicket</h1>
          <p className="text-slate-400">Connectez-vous à votre compte</p>
        </div>

        <div className="bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 p-8 overflow-hidden relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  name="email_admin_unique"
                  autoComplete="none"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  placeholder="admin@scalticket.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  name="password_admin_new" 
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-[11px] font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accéder à la console'}
            </button>
          </form>

          {/* SECTION MODIFIÉE : LIEN VERS L'INSCRIPTION */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Nouveau sur la plateforme ?
            </p>
            <Link 
              to="/register" 
              className="mt-2 inline-flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest hover:text-indigo-400 transition-colors"
            >
              <UserPlus size={14} />
              Créer un compte 
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-8">
          ScalTicket Security Protocol v2.4
        </p>
      </div>
    </div>
  );
}