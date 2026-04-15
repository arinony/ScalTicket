import { Search } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

export const TicketFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: FiltersProps) => (
  <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-[2rem] border border-slate-800/50 backdrop-blur-xl shadow-2xl">
    <div className="flex-grow relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
      <input 
        type="text" 
        placeholder="Rechercher un client, un concert ou un ID..." 
        className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all text-sm font-medium"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <select 
      className="bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-3.5 text-white outline-none focus:border-indigo-500 font-bold text-sm cursor-pointer appearance-none"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">Tous les statuts</option>
      <option value="CONFIRMED">Confirmés</option>
      <option value="CANCELLED">Annulés</option>
    </select>
  </div>
);