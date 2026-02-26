'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function VoiceTab() {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/users?limit=1000');
            setAllUsers(res.data.users || []);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const voiceAdmins = allUsers.filter(u => u.roles?.includes('voice_admin'));

    const handleAddAdmin = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            const userObj = allUsers.find(u => u._id === selectedUser);
            if (!userObj) return;

            // Add voice_admin role to their existing roles
            const updatedRoles = Array.from(new Set([...(userObj.roles || []), 'voice_admin']));
            await api.put(`/admin/users/${selectedUser}/role`, { roles: updatedRoles });

            toast.success('Assigned Voice Admin role');
            setSelectedUser('');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to assign role');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveAdmin = async (userId: string, currentRoles: string[]) => {
        if (!confirm('Remove Voice Admin privileges from this user?')) return;
        try {
            const newRoles = currentRoles.filter(r => r !== 'voice_admin');
            await api.put(`/admin/users/${userId}/role`, { roles: newRoles });
            toast.success('Removed Voice Admin privileges');
            fetchData();
        } catch (error: any) {
            toast.error('Failed to remove privileges');
        }
    };

    if (loading) return <div className="p-8 text-center text-nexus-camel">Loading Campus Voice data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-6 border-b border-nexus-camel/20">
                <div>
                    <h2 className="text-xl font-bold text-nexus-linen">Campus Voice Department</h2>
                    <p className="text-sm text-nexus-camel mt-1">Users with the Voice Admin role monitor and resolve student complaints.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        className="flex-1 md:w-64 bg-[#0f0f0f] border border-nexus-camel/20 rounded-lg px-3 py-2 text-sm text-nexus-linen focus:outline-none focus:border-nexus-brass"
                    >
                        <option value="">-- Select student to assign --</option>
                        {allUsers.filter(u => !u.roles?.includes('voice_admin')).map(u => (
                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddAdmin}
                        disabled={!selectedUser || saving}
                        className="flex items-center gap-2 px-4 py-2 bg-nexus-brass text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-nexus-camel/20 text-nexus-camel text-sm">
                                <th className="pb-3 font-medium">Name</th>
                                <th className="pb-3 font-medium">Email</th>
                                <th className="pb-3 font-medium w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-nexus-camel/10">
                            {voiceAdmins.map((admin) => (
                                <tr key={admin._id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="font-medium text-nexus-linen">{admin.name}</div>
                                    </td>
                                    <td className="py-4 text-sm text-nexus-camel">
                                        {admin.email}
                                    </td>
                                    <td className="py-4">
                                        <button
                                            onClick={() => handleRemoveAdmin(admin._id, admin.roles)}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-xs font-medium"
                                        >
                                            Revoke Access
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {voiceAdmins.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-nexus-camel">No voice admins appointed yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
