import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { CashierDashboard } from './dashboard/CashierDashboard';

export function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return user.role === 'admin' ? <AdminDashboard /> : <CashierDashboard />;
}