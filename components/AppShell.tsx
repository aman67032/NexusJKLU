'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Bus, Calendar, FileText, UserCircle, LogOut, ShieldAlert, Smartphone, Maximize2, Menu, X, Bell, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: Home, color: '#0B0828' },
    { label: 'Bus', href: '/bus', icon: Bus, color: '#8FA0D8' },
    { label: 'Events', href: '/events', icon: Calendar, color: '#FF8400' },
    { label: 'Papers', href: '/learn/papers', icon: FileText, color: '#4A85D6' },
    { label: 'Profile', href: '/profile', icon: UserCircle, color: '#0B0828' }
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
        return <div className="min-h-screen bg-background text-foreground">{children}</div>;
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
        <div className="flex flex-col h-full bg-background text-foreground relative overflow-hidden select-none">
            {/* Top Bar / Header */}
            <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-[#0B0828]/5 bg-background/90 backdrop-blur-md z-30 sticky top-0">
                <div className="flex items-center gap-2.5">
                    <img src="/logos/JKLU Coloured.png" alt="JKLU" className="w-8 h-8 object-contain" />
                    <div>
                        <p className="text-[9px] text-[#0B0828]/45 font-black uppercase tracking-wider leading-none font-display">Nexus JKLU</p>
                        <p className="text-xs font-bold text-[#0B0828] mt-0.5 leading-none">
                            {user ? `${getGreeting()}, ${user.name.split(' ')[0]}` : 'Welcome, Guest'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {user?.roles?.some((r: string) => ['admin', 'super_admin', 'learn_admin', 'voice_admin'].includes(r)) && (
                        <Link href="/admin" className="p-2 rounded-xl bg-[#0B0828]/5 hover:bg-[#0B0828]/10 text-[#0B0828] transition-colors">
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                        </Link>
                    )}
                    <button className="p-2 rounded-xl bg-[#0B0828]/5 hover:bg-[#0B0828]/10 text-[#0B0828] transition-colors relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF8400]" />
                    </button>
                </div>
            </header>

            {/* Main scrollable section */}
            <main className="flex-1 overflow-y-auto pb-24 relative scrollbar-hide no-scrollbar">
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

            {/* Bottom Nav Bar - Floating Capsule from Reference Design */}
            <nav className="fixed bottom-4 left-4 right-4 h-16 shrink-0 bg-white/95 shadow-[0_8px_30px_rgba(11,8,40,0.03)] border border-[#0B0828]/5 rounded-[20px] z-40 flex items-center justify-around px-2">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center justify-center flex-1 h-full relative group cursor-pointer"
                        >
                            <div className="relative py-1 flex flex-col items-center">
                                <Icon 
                                    className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110' : 'text-[#0B0828]/40 group-hover:scale-105'}`}
                                    style={{ color: isActive ? item.color : undefined }}
                                />
                                <span 
                                    className={`text-[10px] mt-1 font-bold tracking-tight transition-colors duration-200 ${isActive ? 'font-extrabold font-display' : 'text-[#0B0828]/35 font-sans'}`}
                                    style={isActive ? { color: item.color } : {}}
                                >
                                    {item.label}
                                </span>
                                
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="navGlow"
                                        className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    // Desktop centered layout with a warm academic background
    return (
        <div className="min-h-screen bg-[#EAE4DC] text-foreground flex flex-col items-center justify-center relative select-none">
            <div className="w-full max-w-md min-h-screen bg-background relative border-x border-[#0B0828]/5 shadow-2xl flex flex-col">
                {appContent}
            </div>
        </div>
    );

}
