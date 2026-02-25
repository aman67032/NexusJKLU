'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Shield,
    Terminal
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_ROLES = ['admin', 'council_admin', 'voice_admin', 'learn_admin', 'coding_ta'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/login?redirect=/admin');
            } else if (!user.roles.some((r: string) => ADMIN_ROLES.includes(r))) {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || !user.roles.some((r: string) => ADMIN_ROLES.includes(r))) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        );
    }

    const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'council_admin', 'voice_admin', 'learn_admin'] },
        { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
        { name: 'Learn (Papers)', href: '/admin/learn/papers', icon: BookOpen, roles: ['admin', 'learn_admin'] },
        { name: 'Council (Events)', href: '/admin/council/events', icon: Calendar, roles: ['admin', 'council_admin'] },
        { name: 'Voice (Complaints)', href: '/admin/voice/complaints', icon: MessageSquare, roles: ['admin', 'voice_admin'] },
        { name: 'Learn (Coding Hour)', href: '/admin/learn/coding-hour', icon: Terminal, roles: ['admin', 'learn_admin', 'coding_ta'] },
    ];

    const authorizedNavigation = navigation.filter(item =>
        item.roles.some(role => user.roles.includes(role))
    );

    const Sidebar = () => (
        <div className="flex flex-col h-full bg-[#0f0f0f] border-r border-white/10 w-64 md:w-72">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                <div className="flex gap-2 items-center text-white font-bold text-lg cursor-pointer" onClick={() => router.push('/')}>
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <span>Nexus Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {authorizedNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                ? 'bg-indigo-500/15 text-indigo-400'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/40'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate capitalize">
                            {user.roles.find((r: string) => ADMIN_ROLES.includes(r))?.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <div className="md:hidden h-16 bg-[#0f0f0f] border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex gap-2 items-center text-white font-bold" onClick={() => router.push('/')}>
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <span>Nexus Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 md:hidden"
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-7xl mx-auto overflow-hidden">
                {children}
            </div>
        </div>
    );
}
