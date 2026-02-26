'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Cpu, Settings, PenTool, Zap, Users, User, Hexagon, Crosshair, ChevronRight, Play, Instagram, Mail, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function RoboticsClubPage() {
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
            const response = await api.get('/api/council/clubs/robotics-club');
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
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
            {/* Technical Grid Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
                        </pattern>
                        <pattern id="grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
                            <rect width="200" height="200" fill="url(#grid)" />
                            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#f59e0b" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-large)" />
                </svg>
            </div>

            {/* Radial Gradient Vignette */}
            <div className="fixed inset-0 z-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/90 pointer-events-none"></div>
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950 pointer-events-none"></div>

            
            {/* --- HERO SECTION --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="mb-8 relative"
                >
                    <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
                    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                        <Image
                            src="/logos/ARC (With BG).png"
                            alt="Robotics Club Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                        />
                        {/* Rotating ring effect */}
                        <div className="absolute inset-0 border-2 border-dashed border-amber-500/30 rounded-full animate-spin-slow pointer-events-none w-[120%] h-[120%] -left-[10%] -top-[10%]"></div>
                    </div>
                </motion.div>

                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-sm border border-amber-500/30 bg-amber-900/10 text-amber-500 text-xs font-bold tracking-[0.2em] mb-6 uppercase">
                    <Zap className="w-3 h-3" /> System Online
                </div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-nexus-linen uppercase"
                >
                    Applied <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Robotics</span> Club
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl font-light text-slate-400 mb-12 max-w-3xl mx-auto"
                >
                    Innovating Intelligent Robotic Systems
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 mt-4"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-8 py-4 bg-slate-900 border ${joined ? 'border-green-500 text-green-500' : 'border-amber-500 text-amber-500'} font-bold text-lg tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 clip-path-button`}
                    >
                        <div className="absolute top-0 right-0 w-2 h-2 bg-current"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-current"></div>
                        {joined ? 'SYSTEM LINKED' : 'INITIATE CONNECTION'}
                    </button>

                    <div className="flex gap-4 items-center justify-center">
                        <SocialLink href="https://www.instagram.com/arc_jklu/" icon={<Instagram className="w-5 h-5" />} />
                        <SocialLink href="mailto:roboticsclub@jklu.edu.in" icon={<Mail className="w-5 h-5" />} />
                    </div>
                </motion.div>
            </div>

            {/* --- MISSION PARAMETERS (About) --- */}
            <section className="relative z-10 py-24 border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="Mission Parameters" subtitle="Core Objective" />
                        <p className="text-lg text-slate-400 leading-relaxed mb-6">
                            The Applied Robotics Club focuses on the practical application of robotics and automation technologies.
                            We design and develop mobile robots and competition-grade robotic systems.
                        </p>
                        <ul className="space-y-4">
                            <FeatureItem text="Robot making and prototyping" />
                            <FeatureItem text="Robotics competitions" />
                            <FeatureItem text="Technical workshops & training" />
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard value="20+" label="Active Projects" />
                        <StatCard value="5" label="Workshops" />
                        <StatCard value="100%" label="Innovation" />
                        <StatCard value="1st" label="Competition Rank" highlight />
                    </div>
                </div>
            </section>

            {/* --- COMMAND CENTER (Leadership) --- */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-4">
                <SectionHeader title="Command Center" subtitle="Leadership Team" center />

                {/* Core Command */}
                <div className="flex flex-col md:flex-row justify-center gap-10 mb-16">
                    <LeaderCard
                        role="Chairperson"
                        name="Devansh Pundir"
                        image="/Clubs/robotics_club/chair.jpg"
                        color="amber"
                        techId="ARC-01"
                    />
                    <LeaderCard
                        role="Co-Chairperson"
                        name="Samarth Myadam"
                        image="/Clubs/robotics_club/co_chair.jpg"
                        color="orange"
                        techId="ARC-02"
                    />
                </div>

                {/* Technical & Event Operations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <MemberCard name="Udit Mishra" role="Technical Head" id="TECH-01" />
                    <MemberCard name="Yojit Lohar" role="Technical Head" id="TECH-02" />
                    <MemberCard name="Aayushi Kaushik" role="Event Coordinator" id="EVT-01" />
                    <MemberCard name="Palak Khatri" role="Event Coordinator" id="EVT-02" />
                    <MemberCard name="Shabd Srivastava" role="Social Media Mgr" id="SOC-01" />
                </div>
            </section>

            {/* --- OPERATIONS LOG (Events) --- */}
            <section className="relative z-10 py-24 bg-slate-900 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader title="Operations Log" subtitle="Recent & Upcoming Activities" />

                    {loadingEvents ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
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
                                    color="text-amber-500"
                                    bg="bg-amber-500/10"
                                    border="group-hover:border-amber-500/50"
                                    is_enrolled={event.is_enrolled}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 mt-12 bg-slate-900/50 rounded-2xl border border-slate-700 border-dashed">
                            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No operations currently scheduled.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer decoration */}
            <div className="h-24 bg-gradient-to-t from-slate-900 to-slate-950 border-t border-slate-800"></div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionHeader({ title, subtitle, center }: any) {
    return (
        <div className={`mb-12 ${center ? 'text-center' : ''}`}>
            <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2 block">// {subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-black text-nexus-linen uppercase tracking-tight">{title}</h2>
            <div className={`h-1 w-24 bg-amber-500 mt-4 ${center ? 'mx-auto' : ''}`}></div>
        </div>
    );
}

function FeatureItem({ text }: any) {
    return (
        <li className="flex items-center gap-3 text-slate-300 font-mono text-sm">
            <div className="w-2 h-2 bg-amber-500 rotate-45"></div>
            {text}
        </li>
    );
}

function StatCard({ value, label, highlight }: any) {
    return (
        <div className={`p-6 border ${highlight ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800/50'} text-center`}>
            <div className={`text-3xl font-black ${highlight ? 'text-amber-500' : 'text-nexus-linen'}`}>{value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{label}</div>
        </div>
    );
}

function LeaderCard({ role, name, image, color, techId }: any) {
    return (
        <div className="relative group w-full md:w-80">
            {/* ID Tag */}
            <div className="absolute -top-3 left-4 px-2 py-1 bg-slate-950 border border-slate-700 text-[10px] font-mono text-slate-500 z-20">
                ID: {techId}
            </div>

            <div className="relative h-96 border border-slate-700 bg-slate-900 group-hover:border-amber-500 transition-colors duration-300">
                {/* Tech Lines */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Image Placeholder if no image */}
                <div className="w-full h-3/4 bg-slate-800 flex items-center justify-center overflow-hidden relative">
                    {/* Overlay Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                    <User className="w-24 h-24 text-slate-600 group-hover:text-amber-500/50 transition-colors" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700">
                    <h3 className="text-xl font-bold text-nexus-linen uppercase group-hover:text-amber-500 transition-colors">{name}</h3>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1">{role}</p>
                </div>
            </div>
        </div>
    );
}

function MemberCard({ name, role, id }: any) {
    return (
        <div className="flex items-center gap-4 p-4 border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-500">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-slate-200">{name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="text-amber-500/70">[{id}]</span> {role}
                </div>
            </div>
        </div>
    );
}

function SocialLink({ href, icon }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center border border-slate-700 bg-slate-900 text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all"
        >
            {icon}
        </a>
    );
}

