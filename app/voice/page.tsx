'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Eye, ArrowRight, TrendingUp, FileText, Filter, X, ThumbsUp } from 'lucide-react';

interface Complaint {
    id: string; _id?: string; title: string; description: string; status: string; priority: string;
    domainName?: string; domain?: string; createdAt?: string; created_at?: string; resolvedAt?: string;
    resolutionDetails?: string; adminSeen?: boolean; studentName?: string; studentEmail?: string;
    upvotes?: number; upvoted?: boolean; anonymous?: boolean;
}

export default function VoicePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewComplaint, setShowNewComplaint] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium', anonymous: false });
    const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/api/voice/complaints');
            const data = res.data?.items || res.data?.complaints || (Array.isArray(res.data) ? res.data : []);
            setComplaints(data);
            const total = data.length;
            const pending = data.filter((c: Complaint) => c.status === 'open').length;
            const in_progress = data.filter((c: Complaint) => c.status === 'in_progress').length;
            const resolved = data.filter((c: Complaint) => c.status === 'resolved').length;
            setStats({ total, pending, in_progress, resolved });
        } catch { } finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            await api.post('/voice/complaints', form);
            setForm({ title: '', description: '', category: 'general', priority: 'medium', anonymous: false });
            setShowNewComplaint(false); fetchData();
        } catch { } finally { setSubmitting(false); }
    };

    const handleUpvote = async (id: string) => {
        try { await api.post(`/voice/complaints/${id}/upvote`); fetchData(); } catch { }
    };

    const safeDate = (d?: string) => {
        if (!d) return 'Unknown'; try { const date = new Date(d); if (isNaN(date.getTime())) return 'Unknown'; return formatDistanceToNow(date, { addSuffix: true }); } catch { return 'Unknown'; }
    };

    const getStatusStyle = (s: string) => {
        switch (s) { case 'open': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'; case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30'; case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30'; default: return 'bg-white/10 text-white/50 border-white/20'; }
    };
    const getPriorityStyle = (p: string) => {
        switch (p) { case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'; case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'; default: return 'bg-white/10 text-white/40 border-white/20'; }
    };

    const resolved = complaints.filter(c => c.status === 'resolved');
    const active = complaints.filter(c => c.status !== 'resolved');
    const filteredActive = active.filter(c => statusFilter === 'all' || c.status === statusFilter);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-green-500 rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-green-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[500px] h-[500px] -bottom-48 -left-48 bg-emerald-500" style={{ opacity: 0.04 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"><span className="gradient-text-green">CampusVoice</span></h1>
                    <p className="text-white/40 text-lg">Submit and track campus complaints anonymously.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[{ label: 'Total', value: stats.total, icon: <MessageSquare className="w-5 h-5 text-white/50" />, bg: 'bg-white/5' },
                    { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5 text-yellow-400" />, bg: 'bg-yellow-500/10' },
                    { label: 'In Progress', value: stats.in_progress, icon: <TrendingUp className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/10' },
                    { label: 'Resolved', value: stats.resolved, icon: <CheckCircle className="w-5 h-5 text-green-400" />, bg: 'bg-green-500/10' },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4">
                            <div className="flex items-center justify-between">
                                <div><p className="text-xs font-semibold text-white/50 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.value}</p></div>
                                <div className={`p-2.5 rounded-full ${s.bg}`}>{s.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New Complaint Button */}
                {user && (
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Complaints</h2>
                        <button onClick={() => setShowNewComplaint(true)} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95">
                            <Plus className="w-4 h-4" /> New Complaint
                        </button>
                    </div>
                )}

                {/* New Complaint Form */}
                {showNewComplaint && (
                    <div className="glass-card p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Submit Complaint</h3>
                            <button onClick={() => setShowNewComplaint(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-white/50" /></button>
                        </div>
                        <div className="bg-orange-500/10 border-l-4 border-orange-400 p-4 rounded-lg mb-4">
                            <p className="text-sm text-white/80"><strong>Note:</strong> Complaints can be submitted anonymously. Please be respectful.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required minLength={5} className="input-field" placeholder="Complaint title" /></div>
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Priority</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input-field"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                            </div>
                            <div><label className="block text-xs font-semibold text-white/50 mb-2">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field"><option value="general">General</option><option value="academic">Academic</option><option value="hostel">Hostel</option><option value="mess">Mess</option><option value="transport">Transport</option><option value="infrastructure">Infrastructure</option></select></div>
                            <div><label className="block text-xs font-semibold text-white/50 mb-2">Description *</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required minLength={10} rows={4} className="input-field" placeholder="Describe your complaint..." /></div>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} className="rounded border-white/20 bg-white/5 text-green-500" /><span className="text-sm text-white/50">Submit anonymously</span></label>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 active:scale-95">{submitting ? 'Submitting...' : 'Submit'}</button>
                                <button type="button" onClick={() => setShowNewComplaint(false)} className="px-6 py-2.5 border border-white/20 rounded-xl text-white/70 hover:bg-white/5 font-semibold">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 text-sm text-white/50 font-semibold"><Filter className="w-4 h-4" />Filters:</span>
                    {['all', 'open', 'in_progress', 'rejected'].map(v => (
                        <button key={v} onClick={() => setStatusFilter(v)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${statusFilter === v ? 'bg-green-500/20 text-white border-green-400/50' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}>
                            {v === 'all' ? 'All' : v === 'in_progress' ? 'In Progress' : v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6 border-b border-white/10 pb-2">
                    <button onClick={() => setActiveTab('active')} className={`px-4 py-2 text-sm font-bold transition-colors relative ${activeTab === 'active' ? 'text-green-400' : 'text-white/40 hover:text-white/60'}`}>
                        Active {active.length > 0 && <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'active' ? 'bg-green-500/20' : 'bg-white/10'}`}>{active.length}</span>}
                        {activeTab === 'active' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-t" />}
                    </button>
                    {resolved.length > 0 && (
                        <button onClick={() => setActiveTab('resolved')} className={`px-4 py-2 text-sm font-bold transition-colors relative ${activeTab === 'resolved' ? 'text-emerald-400' : 'text-white/40 hover:text-white/60'}`}>
                            Resolved <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'resolved' ? 'bg-emerald-500/20' : 'bg-white/10'}`}>{resolved.length}</span>
                            {activeTab === 'resolved' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-t" />}
                        </button>
                    )}
                </div>

                {/* Complaints */}
                {activeTab === 'active' && (
                    filteredActive.length === 0 ? (
                        <div className="glass-card text-center py-12"><FileText className="w-12 h-12 mx-auto mb-4 text-white/20" /><p className="text-white/40 font-semibold">{statusFilter === 'all' ? 'No active complaints.' : 'No complaints match filter.'}</p></div>
                    ) : (
                        <div className="space-y-4">{filteredActive.map(c => <ComplaintCard key={c.id || c._id} complaint={c} safeDate={safeDate} getStatusStyle={getStatusStyle} getPriorityStyle={getPriorityStyle} onUpvote={handleUpvote} />)}</div>
                    )
                )}
                {activeTab === 'resolved' && (
                    <div className="space-y-4">{resolved.map(c => <ComplaintCard key={c.id || c._id} complaint={c} safeDate={safeDate} getStatusStyle={getStatusStyle} getPriorityStyle={getPriorityStyle} onUpvote={handleUpvote} isResolved />)}</div>
                )}
            </div>
        </div>
    );
}

function ComplaintCard({ complaint: c, safeDate, getStatusStyle, getPriorityStyle, onUpvote, isResolved }: any) {
    return (
        <div className={`glass-card p-5 ${isResolved ? 'border-green-500/20' : ''}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div>
                    <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        {c.title}
                        {c.adminSeen && <span title="Seen by Admin"><Eye className="w-4 h-4 text-emerald-400" /></span>}
                    </h4>
                    <p className="text-xs text-white/30 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        {c.domainName || c.domain || c.category || 'General'}
                        <span>•</span>
                        {safeDate(c.createdAt || c.created_at)}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusStyle(c.status)}`}>{c.status?.replace('_', ' ')}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getPriorityStyle(c.priority)}`}>{c.priority}</span>
                </div>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5 mb-3"><p className="text-sm text-white/50 leading-relaxed">{c.description}</p></div>
            {isResolved && c.resolutionDetails && (
                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20 mb-3">
                    <h5 className="font-bold text-sm text-green-400 mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Solution:</h5>
                    <p className="text-sm text-white/60">{c.resolutionDetails}</p>
                </div>
            )}
            <div className="flex items-center gap-3">
                <button onClick={() => onUpvote(c.id || c._id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${c.upvoted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10'}`}>
                    <ThumbsUp className="w-3.5 h-3.5" />{c.upvotes || 0}
                </button>
                {c.anonymous && <span className="text-[10px] text-white/20 font-mono">Anonymous</span>}
            </div>
        </div>
    );
}
