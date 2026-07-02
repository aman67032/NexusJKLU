'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// Static illustration from assets

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    
    // Email states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Phone states
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const otpRefs = useRef<HTMLInputElement[]>([]);
    const [timer, setTimer] = useState(240);
    const [otpSent, setOtpSent] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Timer logic for Phone OTP resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 4) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const sendMockOtp = () => {
        if (!phone || phone.length < 10) {
            setError('Enter a valid phone number');
            return;
        }
        setError('');
        setOtpSent(true);
        setTimer(240);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (loginMethod === 'email') {
                // Live Authentication via backend API
                await login(email, password);
                router.push('/');
            } else {
                // Phone Login flow
                if (!otpSent) {
                    sendMockOtp();
                    setLoading(false);
                    return;
                }
                const otpString = otp.join('');
                if (otpString.length < 5) {
                    setError('Enter a 5-digit OTP');
                    setLoading(false);
                    return;
                }

                // Simulate Phone Authentication
                // Set mock Rashi credentials in localStorage
                const mockUserData = {
                    id: "mock_rashi_id",
                    email: "rashi@jklu.edu.in",
                    name: "Rashi Sharma",
                    roles: ["student"],
                    emailVerified: true,
                    profile: {
                        gender: "female",
                        rollNo: "2025JKLU012",
                        department: "Design",
                        university: "JKLU"
                    }
                };
                localStorage.setItem('nexus_token', 'mock_phone_token_123456');
                localStorage.setItem('nexus_user', JSON.stringify(mockUserData));

                // Redirect using reload to force Context refresh
                window.location.href = '/';
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Check your credentials.');
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
                {/* Key/Door Illustration */}
                <img 
                    src="/login/Screenshot 2026-07-02 165035.svg" 
                    alt="Login Illustration" 
                    className="w-full max-w-[260px] h-[190px] mx-auto object-contain mb-4 select-none"
                />

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black tracking-tight text-[#111827] font-display">LOGIN</h2>
                    <p className="text-xs text-[#666A7A] mt-1 font-semibold">
                        {loginMethod === 'email' ? 'Login via Email.' : 'Login via phone number.'}
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold leading-relaxed">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {loginMethod === 'email' ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            {/* Phone Input */}
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                                    className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                                    required
                                />
                            </div>

                            {otpSent && (
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[11px] font-bold text-[#666A7A]">{timer}s</span>
                                        <button 
                                            type="button"
                                            disabled={timer > 0} 
                                            onClick={sendMockOtp}
                                            className={`text-[11px] font-black ${timer > 0 ? 'text-[#666A7A]/40 cursor-not-allowed' : 'text-[#0D6277] hover:underline'}`}
                                        >
                                            Resend
                                        </button>
                                    </div>
                                    
                                    {/* 5 Digit OTP inputs */}
                                    <div className="flex justify-between gap-3.5 px-0.5">
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={(el) => { otpRefs.current[idx] = el as HTMLInputElement; }}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                className="w-12 h-12 border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-2xl text-center font-black text-base outline-none transition-colors bg-[#FDFDFD]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

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
                                loginMethod === 'email' ? 'LOGIN' : (otpSent ? 'Next' : 'Send OTP')
                            )}
                        </button>
                    </div>
                </form>

                {/* Google and Apple login options */}
                <div className="flex flex-col items-center gap-6 mt-8">
                    <div className="flex items-center gap-4">
                        {/* Google Logo Button */}
                        <button type="button" className="w-11 h-11 rounded-full border-2 border-[#111827]/10 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                        </button>
                        
                        {/* Apple Logo Button */}
                        <button type="button" className="w-11 h-11 rounded-full border-2 border-[#111827]/10 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm">
                            <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.96-1.4" />
                            </svg>
                        </button>
                    </div>

                    {/* Method Toggle Link */}
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMethod((prev) => (prev === 'email' ? 'phone' : 'email'));
                            setError('');
                            setOtpSent(false);
                            setOtp(['', '', '', '', '']);
                        }}
                        className="text-xs font-black hover:opacity-80 transition-opacity text-[#111827] focus:outline-none"
                    >
                        {loginMethod === 'email' ? 'Continue with Phone number.' : 'Continue with Email.'}
                    </button>
                </div>
            </div>
            
            {/* Footer space matching standard layouts */}
            <div className="h-6" />
        </div>
    );
}
