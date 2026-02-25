import React from 'react';
import MathPhysicsBackground from '@/components/MathPhysicsBackground';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen">
            <MathPhysicsBackground />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
