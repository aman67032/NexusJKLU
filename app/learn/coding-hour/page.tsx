'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, Calendar, Sparkles, Clock, Megaphone, FileText, ChevronRight, Download, BookOpen, UserCircle } from 'lucide-react';

interface Contest { _id?: string; id?: string; course_id?: string; date: string; title?: string; description?: string; questions?: any[]; }
interface Announcement { _id?: string; id?: string; title: string; content: string; attachment_url?: string; created_at: string; }

const subNav = [
    { href: '/learn', label: 'Overview', icon: BookOpen },
    { href: '/learn/papers', label: 'Papers', icon: FileText },
    { href: '/learn/coding-hour', label: 'Coding Hour', icon: Code },
    { href: '/learn/profile', label: 'My Profile', icon: UserCircle },
];

export default function CodingHourPage() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/api/learn/contests').then(r => setContests(r.data.contests || r.data || [])).catch(() => { }),
            api.get('/api/learn/contests/announcements').then(r => setAnnouncements(r.data.announcements || r.data || [])).catch(() => { }),
        ]).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-emerald-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[500px] h-[500px] -bottom-48 -left-48 bg-teal-500" style={{ opacity: 0.04 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4">
                        <Sparkles className="w-3 h-3" /> Daily Coding Challenges
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">Coding Hour</h1>
                    <p className="text-white/40 text-lg mb-6">Challenge yourself with daily coding problems across multiple languages.</p>

                    {/* Sub Navigation */}
                    <div className="mb-0 z-20 relative">
                        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar scroll-fade-right">
                            <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-max min-w-full lg:min-w-0 backdrop-blur-md">
                                {subNav.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = item.href === '/learn/coding-hour';
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                                ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                                                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contests */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Code className="w-5 h-5 text-emerald-400" /> Challenges</h2>
                        {contests.length > 0 ? (
                            contests.map((contest, idx) => (
                                <motion.div key={contest._id || contest.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                                    <Link href={`/learn/coding-hour/${contest._id || contest.id}`} className="group glass-card p-5 flex items-center justify-between hover:border-emerald-500/30 transition-all block">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <Code className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate sm:whitespace-normal sm:line-clamp-2">{contest.title || `Challenge #${idx + 1}`}</h3>
                                                <div className="flex items-center gap-3 text-xs text-white/30 mt-1">
                                                    <span className="flex items-center gap-1.5 shrink-0">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {(() => {
                                                            try {
                                                                const d = new Date(contest.date);
                                                                if (isNaN(d.getTime())) return 'TBD';
                                                                return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                                                            } catch { return 'TBD'; }
                                                        })()}
                                                    </span>
                                                    {contest.questions && (
                                                        <span className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                                                            <FileText className="w-3.5 h-3.5" />
                                                            {contest.questions.length} Qs
                                                        </span>
                                                    )}
                                                </div>
                                                {contest.description && <p className="text-[11px] text-white/20 mt-2 line-clamp-1 sm:line-clamp-2">{contest.description}</p>}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="glass-card text-center py-16"><Code className="w-12 h-12 text-white/10 mx-auto mb-4" /><h3 className="text-lg font-bold text-white mb-2">No challenges yet</h3><p className="text-white/30">Check back soon for new coding challenges!</p></div>
                        )}
                    </div>

                    {/* Announcements Sidebar */}
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Megaphone className="w-5 h-5 text-amber-400" /> Announcements</h2>
                        <div className="space-y-4">
                            {announcements.length > 0 ? announcements.map((a, idx) => (
                                <div key={a._id || a.id || idx} className="glass-card p-4">
                                    <h4 className="font-bold text-white text-sm mb-1">{a.title}</h4>
                                    <p className="text-xs text-white/30 mb-2 line-clamp-3">{a.content}</p>
                                    <div className="flex items-center justify-between text-[10px] text-white/20">
                                        <span>{new Date(a.created_at).toLocaleDateString()}</span>
                                        {a.attachment_url && (
                                            <a href={a.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline"><Download className="w-3 h-3" />Download</a>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="glass-card p-4 text-center"><Megaphone className="w-8 h-8 text-white/10 mx-auto mb-2" /><p className="text-xs text-white/30">No announcements</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
