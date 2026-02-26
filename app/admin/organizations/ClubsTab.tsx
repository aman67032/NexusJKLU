'use client';

import { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ClubsTab() {
    const [clubs, setClubs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [councils, setCouncils] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '', slug: '', description: '', category: 'other', councilId: '',
        chairId: '', coChairId: '', secretaryId: '', generalSecretaryId: ''
    });

    const fetchData = async () => {
        try {
            const [cRes, uRes, cnRes] = await Promise.all([
                api.get('/admin/clubs'),
                api.get('/admin/users?limit=1000'), // Fetch max users for dropdowns
                api.get('/admin/councils') // Needed for "Parent Council" dropdown
            ]);
            setClubs(cRes.data);
            setUsers(uRes.data.users || []);
            setCouncils(cnRes.data || []);
        } catch (error) {
            toast.error('Failed to load clubs data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (club?: any) => {
        if (club) {
            setEditingId(club._id);
            setForm({
                name: club.name || '',
                slug: club.slug || '',
                description: club.description || '',
                category: club.category || 'other',
                councilId: club.councilId?._id || '',
                chairId: club.chairId?._id || '',
                coChairId: club.coChairId?._id || '',
                secretaryId: club.secretaryId?._id || '',
                generalSecretaryId: club.generalSecretaryId?._id || ''
            });
        } else {
            setEditingId(null);
            setForm({
                name: '', slug: '', description: '', category: 'other', councilId: '',
                chairId: '', coChairId: '', secretaryId: '', generalSecretaryId: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Clean out empty councilId specifically so mongoose doesn't choke on "" literal
        const payload = { ...form };
        if (!payload.councilId) delete (payload as any).councilId;

        try {
            if (editingId) {
                await api.put(`/admin/clubs/${editingId}`, payload);
                toast.success('Club updated');
            } else {
                await api.post('/admin/clubs', payload);
                toast.success('Club created');
            }
            setShowModal(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to save club');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this club?')) return;
        try {
            await api.delete(`/admin/clubs/${id}`);
            toast.success('Club deleted');
            fetchData();
        } catch (error: any) {
            toast.error('Failed to delete club');
        }
    };

    if (loading) return <div className="p-8 text-center text-nexus-camel">Loading clubs...</div>;

    const categories = ['technology', 'cultural', 'sports', 'literary', 'social', 'media', 'other'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-6 border-b border-nexus-camel/20">
                <h2 className="text-xl font-bold text-nexus-linen">Clubs</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-nexus-brass text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Club
                </button>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-nexus-camel/20 text-nexus-camel text-sm">
                                <th className="pb-3 font-medium">Club Details</th>
                                <th className="pb-3 font-medium">Chair</th>
                                <th className="pb-3 font-medium">Category / Council</th>
                                <th className="pb-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-nexus-camel/10">
                            {clubs.map((club) => (
                                <tr key={club._id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="font-medium text-nexus-linen">{club.name}</div>
                                        <div className="text-xs text-nexus-camel">/{club.slug}</div>
                                    </td>
                                    <td className="py-4 text-sm text-nexus-linen">
                                        {club.chairId ? club.chairId.name : <span className="text-nexus-khaki/50">Unassigned</span>}
                                    </td>
                                    <td className="py-4 text-sm">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="px-2 py-0.5 bg-nexus-khaki/20 text-nexus-khaki rounded text-xs uppercase tracking-wider">{club.category}</span>
                                            {club.councilId && <span className="text-xs text-nexus-camel">{club.councilId.name}</span>}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(club)} className="p-2 bg-nexus-coffee/20 text-nexus-brass rounded-lg hover:bg-nexus-coffee/40 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(club._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {clubs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-nexus-camel">No clubs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl border border-nexus-camel/20 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-nexus-camel/20 shrink-0">
                            <h3 className="text-xl font-bold text-nexus-linen">{editingId ? 'Edit Club' : 'New Club'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-nexus-camel hover:text-nexus-linen">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="clubForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-nexus-camel mb-1">Name</label>
                                        <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass transition-colors" placeholder="Design Club" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-nexus-camel mb-1">Slug (URL)</label>
                                        <input required type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass transition-colors" placeholder="design-club" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-nexus-camel mb-1">Category</label>
                                        <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-nexus-camel mb-1">Parent Council</label>
                                        <select value={form.councilId} onChange={e => setForm({ ...form, councilId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                            <option value="">-- No Parent Council --</option>
                                            {councils.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-nexus-camel mb-1">Description</label>
                                    <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass transition-colors" />
                                </div>

                                <div className="border-t border-nexus-camel/20 pt-4 mt-4">
                                    <h4 className="font-semibold text-nexus-brass mb-4">Leadership Assignments</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Club Chair</label>
                                            <select value={form.chairId} onChange={e => setForm({ ...form, chairId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Club Co-Chair</label>
                                            <select value={form.coChairId} onChange={e => setForm({ ...form, coChairId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Club Secretary</label>
                                            <select value={form.secretaryId} onChange={e => setForm({ ...form, secretaryId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">General Secretary</label>
                                            <select value={form.generalSecretaryId} onChange={e => setForm({ ...form, generalSecretaryId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-nexus-camel/20 shrink-0 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-nexus-camel hover:text-nexus-linen font-medium transition-colors">Cancel</button>
                            <button type="submit" form="clubForm" disabled={saving} className="px-6 py-2 bg-nexus-brass text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Club'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
