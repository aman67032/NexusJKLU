'use client';

import { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CouncilsTab() {
    const [councils, setCouncils] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '', slug: '', description: '',
        presidentId: '', headStudentAffairsId: '', executiveStudentAffairsId: '', adminId: ''
    });

    const fetchData = async () => {
        try {
            const [cRes, uRes] = await Promise.all([
                api.get('/admin/councils'),
                api.get('/admin/users?limit=1000') // Fetch max users for dropdowns
            ]);
            setCouncils(cRes.data);
            setUsers(uRes.data.users || []);
        } catch (error) {
            toast.error('Failed to load councils data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (council?: any) => {
        if (council) {
            setEditingId(council._id);
            setForm({
                name: council.name || '',
                slug: council.slug || '',
                description: council.description || '',
                presidentId: council.presidentId?._id || '',
                headStudentAffairsId: council.headStudentAffairsId?._id || '',
                executiveStudentAffairsId: council.executiveStudentAffairsId?._id || '',
                adminId: council.adminId?._id || '',
            });
        } else {
            setEditingId(null);
            setForm({
                name: '', slug: '', description: '',
                presidentId: '', headStudentAffairsId: '', executiveStudentAffairsId: '', adminId: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/admin/councils/${editingId}`, form);
                toast.success('Council updated');
            } else {
                await api.post('/admin/councils', form);
                toast.success('Council created');
            }
            setShowModal(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to save council');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this council?')) return;
        try {
            await api.delete(`/admin/councils/${id}`);
            toast.success('Council deleted');
            fetchData();
        } catch (error: any) {
            toast.error('Failed to delete council');
        }
    };

    if (loading) return <div className="p-8 text-center text-nexus-camel">Loading councils...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-6 border-b border-nexus-camel/20">
                <h2 className="text-xl font-bold text-nexus-linen">Councils</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-nexus-brass text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Council
                </button>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-nexus-camel/20 text-nexus-camel text-sm">
                                <th className="pb-3 font-medium">Council Name</th>
                                <th className="pb-3 font-medium">President</th>
                                <th className="pb-3 font-medium">Head of SA</th>
                                <th className="pb-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-nexus-camel/10">
                            {councils.map((council) => (
                                <tr key={council._id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="font-medium text-nexus-linen">{council.name}</div>
                                        <div className="text-xs text-nexus-camel">/{council.slug}</div>
                                    </td>
                                    <td className="py-4 text-sm text-nexus-linen">
                                        {council.presidentId ? council.presidentId.name : <span className="text-nexus-khaki/50">Unassigned</span>}
                                    </td>
                                    <td className="py-4 text-sm text-nexus-linen">
                                        {council.headStudentAffairsId ? council.headStudentAffairsId.name : <span className="text-nexus-khaki/50">Unassigned</span>}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(council)} className="p-2 bg-nexus-coffee/20 text-nexus-brass rounded-lg hover:bg-nexus-coffee/40 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(council._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {councils.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-nexus-camel">No councils found.</td>
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
                            <h3 className="text-xl font-bold text-nexus-linen">{editingId ? 'Edit Council' : 'New Council'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-nexus-camel hover:text-nexus-linen">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="councilForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-nexus-camel mb-1">Name</label>
                                        <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass transition-colors" placeholder="Technical Council" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-nexus-camel mb-1">Slug (URL)</label>
                                        <input required type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass transition-colors" placeholder="technical-council" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-nexus-camel mb-1">Description</label>
                                    <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass transition-colors" />
                                </div>

                                <div className="border-t border-nexus-camel/20 pt-4 mt-4">
                                    <h4 className="font-semibold text-nexus-brass mb-4">Leadership Assignments</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Council President</label>
                                            <select value={form.presidentId} onChange={e => setForm({ ...form, presidentId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Council Admin (Faculty)</label>
                                            <select value={form.adminId} onChange={e => setForm({ ...form, adminId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Head of Student Affairs</label>
                                            <select value={form.headStudentAffairsId} onChange={e => setForm({ ...form, headStudentAffairsId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
                                                <option value="">-- Unassigned --</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-camel mb-1">Executive Student Affairs</label>
                                            <select value={form.executiveStudentAffairsId} onChange={e => setForm({ ...form, executiveStudentAffairsId: e.target.value })} className="w-full bg-[#0f0f0f] border border-nexus-camel/20 rounded-xl px-4 py-2.5 text-nexus-linen focus:outline-none focus:border-nexus-brass">
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
                            <button type="submit" form="councilForm" disabled={saving} className="px-6 py-2 bg-nexus-brass text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Council'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
