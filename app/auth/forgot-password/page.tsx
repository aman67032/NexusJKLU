'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Shield, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const { login } = useAuth(); // If we want to auto-login after reset

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Optional: You can either verify OTP here to auto-login the user, or just move to the reset step
            // Our backend supports immediate verify which returns a token, but let's just proceed to Reset Password
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
            // If valid, backend returns token (legacy behavior). We will proceed to reset step.
            setStep('reset');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                email,
                otp,
                newPassword
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 'otp') {
            setStep('email');
            setOtp('');
        } else if (step === 'reset') {
            setStep('otp');
            setNewPassword('');
            setConfirmPassword('');
        }
        setError('');
    };

    return (
        <div className="min-h-screen bg-nexus-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements (matching login) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-transparent" />
                <div className="absolute top-0 right-0 -mr-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
                <div className="absolute bottom-0 left-0 -ml-40 w-96 h-96 rounded-full bg-nexus-coffee/10 blur-[120px]" />
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                >
                    <Link href="/">
                        <div className="relative w-16 h-16 flex items-center justify-center transition-transform hover:scale-105">
                            <Image
                                src="/white_jklu_logo.png"
                                alt="JKLU Logo"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 text-center"
                >
                    <h2 className="text-3xl font-extrabold text-nexus-linen tracking-tight">
                        {step === 'email' && 'Forgot Password'}
                        {step === 'otp' && 'Verify OTP'}
                        {step === 'reset' && 'Reset Password'}
                    </h2>
                    <p className="mt-2 text-sm text-nexus-khaki">
                        {step === 'email' && 'Enter your email to receive a password reset code'}
                        {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                        {step === 'reset' && 'Create your new password'}
                    </p>
                </motion.div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900/50 backdrop-blur-xl py-8 px-4 border border-zinc-800 rounded-2xl shadow-2xl sm:px-10"
                >
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center"
                            >
                                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                                <h3 className="text-emerald-400 font-semibold mb-2 text-lg">
                                    Password Reset Successful!
                                </h3>
                                <p className="text-emerald-500/80 text-sm">
                                    Redirecting to login page...
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step === 'email' && (
                                    <form onSubmit={handleSendOTP} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-nexus-khaki">
                                                Email Address
                                            </label>
                                            <div className="mt-2 relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-nexus-camel" />
                                                </div>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-zinc-700 bg-zinc-800/50 rounded-xl text-nexus-linen placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                                                    placeholder="student@jklu.edu.in"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <p className="text-sm text-red-500 text-center">{error}</p>
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
                                        </button>
                                    </form>
                                )}

                                {step === 'otp' && (
                                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label htmlFor="otp" className="block text-sm font-medium text-nexus-khaki">
                                                    Enter OTP
                                                </label>
                                                <span className="text-xs text-nexus-camel">Sent to {email}</span>
                                            </div>
                                            <div className="mt-2 relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Shield className="h-5 w-5 text-nexus-camel" />
                                                </div>
                                                <input
                                                    id="otp"
                                                    name="otp"
                                                    type="text"
                                                    required
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-700 bg-zinc-800/50 rounded-xl text-nexus-linen placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-center text-2xl tracking-[0.2em] font-mono sm:text-sm"
                                                    placeholder="000000"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <p className="text-sm text-red-500 text-center">{error}</p>
                                            </motion.div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex-1 py-2.5 px-4 border border-zinc-700 rounded-xl text-sm font-medium text-nexus-khaki hover:bg-zinc-800 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={otp.length !== 6 || loading}
                                                className="flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {step === 'reset' && (
                                    <form onSubmit={handleResetPassword} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-nexus-khaki">
                                                New Password
                                            </label>
                                            <div className="mt-2 relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-nexus-camel" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-zinc-700 bg-zinc-800/50 rounded-xl text-nexus-linen placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                                                    placeholder="Must be at least 6 characters"
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-nexus-khaki">
                                                Confirm New Password
                                            </label>
                                            <div className="mt-2 relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-nexus-camel" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-zinc-700 bg-zinc-800/50 rounded-xl text-nexus-linen placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                                                    placeholder="Confirm your password"
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <p className="text-sm text-red-500 text-center">{error}</p>
                                            </motion.div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex-1 py-2.5 px-4 border border-zinc-700 rounded-xl text-sm font-medium text-nexus-khaki hover:bg-zinc-800 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                                                className="flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!success && (
                        <div className="mt-6 text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to login
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

