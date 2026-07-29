'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, SignupData } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowUp, ArrowDown, User, Bus, MapPin, Building, Home, CheckCircle2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function RegisterPage() {
    const { signup, verifyOtp, resendOtp } = useAuth();
    const router = useRouter();
    
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Basic Info
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2: Student Type
    const [studentType, setStudentType] = useState<'dayscholar' | 'hosteler'>('dayscholar');
    
    // Day Scholar details
    const [busRoutes, setBusRoutes] = useState<any[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string>('');
    const [selectedStop, setSelectedStop] = useState<string>('');

    // Hosteler details
    const [hostelName, setHostelName] = useState('Boys Hostel 1');
    const [roomNumber, setRoomNumber] = useState('');
    const hostelOptions = ['Boys Hostel 1', 'Boys Hostel 2', 'Girls Hostel 1', 'Girls Hostel 2', 'Girls Hostel 3'];

    // Step 3: Priority Matrix
    const [priorities, setPriorities] = useState([
        { id: 'academic', label: 'Academic' },
        { id: 'events', label: 'Events' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'sports', label: 'Sports' }
    ]);

    // Step 5: OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef<HTMLInputElement[]>([]);
    const [timer, setTimer] = useState(240);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        // Fetch bus routes if they are dayscholar
        if (studentType === 'dayscholar' && busRoutes.length === 0) {
            api.get('/api/bus/routes').then(res => setBusRoutes(res.data)).catch(console.error);
        }
    }, [studentType]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpSent && timer > 0) {
            interval = setInterval(() => setTimer(p => p - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const movePriority = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newP = [...priorities];
            [newP[index - 1], newP[index]] = [newP[index], newP[index - 1]];
            setPriorities(newP);
        } else if (direction === 'down' && index < priorities.length - 1) {
            const newP = [...priorities];
            [newP[index + 1], newP[index]] = [newP[index], newP[index + 1]];
            setPriorities(newP);
        }
    };

    const handleNextStep = () => {
        setError('');
        if (step === 1) {
            if (!name || !rollNumber || !email || !password || !confirmPassword) return setError('Fill all fields');
            if (!email.endsWith('@jklu.edu.in')) return setError('Must use @jklu.edu.in email');
            if (password !== confirmPassword) return setError('Passwords do not match');
            if (password.length < 6) return setError('Password must be at least 6 characters');
            setStep(2);
        } else if (step === 2) {
            if (studentType === 'dayscholar') {
                if (!selectedRoute || !selectedStop) return setError('Select a route and pickup point');
            } else {
                if (!hostelName || !roomNumber) return setError('Provide hostel and room number');
            }
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        }
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const data: SignupData = {
                name, rollNumber, email, password, studentType,
                priorityMatrix: priorities.map(p => p.id)
            };
            if (studentType === 'dayscholar') {
                data.busRoute = selectedRoute;
                data.pickupPoint = selectedStop;
            } else {
                data.hostelName = hostelName;
                data.roomNumber = roomNumber;
            }
            await signup(data);
            setOtpSent(true);
            setStep(5);
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpStr = otp.join('');
        if (otpStr.length < 6) return setError('Enter 6 digit OTP');
        setLoading(true);
        try {
            await verifyOtp(email, otpStr);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendOtp(email);
            setTimer(240);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3 text-sm font-bold placeholder-[#0B0828]/40 outline-none bg-[#FDFDFD]" />
                        <input type="text" placeholder="Roll Number (e.g. 2021BTCS001)" value={rollNumber} onChange={e => setRollNumber(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3 text-sm font-bold placeholder-[#0B0828]/40 outline-none bg-[#FDFDFD]" />
                        <input type="email" placeholder="JKLU Email (@jklu.edu.in)" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3 text-sm font-bold placeholder-[#0B0828]/40 outline-none bg-[#FDFDFD]" />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3 text-sm font-bold placeholder-[#0B0828]/40 outline-none bg-[#FDFDFD]" />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3 text-sm font-bold placeholder-[#0B0828]/40 outline-none bg-[#FDFDFD]" />
                        <button onClick={handleNextStep} className="w-full py-3.5 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[20px] hover:opacity-90 transition-all mt-4">Next Step</button>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                        <div className="flex gap-4">
                            <button onClick={() => setStudentType('dayscholar')} className={`flex-1 p-4 rounded-[20px] border-2 transition-all flex flex-col items-center gap-2 ${studentType === 'dayscholar' ? 'border-[#8FA0D8] bg-[#8FA0D8]/10' : 'border-[#0B0828]/5 hover:border-[#0B0828]/10'}`}>
                                <Bus className={`w-8 h-8 ${studentType === 'dayscholar' ? 'text-[#8FA0D8]' : 'text-[#5B6077]'}`} />
                                <span className="font-bold text-sm text-[#0B0828]">Day Scholar</span>
                            </button>
                            <button onClick={() => setStudentType('hosteler')} className={`flex-1 p-4 rounded-[20px] border-2 transition-all flex flex-col items-center gap-2 ${studentType === 'hosteler' ? 'border-[#FF8400] bg-[#FF8400]/10' : 'border-[#0B0828]/5 hover:border-[#0B0828]/10'}`}>
                                <Home className={`w-8 h-8 ${studentType === 'hosteler' ? 'text-[#FF8400]' : 'text-[#5B6077]'}`} />
                                <span className="font-bold text-sm text-[#0B0828]">Hosteler</span>
                            </button>
                        </div>
                        
                        {studentType === 'dayscholar' ? (
                            <div className="space-y-4">
                                <select value={selectedRoute} onChange={e => { setSelectedRoute(e.target.value); setSelectedStop(''); }} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold text-[#0B0828] outline-none bg-[#FDFDFD] appearance-none">
                                    <option value="">Select Bus Route</option>
                                    {busRoutes.map(r => <option key={r._id} value={r._id}>{r.routeNumber} - {r.routeName}</option>)}
                                </select>
                                {selectedRoute && (
                                    <select value={selectedStop} onChange={e => setSelectedStop(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold text-[#0B0828] outline-none bg-[#FDFDFD] appearance-none">
                                        <option value="">Select Pickup Point</option>
                                        {busRoutes.find(r => r._id === selectedRoute)?.stops.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <select value={hostelName} onChange={e => setHostelName(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3.5 text-sm font-bold text-[#0B0828] outline-none bg-[#FDFDFD] appearance-none">
                                    {hostelOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <input type="text" placeholder="Room Number (e.g. 101)" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="w-full border border-[#0B0828]/10 focus:border-[#0B0828]/30 rounded-[22px] px-5 py-3 text-sm font-bold placeholder-[#0B0828]/40 outline-none bg-[#FDFDFD]" />
                            </div>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-3.5 bg-black/5 text-[#0B0828] text-xs font-black uppercase tracking-wider rounded-[20px] hover:bg-black/10 transition-all">Back</button>
                            <button onClick={handleNextStep} className="flex-[2] py-3.5 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[20px] hover:opacity-90 transition-all">Next</button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                        <p className="text-xs text-[#5B6077] font-semibold text-center mb-4">Rank your campus interests to personalize your feed.</p>
                        {priorities.map((p, idx) => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-[#0B0828]/10 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-[#8FA0D8]/10 text-[#8FA0D8] flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                    <span className="font-bold text-[#0B0828] text-sm">{p.label}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => movePriority(idx, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-black/5 disabled:opacity-30"><ArrowUp className="w-4 h-4 text-[#0B0828]" /></button>
                                    <button onClick={() => movePriority(idx, 'down')} disabled={idx === priorities.length - 1} className="p-1 rounded hover:bg-black/5 disabled:opacity-30"><ArrowDown className="w-4 h-4 text-[#0B0828]" /></button>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setStep(2)} className="flex-1 py-3.5 bg-black/5 text-[#0B0828] text-xs font-black uppercase tracking-wider rounded-[20px] hover:bg-black/10 transition-all">Back</button>
                            <button onClick={handleNextStep} className="flex-[2] py-3.5 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[20px] hover:opacity-90 transition-all">Review</button>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <div className="p-5 bg-white border border-[#0B0828]/10 rounded-[20px] space-y-4 shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                            <div className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <User className="w-5 h-5 text-[#8FA0D8]" />
                                <div>
                                    <p className="text-[10px] text-[#5B6077] font-bold uppercase">Basic Info</p>
                                    <p className="text-sm font-bold text-[#0B0828]">{name} • {rollNumber}</p>
                                    <p className="text-xs text-[#5B6077] font-semibold">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-b border-black/5 pb-3">
                                {studentType === 'dayscholar' ? <Bus className="w-5 h-5 text-[#8FA0D8]" /> : <Home className="w-5 h-5 text-[#FF8400]" />}
                                <div>
                                    <p className="text-[10px] text-[#5B6077] font-bold uppercase">{studentType === 'dayscholar' ? 'Day Scholar' : 'Hosteler'}</p>
                                    {studentType === 'dayscholar' ? (
                                        <p className="text-sm font-bold text-[#0B0828]">{busRoutes.find(r => r._id === selectedRoute)?.routeNumber} • {selectedStop}</p>
                                    ) : (
                                        <p className="text-sm font-bold text-[#0B0828]">{hostelName} • Room {roomNumber}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pb-1">
                                <Trophy className="w-5 h-5 text-[#67C587]" />
                                <div>
                                    <p className="text-[10px] text-[#5B6077] font-bold uppercase">Top Priorities</p>
                                    <p className="text-sm font-bold text-[#0B0828]">{priorities[0].label} & {priorities[1].label}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setStep(3)} className="flex-1 py-3.5 bg-black/5 text-[#0B0828] text-xs font-black uppercase tracking-wider rounded-[20px] hover:bg-black/10 transition-all">Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="flex-[2] py-3.5 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[20px] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Submit & Verify</>}
                            </button>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-[#5B6077] font-semibold mb-4">Enter the 6-digit OTP sent to {email}</p>
                            <div className="flex justify-between gap-2 px-1">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => { otpRefs.current[idx] = el as HTMLInputElement; }}
                                        type="text" maxLength={1} value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                        className="w-12 h-14 border-2 border-[#0B0828]/10 focus:border-[#8FA0D8] rounded-[16px] text-center font-black text-xl outline-none transition-colors bg-[#FDFDFD] text-[#0B0828]"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-2 text-xs font-bold">
                            <span className="text-[#5B6077]">{timer > 0 ? `Resend in ${timer}s` : ''}</span>
                            <button onClick={handleResendOtp} disabled={timer > 0} className={`${timer > 0 ? 'text-[#5B6077]/40 cursor-not-allowed' : 'text-[#8FA0D8] hover:underline'}`}>Resend OTP</button>
                        </div>
                        <button onClick={handleVerifyOtp} disabled={loading} className="w-full py-3.5 bg-[#2A3B3C] text-white text-xs font-black uppercase tracking-wider rounded-[20px] hover:opacity-90 transition-all flex items-center justify-center">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Account'}
                        </button>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#0B0828] flex flex-col justify-between items-center p-6 relative font-sans">
            <div className="w-full flex justify-end max-w-md pt-2">
                <Link href="/auth/login" className="text-sm font-bold hover:text-[#8FA0D8] transition-colors flex items-center gap-1.5 text-[#0B0828]">
                    Log In <ArrowUp className="w-4 h-4 rotate-45" />
                </Link>
            </div>

            <div className="w-full max-w-sm flex-1 flex flex-col justify-center py-4">
                <img src="/login/Screenshot 2026-07-02 165049.svg" alt="Sign Up Illustration" className="w-full max-w-[220px] h-[160px] mx-auto object-contain mb-6 select-none" />

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black tracking-tight text-[#0B0828] font-display">Create Account</h2>
                    <div className="flex justify-center gap-1.5 mt-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? 'w-8 bg-[#8FA0D8]' : 'w-4 bg-[#0B0828]/10'}`} />
                        ))}
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-[#E76F51]/10 border border-[#E76F51]/20 text-[#E76F51] text-xs font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {renderStepContent()}
                </AnimatePresence>
            </div>
        </div>
    );
}
