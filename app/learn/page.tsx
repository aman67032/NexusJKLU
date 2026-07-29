'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Code, FileText, Download, Search, Filter, FolderOpen, ChevronRight, UserCircle, Award, Sparkles } from 'lucide-react';

interface Course { _id?: string; id?: string; code: string; name: string; description?: string; }
interface Paper { _id?: string; id?: string; title: string; course_code?: string; course_name?: string; paper_type: string; year?: number; semester?: string; file_name: string; uploaded_at?: string; uploader_name?: string; status?: string; }

const DEFAULT_COURSES: Course[] = [
    { code: 'CS2001', name: 'Advanced Data Structures & Algorithms', description: 'Trees, Graphs, Dynamic Programming' },
    { code: 'DE2022', name: 'Design Thinking & Human Centered Design', description: 'Prototyping & UX Systems' },
    { code: 'AI3004', name: 'Machine Learning & Neural Networks', description: 'Supervised Learning & Deep Nets' },
    { code: 'EC1002', name: 'Digital Electronics & Logic Circuit Design', description: 'Logic Gates, Flip Flops, Verilog' },
    { code: 'MA1001', name: 'Linear Algebra & Multivariable Calculus', description: 'Matrices, Vectors, Differential Calculus' },
    { code: 'CS3005', name: 'Full Stack Web Development & Cloud', description: 'React, Node, Express, MongoDB' }
];

const DEFAULT_PAPERS: Paper[] = [
    { _id: 'p1', title: 'Advanced Data Structures — Mid Term 2025', course_code: 'CS2001', paper_type: 'exam', year: 2025, semester: 'Spring', file_name: 'CS2001_Midterm.pdf', uploader_name: 'Exam Cell' },
    { _id: 'p2', title: 'Design Thinking — PyQuestion Paper 2025', course_code: 'DE2022', paper_type: 'pyq', year: 2025, semester: 'Fall', file_name: 'DE2022_PYQ.pdf', uploader_name: 'JKLU Library' },
    { _id: 'p3', title: 'Machine Learning — Endterm Question Bank', course_code: 'AI3004', paper_type: 'notes', year: 2025, semester: 'Spring', file_name: 'AI3004_Endterm.pdf', uploader_name: 'CSE Dept' },
    { _id: 'p4', title: 'Digital Electronics — Quiz 1 & Solutions', course_code: 'EC1002', paper_type: 'quiz', year: 2025, semester: 'Fall', file_name: 'EC1002_Quiz1.pdf', uploader_name: 'ECE Dept' }
];

const subNav = [
    { href: '/learn', label: 'Overview', icon: BookOpen },
    { href: '/learn/papers', label: 'Papers', icon: FileText },
    { href: '/learn/coding-hour', label: 'Coding Hour', icon: Code },
    { href: '/learn/profile', label: 'My Profile', icon: UserCircle },
];

export default function LearnPage() {
    const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
    const [papers, setPapers] = useState<Paper[]>(DEFAULT_PAPERS);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [paperTypeFilter, setPaperTypeFilter] = useState<string>('');

    useEffect(() => {
        Promise.all([
            api.get('/api/learn/courses')
                .then(r => {
                    const fetched = r.data.courses || r.data || [];
                    if (fetched.length > 0) setCourses(fetched);
                })
                .catch(() => { }),
            api.get('/api/learn/papers?status=approved&limit=100')
                .then(r => {
                    const fetched = r.data.items || [];
                    if (fetched.length > 0) setPapers(fetched);
                })
                .catch(() => { }),
        ]).finally(() => setLoading(false));
    }, []);

    const filtered = papers.filter(p => {
        const matchSearch = !searchTerm || p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCourse = !selectedCourse || p.course_code === selectedCourse;
        const matchType = !paperTypeFilter || p.paper_type === paperTypeFilter;
        return matchSearch && matchCourse && matchType;
    });

    const paperTypes = Array.from(new Set(papers.map(p => p.paper_type).filter(Boolean)));
    const courseFolders = courses.map(c => ({
        ...c,
        count: papers.filter(p => p.course_code === c.code).length || 1
    }));

    return (
        <div className="min-h-full pb-16 bg-background relative overflow-x-hidden p-4 space-y-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#0B0828]/5 border border-[#0B0828]/10 text-[10px] font-bold text-[#0B0828] uppercase tracking-wider font-display flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#FF8400]" /> Academic Hub
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0828] font-display">
                        Nexus Learning Portal
                    </h1>
                    <p className="text-sm text-[#5B6077] font-semibold max-w-2xl">
                        Access official exam papers, PYQs, coding challenges, and study resources for your enrolled courses.
                    </p>

                    {/* Sub Navigation */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 p-1.5 bg-black/[0.02] border border-black/[0.04] rounded-2xl overflow-x-auto scrollbar-hide no-scrollbar">
                            {subNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/learn';
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

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { href: '/learn/papers', icon: <FileText className="w-5 h-5" />, label: 'Exam Papers', desc: 'Midterms, Endterms & PYQs', badge: 'Library' },
                        { href: '/learn/coding-hour', icon: <Code className="w-5 h-5" />, label: 'Coding Hour', iconBg: 'bg-[#FF8400]/10 text-[#FF8400]', desc: 'Daily Algorithmic Challenges', badge: 'Active' },
                        { href: '/learn/profile', icon: <UserCircle className="w-5 h-5" />, label: 'My Learning Profile', desc: 'Saved Papers & Stats', badge: 'Student' },
                    ].map(link => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className="glass-card p-5 border border-black/5 hover:border-black/15 transition-all flex items-center gap-4 group cursor-pointer shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[22px]"
                        >
                            <div className="p-3 rounded-2xl bg-[#0B0828] text-white shrink-0 group-hover:scale-105 transition-transform">
                                {link.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <h3 className="font-bold text-[#0B0828] text-sm group-hover:text-[#FF8400] transition-colors truncate font-display">
                                        {link.label}
                                    </h3>
                                </div>
                                <p className="text-[11px] text-[#5B6077] truncate font-medium">{link.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#5B6077] group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </Link>
                    ))}
                </div>

                {/* Course Folders */}
                {courseFolders.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-[#0B0828] font-display flex items-center gap-2">
                                <FolderOpen className="w-4 h-4 text-[#0B0828]" /> Course Folders
                            </h2>
                            {selectedCourse && (
                                <button 
                                    onClick={() => setSelectedCourse('')}
                                    className="text-xs text-[#FF8400] font-bold hover:underline"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {courseFolders.map(c => (
                                <button 
                                    key={c.code} 
                                    onClick={() => setSelectedCourse(selectedCourse === c.code ? '' : c.code)} 
                                    className={`text-left p-4 rounded-[20px] border transition-all cursor-pointer ${
                                        selectedCourse === c.code 
                                            ? 'bg-[#0B0828] text-white border-[#0B0828] shadow-md' 
                                            : 'bg-white border-black/5 hover:border-black/15 text-[#0B0828] shadow-[0_2px_6px_rgba(11,8,40,0.01)]'
                                    }`}
                                >
                                    <FolderOpen className={`w-5 h-5 mb-2 ${selectedCourse === c.code ? 'text-[#FF8400]' : 'text-[#0B0828]/40'}`} />
                                    <p className="font-extrabold text-xs truncate font-display">{c.code}</p>
                                    <p className={`text-[10px] truncate mt-0.5 ${selectedCourse === c.code ? 'text-white/70' : 'text-[#5B6077]'}`}>{c.name}</p>
                                    <span className={`inline-block mt-2 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        selectedCourse === c.code ? 'bg-white/20 text-white' : 'bg-black/5 text-[#0B0828]'
                                    }`}>
                                        {c.count} papers
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6077]" />
                        <input 
                            type="text" 
                            placeholder="Search papers by title or course code..." 
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-black/10 text-xs font-semibold text-[#0B0828] placeholder-[#5B6077]/60 outline-none focus:border-[#0B0828] transition-all shadow-[0_2px_6px_rgba(11,8,40,0.01)]" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    {paperTypes.length > 0 && (
                        <select 
                            value={paperTypeFilter} 
                            onChange={e => setPaperTypeFilter(e.target.value)} 
                            className="px-4 py-3 rounded-2xl bg-white border border-black/10 text-xs font-bold text-[#0B0828] outline-none cursor-pointer focus:border-[#0B0828] shadow-[0_2px_6px_rgba(11,8,40,0.01)]"
                        >
                            <option value="">All Types</option>
                            {paperTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                        </select>
                    )}
                </div>

                {/* Papers List */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        {filtered.map((paper, idx) => (
                            <motion.div 
                                key={paper._id || paper.id || idx} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: idx * 0.03 }} 
                                className="glass-card p-5 border border-black/5 hover:border-black/15 transition-all flex flex-col justify-between h-full shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[22px] bg-white group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="px-2.5 py-1 bg-[#0B0828]/5 border border-[#0B0828]/10 text-[#0B0828] text-[9px] font-black rounded-full uppercase tracking-wider font-display">
                                            {paper.paper_type}
                                        </span>
                                        {paper.course_code && (
                                            <span className="text-[10px] font-extrabold text-[#FF8400] font-display">
                                                {paper.course_code}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-[#0B0828] text-xs leading-snug group-hover:text-[#FF8400] transition-colors font-display line-clamp-2">
                                        {paper.title}
                                    </h3>
                                </div>
                                <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-[10px] text-[#5B6077] font-semibold">
                                    <span>{paper.year ? `Year ${paper.year}` : 'Spring 2025'}</span>
                                    <Link 
                                        href="/learn/papers" 
                                        className="text-[#0B0828] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        View <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white border border-black/5 rounded-[22px] space-y-3 shadow-sm">
                        <Search className="w-10 h-10 text-[#5B6077]/40 mx-auto" />
                        <h3 className="text-sm font-bold text-[#0B0828] font-display">No papers match your search</h3>
                        <p className="text-xs text-[#5B6077]">Try clearing your search term or course filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
