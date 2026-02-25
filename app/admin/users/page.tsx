'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Edit2, ShieldAlert, Check, X, ShieldCheck, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
    _id: string;
    email: string;
    name: string;
    roles: string[];
    createdAt: string;
    profile?: {
        studentId?: string;
        rollNo?: string;
    };
}

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Editing State
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editedRoles, setEditedRoles] = useState<string[]>([]);

    const ALL_ROLES = ['student', 'admin', 'council_admin', 'voice_admin', 'learn_admin', 'coordinator', 'coding_ta'];

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users', {
                params: { page, limit: 15, search: searchTerm }
            });
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [page, searchTerm]);

    const handleSaveRole = async (userId: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { roles: editedRoles });
            toast.success('Roles updated successfully');
            setEditingUserId(null);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update roles');
        }
    };

    const toggleRole = (role: string) => {
        setEditedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    if (!currentUser?.roles?.includes('admin')) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-screen text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-white/60">Only Super Admins can manage users and assign roles.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-500" />
                        User Management
                    </h1>
                    <p className="text-white/60">
                        View all registered users and assign administrative roles.
                    </p>
                </div>

                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
            </header>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-[#111]">
                        <thead className="bg-[#151515] border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Student ID</th>
                                <th className="px-6 py-4 font-medium">Assigned Roles</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => {
                                const isEditing = editingUserId === user._id;

                                return (
                                    <tr key={user._id} className="hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-white/90">{user.name}</p>
                                            <p className="text-sm text-white/50">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-white/70 text-sm">
                                            {user.profile?.studentId || user.profile?.rollNo || <span className="text-white/30 italic">Not provided</span>}
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {ALL_ROLES.map(role => (
                                                        <button
                                                            key={role}
                                                            onClick={() => toggleRole(role)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editedRoles.includes(role)
                                                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                                                                : 'bg-black/20 text-white/40 border-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            {role.replace('_', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles.map(role => (
                                                        <span key={role} className={`px-2 py-1 rounded-md text-xs font-medium border ${role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                            role.includes('admin') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                                'bg-white/5 text-white/70 border-white/10'
                                                            }`}>
                                                            {role.replace('_', ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white/50 text-sm whitespace-nowrap">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isEditing ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUserId(null)}
                                                        className="p-2 text-white/50 hover:bg-white/10 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveRole(user._id)}
                                                        className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                        title="Save Changes"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingUserId(user._id);
                                                        setEditedRoles(user.roles);
                                                    }}
                                                    className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                    disabled={currentUser.email === user.email} // prevent editing own roles here
                                                    title={currentUser.email === user.email ? "Cannot edit own roles here" : "Edit Roles"}
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {!loading && users.length === 0 && (
                        <div className="text-center py-12 text-white/50">
                            No users found matching "{searchTerm}"
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center p-8">
                            <div className="w-6 h-6 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-[#151515] border-t border-white/10 p-4 flex justify-between items-center text-sm text-white/60">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-[#222] hover:bg-[#333] disabled:opacity-50 rounded-lg transition-colors"
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-[#222] hover:bg-[#333] disabled:opacity-50 rounded-lg transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
