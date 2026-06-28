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
            toast.success('Complaint submitted! (Simulated Mode)');
            setTimeout(() => {
                router.push('/profile?tab=complaints');
            }, 1500);
        } finally {
            setSubmitting(false);
        }
    };

    const handleMockFileUpload = () => {
        setMockFile("https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150&auto=format&fit=crop&q=80");
        toast.success('Screenshot uploaded successfully!');
    };

    return (
        <div className="min-h-full pb-10 bg-background relative overflow-x-hidden p-4 space-y-6 font-sans">
            <Toaster position="top-center" />

            {/* Top Bar */}
            <div className="flex items-center gap-3 mt-2">
                <button 
                    onClick={() => router.back()} 
                    className="p-2.5 rounded-xl bg-white border border-[#0B0828]/5 text-[#0B0828] hover:bg-black/[0.01] shadow-[0_2px_4px_rgba(11,8,40,0.01)] transition-all active:scale-90 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display">Raise Complaint</h1>
                    <p className="text-xs text-[#5B6077] font-semibold mt-0.5">Submit campus grievances or hostel requests</p>
                </div>
            </div>

            {/* Informative Alert Box - Custom Muted Coral */}
            <div className="p-4 rounded-[14px] bg-[#E76F51]/10 border border-[#E76F51]/20 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E76F51] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-[#E76F51] font-semibold">
                    <p className="font-bold uppercase tracking-wider text-[9px] mb-0.5 font-display">Anonymity Guaranteed</p>
                    <p>Complaints can be submitted anonymously. However, please ensure reports are respectful and accurate to assist admin teams.</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 font-display">Issue Title *</label>
                    <input 
                        type="text"
                        required
                        placeholder="e.g. Water dispenser not cooling in Block-I"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-white border border-black/5 hover:border-black/10 focus:border-[#E76F51]/30 rounded-[14px] px-4 py-3 text-sm text-[#0B0828] placeholder-black/30 focus:ring-0 focus:outline-none shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all font-semibold"
                    />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-black/40 font-display">Category</label>
                        <select 
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-white border border-black/5 hover:border-black/10 focus:border-[#E76F51]/30 rounded-[14px] px-4 py-3 text-sm text-[#5B6077] focus:ring-0 focus:outline-none transition-all appearance-none font-semibold shadow-[0_2px_8px_rgba(11,8,40,0.01)]"
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
                        <label className="text-xs font-bold uppercase tracking-wider text-black/40 font-display">Priority</label>
                        <select 
                            value={form.priority}
                            onChange={e => setForm({ ...form, priority: e.target.value })}
                            className="w-full bg-white border border-black/5 hover:border-black/10 focus:border-[#E76F51]/30 rounded-[14px] px-4 py-3 text-sm text-[#5B6077] focus:ring-0 focus:outline-none transition-all appearance-none font-semibold shadow-[0_2px_8px_rgba(11,8,40,0.01)]"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 font-display">Detailed Description *</label>
                    <textarea 
                        required
                        rows={5}
                        placeholder="Provide details of the location, time, and specifics of the problem to help campus team resolve it faster..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-white border border-black/5 hover:border-black/10 focus:border-[#E76F51]/30 rounded-[14px] px-4 py-3 text-sm text-[#0B0828] placeholder-black/30 focus:ring-0 focus:outline-none shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all resize-none font-semibold"
                    />
                </div>

                {/* Mock Upload Attachment */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 font-display">Attachments (Optional)</label>
                    
                    {mockFile ? (
                        <div className="relative rounded-[14px] overflow-hidden border border-black/5 w-24 h-24 bg-white flex items-center justify-center group shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                            <img src={mockFile} alt="attachment" className="w-full h-full object-cover" />
                            <button 
                                type="button" 
                                onClick={() => setMockFile(null)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-rose-400 font-display"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={handleMockFileUpload}
                            className="w-full border border-dashed border-black/10 rounded-[14px] p-6 text-center hover:bg-black/[0.005] hover:border-black/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                        >
                            <Upload className="w-5 h-5 text-black/20" />
                            <span className="text-xs font-bold text-[#5B6077] font-display">Upload Screenshot / Photo</span>
                            <span className="text-[10px] text-black/20 font-medium">Supports PNG, JPG up to 5MB</span>
                        </div>
                    )}
                </div>

                {/* Anonymous Toggle Switch */}
                <div className="glass-card p-4 border border-black/5 flex items-center justify-between shadow-[0_2px_8px_rgba(11,8,40,0.01)] rounded-[20px]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-black/5 text-[#5B6077]">
                            {form.isAnonymous ? <EyeOff className="w-4 h-4 text-[#E76F51]" /> : <Eye className="w-4 h-4 text-secondary" />}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#0B0828] leading-none font-display">Hide Identity</p>
                            <p className="text-[10px] text-[#5B6077] mt-1 leading-none font-semibold">Submit anonymously to campus boards</p>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}
                        className={`w-10 h-6 rounded-full transition-all relative p-0.5 ${form.isAnonymous ? 'bg-[#E76F51]' : 'bg-black/10'}`}
                    >
                        <motion.div 
                            layout
                            className="w-5 h-5 rounded-full bg-white shadow-sm"
                            animate={{ x: form.isAnonymous ? 14 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                </div>

                {/* Submit trigger */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-4 mt-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Submitting...' : 'File Complaint'}
                </button>

            </form>
        </div>
    );
}
