'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
    Bus, Search, Clock, MapPin, Phone, User, Star, 
    Compass, AlertTriangle, Navigation, RefreshCw,
    Calendar, CheckCircle2, XCircle, Info, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransportPortal() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    
    // Main Tabs
    const [mainTab, setMainTab] = useState<'bus' | 'shuttle'>('bus');
    
    // Bus Sub-tabs
    const [busTab, setBusTab] = useState<'my_route' | 'all_routes' | 'attendance'>('my_route');
    
    // Shuttle Sub-tabs
    const [shuttleTab, setShuttleTab] = useState<'schedules' | 'my_bookings'>('schedules');

    // Data states
    const [busRoutes, setBusRoutes] = useState<any[]>([]);
    const [myRoute, setMyRoute] = useState<any>(null);
    const [attendance, setAttendance] = useState<any[]>([]);
    
    const [shuttles, setShuttles] = useState<any[]>([]);
    const [myBookings, setMyBookings] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

const DEFAULT_BUS_ROUTES = [
    { _id: 'r1', routeNumber: 'Route 1', routeName: 'VT Road - Patrakar Colony - Narayan Vihar', vehicleNumber: 'RJ14PE0972', driverName: 'AJIT SINGH', driverPhone: '7976061630', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'V.T. Road New Sanganer Road' }, { name: 'Bharat Mata Circle' }, { name: 'New Patrakar Colony' }, { name: 'Kharbas Circle' }, { name: 'Hotel Hayyat' }, { name: 'Kesar Circle' }, { name: 'Anukampa Platina Circle' }, { name: 'Choudhary Paradise' }, { name: 'Garden 41' }, { name: 'Koteja Building' }, { name: 'Nakoda Glass' }, { name: 'Narayan Vihar' }, { name: 'Taru Chaaya Residency' }] },
    { _id: 'r2', routeNumber: 'Route 2', routeName: 'Mansarovar', vehicleNumber: 'RJ14PA0984', driverName: 'SANDEEP KUMAR', driverPhone: '7364073076', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Maharani Farm - D Mart' }, { name: 'Dwarkadas Park' }, { name: 'Vijay Path' }, { name: 'Patel Marg' }, { name: 'Paramhansh Marg' }, { name: 'Modern School' }, { name: 'Neerja Modi School' }, { name: 'Swarn Path Madhyam Marg' }, { name: 'Swarnpath New Sanganer Road' }, { name: 'Kisan Dharam Kanta' }, { name: 'Nivik Hospital' }, { name: 'Kamla Nehru Phuliya' }] },
    { _id: 'r3', routeNumber: 'Route 3', routeName: 'Sanganer - Jagatpura - Malviya Nagar', vehicleNumber: 'RJ39PA2009', driverName: 'ROOP NARAYAN', driverPhone: '8740837820', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Airport Circle Sanganer' }, { name: 'Pinjrapole Gaushala' }, { name: 'Pratap Dwar' }, { name: 'Khumbha Marg' }, { name: 'India Gate' }, { name: 'Sitapura' }, { name: 'Dwarkapuri' }, { name: 'Jagatpura Police Station' }, { name: 'Akshay Patra' }, { name: '7 no. Chouraha' }, { name: 'SKIT College Circle' }, { name: 'Jagatpura Flyover' }, { name: 'Model Town' }, { name: 'Balaji Mod' }, { name: 'Apex Circle' }, { name: 'Calgiri Road' }, { name: 'Malviya Nagar Police Station' }, { name: 'Hari Marg' }, { name: 'Nandpuri Underpass' }, { name: 'EHCC' }, { name: 'Jawahar Circle' }, { name: 'Clarks Amer' }, { name: 'WTP' }, { name: 'Jaipuria Hospital' }, { name: 'Milap Nagar' }, { name: 'Lalsingh Judo Colony' }, { name: 'GopalPura Police Chowki' }, { name: 'Bhandari Hospital' }, { name: 'Ganga Jamuna Petrol Pump' }, { name: 'Mansarovar Metro Station' }] },
    { _id: 'r4', routeNumber: 'Route 4', routeName: 'Tonk Road - 22 Godown - Nirman Nagar', vehicleNumber: 'RJ14PD4238', driverName: 'RAJU VERMA', driverPhone: '9828053114', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Kamal and Company Tonk Road' }, { name: 'Pinkcity Honda' }, { name: 'Tonk Pulia' }, { name: 'Laxmi Mandir Tiraha' }, { name: 'JP Phatak' }, { name: 'Imliwala Phatak' }, { name: 'Sahakar Road' }, { name: '22 Godam Puliya' }, { name: 'Nandpuri MJRP' }, { name: 'Swez Farm' }, { name: 'Vivek Vihar Metro Station' }, { name: 'Devi Nagar Mod' }, { name: 'Katewa Nagar Mod' }, { name: 'Laziz Restaurant' }, { name: 'Shyam Nagar' }, { name: 'Dana Pani Restaurant' }, { name: 'Kings Road' }, { name: 'Chaabra Restaurant' }, { name: 'Rani Sati Nagar' }, { name: '200 ft Bypass' }] },
    { _id: 'r5', routeNumber: 'Route 5', routeName: 'Ajmeri Gate - Rajapark - C-Scheme', vehicleNumber: 'RJ14PD4239', driverName: 'JITENDRA', driverPhone: '8619839140', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Ajmeri Gate' }, { name: 'Saganeri Gate' }, { name: 'Ghat Gate' }, { name: 'Pink Square' }, { name: 'Ramada Hotel' }, { name: 'Parnami Mandir' }, { name: 'Moti Dungri Road' }, { name: 'Trimurti Circle' }, { name: 'Birla Mandir' }, { name: 'Rambagh Circle' }, { name: 'RBI' }, { name: 'Narayan Singh Circle' }, { name: 'Statue Circle' }, { name: 'Chomu House Circle' }, { name: 'Hathroi' }, { name: 'Mission Compound' }, { name: 'Ajmeri Pulia' }, { name: '200ft Bypass' }] },
    { _id: 'r6', routeNumber: 'Route 6', routeName: 'Benar Road - Murlipura - Railway Station', vehicleNumber: 'RJ14PD7838', driverName: 'VIJAY', driverPhone: '9649289990', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Benar Railway Station' }, { name: 'Sitawali Phatak' }, { name: 'Shyam Nagar (Benar)' }, { name: '5 no. Bypass' }, { name: 'Budania Chouraha - Murlipura' }, { name: 'Kedia Chouraha - Murlipura' }, { name: 'Path No. 07' }, { name: 'Khetan Hospital' }, { name: 'Dher Ka Balaji' }, { name: 'Bansal Furniture' }, { name: 'Amba Bari Circle' }, { name: 'Panipatch Tiraha' }, { name: 'Chinkara Canteen' }, { name: 'Railway Station' }, { name: 'Ganpathi Nagar' }, { name: 'Hasanpura Pulia' }, { name: '4 Number Dispensary' }, { name: 'Sodala' }, { name: '200 Feet Bypass' }] },
    { _id: 'r7', routeNumber: 'Route 7', routeName: 'Shastri Nagar - Vidhydhar Nagar - VKI', vehicleNumber: 'RJ14PE8005', driverName: 'SONU', driverPhone: '9667203995', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'RPA Shastri Nagar' }, { name: 'Kanwatia Circle' }, { name: 'Mandir Mod Circle' }, { name: 'National Handloom - Vidhyadhar Nagar' }, { name: 'VDN Police Station' }, { name: 'Parshuram Circle' }, { name: 'Alka Cinema' }, { name: 'VKI Road No. 01 to 14' }, { name: 'Loha Mandi' }, { name: '5 no. Express Highway' }] },
    { _id: 'r8', routeNumber: 'Route 8', routeName: 'Jhotwara - Khirni Phatak', vehicleNumber: 'RJ23PA0727', driverName: 'SHIVRAM CHOUDHARY', driverPhone: '9929463055', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Jhotwara Police Station' }, { name: 'Dadi ka Phatak' }, { name: 'Nagal Jaisa Bohra Mod' }, { name: 'Niwaru Mod' }, { name: 'Kanta Chourha - Jhotwara' }, { name: 'Joshi Marg - Jhotwara' }, { name: 'Manohar Palace Hotel' }, { name: 'Kalwar Police Station' }, { name: 'Rood Mahal Marriage Garden' }, { name: 'Khirni Phatak' }, { name: 'Panchyawala Mod (Lalra Petrol Pump)' }, { name: 'Bajari Mandi Mod' }, { name: 'Gandhi Path Mod' }, { name: 'Dhawas Mod' }, { name: 'Karni Palace' }, { name: 'Hotel Highway Kings' }] },
    { _id: 'r9', routeNumber: 'Route 9', routeName: 'Niwaru - Kalwar - Bad Ka Balaji', vehicleNumber: 'RJ14PE6849', driverName: 'MUKESH', driverPhone: '9602547598', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Niwaru Army Cantt.' }, { name: 'Vaidh ji Ka Chouraha (Niwaru)' }, { name: 'Shekawat Marg' }, { name: 'Rawan Gate (Kalwar Road)' }, { name: 'Kardhani' }, { name: 'Govindpura' }, { name: 'Hathoj' }, { name: 'Manchwa - Sushant City' }, { name: 'Siwar Mod' }, { name: 'Bad Ka Balaji (Near Toll Tax)' }] },
    { _id: 'r10', routeNumber: 'Route 10', routeName: 'Chitrakoot - Vaishali Nagar - Khatipura', vehicleNumber: 'RJ14PE6848', driverName: 'RAMESHWAR', driverPhone: '9828453412', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Chitrakoot Stadium' }, { name: 'Akshardham' }, { name: 'Amrapali Circle - Vaishali Nagar' }, { name: 'Jharkhand Mod' }, { name: 'Khatipura Tiraha' }, { name: 'Deep Hospital' }, { name: 'Jain Medical Store - Jhotwara' }, { name: 'Chand Bihari Nagar' }, { name: 'Jaswant Nagar' }, { name: 'Vaishali Circle' }, { name: 'Tagore Public School' }, { name: 'Nursary Circle' }, { name: 'Global Hospital - Gandhi Path' }, { name: 'Malls of Jaipur' }, { name: 'Chitrakoot Sector-03' }, { name: 'JPS High School' }, { name: 'Karni Vihar Thana' }] },
    { _id: 'r11', routeNumber: 'Route 11', routeName: 'Sirsi Road - Rangoli Garden', vehicleNumber: 'RJ14PD4240', driverName: 'HETRAM', driverPhone: '9414823112', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Panchyawala - Sirsi Road' }, { name: 'Kanakpura Railway Station' }, { name: 'Royal Green Residency - Sirsi Road' }, { name: 'Teolar School - Lalarpura' }, { name: 'Rangoli Garden' }, { name: 'Jaipur Bagh - Gandhi Path' }, { name: 'Dhawas' }, { name: 'Heerapura Power House' }, { name: 'Jagdamba Nagar' }, { name: 'Girdharipura' }, { name: 'Kamla Nehru Nagar' }, { name: 'Bhankrota' }] },
    { _id: 'r12', routeNumber: 'Route 12', routeName: 'Triveni - Mahesh Nagar', vehicleNumber: 'RJ14PE0973', driverName: 'SURESH', driverPhone: '9829123456', arrivalAtJKLU: '8:15 AM', departureFromJKLU: '5:00 PM', stops: [{ name: 'Mahesh Nagar Phatak' }, { name: 'Arjun Nagar Phatak' }, { name: 'Triveni Chouraha' }, { name: '10-B Scheme' }, { name: 'Riddhi Siddhi' }, { name: 'Mahesh Nagar Mod' }, { name: 'Gurjar Ki Thadi' }, { name: 'New Sanganer Road' }, { name: 'Sodala' }, { name: 'Shyam Nagar Sabji Mandi' }, { name: 'Sevayatan Hospital' }, { name: 'Purani Chungi' }, { name: 'Queens Road' }, { name: 'Vijay Dwar' }] }
];

    const fetchData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            // Bus Data
            const routesRes = await api.get('/api/bus/routes').catch(() => ({ data: [] }));
            const availableRoutes = (routesRes.data && routesRes.data.length > 0) ? routesRes.data : DEFAULT_BUS_ROUTES;
            setBusRoutes(availableRoutes);
            
            if (user?.studentType === 'dayscholar') {
                const myRouteRes = await api.get('/api/bus/my-route').catch(() => ({ data: null }));
                setMyRoute(myRouteRes.data);
                
                if (!myRouteRes.data) {
                    setBusTab('all_routes');
                }

                const attRes = await api.get('/api/bus/attendance/my').catch(() => ({ data: [] }));
                setAttendance(attRes.data);
            } else {
                setBusTab('all_routes'); // hosteler defaults to all routes
            }

            // Shuttle Data
            const shuttleRes = await api.get('/api/shuttle/schedules').catch(() => ({ data: [] }));
            setShuttles(shuttleRes.data);
            
            const bookingRes = await api.get('/api/shuttle/my-requests').catch(() => ({ data: [] }));
            setMyBookings(bookingRes.data);
            
        } catch (error) {
            console.error('Error fetching transport data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 15000); // 15s refresh
        return () => clearInterval(interval);
    }, [user]);

    const handleBookShuttle = async (shuttleId: string) => {
        try {
            await api.post('/api/shuttle/request', { shuttleId, date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) {
            console.error('Booking failed', error);
            alert('Failed to book shuttle');
        }
    };

    const handleCancelShuttle = async (requestId: string) => {
        try {
            await api.post(`/api/shuttle/request/${requestId}/cancel`);
            fetchData();
        } catch (error) {
            console.error('Cancel failed', error);
            alert('Failed to cancel shuttle booking');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#8FA0D8] animate-spin" />
            </div>
        );
    }

    const filteredBusRoutes = busRoutes.filter(r => 
        r.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.routeNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredShuttles = shuttles.filter(s => 
        s.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shuttleNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-full pb-20 bg-[#FDFDFD] relative overflow-x-hidden p-4 space-y-5 font-sans">
            <div className="flex items-center justify-between mt-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display">Transport</h1>
                    <p className="text-xs text-[#5B6077] font-semibold mt-0.5">Manage your daily transit</p>
                </div>
                <button onClick={() => fetchData(true)} className="p-2.5 rounded-xl bg-white border border-[#0B0828]/5 text-[#0B0828] hover:bg-black/[0.01] shadow-[0_2px_4px_rgba(11,8,40,0.01)] transition-all active:scale-90 flex items-center justify-center">
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Main Tabs */}
            <div className="flex bg-black/[0.02] p-1 rounded-2xl border border-black/[0.04]">
                <button onClick={() => setMainTab('bus')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mainTab === 'bus' ? 'bg-white text-[#0B0828] shadow-sm border border-black/5 font-display' : 'text-[#5B6077]'}`}>Bus Service</button>
                <button onClick={() => setMainTab('shuttle')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mainTab === 'shuttle' ? 'bg-white text-[#0B0828] shadow-sm border border-black/5 font-display' : 'text-[#5B6077]'}`}>Shuttle Service</button>
            </div>

            {/* Search Bar */}
            <div className="relative flex items-center bg-white border border-[#0B0828]/10 hover:border-[#0B0828]/20 rounded-[14px] px-4 py-2.5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] transition-all">
                <Search className="w-4 h-4 text-[#0B0828]/35 shrink-0" />
                <input type="text" placeholder={`Search ${mainTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none text-sm text-[#0B0828] placeholder-[#5B6077]/40 focus:ring-0 focus:outline-none px-3 font-semibold" />
            </div>

            <AnimatePresence mode="wait">
                {mainTab === 'bus' ? (
                    <motion.div key="bus" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                        {/* Bus Sub Tabs */}
                        <div className="flex gap-2 border-b border-black/5 pb-2 overflow-x-auto scrollbar-hide">
                            {user?.studentType === 'dayscholar' && <button onClick={() => setBusTab('my_route')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${busTab === 'my_route' ? 'bg-[#0B0828] text-white' : 'bg-black/5 text-[#5B6077]'}`}>My Route</button>}
                            <button onClick={() => setBusTab('all_routes')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${busTab === 'all_routes' ? 'bg-[#0B0828] text-white' : 'bg-black/5 text-[#5B6077]'}`}>All Routes</button>
                            {user?.studentType === 'dayscholar' && <button onClick={() => setBusTab('attendance')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${busTab === 'attendance' ? 'bg-[#0B0828] text-white' : 'bg-black/5 text-[#5B6077]'}`}>Attendance</button>}
                        </div>

                        {busTab === 'my_route' && (
                            <div className="space-y-4">
                                {myRoute ? (
                                    <div className="bg-white rounded-[20px] border border-[#0B0828]/5 p-5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#8FA0D8] uppercase tracking-wider bg-[#8FA0D8]/10 px-2 py-0.5 rounded">Your Assigned Route</span>
                                                <h3 className="text-lg font-bold text-[#0B0828] mt-2 font-display">{myRoute.routeNumber}</h3>
                                                <p className="text-xs text-[#5B6077] font-semibold">{myRoute.routeName}</p>
                                            </div>
                                            <div className="bg-[#67C587]/10 text-[#67C587] text-[10px] font-bold px-2 py-1 rounded-md border border-[#67C587]/20 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#67C587]" /> Active
                                            </div>
                                        </div>

                                        {/* Driver Info */}
                                        <div className="flex items-center justify-between p-3 bg-black/[0.02] rounded-xl border border-black/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#8FA0D8]/20 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-[#8FA0D8]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#0B0828]">{myRoute.driverName || 'N/A'}</p>
                                                    <p className="text-[10px] text-[#5B6077]">{myRoute.busNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {myRoute.driverPhone && (
                                                <a href={`tel:${myRoute.driverPhone}`} className="p-2 bg-white rounded-lg border border-black/5 text-[#8FA0D8] shadow-sm"><PhoneCall className="w-4 h-4" /></a>
                                            )}
                                        </div>

                                        {/* Map Placeholder */}
                                        <div className="h-32 rounded-xl bg-[#FDFDFD] border border-black/5 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                                            <div className="absolute px-3 py-1.5 bg-[#FF8400] text-white text-[10px] font-bold rounded shadow-lg flex items-center gap-1"><Navigation className="w-3 h-3 rotate-45" /> Live Tracking</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-white rounded-[20px] border border-black/5">
                                        <p className="text-sm text-[#5B6077] font-semibold">No assigned route found.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {busTab === 'all_routes' && (
                            <div className="space-y-3">
                                {filteredBusRoutes.map(route => (
                                    <div key={route._id} className="bg-white rounded-[20px] border border-[#0B0828]/5 p-4 shadow-[0_2px_8px_rgba(11,8,40,0.01)] flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                                    <Bus className="w-4 h-4 text-[#0B0828]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-[#0B0828] font-display">{route.routeNumber}</h4>
                                                    <p className="text-[10px] text-[#5B6077] truncate w-[200px]">{route.routeName}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${route.status === 'active' ? 'bg-[#67C587]/10 text-[#67C587] border-[#67C587]/20' : 'bg-black/5 text-[#5B6077] border-black/10'}`}>
                                                {route.status?.toUpperCase() || 'SCHEDULED'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[10px] font-semibold text-[#5B6077]">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#FF8400]" /> {route.stops?.length || 0} Stops</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#8FA0D8]" /> Next: {route.timings?.[0] || 'N/A'}</span>
                                        </div>
                                    </div>
                                ))}
                                {filteredBusRoutes.length === 0 && <p className="text-center text-xs text-[#5B6077] py-4">No routes found.</p>}
                            </div>
                        )}

                        {busTab === 'attendance' && (
                            <div className="space-y-3">
                                <div className="bg-white rounded-[20px] p-5 border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)]">
                                    <h4 className="text-sm font-bold text-[#0B0828] mb-4">Your Recent Attendance</h4>
                                    <div className="space-y-2">
                                        {attendance.length > 0 ? attendance.map((record, i) => (
                                            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-black/5 bg-[#FDFDFD]">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#5B6077]" />
                                                    <span className="text-xs font-bold text-[#0B0828]">{new Date(record.date).toLocaleDateString()}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${record.status === 'present' ? 'bg-[#67C587]/10 text-[#67C587]' : 'bg-[#E76F51]/10 text-[#E76F51]'}`}>
                                                    {record.status?.toUpperCase()}
                                                </span>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-[#5B6077] text-center">No attendance records found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="shuttle" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                        {/* Shuttle Sub Tabs */}
                        <div className="flex gap-2 border-b border-black/5 pb-2 overflow-x-auto scrollbar-hide">
                            <button onClick={() => setShuttleTab('schedules')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${shuttleTab === 'schedules' ? 'bg-[#0B0828] text-white' : 'bg-black/5 text-[#5B6077]'}`}>Schedules</button>
                            <button onClick={() => setShuttleTab('my_bookings')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${shuttleTab === 'my_bookings' ? 'bg-[#0B0828] text-white' : 'bg-black/5 text-[#5B6077]'}`}>My Bookings</button>
                        </div>

                        {shuttleTab === 'schedules' && (
                            <div className="space-y-4">
                                {filteredShuttles.map(shuttle => {
                                    const isBooked = myBookings.some(b => b.shuttleId === shuttle._id && b.status !== 'cancelled');
                                    const isFull = shuttle.bookedCount >= shuttle.capacity;
                                    
                                    return (
                                        <div key={shuttle._id} className="bg-white rounded-[20px] border border-[#0B0828]/5 p-5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#0B0828] font-display">{shuttle.shuttleNumber} - {shuttle.routeName}</h3>
                                                    <p className="text-[10px] text-[#5B6077] mt-0.5">{shuttle.scheduleType} Schedule</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-[#0B0828]">{shuttle.bookedCount}/{shuttle.capacity}</span>
                                                    <div className="w-16 h-1 bg-black/10 rounded-full mt-1 overflow-hidden">
                                                        <div className={`h-full rounded-full ${isFull ? 'bg-[#E76F51]' : 'bg-[#67C587]'}`} style={{ width: `${(shuttle.bookedCount / shuttle.capacity) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                                                {shuttle.stops?.map((stop: any, idx: number) => (
                                                    <div key={idx} className="flex-shrink-0 bg-black/[0.02] px-3 py-1.5 rounded-lg border border-black/5">
                                                        <p className="text-[10px] font-bold text-[#0B0828]">{stop.name}</p>
                                                        <p className="text-[9px] text-[#8FA0D8] font-bold">{stop.time}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {isBooked ? (
                                                <button disabled className="w-full py-2.5 rounded-xl bg-black/5 text-[#5B6077] text-xs font-bold flex items-center justify-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#67C587]" /> Booked
                                                </button>
                                            ) : (
                                                <button onClick={() => handleBookShuttle(shuttle._id)} className={`w-full py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all ${isFull ? 'bg-[#FF8400] hover:bg-[#FF8400]/90' : 'bg-[#2A3B3C] hover:opacity-90'}`}>
                                                    {isFull ? 'Join Waitlist' : 'Book Seat'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                {filteredShuttles.length === 0 && <p className="text-center text-xs text-[#5B6077] py-4">No shuttles found.</p>}
                            </div>
                        )}

                        {shuttleTab === 'my_bookings' && (
                            <div className="space-y-3">
                                {myBookings.map(booking => (
                                    <div key={booking._id} className="bg-white rounded-[20px] border border-[#0B0828]/5 p-4 shadow-[0_2px_8px_rgba(11,8,40,0.01)] flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-[#0B0828] font-display">Shuttle Booking</h4>
                                                <p className="text-[10px] text-[#5B6077]">{new Date(booking.date).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${booking.status === 'confirmed' ? 'bg-[#67C587]/10 text-[#67C587] border-[#67C587]/20' : booking.status === 'waitlisted' ? 'bg-[#FF8400]/10 text-[#FF8400] border-[#FF8400]/20' : 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20'}`}>
                                                {booking.status?.toUpperCase()}
                                            </span>
                                        </div>
                                        {booking.status !== 'cancelled' && (
                                            <button onClick={() => handleCancelShuttle(booking._id)} className="mt-2 w-full py-2 rounded-xl border border-[#E76F51]/20 text-[#E76F51] text-[10px] font-bold hover:bg-[#E76F51]/5 transition-all flex items-center justify-center gap-1">
                                                <XCircle className="w-3 h-3" /> Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {myBookings.length === 0 && <p className="text-center text-xs text-[#5B6077] py-4">No bookings found.</p>}
                            </div>
                        )}

                        {/* Contact Info at bottom of Shuttle */}
                        <div className="mt-6 p-4 rounded-[20px] bg-[#8FA0D8]/10 border border-[#8FA0D8]/20 flex items-center gap-3">
                            <Info className="w-6 h-6 text-[#8FA0D8]" />
                            <div>
                                <p className="text-xs font-bold text-[#0B0828]">Need Help?</p>
                                <p className="text-[10px] text-[#5B6077]">Contact Transport Coord. Mr. Mukesh at +91 9782008380</p>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
