'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Feather, BookOpen, PenTool, Scroll, Users, Edit3, Calendar, MapPin, Coffee, Sparkles, User, Quote, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function LiteraryClubPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [joined, setJoined] = useState(false);
    const { scrollY } = useScroll();
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    const yBackground = useTransform(scrollY, [0, 1000], [0, 200]);

    useEffect(() => {
        setMounted(true);
        fetchClubEvents();
    }, []);

    const fetchClubEvents = async () => {
        try {
            const response = await api.get('/api/council/clubs/literary-club');
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
        <div className="min-h-screen bg-[#f8f5e6] text-[#2c1810] font-serif selection:bg-[#d4a076] selection:text-[#2c1810] overflow-x-hidden relative">
            {/* Parchment Texture Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("/paper-texture.png")', backgroundSize: 'cover' }}></div>

            {/* Floating Ink Elements (CSS/SVG) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div style={{ y: yBackground }} className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#d4a076]/10 rounded-full blur-[100px]"></motion.div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#8b5a2b]/10 rounded-full blur-[120px]"></div>

                {/* Random Floating Letters */}
                <span className="absolute top-20 left-10 text-9xl font-black text-[#2c1810]/5 font-serif select-none rotate-12">A</span>
                <span className="absolute bottom-40 right-20 text-9xl font-black text-[#2c1810]/5 font-serif select-none -rotate-12">Z</span>
                <span className="absolute top-1/2 left-20 text-8xl font-black text-[#2c1810]/5 font-serif select-none rotate-45">?</span>
            </div>


            {/* --- HERO SECTION: THE PROLOGUE --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-[#8b5a2b] rounded-full opacity-20 animate-spin-slow-reverse"></div>
                        <div className="absolute inset-2 border border-[#d4a076] rounded-full opacity-40"></div>
                        <Feather className="w-20 h-20 text-[#5d4037] drop-shadow-sm" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-[#2c1810]">
                        The Muse Ink
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-xl md:text-2xl font-medium text-[#5d4037] mb-8 font-sans tracking-widest uppercase">
                        <span>Voices</span>
                        <span className="w-2 h-2 rounded-full bg-[#d4a076]"></span>
                        <span>Verses</span>
                        <span className="w-2 h-2 rounded-full bg-[#d4a076]"></span>
                        <span>Vision</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="w-24 h-1 bg-[#2c1810] mb-8"
                ></motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-[#5d4037]/80 max-w-2xl mx-auto leading-relaxed italic mb-12"
                >
                    "A dedicated space promoting literary expression and creative thought. Where imagination meets ink."
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-8 py-3 rounded-sm border-2 ${joined ? 'border-[#4a7c59] text-[#4a7c59]' : 'border-[#2c1810] text-[#2c1810]'} font-bold tracking-widest uppercase bg-transparent hover:bg-[#2c1810] hover:text-[#f8f5e6] transition-all duration-300`}
                    >
                        {joined ? 'Inscribed' : 'Chronicle Your Story'}
                    </button>
                </motion.div>
            </div>

            {/* --- CHAPTER I: THE VISION --- */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <SectionHeader title="Our Mission" subtitle="Chapter I" />
                        <p className="text-lg text-[#4a3b32] leading-relaxed mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-[#8b5a2b] first-letter:mr-1 first-letter:float-left">
                            Our mission is to create a space where students can express themselves freely through words â€” whether through poetry, prose, performance, or cultural exploration. We nurture imagination, communication skills, and a strong appreciation for literature.
                        </p>
                        <div className="space-y-4 font-sans mt-8">
                            <ActivityRow icon={<Edit3 />} title="Creative Exploration" desc="Travel writing, storytelling, sketch-inspired literature." />
                            <ActivityRow icon={<MapPin />} title="Heritage Walks" desc="City explorations and experiential writing." />
                            <ActivityRow icon={<Mic />} title="Poetry & Performance" desc="Spoken word, musical poetry shows." />
                            <ActivityRow icon={<Sparkles />} title="Showcases" desc="Competitions and bilingual contests." />
                        </div>
                    </div>

                    <div className="relative p-8 border border-[#2c1810]/10 bg-[#fffef5] shadow-xl rotate-1">
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#2c1810]"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#2c1810]"></div>

                        <h3 className="text-2xl font-bold text-[#2c1810] mb-6 text-center font-sans uppercase tracking-widest">From the Archives</h3>

                        <div className="space-y-8">
                            <ArchiveItem
                                title="Brushes & Verses"
                                date="2025"
                                desc="A unique initiative connecting visual arts with expressive writing using Jaipur's landmarks as a muse."
                            />
                            <ArchiveItem
                                title="Bonfire Reading Night"
                                date="Winter 2025"
                                desc="A cozy session encouraging informal literary bonding."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CHAPTER II: ANTHOLOGY (Events) --- */}
            <section className="relative z-10 py-24 bg-[#ece5d0]/50 border-t border-[#d4a076]/30">
                <div className="max-w-6xl mx-auto px-4">
                    <SectionHeader title="Upcoming Volumes" subtitle="Chapter II" center />

                    <div className="max-w-6xl mx-auto px-4 mt-12">
                        {loadingEvents ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-[#8b5a2b] border-t-transparent rounded-full animate-spin"></div>
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
                                        color="text-[#2c1810]"
                                        bg="bg-[#fffef5]"
                                        border="group-hover:border-[#8b5a2b]"
                                        is_enrolled={event.is_enrolled}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-[#fffef5] rounded-xl border border-dashed border-[#8b5a2b]/30">
                                <Scroll className="w-12 h-12 text-[#8b5a2b] mx-auto mb-4" />
                                <p className="text-[#5d4037] font-medium font-serif">No volumes currently unpublished.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- CHAPTER III: THE AUTHORS (Leadership) --- */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-4">
                <SectionHeader title="The Authors" subtitle="Chapter III" center />

                {/* Chairs */}
                <div className="flex flex-col md:flex-row justify-center gap-12 mb-20">
                    <PortraitCard
                        name="Anushka Singhal"
                        role="Chairperson"
                        initial="A"
                        image="/Photoes ID CARD Student Council/anushka singhal .jpg"
                    />
                    <PortraitCard
                        name="Pragya Verma"
                        role="Co-Chairperson"
                        initial="P"
                        image="/Photoes ID CARD Student Council/pragya verma.jpg"
                    />
                </div>

                {/* Coordinators Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <SmallProfile name="Kajal Agrawal" role="Social Media" />
                    <SmallProfile name="Tarun Kumar" role="Events" />
                    <SmallProfile name="Aalap Goswami" role="Social Media" />
                    <SmallProfile name="Stuti Tiwari" role="Events" />
                    <SmallProfile name="Harshita Soni" role="Design" />
                    <SmallProfile name="Aditya Modani" role="Design" />
                </div>
            </section>

            {/* Footer decoration */}
            <div className="py-12 border-t border-[#d4a076]/30 bg-[#f8f5e6] text-center">
                <div className="flex justify-center gap-8 mb-6">
                    <SocialLink href="mailto:literarysociety@jklu.edu.in" icon={<Send />} label="Email" />
                    <SocialLink href="https://www.instagram.com/literary.club.jklu" icon={<Instagram />} label="Instagram" />
                </div>
                <Quote className="w-8 h-8 text-[#2c1810]/20 mx-auto mb-4" />
                <p className="text-[#5d4037]/60 italic font-medium">"Words are our most inexhaustible source of magic."</p>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionHeader({ title, subtitle, center }: any) {
    return (
        <div className={`mb-12 ${center ? 'text-center' : ''}`}>
            <h4 className="text-[#8b5a2b] font-sans text-xs font-bold uppercase tracking-[0.2em] mb-3">{subtitle}</h4>
            <h2 className="text-4xl md:text-5xl font-black text-[#2c1810] mb-4">{title}</h2>
            <div className={`w-16 h-1 bg-[#2c1810] ${center ? 'mx-auto' : ''}`}></div>
        </div>
    );
}

function ActivityRow({ icon, title, desc }: any) {
    return (
        <div className="flex items-start gap-4 p-4 border-b border-[#2c1810]/10 hover:bg-[#2c1810]/5 transition-colors">
            <div className="text-[#8b5a2b] mt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-[#2c1810] text-lg">{title}</h4>
                <p className="text-[#5d4037] text-sm">{desc}</p>
            </div>
        </div>
    );
}

function ArchiveItem({ title, date, desc }: any) {
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-[#2c1810] text-lg italic">{title}</h4>
                <span className="text-sm font-sans font-bold text-[#8b5a2b]">{date}</span>
            </div>
            <p className="text-[#4a3b32] text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function EventCard({ title, date, desc, icon, highlight }: any) {
    return (
        <div className={`relative p-8 border ${highlight ? 'border-[#8b5a2b]' : 'border-[#2c1810]/20'} bg-[#fffef5] shadow-lg group hover:-translate-y-1 transition-transform duration-300`}>
            {highlight && <div className="absolute top-0 right-0 px-3 py-1 bg-[#8b5a2b] text-[#fffef5] text-xs font-sans font-bold uppercase">Featured</div>}

            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${highlight ? 'bg-[#8b5a2b] text-[#fffef5]' : 'bg-[#eecfa1]/30 text-[#5d4037]'}`}>
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-[#2c1810] mb-2">{title}</h3>
            <div className="flex items-center gap-2 text-sm font-sans font-bold text-[#8b5a2b] mb-4 uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> {date}
            </div>
            <p className="text-[#4a3b32] leading-relaxed">{desc}</p>
        </div>
    );
}

function PortraitCard({ name, role, initial, image }: any) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-40 bg-[#eecfa1]/20 border border-[#2c1810]/20 mb-6 flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Vintage Frame Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#2c1810]"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#2c1810]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#2c1810]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#2c1810]"></div>

                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-6xl font-serif text-[#2c1810]/10 font-black group-hover:scale-110 transition-transform duration-500">{initial}</span>
                )}
            </div>
            <h3 className="text-xl font-bold text-[#2c1810] mb-1 italic">{name}</h3>
            <p className="text-[#8b5a2b] text-xs font-sans font-bold uppercase tracking-widest">{role}</p>
        </div>
    );
}

function SmallProfile({ name, role }: any) {
    return (
        <div className="text-center p-4 border border-[#2c1810]/5 hover:border-[#2c1810]/20 transition-colors bg-[#fffef5]">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#2c1810]/5 flex items-center justify-center mb-3">
                <User className="w-5 h-5 text-[#5d4037]" />
            </div>
            <h4 className="font-bold text-[#2c1810] text-sm mb-1">{name}</h4>
            <p className="text-[#8b5a2b] text-[10px] font-sans uppercase tracking-wide">{role}</p>
        </div>
    );
}

function SocialLink({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#5d4037] hover:text-[#2c1810] transition-colors font-sans font-bold text-sm uppercase tracking-wide"
        >
            {icon} {label}
        </a>
    );
}

import { Mic as MicIcon, Instagram as InstaIcon } from 'lucide-react';
// Re-export or redefine to avoid conflicts if needed, but imported directly above.
function Mic() { return <MicIcon className="w-5 h-5" />; }
function Instagram() { return <InstaIcon className="w-5 h-5" />; }

