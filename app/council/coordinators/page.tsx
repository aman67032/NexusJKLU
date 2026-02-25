'use client';

import { User, Award, Building2, Users, Calendar, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const subNav = [
    { href: '/council', label: 'Overview', icon: Building2 },
    { href: '/council/clubs', label: 'Clubs', icon: Users },
    { href: '/council/councils', label: 'Councils', icon: Award },
    { href: '/council/events', label: 'Events', icon: Calendar },
    { href: '/council/coordinators', label: 'Coordinators', icon: UserCircle },
];

const COORDINATORS = [
    { id: 1, name: "Pulkit Dosi", role: "Academic Coordinator", studentId: "2024BBA067", image: "/Photoes ID CARD Student Council/Pulkit Dosi (Academic Coordinator).jpg", description: "Oversees all academic initiatives, ensuring seamless coordination between students and faculty for educational events." },
    { id: 2, name: "Vrajesh Modi", role: "Discipline Coordinator", studentId: "2024BTECH220", image: "/Photoes ID CARD Student Council/Vrajesh Modi (Discipline Coordinator).jpg", description: "Maintains campus discipline, fostering a respectful and safe environment for the entire student community." },
    { id: 3, name: "Tanik Gupta", role: "Transport Coordinator", studentId: "2024BTECH234", image: "/Photoes ID CARD Student Council/TanikGupta.jpg", description: "Manages university transport logistics, ensuring timely shuttle services and addressing commuting requirements." },
    { id: 4, name: "Kartavya Garhwal", role: "Mess Coordinator", studentId: "2024BTECH079", image: "/Photoes ID CARD Student Council/Kartavya Garhwal (Mess Coordinator).jpg", description: "Ensures quality food services and addresses all mess-related concerns raised by the student body." },
    { id: 5, name: "Harshit Soni", role: "Sports Coordinator", studentId: "2024BTECH126", image: "/Photoes ID CARD Student Council/Harshit Soni.jpg", description: "Organizes inter and intra-university sports events, promoting physical fitness and sportsmanship on campus." },
    { id: 6, name: "Nitin Tiwary", role: "Hostel Coordinator", studentId: "2024BTECH070", image: "/Photoes ID CARD Student Council/Nitin Tiwary (Hostel Coordinator).jpg", description: "Addresses hostel-related issues, acting as the primary liaison between hostellers and the administration." },
    { id: 7, name: "Aditya Purohit", role: "Website Coordinator", studentId: "2024BTECH134", description: "Maintains and updates the council's digital presence, ensuring accurate information dissemination." },
    { id: 8, name: "Vaibhav Khandelwal", role: "Campus Ambassador", studentId: "2024BTECH110", image: "/Photoes ID CARD Student Council/Vaibhav Khandelwal.jpg", description: "Represents the student council externally, building relationships with other institutions and organizations." },
    { id: 9, name: "Kaushal Malvi", role: "Social Media Coordinator", studentId: "2024BTECH170", image: "/Photoes ID CARD Student Council/Kaushal Malvi.png", description: "Manages social media handles, creating engaging content to cover events and keep the student body informed." },
];

export default function CoordinatorsPage() {
    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[600px] h-[600px] -top-48 -right-48 bg-blue-500" style={{ opacity: 0.06 }} />
            <div className="glow-orb w-[600px] h-[600px] -bottom-48 -left-48 bg-[var(--primary)]" style={{ opacity: 0.04 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-bold tracking-widest uppercase text-[var(--primary)]">
                        Student Council 2025-26
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
                        Our <span className="gradient-text-orange">Coordinators</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-white/40 leading-relaxed mb-10">
                        The dedicated individuals who ensure smooth operations across every aspect of campus life.
                    </p>

                    {/* Sub Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl max-w-fit mx-auto">
                        {subNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === '/council/coordinators';
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-[var(--council-color)]/15 text-[var(--council-color)]'
                                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COORDINATORS.map((coordinator, index) => (
                        <motion.div
                            key={coordinator.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="group glass-card p-6 hover:border-[var(--primary)]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[var(--primary)]/5"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                    {coordinator.image ? (
                                        <img src={coordinator.image} alt={coordinator.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-white/30" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors">{coordinator.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]/70">{coordinator.role}</p>
                                    <p className="text-xs text-white/20 font-mono mt-1">{coordinator.studentId}</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/30 leading-relaxed">{coordinator.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
