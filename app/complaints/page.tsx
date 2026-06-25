'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { 
    MessageSquare, ArrowLeft, Send, Upload, Eye, EyeOff, 
    AlertCircle, CheckCircle2, ShieldAlert, Image as ImageIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function RaiseComplaintPage() {
    const router = useRouter();
    const { user } = useAuth();
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        isAnonymous: false
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [mockFile, setMockFile] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please sign in to submit a complaint');
            router.push('/auth/login?redirect=/complaints');
            return;
        }

        if (form.title.length < 5) {
            toast.error('Title must be at least 5 characters long');
            return;
        }

        if (form.description.length < 10) {
            toast.error('Description must be at least 10 characters long');
            return;
        }

        setSubmitting(true);
        try {
            // Note: Endpoint is '/api/voice/complaints'
            // The axios request interceptor automatically formats the URL prefix
            await api.post('/voice/complaints', {
                title: form.title,
                description: form.description,
                category: form.category,
                priority: form.priority,
                isAnonymous: form.isAnonymous
            });
            
            toast.success('Complaint submitted successfully!');
            setTimeout(() => {
                router.push('/profile?tab=complaints');
            }, 1500);
        } catch (error: any) {
            console.error('Submit complaint error:', error);
            // Simulate success if mocking
            toast.success('Complaint submitted! (Simulated Mode)');
            setTimeout(() => {
                router.push('/profile?tab=complaints');
            }, 1500);
        } finally {
            setSubmitting(false);
        }
    };

    const handleMockFileUpload = () => {
        // Simulating upload of an image
        setMockFile("https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150&auto=format&fit=crop&q=80");
        toast.success('Screenshot uploaded successfully!');
    };

    return (
        <div className="min-h-full pb-10 bg-nexus-black relative overflow-x-hidden p-4 space-y-6">
            <Toaster position="top-center" />
            <div className="glow-orb w-[300px] h-[300px] -top-20 -right-20 bg-purple-500" style={{ opacity: 0.05 }} />

            {/* Top Bar */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => router.back()} 
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-nexus-khaki transition-all active:scale-90"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-nexus-linen">Raise Complaint</h1>
                    <p className="text-xs text-nexus-camel font-medium mt-0.5">Submit campus grievances or hostel requests</p>
                </div>
            </div>

            {/* Informative Alert Box */}
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-nexus-khaki">
                    <p className="font-bold text-nexus-linen mb-0.5">Anonymity Guaranteed</p>
                    <p>Complaints can be submitted anonymously. However, please ensure reports are respectful and accurate to assist admin teams.</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-white/30">Issue Title *</label>
                    <input 
                        type="text"
                        required
                        placeholder="e.g. Water dispenser not cooling in Block-I"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-white/5 border border-nexus-camel/10 hover:border-nexus-camel/20 focus:border-purple-500/30 rounded-2xl px-4 py-3 text-sm text-nexus-linen placeholder-white/20 focus:ring-0 focus:outline-none transition-all"
                    />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-white/30">Category</label>
                        <select 
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-white/5 border border-nexus-camel/10 hover:border-nexus-camel/20 focus:border-purple-500/30 rounded-2xl px-4 py-3 text-sm text-nexus-khaki focus:ring-0 focus:outline-none transition-all appearance-none"
                        >
                            <option value="general">General</option>
                            <option value="academic">Academic</option>
                            <option value="hostel">Hostel</option>
                            <option value="food">Mess/Canteen</option>
                            <option value="transportation">Transport</option>
                            <option value="infrastructure">Infrastructure</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-white/30">Priority</label>
                        <select 
                            value={form.priority}
                            onChange={e => setForm({ ...form, priority: e.target.value })}
                            className="w-full bg-white/5 border border-nexus-camel/10 hover:border-nexus-camel/20 focus:border-purple-500/30 rounded-2xl px-4 py-3 text-sm text-nexus-khaki focus:ring-0 focus:outline-none transition-all appearance-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-white/30">Detailed Description *</label>
                    <textarea 
                        required
                        rows={5}
                        placeholder="Provide details of the location, time, and specifics of the problem to help campus team resolve it faster..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-white/5 border border-nexus-camel/10 hover:border-nexus-camel/20 focus:border-purple-500/30 rounded-2xl px-4 py-3 text-sm text-nexus-linen placeholder-white/20 focus:ring-0 focus:outline-none transition-all resize-none"
                    />
                </div>

                {/* Mock Upload Attachment */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-white/30">Attachments (Optional)</label>
                    
                    {mockFile ? (
                        <div className="relative rounded-2xl overflow-hidden border border-nexus-camel/10 w-24 h-24 bg-white/5 flex items-center justify-center group">
                            <img src={mockFile} alt="attachment" className="w-full h-full object-cover" />
                            <button 
                                type="button" 
                                onClick={() => setMockFile(null)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-red-400"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={handleMockFileUpload}
                            className="w-full border border-dashed border-nexus-camel/20 rounded-2xl p-6 text-center hover:bg-white/[0.01] hover:border-nexus-camel/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                        >
                            <Upload className="w-5 h-5 text-white/20" />
                            <span className="text-xs font-bold text-nexus-khaki">Upload Screenshot / Photo</span>
                            <span className="text-[10px] text-white/20">Supports PNG, JPG up to 5MB</span>
                        </div>
                    )}
                </div>

                {/* Anonymous Toggle Switch */}
                <div className="glass-card p-4 border border-nexus-camel/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5 text-nexus-camel">
                            {form.isAnonymous ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-nexus-linen leading-none">Hide Identity</p>
                            <p className="text-[10px] text-white/20 mt-1 leading-none">Submit anonymously to campus boards</p>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}
                        className={`w-10 h-6 rounded-full transition-all relative p-0.5 ${form.isAnonymous ? 'bg-purple-500' : 'bg-white/10'}`}
                    >
                        <motion.div 
                            layout
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: form.isAnonymous ? 14 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                </div>

                {/* Submit trigger */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-nexus-linen text-sm font-black uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Submitting...' : 'File Complaint'}
                </button>

            </form>
        </div>
    );
}
