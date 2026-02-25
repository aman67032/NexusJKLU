'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(email, name, password);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            <div className="glow-orb w-[400px] h-[400px] -bottom-32 -left-32 bg-[var(--secondary)]" style={{ opacity: 0.08 }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-dark)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--secondary)]/20">
                            <UserPlus className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create Account</h1>
                        <p className="text-white/40 text-sm mt-1">Join NexusJKLU community</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-white/50 mb-1.5 block">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your Name" required />
                        </div>
                        <div>
                            <label className="text-sm text-white/50 mb-1.5 block">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@jklu.edu.in" required />
                        </div>
                        <div>
                            <label className="text-sm text-white/50 mb-1.5 block">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-white/50 mb-1.5 block">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))' }}>
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" />Sign Up</>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/30 mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-[var(--secondary)] hover:text-[var(--secondary-light)] font-medium">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
