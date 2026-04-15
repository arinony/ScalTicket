import { Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface TicketRowProps {
  order: any;
  onCancel: (id: string) => void;
  onView: (order: any) => void;
  isAdmin?: boolean; // Nouvelle prop optionnelle
}

export const TicketRow = ({ order, onCancel, onView, isAdmin = false }: TicketRowProps) => {
  // Normalisation du statut
  const status = order.status?.toUpperCase();
  const isConfirmed = status === 'CONFIRMED' || status === 'SUCCESS';

  return (
    <tr className="hover:bg-indigo-500/[0.03] transition-colors group">
      {/* ID Commande */}
      <td className="px-8 py-5 font-mono text-[10px] text-indigo-400/70 italic">
        #{order.id?.substring(0, 8)}
      </td>

      {/* Colonne Client : Masquée si ce n'est pas un Admin */}
      {isAdmin && (
        <td className="px-8 py-5">
          <div className="flex flex-col">
            <span className="font-black text-white text-sm">
              {order.user?.name || 'Client Inconnu'}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              {order.user?.email}
            </span>
          </div>
        </td>
      )}

      {/* Événement */}
      <td className="px-8 py-5 text-slate-300 text-sm font-bold">
        {order.event?.title || 'Événement supprimé'}
      </td>

      {/* Statut */}
      <td className="px-8 py-5">
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black border tracking-widest transition-all ${
          isConfirmed 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {isConfirmed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {isConfirmed ? 'CONFIRMÉ' : 'ANNULÉ'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-8 py-5 text-right">
        <div className={`flex justify-end gap-3 transition-all duration-300 ${isAdmin ? 'opacity-20 group-hover:opacity-100' : 'opacity-100'}`}>
          {/* L'œil (Aperçu) est visible pour tout le monde */}
          <button 
            onClick={() => onView(order)}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-90"
            title="Aperçu du billet"
          >
            <Eye size={20} />
          </button>
          
          {/* Bouton Annuler : Uniquement si Admin ET billet confirmé */}
          {isAdmin && isConfirmed && (
            <button 
              onClick={() => onCancel(order.id)}
              className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
              title="Annuler le billet"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};