'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    emailVerified: boolean;
    rollNumber?: string;
    jkluEmail?: string;
    studentType?: 'dayscholar' | 'hosteler';
    busRoute?: any;
    pickupPoint?: string;
    hostelName?: string;
    roomNumber?: string;
    priorityMatrix?: string[];
    profile?: {
        age?: number;
        year?: string;
        university?: string;
        department?: string;
        rollNo?: string;
        studentId?: string;
        gender?: string;
    };
}

export interface SignupData {
    name: string;
    rollNumber: string;
    email: string;
    password: string;
    studentType: 'dayscholar' | 'hosteler';
    busRoute?: string;
    pickupPoint?: string;
    hostelName?: string;
    roomNumber?: string;
    priorityMatrix?: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<{ userId: string }>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
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

    const signup = async (data: SignupData): Promise<{ userId: string }> => {
        const response = await api.post('/api/auth/register', data);
        return response.data;
    };

    const verifyOtp = async (email: string, otp: string): Promise<void> => {
        const response = await api.post('/api/auth/verify-otp', { email, otp });
        const { access_token, user: userData } = response.data;
        localStorage.setItem('nexus_token', access_token);
        localStorage.setItem('nexus_user', JSON.stringify(userData));
        setUser(userData);
        setToken(access_token);
    };

    const resendOtp = async (email: string): Promise<void> => {
        await api.post('/api/auth/resend-otp', { email });
    };

    const logout = () => {
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
        setUser(null);
        setToken(null);
    };

    const isAdmin = user?.roles?.some(role => ['admin', 'super_admin', 'transport_coordinator', 'learn_admin', 'voice_admin', 'head_student_affairs', 'council_president'].includes(role)) || false;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, signup, verifyOtp, resendOtp, logout, isAdmin, token }}>
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
