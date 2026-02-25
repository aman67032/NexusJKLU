'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Palette, Brush, User, Heart, Star, Music, Camera, ChevronRight, PenTool, Image as LucideImage, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import ArtClubBg from '@/components/ArtClubBg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import ClubEventCard from '@/components/ClubEventCard';

export default function ArtClubPage() {
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
            const response = await api.get('/api/council/clubs/art-club');
            if (response.data.club && response.data.club.events) {
                setEvents(response.data.club.events);
            }
        } catch (error) {
            console.error('Error fetching club events:', error);
        } finally {
            setLoadingEvents(false);
        }
    };

    if (!mounted) return null;

    const handleJoin = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        setJoined(true);
        alert(`Welcome to the House of Arts, ${user.name}! You are now part of our creative family.`);
    };

    return (
        <div className="min-h-screen font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden relative bg-[#FAF9F6] text-slate-800">
            {/* Fixed Background */}
            <ArtClubBg />

            
            {/* --- HERO SECTION --- */}
            <div className="relative min-h-[95vh] flex items-center justify-center pt-32 overflow-hidden">
                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
                    {/* Club Logo - Full View */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative w-56 h-56 md:w-72 md:h-72 mb-10 drop-shadow-2xl"
                    >
                        <Image
                            src="/logos/HOA (With BG).png"
                            alt="Art Club Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md mb-8 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                        <span className="text-sm font-bold tracking-widest text-pink-600 uppercase">Cultural Council</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 drop-shadow-sm pb-4">
                        HOUSE OF ARTS
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl md:text-3xl font-light text-slate-600 max-w-3xl mx-auto mb-12 italic"
                    >
                        "Where Creativity Finds a Home."
                    </motion.p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={handleJoin}
                            className={`px-10 py-4 ${joined ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-600'} text-white font-bold text-lg rounded-full hover:scale-105 transition-all shadow-xl shadow-pink-500/30 flex items-center gap-2`}
                        >
                            {joined ? <Heart className="w-5 h-5 fill-white" /> : <Brush className="w-5 h-5" />}
                            {joined ? 'Family Member' : 'Join the Family'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- LEADERSHIP --- */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 flex items-center justify-center gap-4 text-slate-800">
                        <span className="text-pink-500 text-6xl">âœ¿</span> OUR ARTISTS <span className="text-pink-500 text-6xl">âœ¿</span>
                    </h2>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto">The curators of creativity at JKLU.</p>
                </div>

                {/* Chair & Co-Chair - Special Focus with Color Splash */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-16 mb-24">
                    <LeaderCard
                        role="Chairperson"
                        name="Jigeesha Agarawal"
                        color="pink"
                        imageSrc="/Photoes ID CARD Student Council/Jigeesha Agarawal.jpg"
                    />
                    <LeaderCard
                        role="Co-Chairperson"
                        name="Mohit Suwalka"
                        color="purple"
                        imageSrc="/Photoes ID CARD Student Council/Mohit suwalka.jpg"
                    />
                </div>

                {/* Rest of the Core Team - Info Overlay Style */}
                <h3 className="text-3xl font-bold text-center mb-12 text-slate-700">Core Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <MemberCard
                        name="Saumya Agarwal"
                        role="Creative Head"
                        imageSrc="/Clubs/Art_club/Creative%20Head.jpg"
                        description="Guiding the artistic direction and inspiring creativity across all club initiatives."
                    />
                    <MemberCard
                        name="Shivam Srivastava"
                        role="Event Coordinator"
                        imageSrc="/Clubs/Art_club/Event%20Coordinator1.jpg"
                        description="Orchestrating seamless events that bring our artistic community together."
                    />
                    <MemberCard
                        name="Yuvraj Singh"
                        role="Event Coordinator"
                        imageSrc="/Clubs/Art_club/Event%20Coordinator2.jpg"
                        description="Managing logistics and ensuring every exhibition runs to perfection."
                    />
                    <MemberCard
                        name="Ayush Jaiswal"
                        role="Social Media Head"
                        imageSrc="/Clubs/Art_club/Social%20Media%20Head.jpg"
                        description="Showcasing our campus talent to the world through vibrant digital storytelling."
                    />
                    <MemberCard
                        name="Divya Malik"
                        role="Management Head"
                        imageSrc="/Clubs/Art_club/Management%20Head.jpg"
                        description="The backbone of our operations, ensuring resources and plans align perfectly."
                    />
                </div>
            </section>

            {/* --- VISION & ACTIVITIES --- */}
            <section className="relative z-30 py-24 px-4 bg-white/80 backdrop-blur-md shadow-sm my-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-4xl font-black mb-8 text-slate-800">Our Vision</h2>
                            <p className="text-lg text-slate-700 leading-relaxed mb-8 font-medium">
                                To cultivate a vibrant artistic ecosystem at JKLU where every student feels empowered to create, making art an integral part of the campus experience and professional development.
                            </p>

                            <h3 className="text-2xl font-bold mb-6 text-slate-800">What We Do</h3>
                            <ul className="space-y-4">
                                {[
                                    "Live Sketching & 'Sketch Walks'",
                                    "Art Competitions (Painting, Digital, Doodling)",
                                    "Workshops (Calligraphy, Resin Art, Photography)",
                                    "Campus Beautification (Murals & Installations)",
                                    "Collaborative Art Exhibitions"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 bg-white p-4 rounded-xl shadow-md border border-slate-100 hover:border-pink-300 transition-colors">
                                        <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
                            {/* Artistic Grid of Placeholders/Images */}
                            <div className="space-y-4 mt-8">
                                <div className="h-48 bg-purple-100 rounded-3xl overflow-hidden relative group shadow-md">
                                    <Image src="/Clubs/Art_club/event_photos/Picture10.jpg" alt="Art 1" fill className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="h-64 bg-pink-100 rounded-3xl overflow-hidden relative group shadow-md">
                                    <Image src="/Clubs/Art_club/event_photos/Picture11.jpg" alt="Art 2" fill className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-64 bg-yellow-100 rounded-3xl overflow-hidden relative group shadow-md">
                                    <Image src="/Clubs/Art_club/event_photos/Picture12.jpg" alt="Art 3" fill className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="h-48 bg-blue-100 rounded-3xl overflow-hidden relative group shadow-md">
                                    <Image src="/Clubs/Art_club/event_photos/Picture13.jpg" alt="Art 4" fill className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EVENTS SECTION --- */}
            <section className="relative z-40 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-5xl font-black mb-16 text-center text-slate-800">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">CANVAS</span> OF EVENTS
                </h2>

                <div className="space-y-24">
                    {/* Upcoming */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-700">
                            <Calendar className="text-pink-500" /> Upcoming Masterpieces
                        </h3>
                        {loadingEvents ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
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
                                        color="text-pink-500"
                                        bg="bg-pink-500/10"
                                        border="group-hover:border-pink-500/50"
                                        is_enrolled={event.is_enrolled}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-3xl border border-dotted border-slate-300">
                                <Palette className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No masterpieces currently scheduled.</p>
                            </div>
                        )}
                    </div>

                    {/* Past */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-700">
                            <LucideImage className="text-orange-500" /> Gallery of Memories
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer border-4 border-white">
                                <Image src="/Clubs/Art_club/event_photos/Picture8.jpg" alt="Sketch Walk" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                                    <h4 className="text-white text-2xl font-bold mb-2">Sketch Walk 2025</h4>
                                    <p className="text-white/80 text-sm">Capturing the soul of nature and architecture.</p>
                                </div>
                            </div>
                            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer border-4 border-white">
                                <Image src="/Clubs/Art_club/event_photos/Picture9.jpg" alt="Cafeteria" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                                    <h4 className="text-white text-2xl font-bold mb-2">Cafeteria Revamp</h4>
                                    <p className="text-white/80 text-sm">Adding colors to our daily dining.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER / CONTACT --- */}
            <footer className="relative z-50 bg-white border-t border-slate-200 py-12 text-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-8 text-slate-800">Connect With Art</h3>
                    <div className="flex justify-center gap-8 mb-8">
                        <a href="mailto:artclub@jklu.edu.in" className="flex items-center gap-2 text-slate-600 hover:text-pink-500 transition-colors">
                            <span className="font-medium">artclub@jklu.edu.in</span>
                        </a>
                        <span className="text-slate-300">|</span>
                        <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-pink-500 transition-colors">
                            <span className="font-bold">@hoa.jklu</span>
                        </a>
                    </div>
                    <p className="text-slate-400 text-sm">Â© 2025 House of Arts, JKLU</p>
                </div>
            </footer>
        </div>
    );
}

function LeaderCard({ role, name, color, imageSrc }: any) {
    return (
        <div className="flex flex-col items-center group relative cursor-pointer">
            {/* Artistic Color Splash Background using CSS Shapes */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-100 transition-transform duration-500 group-hover:scale-110 z-0`}>
                {/* SVG Splash Blob */}
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full fill-${color}-300 drop-shadow-xl opacity-80`}>
                    <path d="M42.7,-72.6C54.6,-67.2,63.1,-54.6,70.3,-41.8C77.4,-29,83.1,-15.9,82.4,-3.2C81.6,9.5,74.4,21.8,65.2,32.4C56,43,44.8,51.9,32.7,60.1C20.6,68.2,7.7,75.6,-4.2,82.8C-16.1,90.1,-27,97.3,-38.4,92.5C-49.8,87.7,-61.7,70.9,-69.5,54C-77.3,37.1,-81,20.1,-79.9,3.7C-78.7,-12.7,-72.8,-28.4,-63.3,-41.6C-53.8,-54.8,-40.7,-65.5,-27,-70.7C-13.3,-75.8,1.1,-75.4,14.7,-72.8" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="relative z-10 w-56 h-56 rounded-full overflow-hidden border-[6px] border-white shadow-2xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all bg-white">
                {imageSrc ? (
                    <Image src={imageSrc} alt={name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <User className="w-20 h-20 text-slate-400" />
                    </div>
                )}
            </div>

            <div className="relative z-20 mt-6 text-center">
                <h3 className="text-3xl font-black text-slate-900 mb-2 drop-shadow-lg shadow-white bg-white/60 backdrop-blur-sm px-4 py-1 rounded-2xl border border-white/50">{name}</h3>
                <span className={`inline-block px-5 py-2 rounded-full bg-white border-2 border-${color}-200 text-${color}-600 font-bold uppercase tracking-widest text-sm shadow-md`}>
                    {role}
                </span>
            </div>
        </div>
    );
}

function MemberCard({ name, role, imageSrc, description }: any) {
    return (
        <div className="group flex flex-col items-center">
            <div className="relative h-80 w-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-200 mb-6 border-4 border-white">
                {/* Background Image */}
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <User className="w-20 h-20 text-slate-400" />
                    </div>
                )}
            </div>

            {/* Info Below Image */}
            <div className="text-center px-4">
                <h4 className="text-2xl font-black text-slate-800 mb-2">{name}</h4>
                <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-pink-200 shadow-sm mb-3">
                    <p className="text-pink-600 font-bold text-xs uppercase tracking-widest">{role}</p>
                </div>
                {description && (
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

