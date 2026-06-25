'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Bus, Calendar, FileText, UserCircle, LogOut, ShieldAlert, Smartphone, Maximize2, Menu, X, Bell, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: Home, color: '#ff6600' },
    { label: 'Bus', href: '/bus', icon: Bus, color: '#eab308' },
    { label: 'Events', href: '/events', icon: Calendar, color: '#3b82f6' },
    { label: 'Papers', href: '/learn/papers', icon: FileText, color: '#10b981' },
    { label: 'Profile', href: '/profile', icon: UserCircle, color: '#a855f7' }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    // Check if path is Auth page or Admin page. We don't wrap them in AppShell.
    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');

    if (!mounted) return null;

    if (isAuthPage || isAdminPage) {
        return <div className="min-h-screen bg-nexus-black text-nexus-linen">{children}</div>;
    }

    const activeItem = NAV_ITEMS.find(item => {
        if (item.href === '/') return pathname === '/';
        return pathname?.startsWith(item.href);
    }) || NAV_ITEMS[0];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Render inner content of the app
    const appContent = (
        <div className="flex flex-col h-full bg-nexus-black text-nexus-linen relative overflow-hidden select-none">
            {/* Top Bar / Header */}
            <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-nexus-camel/10 bg-nexus-black/80 backdrop-blur-md z-30 sticky top-0">
                <div className="flex items-center gap-2">
                    <img src="/white_jklu_logo.png" alt="JKLU" className="w-7 h-7" />
                    <div>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider leading-none">Nexus JKLU</p>
                        <p className="text-sm font-bold text-nexus-linen mt-0.5 leading-none">
                            {user ? `${getGreeting()}, ${user.name.split(' ')[0]}` : 'Welcome, Guest'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {user?.roles?.some((r: string) => ['admin', 'super_admin', 'learn_admin', 'voice_admin'].includes(r)) && (
                        <Link href="/admin" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-camel hover:text-nexus-linen transition-colors">
                            <ShieldAlert className="w-4 h-4 text-orange-500" />
                        </Link>
                    )}
                    <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-camel hover:text-nexus-linen transition-colors relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
                    </button>
                </div>
            </header>

            {/* Main scrollable section */}
            <main className="flex-1 overflow-y-auto pb-20 relative scrollbar-hide no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="h-full w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Nav Bar */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 shrink-0 border-t border-nexus-camel/10 bg-nexus-black/90 backdrop-blur-xl z-40 flex items-center justify-around px-2 pb-safe">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center justify-center flex-1 h-full relative group"
                        >
                            <div className="relative py-1 flex flex-col items-center">
                                <Icon 
                                    className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'text-nexus-camel group-hover:scale-105'}`}
                                    style={{ color: isActive ? item.color : undefined }}
                                />
                                <span 
                                    className={`text-[10px] mt-1 font-bold tracking-tight transition-colors duration-200 ${isActive ? 'text-nexus-linen font-extrabold' : 'text-white/30'}`}
                                    style={isActive ? { color: item.color } : {}}
                                >
                                    {item.label}
                                </span>
                                
                                {/* Background glow indicator */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="navGlow"
                                        className="absolute -top-1 w-8 h-1 rounded-full opacity-80"
                                        style={{ backgroundColor: item.color, filter: 'blur(1px)' }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    // Desktop centered layout
    return (
        <div className="min-h-screen bg-[#070b0d] text-nexus-linen flex flex-col items-center justify-center relative select-none">
            <div className="w-full max-w-md min-h-screen bg-nexus-black relative border-x border-nexus-camel/10 shadow-2xl flex flex-col">
                {appContent}
            </div>
        </div>
    );

}
