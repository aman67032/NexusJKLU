'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Palette, PenTool, Layout, Layers, Box, Users, Calendar, ArrowRight, Instagram, Send, Grid, Trello, Image } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function DesignClubPage() {
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
            const response = await api.get('/api/council/clubs/design-club');
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
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden relative">
            {/* Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Geometric Accents */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>


            {/* --- HERO SECTION: THE CANVAS --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8 relative"
                >
                    <div className="w-24 h-24 mx-auto bg-black text-white flex items-center justify-center mb-6 rounded-full">
                        <Palette className="w-10 h-10" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-2 text-black leading-none uppercase">
                        White Space
                    </h1>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-[2px] w-12 bg-black"></div>
                        <p className="text-xl md:text-2xl font-medium tracking-widest uppercase">Space for Creative Clarity</p>
                        <div className="h-[2px] w-12 bg-black"></div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
                >
                    "Brings together creative minds passionate about visual communication and design thinking."
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-0 border border-black"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-10 py-4 font-bold tracking-widest uppercase transition-all duration-300 ${joined ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
                    >
                        {joined ? 'Design Team Joined' : 'Join the Studio'}
                    </button>
                    <button className="px-10 py-4 font-bold tracking-widest uppercase border-l border-black hover:bg-gray-100 transition-colors flex items-center gap-2">
                        Portfolio <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>

            {/* --- SECTION 1: THE BLUEPRINT (Vision) --- */}
            <section className="relative z-10 py-24 border-t border-black/5">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
                    <div className="flex flex-col justify-center">
                        <SectionHeader title="Our Vision" subtitle="The Blueprint" />
                        <p className="text-xl text-gray-800 leading-relaxed font-light mb-10">
                            White Space aims to build a lasting creative culture by nurturing <span className="font-bold border-b-2 border-black">design thinking</span>, encouraging innovation, and empowering students with skills and experiences that shape impactful designers for the future.
                        </p>

                        <div className="space-y-6">
                            <CoreValue number="01" title="Structure" desc="Planning and coordinating events efficiently." />
                            <CoreValue number="02" title="Clarity" desc="Creating engaging content with consistent messaging." />
                            <CoreValue number="03" title="Identity" desc="Overseeing design quality and visual standards." />
                        </div>
                    </div>

                    <div className="bg-gray-100 p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-tr-full"></div>

                        <div>
                            <h3 className="text-3xl font-black uppercase mb-8">Scope of Work</h3>
                            <ul className="space-y-4">
                                <ScopeItem icon={<Layout />} text="Workshops & Design Challenges" />
                                <ScopeItem icon={<Users />} text="Collaborative Projects" />
                                <ScopeItem icon={<Trello />} text="Event Management & Logistics" />
                                <ScopeItem icon={<Image />} text="Visual Communication" />
                            </ul>
                        </div>

                        <div className="mt-12 pt-8 border-t border-black/10 flex justify-between items-end">
                            <div>
                                <h4 className="font-bold text-sm uppercase text-gray-500 mb-1">Associated Council</h4>
                                <p className="font-black text-lg">Council of Technical Affairs</p>
                            </div>
                            <Box className="w-12 h-12 text-black stroke-1" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: PORTFOLIO (Events) --- */}
            <section className="relative z-10 py-24 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/20 pb-8">
                        <div>
                            <span className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-2">Portfolio</span>
                            <h2 className="text-5xl font-black uppercase">Projects</h2>
                        </div>
                        <p className="text-white/60 max-w-sm text-right mt-6 md:mt-0">
                            Highlighting our collaborative efforts to actuate design in campus life.
                        </p>
                    </div>

                    {loadingEvents ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-white/20 border border-white/20 p-8">
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
                                    color="text-white"
                                    bg="bg-white/10"
                                    border="group-hover:border-white/50"
                                    is_enrolled={event.is_enrolled}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-white/20 border-dashed">
                            <Box className="w-16 h-16 text-white/50 mx-auto mb-4" />
                            <p className="text-white/60 font-medium">No projects currently in the portfolio.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECTION 3: THE ARCHITECTS (Leadership) --- */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-4">
                <SectionHeader title="Leadership" subtitle="The Architects" center />

                {/* Chairs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 max-w-4xl mx-auto">
                    <CleanProfile
                        name="Nikita Kumawat"
                        role="Chairperson"
                    />
                    <CleanProfile
                        name="Purvi Jain"
                        role="Co-Chairperson"
                        image="/Photoes ID CARD Student Council/Purvi Jain.jpg"
                    />
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/10">
                    <TeamCell name="Tejendra Singh" role="Management Head (Bridge)" desc="Ensuring execution efficiency." />
                    <TeamCell name="Paavani Sahu" role="Management Head (Bridge)" desc="Planning & Logistics." />
                    <TeamCell name="Suryanshi Shridevi" role="Content Coordinator" desc="Communication & Alignment." />
                    <TeamCell name="Soumya Tapkire" role="Social Media Head" desc="Online Presence & Branding." />
                    <TeamCell name="Tisha Garg" role="Design Director" desc="Creative Vision & Quality." />
                </div>
            </section>

            {/* Footer decoration */}
            <div className="py-20 border-t border-black/10 text-center bg-gray-50">
                <div className="w-16 h-16 mx-auto bg-black text-white flex items-center justify-center rounded-full mb-8">
                    <Box className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black uppercase mb-8">Space for Creative Clarity</h2>
                <div className="flex justify-center gap-8">
                    <SocialLink href="mailto:designclub@jklu.edu.in" icon={<Send />} label="Email" />
                    <SocialLink href="https://www.instagram.com/white_space_jklu?igsh=MTZMzd2cW9wNWVhYg==" icon={<Instagram />} label="Instagram" />
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionHeader({ title, subtitle, center }: any) {
    return (
        <div className={`mb-8 ${center ? 'text-center' : ''}`}>
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mb-4">{subtitle}</h4>
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tight">{title}</h2>
        </div>
    );
}

function CoreValue({ number, title, desc }: any) {
    return (
        <div className="flex items-start gap-6 group">
            <span className="text-4xl font-black text-gray-200 group-hover:text-black transition-colors">{number}</span>
            <div>
                <h4 className="text-xl font-bold uppercase mb-1">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function ScopeItem({ icon, text }: any) {
    return (
        <li className="flex items-center gap-4 text-gray-700">
            <div className="w-8 h-8 flex items-center justify-center border border-black/20 rounded-sm bg-white">
                <div className="w-4 h-4">{icon}</div>
            </div>
            <span className="font-medium">{text}</span>
        </li>
    );
}

function ProjectCard({ title, category, desc, status }: any) {
    return (
        <div className="bg-black text-white p-12 hover:bg-white hover:text-black transition-colors duration-500 group border-b border-r border-white/10 hover:border-black/10">
            <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">{category}</span>
                <span className="px-3 py-1 border border-current text-[10px] uppercase font-bold">{status}</span>
            </div>
            <h3 className="text-4xl font-bold mb-4 uppercase">{title}</h3>
            <p className="opacity-70 group-hover:opacity-100 leading-relaxed max-w-md">{desc}</p>
        </div>
    );
}

function CleanProfile({ name, role, image }: any) {
    return (
        <div className="text-center group">
            <div className="w-40 h-40 mx-auto bg-gray-100 rounded-full mb-6 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 overflow-hidden">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <Users className="w-12 h-12 text-gray-400" />
                    )}
                </div>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-2">{name}</h3>
            <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">{role}</p>
        </div>
    );
}

function TeamCell({ name, role, desc }: any) {
    return (
        <div className="p-8 border-b border-r border-black/10 hover:bg-gray-50 transition-colors">
            <h4 className="font-bold text-lg uppercase mb-1">{name}</h4>
            <div className="text-xs font-bold uppercase tracking-wider text-black/60 mb-3">{role}</div>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    );
}

function SocialLink({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-black hover:bg-black hover:text-white transition-all font-bold text-sm uppercase tracking-wider"
        >
            {icon} {label}
        </a>
    );
}

