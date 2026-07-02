'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

// Static illustration from assets

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Phone Verification states
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const otpRefs = useRef<HTMLInputElement[]>([]);
    const [timer, setTimer] = useState(240);
    const [otpSent, setOtpSent] = useState(false);

    // Step 2: Personal Details states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [about, setAbout] = useState('');

    // Step 3: Password states
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // OTP timer effect
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

    const handleNextStep = () => {
        setError('');
        if (step === 1) {
            if (!otpSent) {
                sendMockOtp();
                return;
            }
            const otpString = otp.join('');
            if (otpString.length < 5) {
                setError('Enter the 5-digit OTP sent to your phone');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!name || !email || !dob || !about) {
                setError('Please fill in all details');
                return;
            }
            if (!email.includes('@')) {
                setError('Enter a valid email address');
                return;
            }
            setStep(3);
        }
    };

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
            // Live registration on backend
            await register(email, name, password);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-between items-center p-6 relative font-sans">
            {/* Top Switch Link */}
            <div className="w-full flex justify-end max-w-md pt-2">
                <Link href="/auth/login" className="text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5 text-[#111827]">
                    Log In
                    <svg className="w-4 h-4 text-[#111827]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>

            {/* Main Form container */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center py-4">
                {/* Verified Illustration */}
                <img 
                    src="/login/Screenshot 2026-07-02 165049.svg" 
                    alt="Sign Up Illustration" 
                    className="w-full max-w-[260px] h-[190px] mx-auto object-contain mb-4 select-none"
                />

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black tracking-tight text-[#111827] font-display">Sign Up</h2>
                    <p className="text-xs text-[#666A7A] mt-1 font-semibold">
                        {step === 1 && 'Verify your phone number.'}
                        {step === 2 && 'Fill up your details.'}
                        {step === 3 && 'Confirm your password.'}
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold leading-relaxed">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        {/* Phone input */}
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

                        {/* Next Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-32 mx-auto flex items-center justify-center py-3 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[18px] hover:opacity-90 active:scale-98 transition-all shadow-sm"
                            >
                                {otpSent ? 'Next' : 'Send OTP'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        {/* Name input */}
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                                required
                            />
                        </div>

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

                        {/* DOB input */}
                        <div>
                            <input
                                type="text"
                                placeholder="Dob"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                                required
                            />
                        </div>

                        {/* About input */}
                        <div>
                            <input
                                type="text"
                                placeholder="About"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                                required
                            />
                        </div>

                        {/* Next Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-32 mx-auto flex items-center justify-center py-3 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[18px] hover:opacity-90 active:scale-98 transition-all shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password input */}
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                                required
                            />
                        </div>

                        {/* Confirm Password input */}
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border-2 border-[#111827]/10 focus:border-[#111827]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold placeholder-[#111827]/40 outline-none transition-colors bg-[#FDFDFD]"
                                required
                            />
                        </div>

                        {/* Create Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-32 mx-auto flex items-center justify-center py-3 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[18px] hover:opacity-90 active:scale-98 transition-all shadow-sm"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Create'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 1 && (
                    /* Google and Apple login options for Step 1 */
                    <div className="flex justify-center gap-4 mt-8">
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
                )}
            </div>

            {/* Bottom Progress Line */}
            <div className="w-full max-w-xs flex flex-col items-center gap-1.5 pb-2">
                <div className="w-full h-1 bg-[#111827]/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#0D6277] transition-all duration-300 rounded-full" 
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
                <span className="text-[10px] font-bold text-[#666A7A]">step {step}</span>
            </div>
        </div>
    );
}
