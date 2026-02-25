'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Sprout, Users, Heart, HandHeart, Globe, Calendar, Instagram, Leaf, Droplets, BookOpen, Sun, Mountain, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function CDCPage() {
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
            const response = await api.get('/api/council/clubs/community-development-club');
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
        alert(`Thank you for volunteering with UDGAM, ${user.name}! Let's make a difference together.`);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F0FDF4] text-slate-800 font-sans selection:bg-green-500 selection:text-white overflow-x-hidden relative">
            
            {/* --- HERO SECTION --- */}
            <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
                {/* Background Nature Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/50 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px]"></div>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 mb-8"
                >
                    <div className="relative w-64 h-64 mx-auto mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/logos/Udgam (With BG).png"
                            alt="UDGAM Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm tracking-widest uppercase mb-4 border border-green-200">
                        Community Development Club
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-6">
                        UDGAM
                    </h1>
                    <p className="text-2xl md:text-3xl font-serif italic text-green-700 mb-8">
                        "Change Begins With Us"
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10">
                        A student-driven initiative committed to creating meaningful social impact through service, awareness, and action.
                        We aim to develop socially responsible leaders who contribute positively to society.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleJoin}
                            className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2 ${joined ? 'bg-slate-800 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            {joined ? <Heart className="fill-white w-5 h-5" /> : <HandHeart className="w-5 h-5" />}
                            {joined ? 'Volunteer Registered' : 'Become a Volunteer'}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* --- VISION & MISSION --- */}
            <section className="relative z-10 py-24 bg-white/80 backdrop-blur-sm border-y border-green-100">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <Sprout className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Vision</h2>
                    <blockquote className="text-3xl font-light text-slate-700 italic max-w-4xl mx-auto leading-relaxed">
                        â€œTo create socially responsible individuals who actively contribute to the sustainable development and well-being of communities.â€
                    </blockquote>
                </div>
            </section>

            {/* --- WHAT WE DO (Activities) --- */}
            <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-[#F0FDF4] to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Our Impact Areas</h2>
                        <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ActivityCard icon={<Leaf />} title="Environmental" desc="Tree plantations, cleanliness drives, and sustainability campaigns." color="green" />
                        <ActivityCard icon={<BookOpen />} title="Education" desc="Teaching underprivileged children and supporting staff education." color="blue" />
                        <ActivityCard icon={<Heart />} title="Social Welfare" desc="Donation drives, relief activities, and community support." color="red" />
                        <ActivityCard icon={<Megaphone />} title="Awareness" desc="Outreach programs for health, hygiene, and social issues." color="orange" />
                    </div>
                </div>
            </section>

            {/* --- EVENTS --- */}
            <section className="relative z-10 py-24 px-4 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Past Events */}
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                <span className="p-2 bg-slate-200 rounded-lg"><Calendar className="w-5 h-5" /></span>
                                Steps Taken (Past Events)
                            </h3>
                            <div className="space-y-6">
                                <EventItem
                                    title="Plantation Drives"
                                    desc="Organized tree plantation campaigns to promote environmental awareness and sustainability."
                                    icon={<Leaf className="text-green-600" />}
                                />
                                <EventItem
                                    title="Winter Donation Drive"
                                    desc="Collected and distributed clothes to underprivileged people during winter to support those in need."
                                    icon={<Heart className="text-red-500 fill-red-500" />}
                                />
                                <EventItem
                                    title="Daily Teaching Program"
                                    desc="Established a regular teaching facility for underprivileged children in nearby rural areas."
                                    icon={<BookOpen className="text-blue-600" />}
                                />
                                <EventItem
                                    title="Staff Children Education"
                                    desc="Provided daily educational support to the children of helping and domestic staff of the college."
                                    icon={<Users className="text-orange-600" />}
                                />
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                <span className="p-2 bg-green-100 text-green-700 rounded-lg"><Sun className="w-5 h-5" /></span>
                                The Path Ahead (Upcoming)
                            </h3>
                            {loadingEvents ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : events.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
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
                                            color="text-green-600"
                                            bg="bg-green-50"
                                            border="group-hover:border-green-400"
                                            is_enrolled={event.is_enrolled}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                    <Leaf className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No upcoming paths currently mapped.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LEADERSHIP --- */}
            <section className="relative z-10 py-24 px-4 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">The Torchbearers</h2>
                        <p className="text-slate-500">Dedicated individuals leading the change</p>
                    </div>

                    {/* Chair & Co-Chair */}
                    <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
                        <LeaderCard
                            name="Harshal Bhansali"
                            role="Chairperson"
                            image="/Photoes ID CARD Student Council/Harshal Bhansali.jpg"
                        />
                        <LeaderCard
                            name="Heramb Sharma"
                            role="Co-Chairperson"
                            image="/Photoes ID CARD Student Council/Heramb Sharma.jpg"
                        />
                    </div>

                    {/* Coordinators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <CoordinatorCard name="Ansh Gupta" role="Photography" />
                        <CoordinatorCard name="Yojit Hitesh Lohar" role="Management" />
                        <CoordinatorCard name="Hansika Agarwal" role="Event Coord" />
                        <CoordinatorCard name="Vaishali Singhania" role="Event Coord" />
                        <CoordinatorCard name="Harshwardan" role="Logistics" />
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 bg-slate-900 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-green-400" />
                    <span className="font-bold tracking-widest uppercase">UDGAM CDC</span>
                </div>
                <div className="flex justify-center gap-6 mb-8">
                    <a href="https://instagram.com/UDGAM_JKLU" target="_blank" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                        <Instagram className="w-5 h-5" /> @UDGAM_JKLU
                    </a>
                </div>
                <p className="text-slate-500 text-sm">Note: The CDC club is independent of any council.</p>
            </footer>
        </div>
    );
}

// --- COMPONENTS ---

function ActivityCard({ icon, title, desc, color }: any) {
    const colorClasses: any = {
        green: "bg-green-50 text-green-600 border-green-200 hover:border-green-400",
        blue: "bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400",
        red: "bg-red-50 text-red-600 border-red-200 hover:border-red-400",
        orange: "bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400"
    };

    return (
        <div className={`p-6 rounded-2xl border ${colorClasses[color]} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function EventItem({ title, desc, icon }: any) {
    return (
        <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="shrink-0 pt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function UpcomingEventCard({ title, subtitle, desc }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-md">
            <h4 className="text-lg font-bold text-slate-900">{title}</h4>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 block">{subtitle}</span>
            <p className="text-slate-600 text-sm">{desc}</p>
        </div>
    );
}

function LeaderCard({ name, role, image }: any) {
    return (
        <div className="w-full md:w-64 bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center group hover:bg-white hover:shadow-xl transition-all">
            <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <Users className="w-10 h-10 text-slate-400" />
                )}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{name}</h3>
            <p className="text-green-600 text-xs font-bold uppercase tracking-widest mt-1">{role}</p>
        </div>
    );
}

function CoordinatorCard({ name, role }: any) {
    return (
        <div className="p-4 bg-white border border-slate-100 rounded-xl text-center hover:border-green-200 transition-colors">
            <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
            <p className="text-slate-500 text-xs mt-1">{role}</p>
        </div>
    );
}

