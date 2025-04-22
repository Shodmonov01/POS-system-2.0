import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

export function Layout() {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pt-14">
          <div className="container p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}