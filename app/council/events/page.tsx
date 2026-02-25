'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Search, ChevronRight, Building2, Users, Award, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const subNav = [
    { href: '/council', label: 'Overview', icon: Building2 },
    { href: '/council/clubs', label: 'Clubs', icon: Users },
    { href: '/council/councils', label: 'Councils', icon: Award },
    { href: '/council/events', label: 'Events', icon: Calendar },
    { href: '/council/coordinators', label: 'Coordinators', icon: UserCircle },
];

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('upcoming');

    useEffect(() => {
        setLoading(true);
        let url = '/api/council/events?status=approved';
        if (filter === 'upcoming') url += '&upcoming=true';
        api.get(url)
            .then(res => setEvents(res.data.events || res.data.items || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [filter]);

    const filtered = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'past') return matchesSearch && new Date(event.start_date || event.date) < new Date();
        return matchesSearch;
    });

    const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-blue-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[500px] h-[500px] -bottom-48 -left-48 bg-[var(--primary)]" style={{ opacity: 0.06 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-white/50 mb-2">
                            What's Happening
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            <span className="gradient-text-orange">Campus Events</span>
                        </h1>
                        <p className="text-lg max-w-2xl text-white/40 mb-6">
                            Discover screenings, workshops, competitions, and more happening at JKLU.
                        </p>

                        {/* Sub Navigation */}
                        <div className="flex flex-wrap gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-fit">
                            {subNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/council/events';
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
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
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-hover:text-[var(--primary)] transition-colors" />
                            <input type="text" placeholder="Search events..." className="w-full sm:w-72 pl-12 pr-4 py-3 rounded-2xl border-2 bg-white/5 border-white/10 focus:border-[var(--primary)] text-white placeholder-white/30 outline-none backdrop-blur-xl transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="flex items-center p-1 rounded-2xl border bg-white/5 border-white/10 backdrop-blur-xl">
                            {['upcoming', 'all', 'past'].map((f) => (
                                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${filter === f ? 'bg-gradient-to-r from-[var(--primary)] to-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-[var(--primary)]'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-t-[var(--primary)] border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin" />
                            <div className="absolute inset-2 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-[var(--primary)] rounded-full animate-spin direction-reverse" />
                        </div>
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filtered.map((event) => {
                                const eventDate = event.start_date || event.date;
                                return (
                                    <motion.div key={event.id || event._id} variants={itemVariants} layout onClick={() => router.push(`/council/events/${event.id || event._id}`)}
                                        className="group relative rounded-3xl overflow-hidden cursor-pointer border bg-white/5 border-white/10 hover:border-[var(--primary)]/50 hover:shadow-[var(--primary)]/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                                        {/* Image */}
                                        <div className="h-48 w-full relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                            {event.image_url && (
                                                <>
                                                    <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                                </>
                                            )}
                                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                                {event.council_name && (
                                                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-black/40 text-white backdrop-blur-md rounded-full border border-white/10">{event.council_name}</span>
                                                )}
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                                <div className="flex items-center gap-2 text-xs font-medium text-white/90 mb-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {eventDate && format(new Date(eventDate), 'MMM d, yyyy')}
                                                </div>
                                                <h3 className="text-xl font-bold line-clamp-2 leading-tight text-white drop-shadow-md">{event.title}</h3>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 pt-4">
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center gap-3 text-sm font-medium">
                                                    <div className="p-2 rounded-lg bg-white/5"><Clock className="w-4 h-4 text-[var(--primary)]" /></div>
                                                    <span className="text-white/50">{eventDate && format(new Date(eventDate), 'h:mm a')}</span>
                                                </div>
                                                {event.venue && (
                                                    <div className="flex items-center gap-3 text-sm font-medium">
                                                        <div className="p-2 rounded-lg bg-white/5"><MapPin className="w-4 h-4 text-[var(--primary)]" /></div>
                                                        <span className="text-white/50">{event.venue}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm line-clamp-3 mb-4 text-white/30">{event.description}</p>

                                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-white/20">{event.club_name || 'JKLU Event'}</span>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white group-hover:bg-[var(--primary)] transition-all duration-300">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filtered.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-white/5">
                            <Calendar className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                        <p className="text-white/30">Try adjusting your search or filters.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
