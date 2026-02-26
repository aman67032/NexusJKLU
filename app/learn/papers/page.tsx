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
            const res = await api.get(`/api/learn/papers?${params}`);
            setPapers(res.data.items || []);
            setTotalPages(res.data.pages || 1);
            setCurrentPage(res.data.page || 1);
        } catch (error) {
            console.error('Fetch papers error:', error);
            setPapers([]);
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
            await api.post('/api/learn/papers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowUpload(false); setFile(null); setUploadForm({ title: '', description: '', paper_type: 'exam', course_id: '', year: '', semester: '' });
        } catch { } finally { setUploading(false); }
    };

    const handleDownload = async (paperId: string, fileName: string) => {
        try {
            const res = await api.get(`/api/learn/papers/${paperId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
        } catch { }
    };

    const handlePreview = async (paperId: string) => {
        try {
            const res = await api.get(`/api/learn/papers/${paperId}/download`, { responseType: 'blob' });
            const file = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);
            setPreviewUrl(url);
        } catch { }
    };

    // Filtering is now handled by the backend API.
    // We can just use 'papers' directly.

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-nexus-camel/20 border-t-[var(--secondary)] rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-nexus-coffee" style={{ opacity: 0.06 }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div><h1 className="text-3xl font-extrabold text-nexus-linen mb-1">Papers Dashboard</h1><p className="text-nexus-camel">Browse, upload, and download exam papers</p></div>
                    {user && <button onClick={() => setShowUpload(true)} className="px-5 py-2.5 bg-gradient-to-r from-nexus-coffee to-purple-600 text-nexus-linen rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-nexus-coffee/20 active:scale-95"><Upload className="w-4 h-4" />Upload Paper</button>}
                </div>

                {/* Sub Navigation */}
                <div className="mb-10 z-20 relative">
                    <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar scroll-fade-right">
                        <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-max min-w-full lg:min-w-0 backdrop-blur-md">
                            {subNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/learn/papers';
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                            ? 'bg-[var(--secondary)]/15 text-[var(--secondary)] font-bold'
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

                {/* Upload Form */}
                {showUpload && (
                    <div className="glass-card p-6 mb-8">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-nexus-linen">Upload Paper</h3><button onClick={() => setShowUpload(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-nexus-camel" /></button></div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-semibold text-nexus-camel mb-2">Title *</label><input value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} required className="input-field" placeholder="Paper title" /></div>
                                <div><label className="block text-xs font-semibold text-nexus-camel mb-2">Course</label><select value={uploadForm.course_id} onChange={e => setUploadForm({ ...uploadForm, course_id: e.target.value })} className="input-field"><option value="">Select Course</option>{courses.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.code} - {c.name}</option>)}</select></div>
                                <div><label className="block text-xs font-semibold text-nexus-camel mb-2">Type</label><select value={uploadForm.paper_type} onChange={e => setUploadForm({ ...uploadForm, paper_type: e.target.value })} className="input-field"><option value="exam">Exam</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="notes">Notes</option></select></div>
                                <div><label className="block text-xs font-semibold text-nexus-camel mb-2">Year</label><input value={uploadForm.year} onChange={e => setUploadForm({ ...uploadForm, year: e.target.value })} className="input-field" placeholder="2024" type="number" /></div>
                            </div>
                            <div><label className="block text-xs font-semibold text-nexus-camel mb-2">Description</label><textarea value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} rows={3} className="input-field" placeholder="Optional description" /></div>
                            <div><label className="block text-xs font-semibold text-nexus-camel mb-2">File *</label><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)} required className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-nexus-khaki file:font-semibold file:text-sm" /></div>
                            <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-gradient-to-r from-nexus-coffee to-purple-600 text-nexus-linen rounded-xl font-bold disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload Paper'}</button>
                        </form>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-[2]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search papers by title or description..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-nexus-camel/20 text-nexus-linen placeholder-white/30 outline-none focus:border-[var(--secondary)]"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        value={courseFilter}
                        onChange={e => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-nexus-camel/20 text-nexus-linen outline-none focus:border-[var(--secondary)]"
                    >
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-nexus-camel/20 text-nexus-linen outline-none focus:border-[var(--secondary)]"
                    >
                        <option value="">All Types</option>
                        <option value="exam">Exam</option>
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                        <option value="notes">Notes</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {papers.map((p, idx) => (
                        <motion.div key={p._id || p.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="glass-card p-4 sm:p-5 group hover:border-[var(--secondary)]/30 transition-all flex flex-col h-full">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="font-bold text-nexus-linen text-sm sm:text-base line-clamp-2 group-hover:text-[var(--secondary)] transition-colors flex-1 min-w-0 leading-tight">{p.title}</h3>
                                <span className="px-2 py-0.5 bg-gradient-to-r from-nexus-coffee to-nexus-cocoa text-nexus-linen text-[9px] sm:text-[10px] font-bold rounded-full shrink-0 uppercase tracking-tight">{p.paper_type}</span>
                            </div>

                            <div className="flex-1">
                                {p.course_code && (
                                    <p className="text-xs text-[var(--secondary)] font-bold mb-1.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                        <Shield className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{p.course_code} {p.course_name && `- ${p.course_name}`}</span>
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-[11px] text-nexus-camel mb-4 font-medium">
                                    <div className="flex items-center gap-1 shrink-0 bg-white/5 px-2 py-0.5 rounded-md border border-nexus-camel/10">
                                        <User className="w-3 h-3 text-nexus-camel" />
                                        <span className="truncate max-w-[80px] sm:max-w-none">{p.uploader_name || 'Admin'}</span>
                                    </div>
                                    <span className="opacity-30">•</span>
                                    <span className="shrink-0">{p.uploaded_at && new Date(p.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-nexus-camel/10 mt-auto">
                                <span className="text-[11px] font-bold text-nexus-camel bg-white/5 px-2 py-0.5 rounded-md">{p.year ? `FY ${p.year}` : 'N/A'}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handlePreview(String(p._id || p.id))} className="p-2 sm:p-2.5 bg-white/5 border border-nexus-camel/20 text-nexus-linen rounded-lg hover:bg-white/10 hover:border-[var(--secondary)]/30 active:scale-90 transition-all group/btn" title="Preview">
                                        <Eye className="w-4 h-4 text-nexus-khaki group-hover/btn:text-[var(--secondary)]" />
                                    </button>
                                    <button onClick={() => handleDownload(String(p._id || p.id), p.file_name)} className="p-2 sm:p-2.5 bg-gradient-to-br from-nexus-coffee to-purple-600 text-nexus-linen rounded-lg hover:shadow-lg hover:shadow-nexus-coffee/20 active:scale-90 transition-all" title="Download">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-white/5 text-nexus-khaki font-semibold border border-nexus-camel/20 disabled:opacity-30 hover:bg-white/10 transition-colors"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${currentPage === page
                                        ? 'bg-gradient-to-tr from-nexus-coffee to-nexus-cocoa text-nexus-linen shadow-lg'
                                        : 'text-nexus-camel hover:bg-white/10'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-white/5 text-nexus-khaki font-semibold border border-nexus-camel/20 disabled:opacity-30 hover:bg-white/10 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {papers.length === 0 && !loading && (
                    <div className="text-center py-20"><FileText className="w-12 h-12 text-white/10 mx-auto mb-4" /><h3 className="text-xl font-bold text-nexus-linen mb-2">No papers found</h3><p className="text-white/30">Try adjusting search or filters</p></div>
                )}
            </div>

            {/* PDF Preview Modal */}
            <AnimatePresence>
                {previewUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-nexus-black/80 backdrop-blur-sm"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-nexus-green border border-nexus-camel/20 rounded-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-nexus-camel/20 bg-white/5 shrink-0">
                                <h3 className="text-lg font-bold text-nexus-linen flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-nexus-brass" /> Document Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(previewUrl, '_blank')}
                                        className="p-2 hover:bg-white/10 rounded-lg text-nexus-khaki hover:text-nexus-linen transition-colors"
                                        title="Open in new tab"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewUrl(null)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg text-nexus-khaki hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
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
