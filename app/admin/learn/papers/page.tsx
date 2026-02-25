'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Search, Check, X, ShieldAlert, FileText, Download, ExternalLink, Eye, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ReviewPapers() {
    const { user } = useAuth();
    const [papers, setPapers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchPapers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/learn/papers', {
                params: { status: statusFilter, limit: 50 },
                withCredentials: true
            });
            setPapers(data.items);
        } catch (error) {
            toast.error('Failed to fetch papers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPapers();
    }, [statusFilter]);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        if (action === 'rejected' && !rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            await api.put(`/learn/papers/${id}/review`, {
                status: action,
                rejectionReason: action === 'rejected' ? rejectionReason : undefined
            }, { withCredentials: true });

            toast.success(`Paper ${action} successfully`);
            setRejectingId(null);
            setRejectionReason('');
            fetchPapers(); // refresh
        } catch (error) {
            toast.error(`Failed to ${action} paper`);
        }
    };

    const downloadFile = async (paper: any) => {
        try {
            const res = await api.get(`/learn/papers/${paper._id}/download`, {
                responseType: 'blob',
                withCredentials: true
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', paper.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            toast.error('Failed to download file');
        }
    };

    const previewFile = async (paper: any) => {
        try {
            const res = await api.get(`/learn/papers/${paper._id}/download`, {
                responseType: 'blob',
                withCredentials: true
            });
            const file = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);
            setPreviewUrl(url);
        } catch {
            toast.error('Failed to preview file');
        }
    };

    if (!user?.roles?.some((r: string) => ['admin', 'learn_admin'].includes(r))) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-screen">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-emerald-500" />
                        Paper Review Queue
                    </h1>
                    <p className="text-white/60">
                        Review uploaded notes, assignments, and past papers before they go live.
                    </p>
                </div>

                <div className="flex bg-[#111] p-1 rounded-xl border border-white/10">
                    {['pending', 'approved', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${statusFilter === status
                                ? 'bg-white/10 text-white'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    </div>
                ) : papers.length === 0 ? (
                    <div className="text-center py-20 bg-[#111] border border-white/5 rounded-2xl">
                        <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-1">Queue Empty</h3>
                        <p className="text-white/50">No {statusFilter} papers found.</p>
                    </div>
                ) : (
                    papers.map(paper => (
                        <div key={paper._id} className="bg-[#111] border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10">
                            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white">{paper.title}</h3>
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70 capitalize border border-white/10">
                                                {paper.paperType}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-sm flex gap-3">
                                            <span><strong>Course:</strong> {paper.courseId?.code}</span>
                                            <span>•</span>
                                            <span><strong>Year:</strong> {paper.year}</span>
                                            <span>•</span>
                                            <span><strong>Uploader:</strong> {paper.uploadedBy?.name || 'Unknown'}</span>
                                        </p>
                                    </div>

                                    {paper.description && (
                                        <p className="text-white/70 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                                            {paper.description}
                                        </p>
                                    )}

                                    {paper.rejectionReason && statusFilter === 'rejected' && (
                                        <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                                            <p className="text-sm text-red-400"><strong>Rejection Reason:</strong> {paper.rejectionReason}</p>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <button
                                            onClick={() => previewFile(paper)}
                                            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg"
                                        >
                                            <Eye className="w-4 h-4" /> Preview
                                        </button>
                                        <button
                                            onClick={() => downloadFile(paper)}
                                            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg"
                                        >
                                            <Download className="w-4 h-4" /> Download File ({(Math.max(1, paper.fileSize / 1024)).toFixed(0)} KB)
                                        </button>
                                        <a
                                            href={`/learn/papers`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                        >
                                            <ExternalLink className="w-4 h-4" /> View in Learn
                                        </a>
                                    </div>
                                </div>

                                {statusFilter === 'pending' && (
                                    <div className="shrink-0 flex flex-col gap-2 min-w-[200px]">
                                        {rejectingId === paper._id ? (
                                            <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
                                                <input
                                                    type="text"
                                                    placeholder="Reason for rejection..."
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    className="w-full bg-black/50 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setRejectingId(null)}
                                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium rounded-lg transition-colors border border-white/10"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(paper._id, 'rejected')}
                                                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 text-sm font-medium rounded-lg transition-colors border border-red-500/30"
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleAction(paper._id, 'approved')}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl transition-colors border border-emerald-500/20"
                                                >
                                                    <Check className="w-4 h-4" /> Approve Paper
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRejectingId(paper._id);
                                                        setRejectionReason('');
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/20"
                                                >
                                                    <X className="w-4 h-4" /> Reject Paper
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* PDF Preview Modal */}
            <AnimatePresence>
                {previewUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-sm"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 shrink-0">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-400" /> Document Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(previewUrl, '_blank')}
                                        className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                                        title="Open in new tab"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewUrl(null)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg text-white/70 hover:text-red-400 transition-colors"
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
