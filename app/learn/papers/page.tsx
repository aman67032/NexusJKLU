'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Upload, FileText, Filter, Download, Eye, User, Shield, Search, X } from 'lucide-react';

interface Paper { _id?: string; id?: string; title: string; description?: string; paper_type: string; year?: number; semester?: string; file_name: string; file_size?: number; status: string; uploaded_at: string; course_code?: string; course_name?: string; uploader_name?: string; }
interface Course { _id?: string; id?: string; code: string; name: string; }

export default function PapersPage() {
    const { user } = useAuth();
    const [papers, setPapers] = useState<Paper[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', description: '', paper_type: 'exam', course_id: '', year: '', semester: '' });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        Promise.all([
            api.get('/api/learn/papers?status=approved&limit=100').then(r => setPapers(r.data.items || [])).catch(() => { }),
            api.get('/api/learn/courses').then(r => setCourses(r.data.courses || r.data || [])).catch(() => { }),
        ]).finally(() => setLoading(false));
    }, []);

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
            window.open(url, '_blank');
        } catch { }
    };

    const filtered = papers.filter(p => {
        const s = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
        return s && (!courseFilter || p.course_code === courseFilter);
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-[var(--secondary)] rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-indigo-500" style={{ opacity: 0.06 }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div><h1 className="text-3xl font-extrabold text-white mb-1">Papers Dashboard</h1><p className="text-white/40">Browse, upload, and download exam papers</p></div>
                    {user && <button onClick={() => setShowUpload(true)} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"><Upload className="w-4 h-4" />Upload Paper</button>}
                </div>

                {/* Upload Form */}
                {showUpload && (
                    <div className="glass-card p-6 mb-8">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-white">Upload Paper</h3><button onClick={() => setShowUpload(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-white/50" /></button></div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Title *</label><input value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} required className="input-field" placeholder="Paper title" /></div>
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Course</label><select value={uploadForm.course_id} onChange={e => setUploadForm({ ...uploadForm, course_id: e.target.value })} className="input-field"><option value="">Select Course</option>{courses.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.code} - {c.name}</option>)}</select></div>
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Type</label><select value={uploadForm.paper_type} onChange={e => setUploadForm({ ...uploadForm, paper_type: e.target.value })} className="input-field"><option value="exam">Exam</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="notes">Notes</option></select></div>
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Year</label><input value={uploadForm.year} onChange={e => setUploadForm({ ...uploadForm, year: e.target.value })} className="input-field" placeholder="2024" type="number" /></div>
                            </div>
                            <div><label className="block text-xs font-semibold text-white/50 mb-2">Description</label><textarea value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} rows={3} className="input-field" placeholder="Optional description" /></div>
                            <div><label className="block text-xs font-semibold text-white/50 mb-2">File *</label><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)} required className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white/60 file:font-semibold file:text-sm" /></div>
                            <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload Paper'}</button>
                        </form>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" /><input type="text" placeholder="Search papers..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-[var(--secondary)]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none"><option value="">All Courses</option>{courses.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}</select>
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((p, idx) => (
                        <motion.div key={p._id || p.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="glass-card p-5 group hover:border-[var(--secondary)]/30 transition-all">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-[var(--secondary)] transition-colors flex-1">{p.title}</h3>
                                <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold rounded-full shrink-0">{p.paper_type}</span>
                            </div>
                            {p.course_code && <p className="text-xs text-[var(--secondary)] font-semibold mb-1"><Shield className="w-3 h-3 inline mr-1" />{p.course_code} {p.course_name && `- ${p.course_name}`}</p>}
                            <p className="text-xs text-white/20 flex items-center gap-1 mb-3"><User className="w-3 h-3" />{p.uploader_name} • {p.uploaded_at && new Date(p.uploaded_at).toLocaleDateString()}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className="text-xs text-white/20">{p.year && `Year ${p.year}`}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handlePreview(String(p._id || p.id))} className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all" title="Preview"><Eye className="w-4 h-4" /></button>
                                    <button onClick={() => handleDownload(String(p._id || p.id), p.file_name)} className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-md hover:shadow-green-500/20 active:scale-95 transition-all" title="Download"><Download className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && !loading && (
                    <div className="text-center py-20"><FileText className="w-12 h-12 text-white/10 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">No papers found</h3><p className="text-white/30">Try adjusting search or filters</p></div>
                )}
            </div>
        </div>
    );
}
