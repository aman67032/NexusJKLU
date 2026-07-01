'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { 
    Search, Bus, FileText, PartyPopper, ArrowRight, AlertCircle, ChevronRight, MessageSquare
} from 'lucide-react';

const CalendarWidget = () => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weeks = [
        [{ day: 27, isCurrentMonth: false }, { day: 28, isCurrentMonth: false }, { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false }, { day: 1, isCurrentMonth: true }, { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true }],
        [{ day: 4, isCurrentMonth: true }, { day: 5, isCurrentMonth: true }, { day: 6, isCurrentMonth: true }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true }, { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true }],
        [{ day: 11, isCurrentMonth: true }, { day: 12, isCurrentMonth: true }, { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true }, { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true }],
        [{ day: 18, isCurrentMonth: true }, { day: 19, isCurrentMonth: true }, { day: 20, isCurrentMonth: true, isHighlighted: true }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true }, { day: 23, isCurrentMonth: true }, { day: 24, isCurrentMonth: true }],
        [{ day: 25, isCurrentMonth: true }, { day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true }, { day: 29, isCurrentMonth: true }, { day: 30, isCurrentMonth: true }, { day: 31, isCurrentMonth: true }]
    ];
    
    return (
        <div className="bg-[#34446D] text-white p-5 rounded-[20px] shadow-[0_8px_30px_rgba(52,68,109,0.12)] flex flex-col h-full select-none">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <span className="font-display font-black text-sm tracking-wide">May 2025</span>
                <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            
            {/* Days of Week Label */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-white/50 mb-3 uppercase tracking-wider">
                {daysOfWeek.map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>
            
            {/* Days grid */}
            <div className="grid grid-rows-5 gap-y-2 flex-1">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="grid grid-cols-7 gap-1 text-center items-center">
                        {week.map((dayObj, dIndex) => {
                            if (dayObj.isHighlighted) {
                                return (
                                    <div key={dIndex} className="flex justify-center">
                                        <div className="w-7 h-7 rounded-full bg-white text-[#34446D] font-black flex items-center justify-center text-xs shadow-md">
                                            {dayObj.day}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div 
                                    key={dIndex} 
                                    className={`text-xs font-bold ${
                                        dayObj.isCurrentMonth ? 'text-white' : 'text-white/30'
                                    }`}
                                >
                                    {dayObj.day}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

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
                    setUpcomingEvent({
                        title: "SABRANG 2026: Annual Fest",
                        start_date: new Date(Date.now() + 86400000 * 3).toISOString(),
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
                    setNextBus({
                        routeNumber: "B101",
                        routeName: "JKLU ➔ Mansarovar",
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
                    setRecentPaper({
                        title: "Design Thinking & Innovation - PyQuestion",
                        course_code: "DE2022",
                        paper_type: "exam",
                        year: 2025
                    });
                }

                // 5. Populate recent updates
                setRecentUpdates([
                    { id: 1, type: 'event', title: 'Cyber Security registrations open', time: '2 hours ago' },
                    { id: 2, type: 'paper', title: 'Physics-II Endterm paper uploaded', time: '5 hours ago' },
                    { id: 3, type: 'announcement', title: 'Summer mess timings adjusted', time: '1 day ago' },
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
                <div className="w-8 h-8 rounded-full border-2 border-[#34446D]/10 border-t-[#34446D] animate-spin" />
            </div>
        );
    }

    // Colors mapping definitions
    const busColor = '#FBB940'; // Mango Loco
    const eventColor = '#F57EA3'; // Pink Paloma
    const paperColor = '#85D2FF'; // Aqua Fresca
    const complaintColor = '#9B365A'; // Complaints Maroon

    const desktopServices = [
        { 
            label: 'Bus Status', 
            title: 'Next Bus Arrival', 
            value: nextBus?.routeName || 'JKLU ➔ Mansarovar', 
            time: nextBus?.timings?.[0] || '10 min', 
            href: '/bus', 
            icon: Bus, 
            color: busColor, 
            btnText: 'Track Bus',
            bgGradient: 'from-[#FBB940]/10 to-transparent',
            borderColor: 'border-[#FBB940]/30'
        },
        { 
            label: 'Events Hub', 
            title: 'Upcoming Events', 
            value: upcomingEvent?.title || 'AI Workshop', 
            time: upcomingEvent?.start_date ? new Date(upcomingEvent.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Today, 5:00 PM', 
            href: '/events', 
            icon: PartyPopper, 
            color: eventColor, 
            btnText: 'Explore Events',
            bgGradient: 'from-[#F57EA3]/10 to-transparent',
            borderColor: 'border-[#F57EA3]/30'
        },
        { 
            label: 'Exam Papers', 
            title: 'Recent Papers', 
            value: recentPaper?.title.split(' - ')[0] || 'Design Thinking', 
            time: 'Uploaded', 
            href: '/learn/papers', 
            icon: FileText, 
            color: paperColor, 
            btnText: 'View Papers',
            bgGradient: 'from-[#85D2FF]/10 to-transparent',
            borderColor: 'border-[#85D2FF]/30'
        },
        { 
            label: 'Complaints', 
            title: 'Your Complaint', 
            value: '#C-2451', 
            time: 'In Progress', 
            href: '/complaints', 
            icon: MessageSquare, 
            color: complaintColor, 
            btnText: 'Track Status',
            bgGradient: 'from-[#9B365A]/10 to-transparent',
            borderColor: 'border-[#9B365A]/30'
        }
    ];

    return (
        <div className="w-full">
            {/* 1. Desktop Dashboard View (lg screens) */}
            <div className="hidden lg:flex flex-col gap-6 w-full animate-fadeIn">
                {/* 4 Brand Service Cards */}
                <div className="grid grid-cols-4 gap-5">
                    {desktopServices.map((srv) => (
                        <Link 
                            key={srv.label}
                            href={srv.href}
                            className={`glass-card p-5 flex flex-col min-h-[200px] border ${srv.borderColor} bg-gradient-to-b ${srv.bgGradient} relative overflow-hidden active:scale-98 transition-all duration-200 cursor-pointer group`}
                        >
                            {/* Top Icon container */}
                            <div className="flex items-center justify-between mb-4">
                                <div 
                                    style={{ backgroundColor: `${srv.color}15` }} 
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                >
                                    <srv.icon className="w-5 h-5" style={{ color: srv.color }} />
                                </div>
                            </div>
                            
                            {/* Card Content details */}
                            <div className="space-y-1 select-none">
                                <p className="text-[10px] font-bold text-[#666A7A]/70 uppercase tracking-wider">{srv.title}</p>
                                <h4 className="text-sm font-black text-[#34446D] font-display line-clamp-1 leading-snug">{srv.value}</h4>
                                <p className="text-lg font-black text-[#34446D] leading-none mt-1">{srv.time}</p>
                            </div>
                            
                            {/* Bottom Action Pill */}
                            <div className="mt-auto pt-3 flex items-center">
                                <span 
                                    style={{ color: srv.color, backgroundColor: `${srv.color}12` }}
                                    className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1 group-hover:opacity-90 group-hover:translate-x-0.5 transition-all"
                                >
                                    {srv.btnText} <span className="text-[10px] leading-none font-sans">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Highlights and Calendar Rows */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Today's Highlights (2 columns) */}
                    <div className="col-span-2 glass-card p-6 flex flex-col bg-white">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-display font-black text-base text-[#34446D]">Today's Highlights</h3>
                            <Link href="/events" className="text-xs font-bold text-[#F57EA3] hover:underline flex items-center gap-0.5 font-display">
                                View All <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
                            </Link>
                        </div>
                        
                        {/* List items matching the mockup */}
                        <div className="divide-y divide-[#34446D]/5">
                            {[
                                { text: 'Bus 4 arriving in 10 minutes at JKLU Gate', time: '9:10 AM', icon: Bus, color: busColor },
                                { text: 'Design Club Meeting at Creative Lab', time: '11:30 AM', icon: PartyPopper, color: eventColor },
                                { text: 'Operating Systems Notes uploaded', time: '8:45 AM', icon: FileText, color: paperColor }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
                                    <div className="flex items-center gap-3.5">
                                        <div 
                                            style={{ backgroundColor: `${item.color}15` }} 
                                            className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
                                        >
                                            <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                                        </div>
                                        <p className="text-sm font-bold text-[#34446D]">{item.text}</p>
                                    </div>
                                    <span className="text-xs text-[#666A7A] font-semibold">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Calendar Widget (1 column) */}
                    <div className="col-span-1">
                        <CalendarWidget />
                    </div>
                </div>
            </div>

            {/* 2. Mobile Dashboard View (lg:hidden) */}
            <div className="lg:hidden p-4 space-y-6 font-sans w-full">
                {/* Personalized Greeting with Illustration */}
                <div className="flex items-center justify-between mt-2 gap-4">
                    <div className="w-[38%] shrink-0 aspect-[4/3] flex items-center justify-center">
                        <img 
                            src="/illustrations/student-greeting.svg" 
                            alt="Nexus Student Greeting" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold tracking-tight text-[#34446D] font-display leading-tight">
                            Hey, {user ? user.name.split(' ')[0] : 'Student'}! 👋
                        </h2>
                        <p className="text-xs text-[#666A7A] font-semibold mt-1.5 leading-relaxed">
                            Here is what you need to know on campus today.
                        </p>
                    </div>
                </div>

                {/* Universal Search */}
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-0 bg-[#34446D]/5 rounded-[14px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex items-center bg-white border border-[#34446D]/10 hover:border-[#34446D]/20 focus-within:border-[#34446D]/30 rounded-[14px] px-4 py-3 shadow-[0_2px_8px_rgba(52,68,109,0.01)] transition-all">
                        <Search className="w-4 h-4 text-[#34446D]/35 shrink-0" />
                        <input
                            type="text"
                            placeholder="Find bus timings, papers, events..."
                            className="w-full bg-transparent border-none text-sm text-[#34446D] placeholder-[#666A7A]/40 focus:ring-0 focus:outline-none px-3 font-semibold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="text-xs font-bold text-[#F57EA3] hover:text-[#F57EA3]/80 shrink-0 transition-colors uppercase tracking-wider font-display">
                            Search
                        </button>
                    </div>
                </form>

                {/* Quick Services */}
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#34446D]/40 font-display">Quick Services</h3>
                    <div className="grid grid-cols-4 gap-2.5">
                        {[
                            { label: 'Bus Status', icon: Bus, href: '/bus', borderColor: 'border-[#FBB940]', iconColor: 'text-[#FBB940]' },
                            { label: 'Events Hub', icon: PartyPopper, href: '/events', borderColor: 'border-[#F57EA3]', iconColor: 'text-[#F57EA3]' },
                            { label: 'Exam Papers', icon: FileText, href: '/learn/papers', borderColor: 'border-[#85D2FF]', iconColor: 'text-[#85D2FF]' },
                            { label: 'Complaints', icon: MessageSquare, href: '/complaints', borderColor: 'border-[#9B365A]', iconColor: 'text-[#9B365A]' }
                        ].map((srv) => (
                            <Link 
                                key={srv.label} 
                                href={srv.href}
                                className={`flex flex-col items-center justify-center pt-4 pb-3 px-2 text-center bg-white border-2 ${srv.borderColor} rounded-[24px] shadow-[0_4px_16px_rgba(52,68,109,0.015)] hover:shadow-[0_8px_24px_rgba(52,68,109,0.03)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer`}
                            >
                                <div className="w-14 h-14 rounded-[20px] bg-background flex items-center justify-center mb-1">
                                    <srv.icon className={`w-7 h-7 ${srv.iconColor} stroke-[1.8]`} />
                                </div>
                                <span className="text-[11px] font-bold text-[#34446D] font-display tracking-tight mt-1 leading-tight">{srv.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Today's Highlights */}
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#34446D]/40 font-display">Today's Highlights</h3>
                    <div className="space-y-2.5">
                        {nextBus && (
                            <Link href="/bus" className="glass-card p-3.5 flex items-center justify-between border-2 border-[#FBB940] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FBB940]/10 flex items-center justify-center text-[#FBB940]">
                                        <Bus className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#34446D] leading-snug line-clamp-1 font-display">{nextBus.routeName}</p>
                                        <p className="text-[10px] text-[#666A7A] mt-0.5 font-semibold">
                                            Departure: {nextBus.timings?.[0] || 'Scheduled'} • ETA: {nextBus.eta || '--'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#34446D]/35" />
                            </Link>
                        )}

                        {announcement && (
                            <div className="glass-card p-3.5 flex items-center justify-between border-2 border-[#9B365A] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#9B365A]/10 flex items-center justify-center text-[#9B365A]">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#34446D] leading-snug line-clamp-1 font-display">{announcement.title}</p>
                                        <p className="text-[10px] text-[#666A7A] mt-0.5 font-semibold">
                                            Campus Admin • {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Today'}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-[#9B365A] text-white font-display shrink-0 mr-1">
                                    Important
                                </span>
                            </div>
                        )}

                        {upcomingEvent && (
                            <Link href="/events" className="glass-card p-3.5 flex items-center justify-between border-2 border-[#F57EA3] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F57EA3]/10 flex items-center justify-center text-[#F57EA3]">
                                        <PartyPopper className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#34446D] leading-snug line-clamp-1 font-display">{upcomingEvent.title}</p>
                                        <p className="text-[10px] text-[#666A7A] mt-0.5 font-semibold">
                                            {upcomingEvent.venue || 'Campus'} • {upcomingEvent.club_name}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#34446D]/35" />
                            </Link>
                        )}

                        {recentPaper && (
                            <Link href="/learn/papers" className="glass-card p-3.5 flex items-center justify-between border-2 border-[#85D2FF] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#85D2FF]/10 flex items-center justify-center text-[#85D2FF]">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#34446D] leading-snug line-clamp-1 font-display">{recentPaper.title}</p>
                                        <p className="text-[10px] text-[#666A7A]/75 mt-0.5 font-semibold">
                                            {recentPaper.course_code} • Type: {recentPaper.paper_type}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#34446D]/35" />
                            </Link>
                        )}
                    </div>
                </section>

                {/* Recent Updates */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#34446D]/40 font-display">Recent Updates</h3>
                        <Link href="/events" className="text-xs font-bold text-[#34446D] hover:underline flex items-center gap-0.5 font-display">
                            See all updates <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex gap-3.5 pb-2.5 -mx-4 px-4 scrollbar-hide no-scrollbar snap-x">
                        {recentUpdates.map((update) => {
                            let description = "Keep up with the latest campus notifications and updates.";
                            let borderClass = "border-2 border-[#85D2FF]";
                            let badgeClass = "bg-[#85D2FF] text-white font-display";

                            if (update.type === 'event') {
                                description = "Register for the cyber security bootcamp. Team sizes of 2-4. Exciting prizes!";
                                borderClass = "border-2 border-[#F57EA3]";
                                badgeClass = "bg-[#F57EA3] text-white font-display";
                            } else if (update.type === 'paper') {
                                description = "Previous year question papers for Physics-II (PH1002) uploaded. Approved by Faculty.";
                                borderClass = "border-2 border-[#85D2FF]";
                                badgeClass = "bg-[#85D2FF] text-white font-display";
                            } else if (update.type === 'announcement') {
                                description = "Breakfast, Lunch, and Dinner timings updated. Check notice boards.";
                                borderClass = "border-2 border-[#9B365A]";
                                badgeClass = "bg-[#9B365A] text-white font-display";
                            }

                            return (
                                <div key={update.id} className={`snap-center shrink-0 w-[265px] bg-white border ${borderClass} p-4 rounded-[20px] shadow-[0_2px_8px_rgba(52,68,109,0.01)] flex flex-col justify-between hover:scale-[1.01] transition-transform`}>
                                    <div>
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                                {update.type}
                                            </span>
                                            <span className="text-[10px] text-[#8E92A6] font-bold">{update.time}</span>
                                        </div>
                                        <h4 className="font-bold text-[#34446D] text-sm leading-snug line-clamp-1 font-display">{update.title}</h4>
                                        <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed text-[#666A7A] font-semibold">{description}</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-[#34446D]/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-[#666A7A] flex items-center gap-1">
                                            Latest Update
                                        </span>
                                        <Link href={update.type === 'event' ? '/events' : update.type === 'paper' ? '/learn/papers' : '/profile'} className="flex items-center gap-1 text-xs font-bold text-[#34446D] font-display">
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
