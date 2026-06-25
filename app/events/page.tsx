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
            <div className="min-h-screen flex items-center justify-center bg-nexus-black">
                <div className="w-8 h-8 rounded-full border-2 border-nexus-camel/20 border-t-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-nexus-black relative overflow-x-hidden p-4 space-y-6">
            <div className="glow-orb w-[300px] h-[300px] -top-20 -right-20 bg-blue-500" style={{ opacity: 0.05 }} />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-black tracking-tight text-nexus-linen">Events Hub</h1>
                <p className="text-xs text-nexus-camel font-medium mt-0.5">Explore campus events, club activities, and register online</p>
            </div>

            {/* Search */}
            <div className="relative group">
                <div className="relative flex items-center bg-white/5 border border-nexus-camel/10 hover:border-nexus-camel/20 focus-within:border-blue-500/30 rounded-2xl px-4 py-2.5 backdrop-blur-xl transition-all">
                    <Search className="w-4 h-4 text-white/30 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by event title, host club..."
                        className="w-full bg-transparent border-none text-sm text-nexus-linen placeholder-white/20 focus:ring-0 focus:outline-none px-3"
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
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-md' 
                                : 'bg-white/5 text-nexus-camel border-white/5 hover:border-white/10'}`}
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
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/30">Featured Events</h3>
                    <div className="overflow-x-auto flex gap-4 pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar snap-x">
                        {featuredEvents.map((evt) => (
                            <div 
                                key={evt._id} 
                                onClick={() => router.push(`/events/${evt._id}`)}
                                className="snap-center shrink-0 w-[280px] glass-card overflow-hidden border border-nexus-camel/5 hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                <div className="h-32 w-full relative">
                                    <img 
                                        src={evt.image_url || "/white_jklu_logo.png"} 
                                        alt={evt.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-blue-500 text-white shadow-lg">
                                        {evt.category}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2">
                                    <h4 className="font-bold text-nexus-linen text-sm leading-tight line-clamp-1">{evt.title}</h4>
                                    <p className="text-[11px] text-white/30 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-blue-400" />
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
                    <h3 className="text-xs font-black uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" /> Today's Highlights
                    </h3>
                    <div className="space-y-3">
                        {todayEvents.map((evt) => (
                            <div 
                                key={evt._id} 
                                onClick={() => router.push(`/events/${evt._id}`)}
                                className="glass-card p-4 border border-orange-500/20 bg-orange-500/[0.01] hover:border-orange-500/30 transition-all cursor-pointer flex gap-4"
                            >
                                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative bg-nexus-black/40 border border-white/5">
                                    <img src={evt.image_url || "/white_jklu_logo.png"} alt={evt.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[8px] font-black uppercase tracking-wider text-orange-400">{evt.club_name}</span>
                                        <h4 className="font-bold text-nexus-linen text-sm leading-tight truncate">{evt.title}</h4>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-white/30 mt-2">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" />{evt.venue}</span>
                                        <span className="font-bold text-nexus-linen">Today</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Events List */}
            <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/30">Upcoming Campus Events</h3>
                <div className="space-y-3">
                    {upcomingEvents.map((evt) => (
                        <div 
                            key={evt._id} 
                            onClick={() => router.push(`/events/${evt._id}`)}
                            className="glass-card p-4 border border-nexus-camel/5 hover:border-blue-500/20 hover:bg-white/[0.01] transition-all cursor-pointer flex gap-4"
                        >
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative bg-nexus-black/40 border border-white/5">
                                <img src={evt.image_url || "/white_jklu_logo.png"} alt={evt.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <span className="text-[8px] font-black uppercase tracking-wider text-nexus-camel">{evt.club_name || evt.category}</span>
                                    <h4 className="font-bold text-nexus-linen text-sm leading-tight truncate">{evt.title}</h4>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-white/30 mt-2">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" />{evt.venue}</span>
                                    <span className="font-bold text-nexus-khaki">
                                        {new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                        <div className="glass-card p-6 text-center text-nexus-camel text-xs font-bold border border-nexus-camel/5">
                            No upcoming events listed
                        </div>
                    )}
                </div>
            </section>
            
            {/* Club Pages shortcuts */}
            {clubs.length > 0 && (
                <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/30">Explore Clubs</h3>
                    <div className="overflow-x-auto flex gap-3 pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
                        {clubs.slice(0, 5).map((club, idx) => (
                            <Link 
                                key={club.slug || idx} 
                                href={`/council/clubs/${club.slug}`}
                                className="glass-card px-4 py-3 border border-nexus-camel/5 hover:border-white/10 transition-all flex items-center gap-2.5 shrink-0"
                            >
                                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px] font-bold text-blue-400">
                                    {club.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-nexus-khaki">{club.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-white/10" />
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
