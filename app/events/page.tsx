'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { 
    Calendar, MapPin, Clock, Search, ChevronRight, Share2, 
    Sparkles, Trophy, Palette, Cpu, Users, Award, Heart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CampusEvent {
    _id: string;
    title: string;
    description: string;
    longDescription?: string;
    date: string;
    start_date?: string;
    endDate?: string;
    time?: string;
    venue: string;
    club_name?: string;
    clubId?: { name: string; slug: string };
    council_name?: string;
    image_url?: string;
    image?: string;
    category: string;
    registeredParticipants?: any[];
}

export default function EventsPortal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams?.get('search') || '';

    const [events, setEvents] = useState<CampusEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [activeCategory, setActiveCategory] = useState('all');
    const [clubs, setClubs] = useState<any[]>([]);

    useEffect(() => {
        const fetchEventsData = async () => {
            try {
                // Fetch clubs
                const clubsRes = await api.get('/api/council/clubs').catch(() => null);
                if (clubsRes?.data) setClubs(clubsRes.data.clubs || clubsRes.data || []);

                // Fetch events
                const eventsRes = await api.get('/api/council/events?status=approved').catch(() => null);
                const items = eventsRes?.data?.items || eventsRes?.data?.events || eventsRes?.data || [];
                
                if (items.length > 0) {
                    setEvents(items);
                } else {
                    throw new Error("No events returned, fallback to mock");
                }
            } catch (error) {
                // Fallback mock events
                const mockEvents: CampusEvent[] = [
                    {
                        _id: "evt-1",
                        title: "SABRANG 2026: Cultural Gala Night",
                        description: "Experience the grand cultural event of the year, featuring folk dances, rock bands, and visual arts installations by students of JKLU.",
                        longDescription: "Sabrang is the annual flagship socio-cultural fest of JK Lakshmipat University. It provides a unique showcase for music, theatrical arts, modern choreography, and digital crafts.",
                        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                        venue: "JKLU Amphitheatre",
                        club_name: "Spic Macay & Music Club",
                        council_name: "Cultural Council",
                        image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
                        category: "cultural"
                    },
                    {
                        _id: "evt-2",
                        title: "Inter-University Basketball Championship",
                        description: "Cheer for the JKLU Titans in the tournament finals against state-level universities. Energy, sportsmanship, and action guaranteed.",
                        longDescription: "The JKLU basketball tournament invites regional engineering and design schools to play in an all-out tournament to earn the annual champion trophy.",
                        date: new Date().toISOString(), // Today
                        venue: "JKLU Sports Arena",
                        club_name: "Sports Committee",
                        council_name: "Sports Council",
                        image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80",
                        category: "sports"
                    },
                    {
                        _id: "evt-3",
                        title: "Cyber Security Bootcamp & CTF",
                        description: "An intensive 24-hour ethical hacking workshop followed by a Capture the Flag contest. Perfect for beginners and advanced coders.",
                        longDescription: "Learn web vulnerability assessment, security scanning, penetration testing, and flags retrieval techniques in a gamified arena led by cybersecurity professionals.",
                        date: new Date(Date.now() + 86400000 * 5).toISOString(),
                        venue: "Block-I Auditorium",
                        club_name: "Robotix & Code Club",
                        council_name: "Technical Council",
                        image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                        category: "technical"
                    },
                    {
                        _id: "evt-4",
                        title: "Design Thinking Exhibition",
                        description: "Discover innovative product mockups and UI research portfolios crafted by the B.Des batch of JKLU. Open critique sessions.",
                        longDescription: "Students present their design solutions to real-world social and industrial challenges. Industry leads will join for critiques.",
                        date: new Date(Date.now() + 86400000 * 10).toISOString(),
                        venue: "Institute of Design Studio",
                        club_name: "Design Club",
                        council_name: "Technical Council",
                        image_url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
                        category: "design"
                    }
                ];
                setEvents(mockEvents);
            } finally {
                setLoading(false);
            }
        };

        fetchEventsData();
    }, []);

    const categories = [
        { id: 'all', label: 'All', icon: Sparkles },
        { id: 'technical', label: 'Tech', icon: Cpu },
        { id: 'cultural', label: 'Culture', icon: Palette },
        { id: 'sports', label: 'Sports', icon: Trophy },
        { id: 'design', label: 'Design', icon: Award }
    ];

    const filtered = events.filter(evt => {
        const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (evt.club_name && evt.club_name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (activeCategory === 'all') return matchesSearch;
        return matchesSearch && evt.category === activeCategory;
    });

    // Check dates relative to today
    const today = new Date().toDateString();
    const todayEvents = filtered.filter(evt => new Date(evt.date || evt.start_date!).toDateString() === today);
    const featuredEvents = filtered.filter(evt => evt.category === 'cultural' || evt.category === 'technical').slice(0, 2);
    const upcomingEvents = filtered.filter(evt => new Date(evt.date || evt.start_date!).toDateString() !== today);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#FF8400] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-background relative overflow-x-hidden p-4 space-y-6 font-sans">
            {/* Header */}
            <div className="mt-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display">Events Hub</h1>
                <p className="text-xs text-[#5B6077] font-semibold mt-0.5">Explore campus events, club activities, and register online</p>
            </div>

            {/* Search */}
            <div className="relative group">
                <div className="relative flex items-center bg-white border border-[#0B0828]/10 hover:border-[#0B0828]/20 focus-within:border-[#0B0828]/35 rounded-[14px] px-4 py-2.5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all">
                    <Search className="w-4 h-4 text-[#0B0828]/35 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by event title, host club..."
                        className="w-full bg-transparent border-none text-sm text-[#0B0828] placeholder-[#5B6077]/40 focus:ring-0 focus:outline-none px-3 font-semibold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Carousel */}
            <div className="overflow-x-auto flex gap-2 pb-1 -mx-4 px-4 scrollbar-hide no-scrollbar">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${isActive 
                                ? 'bg-[#FF8400]/10 text-[#FF8400] border-[#FF8400]/25 shadow-sm font-display' 
                                : 'bg-white text-[#5B6077] border-black/5 hover:border-black/10 hover:bg-black/[0.01]'}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Featured Events (Carousel Slider) */}
            {featuredEvents.length > 0 && activeCategory === 'all' && (
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Featured Events</h3>
                    <div className="overflow-x-auto flex gap-4 pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar snap-x">
                        {featuredEvents.map((evt) => (
                            <div 
                                key={evt._id} 
                                onClick={() => router.push(`/events/${evt._id}`)}
                                className="snap-center shrink-0 w-[280px] bg-white rounded-[20px] overflow-hidden border border-[#0B0828]/5 hover:border-[#0B0828]/10 hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                <div className="h-32 w-full relative bg-black/5">
                                    <img 
                                        src={evt.image_url || "/logos/JKLU Coloured.png"} 
                                        alt={evt.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-[#FF8400] text-white shadow-sm font-display">
                                        {evt.category}
                                    </span>
                                </div>
                                <div className="p-4 space-y-1.5">
                                    <h4 className="font-bold text-[#0B0828] text-sm leading-tight line-clamp-1 font-display">{evt.title}</h4>
                                    <p className="text-[11px] text-[#5B6077] font-semibold flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-[#FF8400]" />
                                        {new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {evt.venue}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Today's Schedule */}
            {todayEvents.length > 0 && (
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#FF8400] flex items-center gap-1.5 font-display">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8400] animate-ping" /> Today's Highlights
                    </h3>
                    <div className="space-y-3">
                        {todayEvents.map((evt) => (
                            <div 
                                key={evt._id} 
                                onClick={() => router.push(`/events/${evt._id}`)}
                                className="bg-white border border-[#FF8400]/25 p-4 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)] hover:scale-[1.005] transition-all cursor-pointer flex gap-4"
                            >
                                <div className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0 relative bg-background border border-black/5">
                                    <img src={evt.image_url || "/logos/JKLU Coloured.png"} alt={evt.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#FF8400] font-display">{evt.club_name}</span>
                                        <h4 className="font-bold text-[#0B0828] text-sm leading-tight truncate font-display">{evt.title}</h4>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] mt-2 font-bold opacity-80">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF8400]" />{evt.venue}</span>
                                        <span className="text-[#FF8400] uppercase font-black tracking-widest text-[8px] font-display">Today</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Events List */}
            <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Upcoming Campus Events</h3>
                <div className="space-y-3">
                    {upcomingEvents.map((evt) => (
                        <div 
                            key={evt._id} 
                            onClick={() => router.push(`/events/${evt._id}`)}
                            className="glass-card p-4 border border-black/5 hover:border-[#0B0828]/10 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all cursor-pointer flex gap-4"
                        >
                            <div className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0 relative bg-black/5 border border-black/5">
                                <img src={evt.image_url || "/logos/JKLU Coloured.png"} alt={evt.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#5B6077] font-display">{evt.club_name || evt.category}</span>
                                    <h4 className="font-bold text-[#0B0828] text-sm leading-tight truncate font-display">{evt.title}</h4>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-[#5B6077] mt-2 font-semibold">
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF8400]" />{evt.venue}</span>
                                    <span className="font-bold text-[#0B0828] font-display">
                                        {new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                        <div className="glass-card p-6 text-center text-[#5B6077] text-xs font-bold border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                            No upcoming events listed
                        </div>
                    )}
                </div>
            </section>
            
            {/* Club Pages shortcuts */}
            {clubs.length > 0 && (
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Explore Clubs</h3>
                    <div className="overflow-x-auto flex gap-3 pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
                        {clubs.slice(0, 5).map((club, idx) => (
                            <Link 
                                key={club.slug || idx} 
                                href={`/council/clubs/${club.slug}`}
                                className="glass-card px-4 py-3 border border-black/5 hover:border-[#0B0828]/10 shadow-[0_2px_6px_rgba(11,8,40,0.01)] transition-all flex items-center gap-2.5 shrink-0"
                            >
                                <div className="w-6 h-6 rounded-lg bg-[#FF8400]/10 flex items-center justify-center text-[10px] font-bold text-[#FF8400] font-display">
                                    {club.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-[#5B6077] font-display">{club.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-black/20" />
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
