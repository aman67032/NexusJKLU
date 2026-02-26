'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Building2, MessageSquare, LogIn, LogOut, User, LayoutDashboard, ChevronDown, Users, Calendar, Award, Code, FileText, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
    {
        href: '/learn', label: 'Learn', icon: BookOpen, color: 'var(--learn-color)',
        children: [
            { href: '/learn', label: 'Overview', icon: BookOpen },
            { href: '/learn/papers', label: 'Papers', icon: FileText },
            { href: '/learn/coding-hour', label: 'Coding Hour', icon: Code },
            { href: '/learn/profile', label: 'My Profile', icon: UserCircle },
        ],
    },
    {
        href: '/council', label: 'Council', icon: Building2, color: 'var(--council-color)',
        children: [
            { href: '/council', label: 'Overview', icon: Building2 },
            { href: '/council/clubs', label: 'Clubs', icon: Users },
            { href: '/council/councils', label: 'Councils', icon: Award },
            { href: '/council/events', label: 'Events', icon: Calendar },
            { href: '/council/coordinators', label: 'Coordinators', icon: UserCircle },
        ],
    },
    { href: '/voice', label: 'Voice', icon: MessageSquare, color: 'var(--voice-color)' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
    const isModuleActive = (href: string) => pathname.startsWith(href);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
                style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                                <Image
                                    src="/white_jklu_logo.png"
                                    alt="JKLU Logo"
                                    fill
                                    className="object-contain drop-shadow-lg"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-nexus-linen">Nexus</span>
                                <span className="text-orange-500">JKLU</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isModuleActive(link.href);
                                const hasChildren = 'children' in link && link.children && link.children.length > 0;
                                const isDropdownOpen = openDropdown === link.href;

                                return (
                                    <div key={link.href} className="relative">
                                        <button
                                            onClick={() => {
                                                if (hasChildren) {
                                                    setOpenDropdown(isDropdownOpen ? null : link.href);
                                                } else {
                                                    setOpenDropdown(null);
                                                    window.location.href = link.href;
                                                }
                                            }}
                                            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden ${active
                                                ? 'text-nexus-linen'
                                                : 'text-nexus-khaki hover:text-nexus-linen hover:bg-white/[0.06]'
                                                }`}
                                            style={active ? { background: `${link.color}15`, color: link.color } : {}}
                                        >
                                            {/* Active background glow line */}
                                            {active && (
                                                <motion.div
                                                    layoutId="navbar-active"
                                                    className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-t-full opacity-80"
                                                    style={{ background: link.color, filter: 'blur(1px)' }}
                                                />
                                            )}
                                            <Icon className={`w-4 h-4 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                            {link.label}
                                            {hasChildren && (
                                                <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </button>

                                        {/* Dropdown */}
                                        <AnimatePresence>
                                            {hasChildren && isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute top-[calc(100%+8px)] left-0 w-56 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
                                                    style={{ background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(24px)' }}
                                                >
                                                    <div className="py-2 px-1.5 flex flex-col gap-0.5">
                                                        {link.children!.map((child) => {
                                                            const ChildIcon = child.icon;
                                                            const childActive = pathname === child.href;
                                                            return (
                                                                <Link
                                                                    key={child.href}
                                                                    href={child.href}
                                                                    onClick={() => setOpenDropdown(null)}
                                                                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${childActive
                                                                        ? 'text-nexus-linen bg-white/[0.08]'
                                                                        : 'text-nexus-khaki hover:text-nexus-linen hover:bg-white/[0.04]'
                                                                        }`}
                                                                    style={childActive ? { color: link.color } : {}}
                                                                >
                                                                    <div className={`p-1.5 rounded-lg transition-colors ${childActive ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                                                        <ChildIcon className="w-4 h-4" />
                                                                    </div>
                                                                    <span className="font-medium">{child.label}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Auth & Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <div className="hidden md:flex items-center gap-3">
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-nexus-khaki hover:text-white/90 hover:bg-white/[0.04] transition-all"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04]">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[10px] font-bold text-nexus-linen">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-nexus-khaki max-w-[100px] truncate">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 rounded-lg text-nexus-camel hover:text-red-400 hover:bg-white/[0.04] transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-nexus-linen hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                            )}

                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-3 -mr-2 rounded-xl text-nexus-khaki hover:text-nexus-linen hover:bg-white/[0.06] active:bg-white/[0.1] transition-all"
                            >
                                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-0 top-16 z-40 md:hidden border-b border-white/[0.06] max-h-[80vh] overflow-y-auto"
                        style={{ background: 'rgba(5, 5, 5, 0.95)', backdropFilter: 'blur(20px)' }}
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isModuleActive(link.href);
                                const hasChildren = 'children' in link && link.children && link.children.length > 0;
                                return (
                                    <div key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'text-nexus-linen' : 'text-nexus-camel hover:text-nexus-khaki'
                                                }`}
                                            style={active ? { background: `${link.color}15`, color: link.color } : {}}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                        {/* Sub-links on mobile */}
                                        {hasChildren && (
                                            <div className="ml-8 mt-1 space-y-0.5 mb-2">
                                                {link.children!.filter(c => c.href !== link.href).map((child) => {
                                                    const ChildIcon = child.icon;
                                                    const childActive = pathname === child.href;
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            onClick={() => setMobileOpen(false)}
                                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${childActive
                                                                ? 'text-nexus-linen bg-white/[0.06]'
                                                                : 'text-white/35 hover:text-nexus-khaki'
                                                                }`}
                                                            style={childActive ? { color: link.color } : {}}
                                                        >
                                                            <ChildIcon className="w-3.5 h-3.5" />
                                                            {child.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="border-t border-white/[0.06] my-2 pt-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 text-sm text-nexus-khaki">
                                            <User className="w-5 h-5" />
                                            {user.name}
                                        </div>
                                        <button
                                            onClick={() => { logout(); setMobileOpen(false); }}
                                            className="flex items-center gap-3 px-4 py-3 w-full text-sm text-red-400 hover:bg-white/[0.04] rounded-xl"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--primary)]"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
