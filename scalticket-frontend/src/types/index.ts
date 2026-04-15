// ============================================
// Types & Interfaces - ScalTicket Dashboard
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change: number; // Pourcentage de changement
  trend: 'up' | 'down';
  icon: string;
  data: number[]; // Données pour mini-graphique de tendance
}

export interface Activity {
  id: string;
  type: 'transaction' | 'event' | 'system' | 'security';
  description: string;
  timestamp: Date;
  user?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalSales: number;
  revenue: number;
  systemAlerts: number;
}