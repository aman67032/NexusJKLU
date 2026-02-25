'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Moon, Star, Sun, Telescope, Rocket, Users, Calendar, MapPin, Send, Instagram, ArrowUpRight, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { div } from 'framer-motion/client';

import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';
import Image from 'next/image';

export default function AstronomyClubPage() {
    const { user } = useAuth();
        const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [joined, setJoined] = useState(false);
    const { scrollY } = useScroll();
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    // Parallax stars
    const yStars = useTransform(scrollY, [0, 1000], [0, 300]);
    const yPlanets = useTransform(scrollY, [0, 1000], [0, 100]);

    useEffect(() => {
        setMounted(true);
                fetchClubEvents();
    }, []);

    const fetchClubEvents = async () => {
        try {
            const response = await api.get('/api/council/clubs/astronomy-club');
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
        <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden relative">
            {/* Starfield Background */}
            {/* Starfield Background with Improved Galaxy Effect */}
            <div className="fixed inset-0 z-0 bg-[#020617]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#020617] to-[#020617]"></div>

                {/* Nebula Effects mimicking the reference image */}
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-pink-600/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-[20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow delay-1000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow delay-2000"></div>
            </div>

            {/* Animated Stars (CSS based for performance) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-70"
                        initial={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            opacity: Math.random() * 0.5 + 0.3
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            
            {/* --- HERO SECTION: THE COSMOS --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center overflow-hidden">

                {/* Hero Background Image */}
                <div className="absolute inset-0 z-[-1] opacity-60">
                    <Image
                        src="/Clubs/astro_club/bg.png"
                        alt="Cosmic Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050B14]/80 via-transparent to-[#050B14] mix-blend-multiply"></div>
                </div>

                {/* Floating Planet Element */}
                <motion.div
                    style={{ y: yPlanets }}
                    className="absolute top-20 right-[-100px] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
                ></motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-4 border border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="relative w-100 h-100">
                            <Image
                                src="/Clubs/astro_club/gallery/logo.png"
                                alt="Nakshatra Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <span className="text-blue-400 font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Astronomy Club</span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
                        NAKSHATRA
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed mb-4">
                        Unlock the <span className="text-purple-400 font-bold">Cosmos</span> with Us
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 mt-8"
                >
                    <button
                        onClick={handleJoin}
                        className={`group relative px-8 py-3 rounded-full border border-purple-500/50 ${joined ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-purple-500/10 text-white'} font-bold tracking-widest uppercase transition-all duration-300 backdrop-blur-sm`}
                    >
                        {joined ? 'Mission Control Access' : 'Launch Journey'}
                    </button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-purple-500/50"
                >
                    <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-current rounded-full"></div>
                    </div>
                </motion.div>
            </div>

            {/* --- SECTION 1: THE OBSERVATORY (Vision) --- */}
            <section className="relative z-10 py-24 border-t border-white/5 bg-[#050B14]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="Our Mission" subtitle="The Observatory" />
                        <p className="text-lg text-slate-300 leading-relaxed mb-8">
                            Club Nakshatra is dedicated to exploring the wonders of the universe and promoting the study of astronomy among the student community through state-of-the-art telescopes, binoculars, and other scientific instruments. Whether you are an amateur astronomer, a professional, or just a beginner who is intrigued by the beauty of the cosmos, the Astronomy Club is for you. We help students learn astronomy, build practical skills like telescope handling or astrophotography, and connect with others who love space.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FeatureItem icon={<Telescope />} text="Telescope Observation" />
                            <FeatureItem icon={<Moon />} text="Lunar & Planetary Watch" />
                            <FeatureItem icon={<Rocket />} text="Deep Sky Exploration" />
                            <FeatureItem icon={<Globe />} text="Scientific Understanding" />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-8 bg-[#0a1120] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-2">Technical Arsenal</h3>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-purple-500" /> Celestron LCM 114 Telescope</li>
                                    <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-purple-500" /> High-Power Binoculars</li>
                                    <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-purple-500" /> Astrophotography Gear</li>
                                    <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-purple-500" /> Star Charts & Planispheres</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: STAR LOG (Events) --- */}
            <section className="relative z-10 py-24 max-w-6xl mx-auto px-4">
                <SectionHeader title="Upcoming Celestial Events" subtitle="Star Log" center />

                <div className="mt-12">
                    {loadingEvents ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
                                    color="text-purple-400"
                                    bg="bg-purple-500/10"
                                    border="group-hover:border-purple-500/50"
                                    is_enrolled={event.is_enrolled}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-dotted border-white/10">
                            <Star className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium">No celestial events currently scheduled.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECTION 2.5: COSMIC GALLERY --- */}
            <section className="relative z-10 py-12 max-w-7xl mx-auto px-4">
                <SectionHeader title="Through The Reaches" subtitle="Gallery" center />
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mt-8">
                    {[
                        { src: "/Clubs/astro_club/gallery/gallery/image12.png", alt: "Gallery 1" },
                        { src: "/Clubs/astro_club/gallery/gallery/image13.png", alt: "Gallery 2" },
                        { src: "/Clubs/astro_club/gallery/gallery/image14.png", alt: "Gallery 3" },
                        { src: "/Clubs/astro_club/gallery/gallery/image9.png", alt: "Gallery 4" },
                        { src: "/Clubs/astro_club/gallery/gallery/image7.jpg", alt: "Gallery 5" },
                        { src: "/Clubs/astro_club/gallery/gallery/image15.jpg", alt: "Gallery 6" },
                        { src: "/Clubs/astro_club/gallery/gallery/image1.jpg", alt: "Gallery 7" },
                        { src: "/Clubs/astro_club/gallery/gallery/image3.jpg", alt: "Gallery 8" },
                        { src: "/Clubs/astro_club/gallery/gallery/image4.jpg", alt: "Gallery 9" },
                        { src: "/Clubs/astro_club/gallery/gallery/image16.png", alt: "Gallery 10" },
                    ].map((img, index) => (
                        <div key={index} className="relative rounded-2xl overflow-hidden group border border-purple-500/20 break-inside-avoid">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={500}
                                height={300}
                                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION 3: THE ASTRONOMERS (Leadership) --- */}
            <section className="relative z-10 py-24 bg-gradient-to-b from-[#050B14] to-indigo-950/20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader title="Mission Command" subtitle="Leadership" center />

                    {/* Chairs */}
                    <div className="flex flex-wrap justify-center gap-8 mb-16">
                        <CommanderCard
                            name="Aryan Gupta"
                            role="Chairperson"
                            rank="Commander"
                            image="/Clubs/astro_club/gallery/chair.jpg"
                        />
                        <CommanderCard
                            name="Vidhaan P Shah"
                            role="Co-Chairperson"
                            rank="Lt. Commander"
                            image="/Clubs/astro_club/gallery/co-chair.jpg"
                        />
                    </div>

                    {/* Coordinators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <CommanderCard
                                name="Khushi Soni"
                                role="Super Coordinator"
                                rank="Officer"
                                image="/Clubs/astro_club/gallery/Super coordinator.jpg"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <CommanderCard
                                name="Chirag Negi"
                                role="Social Media"
                                rank="Officer"
                                image="/Clubs/astro_club/gallery/Social media coordinator.jpg"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <CommanderCard
                                name="Ghyan Chechani"
                                role="Social Media"
                                rank="Officer"
                                image="/Clubs/astro_club/gallery/Social media coordinator(2).jpg"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <CommanderCard
                                name="Rishi Jangid"
                                role="Event Manager"
                                rank="Officer"
                                image="/Clubs/astro_club/gallery/Event manager.jpg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer decoration */}
            <div className="py-12 bg-[#050B14] border-t border-white/5 text-center relative z-10">
                <div className="flex justify-center gap-8 mb-6">
                    <SocialLink href="mailto:astroclub@jklu.edu.in" icon={<Send />} label="Frequency (Email)" />
                    <SocialLink href="https://www.instagram.com/nakshatra.jklu" icon={<Instagram />} label="Visuals (Insta)" />
                </div>
                <p className="text-slate-500 text-xs uppercase tracking-widest">
                    Clear Skies â€¢ Scientific Minds â€¢ Endless Exploration
                </p>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionHeader({ title, subtitle, center }: any) {
    return (
        <div className={`mb-10 ${center ? 'flex flex-col items-center' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[1px] bg-purple-500"></span>
                <span className="text-purple-400 font-mono text-xs font-bold uppercase tracking-widest">{subtitle}</span>
                <span className="w-8 h-[1px] bg-purple-500"></span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{title}</h2>
        </div>
    );
}

function FeatureItem({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors">
            <div className="text-purple-400">{icon}</div>
            <span className="text-slate-200 font-bold text-sm tracking-wide">{text}</span>
        </div>
    );
}

function EventTimelineItem({ date, title, desc, icon, highlight }: any) {
    return (
        <div className="relative pl-8 md:pl-12 group">
            <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${highlight ? 'bg-purple-500 border-purple-300' : 'bg-[#050B14] border-purple-500/50'} z-10`}></div>

            <div className={`p-6 rounded-lg border ${highlight ? 'bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/10'} hover:border-purple-500/50 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="text-purple-400">{icon}</div>
                    <span className="text-purple-400 font-mono text-xs font-bold tracking-widest">{date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CommanderCard({ name, role, rank, image }: any) {
    return (
        <div className="flex flex-col items-center p-8 bg-[#0a1120] border border-purple-500/20 rounded-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 w-80">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Hexagon Shape for "Not Circle Not Cube" */}
            <div className="w-48 h-48 mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 clip-path-polygon-[25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%]"></div>
                <div className="absolute inset-[2px] bg-[#0a1120] clip-path-polygon-[25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%] flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <Users className="w-16 h-16 text-slate-500 group-hover:text-white transition-colors" />
                    )}
                </div>
            </div>

            <div className="relative z-10 text-center">
                <div className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-2">{rank}</div>
                <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-slate-400 text-sm uppercase">{role}</p>
            </div>
        </div>
    );
}

function OfficerCard({ name, role }: any) {
    return (
        <div className="text-center p-4 border border-white/5 hover:bg-white/5 transition-colors rounded-lg">
            <h4 className="font-bold text-white text-sm mb-1">{name}</h4>
            <p className="text-purple-400 text-[10px] uppercase tracking-wide">{role}</p>
        </div>
    );
}

function SocialLink({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-mono text-xs uppercase tracking-wide"
        >
            {icon} {label}
        </a>
    );
}

