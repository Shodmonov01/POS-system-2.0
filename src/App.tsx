import {lazy, Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import {LoaderPinwheel} from "lucide-react";


import {RequireAuth} from './components/common/RequireAuth';
import {Layout} from './components/layout/Layout';
import {Toaster} from './components/ui/toaster';
import {AuthProvider} from './contexts/AuthContext';
import {CartProvider} from './contexts/CartContext';
import {Dashboard} from './pages/Dashboard';
import {DebtsPage} from './pages/Debts';
import {LoginPage} from './pages/Login';
import {ProductsPage} from './pages/Products';
import {ReturnsPage} from './pages/Returns';
import {SalesPage} from './pages/Sales';
import {ScanerPage} from './pages/Scaner';
import {SettingsPage} from './pages/Settings';

const queryClient = new QueryClient();

const UsersPage = lazy(() =>
    import('./pages/Users').then(m => ({default: m.UsersPage}))
);
const BranchesPage = lazy(() =>
    import('./pages/Branches').then(m => ({default: m.BranchesPage}))
);

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

                                <Route
                                    path="users"
                                    element={
                                        <Suspense
                                            fallback={
                                                <div className="centered-spin-icon">
                                                    <LoaderPinwheel className="spin-icon"/>
                                                </div>
                                            }
                                        >
                                            <UsersPage/>
                                        </Suspense>
                                    }
                                />

                                <Route
                                    path="branches"
                                    element={
                                        <Suspense
                                            fallback={
                                                <div className="centered-spin-icon">
                                                    <LoaderPinwheel className="spin-icon"/>
                                                </div>
                                            }
                                        >
                                            <BranchesPage/>
                                        </Suspense>
                                    }
                                />

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
