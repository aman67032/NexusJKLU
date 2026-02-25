'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    emailVerified: boolean;
    profile?: {
        age?: number;
        year?: string;
        university?: string;
        department?: string;
        rollNo?: string;
        studentId?: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const token = localStorage.getItem('nexus_token');
        const storedUser = localStorage.getItem('nexus_user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(token);
            } catch {
                localStorage.removeItem('nexus_token');
                localStorage.removeItem('nexus_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post('/api/auth/login', { email, password });
        const { access_token, user: userData } = response.data;
        localStorage.setItem('nexus_token', access_token);
        localStorage.setItem('nexus_user', JSON.stringify(userData));
        setUser(userData);
        setToken(access_token);
    };

    const register = async (email: string, name: string, password: string) => {
        const response = await api.post('/api/auth/register', { email, name, password });
        const { access_token, user: userData } = response.data;
        localStorage.setItem('nexus_token', access_token);
        localStorage.setItem('nexus_user', JSON.stringify(userData));
        setUser(userData);
        setToken(access_token);
    };

    const logout = () => {
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
        setUser(null);
        setToken(null);
    };

    const isAdmin = user?.roles?.includes('admin') || false;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
