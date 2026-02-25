'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ReliableBackground: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="fixed inset-0 bg-[#050505] -z-10" />;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505] pointer-events-none">
            
            {/* BLOB 1: Top Left - Bright Orange (Matches Nexus logo) */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0) 70%)',
                    filter: 'blur(40px)', // Softer blur, relies more on the gradient
                }}
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, 50, -100, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* BLOB 2: Bottom Right - Deep Purple/Pink */}
            <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0) 70%)',
                    filter: 'blur(50px)',
                }}
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, -120, 60, 0],
                    scale: [1, 1.3, 0.85, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* BLOB 3: Center Accent - Cyan */}
            <motion.div
                className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 70%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [0.8, 1.1, 0.8],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        </div>
    );
};

export default ReliableBackground;