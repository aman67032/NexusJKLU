'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { Building2, Users, Calendar as CalendarIcon, Award, UserCircle, ChevronRight, MapPin, Target } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import '@/components/FuturisticCalendar.css';
import CouncilLogo3D from '@/components/CouncilLogo3D';

const FloatingLines = dynamic(() => import('@/components/homebgfile'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[var(--background)] animate-pulse" />
});

interface Club {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    category: string;
    image?: string;
}

interface Event {
    id?: string;
    _id?: string;
    title: string;
    start_date: string;
    venue?: string;
    status: string;
    council_name?: string;
    club_name?: string;
    image_url?: string;
}

const subNav = [
    { href: '/council', label: 'Overview', icon: Building2 },
    { href: '/council/clubs', label: 'Clubs', icon: Users },
    { href: '/council/councils', label: 'Councils', icon: Award },
    { href: '/council/events', label: 'Events', icon: CalendarIcon },
    { href: '/council/coordinators', label: 'Coordinators', icon: UserCircle },
];

export default function CouncilPage() {
    const router = useRouter();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const revealRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Promise.all([
            api.get('/api/council/clubs').then(res => setClubs(res.data)).catch(() => { }),
            api.get('/api/council/events?limit=50').then(res => {
                const fetchedEvents = res.data.items || res.data || [];
                // normalize id field
                setEvents(fetchedEvents.map((e: any) => ({ ...e, id: e._id || e.id })));
            }).catch(() => { }),
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

    const hasEvents = (dateObj: Date): boolean => {
        return events.some(event => {
            const eventDate = new Date(event.start_date);
            return eventDate.toDateString() === dateObj.toDateString();
        });
    };

    const getTileClassName = ({ date: tileDate, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const classes = [];
            if (hasEvents(tileDate)) {
                classes.push('has-event');
            }
            return classes.join(' ');
        }
        return '';
    };

    const selectedDateEvents = Array.isArray(date) ? [] : events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.toDateString() === date.toDateString();
    });

    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 relative overflow-hidden">
            {/* Interactive Floating Lines Background */}
            <div className="fixed inset-0 z-0">
                <FloatingLines
                    isLightMode={false}
                    linesGradient={['#ff6600', '#ff9933', '#aa00ff', '#2f4fa2']}
                    bendStrength={-1.5}
                    bendRadius={20.0}
                    topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
                    middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
                    bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
                    lineCount={[8, 5, 12]}
                />
            </div>

            {/* Subtle overlay */}
            <div className="fixed inset-0 z-[1] pointer-events-none bg-nexus-black/30"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="flex flex-col items-center pt-8 pb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4 drop-shadow-xl">
                            JKLU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Council & Clubs</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto drop-shadow-md">
                            The heartbeat of student life. Explore councils, join clubs, attend events.
                        </p>
                    </motion.div>

                    {/* 3D Council Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mt-2 w-full max-w-3xl mx-auto flex justify-center h-[200px] md:h-auto"
                    >
                        <CouncilLogo3D />
                    </motion.div>
                </div>

                {/* Sub Navigation */}
                <div className="mb-10 z-20 relative">
                    <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
                        <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-max min-w-full md:min-w-0 md:justify-center backdrop-blur-md">
                            {subNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/council';
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                            ? 'bg-[var(--primary)]/15 text-[var(--primary)] font-bold'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Student Leadership Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-24 relative z-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Student Leadership</h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
                        {/* Leader Card 1 - Deepak Sogani */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative"
                        >
                            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl border border-nexus-camel/30 relative transition-all duration-300 hover:shadow-[var(--primary)]/20">
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-transparent opacity-50"></div>
                                <img
                                    src="/Council head/Deepak_Sogani_Head - Student Affairs (2).png"
                                    alt="Deepak Sogani"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-nexus-linen translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold mb-1 tracking-tight">Deepak Sogani</h3>
                                    <p className="text-[var(--primary)] font-bold uppercase tracking-[0.2em] text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-nexus-camel/20">
                                        Head - Student Affairs
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Leader Card 2 - Anushka Pathak */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative"
                        >
                            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl border border-nexus-camel/30 relative transition-all duration-300 hover:shadow-[var(--primary)]/20">
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-bl from-[var(--primary)]/20 via-transparent to-transparent opacity-50"></div>
                                <img
                                    src="/Council head/Anushka_Pathak_Executive - Student Affairs (2).png"
                                    alt="Anushka Pathak"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-nexus-linen translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold mb-1 tracking-tight">Anushka Pathak</h3>
                                    <p className="text-[var(--primary)] font-bold uppercase tracking-[0.2em] text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-nexus-camel/20">
                                        Executive - Student Affairs
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Leader Card 3 - Shubham Jain */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative"
                        >
                            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl border border-nexus-camel/30 relative transition-all duration-300 hover:shadow-[var(--primary)]/20">
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-transparent opacity-50"></div>
                                <img
                                    src="/Council head/President_ShubhamJain.png"
                                    alt="Shubham Jain"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-nexus-linen translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold mb-1 tracking-tight">Shubham Jain</h3>
                                    <p className="text-[var(--primary)] font-bold uppercase tracking-[0.2em] text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-nexus-camel/20">
                                        President
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 relative z-20">
                    {[
                        { label: 'Clubs', value: loading ? '-' : clubs.length, icon: Users, color: 'var(--primary)', href: '/council/clubs' },
                        { label: 'Upcoming Events', value: loading ? '-' : events.filter(e => new Date(e.start_date) >= new Date()).length, icon: CalendarIcon, color: '#3B82F6', href: '/council/events' },
                        { label: 'Councils', value: '4', icon: Award, color: '#10B981', href: '/council/councils' },
                        { label: 'Coordinators', value: '12+', icon: UserCircle, color: '#8B5CF6', href: '/council/coordinators' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={stat.label} href={stat.href}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.05) }}
                                    className="bg-white/10 dark:bg-nexus-black/20 backdrop-blur-xl border border-nexus-camel/20 p-4 text-center rounded-[24px] group hover:border-[var(--primary)]/50 transition-all cursor-pointer shadow-lg hover:shadow-[var(--primary)]/20">
                                    <Icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: stat.color }} />
                                    <div className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                                    <div className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Calendar Section */}
                <section
                    className="relative py-16 px-4 overflow-visible z-10"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        if (revealRef.current) {
                            revealRef.current.style.setProperty('--mx', `${x}px`);
                            revealRef.current.style.setProperty('--my', `${y}px`);
                        }
                    }}
                    onMouseLeave={() => {
                        if (revealRef.current) {
                            revealRef.current.style.setProperty('--mx', '-9999px');
                            revealRef.current.style.setProperty('--my', '-9999px');
                        }
                    }}
                >
                    <div className="absolute top-[-400px] left-0 right-0 h-[calc(100%+300px)] z-0 pointer-events-none overflow-visible mix-blend-screen opacity-90">
                    </div>

                    <div className="relative z-20"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            if (revealRef.current) {
                                revealRef.current.style.setProperty('--mx', `${x}px`);
                                revealRef.current.style.setProperty('--my', `${y}px`);
                            }
                        }}
                        onMouseLeave={() => {
                            if (revealRef.current) {
                                revealRef.current.style.setProperty('--mx', '-9999px');
                                revealRef.current.style.setProperty('--my', '-9999px');
                            }
                        }}>
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight drop-shadow-md">Event Calendar</h2>
                            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto drop-shadow-sm">
                                Stay synchronized with JKLU's vibrant campus life and never miss an opportunity to engage.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Calendar */}
                            <div
                                ref={revealRef}
                                className="group relative bg-white/10 dark:bg-nexus-black/20 backdrop-blur-3xl p-8 rounded-[42px] shadow-2xl border-2 border-[var(--primary)] ring-4 ring-[var(--primary)]/20 shadow-[var(--primary)]/10 transition-all duration-500"
                                style={{
                                    '--mx': '-9999px',
                                    '--my': '-9999px'
                                } as React.CSSProperties}
                            >
                                <div
                                    className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[42px]"
                                    style={{
                                        background: 'radial-gradient(circle at var(--mx) var(--my), rgba(255, 102, 0, 0.15), transparent 300px)',
                                        mixBlendMode: 'plus-lighter'
                                    }}
                                />

                                <div className="relative z-10">
                                    <Calendar
                                        onChange={setDate as any}
                                        value={date as any}
                                        className="w-full text-[var(--text-primary)] react-calendar-laser"
                                        tileClassName={getTileClassName}
                                    />
                                </div>
                            </div>

                            {/* Event List Side */}
                            <div className="bg-white/10 dark:bg-nexus-black/20 backdrop-blur-xl rounded-[38px] p-8 border border-nexus-camel/30 shadow-xl h-full min-h-[500px]">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] flex items-center border-b border-nexus-camel/20 pb-6 mb-6">
                                    {format(date as Date, 'MMMM d, yyyy')}
                                </h3>

                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="animate-pulse space-y-4">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="h-24 bg-white/5 rounded-2xl w-full"></div>
                                            ))}
                                        </div>
                                    ) : selectedDateEvents.length > 0 ? (
                                        selectedDateEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={() => router.push(`/council/events/${event.id}`)}
                                                className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-nexus-camel/20 hover:border-[var(--primary)] hover:bg-white/10 transition-all duration-300 cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20`}>
                                                        {event.council_name || event.club_name || 'Event'}
                                                    </span>
                                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-[var(--primary)]/20 transition-colors">
                                                        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                                                    </div>
                                                </div>

                                                {event.image_url && (
                                                    <div className="w-full h-32 mb-4 rounded-xl overflow-hidden relative">
                                                        <img
                                                            src={event.image_url}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                    </div>
                                                )}

                                                <h4 className="text-xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--primary)] transition-colors">{event.title}</h4>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--text-secondary)] font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-nexus-black/20 flex items-center justify-center">
                                                            <CalendarIcon className="w-4 h-4 text-[var(--primary)]" />
                                                        </div>
                                                        <span>{format(new Date(event.start_date), 'h:mm a')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-nexus-black/20 flex items-center justify-center">
                                                            <MapPin className="w-4 h-4 text-[var(--primary)]" />
                                                        </div>
                                                        <span className="truncate">{event.venue || 'TBA'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] bg-white/5 rounded-3xl border border-dashed border-nexus-camel/20">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                                <CalendarIcon className="w-8 h-8 text-white/20" />
                                            </div>
                                            <p className="text-lg font-medium">No events scheduled</p>
                                            <p className="text-sm">Check another date for activities</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
