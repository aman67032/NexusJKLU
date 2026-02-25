'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { User, Mail, IdCard, CheckCircle2, Edit2, X, Save, BookOpen, FileText, Code, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const subNav = [
    { href: '/learn', label: 'Overview', icon: BookOpen },
    { href: '/learn/papers', label: 'Papers', icon: FileText },
    { href: '/learn/coding-hour', label: 'Coding Hour', icon: Code },
    { href: '/learn/profile', label: 'My Profile', icon: UserCircle },
];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', roll_no: '', student_id: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/api/auth/profile')
            .then(res => { const p = res.data.user || res.data; setProfile(p); setForm({ name: p.name || '', roll_no: p.roll_no || '', student_id: p.student_id || '' }); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            await api.put('/api/auth/profile', form);
            setProfile({ ...profile, ...form }); setEditing(false);
        } catch { } finally { setSaving(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-[var(--secondary)] rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-indigo-500" style={{ opacity: 0.06 }} />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-white mb-6">My Profile</h1>

                        {/* Sub Navigation */}
                        <div className="mb-0 z-20 relative">
                            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar scroll-fade-right">
                                <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-max min-w-full lg:min-w-0 backdrop-blur-md">
                                    {subNav.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = item.href === '/learn/profile';
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                                    ? 'bg-[var(--secondary)]/15 text-[var(--secondary)] font-bold'
                                                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
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
                    </div>

                    <div className="glass-card p-8">
                        {/* Avatar */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shrink-0">
                                {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h2>
                                <p className="text-white/30 text-sm">{profile?.email}</p>
                                {profile?.role && <span className="inline-block mt-2 px-3 py-1 bg-[var(--secondary)]/10 border border-[var(--secondary)]/20 rounded-full text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">{profile.role}</span>}
                            </div>
                        </div>

                        {/* Fields */}
                        {editing ? (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Roll Number</label><input value={form.roll_no} onChange={e => setForm({ ...form, roll_no: e.target.value })} className="input-field" placeholder="e.g. 2024BTECH001" /></div>
                                <div><label className="block text-xs font-semibold text-white/50 mb-2">Student ID</label><input value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} className="input-field" placeholder="Your student ID" /></div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={saving} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}</button>
                                    <button type="button" onClick={() => setEditing(false)} className="px-5 py-2.5 border border-white/20 rounded-xl text-white/50 hover:bg-white/5 font-semibold flex items-center gap-2"><X className="w-4 h-4" />Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { icon: <User className="w-4 h-4" />, label: 'Name', value: profile?.name },
                                        { icon: <Mail className="w-4 h-4" />, label: 'Email', value: profile?.email },
                                        { icon: <IdCard className="w-4 h-4" />, label: 'Roll Number', value: profile?.roll_no || 'Not set' },
                                        { icon: <IdCard className="w-4 h-4" />, label: 'Student ID', value: profile?.student_id || 'Not set' },
                                    ].map(field => (
                                        <div key={field.label} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <div className="p-2 rounded-lg bg-white/5 text-white/30 shrink-0">{field.icon}</div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-0.5">{field.label}</p>
                                                <p className="font-semibold text-white/80 text-sm truncate">{field.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {profile?.id_verified && (
                                    <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 font-bold text-sm">ID Verified</span>
                                    </div>
                                )}

                                <button onClick={() => setEditing(true)} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-all"><Edit2 className="w-4 h-4" />Edit Profile</button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
