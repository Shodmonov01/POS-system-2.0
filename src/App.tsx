import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { RequireAuth } from './components/common/RequireAuth';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SalesPage } from './pages/Sales';
import { ProductsPage } from './pages/Products';
import { DebtsPage } from './pages/Debts';
import { ReturnsPage } from './pages/Returns';
import { UsersPage } from './pages/Users';
import { BranchesPage } from './pages/Branches';
import { SettingsPage } from './pages/Settings';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="debts" element={<DebtsPage />} />
              <Route path="returns" element={<ReturnsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;