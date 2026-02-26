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

const ADMIN_ROLES = [
    'super_admin', 'admin',
    'council_admin', 'council_president', 'head_student_affairs', 'executive_student_affairs',
    'club_chair', 'club_co_chair', 'club_secretary', 'club_general_secretary',
    'voice_admin', 'learn_admin', 'coding_ta'
];

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
            <div className="min-h-screen bg-nexus-black flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-nexus-camel/30 border-t-white animate-spin" />
            </div>
        );
    }

    const navigation = [
        {
            name: 'Overview',
            href: '/admin',
            icon: LayoutDashboard,
            roles: ['super_admin', 'admin', 'council_admin', 'council_president', 'head_student_affairs', 'executive_student_affairs', 'club_chair', 'club_co_chair', 'voice_admin', 'learn_admin']
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: Users,
            roles: ['super_admin', 'admin']
        },
        {
            name: 'Learn (Papers)',
            href: '/admin/learn/papers',
            icon: BookOpen,
            roles: ['super_admin', 'admin', 'learn_admin']
        },
        {
            name: 'Council (Events)',
            href: '/admin/council/events',
            icon: Calendar,
            roles: ['super_admin', 'admin', 'head_student_affairs', 'executive_student_affairs', 'council_admin', 'council_president', 'club_chair', 'club_co_chair', 'club_secretary', 'club_general_secretary']
        },
        {
            name: 'Voice (Complaints)',
            href: '/admin/voice/complaints',
            icon: MessageSquare,
            roles: ['super_admin', 'admin', 'voice_admin']
        },
        {
            name: 'Learn (Coding Hour)',
            href: '/admin/learn/coding-hour',
            icon: Terminal,
            roles: ['super_admin', 'admin', 'learn_admin', 'coding_ta']
        },
    ];

    const authorizedNavigation = navigation.filter(item =>
        item.roles.some(role => user.roles.includes(role))
    );

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#0f0f0f] border-r border-nexus-camel/20 w-64 md:w-72">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-nexus-camel/20 shrink-0">
                <div className="flex gap-2 items-center text-nexus-linen font-bold text-lg cursor-pointer" onClick={() => router.push('/')}>
                    <Shield className="w-5 h-5 text-nexus-coffee" />
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
                                ? 'bg-nexus-coffee/15 text-nexus-brass'
                                : 'text-nexus-khaki hover:text-nexus-linen hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-nexus-brass' : 'text-nexus-camel'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-nexus-camel/20 shrink-0">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nexus-coffee to-nexus-cocoa flex items-center justify-center text-nexus-linen font-bold text-xs ring-2 ring-white/10">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-nexus-linen truncate">{user.name}</p>
                        <p className="text-xs text-nexus-camel truncate capitalize">
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
        <div className="min-h-screen bg-nexus-black flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <div className="md:hidden h-16 bg-[#0f0f0f] border-b border-nexus-camel/20 flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex gap-2 items-center text-nexus-linen font-bold" onClick={() => router.push('/')}>
                    <Shield className="w-5 h-5 text-nexus-coffee" />
                    <span>Nexus Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-nexus-khaki hover:text-nexus-linen hover:bg-white/10 rounded-lg transition-colors"
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
                            className="fixed inset-0 bg-nexus-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 md:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen shrink-0">
                {sidebarContent}
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-7xl mx-auto overflow-hidden">
                {children}
            </div>
        </div>
    );
}
