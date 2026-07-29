'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { 
    Navigation, Bus, Activity, CheckCircle2, 
    AlertCircle, Play, Square, RefreshCw, 
    Radio, Shield, Clock, MapPin, Smartphone
} from 'lucide-react';

interface RouteOption {
    _id: string;
    label: string;
    sublabel: string;
    type: 'bus' | 'shuttle';
}

export default function DriverTrackerPage() {
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [lastPosition, setLastPosition] = useState<{ lat: number; lng: number; speed: number | null; accuracy: number } | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [updateCount, setUpdateCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const watchIdRef = useRef<number | null>(null);

    // Fetch routes on mount
    useEffect(() => {
        const loadRoutes = async () => {
            setLoading(true);
            try {
                const [busRes, shuttleRes] = await Promise.all([
                    api.get('/api/bus/routes').catch(() => ({ data: [] })),
                    api.get('/api/shuttle/schedules').catch(() => ({ data: [] }))
                ]);

                const busOpts: RouteOption[] = busRes.data.map((b: any) => ({
                    _id: b._id,
                    label: `${b.routeNumber} — ${b.routeName}`,
                    sublabel: `Bus | Driver: ${b.driverName} (${b.vehicleNumber})`,
                    type: 'bus'
                }));

                const shuttleOpts: RouteOption[] = shuttleRes.data.map((s: any) => ({
                    _id: s._id,
                    label: `${s.shuttleNumber} — ${s.routeName}`,
                    sublabel: `Shuttle | ${s.schedule === 'working_days' ? 'Weekdays' : 'Weekends'}`,
                    type: 'shuttle'
                }));

                const combined = [...busOpts, ...shuttleOpts];
                setRoutes(combined);
                if (combined.length > 0) setSelectedRoute(combined[0]);
            } catch (err) {
                console.error('Failed to load routes', err);
                setErrorMsg('Failed to load bus/shuttle routes');
            } finally {
                setLoading(false);
            }
        };
        loadRoutes();
    }, []);

    // Cleanup geolocation listener on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    const sendLocationUpdate = async (lat: number, lng: number) => {
        if (!selectedRoute) return;
        try {
            const endpoint = selectedRoute.type === 'bus'
                ? `/api/bus/routes/${selectedRoute._id}/location`
                : `/api/shuttle/schedules/${selectedRoute._id}/location`;

            await api.put(endpoint, { lat, lng });
            setLastUpdated(new Date().toLocaleTimeString());
            setUpdateCount(prev => prev + 1);
            setErrorMsg(null);
        } catch (err: any) {
            console.error('Failed to send GPS location', err);
            setErrorMsg('Network error: Could not broadcast location');
        }
    };

    const startTracking = () => {
        if (!navigator.geolocation) {
            setErrorMsg('Geolocation is not supported by your browser/device.');
            return;
        }

        if (!selectedRoute) {
            setErrorMsg('Please select a bus or shuttle route first.');
            return;
        }

        setErrorMsg(null);
        setIsTracking(true);

        // Geolocation options for maximum precision
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, speed, accuracy } = position.coords;
                setLastPosition({
                    lat: latitude,
                    lng: longitude,
                    speed: speed ? Math.round(speed * 3.6) : 0, // m/s to km/h
                    accuracy: Math.round(accuracy)
                });
                sendLocationUpdate(latitude, longitude);
            },
            (err) => {
                console.error('GPS Watch error:', err);
                let message = 'GPS position unavailable';
                if (err.code === err.PERMISSION_DENIED) message = 'GPS permission denied. Please allow location access in your browser.';
                else if (err.code === err.TIMEOUT) message = 'GPS search timed out. Make sure location is turned ON.';
                setErrorMsg(message);
            },
            geoOptions
        );

        watchIdRef.current = id;
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0828] text-white flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#8FA0D8] animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-gray-300">Loading Driver Portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0828] text-white flex flex-col justify-between p-4 max-w-md mx-auto relative font-sans">
            {/* Top Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#8FA0D8]/20 flex items-center justify-center border border-[#8FA0D8]/30">
                            <Bus className="w-5 h-5 text-[#8FA0D8]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold font-display tracking-wide">Nexus Driver</h1>
                            <p className="text-[10px] text-gray-400 font-medium">Real-Time GPS Transmitter</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                        isTracking 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' 
                            : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                        <Radio className="w-3 h-3" />
                        {isTracking ? 'LIVE BROADCASTING' : 'OFFLINE'}
                    </div>
                </div>

                {/* Route Selector */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-md">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Assigned Vehicle / Route</label>
                    <select
                        disabled={isTracking}
                        value={selectedRoute?._id || ''}
                        onChange={(e) => {
                            const r = routes.find(item => item._id === e.target.value);
                            if (r) setSelectedRoute(r);
                        }}
                        className="w-full bg-[#161240] border border-white/15 rounded-xl px-3 py-3 text-xs font-bold text-white outline-none focus:border-[#8FA0D8] disabled:opacity-60 transition-colors"
                    >
                        {routes.map((r) => (
                            <option key={r._id} value={r._id}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                    {selectedRoute && (
                        <p className="text-[10px] text-gray-400 pl-1">{selectedRoute.sublabel}</p>
                    )}
                </div>

                {/* GPS Status Card */}
                <div className={`p-5 rounded-2xl border transition-all ${
                    isTracking 
                        ? 'bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/30' 
                        : 'bg-white/5 border-white/10'
                }`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Live Coordinates</span>
                        {lastUpdated && (
                            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Updated {lastUpdated}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Latitude</p>
                            <p className="text-xl font-extrabold font-mono text-white mt-0.5">
                                {lastPosition ? lastPosition.lat.toFixed(6) : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Longitude</p>
                            <p className="text-xl font-extrabold font-mono text-white mt-0.5">
                                {lastPosition ? lastPosition.lng.toFixed(6) : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/10 text-xs">
                        <div>
                            <span className="text-gray-400 text-[10px]">Pings Sent: </span>
                            <span className="font-bold text-[#8FA0D8]">{updateCount}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-[10px]">Accuracy: </span>
                            <span className="font-bold text-emerald-400">
                                {lastPosition ? `±${lastPosition.accuracy}m` : '—'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-xs text-red-300">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                    </div>
                )}
            </div>

            {/* Bottom Action Button */}
            <div className="py-4 space-y-3">
                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                        <Play className="w-5 h-5 fill-white" />
                        START LIVE TRACKING
                    </button>
                ) : (
                    <button
                        onClick={stopTracking}
                        className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                        <Square className="w-5 h-5 fill-white" />
                        STOP TRACKING
                    </button>
                )}

                <p className="text-[10px] text-center text-gray-500 font-medium">
                    Keep this tab open on the driver's phone while on route.
                </p>
            </div>
        </div>
    );
}
