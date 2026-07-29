'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, Calendar, Sparkles, Clock, Megaphone, FileText, ChevronRight, Download, BookOpen, UserCircle, CheckCircle2 } from 'lucide-react';

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
            api.get('/api/learn/contests')
                .then(r => setContests(r.data.contests || r.data || []))
                .catch(() => setContests([])),
            api.get('/api/learn/contests/announcements')
                .then(r => setAnnouncements(r.data.announcements || r.data || []))
                .catch(() => setAnnouncements([])),
        ]).finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-full pb-16 bg-background relative overflow-x-hidden p-4 space-y-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#67C587]/10 border border-[#67C587]/30 text-[#2D7A46] text-[10px] font-extrabold uppercase tracking-wider font-display">
                        <Sparkles className="w-3 h-3 text-[#2D7A46]" /> Daily Coding Challenges
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0828] font-display">
                        Coding Hour
                    </h1>
                    <p className="text-sm text-[#5B6077] font-semibold max-w-2xl">
                        Solve real algorithmic problems, track your streak, and prepare for technical interviews.
                    </p>

                    {/* Sub Navigation */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 p-1.5 bg-black/[0.02] border border-black/[0.04] rounded-2xl overflow-x-auto scrollbar-hide no-scrollbar">
                            {subNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/learn/coding-hour';
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                                            ? 'bg-[#0B0828] text-white shadow-sm font-display'
                                            : 'text-[#5B6077] hover:text-[#0B0828] hover:bg-black/5'
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    {/* Contests List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-base font-bold text-[#0B0828] font-display flex items-center gap-2">
                            <Code className="w-4 h-4 text-[#0B0828]" /> Active & Recent Challenges
                        </h2>
                        <div className="space-y-3">
                            {contests.map((contest, idx) => (
                                <motion.div 
                                    key={contest._id || contest.id || idx} 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link 
                                        href={`/learn/coding-hour/${contest._id || contest.id}`} 
                                        className="glass-card p-5 border border-black/5 hover:border-black/15 transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[22px] bg-white group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-2xl bg-[#0B0828]/5 border border-[#0B0828]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0B0828] group-hover:text-white transition-colors text-[#0B0828]">
                                                <Code className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <h3 className="font-bold text-[#0B0828] text-xs group-hover:text-[#FF8400] transition-colors truncate font-display">
                                                    {contest.title || `Challenge #${idx + 1}`}
                                                </h3>
                                                <div className="flex items-center gap-3 text-[10px] text-[#5B6077] font-semibold">
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <Calendar className="w-3 h-3" />
                                                        {(() => {
                                                            try {
                                                                const d = new Date(contest.date);
                                                                if (isNaN(d.getTime())) return 'TBD';
                                                                return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                                                            } catch { return 'TBD'; }
                                                        })()}
                                                    </span>
                                                    {contest.questions && (
                                                        <span className="flex items-center gap-1 border-l border-black/10 pl-3 font-bold text-[#0B0828]">
                                                            <FileText className="w-3 h-3 text-[#FF8400]" />
                                                            {contest.questions.length} Problems
                                                        </span>
                                                    )}
                                                </div>
                                                {contest.description && (
                                                    <p className="text-[11px] text-[#5B6077] line-clamp-1 font-medium pt-0.5">
                                                        {contest.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#5B6077] group-hover:translate-x-1 transition-transform shrink-0 ml-4" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Announcements Sidebar */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-[#0B0828] font-display flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-[#FF8400]" /> Announcements
                        </h2>
                        <div className="space-y-3">
                            {announcements.map((a, idx) => (
                                <div key={a._id || a.id || idx} className="glass-card p-4 border border-black/5 bg-white rounded-[20px] shadow-[0_2px_6px_rgba(11,8,40,0.01)] space-y-2">
                                    <h4 className="font-bold text-[#0B0828] text-xs font-display">{a.title}</h4>
                                    <p className="text-[11px] text-[#5B6077] line-clamp-3 leading-relaxed font-medium">{a.content}</p>
                                    <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[9px] text-[#5B6077] font-bold">
                                        <span>{new Date(a.created_at).toLocaleDateString()}</span>
                                        {a.attachment_url && (
                                            <a href={a.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#0B0828] hover:underline font-bold">
                                                <Download className="w-3 h-3 text-[#FF8400]" /> Attachment
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
