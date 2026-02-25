'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a static fallback during SSR to avoid hydration mismatch
        return (
            <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[90px]" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505] pointer-events-none">
            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay pointer-events-none" />

            {/* Primary Emerald/Teal Blob (Top Left) */}
            <motion.div
                className="absolute top-[-15%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/30 blur-[100px] mix-blend-screen"
                animate={{
                    x: [0, 80, -40, 0],
                    y: [0, 60, -20, 0],
                    scale: [1, 1.15, 0.95, 1],
                    rotate: [0, 45, -15, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Secondary Indigo/Purple Blob (Bottom Right) */}
            <motion.div
                className="absolute bottom-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-indigo-500/30 blur-[100px] mix-blend-screen"
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, -120, 60, 0],
                    scale: [1, 1.25, 0.9, 1],
                    rotate: [0, -45, 15, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Accent Cyan/Blue Glow (Center Tracking) */}
            <motion.div
                className="absolute top-[30%] left-[40%] h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-[80px] mix-blend-screen"
                animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.3, 0.8],
                    x: [0, 50, -50, 0],
                    y: [0, -50, 50, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Subtle Amber/Orange Accent (Bottom Left) */}
            <motion.div
                className="absolute bottom-[10%] left-[10%] h-[350px] w-[350px] rounded-full bg-amber-500/20 blur-[80px] mix-blend-screen"
                animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.4, 1],
                    x: [0, 30, -30, 0]
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
            />

            {/* Small Floating Sparks/Orbs */}
            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={`spark-${i}`}
                    className="absolute h-3 w-3 rounded-full bg-white/60 blur-[1px]"
                    style={{
                        top: `${20 + i * 15}%`,
                        left: `${10 + i * 20}%`,
                    }}
                    animate={{
                        y: [0, -100 - (i * 20), 0],
                        x: [0, (i % 2 === 0 ? 50 : -50), 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 1.5,
                    }}
                />
            ))}
        </div>
    );
};

export default AnimatedBackground;
