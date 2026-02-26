'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Drama, Mic, Film, Star, Users, Video, Calendar, MapPin, Heart, Sparkles, User, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function DramaClubPage() {
    const { user } = useAuth();
        const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [joined, setJoined] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        setMounted(true);
                fetchClubEvents();
    }, []);

    const fetchClubEvents = async () => {
        try {
            const response = await api.get('/api/council/clubs/drama-club');
            if (response.data.club && response.data.club.events) {
                setEvents(response.data.club.events);
            }
        } catch (error) {
            console.error('Error fetching club events:', error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleJoin = () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        setJoined(true);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#050000] text-red-50 font-sans selection:bg-red-900 selection:text-gold-200 overflow-x-hidden relative">
            {/* Spotlight Background Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-900/20 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[100px] opacity-40"></div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("/noise.png")' }}></div>
            </div>

            
            {/* --- HERO SECTION: THE STAGE --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    {/* Spotlight Beam */}
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-1 h-[300px] bg-gradient-to-b from-white/0 via-white/10 to-transparent blur-md"></div>

                    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-red-800 rounded-full animate-spin-slow opacity-30"></div>
                        <Image
                            src="/logos/NakabNama (With BG).png"
                            alt="Drama Club Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-black tracking-tighter mb-2 font-serif text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-red-600 drop-shadow-lg"
                >
                    NAKAABNAMA
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "200px" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mb-6 mx-auto"
                ></motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl italic font-light text-red-200/80 mb-12 tracking-wide"
                >
                    "Where Stories Come <span className="text-yellow-500 font-semibold">Alive</span>"
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-8 py-4 rounded-sm border ${joined ? 'border-green-600 text-green-500' : 'border-red-600 text-red-500'} font-serif font-bold text-lg tracking-widest uppercase hover:bg-red-900/20 transition-all duration-500`}
                    >
                        <span className="absolute inset-0 bg-red-600/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                        {joined ? 'Audition Confirmed' : 'Take the Stage'}
                    </button>
                    <button className="px-8 py-4 text-yellow-500/80 hover:text-yellow-400 font-serif font-bold tracking-widest uppercase border-b border-transparent hover:border-yellow-500/50 transition-all">
                        View Repertoire
                    </button>
                </motion.div>
            </div>

            {/* --- ACT I: THE VISION --- */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-900/20 to-yellow-900/20 blur-xl rounded-full"></div>
                        <h2 className="relative text-4xl md:text-5xl font-serif font-bold mb-6 text-nexus-linen">
                            <span className="text-red-600 text-6xl block mb-2">"</span>
                            To inspire students to explore emotions, stories, and perspectives.
                        </h2>
                        <p className="text-lg text-red-100/60 leading-relaxed font-light mb-8">
                            The Drama Club is a space for students to express themselves, explore emotions, and bring stories to life on stage. From acting and scriptwriting to direction and stage design, we encourage creativity, teamwork, and confidence.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <ActivityItem icon={<Mic />} text="Nukkad Naatak" />
                            <ActivityItem icon={<Film />} text="Movie Night" />
                            <ActivityItem icon={<Users />} text="Workshops" />
                            <ActivityItem icon={<PlayCircle />} text="Stage Plays" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-8">
                            <PosterCard title="Manotsav" image="/Clubs/drama_club/poster1.jpg" color="red" />
                            <PosterCard title="Mentor Day" image="/Clubs/drama_club/poster2.jpg" color="yellow" />
                        </div>
                        <div className="space-y-4">
                            <PosterCard title="Convocation" image="/Clubs/drama_club/poster3.jpg" color="orange" />
                            <PosterCard title="IPL Auction" image="/Clubs/drama_club/poster4.jpg" color="red" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ACT II: CAST & CREW (Leadership) --- */}
            <section className="relative z-10 py-24 bg-gradient-to-b from-transparent to-red-950/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-yellow-500 mb-2">CAST & CREW</h2>
                        <div className="w-12 h-1 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-10">
                        {/* Chair */}
                        <div className="bg-nexus-black/40 border border-red-900/50 p-6 rounded-xl flex flex-col items-center text-center group hover:bg-red-900/10 transition-colors">
                            <div className="w-24 h-24 rounded-full bg-slate-900 mb-4 border-2 border-red-700 overflow-hidden">
                                <img
                                    src="/Photoes ID CARD Student Council/Madhav Garg (Drama Club Chair).jpeg"
                                    alt="Madhav Garg"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-nexus-linen mb-1">Madhav Garg</h3>
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Chairperson</p>
                        </div>

                        {/* Co-Chair */}
                        <div className="bg-nexus-black/40 border border-red-900/50 p-6 rounded-xl flex flex-col items-center text-center group hover:bg-red-900/10 transition-colors">
                            <div className="w-24 h-24 rounded-full bg-slate-900 mb-4 border-2 border-red-700 flex items-center justify-center">
                                <User className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-nexus-linen mb-1">Gauri Singhi</h3>
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Co-Chairperson</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ACT III: SHOWTIME (Events) --- */}
            <section className="relative z-10 py-24 max-w-6xl mx-auto px-4">
                <div className="flex items-end justify-between mb-12 border-b border-red-900/30 pb-4">
                    <h2 className="text-4xl font-serif font-bold text-nexus-linen">UPCOMING SHOWS</h2>
                    <span className="text-red-500 font-mono text-sm tracking-widest">SEASON 2026</span>
                </div>

                <div className="mt-12">
                    {loadingEvents ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <ClubEventCard
                                    key={event.id}
                                    id={event.id}
                                    title={event.title}
                                    date={event.start_date}
                                    venue={event.venue}
                                    imageUrl={event.image_url}
                                    status={event.status}
                                    desc={event.description}
                                    color="text-red-500"
                                    bg="bg-red-900/20"
                                    border="group-hover:border-red-600/50"
                                    is_enrolled={event.is_enrolled}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-red-950/20 rounded-xl border border-dashed border-red-900/30">
                            <Drama className="w-12 h-12 text-red-800 mx-auto mb-4" />
                            <p className="text-red-500/60 font-medium">No shows currently listed for this season.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer decoration */}
            <div className="h-40 bg-gradient-to-t from-[#1a0505] to-transparent"></div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function ActivityItem({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 p-3 bg-red-950/30 border border-red-900/30 rounded-lg">
            <div className="text-yellow-500">{icon}</div>
            <span className="text-red-100 font-medium">{text}</span>
        </div>
    );
}

function PosterCard({ title, color }: any) {
    // Placeholder for actual images using gradients for now
    const bgColors: any = {
        red: "from-red-900 to-red-950",
        yellow: "from-yellow-900 to-yellow-950",
        orange: "from-orange-900 to-orange-950"
    };

    return (
        <div className={`aspect-[3/4] rounded-lg bg-gradient-to-br ${bgColors[color]} border border-nexus-camel/10 p-4 flex flex-col justify-end relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shadow-xl`}>
            <div className="absolute inset-0 bg-nexus-black/20 group-hover:bg-transparent transition-colors"></div>
            <Drama className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/10 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-nexus-khaki mb-1 block">Production</span>
                <h4 className="text-lg font-serif font-bold text-nexus-linen leading-tight">{title}</h4>
            </div>
        </div>
    );
}

function LeaderCard({ role, name, quote, color }: any) {
    const border = color === 'red' ? 'border-red-600' : 'border-yellow-500';
    const text = color === 'red' ? 'text-red-500' : 'text-yellow-500';

    return (
        <div className="relative group w-80">
            <div className={`absolute inset-0 bg-gradient-to-b ${color === 'red' ? 'from-red-600/20' : 'from-yellow-500/20'} to-transparent rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl`}></div>

            <div className={`relative h-96 border-x border-t ${border} rounded-t-full bg-[#0a0202] flex flex-col items-center justify-end pb-8 overflow-hidden`}>
                <div className="absolute top-12 inset-x-8 bottom-0 border border-nexus-camel/10 rounded-t-full"></div>

                {/* Silhouette Placeholder */}
                <User className={`w-32 h-32 ${text} opacity-80 mb-6`} />

                <h3 className="text-2xl font-serif font-bold text-nexus-linen mb-1">{name}</h3>
                <p className={`text-xs font-bold tracking-[0.2em] uppercase ${text} mb-4`}>{role}</p>
                <p className="text-nexus-camel italic text-sm px-8 text-center">"{quote}"</p>
            </div>
            <div className={`h-1 w-full bg-gradient-to-r from-transparent via-${color === 'red' ? 'red-600' : 'yellow-500'} to-transparent`}></div>
        </div>
    );
}

function EventTicket({ title, date, desc, type }: any) {
    return (
        <div className="flex flex-col md:flex-row bg-[#1a0505] border border-red-900/30 hover:border-yellow-600/50 transition-colors group relative overflow-hidden">
            {/* Left Stub */}
            <div className="w-full md:w-32 bg-red-950/30 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-red-900/30 border-dashed">
                <Calendar className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm font-bold text-red-200 text-center">{date}</span>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-nexus-linen group-hover:text-yellow-500 transition-colors">{title}</h3>
                    <span className="px-2 py-1 bg-red-900/50 text-[10px] uppercase tracking-widest text-red-200 border border-red-800">{type}</span>
                </div>
                <p className="text-red-200/50 text-sm">{desc}</p>
            </div>

            {/* Decoration Circles */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050000] rounded-full hidden md:block"></div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050000] rounded-full hidden md:block"></div>
        </div>
    );
}

