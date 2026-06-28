'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { 
    Bus, Search, Clock, MapPin, Phone, User, Shield, Star, 
    Compass, AlertTriangle, ArrowRight, Navigation, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BusRoute {
    _id: string;
    routeNumber: string;
    routeName: string;
    stops: string[];
    timings: string[];
    driverName: string;
    driverPhone: string;
    busNumber: string;
    status: 'scheduled' | 'active' | 'delayed' | 'cancelled';
    liveLocation: {
        lat: number;
        lng: number;
        lastUpdated: string;
    };
    eta: string;
}

export default function BusPortal() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams?.get('search') || '';

    const [routes, setRoutes] = useState<BusRoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRoutes = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await api.get('/api/bus/routes');
            setRoutes(res.data || []);
            // Select active or first route by default if none selected
            if (res.data && res.data.length > 0 && !selectedRoute) {
                const active = res.data.find((r: any) => r.status === 'active');
                setSelectedRoute(active || res.data[0]);
            } else if (res.data && selectedRoute) {
                // Keep same route updated
                const updated = res.data.find((r: any) => r._id === selectedRoute._id);
                if (updated) setSelectedRoute(updated);
            }
        } catch (error) {
            console.warn('Fetch bus routes offline fallback');
            // Fallback mock data if server isn't running or empty
            const mockRoutes: BusRoute[] = [
                {
                    _id: "mock-1",
                    routeNumber: "B101",
                    routeName: "JKLU ➔ Mansarovar Metro",
                    stops: ["JKLU Campus", "Mahapura Patia", "Bhankrota", "Heerapura", "Mansarovar Metro"],
                    timings: ["08:30 AM", "12:15 PM", "05:30 PM", "07:00 PM"],
                    driverName: "Ramesh Singh",
                    driverPhone: "+91 9876543210",
                    busNumber: "RJ-14-PB-1234",
                    status: "active",
                    liveLocation: { lat: 26.8390, lng: 75.6880, lastUpdated: new Date().toISOString() },
                    eta: "8 mins"
                },
                {
                    _id: "mock-2",
                    routeNumber: "B102",
                    routeName: "Mansarovar Metro ➔ JKLU",
                    stops: ["Mansarovar Metro", "Heerapura", "Bhankrota", "Mahapura Patia", "JKLU Campus"],
                    timings: ["07:30 AM", "09:30 AM", "01:30 PM", "06:30 PM"],
                    driverName: "Suresh Sharma",
                    driverPhone: "+91 9988776655",
                    busNumber: "RJ-14-PB-5678",
                    status: "scheduled",
                    liveLocation: { lat: 26.8225, lng: 75.6454, lastUpdated: new Date().toISOString() },
                    eta: "--"
                },
                {
                    _id: "mock-3",
                    routeNumber: "B201",
                    routeName: "JKLU ➔ Sindhi Camp (Weekend)",
                    stops: ["JKLU Campus", "Bhankrota", "200 Feet Bypass", "Ajmer Pulia", "Sindhi Camp"],
                    timings: ["09:00 AM", "02:00 PM", "06:00 PM"],
                    driverName: "Satnam Singh",
                    driverPhone: "+91 8877665544",
                    busNumber: "RJ-14-PB-9999",
                    status: "delayed",
                    liveLocation: { lat: 26.8225, lng: 75.6454, lastUpdated: new Date().toISOString() },
                    eta: "25 mins"
                }
            ];
            setRoutes(mockRoutes);
            if (!selectedRoute) setSelectedRoute(mockRoutes[0]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
        // Load favorites
        const savedFavs = localStorage.getItem('nexus_bus_favorites');
        if (savedFavs) {
            setFavorites(JSON.parse(savedFavs));
        }
        
        // Auto refresh coordinates simulation
        const interval = setInterval(() => {
            fetchRoutes();
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        let newFavs = [...favorites];
        if (newFavs.includes(id)) {
            newFavs = newFavs.filter(favId => favId !== id);
        } else {
            newFavs.push(id);
        }
        setFavorites(newFavs);
        localStorage.setItem('nexus_bus_favorites', JSON.stringify(newFavs));
    };

    const getStatusDetails = (s: string) => {
        switch (s) {
            case 'active':
                return { label: 'Live Now', bg: 'bg-[#67C587]/10 text-[#67C587] border-[#67C587]/20', dotBg: 'bg-[#67C587]' };
            case 'delayed':
                return { label: 'Delayed', bg: 'bg-[#E8B24C]/10 text-[#E8B24C] border-[#E8B24C]/20', dotBg: 'bg-[#E8B24C]' };
            case 'cancelled':
                return { label: 'Cancelled', bg: 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20', dotBg: 'bg-[#E76F51]' };
            default:
                return { label: 'Scheduled', bg: 'bg-black/5 text-[#5B6077] border-black/5', dotBg: 'bg-black/30' };
        }
    };

    const filteredRoutes = routes.filter(route => {
        const matchesSearch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.stops.some(stop => stop.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (statusFilter === 'favorites') {
            return matchesSearch && favorites.includes(route._id);
        }
        if (statusFilter === 'active') {
            return matchesSearch && route.status === 'active';
        }
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#8FA0D8] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-10 bg-background relative overflow-x-hidden p-4 space-y-5 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mt-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display">Bus Transport</h1>
                    <p className="text-xs text-[#5B6077] font-semibold mt-0.5">Real-time campus shuttle schedules & tracking</p>
                </div>
                <button 
                    onClick={() => fetchRoutes(true)} 
                    className="p-2.5 rounded-xl bg-white border border-[#0B0828]/5 text-[#0B0828] hover:bg-black/[0.01] shadow-[0_2px_4px_rgba(11,8,40,0.01)] transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="relative flex items-center bg-white border border-[#0B0828]/10 hover:border-[#0B0828]/20 focus-within:border-[#0B0828]/35 rounded-[14px] px-4 py-2.5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all">
                    <Search className="w-4 h-4 text-[#0B0828]/35 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by route, stop name..."
                        className="w-full bg-transparent border-none text-sm text-[#0B0828] placeholder-[#5B6077]/40 focus:ring-0 focus:outline-none px-3 font-semibold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-black/[0.02] border border-black/[0.04] rounded-2xl">
                {[
                    { id: 'all', label: 'All Shuttles' },
                    { id: 'active', label: 'Active' },
                    { id: 'favorites', label: 'Starred' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${statusFilter === tab.id 
                            ? 'bg-[#8FA0D8]/15 text-[#0B0828] shadow-sm border border-[#8FA0D8]/20 font-display' 
                            : 'text-[#5B6077] hover:text-[#0B0828] hover:bg-black/5'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Split View: Route Selection and Selected Details */}
            <div className="space-y-4">
                
                {/* Horizontal Route Selector list */}
                <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/40 font-display">Select Route</h3>
                    <div className="overflow-x-auto flex gap-3 pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar snap-x">
                        {filteredRoutes.map((route) => {
                            const isSelected = selectedRoute?._id === route._id;
                            const isFav = favorites.includes(route._id);
                            const status = getStatusDetails(route.status);
                            
                            return (
                                <div
                                    key={route._id}
                                    onClick={() => setSelectedRoute(route)}
                                    className={`snap-center shrink-0 w-[240px] p-4 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all cursor-pointer relative flex flex-col justify-between ${isSelected 
                                        ? 'bg-white border-2 border-[#8FA0D8]' 
                                        : 'bg-white border border-[#0B0828]/5 hover:border-[#0B0828]/10'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Bus className={`w-4 h-4 ${isSelected ? 'text-[#8FA0D8]' : 'text-[#5B6077]'}`} />
                                            <span className={`text-xs font-bold ${isSelected ? 'text-[#0B0828]' : 'text-[#5B6077]'}`}>{route.routeNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => toggleFavorite(route._id, e)} 
                                                className={`p-1 rounded-lg hover:bg-black/5 transition-colors ${isFav ? 'text-[#FF8400]' : 'text-black/20'}`}
                                            >
                                                <Star className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
                                            </button>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border flex items-center gap-1 ${status.bg}`}>
                                                <span className={`w-1 h-1 rounded-full ${status.dotBg}`} />
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-[#0B0828] text-sm leading-tight mt-3 mb-4 truncate font-display">{route.routeName}</h4>
                                    
                                    <div className="flex items-center justify-between pt-2.5 border-t border-black/5 text-[10px] text-[#8E92A6] font-semibold">
                                        <span>Next timing:</span>
                                        <span className="text-[#0B0828] font-bold">{route.timings[0]}</span>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredRoutes.length === 0 && (
                            <div className="w-full text-center py-6 text-[#5B6077] text-xs font-bold bg-white border border-black/5 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                                No shuttles match search filters
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Route Live Details */}
                {selectedRoute && (
                    <motion.div 
                        key={selectedRoute._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        
                        {/* Live Tracking & ETA Card */}
                        <div className="bg-white border border-[#8FA0D8]/20 p-4 rounded-[20px] shadow-[0_2px_8px_rgba(11,8,40,0.01)] relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-[#0B0828] font-display">Live Bus Status</h3>
                                    <p className="text-[10px] text-[#5B6077] font-semibold">Vehicle No: <span className="font-bold text-[#0B0828]">{selectedRoute.busNumber || 'N/A'}</span></p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-[#8E92A6] uppercase tracking-widest leading-none font-bold">Est. Arrival</span>
                                    <span className="text-xl font-bold text-[#FF8400] mt-1 leading-none font-display">
                                        {selectedRoute.status === 'active' ? selectedRoute.eta : '--'}
                                    </span>
                                </div>
                            </div>

                            {/* Simulated Live Location Map */}
                            <div className="w-full h-32 rounded-[14px] bg-background border border-black/5 overflow-hidden relative flex items-center justify-center">
                                {/* Simulated Grid Lines */}
                                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                                
                                {/* Simulated Route Path Line */}
                                <svg className="absolute w-full h-full stroke-dashed" viewBox="0 0 300 100">
                                    <path 
                                        d="M 20 50 Q 80 20 150 50 T 280 50" 
                                        fill="none" 
                                        stroke="#8FA0D8" 
                                        strokeWidth="2" 
                                        strokeOpacity="0.4"
                                    />
                                    {selectedRoute.status === 'active' && (
                                        <motion.circle 
                                            cx="180" 
                                            cy="42" 
                                            r="6" 
                                            fill="#FF8400" 
                                            className="animate-pulse shadow-2xl"
                                        />
                                    )}
                                </svg>
                                
                                {/* Stops Markers */}
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#5B6077] border border-white shadow-sm" />
                                    <span className="text-[8px] text-black/35 font-bold mt-1">Start</span>
                                </div>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#8FA0D8] border border-white shadow-sm" />
                                    <span className="text-[8px] text-black/35 font-bold mt-1">Metro</span>
                                </div>

                                {selectedRoute.status === 'active' ? (
                                    <div className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                                        <div className="px-2 py-0.5 rounded-md bg-[#FF8400] text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm font-display">
                                            <Navigation className="w-2 h-2 fill-current rotate-45" /> Live
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-[0.5px]">
                                        <span className="text-[10px] text-[#5B6077] font-semibold flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-[#8FA0D8]" /> GPS Online - Awaiting Trip Launch
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Driver & Bus Information */}
                        <div className="glass-card p-4 border border-black/5 flex items-center justify-between shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-secondary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#8E92A6] font-bold uppercase tracking-wider leading-none">Driver Details</p>
                                    <h4 className="font-bold text-[#0B0828] text-sm mt-1 leading-none font-display">{selectedRoute.driverName || 'Not Assigned'}</h4>
                                    <p className="text-[10px] text-[#FF8400] font-bold mt-1 leading-none font-display">Rating: ⭐ 4.9</p>
                                </div>
                            </div>
                            
                            {selectedRoute.driverPhone && (
                                <a 
                                    href={`tel:${selectedRoute.driverPhone}`}
                                    className="p-2.5 rounded-[14px] bg-[#8FA0D8]/10 text-[#0B0828] hover:bg-[#8FA0D8]/20 transition-all border border-[#8FA0D8]/20 active:scale-90 flex items-center gap-1.5 text-xs font-bold font-display cursor-pointer"
                                >
                                    <Phone className="w-3.5 h-3.5 text-[#8FA0D8]" /> Call Driver
                                </a>
                            )}
                        </div>

                        {/* Route Timeline (Stops & Timings) */}
                        <div className="glass-card p-4 border border-black/5 space-y-4 shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B0828]/45 font-display">Route Details & Stops</h4>
                            
                            <div className="relative pl-6 space-y-4">
                                {/* Vertical Line */}
                                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-black/5" />

                                {selectedRoute.stops.map((stop, idx) => {
                                    const isLast = idx === selectedRoute.stops.length - 1;
                                    const isFirst = idx === 0;
                                    return (
                                        <div key={idx} className="relative flex items-start gap-3">
                                            {/* Stop indicator node */}
                                            <div className={`absolute -left-[20px] w-3 h-3 rounded-full border border-white shadow-sm z-10 top-1 ${isFirst ? 'bg-[#FF8400] scale-110' : isLast ? 'bg-[#0B0828]' : 'bg-[#8FA0D8]'}`} />
                                            
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-[#0B0828] leading-snug font-display">{stop}</p>
                                                <p className="text-[9px] text-[#8E92A6] font-semibold">Station #{idx + 1}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Departure Schedule */}
                            <div className="pt-3 border-t border-black/5">
                                <h5 className="text-[10px] font-bold text-[#8E92A6] uppercase tracking-wider mb-2 font-display">Shuttle Departures</h5>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedRoute.timings.map((time, idx) => (
                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-black/5 border border-black/5 text-[10px] font-bold text-[#5B6077] flex items-center gap-1 font-display">
                                            <Clock className="w-3 h-3 text-[#8FA0D8]" />
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}

            </div>
        </div>
    );
}
