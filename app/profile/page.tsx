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
    const [form, setForm] = useState({ name: '', rollNo: '', studentId: '', department: '', gender: 'female' });
    
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
                        department: p.profile?.department || p.department || '',
                        gender: p.profile?.gender || 'female'
                    });
                } else if (user) {
                    setProfile(user);
                    setForm({
                        name: user.name || '',
                        rollNo: user.profile?.rollNo || '',
                        studentId: user.profile?.studentId || '',
                        department: user.profile?.department || '',
                        gender: user.profile?.gender || 'female'
                    });
                }

                // Fetch complaints (user's own complaints)
                const compRes = await api.get('/api/voice/complaints?mine=true').catch(() => null);
                const compList = compRes?.data?.items || compRes?.data?.complaints || [];
                setComplaints(compList);

                // Fetch saved events from local storage
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
                    department: form.department,
                    gender: form.gender
                }
            });
            setProfile({
                ...profile,
                name: form.name,
                profile: {
                    ...profile?.profile,
                    rollNo: form.rollNo,
                    studentId: form.studentId,
                    department: form.department,
                    gender: form.gender
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
            case 'open': return 'bg-[#E8B24C]/10 text-[#E8B24C] border-[#E8B24C]/20';
            case 'in_progress': return 'bg-[#8FA0D8]/10 text-[#0B0828] border-[#8FA0D8]/20';
            case 'resolved': return 'bg-[#67C587]/10 text-[#67C587] border-[#67C587]/20';
            default: return 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#0B0828] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-background relative overflow-x-hidden p-4 space-y-6 font-sans">
            <Toaster position="top-center" />

            {/* Header / Student Avatar card */}
            <div className="glass-card p-5 border border-black/5 flex items-center gap-4 relative overflow-hidden shadow-[0_2px_8px_rgba(11,8,40,0.01)] mt-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0828]/5 to-transparent pointer-events-none" />
                <div className="w-20 h-20 flex items-center justify-center shrink-0 overflow-hidden relative">
                    <img 
                        src={profile?.profile?.gender === 'male' ? '/avatars/male.png' : '/avatars/female.png'} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-[#0B0828] truncate font-display">{profile?.name || 'JKLU Student'}</h2>
                    <p className="text-[10px] text-[#5B6077] truncate mt-0.5 font-semibold">{profile?.email}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded-full bg-black/5 border border-black/5 text-[8px] font-bold text-secondary uppercase tracking-wider font-display">
                            {profile?.roles?.includes('admin') ? 'Administrator' : 'Student'}
                        </span>
                        {profile?.emailVerified && (
                            <span className="text-[8px] font-bold text-[#67C587] flex items-center gap-0.5 font-display">
                                <CheckCircle2 className="w-2.5 h-2.5 fill-current" /> Verified
                            </span>
                        )}
                    </div>
                </div>
                {!editing && (
                    <button 
                        onClick={() => setEditing(true)}
                        className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-secondary transition-colors shrink-0 active:scale-90 cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tab navigation */}
            <div className="flex items-center gap-1.5 p-1 bg-black/[0.02] border border-black/[0.04] rounded-2xl overflow-x-auto scrollbar-hide no-scrollbar">
                {[
                    { id: 'info', label: 'My Info' },
                    { id: 'saved', label: 'Saved Items' },
                    { id: 'complaints', label: 'Grievances' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id 
                            ? 'bg-[#0B0828]/10 text-[#0B0828] shadow-sm border border-[#0B0828]/15 font-display' 
                            : 'text-[#5B6077] hover:text-[#0B0828] hover:bg-black/5'}`}
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
                                <form onSubmit={handleSave} className="glass-card p-5 border border-black/5 space-y-4 shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[20px]">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B0828]/45 font-display">Display Name</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field py-2 text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B0828]/45 font-display">Roll Number</label>
                                        <input value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. 2025BTECH099" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B0828]/45 font-display">Student ID</label>
                                        <input value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. 100987" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B0828]/45 font-display">Department</label>
                                        <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. Computer Science" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#34446D]/45 font-display">Gender</label>
                                        <select 
                                            value={form.gender} 
                                            onChange={e => setForm({ ...form, gender: e.target.value })} 
                                            className="w-full rounded-xl border border-black/10 bg-white p-2.5 text-xs font-semibold focus:outline-none"
                                        >
                                            <option value="female">Female (Default)</option>
                                            <option value="male">Male</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer">
                                            <Save className="w-3.5 h-3.5" /> Save
                                        </button>
                                        <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#5B6077] text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: <User className="w-3.5 h-3.5 text-[#0B0828]" />, label: 'Name', value: profile?.name },
                                            { icon: <Mail className="w-3.5 h-3.5 text-[#0B0828]" />, label: 'Email', value: profile?.email },
                                            { icon: <IdCard className="w-3.5 h-3.5 text-[#0B0828]" />, label: 'Roll No', value: profile?.profile?.rollNo || profile?.roll_no || 'Not set' },
                                            { icon: <IdCard className="w-3.5 h-3.5 text-[#0B0828]" />, label: 'Student ID', value: profile?.profile?.studentId || profile?.student_id || 'Not set' },
                                            { icon: <Compass className="w-3.5 h-3.5 text-[#0B0828]" />, label: 'Dept', value: profile?.profile?.department || profile?.department || 'Not set' },
                                            { icon: <User className="w-3.5 h-3.5 text-[#0B0828]" />, label: 'Gender', value: profile?.profile?.gender ? (profile.profile.gender === 'male' ? 'Male' : 'Female') : 'Female (Default)' },
                                        ].map((field, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-[20px] bg-white border border-[#0B0828]/5 shadow-[0_2px_6px_rgba(11,8,40,0.01)]">
                                                <div className="p-2 rounded-xl bg-black/5 shrink-0">{field.icon}</div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[8px] font-bold uppercase tracking-wider text-black/35 font-display">{field.label}</p>
                                                    <p className="font-bold text-foreground text-xs truncate mt-0.5">{field.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Settings, Support, Sign out items */}
                                    <div className="glass-card border border-black/5 divide-y divide-black/5 overflow-hidden shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[20px]">
                                        {[
                                            { label: 'Saved Shuttle Routes', icon: Bus, action: () => setActiveTab('saved') },
                                            { label: 'Submit Feedback & Support', icon: HelpCircle, action: () => toast('Support Desk online at info@jklu.edu.in') },
                                            { label: 'Security & Access Settings', icon: Settings, action: () => toast('Verification parameters managed by CTA') }
                                        ].map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={item.action}
                                                className="p-4 flex items-center justify-between hover:bg-black/[0.005] active:bg-black/[0.01] transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3 text-[#5B6077]">
                                                    <item.icon className="w-4 h-4 text-[#0B0828]" />
                                                    <span className="text-xs font-bold font-display">{item.label}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-black/20" />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full py-3.5 rounded-2xl border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer font-display"
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
                                <h3 className="text-xs font-black uppercase tracking-wider text-black/40 flex items-center gap-1.5 font-display">
                                    <Star className="w-3.5 h-3.5 text-[#FF8400] fill-current" /> Favorite Shuttles
                                </h3>
                                {favBuses.map((bus) => (
                                    <div 
                                        key={bus._id} 
                                        onClick={() => router.push('/bus')}
                                        className="glass-card p-4 border border-black/5 hover:border-[#8FA0D8]/40 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#8FA0D8]/10 flex items-center justify-center text-[#0B0828]"><Bus className="w-4 h-4 text-[#8FA0D8]" /></div>
                                            <div>
                                                <h4 className="text-xs font-bold text-foreground leading-none font-display">{bus.routeName}</h4>
                                                <p className="text-[9px] text-[#5B6077] mt-1 leading-none font-semibold">Timings: {bus.timings[0]} • ETA: {bus.eta}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-black/20" />
                                    </div>
                                ))}
                                {favBuses.length === 0 && (
                                    <p className="text-xs text-black/35 text-center py-4 bg-white border border-black/5 rounded-2xl font-bold font-display">No favorite shuttles saved.</p>
                                )}
                            </div>

                            {/* Saved Events */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-black/40 flex items-center gap-1.5 font-display">
                                    <Heart className="w-3.5 h-3.5 text-[#FF8400] fill-current" /> Saved Events
                                </h3>
                                {savedEvents.map((evt) => (
                                    <div 
                                        key={evt._id} 
                                        onClick={() => router.push(`/events/${evt._id}`)}
                                        className="glass-card p-4 border border-black/5 hover:border-[#FF8400]/40 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#FF8400]/10 flex items-center justify-center text-[#FF8400]"><Calendar className="w-4 h-4" /></div>
                                            <div>
                                                <h4 className="text-xs font-bold text-foreground leading-none font-display">{evt.title}</h4>
                                                <p className="text-[9px] text-[#5B6077] mt-1 leading-none font-semibold">{evt.venue} • {evt.club_name}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-black/20" />
                                    </div>
                                ))}
                                {savedEvents.length === 0 && (
                                    <p className="text-xs text-black/35 text-center py-4 bg-white border border-black/5 rounded-2xl font-bold font-display">No events bookmarked.</p>
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
                                <h3 className="text-xs font-black uppercase tracking-wider text-black/40 flex items-center gap-1.5 font-display">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#0B0828]" /> Filing History
                                </h3>
                                <button 
                                    onClick={() => router.push('/complaints')}
                                    className="px-3 py-1.5 rounded-xl bg-[#0B0828]/10 text-[#0B0828] border border-[#0B0828]/15 text-[10px] font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer font-display"
                                >
                                    + File New
                                </button>
                            </div>

                            {complaints.map((comp) => (
                                <div key={comp._id} className="glass-card p-4 border border-black/5 space-y-3 shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[20px]">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-[#0B0828] text-xs leading-tight font-display">{comp.title}</h4>
                                            <p className="text-[9px] text-[#5B6077] mt-1 font-semibold">{comp.ticketId} • {new Date(comp.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold border ${getStatusStyle(comp.status)} font-display`}>
                                            {comp.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#5B6077] leading-relaxed bg-black/[0.005] p-2.5 rounded-xl border border-black/[0.03] font-semibold">
                                        {comp.description}
                                    </p>
                                    {comp.status === 'resolved' && comp.resolutionDetails && (
                                        <div className="p-2.5 rounded-xl bg-[#67C587]/5 border border-[#67C587]/15 text-[11px] text-[#67C587] font-semibold shadow-inner">
                                            <span className="font-black uppercase text-[8px] tracking-wider block mb-1 font-display">Admin Action:</span>
                                            {comp.resolutionDetails}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {complaints.length === 0 && (
                                <div className="glass-card p-6 text-center text-secondary text-xs font-bold border border-black/5 flex flex-col items-center justify-center gap-2 shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[20px]">
                                    <AlertCircle className="w-8 h-8 text-black/10" />
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
