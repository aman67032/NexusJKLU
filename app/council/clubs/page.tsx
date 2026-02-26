'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ChevronRight, Search, Code, Palette, Music, Trophy, Cpu, Building2, Award, Calendar, UserCircle } from 'lucide-react';
import { getClubLogo } from '@/lib/club-assets';

const subNav = [
    { href: '/council', label: 'Overview', icon: Building2 },
    { href: '/council/clubs', label: 'Clubs', icon: Users },
    { href: '/council/councils', label: 'Councils', icon: Award },
    { href: '/council/events', label: 'Events', icon: Calendar },
    { href: '/council/coordinators', label: 'Coordinators', icon: UserCircle },
];

export default function ClubsPage() {
    const [clubs, setClubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get('/api/council/clubs')
            .then(res => setClubs(res.data.clubs || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = clubs.filter(club =>
        club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getClubTheme = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('tech') || n.includes('code') || n.includes('cyber')) return { icon: <Cpu />, gradient: 'from-blue-600 to-indigo-600' };
        if (n.includes('art') || n.includes('design') || n.includes('drama')) return { icon: <Palette />, gradient: 'from-orange-500 to-red-600' };
        if (n.includes('music') || n.includes('dance')) return { icon: <Music />, gradient: 'from-amber-500 to-orange-600' };
        if (n.includes('sport') || n.includes('game')) return { icon: <Trophy />, gradient: 'from-red-600 to-orange-700' };
        return { icon: <Users />, gradient: 'from-blue-500 to-cyan-500' };
    };

    const displayedSlugs = new Set();
    const uniqueFiltered = filtered.reduce((acc: any[], club) => {
        let d = { ...club };
        if (club.slug === 'astro-club') { d.name = 'Astronomy Club'; d.slug = 'astronomy-club'; }
        if (club.slug === 'business-club') d.name = 'Corpova';
        if (!displayedSlugs.has(d.slug)) { displayedSlugs.add(d.slug); acc.push(d); }
        return acc;
    }, []);

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[600px] h-[600px] -top-48 -right-48 bg-blue-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[600px] h-[600px] -bottom-48 -left-48 bg-orange-500" style={{ opacity: 0.06 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-nexus-camel/20 bg-white/5 backdrop-blur-md text-sm font-medium text-nexus-camel">
                        Explore Communities
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-nexus-linen">
                        Student <span className="gradient-text-orange">Clubs</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-nexus-camel leading-relaxed max-w-2xl mx-auto text-lg text-nexus-camel leading-relaxed mb-10">
                        Join diverse communities, discover your passions, and attend exclusive events. Find your tribe at JKLU.
                    </p>

                    {/* Sub Navigation */}
                    <div className="mb-10 z-20 relative">
                        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
                            <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-max min-w-full md:min-w-0 md:justify-center mx-auto backdrop-blur-md">
                                {subNav.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = item.href === '/council/clubs';
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                                ? 'bg-orange-500/15 text-orange-400 font-bold'
                                                : 'text-nexus-camel hover:text-nexus-khaki hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-10 max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-white/5 border border-nexus-camel/20 rounded-2xl p-2 backdrop-blur-xl transition-all duration-300 group-hover:border-nexus-camel/30 focus-within:border-[var(--primary)]/50">
                            <Search className="ml-4 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search for clubs..."
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-nexus-linen placeholder-white/30 px-4 py-3 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-nexus-camel/20 border-t-[var(--primary)] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {uniqueFiltered.map((club: any, index: number) => {
                            const theme = getClubTheme(club.name);
                            return (
                                <Link
                                    href={`/council/clubs/${club.slug}`}
                                    key={club.slug + index}
                                    className="group relative h-[420px] bg-white/[0.03] border border-nexus-camel/10 rounded-3xl overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--primary)]/10 flex flex-col"
                                >
                                    {/* Gradient BG */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className={`absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br ${theme.gradient} blur-[100px] rounded-full opacity-20`} />
                                    </div>

                                    {/* Logo */}
                                    <div className="relative p-8 pb-0 pt-10">
                                        {getClubLogo(club.slug) ? (
                                            <div className="w-20 h-20 relative mb-6 group-hover:scale-110 transition-transform duration-500">
                                                <Image src={getClubLogo(club.slug)!} alt={`${club.name} logo`} fill className="object-contain drop-shadow-lg" />
                                            </div>
                                        ) : (
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-nexus-linen shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                                {theme.icon}
                                            </div>
                                        )}
                                        {club.council_name && (
                                            <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-white/5 border border-nexus-camel/20 text-[10px] font-bold tracking-wider text-nexus-camel uppercase backdrop-blur-md">
                                                {club.council_name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="relative p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-nexus-linen mb-3 group-hover:text-[var(--primary)] transition-colors">{club.name}</h3>
                                        <p className="text-white/30 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {club.description || 'A community for like-minded individuals to innovate, create, and grow together.'}
                                        </p>
                                        <div className="pt-6 border-t border-nexus-camel/10 flex items-center justify-between mt-auto">
                                            <span className="text-xs font-bold text-white/20 uppercase tracking-widest group-hover:text-nexus-camel transition-colors">View Club</span>
                                            <div className={`w-10 h-10 rounded-full border border-nexus-camel/20 flex items-center justify-center text-nexus-linen bg-white/5 group-hover:bg-gradient-to-r ${theme.gradient} group-hover:border-transparent transition-all duration-300`}>
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && uniqueFiltered.length === 0 && (
                    <div className="text-center py-20">
                        <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-nexus-linen mb-2">No clubs found</h3>
                        <p className="text-white/30">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}
