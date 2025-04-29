import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {AuthState, User} from '../types';
import {jwtDecode} from 'jwt-decode';
import apiClient from "@/api/api.ts";



interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson) as User;
                setAuthState({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setAuthState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        } else {
            setAuthState((prev) => ({...prev, isLoading: false}));
        }
    }, []);

    const login = async (username: string, password: string): Promise<void> =>{
        try {
            const response = await apiClient.post('/auth/login',
                {login: username, password});

            const {token, user} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            const decoded = jwtDecode<{ user: User }>(token);

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setAuthState({
                user: decoded.user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Login failed:', error);
            let errorMessage = 'Invalid username or password';

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }

            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return (
        <AuthContext.Provider value={{...authState, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};