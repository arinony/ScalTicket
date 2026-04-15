import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'emerald' | 'indigo' | 'red' | 'slate';
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorMap = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5",
    indigo: "border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/5",
    red: "border-red-500/20 bg-red-500/5 shadow-red-500/5",
    slate: "border-slate-800 bg-slate-900/50"
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border ${colorMap[color]} shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-950/50 border border-slate-800/50 rounded-2xl shadow-inner">{icon}</div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-white mt-2 tracking-tighter">{value}</h3>
    </div>
  );
};