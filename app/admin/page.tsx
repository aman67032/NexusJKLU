'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import {
    Users,
    BookOpen,
    Calendar,
    MessageSquare,
    TrendingUp,
    ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-screen">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.users || 0,
            icon: Users,
            color: 'from-blue-500/20 to-indigo-500/5',
            textColor: 'text-indigo-400',
            borderColor: 'border-indigo-500/20',
        },
        {
            title: 'Pending Papers',
            value: stats?.pendingPapers || 0,
            icon: BookOpen,
            color: 'from-emerald-500/20 to-teal-500/5',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/20',
        },
        {
            title: 'Pending Events',
            value: stats?.pendingEvents || 0,
            icon: Calendar,
            color: 'from-orange-500/20 to-amber-500/5',
            textColor: 'text-orange-400',
            borderColor: 'border-orange-500/20',
        },
        {
            title: 'Open Complaints',
            value: stats?.openComplaints || 0,
            icon: MessageSquare,
            color: 'from-red-500/20 to-rose-500/5',
            textColor: 'text-red-400',
            borderColor: 'border-red-500/20',
        },
        {
            title: 'In Progress Complaints',
            value: stats?.inProgressComplaints || 0,
            icon: ShieldAlert,
            color: 'from-purple-500/20 to-fuchsia-500/5',
            textColor: 'text-purple-400',
            borderColor: 'border-purple-500/20',
        }
    ];

    return (
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                    Admin Overview
                </h1>
                <p className="text-white/60">
                    Welcome back, {user?.name}. Here's what's happening across NexusJKLU today.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-6 rounded-3xl border bg-gradient-to-br ${stat.color} ${stat.borderColor} relative overflow-hidden group`}
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-sm font-medium text-white/50 mb-1">
                                        {stat.title}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl font-bold text-white tracking-tight">
                                            {stat.value}
                                        </h3>
                                        <TrendingUp className={`w-4 h-4 ${stat.textColor} opacity-80`} />
                                    </div>
                                </div>
                                <div className={`p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-12 bg-white/[0.02] border border-white/10 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl">
                <ShieldAlert className="w-12 h-12 text-indigo-400 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold text-white mb-2">Need to manage something specific?</h3>
                <p className="text-white/60 mb-6">
                    Use the sidebar navigation to dive deeper into Users, Review Papers, Manage Events, or Handle Complaints. Your available actions depend on your assigned administrative roles.
                </p>
                <div className="inline-flex gap-2">
                    {user?.roles?.map((role: string) => (
                        <span key={role} className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs font-medium text-white/80 capitalize">
                            {role.replace('_', ' ')}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
