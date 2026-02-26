'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Users, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => { fetchEvent(); }, [params.id]);

    const fetchEvent = async () => {
        try {
            const res = await api.get(`/api/council/events/${params.id}`);
            setEvent(res.data.event || res.data);
        } catch { } finally { setLoading(false); }
    };

    const handleEnroll = async () => {
        if (!user) { router.push('/auth/login'); return; }
        setEnrolling(true);
        try { await api.post(`/api/council/events/${params.id}/enroll`); fetchEvent(); }
        catch (err: any) { alert(err.response?.data?.error || 'Failed to enroll'); }
        finally { setEnrolling(false); }
    };

    if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /></div>);
    if (!event) return (<div className="min-h-screen flex flex-col items-center justify-center"><div className="bg-red-500/10 p-4 rounded-full mb-4"><AlertCircle className="w-8 h-8 text-red-500" /></div><h2 className="text-2xl font-bold text-nexus-linen mb-2">Event Not Found</h2><button onClick={() => router.back()} className="text-[var(--primary)] hover:underline">Go Back</button></div>);

    const isEnrolled = event.is_enrolled;
    const isPast = new Date(event.start_date || event.date) < new Date();
    const canEnroll = user && !isEnrolled && !isPast && event.status === 'approved';
    const eventDate = event.start_date || event.date;

    return (
        <div className="min-h-screen relative pb-20">
            <div className="relative h-[50vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-[var(--background)]">
                    {event.image_url ? (<><img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" /></>) : (<><div className="glow-orb w-[800px] h-[800px] -top-64 -right-64 bg-blue-600" style={{ opacity: 0.15 }} /><div className="glow-orb w-[600px] h-[600px] -bottom-32 -left-32 bg-[var(--primary)]" style={{ opacity: 0.15 }} /></>)}
                </div>
                <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-nexus-linen backdrop-blur-md mb-6 w-fit"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>
                        <div className="flex flex-wrap gap-3">
                            {event.council_name && <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[var(--primary)] text-nexus-linen rounded-full">{event.council_name}</span>}
                            {event.club_name && <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-blue-600 text-nexus-linen rounded-full">{event.club_name}</span>}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl text-nexus-linen">{event.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-lg font-medium text-nexus-khaki">
                            <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[var(--primary)]" />{eventDate && format(new Date(eventDate), 'MMMM d, yyyy')}</div>
                            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500" />{eventDate && format(new Date(eventDate), 'h:mm a')}</div>
                            {event.venue && <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-green-500" />{event.venue}</div>}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2"><div className="glass-card p-8"><h2 className="text-2xl font-bold text-nexus-linen mb-4">About Event</h2><p className="text-nexus-camel whitespace-pre-wrap leading-relaxed">{event.description || "No description."}</p></div></div>
                    <div>
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-nexus-linen mb-6">Registration</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5"><span className="text-nexus-camel">Status</span><span className={`font-bold px-2 py-1 rounded text-xs uppercase ${event.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{event.status}</span></div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5"><span className="text-nexus-camel">Enrolled</span><div className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /><span className="font-bold text-nexus-linen">{event.enrollment_count || 0}</span></div></div>
                            </div>
                            {user ? (isEnrolled ? (<div className="w-full py-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center gap-3 text-green-400 font-bold"><CheckCircle className="w-5 h-5" />Registered</div>) : canEnroll ? (<button onClick={handleEnroll} disabled={enrolling} className="w-full py-4 bg-gradient-to-r from-[var(--primary)] to-orange-600 text-nexus-linen rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50">{enrolling ? 'Registering...' : 'Register Now'}</button>) : (<div className="w-full py-4 text-center font-medium rounded-2xl bg-white/5 text-white/30">{isPast ? 'Event Ended' : 'Registration Closed'}</div>)) : (<button onClick={() => router.push('/auth/login')} className="w-full py-4 bg-blue-600 text-nexus-linen rounded-2xl font-bold hover:bg-blue-700 transition-all">Login to Register</button>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
