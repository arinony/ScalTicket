// ============================================
// Waiting Room - File d'Attente
// ============================================

import { useEffect, useState } from 'react';
import { Loader2, Users, Timer, AlertCircle } from 'lucide-react';
import { useTicketStore } from '../../store/useTicketStore';

export const WaitingRoom = () => {
  const { queuePosition } = useTicketStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => (old >= 100 ? 100 : old + 0.2));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <Loader2 className="w-20 h-20 text-indigo-500 animate-spin opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-white">
              {Math.round(progress)}%
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">File d'attente active</h1>
          <p className="text-slate-400 mb-10">Veuillez ne pas quitter cette page. Votre place est réservée temporairement.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg">
                <Users className="text-indigo-500" size={24} />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest">Position</p>
                <p className="text-2xl font-mono font-bold text-white">#{queuePosition || 0}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Timer className="text-amber-500" size={24} />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest">Attente</p>
              </div>
            </div>
          </div>

          <div className="mt-10 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8 flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-left">
            <AlertCircle className="text-slate-500 shrink-0" size={18} />
            <p className="text-sm text-slate-500">
              <strong>Note DevOps :</strong> Ce système utilise un cluster Kubernetes GKE. En cas de forte affluence, de nouveaux serveurs sont déployés automatiquement pour garantir votre transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};