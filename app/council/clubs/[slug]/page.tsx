'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { format } from 'date-fns';
import Image from 'next/image';
import { Calendar, MapPin, Users, Mail, User, Info, ChevronLeft } from 'lucide-react';
import { getClubLogo } from '@/lib/club-assets';
import Link from 'next/link';
import ClubEventCard from '@/components/ClubEventCard';

const getThemeColor = (str: string) => {
    const n = str.toLowerCase();
    if (n.includes('tech') || n.includes('code')) return { primary: '#3B82F6', gradient: 'from-blue-600 to-indigo-600' };
    if (n.includes('art') || n.includes('design') || n.includes('drama')) return { primary: '#F97316', gradient: 'from-orange-500 to-red-600' };
    if (n.includes('music') || n.includes('dance')) return { primary: '#F59E0B', gradient: 'from-amber-500 to-orange-600' };
    if (n.includes('sport')) return { primary: '#EF4444', gradient: 'from-red-600 to-orange-700' };
    return { primary: '#3B82F6', gradient: 'from-blue-500 to-cyan-500' };
};

export default function ClubDetailPage() {
    const params = useParams();
    const [club, setClub] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<any>({ primary: '#3B82F6', gradient: 'from-blue-600 to-indigo-600' });

    useEffect(() => {
        api.get(`/api/council/clubs/${params.slug}`)
            .then(res => {
                const c = res.data.club || res.data;
                setClub(c);
                if (c) setTheme(getThemeColor(c.name));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params.slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-nexus-camel/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    if (!club) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-nexus-linen mb-4">Club not found</h2>
            <Link href="/council/clubs" className="text-[var(--primary)] hover:underline">Back to Clubs</Link>
        </div>
    );

    return (
        <div className="min-h-screen relative pb-20">
            <div className="glow-orb w-[600px] h-[600px] -top-48 -right-48 bg-blue-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[600px] h-[600px] -bottom-48 -left-48 bg-orange-500" style={{ opacity: 0.06 }} />

            {/* Dynamic Header */}
            <div className="relative pt-24 pb-20 px-4 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)]" />

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <Link href="/council/clubs" className="absolute top-[-40px] left-0 text-nexus-camel hover:text-nexus-linen flex items-center transition-colors text-sm">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Clubs
                    </Link>

                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-nexus-camel/20 shadow-2xl relative overflow-hidden group">
                        {getClubLogo(club.slug) ? (
                            <div className="relative w-full h-full p-4 group-hover:scale-110 transition-transform duration-500">
                                <Image src={getClubLogo(club.slug)!} alt={`${club.name} logo`} fill className="object-contain drop-shadow-lg" />
                            </div>
                        ) : (
                            <Users className="w-16 h-16 text-nexus-camel" />
                        )}
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-nexus-linen">{club.name}</h1>
                        {club.council_name && (
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-nexus-camel/20 backdrop-blur-md">
                                <span className="text-sm font-medium text-nexus-camel">Part of <span className="text-nexus-linen font-bold">{club.council_name}</span></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-nexus-linen mb-6 flex items-center">
                                <Info className="w-6 h-6 mr-3" style={{ color: theme.primary }} /> About Us
                            </h2>
                            <p className="text-nexus-camel text-lg leading-relaxed whitespace-pre-wrap">
                                {club.description || "No description provided yet."}
                            </p>
                        </div>

                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-nexus-linen mb-6 flex items-center">
                                <Calendar className="w-6 h-6 mr-3" style={{ color: theme.primary }} /> Upcoming Events
                            </h2>
                            {club.events && club.events.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {club.events.map((event: any) => (
                                        <ClubEventCard key={event.id || event._id} id={event.id || event._id} title={event.title} date={event.start_date || event.date} venue={event.venue} imageUrl={event.image_url} status={event.status} desc={event.description} is_enrolled={event.is_enrolled} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-nexus-camel/10">
                                    <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                    <p className="text-white/30 font-medium">No upcoming events scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Leadership */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-nexus-linen mb-6 border-b border-nexus-camel/20 pb-4">Leadership Team</h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'Chairperson', person: club.chair_name, email: club.chair_email },
                                    { title: 'Co-Chairperson', person: club.co_chair_name, email: club.co_chair_email },
                                    { title: 'Secretary', person: club.secretary_name, email: club.secretary_email },
                                    { title: 'General Secretary', person: club.general_secretary_name, email: club.general_secretary_email },
                                ].map((role, idx) => role.person && (
                                    <div key={idx} className="flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-nexus-linen shrink-0 bg-gradient-to-br from-white/5 to-white/10 border border-nexus-camel/20">
                                            <User className="w-4 h-4 text-nexus-camel group-hover:text-nexus-linen transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-0.5">{role.title}</p>
                                            <p className="font-bold text-nexus-khaki group-hover:text-nexus-linen transition-colors">{role.person}</p>
                                            {role.email && <a href={`mailto:${role.email}`} className="text-xs text-[var(--primary)] hover:underline mt-0.5 block">{role.email}</a>}
                                        </div>
                                    </div>
                                ))}
                                {(!club.chair_name && !club.secretary_name) && (
                                    <p className="text-white/30 italic text-center py-4">Leadership information updating...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
