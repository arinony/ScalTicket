// ============================================
// Admin Overview - Dashboard Principal
// ============================================

import { useState, useEffect } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import type { StatCard, Activity, ChartDataPoint } from '../../types';

// ============================================
// Composant de Mini-Graphique de Tendance
// ============================================
function TrendChart({ data, trend }: { data: number[]; trend: 'up' | 'down' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 40" className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={trend === 'up' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// ============================================
// Composant de Carte de Statistique
// ============================================
function StatCardComponent({ card }: { card: StatCard }) {
  const Icon = {
    Users,
    ShoppingCart,
    DollarSign,
    AlertTriangle,
  }[card.icon] || Users;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-600/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium">{card.title}</p>
          <h3 className="text-white text-3xl font-bold mt-1">{card.value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${
          card.trend === 'up' ? 'bg-green-950/50' : 'bg-red-950/50'
        }`}>
          <Icon className={`w-6 h-6 ${
            card.trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {card.trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            card.trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {Math.abs(card.change)}%
          </span>
          <span className="text-slate-500 text-sm">vs mois dernier</span>
        </div>
      </div>

      <div className="mt-4">
        <TrendChart data={card.data} trend={card.trend} />
      </div>
    </div>
  );
}

// ============================================
// Graphique de Trafic en Temps Réel
// ============================================
function RealtimeChart({ data }: { data: ChartDataPoint[] }) {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg font-bold">Trafic en Temps Réel</h3>
          <p className="text-slate-400 text-sm">Requêtes API par minute</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-950/50 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-500 text-sm font-medium">Live</span>
        </div>
      </div>

      <div className="h-64 relative">
        <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y * 2}
              x2="800"
              y2={y * 2}
              stroke="rgb(51, 65, 85)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill */}
          <path
            d={`M 0 200 ${data.map((d, i) => {
              const x = (i / (data.length - 1)) * 800;
              const y = 200 - (d.value / max) * 180;
              return `L ${x} ${y}`;
            }).join(' ')} L 800 200 Z`}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <polyline
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 800;
              const y = 200 - (d.value / max) * 180;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="3"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-Axis Labels */}
        <div className="absolute top-0 -left-12 h-full flex flex-col justify-between text-slate-500 text-xs">
          <span>{max}</span>
          <span>{Math.floor(max * 0.75)}</span>
          <span>{Math.floor(max * 0.5)}</span>
          <span>{Math.floor(max * 0.25)}</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Table des Activités Récentes
// ============================================
function ActivityTable({ activities }: { activities: Activity[] }) {
  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'success': return 'bg-green-950/50 text-green-500 border-green-900';
      case 'warning': return 'bg-yellow-950/50 text-yellow-500 border-yellow-900';
      case 'error': return 'bg-red-950/50 text-red-500 border-red-900';
      default: return 'bg-blue-950/50 text-blue-500 border-blue-900';
    }
  };

  const getTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'transaction': return '💳';
      case 'event': return '🎫';
      case 'system': return '⚙️';
      case 'security': return '🔒';
      default: return '📋';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-white text-lg font-bold">Activités Récentes</h3>
        <p className="text-slate-400 text-sm">Logs de transactions et événements système</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-2xl">{getTypeIcon(activity.type)}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-medium">{activity.description}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                  {activity.user || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(activity.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-slate-400 text-sm">Affichage de {activities.length} activités</span>
        <button className="flex items-center gap-1 px-4 py-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">
          Voir tout
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// PAGE PRINCIPALE - OVERVIEW
// ============================================
export default function AdminOverview() {
  // TODO: Remplacer par des appels API réels
  const [stats] = useState<StatCard[]>([
    {
      id: '1',
      title: 'Total Users',
      value: '12,543',
      change: 12.5,
      trend: 'up',
      icon: 'Users',
      data: [3200, 3400, 3300, 3600, 3800, 4100, 4300],
    },
    {
      id: '2',
      title: 'Total Sales',
      value: '8,392',
      change: 8.2,
      trend: 'up',
      icon: 'ShoppingCart',
      data: [1200, 1350, 1280, 1420, 1500, 1650, 1720],
    },
    {
      id: '3',
      title: 'Revenue',
      value: '€234.5K',
      change: 15.3,
      trend: 'up',
      icon: 'DollarSign',
      data: [45000, 47000, 46500, 49000, 51000, 53000, 55000],
    },
    {
      id: '4',
      title: 'System Alerts',
      value: '23',
      change: -5.4,
      trend: 'down',
      icon: 'AlertTriangle',
      data: [45, 42, 38, 35, 30, 27, 23],
    },
  ]);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'transaction',
      description: 'Nouvelle commande #TKT-2845 - VIP Package',
      user: 'jean.dupont@email.com',
      status: 'success',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '2',
      type: 'event',
      description: 'Event "Summer Festival 2025" publié',
      user: 'admin@scalticket.com',
      status: 'success',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '3',
      type: 'system',
      description: 'Backup automatique de la base de données',
      status: 'success',
      timestamp: new Date(Date.now() - 480000),
    },
    {
      id: '4',
      type: 'security',
      description: 'Tentative de connexion échouée détectée',
      user: 'suspicious@domain.com',
      status: 'warning',
      timestamp: new Date(Date.now() - 600000),
    },
    {
      id: '5',
      type: 'transaction',
      description: 'Remboursement traité - Commande #TKT-2821',
      user: 'marie.martin@email.com',
      status: 'info',
      timestamp: new Date(Date.now() - 900000),
    },
  ]);

  // Simulation de données en temps réel pour le graphique
  useEffect(() => {
    const generateData = () => {
      const now = Date.now();
      return Array.from({ length: 30 }, (_, i) => ({
        timestamp: new Date(now - (29 - i) * 2000).toISOString(),
        value: Math.floor(Math.random() * 300) + 700,
      }));
    };

    setChartData(generateData());

    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          timestamp: new Date().toISOString(),
          value: Math.floor(Math.random() * 300) + 700,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">
          Bienvenue sur votre tableau de bord ScalTicket
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card) => (
          <StatCardComponent key={card.id} card={card} />
        ))}
      </div>

      {/* Realtime Chart */}
      <RealtimeChart data={chartData} />

      {/* Activity Table */}
      <ActivityTable activities={activities} />
    </div>
  );
}