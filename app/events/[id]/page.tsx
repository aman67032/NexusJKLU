'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { 
    Calendar, MapPin, Clock, ArrowLeft, Share2, Users, 
    CheckCircle2, AlertCircle, Sparkles, Building, Image as ImageIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

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
    maxParticipants?: number;
    registeredParticipants?: { userId: string }[];
}

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const eventId = Array.isArray(params.id) ? params.id[0] : params.id || '';
    
    const [event, setEvent] = useState<CampusEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registered, setRegistered] = useState(false);
    
    const fetchEventDetails = async () => {
        if (!eventId) return;
        try {
            const res = await api.get(`/api/council/events/${eventId}`);
            const data = res.data;
            setEvent(data);
            
            // Check if user is already registered
            if (user && data.registeredParticipants) {
                const isReg = data.registeredParticipants.some(
                    (p: any) => p.userId === user.id || p.userId?._id === user.id
                );
                setRegistered(isReg);
            }
        } catch (error) {
            console.warn('Fetch event details offline fallback');
            // Fallback mock details depending on param ID

            const mockEvents: { [key: string]: CampusEvent } = {
                "evt-1": {
                    _id: "evt-1",
                    title: "SABRANG 2026: Cultural Gala Night",
                    description: "Experience the grand cultural event of the year, featuring folk dances, rock bands, and visual arts installations by students of JKLU.",
                    longDescription: "Sabrang is the annual flagship socio-cultural fest of JK Lakshmipat University. It provides a unique showcase for music, theatrical arts, modern choreography, and digital crafts. Meet students from 30+ regional colleges and watch a headline rock performance at the closing ceremony.",
                    date: new Date(Date.now() + 86400000).toISOString(),
                    venue: "JKLU Amphitheatre",
                    club_name: "Spic Macay & Music Club",
                    council_name: "Cultural Council",
                    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
                    category: "cultural",
                    maxParticipants: 500,
                    registeredParticipants: []
                },
                "evt-2": {
                    _id: "evt-2",
                    title: "Inter-University Basketball Championship",
                    description: "Cheer for the JKLU Titans in the tournament finals against state-level universities. Energy, sportsmanship, and action guaranteed.",
                    longDescription: "The JKLU basketball tournament invites regional engineering and design schools to play in an all-out tournament to earn the annual champion trophy. Join the final match to support the home team Titans and enjoy half-time food trucks and giveaways.",
                    date: new Date().toISOString(),
                    venue: "JKLU Sports Arena",
                    club_name: "Sports Committee",
                    council_name: "Sports Council",
                    image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
                    category: "sports",
                    maxParticipants: 200,
                    registeredParticipants: []
                },
                "evt-3": {
                    _id: "evt-3",
                    title: "Cyber Security Bootcamp & CTF",
                    description: "An intensive 24-hour ethical hacking workshop followed by a Capture the Flag contest. Perfect for beginners and advanced coders.",
                    longDescription: "Learn web vulnerability assessment, security scanning, penetration testing, and flags retrieval techniques in a gamified arena led by cybersecurity professionals. Winners of the CTF will receive cash rewards and certificate endorsements.",
                    date: new Date(Date.now() + 86400000 * 5).toISOString(),
                    venue: "Block-I Auditorium",
                    club_name: "Robotix & Code Club",
                    council_name: "Technical Council",
                    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
                    category: "technical",
                    maxParticipants: 100,
                    registeredParticipants: []
                }
            };
            const mock = mockEvents[eventId] || mockEvents["evt-1"];
            setEvent(mock);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, [eventId, user]);

    const handleRegister = async () => {
        if (!eventId) return;
        if (!user) {
            toast.error('Please login to register for events');
            router.push('/auth/login?redirect=' + pathname);
            return;
        }

        setRegistering(true);
        try {
            await api.post(`/api/council/events/${eventId}/register`);
            setRegistered(true);
            toast.success('Successfully registered for this event!');
            fetchEventDetails();
        } catch (error: any) {
            console.error('Registration failed:', error);
            // Simulate success if mocking
            if (eventId.startsWith('evt-')) {
                setRegistered(true);
                toast.success('Successfully registered! (Simulated)');
            } else {
                toast.error(error.response?.data?.error || 'Registration failed. Try again.');
            }
        } finally {
            setRegistering(false);
        }
    };


    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title || 'Campus Event',
                text: event?.description || 'Check out this event at JKLU!',
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nexus-black">
                <div className="w-8 h-8 rounded-full border-2 border-nexus-camel/20 border-t-blue-500 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-nexus-black p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-nexus-linen mb-2">Event Not Found</h2>
                <p className="text-nexus-camel text-sm mb-6">This event may have been cancelled or moved.</p>
                <button onClick={() => router.back()} className="px-5 py-2.5 bg-white/5 border border-nexus-camel/20 rounded-xl text-nexus-linen hover:bg-white/10 text-sm font-semibold transition-all">
                    Go Back
                </button>
            </div>
        );
    }

    // Mock gallery images
    const eventGallery = [
        event.image_url,
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop&q=60"
    ].filter(Boolean);

    return (
        <div className="min-h-full pb-20 bg-nexus-black relative overflow-x-hidden">
            <Toaster position="top-center" />
            
            {/* Header Cover Banner */}
            <div className="h-64 w-full relative shrink-0">
                <img 
                    src={event.image_url || "/white_jklu_logo.png"} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-black via-nexus-black/40 to-transparent" />
                
                {/* Floating back & share triggers */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
                    <button 
                        onClick={() => router.back()} 
                        className="p-2.5 rounded-full bg-nexus-black/60 border border-white/10 text-nexus-linen backdrop-blur-md hover:bg-nexus-black transition-all active:scale-90"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleShare} 
                        className="p-2.5 rounded-full bg-nexus-black/60 border border-white/10 text-nexus-linen backdrop-blur-md hover:bg-nexus-black transition-all active:scale-90"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500 text-white w-fit border border-blue-400/20">
                        {event.category}
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-nexus-linen leading-tight drop-shadow-md">{event.title}</h1>
                </div>
            </div>

            {/* Event Body info */}
            <div className="p-4 space-y-6 relative z-10">
                
                {/* Highlights (Date, Time, Venue, Organizer) */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-nexus-camel/5">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0"><Calendar className="w-4 h-4" /></div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Date</p>
                            <p className="font-bold text-nexus-khaki text-xs truncate">
                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-nexus-camel/5">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0"><Clock className="w-4 h-4" /></div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Time</p>
                            <p className="font-bold text-nexus-khaki text-xs truncate">
                                {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-nexus-camel/5 col-span-2">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0"><MapPin className="w-4 h-4" /></div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Venue</p>
                            <p className="font-bold text-nexus-khaki text-xs truncate">{event.venue}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-nexus-camel/5 col-span-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0"><Building className="w-4 h-4" /></div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">Organizer</p>
                            <p className="font-bold text-nexus-khaki text-xs truncate">{event.club_name || 'Campus Council'}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/30">About Event</h3>
                    <div className="glass-card p-4 border border-nexus-camel/5">
                        <p className="text-xs text-nexus-camel leading-relaxed whitespace-pre-wrap">
                            {event.longDescription || event.description}
                        </p>
                    </div>
                </div>

                {/* Event Gallery */}
                {eventGallery.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /> Event Highlights
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {eventGallery.map((imgUrl, idx) => (
                                <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 relative group">
                                    <img src={imgUrl} alt={`gallery-${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sticky Action Registration Button */}
                <div className="fixed bottom-20 inset-x-0 px-4 z-40 max-w-[390px] mx-auto pointer-events-auto">
                    {registered ? (
                        <div className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 backdrop-blur-md shadow-2xl">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-black uppercase tracking-wider">Registered Successfully</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleRegister}
                            disabled={registering}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-nexus-linen text-sm font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                        >
                            {registering ? 'Processing...' : 'Register for Event'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
