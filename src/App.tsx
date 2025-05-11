import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { RequireAuth } from './components/common/RequireAuth';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ScanerPage } from './pages/Scaner';
import { ProductsPage } from './pages/Products';
import { DebtsPage } from './pages/Debts';
import { ReturnsPage } from './pages/Returns';
import { UsersPage } from './pages/Users';
import { BranchesPage } from './pages/Branches';
import { SettingsPage } from './pages/Settings';
import { Toaster } from './components/ui/toaster';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SalesPage } from './pages/Sales';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>

                            <Route
                                path="/"
                                element={
                                    <RequireAuth>
                                        <Layout/>
                                    </RequireAuth>
                                }
                            >
                                <Route index element={<Navigate to="/dashboard" replace/>}/>
                                <Route path="dashboard" element={<Dashboard/>}/>
                                <Route path="scaner" element={<ScanerPage/>}/>
                                <Route path="sales" element={<SalesPage/>}/>
                                <Route path="products" element={<ProductsPage/>}/>
                                <Route path="debts" element={<DebtsPage/>}/>
                                <Route path="returns" element={<ReturnsPage/>}/>
                                <Route path="users" element={<UsersPage/>}/>
                                <Route path="branches" element={<BranchesPage/>}/>
                                <Route path="settings" element={<SettingsPage/>}/>
                                <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                    <Toaster/>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
