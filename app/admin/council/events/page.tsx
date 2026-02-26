'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Search, Check, X, ShieldAlert, CheckCircle2, Clock, CalendarDays, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ReviewEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/council/events', {
                params: { status: statusFilter, limit: 50 },
                withCredentials: true
            });
            setEvents(data.items);
        } catch (error) {
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [statusFilter]);

    const handleAction = async (id: string, action: 'approved' | 'rejected' | 'completed') => {
        try {
            if (action === 'approved') {
                await api.put(`/council/events/${id}/approve`, {}, { withCredentials: true });
            } else {
                await api.put(`/council/events/${id}`, { status: action }, { withCredentials: true });
            }

            toast.success(`Event ${action} successfully`);
            fetchEvents(); // refresh
        } catch (error) {
            toast.error(`Failed to update event`);
        }
    };

    if (!user?.roles?.some((r: string) => ['super_admin', 'admin', 'head_student_affairs', 'executive_student_affairs', 'council_admin', 'council_president', 'club_chair', 'club_co_chair', 'club_secretary', 'club_general_secretary'].includes(r))) {
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
                        <Calendar className="w-8 h-8 text-orange-500" />
                        Event Management
                    </h1>
                    <p className="text-nexus-khaki">
                        Review, approve, and manage registered events across all clubs and councils.
                    </p>
                </div>

                <div className="flex bg-nexus-green p-1 rounded-xl border border-nexus-camel/20">
                    {['pending', 'approved', 'rejected', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${statusFilter === status
                                ? 'bg-white/10 text-nexus-linen'
                                : 'text-nexus-camel hover:text-nexus-khaki hover:bg-white/5'
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
                        <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-nexus-green border border-nexus-camel/10 rounded-2xl">
                        <CalendarDays className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-nexus-linen mb-1">Queue Empty</h3>
                        <p className="text-nexus-camel">No {statusFilter} events found.</p>
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event._id} className="bg-nexus-green border border-nexus-camel/10 rounded-2xl p-6 transition-all hover:border-nexus-camel/20">
                            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-nexus-linen">{event.title}</h3>
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-nexus-khaki capitalize border border-nexus-camel/20">
                                                {event.category}
                                            </span>
                                            {event.isPublic && (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-nexus-coffee/10 text-nexus-brass capitalize border border-indigo-500/20">
                                                    Public
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-nexus-khaki text-sm flex gap-3 flex-wrap">
                                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(event.date).toLocaleDateString()}</span>
                                            {event.time && <span>• {event.time}</span>}
                                            {event.clubId?.name && <span>• <strong>Club:</strong> {event.clubId.name}</span>}
                                            <span>• <strong>Organizer:</strong> {event.organizerId?.name || 'Unknown'}</span>
                                        </p>
                                    </div>

                                    {event.description && (
                                        <p className="text-nexus-khaki text-sm bg-white/5 p-3 rounded-xl border border-nexus-camel/10">
                                            {event.description}
                                        </p>
                                    )}

                                    {statusFilter === 'approved' && (
                                        <a
                                            href={`/council/events/${event._id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-sm text-nexus-camel hover:text-nexus-linen transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 mt-2"
                                        >
                                            <ExternalLink className="w-4 h-4" /> View Live Event Page
                                        </a>
                                    )}
                                </div>

                                <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto md:min-w-[160px]">
                                    {statusFilter === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(event._id, 'approved')}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl transition-colors border border-emerald-500/20"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(event._id, 'rejected')}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/20"
                                            >
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                        </>
                                    )}

                                    {statusFilter === 'approved' && (
                                        <button
                                            onClick={() => handleAction(event._id, 'completed')}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-xl transition-colors border border-blue-500/20"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Mark Completed
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
