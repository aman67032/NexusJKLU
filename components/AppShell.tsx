'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
    Home, Bus, PartyPopper, FileText, UserCircle, ShieldAlert, Bell, User, MessageSquare, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mobile bottom navigation items
const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: Home, color: '#34446D' },
    { label: 'Bus', href: '/bus', icon: Bus, color: '#FBB940' },
    { label: 'Events', href: '/events', icon: PartyPopper, color: '#F57EA3' },
    { label: 'Papers', href: '/learn/papers', icon: FileText, color: '#85D2FF' },
    { label: 'Profile', href: '/profile', icon: UserCircle, color: '#34446D' }
];

// Desktop sidebar navigation items
const SIDEBAR_ITEMS = [
    { label: 'Home', href: '/', icon: Home, color: '#F57EA3', activeBg: 'bg-[#F57EA3]/10' },
    { label: 'Bus', href: '/bus', icon: Bus, color: '#FBB940', activeBg: 'bg-[#FBB940]/10' },
    { label: 'Events', href: '/events', icon: PartyPopper, color: '#F57EA3', activeBg: 'bg-[#F57EA3]/10' },
    { label: 'Papers', href: '/learn/papers', icon: FileText, color: '#85D2FF', activeBg: 'bg-[#85D2FF]/10' },
    { label: 'Complaints', href: '/complaints', icon: MessageSquare, color: '#9B365A', activeBg: 'bg-[#9B365A]/10' }
];

const SIDEBAR_SECONDARY_ITEMS = [
    { label: 'Notices', href: '/profile', icon: Bell, color: '#666A7A' },
    { label: 'Profile', href: '/profile', icon: User, color: '#666A7A' },
    { label: 'Settings', href: '/profile', icon: Settings, color: '#666A7A' }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuth();
    
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Render inner content of the mobile app
    const appContent = (
        <div className="flex flex-col h-full bg-background text-foreground relative overflow-hidden select-none animate-fadeIn">
            {/* Top Bar / Header */}
            <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-[#34446D]/5 bg-background/90 backdrop-blur-md z-30 sticky top-0">
                <div className="flex items-center gap-2.5">
                    <img src="/logos/JKLU Coloured.png" alt="JKLU" className="w-8 h-8 object-contain" />
                    <div>
                        <p className="text-[9px] text-[#34446D]/45 font-black uppercase tracking-wider leading-none font-display">Nexus JKLU</p>
                        <p className="text-xs font-bold text-[#34446D] mt-0.5 leading-none">
                            {user ? `${getGreeting()}, ${user.name.split(' ')[0]}` : 'Welcome, Guest'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {user?.roles?.some((r: string) => ['admin', 'super_admin', 'learn_admin', 'voice_admin'].includes(r)) && (
                        <Link href="/admin" className="p-2 rounded-xl bg-[#34446D]/5 hover:bg-[#34446D]/10 text-[#34446D] transition-colors animate-pulse">
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                        </Link>
                    )}
                    <button className="p-2 rounded-xl bg-[#34446D]/5 hover:bg-[#34446D]/10 text-[#34446D] transition-colors relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F57EA3]" />
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
            <nav className="fixed bottom-4 left-4 right-4 h-16 shrink-0 bg-white/95 shadow-[0_8px_30px_rgba(52,68,109,0.03)] border border-[#34446D]/5 rounded-[20px] z-40 flex items-center justify-around px-2">
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
                                    className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110' : 'text-[#34446D]/40 group-hover:scale-105'}`}
                                    style={{ color: isActive ? item.color : undefined }}
                                />
                                <span 
                                    className={`text-[10px] mt-1 font-bold tracking-tight transition-colors duration-200 ${isActive ? 'font-extrabold font-display' : 'text-[#34446D]/35 font-sans'}`}
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

    // Responsive Desktop and Mobile wrapper
    return (
        <div className="min-h-screen bg-[#FDEADB] text-[#34446D] relative select-none overflow-x-hidden font-sans">
            {/* Desktop Layout (lg screens) */}
            <div className="hidden lg:flex min-h-screen">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-[#34446D]/10 flex flex-col justify-between p-6 shrink-0 z-20">
                    <div className="space-y-8">
                        {/* Logo header */}
                        <div className="flex items-center gap-3 px-2 mt-2">
                            <div className="w-8 h-8 rounded-lg bg-[#34446D] flex items-center justify-center text-white shrink-0">
                                <img src="/logos/JKLU Coloured.png" alt="Logo" className="w-6 h-6 object-contain invert brightness-200" />
                            </div>
                            <div>
                                <h1 className="font-display font-black text-xl tracking-tight leading-none text-[#34446D]">NEXUS</h1>
                                <p className="text-[9px] font-bold text-[#666A7A] tracking-wider uppercase mt-0.5">Campus Companion</p>
                            </div>
                        </div>

                        {/* Primary Nav Menu */}
                        <nav className="space-y-1">
                            {SIDEBAR_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                            isActive 
                                                ? `${item.activeBg} font-bold text-[#34446D] shadow-[0_2px_8px_rgba(52,68,109,0.02)]` 
                                                : 'hover:bg-[#34446D]/5 text-[#666A7A] hover:text-[#34446D]'
                                        }`}
                                    >
                                        <Icon 
                                            className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" 
                                            style={{ color: isActive ? item.color : '#666A7A' }}
                                        />
                                        <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Secondary menu items */}
                    <div className="space-y-1 border-t border-[#34446D]/5 pt-6">
                        {SIDEBAR_SECONDARY_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                        isActive 
                                            ? 'bg-[#34446D]/5 font-bold text-[#34446D]' 
                                            : 'hover:bg-[#34446D]/5 text-[#666A7A] hover:text-[#34446D]'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 text-[#666A7A] group-hover:scale-105 transition-transform" />
                                    <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                    {/* Topbar Header */}
                    <header className="h-20 bg-white border-b border-[#34446D]/10 flex items-center justify-between px-8 shrink-0 z-10">
                        <div>
                            <h2 className="font-display font-black text-xl text-[#34446D]">
                                {pathname === '/' ? `Good Morning, ${user ? user.name.split(' ')[0] : 'Rashi'}! 👋` : (
                                    pathname.startsWith('/bus') ? 'Bus Status & Schedules' :
                                    pathname.startsWith('/events') ? 'Campus Events Hub' :
                                    pathname.startsWith('/learn/papers') ? 'Academic Exam Papers' :
                                    pathname.startsWith('/complaints') ? 'Campus Complaints Portal' :
                                    pathname.startsWith('/profile') ? 'My Student Profile' : 'Nexus Portal'
                                )}
                            </h2>
                            <p className="text-xs text-[#666A7A] font-semibold mt-0.5">
                                {pathname === '/' ? "Here's what's happening on campus today." : 'Nexus Campus Companion'}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-5">
                            {/* Notification Bell */}
                            <button className="p-2.5 rounded-xl bg-[#34446D]/5 hover:bg-[#34446D]/10 text-[#34446D] transition-colors relative">
                                <Bell className="w-4.5 h-4.5" />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F57EA3]" />
                            </button>

                            {/* User Profile Avatar */}
                            <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
                                <div className="w-10 h-10 rounded-full border border-[#34446D]/15 overflow-hidden flex items-center justify-center bg-white shadow-sm shrink-0">
                                    <img 
                                        src={user?.profile?.gender === 'male' ? '/avatars/male.png' : '/avatars/female.png'} 
                                        alt="Profile Avatar" 
                                        className="w-full h-full object-contain mix-blend-multiply" 
                                    />
                                </div>
                            </Link>
                        </div>
                    </header>

                    {/* Dashboard/Page Scroll View */}
                    <main className="flex-1 overflow-y-auto p-8 bg-background scrollbar-hide no-scrollbar relative">
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
                </div>
            </div>

            {/* Mobile/Tablet View (lg:hidden) */}
            <div className="lg:hidden min-h-screen flex items-center justify-center bg-[#EAE4DC]">
                <div className="w-full max-w-md min-h-screen bg-background relative border-x border-[#0B0828]/5 shadow-2xl flex flex-col animate-fadeIn">
                    {appContent}
                </div>
            </div>
        </div>
    );
}
