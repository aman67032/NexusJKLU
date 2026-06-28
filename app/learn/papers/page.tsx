'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Upload, FileText, Filter, Download, Eye, User, Shield, Search, X, Maximize2, BookOpen, Code, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

interface Paper { _id?: string; id?: string; title: string; description?: string; paper_type: string; year?: number; semester?: string; file_name: string; file_size?: number; status: string; uploaded_at: string; course_code?: string; course_name?: string; uploader_name?: string; }
interface Course { _id?: string; id?: string; code: string; name: string; }

const subNav = [
    { href: '/learn', label: 'Overview', icon: BookOpen },
    { href: '/learn/papers', label: 'Papers', icon: FileText },
    { href: '/learn/coding-hour', label: 'Coding Hour', icon: Code },
    { href: '/learn/profile', label: 'My Profile', icon: UserCircle },
];

export default function PapersPage() {
    const { user } = useAuth();
    const [papers, setPapers] = useState<Paper[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', description: '', paper_type: 'exam', course_id: '', year: '', semester: '' });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchPapers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                status: 'approved',
                page: page.toString(),
                limit: '12',
                ...(courseFilter && { courseId: courses.find(c => c.code === courseFilter)?._id || '' }),
                ...(typeFilter && { paperType: typeFilter }),
                ...(searchTerm && { search: searchTerm })
            });
            const res = await api.get(`/learn/papers?${params}`);
            setPapers(res.data.items || []);
            setTotalPages(res.data.pages || 1);
            setCurrentPage(res.data.page || 1);
        } catch (error) {
            console.warn('Fetch papers offline fallback');
            const mockPapers: Paper[] = [
                {
                    _id: "paper-1",
                    title: "Advanced Data Structures - Endterm 2025",
                    course_code: "CS2001",
                    course_name: "Advanced Data Structures",
                    paper_type: "exam",
                    year: 2025,
                    semester: "Fall",
                    file_name: "ads_endterm_2025.pdf",
                    status: "approved",
                    uploaded_at: new Date().toISOString(),
                    uploader_name: "Dr. Ankit Gupta"
                },
                {
                    _id: "paper-2",
                    title: "Machine Learning - Quiz 2 2025",
                    course_code: "CS4011",
                    course_name: "Machine Learning",
                    paper_type: "quiz",
                    year: 2025,
                    semester: "Spring",
                    file_name: "ml_quiz_2.pdf",
                    status: "approved",
                    uploaded_at: new Date().toISOString(),
                    uploader_name: "Prof. Sudeshna Dey"
                },
                {
                    _id: "paper-3",
                    title: "Design Principles - Midterm 2025",
                    course_code: "DE1002",
                    course_name: "Design Principles",
                    paper_type: "exam",
                    year: 2025,
                    semester: "Fall",
                    file_name: "design_principles_midterm.pdf",
                    status: "approved",
                    uploaded_at: new Date().toISOString(),
                    uploader_name: "Ar. Ravi Kumar"
                }
            ];
            setPapers(mockPapers);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Initial courses fetch
    useEffect(() => {
        api.get('/api/learn/courses')
            .then(r => setCourses(r.data.courses || r.data || []))
            .catch(() => { });
    }, []);

    // Fetch papers when filters or page change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPapers(currentPage);
        }, 300); // debounce search
        return () => clearTimeout(timer);
    }, [searchTerm, courseFilter, typeFilter, currentPage, courses.length]); // depend on courses length to ensure we map code to id after load

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault(); if (!file) return; setUploading(true);
        try {
            const fd = new FormData();
            Object.entries(uploadForm).forEach(([k, v]) => fd.append(k, v));
            fd.append('file', file);
            await api.post('/learn/papers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowUpload(false); setFile(null); setUploadForm({ title: '', description: '', paper_type: 'exam', course_id: '', year: '', semester: '' });
        } catch { } finally { setUploading(false); }
    };

    const handleDownload = async (paperId: string, fileName: string) => {
        try {
            const res = await api.get(`/learn/papers/${paperId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
        } catch { }
    };

    const handlePreview = async (paperId: string) => {
        try {
            const res = await api.get(`/learn/papers/${paperId}/download`, { responseType: 'blob' });
            const file = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);
            setPreviewUrl(url);
        } catch { }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#8FA0D8] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 py-6 relative z-10 space-y-6">
                
                {/* Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display">Papers Dashboard</h1>
                        <p className="text-xs text-[#5B6077] font-semibold mt-0.5">Browse, upload, and download exam papers</p>
                    </div>
                    {user && (
                        <button 
                            onClick={() => setShowUpload(true)} 
                            className="px-4 py-2 bg-[#0B0828] text-white hover:bg-[#0B0828]/90 rounded-[14px] font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm font-display cursor-pointer"
                        >
                            <Upload className="w-3.5 h-3.5" />Upload Paper
                        </button>
                    )}
                </div>

                {/* Sub Navigation */}
                <div className="z-20 relative">
                    <div className="overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide no-scrollbar">
                        <div className="flex items-center gap-1.5 p-1 bg-black/[0.02] border border-black/[0.04] rounded-2xl w-max min-w-full lg:min-w-0">
                            {subNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/learn/papers';
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${isActive
                                            ? 'bg-[#8FA0D8]/15 text-[#0B0828] border-[#8FA0D8]/20 shadow-sm font-display'
                                            : 'bg-white text-[#5B6077] border-black/5 hover:border-black/10 hover:bg-black/[0.01]'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Upload Form (14px radius inputs / buttons) */}
                {showUpload && (
                    <div className="glass-card p-5 border border-black/5 shadow-[0_4px_12px_rgba(11,8,40,0.01)] rounded-[20px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-[#0B0828] uppercase tracking-wider font-display">Upload Paper</h3>
                            <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-black/5 rounded-lg text-secondary"><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-2 font-display">Title *</label><input value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} required className="input-field" placeholder="Paper title" /></div>
                                <div><label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-2 font-display">Course</label><select value={uploadForm.course_id} onChange={e => setUploadForm({ ...uploadForm, course_id: e.target.value })} className="input-field bg-white"><option value="">Select Course</option>{courses.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.code} - {c.name}</option>)}</select></div>
                                <div><label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-2 font-display">Type</label><select value={uploadForm.paper_type} onChange={e => setUploadForm({ ...uploadForm, paper_type: e.target.value })} className="input-field bg-white"><option value="exam">Exam</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="notes">Notes</option></select></div>
                                <div><label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-2 font-display">Year</label><input value={uploadForm.year} onChange={e => setUploadForm({ ...uploadForm, year: e.target.value })} className="input-field" placeholder="2024" type="number" /></div>
                            </div>
                            <div><label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-2 font-display">Description</label><textarea value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} rows={3} className="input-field" placeholder="Optional description" /></div>
                            <div><label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-2 font-display">File *</label><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)} required className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-black/5 file:px-4 file:py-2 file:text-[#5B6077] file:font-bold file:text-xs" /></div>
                            <button type="submit" disabled={uploading} className="btn-primary w-full sm:w-auto">{uploading ? 'Uploading...' : 'Upload Paper'}</button>
                        </form>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-[2]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0828]/35" />
                        <input
                            type="text"
                            placeholder="Search papers by title or description..."
                            className="w-full pl-12 pr-4 py-2.5 rounded-[14px] bg-white border border-[#0B0828]/10 text-sm text-[#0B0828] placeholder-[#5B6077]/40 outline-none focus:border-[#0B0828]/25 shadow-[0_2px_8px_rgba(11,8,40,0.01)] font-semibold"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        value={courseFilter}
                        onChange={e => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                        className="flex-1 px-4 py-2.5 rounded-[14px] bg-white border border-[#0B0828]/10 text-sm text-[#5B6077] outline-none focus:border-[#0B0828]/25 shadow-[0_2px_8px_rgba(11,8,40,0.01)] appearance-none font-semibold"
                    >
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                        className="flex-1 px-4 py-2.5 rounded-[14px] bg-white border border-[#0B0828]/10 text-sm text-[#5B6077] outline-none focus:border-[#0B0828]/25 shadow-[0_2px_8px_rgba(11,8,40,0.01)] appearance-none font-semibold"
                    >
                        <option value="">All Types</option>
                        <option value="exam">Exam</option>
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                        <option value="notes">Notes</option>
                    </select>
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {papers.map((p, idx) => (
                        <motion.div 
                            key={p._id || p.id || idx} 
                            initial={{ opacity: 0, y: 15 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: idx * 0.02 }} 
                            className="bg-white border border-[#0B0828]/5 hover:border-[#8FA0D8]/40 p-4 sm:p-5 group rounded-[20px] transition-all flex flex-col h-full shadow-[0_2px_8px_rgba(11,8,40,0.01)]"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="font-bold text-[#0B0828] text-sm sm:text-base line-clamp-2 transition-colors flex-1 min-w-0 leading-tight font-display">{p.title}</h3>
                                <span className="px-2.5 py-0.5 bg-[#8FA0D8]/15 text-[#0B0828] border border-[#8FA0D8]/20 text-[9px] font-bold rounded-full shrink-0 uppercase tracking-tight font-display">{p.paper_type}</span>
                            </div>

                            <div className="flex-1">
                                {p.course_code && (
                                    <p className="text-xs text-[#8FA0D8] font-bold mb-1.5 flex items-center gap-1.5 opacity-90 transition-opacity font-display">
                                        <Shield className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{p.course_code} {p.course_name && `- ${p.course_name}`}</span>
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-[10px] text-[#5B6077] mb-4 font-bold">
                                    <div className="flex items-center gap-1 shrink-0 bg-black/5 px-2 py-0.5 rounded-md">
                                        <User className="w-3 h-3 text-[#5B6077]" />
                                        <span className="truncate max-w-[80px] sm:max-w-none">{p.uploader_name || 'Admin'}</span>
                                    </div>
                                    <span className="opacity-30">•</span>
                                    <span className="shrink-0">{p.uploaded_at && new Date(p.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
                                <span className="text-[10px] font-bold text-[#5B6077] bg-black/5 px-2 py-0.5 rounded-md font-display">{p.year ? `FY ${p.year}` : 'N/A'}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handlePreview(String(p._id || p.id))} className="p-2 bg-black/5 border border-black/5 text-[#0B0828] rounded-lg hover:bg-black/10 active:scale-90 transition-all cursor-pointer" title="Preview">
                                        <Eye className="w-3.5 h-3.5 text-[#5B6077]" />
                                    </button>
                                    <button onClick={() => handleDownload(String(p._id || p.id), p.file_name)} className="p-2 bg-[#8FA0D8]/15 text-[#0B0828] border border-[#8FA0D8]/20 rounded-lg hover:shadow-sm active:scale-90 transition-all cursor-pointer" title="Download">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-xl bg-white text-[#5B6077] font-bold text-xs border border-black/5 disabled:opacity-30 hover:bg-black/[0.01] transition-all"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-colors ${currentPage === page
                                        ? 'bg-[#8FA0D8]/15 text-[#0B0828] border border-[#8FA0D8]/20 shadow-sm font-display'
                                        : 'text-[#5B6077] bg-white hover:bg-black/[0.01]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-xl bg-white text-[#5B6077] font-bold text-xs border border-black/5 disabled:opacity-30 hover:bg-black/[0.01] transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                {papers.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white border border-black/5 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                        <FileText className="w-10 h-10 text-black/10 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-[#0B0828] uppercase tracking-wider mb-1 font-display">No papers found</h3>
                        <p className="text-xs text-[#5B6077] font-semibold">Try adjusting search or filters</p>
                    </div>
                )}
            </div>

            {/* PDF Preview Modal */}
            <AnimatePresence>
                {previewUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border border-black/5 rounded-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-black/5 bg-black/[0.01] shrink-0">
                                <h3 className="text-sm font-bold text-[#0B0828] flex items-center gap-2 uppercase tracking-wider font-display">
                                    <FileText className="w-4 h-4 text-[#8FA0D8]" /> Document Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(previewUrl, '_blank')}
                                        className="p-1.5 hover:bg-black/5 rounded-lg text-[#5B6077] transition-colors cursor-pointer"
                                        title="Open in new tab"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewUrl(null)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#5B6077] hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-white relative">
                                <iframe
                                    src={`${previewUrl}#toolbar=0`}
                                    className="absolute inset-0 w-full h-full border-0"
                                    title="PDF Preview"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
