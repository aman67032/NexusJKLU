'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Calendar, Users, Info, ChevronRight, Gavel, BookOpen, Heart, Activity, Award, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ClubEventCard from '@/components/ClubEventCard';

const councilRoster: Record<string, { genSec: any; sec: any }> = {
    'academic-affairs': { genSec: { name: 'Kopal Jain', image: '/Photoes ID CARD Student Council/kopaljain_gensec_academicaffairs.jpg', phone: '8839921638', id: '2023btech044' }, sec: { name: 'Bhupathi Likhitha', image: null, phone: '6304774047', id: '2024btech218' } },
    'cultural-affairs': { genSec: { name: 'Divya Krishnani', image: '/Photoes ID CARD Student Council/Divya Krishnani.jpeg', phone: '7800879161', id: '2023bdes019' }, sec: { name: 'Rishika Singh', image: '/Photoes ID CARD Student Council/Rishika Singh.jpg', phone: '7300118679', id: '2024btech168' } },
    'campus-life': { genSec: { name: 'Aman Gupta', image: '/Photoes ID CARD Student Council/Aman Gupta.jpg', phone: '8950739040', id: '2024btech162' }, sec: { name: 'Aditya Nayak', image: '/Photoes ID CARD Student Council/Aditya Nayak.jpg', phone: '9116727168', id: '2024btech032' } },
    'technical-affairs': { genSec: { name: 'Suryaansh Sharma', image: '/Photoes ID CARD Student Council/suryaansh(genSecTech).jpeg', phone: '6376905585', id: '2023btech086' }, sec: { name: 'Aman Pratap Singh', image: null, phone: '9456608637', id: '2024bTech136' } },
    'sports-affairs': { genSec: { name: 'Ishaan Saraswat', image: '/Photoes ID CARD Student Council/Ishaan_Saraswat.webp', phone: '9772134536', id: '2022btech042' }, sec: { name: 'Aman Prakash', image: '/Photoes ID CARD Student Council/Aman Prakash (sports secretary)jpg.jpg', phone: '7033676488', id: '2024btech021' } },
    'public-relations': { genSec: { name: 'Diya Garg', image: '/Photoes ID CARD Student Council/Diya Garg.webp', phone: '7296859397', id: '2023btech027' }, sec: { name: 'Vaishnavi Shukla', image: '/Photoes ID CARD Student Council/Vaishnavi Shukla.jpg', phone: '8769276288', id: '2024btech143' } },
};

const getCouncilIcon = (slug: string) => {
    if (slug.includes('technical')) return <Gavel className="w-12 h-12" />;
    if (slug.includes('cultural')) return <Heart className="w-12 h-12" />;
    if (slug.includes('academic')) return <BookOpen className="w-12 h-12" />;
    if (slug.includes('sports')) return <Activity className="w-12 h-12" />;
    if (slug.includes('campus')) return <Users className="w-12 h-12" />;
    if (slug.includes('public')) return <Megaphone className="w-12 h-12" />;
    return <Award className="w-12 h-12" />;
};

export default function CouncilDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [council, setCouncil] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/council/councils/${slug}`).then(res => setCouncil(res.data.council || res.data)).catch(console.error).finally(() => setLoading(false));
    }, [slug]);

    if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="flex gap-2"><div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-bounce" /><div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:100ms]" /><div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:200ms]" /></div></div>);
    if (!council) return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-3xl font-bold text-white mb-4">Council Not Found</h2><Link href="/council/councils" className="text-[var(--primary)] font-bold hover:underline">Return to Councils</Link></div></div>);

    const leaders = councilRoster[slug];
    const icon = getCouncilIcon(slug);

    return (
        <div className="min-h-screen relative pb-20">
            <div className="glow-orb w-[600px] h-[600px] -top-48 -right-48 bg-indigo-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[600px] h-[600px] -bottom-48 -left-48 bg-[var(--primary)]" style={{ opacity: 0.04 }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
                <Link href="/council/councils" className="inline-flex items-center text-white/30 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Councils
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center gap-8 mb-16">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[var(--primary)] to-orange-600 rounded-2xl rotate-3 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.15)] border-2 border-white/10 shrink-0">
                        <div className="w-full h-full bg-[var(--background)] rounded-[14px] flex items-center justify-center text-white">{icon}</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-[var(--primary)] mb-4">Student Council</div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">{council.name}</h1>
                    </div>
                </motion.div>

                {/* Leadership */}
                {leaders && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {[{ data: leaders.genSec, role: 'General Secretary', color: 'emerald' }, { data: leaders.sec, role: 'Secretary', color: 'blue' }].map(({ data, role, color }) => (
                            <div key={role} className="relative glass-card p-6 flex items-center gap-6 overflow-hidden group">
                                <div className={`absolute inset-0 bg-${color}-500/5 group-hover:bg-${color}-500/10 transition-colors`} />
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative z-10 overflow-hidden shrink-0">
                                    {data.image ? <img src={data.image} alt={data.name} className="w-full h-full object-cover" /> : <span className={`text-${color}-500 font-bold text-xl`}>{data.name.charAt(0)}</span>}
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-1">{data.name}</h3>
                                    <div className="flex items-center gap-2 mb-2"><span className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`} /><p className="text-white/30 text-xs font-bold uppercase tracking-widest">{role}</p></div>
                                    <div className="text-xs text-white/20 font-mono space-y-1">{data.phone && <p>Ph: {data.phone}</p>}{data.id && <p>ID: {data.id}</p>}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Info className="text-[var(--primary)]" /> About the Council</h2>
                            <p className="text-white/40 leading-relaxed text-lg whitespace-pre-wrap">{council.description || "Leading the charge in student representation and activities."}</p>
                        </div>

                        {council.clubs && council.clubs.length > 0 && (
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Users className="text-[var(--primary)]" /> Active Clubs</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {council.clubs.map((club: any) => (
                                        <Link href={`/council/clubs/${club.slug}`} key={club.id || club._id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/30 group-hover:text-[var(--primary)] transition-colors"><Users className="w-4 h-4" /></div><span className="font-bold text-white/80 group-hover:text-white transition-colors">{club.name}</span></div>
                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Calendar className="text-[var(--primary)]" /> Council Events</h2>
                            {council.events && council.events.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {council.events.map((event: any) => (<ClubEventCard key={event.id || event._id} id={event.id || event._id} title={event.title} date={event.start_date || event.date} venue={event.venue} imageUrl={event.image_url} status={event.status} desc={event.description} is_enrolled={event.is_enrolled} />))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed"><Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" /><p className="text-white/30 font-medium">No upcoming council events.</p></div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1" />
                </div>
            </div>
        </div>
    );
}
