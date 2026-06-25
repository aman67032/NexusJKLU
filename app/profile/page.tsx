'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { 
    User, Mail, IdCard, CheckCircle2, Edit2, X, Save, 
    Heart, Star, Clock, LogOut, ChevronRight, HelpCircle, 
    Settings, ShieldAlert, MessageSquare, AlertCircle, Compass, Bus, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Complaint {
    _id: string;
    ticketId: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'rejected';
    priority: string;
    category: string;
    createdAt: string;
    resolutionDetails?: string;
    isAnonymous: boolean;
}

export default function ProfilePortal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams?.get('tab') || 'info';

    const { user, logout } = useAuth();
    
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Profile form states
    const [form, setForm] = useState({ name: '', rollNo: '', studentId: '', department: '' });
    
    // Lists states
    const [savedEvents, setSavedEvents] = useState<any[]>([]);
    const [favBuses, setFavBuses] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch profile
                const res = await api.get('/api/auth/profile').catch(() => null);
                if (res?.data) {
                    const p = res.data.user || res.data;
                    setProfile(p);
                    setForm({
                        name: p.name || '',
                        rollNo: p.profile?.rollNo || p.roll_no || '',
                        studentId: p.profile?.studentId || p.student_id || '',
                        department: p.profile?.department || p.department || ''
                    });
                } else if (user) {
                    setProfile(user);
                    setForm({
                        name: user.name || '',
                        rollNo: user.profile?.rollNo || '',
                        studentId: user.profile?.studentId || '',
                        department: user.profile?.department || ''
                    });
                }

                // Fetch complaints (user's own complaints)
                const compRes = await api.get('/api/voice/complaints?mine=true').catch(() => null);
                const compList = compRes?.data?.items || compRes?.data?.complaints || [];
                setComplaints(compList);

                // Fetch saved events from local storage
                // For demonstration, let's load mock events if bookmarks exist
                const mockSaved = [
                    { _id: "evt-1", title: "SABRANG 2026: Cultural Gala Night", date: new Date(Date.now() + 86400000).toISOString(), venue: "Amphitheatre", club_name: "Music Club" },
                ];
                setSavedEvents(mockSaved);

                // Fetch favorite buses
                const mockBuses = [
                    { _id: "mock-1", routeNumber: "B101", routeName: "JKLU ➔ Mansarovar Metro", timings: ["05:30 PM"], eta: "8 mins", status: "active" }
                ];
                setFavBuses(mockBuses);

            } catch (error) {
                console.warn('Profile load error handled');
            } finally {

                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/api/auth/profile', {
                name: form.name,
                profile: {
                    rollNo: form.rollNo,
                    studentId: form.studentId,
                    department: form.department
                }
            });
            setProfile({
                ...profile,
                name: form.name,
                profile: {
                    ...profile?.profile,
                    rollNo: form.rollNo,
                    studentId: form.studentId,
                    department: form.department
                }
            });
            setEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = () => {
        logout();
        toast.success('Signed out successfully');
        router.push('/auth/login');
    };

    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'open': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-red-500/10 text-red-400 border-red-500/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nexus-black">
                <div className="w-8 h-8 rounded-full border-2 border-nexus-camel/20 border-t-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-nexus-black relative overflow-x-hidden p-4 space-y-6">
            <Toaster position="top-center" />
            <div className="glow-orb w-[300px] h-[300px] -top-20 -right-20 bg-purple-500" style={{ opacity: 0.05 }} />

            {/* Header / Student Avatar card */}
            <div className="glass-card p-5 border border-nexus-camel/10 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-nexus-linen text-2xl font-black shrink-0 shadow-lg ring-2 ring-white/10">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-black text-nexus-linen truncate">{profile?.name || 'JKLU Student'}</h2>
                    <p className="text-[10px] text-white/30 truncate mt-0.5">{profile?.email}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold text-nexus-khaki uppercase tracking-wider">
                            {profile?.roles?.includes('admin') ? 'Administrator' : 'Student'}
                        </span>
                        {profile?.emailVerified && (
                            <span className="text-[8px] font-bold text-green-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5 fill-current" /> Verified
                            </span>
                        )}
                    </div>
                </div>
                {!editing && (
                    <button 
                        onClick={() => setEditing(true)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-camel transition-colors shrink-0"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tab navigation */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-x-auto scrollbar-hide no-scrollbar">
                {[
                    { id: 'info', label: 'My Info' },
                    { id: 'saved', label: 'Saved Items' },
                    { id: 'complaints', label: 'Grievances' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id 
                            ? 'bg-purple-500/10 text-purple-400 shadow-sm border border-purple-500/25' 
                            : 'text-nexus-camel hover:text-nexus-linen hover:bg-white/5'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content area */}
            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    
                    {/* Tab 1: Info */}
                    {activeTab === 'info' && (
                        <motion.div 
                            key="info"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-4"
                        >
                            {editing ? (
                                <form onSubmit={handleSave} className="glass-card p-5 border border-nexus-camel/10 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30">Display Name</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field py-2 text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30">Roll Number</label>
                                        <input value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. 2025BTECH099" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30">Student ID</label>
                                        <input value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. 100987" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30">Department</label>
                                        <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. Computer Science" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-nexus-linen text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50">
                                            <Save className="w-3.5 h-3.5" /> Save
                                        </button>
                                        <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl border border-nexus-camel/20 hover:bg-white/5 text-nexus-camel text-xs font-bold uppercase tracking-wider">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: <User className="w-3.5 h-3.5 text-purple-400" />, label: 'Name', value: profile?.name },
                                            { icon: <Mail className="w-3.5 h-3.5 text-purple-400" />, label: 'Email', value: profile?.email },
                                            { icon: <IdCard className="w-3.5 h-3.5 text-purple-400" />, label: 'Roll No', value: profile?.profile?.rollNo || profile?.roll_no || 'Not set' },
                                            { icon: <IdCard className="w-3.5 h-3.5 text-purple-400" />, label: 'Student ID', value: profile?.profile?.studentId || profile?.student_id || 'Not set' },
                                            { icon: <Compass className="w-3.5 h-3.5 text-purple-400" />, label: 'Dept', value: profile?.profile?.department || profile?.department || 'Not set', span: true },
                                        ].map((field, idx) => (
                                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-nexus-camel/5 ${field.span ? 'col-span-2' : ''}`}>
                                                <div className="p-2 rounded-xl bg-white/5 shrink-0">{field.icon}</div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[8px] font-bold uppercase tracking-wider text-white/20">{field.label}</p>
                                                    <p className="font-bold text-nexus-khaki text-xs truncate mt-0.5">{field.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Settings, Support, Sign out items */}
                                    <div className="glass-card border border-nexus-camel/5 divide-y divide-nexus-camel/5 overflow-hidden">
                                        {[
                                            { label: 'Saved Shuttle Routes', icon: Bus, action: () => setActiveTab('saved') },
                                            { label: 'Submit Feedback & Support', icon: HelpCircle, action: () => toast('Support Desk online at info@jklu.edu.in') },
                                            { label: 'Security & Access Settings', icon: Settings, action: () => toast('Verification parameters managed by CTA') }
                                        ].map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={item.action}
                                                className="p-4 flex items-center justify-between hover:bg-white/[0.01] active:bg-white/[0.02] transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3 text-nexus-khaki">
                                                    <item.icon className="w-4 h-4 text-purple-400" />
                                                    <span className="text-xs font-bold">{item.label}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-white/10" />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full py-3.5 rounded-2xl border border-red-500/20 bg-red-500/[0.02] hover:bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Tab 2: Saved Items */}
                    {activeTab === 'saved' && (
                        <motion.div 
                            key="saved"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-4"
                        >
                            {/* Saved Bus Routes */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> Favorite Shuttles
                                </h3>
                                {favBuses.map((bus) => (
                                    <div 
                                        key={bus._id} 
                                        onClick={() => router.push('/bus')}
                                        className="glass-card p-4 border border-nexus-camel/5 hover:border-yellow-500/20 transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500"><Bus className="w-4 h-4" /></div>
                                            <div>
                                                <h4 className="text-xs font-black text-nexus-linen leading-none">{bus.routeName}</h4>
                                                <p className="text-[9px] text-white/20 mt-1 leading-none">Timings: {bus.timings[0]} • ETA: {bus.eta}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/10" />
                                    </div>
                                ))}
                                {favBuses.length === 0 && (
                                    <p className="text-xs text-white/20 text-center py-4">No favorite shuttles saved.</p>
                                )}
                            </div>

                            {/* Saved Events */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5 text-blue-400 fill-current" /> Saved Events
                                </h3>
                                {savedEvents.map((evt) => (
                                    <div 
                                        key={evt._id} 
                                        onClick={() => router.push(`/events/${evt._id}`)}
                                        className="glass-card p-4 border border-nexus-camel/5 hover:border-blue-500/20 transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Calendar className="w-4 h-4" /></div>
                                            <div>
                                                <h4 className="text-xs font-black text-nexus-linen leading-none">{evt.title}</h4>
                                                <p className="text-[9px] text-white/20 mt-1 leading-none">{evt.venue} • {evt.club_name}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/10" />
                                    </div>
                                ))}
                                {savedEvents.length === 0 && (
                                    <p className="text-xs text-white/20 text-center py-4">No events bookmarked.</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Tab 3: Complaints History */}
                    {activeTab === 'complaints' && (
                        <motion.div 
                            key="complaints"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5" /> Filing History
                                </h3>
                                <button 
                                    onClick={() => router.push('/complaints')}
                                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                    + File New
                                </button>
                            </div>

                            {complaints.map((comp) => (
                                <div key={comp._id} className="glass-card p-4 border border-nexus-camel/5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-xs font-black text-nexus-linen leading-tight">{comp.title}</h4>
                                            <p className="text-[9px] text-white/20 mt-1">{comp.ticketId} • {new Date(comp.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${getStatusStyle(comp.status)}`}>
                                            {comp.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-nexus-camel leading-relaxed bg-white/[0.01] p-2 rounded-lg border border-white/5">
                                        {comp.description}
                                    </p>
                                    {comp.status === 'resolved' && comp.resolutionDetails && (
                                        <div className="p-2.5 rounded-xl bg-green-500/5 border border-green-500/10 text-[11px] text-green-400">
                                            <span className="font-extrabold uppercase text-[8px] tracking-wider block mb-1">Admin Action:</span>
                                            {comp.resolutionDetails}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {complaints.length === 0 && (
                                <div className="glass-card p-6 text-center text-nexus-camel text-xs font-bold border border-nexus-camel/5 flex flex-col items-center justify-center gap-2">
                                    <AlertCircle className="w-8 h-8 text-white/10" />
                                    No complaints filed by you.
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
