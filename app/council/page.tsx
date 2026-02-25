'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import { Building2, Users, Calendar, Award, BarChart3, ArrowRight, MapPin, UserCircle } from 'lucide-react';

interface Club {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    category: string;
    image?: string;
}

interface Event {
    _id: string;
    title: string;
    date: string;
    venue?: string;
    status: string;
    clubId?: { name: string; slug: string };
}

const subNav = [
    { href: '/council', label: 'Overview', icon: Building2 },
    { href: '/council/clubs', label: 'Clubs', icon: Users },
    { href: '/council/councils', label: 'Councils', icon: Award },
    { href: '/council/events', label: 'Events', icon: Calendar },
    { href: '/council/coordinators', label: 'Coordinators', icon: UserCircle },
];

export default function CouncilPage() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/api/council/clubs').then(res => setClubs(res.data)).catch(() => { }),
            api.get('/api/council/events?upcoming=true&limit=5').then(res => setEvents(res.data.items || [])).catch(() => { }),
        ]).finally(() => setLoading(false));
    }, []);

    const categoryColors: Record<string, string> = {
        technology: '#3B82F6',
        cultural: '#EC4899',
        sports: '#10B981',
        literary: '#8B5CF6',
        media: '#F59E0B',
        social: '#06B6D4',
        other: '#6B7280',
    };

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-orange-500" style={{ opacity: 0.06 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--council-color)' + '20' }}>
                            <Building2 className="w-5 h-5" style={{ color: 'var(--council-color)' }} />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Council & Clubs</h1>
                    </div>
                    <p className="text-white/40 max-w-xl">Explore JKLU councils, join clubs, attend events, and earn certificates.</p>
                </motion.div>

                {/* Sub Navigation */}
                <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                    {subNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === '/council';
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-[var(--council-color)]/15 text-[var(--council-color)]'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Clubs', value: clubs.length, icon: Users, color: 'var(--council-color)', href: '/council/clubs' },
                        { label: 'Upcoming Events', value: events.length, icon: Calendar, color: '#3B82F6', href: '/council/events' },
                        { label: 'Councils', value: '6', icon: Award, color: '#10B981', href: '/council/councils' },
                        { label: 'Coordinators', value: '9', icon: UserCircle, color: '#8B5CF6', href: '/council/coordinators' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={stat.label} href={stat.href}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="glass-card p-4 text-center group hover:border-white/10 transition-all cursor-pointer">
                                    <Icon className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: stat.color }} />
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-white/30">{stat.label}</div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Clubs */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-[var(--council-color)]" /> Clubs
                            </h2>
                            <Link href="/council/clubs" className="text-xs font-semibold text-[var(--council-color)] flex items-center gap-1 hover:underline">
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="glass-card p-5 animate-pulse"><div className="h-4 bg-white/5 rounded w-1/2 mb-2" /><div className="h-3 bg-white/5 rounded w-3/4" /></div>
                                ))}
                            </div>
                        ) : clubs.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {clubs.slice(0, 6).map((club) => (
                                    <Link key={club._id} href={`/council/clubs/${club.slug}`}>
                                        <div className="glass-card p-5 module-card-council group">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-base font-semibold text-white group-hover:text-[var(--council-color)] transition-colors">{club.name}</h3>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: (categoryColors[club.category] || '#6B7280') + '15', color: categoryColors[club.category] || '#6B7280' }}>
                                                    {club.category}
                                                </span>
                                            </div>
                                            {club.description && <p className="text-sm text-white/30 line-clamp-2">{club.description}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                                <p className="text-white/30">No clubs found</p>
                                <p className="text-white/20 text-sm">Clubs will appear here once added.</p>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" /> Upcoming Events
                            </h2>
                            <Link href="/council/events" className="text-xs font-semibold text-blue-400 flex items-center gap-1 hover:underline">
                                All Events <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        {events.length > 0 ? (
                            <div className="space-y-3">
                                {events.map((event) => (
                                    <Link key={event._id} href={`/council/events/${event._id}`}>
                                        <div className="glass-card p-4 group">
                                            <h4 className="text-sm font-medium text-white group-hover:text-[var(--council-color)] transition-colors mb-1">{event.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-white/30">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString()}</span>
                                                {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-8 text-center">
                                <Calendar className="w-8 h-8 text-white/10 mx-auto mb-2" />
                                <p className="text-white/30 text-sm">No upcoming events</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
