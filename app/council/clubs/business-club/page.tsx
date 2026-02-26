'use client';

import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Briefcase, Users, PieChart, DollarSign, Target, Calendar, Award, Send, Instagram, ArrowUpRight, Globe, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function BusinessClubPage() {
    const { user } = useAuth();
        const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [joined, setJoined] = useState(false);
    const { scrollY } = useScroll();
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    const yBackground = useTransform(scrollY, [0, 1000], [0, 150]);

    useEffect(() => {
        setMounted(true);
                fetchClubEvents();
    }, []);

    const fetchClubEvents = async () => {
        try {
            const response = await api.get('/api/council/clubs/business-club');
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
        <div className="min-h-screen bg-[#0a192f] text-slate-100 font-sans selection:bg-amber-500 selection:text-nexus-linen overflow-x-hidden relative">
            {/* Background Pattern - Financial Graph */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            {/* Animated Ticker Background (Subtle) */}
            <motion.div
                style={{ y: yBackground }}
                className="fixed inset-0 z-0 pointer-events-none flex flex-col justify-center opacity-5"
            >
                <div className="text-[200px] font-black whitespace-nowrap text-amber-500/20 leading-none">BULL MARKET</div>
                <div className="text-[200px] font-black whitespace-nowrap text-emerald-500/20 ml-40 leading-none">STRATEGY</div>
                <div className="text-[200px] font-black whitespace-nowrap text-blue-500/20 -ml-20 leading-none">INNOVATION</div>
            </motion.div>

            
            {/* --- HERO SECTION: THE MARKET --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)] mb-8 rotate-3 hover:rotate-0 transition-all duration-500">
                        <TrendingUp className="w-12 h-12 text-nexus-linen" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <span className="text-amber-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 block">Business & Finance Club</span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-nexus-linen drop-shadow-xl">
                        CORPOVA
                    </h1>
                    <div className="h-1 w-32 bg-amber-500 mx-auto mb-8"></div>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-4 font-light"
                >
                    "Where ideas turn into <span className="text-amber-400 font-bold">impact</span>."
                </motion.p>
                <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-12">
                    A dynamic platform empowering students to grow strategically, think creatively, and develop real-world corporate skills.
                </p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-8 py-4 rounded-sm border-2 ${joined ? 'bg-emerald-600 border-emerald-600 text-nexus-linen' : 'border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-nexus-linen'} font-bold tracking-widest uppercase transition-all duration-300`}
                    >
                        {joined ? 'Shareholder Verified' : 'Invest in Yourself'}
                    </button>
                </motion.div>
            </div>

            {/* --- SECTION 1: THE BOARDROOM (Vision) --- */}
            <section className="relative z-10 py-24 bg-[#112240] border-y border-[#233554]">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="Strategic Vision" subtitle="The Boardroom" />
                        <p className="text-lg text-slate-300 leading-relaxed mb-8">
                            Our vision is to cultivate a future-ready community of thinkers, leaders, and innovators who drive positive change. We inspire continuous learning and meaningful collaboration through experiential learning and a culture of excellence.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FeatureStat icon={<PieChart />} label="Simulation Games" value="Market Dynamics" />
                            <FeatureStat icon={<Users />} label="Networking" value="Expert Sessions" />
                            <FeatureStat icon={<Target />} label="Strategy" value="Impact Events" />
                            <FeatureStat icon={<Award />} label="Leadership" value="Skill Building" />
                        </div>
                    </div>

                    <div className="relative bg-[#0a192f] p-8 rounded-lg border border-[#233554] shadow-2xl">
                        <div className="flex items-center justify-between mb-8 border-b border-[#233554] pb-4">
                            <h3 className="text-xl font-bold text-nexus-linen flex items-center gap-2">
                                <BarChart3 className="text-emerald-400" /> Market Activity
                            </h3>
                            <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded">+24.5% Growth</span>
                        </div>

                        <div className="space-y-6">
                            <ActivityRow
                                title="Real-life Simulations"
                                desc="Understanding complex market dynamics through gamified experiences."
                                type="Core"
                            />
                            <ActivityRow
                                title="Expert-Led Sessions"
                                desc="Bridging the gap between academic theory and corporate reality."
                                type="Network"
                            />
                            <ActivityRow
                                title="Impactful Events"
                                desc="Showcasing talent and recognizing future business leaders."
                                type="Event"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: FISCAL YEAR (Events) --- */}
            <section className="relative z-10 py-24 max-w-6xl mx-auto px-4">
                <SectionHeader title="Event Portfolio" subtitle="Fiscal Year" center />

                <div className="mt-12">
                    {loadingEvents ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="text-center py-12 bg-[#112240] rounded-lg border border-[#233554]">
                            <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium">No fiscal events currently scheduled.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECTION 3: EXECUTIVE BOARD (Leadership) --- */}
            <section className="relative z-10 py-24 bg-gradient-to-b from-[#0a192f] to-[#112240] border-t border-[#233554]">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader title="Executive Board" subtitle="Management" center />

                    {/* Chairs */}
                    <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
                        <ExecutiveProfile
                            name="Mann Sharma"
                            role="Chairperson"
                            initial="M"
                        />
                        <ExecutiveProfile
                            name="Garvishtha Asnani"
                            role="Co-Chairperson"
                            initial="G"
                            image="/Photoes ID CARD Student Council/Garvishta Asnani .jpg"
                        />
                    </div>

                    {/* Volunteers/Team */}
                    <div className="text-center mb-8">
                        <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-6">Club Associates</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <AssociateTag name="Parth Bhardhwaj" />
                        <AssociateTag name="Mukul Lakra" />
                        <AssociateTag name="Shivam Lakshkar" />
                        <AssociateTag name="Aditi Sharma" />
                        <AssociateTag name="Gouranshi Sharma" />
                        <AssociateTag name="Pratiki Agarwal" />
                        <AssociateTag name="Hemani Mehghani" />
                        <AssociateTag name="Khank Jain" />
                        <AssociateTag name="Navya Bhatra" />
                        <AssociateTag name="Purvee Dudheria" />
                        <AssociateTag name="Hemangi Sancheti" />
                    </div>
                </div>
            </section>

            {/* Footer decoration */}
            <div className="py-12 bg-[#0a192f] border-t border-[#233554] text-center">
                <div className="flex justify-center gap-8 mb-6">
                    <SocialLink href="mailto:businessfinanceclub@jklu.edu.in" icon={<Send />} label="Contact" />
                    <SocialLink href="https://www.instagram.com/business.club_jklu" icon={<Instagram />} label="LinkedIn / Insta" />
                </div>
                <div className="inline-block px-4 py-2 border border-emerald-500/30 rounded-full bg-emerald-500/5">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        Corpova Inc. â€¢ Est. 2024
                    </p>
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionHeader({ title, subtitle, center }: any) {
    return (
        <div className={`mb-10 ${center ? 'text-center' : ''}`}>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-2 block">{subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-black text-nexus-linen uppercase tracking-tight">{title}</h2>
            <div className={`h-1 w-20 bg-amber-500 mt-4 ${center ? 'mx-auto' : ''}`}></div>
        </div>
    );
}

function FeatureStat({ icon, label, value }: any) {
    return (
        <div className="flex flex-col p-4 bg-[#112240] border border-[#233554] hover:border-amber-500/50 transition-colors rounded-sm">
            <div className="text-amber-400 mb-2">{icon}</div>
            <div className="text-nexus-linen font-bold text-lg">{value}</div>
            <div className="text-slate-400 text-xs uppercase tracking-wide">{label}</div>
        </div>
    );
}

function ActivityRow({ title, desc, type }: any) {
    return (
        <div className="pb-4 border-b border-[#233554] last:border-0 last:pb-0">
            <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-nexus-linen">{title}</h4>
                <span className="text-[10px] font-mono text-amber-400 border border-amber-400/30 px-1 rounded">{type}</span>
            </div>
            <p className="text-sm text-slate-400">{desc}</p>
        </div>
    );
}

function EventCard({ title, type, date, desc, highlight }: any) {
    return (
        <div className={`p-8 rounded-lg border ${highlight ? 'bg-amber-500/10 border-amber-500' : 'bg-[#112240] border-[#233554]'} hover:-translate-y-2 transition-transform duration-300`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${highlight ? 'bg-amber-500 text-[#0a192f]' : 'bg-[#233554] text-slate-400'}`}>
                    <Calendar className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${highlight ? 'bg-amber-500 text-[#0a192f]' : 'bg-[#233554] text-slate-400'}`}>{date}</span>
            </div>

            <h3 className="text-2xl font-bold text-nexus-linen mb-1">{title}</h3>
            <div className="text-sm text-emerald-400 font-mono mb-4">{type}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function ExecutiveProfile({ name, role, initial, image }: any) {
    return (
        <div className="text-center group">
            <div className="w-32 h-32 mx-auto bg-gradient-to-b from-slate-200 to-slate-400 rounded-full mb-6 p-1 relative overflow-hidden ring-4 ring-[#233554] group-hover:ring-amber-500 transition-all duration-300 pointer-events-none">
                <div className="w-full h-full bg-[#0a192f] rounded-full flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl font-black text-slate-700 select-none group-hover:text-amber-500 transition-colors">{initial}</span>
                    )}
                </div>
            </div>
            <h3 className="text-xl font-bold text-nexus-linen mb-1">{name}</h3>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">{role}</p>
        </div>
    );
}

function AssociateTag({ name }: any) {
    return (
        <div className="px-3 py-2 bg-[#112240] border border-[#233554] rounded text-center">
            <span className="text-slate-300 text-sm font-medium">{name}</span>
        </div>
    );
}

function SocialLink({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors font-bold text-sm uppercase tracking-wide"
        >
            {icon} {label}
        </a>
    );
}

