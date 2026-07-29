'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// Custom SVG Login Illustration
const LoginIllustration = () => (
    <svg className="w-full max-w-[240px] h-[170px] mx-auto mb-3 select-none" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0F4FF" />
                <stop offset="100%" stopColor="#E6ECFA" />
            </linearGradient>
            <linearGradient id="portalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2A3B3C" />
                <stop offset="100%" stopColor="#0B0828" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8FA0D8" />
                <stop offset="100%" stopColor="#6776C5" />
            </linearGradient>
            <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8400" />
                <stop offset="100%" stopColor="#E76F51" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0B0828" floodOpacity="0.12" />
            </filter>
        </defs>

        {/* Background Soft Circles */}
        <circle cx="160" cy="120" r="92" fill="url(#bgGrad)" />
        <circle cx="160" cy="120" r="74" stroke="#8FA0D8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

        {/* Door/Portal Shape */}
        <rect x="115" y="55" width="90" height="125" rx="45" fill="url(#portalGrad)" filter="url(#shadow)" />
        <rect x="122" y="62" width="76" height="111" rx="38" stroke="#8FA0D8" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />

        {/* Lock Icon Center */}
        <circle cx="160" cy="110" r="20" fill="url(#accentGrad)" />
        <path d="M160 117 V 130" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="160" cy="108" r="5.5" fill="white" />

        {/* Floating Key Graphic */}
        <g transform="translate(182, 68) rotate(-25)">
            <rect x="0" y="0" width="34" height="13" rx="6.5" fill="url(#keyGrad)" filter="url(#shadow)" />
            <circle cx="6.5" cy="6.5" r="2.8" fill="white" />
            <rect x="22" y="9" width="3.5" height="7" rx="1" fill="url(#keyGrad)" />
            <rect x="28" y="9" width="3.5" height="5" rx="1" fill="url(#keyGrad)" />
        </g>

        {/* Decorative Floating Nodes */}
        <circle cx="85" cy="75" r="5" fill="#8FA0D8" opacity="0.6" />
        <circle cx="235" cy="165" r="7" fill="#FF8400" opacity="0.5" />
        <circle cx="75" cy="155" r="3.5" fill="#2A3B3C" opacity="0.3" />
        <circle cx="245" cy="85" r="4.5" fill="#8FA0D8" opacity="0.5" />

        {/* Sparkles */}
        <path d="M95 105 L96.5 110.5 L102 112 L96.5 113.5 L95 119 L93.5 113.5 L88 112 L93.5 110.5 Z" fill="#FF8400" opacity="0.8" />
        <path d="M225 125 L226.2 129.2 L230.4 130.4 L226.2 131.6 L225 135.8 L223.8 131.6 L219.6 130.4 L223.8 129.2 Z" fill="#8FA0D8" opacity="0.9" />
    </svg>
);

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-between items-center p-6 relative font-sans">
            {/* Top Switch Link */}
            <div className="w-full flex justify-end max-w-md pt-2">
                <Link href="/auth/register" className="text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5 text-[#111827]">
                    Sign Up
                    <svg className="w-4 h-4 text-[#111827]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>

            {/* Main Form container */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center py-4">
                {/* SVG Illustration */}
                <LoginIllustration />

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black tracking-tight text-[#111827] font-display">LOGIN</h2>
                    <p className="text-xs text-[#666A7A] mt-1 font-semibold">
                        Login via JKLU Email.
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold leading-relaxed">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email Id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                            required
                        />
                    </div>

                    {/* Password input */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 pr-12 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]/45 hover:text-[#111827]/80"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex justify-end pr-2">
                        <Link href="/auth/forgot-password" className="text-[11px] font-bold text-[#0D6277] hover:underline">
                            Forgot password
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-32 mx-auto flex items-center justify-center py-3 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[18px] hover:opacity-90 active:scale-98 transition-all shadow-sm"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'LOGIN'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Footer space */}
            <div className="h-6" />
        </div>
    );
}
