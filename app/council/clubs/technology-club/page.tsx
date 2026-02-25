'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Cpu, Github, Globe, Shield, Terminal, User, Users, Zap, Radio, ChevronRight, Bell, Pin, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Hyperspeed from '@/components/techclubbg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function TechnologyClubPage() {
    const { user, login } = useAuth();
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
            // Fetch club data by slug to get events
            const response = await api.get('/api/council/clubs/technology-club');
            if (response.data.club && response.data.club.events) {
                setEvents(response.data.club.events);
            }
        } catch (error) {
            console.error('Error fetching club events:', error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleJoin = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        // Logic to update database that user is in this club
        setJoined(true);
        alert(`Welcome to the Tech Club, ${user.name}! You have successfully joined.`);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden relative bg-[#050510]">
            {/* Fixed Background for entire page */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <Hyperspeed
                    effectOptions={{ "distortion": "turbulentDistortion", "length": 400, "roadWidth": 10, "islandWidth": 2, "lanesPerRoad": 3, "fov": 90, "fovSpeedUp": 150, "speedUp": 2, "carLightsFade": 0.4, "totalSideLightSticks": 20, "lightPairsPerRoadWay": 40, "shoulderLinesWidthPercentage": 0.05, "brokenLinesWidthPercentage": 0.1, "brokenLinesLengthPercentage": 0.5, "lightStickWidth": [0.12, 0.5], "lightStickHeight": [1.3, 1.7], "movingAwaySpeed": [60, 80], "movingCloserSpeed": [-120, -160], "carLightsLength": [12, 80], "carLightsRadius": [0.05, 0.14], "carWidthPercentage": [0.3, 0.5], "carShiftX": [-0.8, 0.8], "carFloorSeparation": [0, 5], "colors": { "roadColor": 0x050510, "islandColor": 0x0a0a20, "background": 0x050510, "shoulderLines": 0xff6600, "brokenLines": 0x0088ff, "leftCars": [0xff0000, 0xff8800, 0xff4400], "rightCars": [0x0088ff, 0x0044ff, 0x00ccff], "sticks": 0xff6600 } }}
                />
            </div>


            {/* --- HERO SECTION --- */}
            {/* Added pt-32 to push content below the fixed/floating navbar */}
            <div className="relative min-h-[95vh] flex items-center justify-center pt-32 overflow-hidden">
                {/* Background removed, now utilizing fixed page background */}

                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
                    {/* Tech Club Logo */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full overflow-hidden border-4 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.4)] animate-fade-in-up hover:scale-105 transition-transform duration-500 bg-black">
                        <Image
                            src="/logos/TechClub (With BG).png"
                            alt="Tech Club Logo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-950/30 border border-blue-500/30 backdrop-blur-md mb-8 animate-fade-in-up shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]"></span>
                        <span className="text-sm font-bold tracking-widest text-blue-200 uppercase">Council of Technical Affairs</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-900/50 animate-title drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        TECHNOLOGY
                    </h1>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 mb-8 drop-shadow-[0_0_30px_rgba(249,115,22,0.2)] animate-title delay-100">
                        CLUB
                    </h2>

                    <p className="text-xl md:text-2xl font-light text-slate-300 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-200 leading-relaxed">
                        Letâ€™s Discover <span className="text-orange-400 font-semibold drop-shadow-glow">Technology</span> Together. <br />
                        <span className="text-slate-500 text-lg mt-2 block">Innovate â€¢ Build â€¢ Inspire</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300">
                        <button
                            onClick={handleJoin}
                            className={`group relative px-8 py-4 ${joined ? 'bg-green-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white font-bold text-lg rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] overflow-hidden`}
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine"></div>
                            <span className="relative z-10">{joined ? 'Joined Community' : 'Join Community'}</span>
                        </button>
                        <button onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 backdrop-blur-md text-orange-400 font-bold text-lg rounded-full hover:bg-slate-700/50 hover:border-orange-500/30 transition-all shadow-lg hover:shadow-orange-500/10">
                            View Events
                        </button>
                    </div>
                </div>
            </div>

            {/* --- LEADERSHIP SECTION (Moved Up & Restructured) --- */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-blue-500/20"></div>

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                        <span className="text-orange-500">///</span> LEADERSHIP <span className="text-blue-500">///</span>
                    </h2>
                    <p className="text-slate-400">The minds executing the vision</p>
                </div>

                {/* Top Tier: Chair & Co-Chair */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-16">
                    <LeaderCardHighPriority
                        role="Club Chairperson"
                        name="Yash Mishra"
                        color="orange"
                        imageSrc="/Clubs/tech_club/club_chair.png"
                    />
                    <LeaderCardHighPriority
                        role="Club Co-Chair"
                        name="Rashi Katiyar"
                        color="blue"
                        imageSrc="/Clubs/tech_club/Club_Co_Chair .jpg"
                    />
                </div>

                {/* Divider */}
                <div className="relative h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mb-16">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050510] border border-orange-500/50 rotate-45"></div>
                </div>

                {/* Second Tier: Coordinators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <LeaderCard
                        role="Super Co-ordinator"
                        name="Tejendra Singh"
                        imageSrc="/Clubs/tech_club/Club Super co-ordinator .jpg"
                    />
                    <LeaderCard
                        role="Social Media Co-ord"
                        name="Pawani Sharma"
                        imageSrc="/Clubs/tech_club/Club Social media co-ordinator .jpg"
                    />
                    <LeaderCard
                        role="Social Media Co-ord"
                        name="Abhimanyu"
                        imageSrc="/Clubs/tech_club/Club Social media co-ordinator2.jpg"
                    />
                    <LeaderCard
                        role="Event Co-ordinator"
                        name="Akshat"
                        imageSrc="/Clubs/tech_club/Club Event co-ordinator .jpg"
                    />
                    <LeaderCard
                        role="Event Co-ordinator"
                        name="Arshiyaa Yadav"
                        imageSrc="/Clubs/tech_club/Club Event co-ordinator2 .jpg"
                    />
                    <LeaderCard
                        role="Outreach Co-ordinator"
                        name="Priyanshi Agnani"
                        imageSrc="/Clubs/tech_club/Club Outreach co-ordinator.jpg"
                    />
                </div>
            </section>



            {/* --- VISION & MISSION SECTION --- */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                    {/* Vision Card */}
                    <div className="group relative bg-gray-900/40 border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110 transform">
                            <Globe className="w-40 h-40 text-blue-400" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Cpu size={28} /></span>
                                Our Vision
                            </h3>
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                The Tech Club is established to inspire, educate, and empower students by creating awareness about technology and its real-world impact. Our vision is to provide a platform where students can explore emerging technologies, discover diverse career opportunities in tech, and develop practical skills beyond the classroom.
                            </p>
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className="group relative bg-gray-900/40 border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110 transform">
                            <Zap className="w-40 h-40 text-orange-400" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20"><Terminal size={28} /></span>
                                Our Mission
                            </h3>
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                We aim to cultivate curiosity, innovation, and problem-solving by encouraging hands-on learning, collaboration, and continuous growth. Through workshops, projects, and community initiatives, the Tech Club strives to shape future-ready individuals who are confident, skilled, and prepared to contribute meaningfully to the technological world.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Goal Banner */}
                <div className="mt-12 bg-gray-900/60 border border-gray-800 rounded-2xl p-10 text-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="absolute inset-0 bg-[url('/hex-pattern.svg')] opacity-5"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -translate-x-full group-hover:translate-x-full"></div>

                    <p className="text-xl md:text-3xl font-light text-slate-200 relative z-10 max-w-4xl mx-auto leading-normal">
                        "To create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500 font-bold">tech culture</span> in campus we will try our best and use the resources in the best way possible."
                    </p>
                </div>
            </section>

            {/* --- EVENTS SECTION --- */}
            <section id="events-section" className="py-24 bg-[#02050e] relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-5xl font-black mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500 drop-shadow-sm">EVENTS</span>
                                <div className="h-px w-20 bg-slate-700 hidden sm:block"></div>
                                <span className="text-2xl text-slate-500 font-mono tracking-widest">2025-26</span>
                            </h2>
                            <p className="text-slate-400 max-w-md text-lg">Join us in our upcoming workshops and sessions designed to level up your skills.</p>
                        </div>
                        <button onClick={() => router.push('/events')} className="group flex items-center gap-2 px-6 py-3 rounded-full border border-slate-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all text-sm font-medium text-orange-400">
                            View Full Schedule <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {loadingEvents ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    icon={<Calendar className="w-6 h-6" />}
                                    color={event.status === 'upcoming' ? "text-orange-400" : "text-blue-400"}
                                    bg={event.status === 'upcoming' ? "bg-orange-400/5" : "bg-blue-400/5"}
                                    border={event.status === 'upcoming' ? "group-hover:border-orange-500/50" : "group-hover:border-blue-500/50"}
                                    desc={event.description || "No description provided."}
                                    date={event.start_date}
                                    imageUrl={event.image_url}
                                    venue={event.venue}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No active events found. Stay tuned!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer decoration */}
            <div className="h-24 bg-gradient-to-t from-blue-900/10 to-transparent opacity-40"></div>
        </div>
    );
}

function EventCard({ title, icon, color, bg, border, desc, date, imageUrl, venue }: any) {
    return (
        <div className={`group p-6 rounded-3xl bg-gray-900/40 border border-gray-800 ${border} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden backdrop-blur-sm flex flex-col h-full`}>
            <div className={`absolute -right-10 -top-10 w-40 h-40 ${bg} opacity-50 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black border border-gray-800 shadow-lg ${color}`}>
                    {icon}
                </div>
                {date && (
                    <div className="text-xs font-mono text-slate-500 bg-black/50 px-3 py-1 rounded-full border border-gray-800">
                        {format(new Date(date), 'MMM d, yyyy')}
                    </div>
                )}
            </div>

            {imageUrl && (
                <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden shadow-lg border border-white/5">
                    <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-white transition-colors line-clamp-2">{title}</h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{desc}</p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                {venue && (
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {venue}
                    </span>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 border border-white/10 ${color}`}>
                    <span className="text-lg">â†’</span>
                </div>
            </div>
        </div>
    )
}

function LeaderCardHighPriority({ role, name, color, imageSrc }: { role: string, name: string, color: 'cyan' | 'blue' | 'orange', imageSrc?: string }) {
    const borderColor = color === 'orange' ? 'border-orange-500/30' : color === 'cyan' ? 'border-cyan-500/30' : 'border-blue-500/30';
    const textColor = color === 'orange' ? 'text-orange-400' : color === 'cyan' ? 'text-cyan-400' : 'text-blue-400';
    const gradientColor = color === 'orange' ? 'from-orange-500/50' : color === 'cyan' ? 'from-cyan-500/50' : 'from-blue-500/50';

    return (
        <div className={`relative group flex flex-col items-center`}>
            {/* Tech Frame Container */}
            <div className={`relative w-72 h-80 mb-6 transition-transform duration-300 group-hover:scale-105`}>
                {/* Glowing Backing */}
                <div className={`absolute -inset-1 bg-gradient-to-b ${gradientColor} to-transparent opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500`}
                    style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 80% 100%, 20% 100%, 0% 100%, 0% 20%)" }}></div>

                {/* Image Container with Tech Shape */}
                <div className={`relative w-full h-full bg-slate-900/80 backdrop-blur-sm border ${borderColor} overflow-hidden`}
                    style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)" }}>

                    {imageSrc ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={imageSrc}
                                alt={role}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <User className="w-20 h-20 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    )}

                    {/* Tech Decor Lines */}
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-${color === 'orange' ? 'orange-500' : color === 'cyan' ? 'cyan-500' : 'blue-600'}`}></div>
                    <div className={`absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 ${borderColor} rounded-tr-3xl`}></div>
                </div>
            </div>

            <h3 className={`text-2xl font-bold uppercase tracking-widest mb-1 text-white`}>{name}</h3>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] mb-2 ${textColor}`}>{role}</p>
            <p className="text-slate-500 text-xs font-mono tracking-widest">2025-26</p>
        </div>
    );
}

function LeaderCard({ role, name, imageSrc, icon }: { role: string, name?: string, imageSrc?: string, icon?: React.ReactNode }) {
    return (
        <div className="relative group overflow-hidden rounded-3xl h-96 border border-slate-800 bg-slate-900/40 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            {/* Full Background Image */}
            <div className="absolute inset-0">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={role}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        {icon || <User size={48} className="text-slate-700" />}
                    </div>
                )}
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-10 h-1 bg-blue-500 mb-3 rounded-full group-hover:w-20 transition-all duration-300"></div>
                <h4 className="text-white text-xl font-bold mb-1 leading-tight group-hover:text-blue-400 transition-colors">{name || 'Member Name'}</h4>
                <p className="text-blue-200/70 text-xs font-bold uppercase tracking-widest">{role}</p>
            </div>

            {/* Tech Corner Accent */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500/30 rounded-full group-hover:bg-blue-400 group-hover:shadow-[0_0_10px_#3b82f6] transition-all"></div>
        </div>
    )
}

