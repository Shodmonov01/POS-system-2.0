import {lazy} from "react";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query';


import {RequireAuth} from './components/common/RequireAuth';
import {Layout} from './components/layout/Layout';
import {Toaster} from './components/ui/toaster';
import {AuthProvider} from './contexts/AuthContext';
import {CartProvider} from './contexts/CartContext';
import {Dashboard} from './pages/Dashboard';
import {LazyBoundary} from "@/components/ui/lazyBoundary.tsx";

const queryClient = new QueryClient();


const LoginPage = lazy(() =>
    import('./pages/Login').then(m => ({default: m.LoginPage})));
const ScanerPage = lazy(() =>
    import('./pages/Scaner').then(m => ({default: m.ScanerPage})));
const SalesPage = lazy(() =>
    import('./pages/Sales').then(m => ({default: m.SalesPage})));
const ProductsPage = lazy(() =>
    import('./pages/Products').then(m => ({default: m.ProductsPage})));
const DebtsPage = lazy(() =>
    import('./pages/Debts').then(m => ({default: m.DebtsPage})));
const ReturnsPage = lazy(() =>
    import('./pages/Returns').then(m => ({default: m.ReturnsPage})));
const UsersPage = lazy(() =>
    import('./pages/Users').then(m => ({default: m.UsersPage})));
const BranchesPage = lazy(() =>
    import('./pages/Branches').then(m => ({default: m.BranchesPage})));
const SettingsPage = lazy(() =>
    import('./pages/Settings').then(m => ({default: m.SettingsPage})));

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <LazyBoundary>
                                        <LoginPage/>
                                    </LazyBoundary>
                                }
                            />
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
                                <Route
                                    path="scaner"
                                    element={
                                        <LazyBoundary>
                                            <ScanerPage/>
                                        </LazyBoundary>
                                    }
                                /><Route
                                path="sales"
                                element={
                                    <LazyBoundary>
                                        <SalesPage/>
                                    </LazyBoundary>
                                }
                            />
                                <Route
                                    path="products"
                                    element={
                                        <LazyBoundary>
                                            <ProductsPage/>
                                        </LazyBoundary>
                                    }
                                />
                                <Route
                                    path="debts"
                                    element={
                                        <LazyBoundary>
                                            <DebtsPage/>
                                        </LazyBoundary>
                                    }
                                />
                                <Route
                                    path="returns"
                                    element={
                                        <LazyBoundary>
                                            <ReturnsPage/>
                                        </LazyBoundary>
                                    }
                                />
                                <Route
                                    path="users"
                                    element={
                                        <LazyBoundary>
                                            <UsersPage/>
                                        </LazyBoundary>
                                    }
                                />
                                <Route
                                    path="branches"
                                    element={
                                        <LazyBoundary>
                                            <BranchesPage/>
                                        </LazyBoundary>
                                    }
                                />
                                <Route
                                    path="settings"
                                    element={
                                        <LazyBoundary>
                                            <SettingsPage/>
                                        </LazyBoundary>
                                    }
                                />
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
