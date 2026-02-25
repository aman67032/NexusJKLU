'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Code, FileText, Download, Search, Filter, Megaphone, FolderOpen, ChevronRight, UserCircle } from 'lucide-react';

interface Course { _id?: string; id?: string; code: string; name: string; description?: string; }
interface Paper { _id?: string; id?: string; title: string; course_code?: string; course_name?: string; paper_type: string; year?: number; semester?: string; file_name: string; uploaded_at?: string; uploader_name?: string; status?: string; }

const subNav = [
    { href: '/learn', label: 'Overview', icon: BookOpen },
    { href: '/learn/papers', label: 'Papers', icon: FileText },
    { href: '/learn/coding-hour', label: 'Coding Hour', icon: Code },
    { href: '/learn/profile', label: 'My Profile', icon: UserCircle },
];

export default function LearnPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [paperTypeFilter, setPaperTypeFilter] = useState<string>('');

    useEffect(() => {
        Promise.all([
            api.get('/api/learn/courses').then(r => setCourses(r.data.courses || r.data || [])).catch(() => { }),
            api.get('/api/learn/papers?status=approved&limit=100').then(r => setPapers(r.data.items || [])).catch(() => { }),
        ]).finally(() => setLoading(false));
    }, []);

    const filtered = papers.filter(p => {
        const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCourse = !selectedCourse || p.course_code === selectedCourse;
        const matchType = !paperTypeFilter || p.paper_type === paperTypeFilter;
        return matchSearch && matchCourse && matchType;
    });

    const paperTypes = [...new Set(papers.map(p => p.paper_type).filter(Boolean))];
    const courseFolders = courses.map(c => ({ ...c, count: papers.filter(p => p.course_code === c.code).length }));

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-blue-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[500px] h-[500px] -bottom-48 -left-48 bg-indigo-500" style={{ opacity: 0.04 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"><span className="gradient-text-blue">Learning Portal</span></h1>
                    <p className="text-white/40 text-lg mb-6">Browse exam papers, join coding challenges, and access academic resources.</p>

                    {/* Sub Navigation */}
                    <div className="mb-6">
                        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
                            <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-max min-w-full lg:min-w-0 backdrop-blur-md">
                                {subNav.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = item.href === '/learn';
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                                ? 'bg-[var(--secondary)]/15 text-[var(--secondary)] font-bold'
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

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { href: '/learn/papers', icon: <FileText className="w-6 h-6" />, label: 'Papers Dashboard', desc: 'Upload & download papers', color: 'from-indigo-500 to-purple-600' },
                        { href: '/learn/coding-hour', icon: <Code className="w-6 h-6" />, label: 'Coding Hour', desc: 'Daily coding challenges', color: 'from-emerald-500 to-teal-600' },
                        { href: '/learn/profile', icon: <BookOpen className="w-6 h-6" />, label: 'My Profile', desc: 'Manage your account', color: 'from-amber-500 to-orange-600' },
                    ].map(link => (
                        <Link key={link.href} href={link.href} className="group glass-card p-5 flex items-center gap-4 hover:border-white/20 transition-all">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>{link.icon}</div>
                            <div className="flex-1 min-w-0"><h3 className="font-bold text-white group-hover:text-[var(--secondary)] transition-colors">{link.label}</h3><p className="text-xs text-white/30">{link.desc}</p></div>
                            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
                        </Link>
                    ))}
                </div>

                {/* Course Folders */}
                {courseFolders.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FolderOpen className="w-5 h-5 text-[var(--secondary)]" /> Course Folders</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {courseFolders.map(c => (
                                <button key={c.code} onClick={() => setSelectedCourse(selectedCourse === c.code ? '' : c.code)} className={`text-left p-4 rounded-xl border transition-all ${selectedCourse === c.code ? 'bg-[var(--secondary)]/10 border-[var(--secondary)]/30 text-white' : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
                                    <FolderOpen className={`w-5 h-5 mb-2 ${selectedCourse === c.code ? 'text-[var(--secondary)]' : 'text-white/20'}`} />
                                    <p className="font-bold text-sm truncate">{c.code}</p>
                                    <p className="text-[10px] text-white/30 truncate">{c.name}</p>
                                    <p className="text-[10px] mt-1">{c.count} papers</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input type="text" placeholder="Search papers..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-[var(--secondary)]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    {paperTypes.length > 0 && (
                        <select value={paperTypeFilter} onChange={e => setPaperTypeFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none">
                            <option value="">All Types</option>
                            {paperTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    )}
                </div>

                {/* Papers List */}
                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-white/10 border-t-[var(--secondary)] rounded-full animate-spin" /></div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((paper, idx) => (
                            <motion.div key={paper._id || paper.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="glass-card p-5 group hover:border-[var(--secondary)]/30 transition-all">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-[var(--secondary)] transition-colors flex-1">{paper.title}</h3>
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold rounded-full shrink-0">{paper.paper_type}</span>
                                </div>
                                {paper.course_code && <p className="text-xs text-[var(--secondary)] font-semibold mb-2">{paper.course_code} {paper.course_name && `- ${paper.course_name}`}</p>}
                                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-white/30">
                                    <span>{paper.year && `Year ${paper.year}`} {paper.semester && `• ${paper.semester}`}</span>
                                    <span>{paper.uploader_name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20"><Search className="w-12 h-12 text-white/10 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">No papers found</h3><p className="text-white/30">Try adjusting your search or filters</p></div>
                )}
            </div>
        </div>
    );
}
