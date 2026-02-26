'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Mic, Video, Newspaper, Radio, Tv, Users, Calendar, MapPin, Send, Instagram, Play, Cast, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function MediaClubPage() {
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
            const response = await api.get('/api/council/clubs/media-club');
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
        <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans selection:bg-red-600 selection:text-nexus-linen overflow-x-hidden relative">
            {/* Background Texture - Dot Grid */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Animated Ticker Background */}
            <div className="fixed top-20 left-0 right-0 h-12 bg-red-600/10 z-0 flex items-center overflow-hidden pointer-events-none rotate-[-2deg] scale-110 blur-sm">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex whitespace-nowrap text-4xl font-black text-red-600/20 uppercase tracking-widest"
                >
                    LIVE BROADCAST â€¢ SOCIAMA â€¢ THE MEDIA VOICE â€¢ RECORDING IN PROGRESS â€¢ LIVE BROADCAST â€¢ SOCIAMA â€¢ THE MEDIA VOICE â€¢ RECORDING IN PROGRESS â€¢
                </motion.div>
            </div>

            
            {/* --- HERO SECTION: THE HEADLINES --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "backOut" }}
                    className="mb-6 relative"
                >
                    <div className="relative inline-flex items-center gap-2 px-4 py-1 bg-red-600 rounded-sm mb-4">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-nexus-linen">On Air</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-2 text-nexus-linen leading-none">
                        SOCIAMA
                    </h1>
                    <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 mb-6"></div>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-xl md:text-3xl font-light text-slate-400 mb-12 uppercase tracking-wide"
                >
                    "The Media <span className="text-blue-500 font-bold">Voice</span>"
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-8 py-3 rounded-sm border-2 ${joined ? 'bg-green-600 border-green-600 text-nexus-linen' : 'border-slate-200 text-slate-200 hover:bg-white hover:text-slate-900'} font-bold tracking-widest uppercase transition-all duration-300`}
                    >
                        {joined ? 'Subscribed' : 'Join the Newsroom'}
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 text-red-500 hover:text-red-400 font-bold tracking-widest uppercase items-center transition-colors">
                        <Play className="w-4 h-4" /> Watch Showreel
                    </button>
                </motion.div>
            </div>

            {/* --- SECTION 1: THE PRESS ROOM (Vision) --- */}
            <section className="relative z-10 py-24 bg-slate-900/50 border-y border-slate-800 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="Editorial Board" subtitle="The Mission" />
                        <p className="text-xl text-slate-300 leading-relaxed font-light mb-8">
                            <span className="text-red-500 font-bold text-3xl float-left mr-2">"</span>
                            To build a creative and inclusive media community where student voices are amplified, storytelling sparks positive change, and members develop strong media skills for insightful, responsible, and innovative communication.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <FeatureTag icon={<Newspaper />} text="Newsletter Publication" />
                            <FeatureTag icon={<Video />} text="Event Coverage" />
                            <FeatureTag icon={<Activity />} text="Media Workshops" />
                            <FeatureTag icon={<Cast />} text="Magazine Creation" />
                        </div>
                    </div>

                    {/* Live Feed Placeholder */}
                    <div className="relative aspect-video bg-nexus-black rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
                        <div className="absolute top-4 left-4 flex gap-2">
                            <div className="bg-red-600 text-nexus-linen text-[10px] font-bold px-2 py-0.5 uppercase rounded-sm">Live</div>
                            <div className="bg-nexus-black/50 text-nexus-linen text-[10px] font-bold px-2 py-0.5 uppercase rounded-sm backdrop-blur-md">Cam 1</div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <Tv className="w-16 h-16 text-slate-700 mx-auto mb-2" />
                                <span className="text-slate-700 font-mono text-sm uppercase">Signal Offline</span>
                            </div>
                        </div>
                        {/* Overlay Elements */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="h-1 w-full bg-red-600 mb-2"></div>
                            <div className="text-nexus-linen font-bold uppercase truncate">Breaking: Upcoming Media House Visit Announced</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: BROADCAST SCHEDULE (Events) --- */}
            <section className="relative z-10 py-24 max-w-6xl mx-auto px-4">
                <SectionHeader title="Broadcast Schedule" subtitle="Upcoming Productions" center />

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
                                    color="text-nexus-linen"
                                    bg="bg-slate-900"
                                    border="group-hover:border-red-600/50"
                                    is_enrolled={event.is_enrolled}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800 border-dashed">
                            <Cast className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No broadcasts scheduled in the lineup.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECTION 3: THE EDITORS (Leadership) --- */}
            <section className="relative z-10 py-24 bg-slate-900 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader title="The Production Team" subtitle="Leadership" />

                    {/* Chairs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <ProfileCard
                            name="Chestha Kulshrestha"
                            role="Chairperson"
                            color="red"
                            image="/Photoes ID CARD Student Council/chestha kulshrestha(media club) .jpg"
                        />
                        <ProfileCard
                            name="Nikita Bhatia"
                            role="Co-Chairperson"
                            color="blue"
                            image="/Photoes ID CARD Student Council/Nikita bhatia .PNG"
                        />
                    </div>

                    {/* Coordinators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <CoordinatorRow name="Aadipoojya Mehra" role="Event Coordinator" icon={<Calendar />} />
                        <CoordinatorRow name="Aman Kumawat" role="Social Media Coordinator" icon={<Send />} />
                        <CoordinatorRow name="Divya Malik" role="Design Coordinator" icon={<Activity />} />
                    </div>
                </div>
            </section>

            {/* Footer decoration */}
            <div className="py-12 bg-[#0f172a] border-t border-slate-800 text-center">
                <div className="flex justify-center gap-8 mb-6">
                    <SocialLink href="mailto:contact@sociama.jklu" icon={<Send />} label="Email" />
                    <SocialLink href="https://www.instagram.com/mediaclub__jklu?igsh=MXdvcmcxc2xkemtheA==" icon={<Instagram />} label="Instagram" />
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Transmission Active
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionHeader({ title, subtitle, center }: any) {
    return (
        <div className={`mb-10 ${center ? 'text-center' : ''}`}>
            <span className="inline-block px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 border border-slate-700">{subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-black text-nexus-linen uppercase tracking-tight">{title}</h2>
        </div>
    );
}

function FeatureTag({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-sm border border-slate-700">
            <div className="text-red-500">{icon}</div>
            <span className="text-slate-200 font-bold text-sm uppercase tracking-wide">{text}</span>
        </div>
    );
}

function ProgramCard({ title, category, status, desc, color }: any) {
    const colorClasses: any = {
        red: "border-red-500/50 text-red-400",
        blue: "border-blue-500/50 text-blue-400",
        purple: "border-purple-500/50 text-nexus-brass"
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 relative group hover:bg-slate-800 transition-colors">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-${color}-500 to-transparent opacity-50`}></div>

            <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm border ${colorClasses[color]} bg-nexus-black/20`}>{category}</span>
                <span className="text-slate-500 text-[10px] font-mono">{status}</span>
            </div>

            <h3 className="text-2xl font-bold text-nexus-linen mb-3 group-hover:text-red-500 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>

            <div className="mt-6 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <Play className="w-3 h-3 text-nexus-linen fill-current" />
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ name, role, color, image }: any) {
    return (
        <div className="flex items-center gap-6 p-6 bg-slate-950 border border-slate-800 hover:border-slate-600 transition-colors relative overflow-hidden group">
            <div className={`absolute right-[-20px] top-[-20px] w-24 h-24 bg-${color}-600/10 rounded-full blur-xl group-hover:bg-${color}-600/20 transition-colors`}></div>

            <div className="w-20 h-20 bg-slate-900 rounded-sm border border-slate-700 flex items-center justify-center relative z-10 overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <Users className="w-8 h-8 text-slate-500 group-hover:text-nexus-linen transition-colors" />
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-nexus-linen mb-1 uppercase tracking-tight">{name}</h3>
                <div className={`text-${color}-500 text-xs font-bold uppercase tracking-widest`}>{role}</div>
            </div>
        </div>
    );
}

function CoordinatorRow({ name, role, icon }: any) {
    return (
        <div className="flex items-center gap-4 p-4 border border-slate-800 hover:bg-slate-800 transition-colors">
            <div className="text-slate-500">{icon}</div>
            <div>
                <h4 className="font-bold text-nexus-linen text-sm uppercase">{name}</h4>
                <p className="text-slate-500 text-[10px] uppercase tracking-wide">{role}</p>
            </div>
        </div>
    );
}

function SocialLink({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-500 hover:text-nexus-linen transition-colors font-bold text-sm uppercase tracking-wide"
        >
            {icon} {label}
        </a>
    );
}

