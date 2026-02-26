'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, ShieldAlert, FileText, Check, Clock, ShieldCheck, Eye, ArrowRightLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ReviewComplaints() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const [respondingId, setRespondingId] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');
    const [responseStatus, setResponseStatus] = useState('in_progress');

    const [transferringId, setTransferringId] = useState<string | null>(null);
    const [transferCategory, setTransferCategory] = useState('');

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params: any = { limit: 50 };
            if (statusFilter !== 'all') params.status = statusFilter;

            const { data } = await api.get('/voice/admin/complaints', {
                params,
                withCredentials: true
            });
            setComplaints(data.items);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [statusFilter]);

    const handleUpdate = async (id: string, newStatus?: string) => {
        if (respondingId === id && !responseText.trim() && !newStatus) {
            toast.error('Response text cannot be empty');
            return;
        }

        try {
            const payload: any = {};
            if (newStatus) payload.status = newStatus;

            if (respondingId === id) {
                payload.response = responseText;
                payload.status = responseStatus;
            }

            await api.put(`/voice/admin/complaints/${id}`, payload, { withCredentials: true });

            toast.success(`Complaint updated`);
            setRespondingId(null);
            setResponseText('');
            fetchComplaints();
        } catch (error) {
            toast.error(`Failed to update complaint`);
        }
    };

    const handleMarkSeen = async (id: string, currentlySeen: boolean) => {
        if (currentlySeen) return;
        try {
            await api.put(`/voice/admin/complaints/${id}/seen`, {}, { withCredentials: true });
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to mark as seen');
        }
    };

    const handleTransfer = async (id: string) => {
        if (!transferCategory) {
            toast.error('Please select a category');
            return;
        }
        try {
            await api.put(`/voice/admin/complaints/${id}/transfer`, { category: transferCategory }, { withCredentials: true });
            toast.success('Complaint transferred successfully');
            setTransferringId(null);
            setTransferCategory('');
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to transfer complaint');
        }
    };

    if (!user?.roles?.some((r: string) => ['super_admin', 'admin', 'voice_admin'].includes(r))) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-screen">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-nexus-linen mb-2">Access Denied</h1>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-nexus-linen tracking-tight mb-2 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-rose-500" />
                        Complaints Inbox
                    </h1>
                    <p className="text-nexus-khaki">
                        Review, investigate, and respond to student complaints and issues.
                    </p>
                </div>

                <div className="flex bg-nexus-green p-1 rounded-xl border border-nexus-camel/20 overflow-x-auto">
                    {['all', 'open', 'in_progress', 'resolved', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${statusFilter === status
                                ? 'bg-white/10 text-nexus-linen'
                                : 'text-nexus-camel hover:text-nexus-khaki hover:bg-white/5'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-20 bg-nexus-green border border-nexus-camel/10 rounded-2xl">
                        <ShieldCheck className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-nexus-linen mb-1">Inbox Clear</h3>
                        <p className="text-nexus-camel">No {statusFilter.replace('_', ' ')} complaints found.</p>
                    </div>
                ) : (
                    complaints.map(complaint => (
                        <div key={complaint._id} className="bg-nexus-green border border-nexus-camel/10 rounded-2xl p-6 transition-all hover:border-nexus-camel/20">
                            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-nexus-linen">{complaint.title}</h3>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${complaint.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    complaint.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {complaint.priority} Priority
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${complaint.status === 'open' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    complaint.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {complaint.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-nexus-khaki text-sm flex gap-3 flex-wrap">
                                                <span><strong>ID:</strong> {complaint.ticketId}</span>
                                                <span>• <strong>Cat:</strong> {complaint.category}</span>
                                                <span>• <strong>By:</strong> {complaint.isAnonymous ? 'Anonymous' : complaint.userId?.name || 'Unknown'}</span>
                                                <span>• {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                {complaint.adminSeen && <span className="text-emerald-400 font-medium">• Seen by Admin</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] p-4 rounded-xl border border-nexus-camel/10 font-mono text-sm text-nexus-khaki">
                                        {complaint.description}
                                    </div>

                                    {complaint.response && (
                                        <div className="bg-nexus-coffee/5 p-4 rounded-xl border border-indigo-500/10 mt-4">
                                            <p className="text-xs text-nexus-brass/80 uppercase font-bold tracking-wider mb-2">
                                                Admin Response (from {complaint.respondedBy?.name || 'Admin'})
                                            </p>
                                            <p className="text-sm text-indigo-100/90">{complaint.response}</p>
                                        </div>
                                    )}

                                    {respondingId === complaint._id && (
                                        <div className="flex flex-col gap-3 mt-4 p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl animate-in fade-in zoom-in duration-200">
                                            <p className="text-sm font-medium text-rose-300">New Response</p>
                                            <textarea
                                                placeholder="Write an official response to the student..."
                                                value={responseText}
                                                onChange={(e) => setResponseText(e.target.value)}
                                                rows={3}
                                                className="w-full bg-nexus-black/50 border border-nexus-camel/20 rounded-lg px-3 py-2 text-sm text-nexus-linen focus:outline-none focus:border-rose-500/50 resize-y"
                                                autoFocus
                                            />
                                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <span className="text-sm text-nexus-camel">Set Status:</span>
                                                    <select
                                                        value={responseStatus}
                                                        onChange={(e) => setResponseStatus(e.target.value)}
                                                        className="bg-nexus-green border border-nexus-camel/20 rounded-lg px-3 py-1.5 text-sm text-nexus-linen focus:outline-none"
                                                    >
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => setRespondingId(null)}
                                                        className="flex-1 sm:flex-none px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-khaki text-sm font-medium rounded-lg transition-colors border border-nexus-camel/20"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdate(complaint._id)}
                                                        className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-sm font-medium rounded-lg transition-colors border border-rose-500/30"
                                                    >
                                                        Submit Response
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {transferringId === complaint._id && (
                                        <div className="flex flex-col gap-3 mt-4 p-4 border border-indigo-500/20 bg-nexus-coffee/5 rounded-xl animate-in fade-in zoom-in duration-200">
                                            <p className="text-sm font-medium text-indigo-300">Transfer Complaint</p>
                                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                                <select
                                                    value={transferCategory}
                                                    onChange={(e) => setTransferCategory(e.target.value)}
                                                    className="w-full sm:w-auto flex-1 bg-nexus-black/50 border border-nexus-camel/20 rounded-lg px-3 py-2 text-sm text-nexus-linen focus:outline-none focus:border-indigo-500/50"
                                                >
                                                    <option value="">Select New Category</option>
                                                    {['academic', 'infrastructure', 'hostel', 'food', 'transportation', 'administration', 'other']
                                                        .filter(c => c !== complaint.category)
                                                        .map(c => <option key={c} value={c}>{c}</option>)
                                                    }
                                                </select>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => setTransferringId(null)}
                                                        className="flex-1 sm:flex-none px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-khaki text-sm font-medium rounded-lg transition-colors border border-nexus-camel/20"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleTransfer(complaint._id)}
                                                        className="flex-1 sm:flex-none px-4 py-2 bg-nexus-coffee/20 hover:bg-nexus-coffee/30 text-nexus-brass text-sm font-medium rounded-lg transition-colors border border-indigo-500/30"
                                                    >
                                                        Transfer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto md:min-w-[160px]">
                                    {!complaint.adminSeen && (
                                        <button
                                            onClick={() => handleMarkSeen(complaint._id, complaint.adminSeen)}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-xl transition-colors border border-blue-500/20"
                                        >
                                            <Eye className="w-4 h-4" /> Mark as Seen
                                        </button>
                                    )}

                                    {['open', 'in_progress'].includes(complaint.status) && respondingId !== complaint._id && (
                                        <button
                                            onClick={() => {
                                                setRespondingId(complaint._id);
                                                setTransferringId(null);
                                                setResponseText(complaint.response || '');
                                                setResponseStatus(complaint.status === 'open' ? 'in_progress' : complaint.status);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-xl transition-colors border border-rose-500/20"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Add Response
                                        </button>
                                    )}

                                    {complaint.status === 'open' && respondingId !== complaint._id && (
                                        <button
                                            onClick={() => handleUpdate(complaint._id, 'in_progress')}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-medium rounded-xl transition-colors border border-amber-500/20"
                                        >
                                            <Clock className="w-4 h-4" /> Move to Progress
                                        </button>
                                    )}

                                    {['open', 'in_progress'].includes(complaint.status) && respondingId !== complaint._id && (
                                        <button
                                            onClick={() => handleUpdate(complaint._id, 'resolved')}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl transition-colors border border-emerald-500/20"
                                        >
                                            <Check className="w-4 h-4" /> Mark Resolved
                                        </button>
                                    )}

                                    {['open', 'in_progress'].includes(complaint.status) && transferringId !== complaint._id && (
                                        <button
                                            onClick={() => {
                                                setTransferringId(complaint._id);
                                                setRespondingId(null);
                                                setTransferCategory('');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-nexus-coffee/10 hover:bg-nexus-coffee/20 text-nexus-brass text-sm font-medium rounded-xl transition-colors border border-indigo-500/20"
                                        >
                                            <ArrowRightLeft className="w-4 h-4" /> Transfer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
