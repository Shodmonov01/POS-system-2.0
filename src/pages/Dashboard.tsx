import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { ScanerPage } from './Scaner';

export function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return user.role === 'admin' ? <AdminDashboard /> : <ScanerPage />;
}