'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { 
    Search, Sparkles, BookOpen, Building2, MessageSquare, Bus, 
    FileText, PartyPopper, ArrowRight, Clock, MapPin, 
    AlertCircle, Calendar, ChevronRight, User, ThumbsUp 
} from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();
    
    // States for highlights
    const [announcement, setAnnouncement] = useState<any>(null);
    const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
    const [nextBus, setNextBus] = useState<any>(null);
    const [recentPaper, setRecentPaper] = useState<any>(null);
    const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch latest announcement
                const annRes = await api.get('/api/learn/announcements').catch(() => null);
                if (annRes?.data && annRes.data.length > 0) {
                    setAnnouncement(annRes.data[0]);
                } else {
                    // Fallback Mock Announcement
                    setAnnouncement({
                        title: "Mid-Term Examination Schedule",
                        content: "The mid-term exam schedule for all B.Tech and B.Design courses has been released. Check details under your profile.",
                        createdAt: new Date().toISOString()
                    });
                }

                // 2. Fetch nearest upcoming event
                const eventRes = await api.get('/api/council/events?upcoming=true&limit=1').catch(() => null);
                const eventsList = eventRes?.data?.items || eventRes?.data?.events || [];
                if (eventsList.length > 0) {
                    setUpcomingEvent(eventsList[0]);
                } else {
                    // Fallback Mock Event
                    setUpcomingEvent({
                        title: "SABRANG 2026: Annual Fest",
                        start_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days later
                        venue: "JKLU Central Lawn",
                        club_name: "Cultural Council"
                    });
                }

                // 3. Fetch next available bus
                const busRes = await api.get('/api/bus/routes').catch(() => null);
                const routes = busRes?.data || [];
                const activeRoute = routes.find((r: any) => r.status === 'active') || routes[0];
                if (activeRoute) {
                    setNextBus(activeRoute);
                } else {
                    // Fallback Mock Bus
                    setNextBus({
                        routeNumber: "B101",
                        routeName: "JKLU ➔ Mansarovar Metro",
                        timings: ["05:30 PM"],
                        eta: "12 mins",
                        status: "active"
                    });
                }

                // 4. Fetch recent paper
                const paperRes = await api.get('/api/learn/papers?status=approved&limit=1').catch(() => null);
                const papersList = paperRes?.data?.items || [];
                if (papersList.length > 0) {
                    setRecentPaper(papersList[0]);
                } else {
                    // Fallback Mock Paper
                    setRecentPaper({
                        title: "Design Thinking & Innovation - PyQuestion",
                        course_code: "DE2022",
                        paper_type: "exam",
                        year: 2025
                    });
                }

                // 5. Populate recent updates
                setRecentUpdates([
                    { id: 1, type: 'event', title: 'Cyber Security Hackathon registrations open', time: '2 hours ago' },
                    { id: 2, type: 'paper', title: 'New Physics-II Endterm paper uploaded', time: '5 hours ago' },
                    { id: 3, type: 'announcement', title: 'Mess timings adjusted for summer term', time: '1 day ago' },
                ]);

            } catch (error) {
                console.warn('Dashboard fetch error handled');
            } finally {

                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        
        const term = searchTerm.toLowerCase();
        if (term.includes('bus') || term.includes('route') || term.includes('shuttle')) {
            router.push(`/bus?search=${searchTerm}`);
        } else if (term.includes('paper') || term.includes('exam') || term.includes('pyq')) {
            router.push(`/learn/papers?search=${searchTerm}`);
        } else if (term.includes('event') || term.includes('club') || term.includes('fest')) {
            router.push(`/events?search=${searchTerm}`);
        } else {
            router.push(`/events?search=${searchTerm}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nexus-black">
                <div className="w-8 h-8 rounded-full border-2 border-nexus-camel/20 border-t-[var(--primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-nexus-black relative overflow-x-hidden">
            {/* Ambient glows */}
            <div className="glow-orb w-[300px] h-[300px] -top-20 -right-20 bg-nexus-coffee" style={{ opacity: 0.15 }} />
            <div className="glow-orb w-[300px] h-[300px] top-[40%] -left-20 bg-amber-500" style={{ opacity: 0.05 }} />

            {/* Content area */}
            <div className="p-4 space-y-6 relative z-10">
                
                {/* 1. Personalized Greeting */}
                <div className="flex items-center justify-between mt-2">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-nexus-linen">
                            Hey, {user ? user.name.split(' ')[0] : 'Student'}! 👋
                        </h2>
                        <p className="text-xs text-nexus-camel font-medium mt-0.5">
                            Here is what you need to know on campus today.
                        </p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-nexus-camel uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-orange-500" />
                        JK Lakshmipat Univ
                    </div>
                </div>

                {/* 2. Universal Search */}
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex items-center bg-white/5 border border-nexus-camel/10 hover:border-nexus-camel/20 focus-within:border-orange-500/30 rounded-2xl px-4 py-3 backdrop-blur-xl transition-all">
                        <Search className="w-4 h-4 text-white/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Find bus timings, papers, events..."
                            className="w-full bg-transparent border-none text-sm text-nexus-linen placeholder-white/20 focus:ring-0 focus:outline-none px-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="text-xs font-bold text-orange-500 hover:text-orange-400 shrink-0 transition-colors">
                            Search
                        </button>
                    </div>
                </form>

                {/* 3. Quick Services */}
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/30">Quick Services</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: 'Bus Status', icon: Bus, href: '/bus', bg: 'from-amber-500/15 to-orange-600/5', color: '#eab308' },
                            { label: 'Events Hub', icon: Calendar, href: '/events', bg: 'from-blue-500/15 to-indigo-600/5', color: '#3b82f6' },
                            { label: 'Exam Papers', icon: FileText, href: '/learn/papers', bg: 'from-emerald-500/15 to-teal-600/5', color: '#10b981' },
                            { label: 'Complaints', icon: MessageSquare, href: '/complaints', bg: 'from-purple-500/15 to-pink-600/5', color: '#a855f7' }
                        ].map((srv) => (
                            <Link 
                                key={srv.label} 
                                href={srv.href}
                                className="glass-card flex flex-col items-center justify-center p-3 text-center border border-nexus-camel/5 hover:border-white/10 active:scale-95 transition-all"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${srv.bg} flex items-center justify-center mb-2 shadow-inner border border-white/5`}>
                                    <srv.icon className="w-5 h-5" style={{ color: srv.color }} />
                                </div>
                                <span className="text-[10px] font-bold text-nexus-khaki tracking-tight leading-tight">{srv.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. Today's Highlights (Horizontal Cards Carousel) */}
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/30">Today's Highlights</h3>
                    <div className="overflow-x-auto flex gap-3 pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar snap-x">
                        
                        {/* A. Next Bus highlight */}
                        {nextBus && (
                            <Link href="/bus" className="snap-center shrink-0 w-[260px] glass-card p-4 border border-amber-500/20 bg-amber-500/[0.02] flex flex-col justify-between hover:border-amber-500/30 transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            Shuttle Live
                                        </span>
                                        {nextBus.status === 'active' && (
                                            <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-nexus-linen text-sm leading-tight">{nextBus.routeName}</h4>
                                    <div className="flex items-center gap-2 text-xs text-nexus-camel mt-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Departure: {nextBus.timings?.[0] || 'Scheduled'}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-nexus-camel/5 flex items-center justify-between">
                                    <span className="text-[11px] text-white/30">Next arrival:</span>
                                    <span className="text-sm font-extrabold text-amber-400">{nextBus.eta || '--'}</span>
                                </div>
                            </Link>
                        )}

                        {/* B. Announcement Highlight */}
                        {announcement && (
                            <div className="snap-center shrink-0 w-[260px] glass-card p-4 border border-orange-500/20 bg-orange-500/[0.02] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                            Important
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-nexus-linen text-sm leading-tight line-clamp-1">{announcement.title}</h4>
                                    <p className="text-xs text-nexus-camel mt-1.5 line-clamp-2 leading-relaxed">{announcement.content}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-nexus-camel/5 flex items-center justify-between text-[10px] text-white/30">
                                    <span>Campus Admin</span>
                                    <span>{announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Today'}</span>
                                </div>
                            </div>
                        )}

                        {/* C. Upcoming Event Highlight */}
                        {upcomingEvent && (
                            <Link href="/events" className="snap-center shrink-0 w-[260px] glass-card p-4 border border-blue-500/20 bg-blue-500/[0.02] flex flex-col justify-between hover:border-blue-500/30 transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            Featured Event
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-nexus-linen text-sm leading-tight line-clamp-1">{upcomingEvent.title}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-nexus-camel mt-2">
                                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="truncate">{upcomingEvent.venue || 'Campus'}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-nexus-camel/5 flex items-center justify-between">
                                    <span className="text-[10px] text-white/30">{upcomingEvent.club_name}</span>
                                    <div className="flex items-center gap-1 text-xs font-bold text-blue-400">
                                        Join <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* D. Recent Papers Highlight */}
                        {recentPaper && (
                            <Link href="/learn/papers" className="snap-center shrink-0 w-[260px] glass-card p-4 border border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Recent PYQ
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-nexus-linen text-sm leading-tight line-clamp-1">{recentPaper.title}</h4>
                                    <p className="text-xs text-emerald-400/80 font-bold mt-1.5">{recentPaper.course_code}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-nexus-camel/5 flex items-center justify-between text-[10px] text-white/30">
                                    <span>Type: {recentPaper.paper_type}</span>
                                    <span>Year: {recentPaper.year || 'N/A'}</span>
                                </div>
                            </Link>
                        )}

                    </div>
                </section>

                {/* 5. Recent Updates Feed */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white/30">Recent Updates</h3>
                        <Link href="/events" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-0.5">
                            See all updates <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentUpdates.map((update) => (
                            <div key={update.id} className="glass-card p-3.5 flex items-center justify-between border border-nexus-camel/5 hover:bg-white/[0.02] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-nexus-camel">
                                        {update.type === 'event' && <PartyPopper className="w-4 h-4 text-blue-400" />}
                                        {update.type === 'paper' && <FileText className="w-4 h-4 text-emerald-400" />}
                                        {update.type === 'announcement' && <AlertCircle className="w-4 h-4 text-orange-400" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-nexus-linen leading-snug line-clamp-1">{update.title}</p>
                                        <p className="text-[10px] text-white/20 mt-0.5">{update.time}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
