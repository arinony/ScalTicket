import { AlertTriangle, RefreshCcw } from 'lucide-react';

export function ErrorFallback({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border-2 border-dashed border-red-500/50 rounded-[2.5rem] text-center space-y-4">
      <div className="p-4 bg-red-500/10 rounded-full text-red-500">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-xl font-black text-white uppercase italic">Oups ! Système instable</h2>
      <p className="text-slate-400 text-sm max-w-md">
        Une erreur d'affichage est survenue. Cela est souvent dû à une extension de navigateur.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all"
      >
        <RefreshCcw size={14} /> Réinitialiser l'interface
      </button>
    </div>
  );
}