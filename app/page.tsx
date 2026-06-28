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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-2 border-[#0B0828]/10 border-t-[#0B0828] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-background relative overflow-x-hidden">
            {/* Content area */}
            <div className="p-4 space-y-6 relative z-10 font-sans">
                
                {/* 1. Personalized Greeting with Illustration */}
                <div className="flex items-center justify-between mt-2 gap-4">
                    <div className="w-[38%] shrink-0 aspect-[4/3] flex items-center justify-center">
                        <img 
                            src="/illustrations/student-greeting.svg" 
                            alt="Nexus Student Greeting" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#0B0828]/5 text-[10px] font-bold text-[#0B0828] uppercase tracking-wider shadow-[0_2px_4px_rgba(11,8,40,0.01)] mb-3">
                            <Sparkles className="w-3 h-3 text-[#FF8400]" />
                            JK Lakshmipat Univ
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display leading-tight">
                            Hey, {user ? user.name.split(' ')[0] : 'Student'}! 👋
                        </h2>
                        <p className="text-xs text-[#5B6077] font-medium mt-1.5 leading-relaxed">
                            Here is what you need to know on campus today.
                        </p>
                    </div>
                </div>

                {/* 2. Universal Search */}
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-0 bg-[#0B0828]/5 rounded-[14px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex items-center bg-white border border-[#0B0828]/10 hover:border-[#0B0828]/20 focus-within:border-[#0B0828]/30 rounded-[14px] px-4 py-3 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all">
                        <Search className="w-4 h-4 text-[#0B0828]/35 shrink-0" />
                        <input
                            type="text"
                            placeholder="Find bus timings, papers, events..."
                            className="w-full bg-transparent border-none text-sm text-[#0B0828] placeholder-[#5B6077]/40 focus:ring-0 focus:outline-none px-3 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="text-xs font-bold text-[#FF8400] hover:text-[#FF8400]/80 shrink-0 transition-colors uppercase tracking-wider font-display">
                            Search
                        </button>
                    </div>
                </form>

                {/* 3. Quick Services - Modern Academic Cards with Colored Badges */}
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Quick Services</h3>
                    <div className="grid grid-cols-4 gap-2.5">
                        {[
                            { label: 'Bus Status', icon: Bus, href: '/bus', borderClass: 'border-[#8FA0D8]/20 hover:border-[#8FA0D8]/45', iconColor: 'text-[#8FA0D8]', iconBg: 'bg-[#8FA0D8]/10' },
                            { label: 'Events Hub', icon: Calendar, href: '/events', borderClass: 'border-[#FF8400]/15 hover:border-[#FF8400]/40', iconColor: 'text-[#FF8400]', iconBg: 'bg-[#FF8400]/10' },
                            { label: 'Exam Papers', icon: FileText, href: '/learn/papers', borderClass: 'border-[#8FA0D8]/20 hover:border-[#8FA0D8]/45', iconColor: 'text-[#8FA0D8]', iconBg: 'bg-[#8FA0D8]/10' },
                            { label: 'Complaints', icon: MessageSquare, href: '/complaints', borderClass: 'border-[#E76F51]/15 hover:border-[#E76F51]/40', iconColor: 'text-[#E76F51]', iconBg: 'bg-[#E76F51]/10' }
                        ].map((srv) => (
                            <Link 
                                key={srv.label} 
                                href={srv.href}
                                className={`${srv.borderClass} flex flex-col items-center justify-center p-3 text-center bg-white border rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)] active:scale-95 transition-all`}
                            >
                                <div className={`w-10 h-10 rounded-xl ${srv.iconBg} flex items-center justify-center mb-2`}>
                                    <srv.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-[#0B0828] font-display tracking-tight leading-tight">{srv.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. Today's Highlights (Vertical List Layout) */}
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Today's Highlights</h3>
                    <div className="space-y-2.5">
                        {nextBus && (
                            <Link href="/bus" className="glass-card p-3.5 flex items-center justify-between border border-[#8FA0D8]/20 hover:border-[#8FA0D8]/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#8FA0D8]/10 flex items-center justify-center text-[#8FA0D8]">
                                        <Bus className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#0B0828] leading-snug line-clamp-1 font-display">{nextBus.routeName}</p>
                                        <p className="text-[10px] text-[#5B6077]/70 mt-0.5 font-semibold">
                                            Departure: {nextBus.timings?.[0] || 'Scheduled'} • ETA: {nextBus.eta || '--'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#0B0828]/35" />
                            </Link>
                        )}

                        {announcement && (
                            <div className="glass-card p-3.5 flex items-center justify-between border border-[#FF8400]/15 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FF8400]/10 flex items-center justify-center text-[#FF8400]">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#0B0828] leading-snug line-clamp-1 font-display">{announcement.title}</p>
                                        <p className="text-[10px] text-[#5B6077]/70 mt-0.5 font-semibold">
                                            Campus Admin • {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Today'}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-[#FF8400]/10 text-[#FF8400] border border-[#FF8400]/15 font-display shrink-0 mr-1">
                                    Important
                                </span>
                            </div>
                        )}

                        {upcomingEvent && (
                            <Link href="/events" className="glass-card p-3.5 flex items-center justify-between border border-[#FF8400]/15 hover:border-[#FF8400]/40 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FF8400]/10 flex items-center justify-center text-[#FF8400]">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#0B0828] leading-snug line-clamp-1 font-display">{upcomingEvent.title}</p>
                                        <p className="text-[10px] text-[#5B6077]/70 mt-0.5 font-semibold">
                                            {upcomingEvent.venue || 'Campus'} • {upcomingEvent.club_name}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#0B0828]/35" />
                            </Link>
                        )}

                        {recentPaper && (
                            <Link href="/learn/papers" className="glass-card p-3.5 flex items-center justify-between border border-[#8FA0D8]/20 hover:border-[#8FA0D8]/55 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#8FA0D8]/15 flex items-center justify-center text-[#0B0828]">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#0B0828] leading-snug line-clamp-1 font-display">{recentPaper.title}</p>
                                        <p className="text-[10px] text-[#5B6077]/70 mt-0.5 font-semibold">
                                            {recentPaper.course_code} • Type: {recentPaper.paper_type}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#0B0828]/35" />
                            </Link>
                        )}
                    </div>
                </section>

                {/* 5. Recent Updates (Horizontal Cards Carousel with details) */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Recent Updates</h3>
                        <Link href="/events" className="text-xs font-bold text-[#0B0828] hover:underline flex items-center gap-0.5 font-display">
                            See all updates <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex gap-3.5 pb-2.5 -mx-4 px-4 scrollbar-hide no-scrollbar snap-x">
                        {recentUpdates.map((update) => {
                            let description = "Keep up with the latest campus notifications and updates.";
                            let borderClass = "border-[#8FA0D8]/20 hover:border-[#8FA0D8]/55";
                            let badgeClass = "bg-[#8FA0D8]/15 text-[#0B0828] border-[#8FA0D8]/25";
                            let icon = <PartyPopper className="w-3.5 h-3.5 text-[#8FA0D8]" />;

                            if (update.type === 'event') {
                                description = "Register for the cyber security bootcamp. Team sizes of 2-4. Exciting prizes!";
                                borderClass = "border-[#FF8400]/15 hover:border-[#FF8400]/40";
                                badgeClass = "bg-[#FF8400]/10 text-[#FF8400] border-[#FF8400]/15";
                                icon = <PartyPopper className="w-3.5 h-3.5 text-[#FF8400]" />;
                            } else if (update.type === 'paper') {
                                description = "Previous year question papers for Physics-II (PH1002) uploaded. Approved by Faculty.";
                                borderClass = "border-[#8FA0D8]/20 hover:border-[#8FA0D8]/55";
                                badgeClass = "bg-[#8FA0D8]/15 text-[#0B0828] border-[#8FA0D8]/25";
                                icon = <FileText className="w-3.5 h-3.5 text-[#8FA0D8]" />;
                            } else if (update.type === 'announcement') {
                                description = "Breakfast, Lunch, and Dinner timings updated. Check notice boards.";
                                borderClass = "border-[#FF8400]/15 hover:border-[#FF8400]/40";
                                badgeClass = "bg-[#FF8400]/10 text-[#FF8400] border-[#FF8400]/15";
                                icon = <AlertCircle className="w-3.5 h-3.5 text-[#FF8400]" />;
                            }

                            return (
                                <div key={update.id} className={`snap-center shrink-0 w-[265px] bg-white border ${borderClass} p-4 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)] flex flex-col justify-between hover:scale-[1.01] transition-transform`}>
                                    <div>
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeClass} font-display`}>
                                                {update.type}
                                            </span>
                                            <span className="text-[10px] text-[#8E92A6] font-bold">{update.time}</span>
                                        </div>
                                        <h4 className="font-bold text-[#0B0828] text-sm leading-snug line-clamp-1 font-display">{update.title}</h4>
                                        <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed text-[#5B6077] font-medium">{description}</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-[#0B0828]/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-[#8E92A6] flex items-center gap-1">
                                            {icon} Latest Update
                                        </span>
                                        <Link href={update.type === 'event' ? '/events' : update.type === 'paper' ? '/learn/papers' : '/profile'} className="flex items-center gap-1 text-xs font-bold text-[#0B0828] font-display">
                                            View <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
}
