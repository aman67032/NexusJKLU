'use client';

// Hyperspeed background effect stub for the Technology Club page
// The original used Three.js-based animations; this provides a CSS-only alternative
export default function Hyperspeed({ effectOptions }: { effectOptions?: any }) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Animated light streaks */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
            {/* Moving lines to simulate speed */}
            <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-pulse"
                        style={{
                            top: `${5 + i * 5}%`,
                            left: `${Math.random() * 30}%`,
                            right: `${Math.random() * 30}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={`blue-${i}`}
                        className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"
                        style={{
                            top: `${10 + i * 6}%`,
                            left: `${Math.random() * 40}%`,
                            right: `${Math.random() * 40}%`,
                            animationDelay: `${i * 0.3 + 0.5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
