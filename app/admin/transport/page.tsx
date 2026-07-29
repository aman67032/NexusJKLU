'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
    Bus as BusIcon, Users, Calendar, MapPin, Activity, 
    RefreshCw, Edit, Plus, Navigation, Trash2,
    Clock, Save, Search, X, ChevronDown, ChevronUp,
    Phone, Hash, Route, AlertCircle, Check, ArrowUpDown
} from 'lucide-react';

interface BusStop {
    name: string;
    pickupTime: string;
    order: number;
}

interface BusRoute {
    _id: string;
    routeNumber: string;
    routeName: string;
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    firstPickupPoint: string;
    stops: BusStop[];
    arrivalAtJKLU: string;
    departureFromJKLU: string;
    capacity: number;
    status: string;
    isActive: boolean;
    enrolledCount?: number;
    currentLocation?: { lat: number; lng: number; updatedAt: string };
}

interface ShuttleData {
    _id: string;
    shuttleNumber: string;
    routeName: string;
    schedule: string;
    routeType: string;
    stops: { name: string; time: string; type: string }[];
    capacity: number;
    currentBookings: number;
    status: string;
    contactPerson: string;
    contactPhone: string;
    isActive: boolean;
}

interface AttendanceRecord {
    _id: string;
    studentId: { _id: string; name: string; email: string; rollNumber: string };
    status: string;
    boardingPoint: string;
}

// ——— Edit Modal Component for Bus ———
function BusEditModal({ bus, onClose, onSave }: { bus: BusRoute | null; onClose: () => void; onSave: (data: Partial<BusRoute>) => void }) {
    const isNew = !bus?._id;
    const [form, setForm] = useState({
        routeNumber: bus?.routeNumber || '',
        routeName: bus?.routeName || '',
        vehicleNumber: bus?.vehicleNumber || '',
        driverName: bus?.driverName || '',
        driverPhone: bus?.driverPhone || '',
        firstPickupPoint: bus?.firstPickupPoint || '',
        arrivalAtJKLU: bus?.arrivalAtJKLU || '8:15 AM',
        departureFromJKLU: bus?.departureFromJKLU || '5:00 PM',
        capacity: bus?.capacity || 50,
        status: bus?.status || 'scheduled',
    });
    const [stops, setStops] = useState<BusStop[]>(bus?.stops || []);
    const [newStopName, setNewStopName] = useState('');
    const [newStopTime, setNewStopTime] = useState('');
    const [saving, setSaving] = useState(false);

    const addStop = () => {
        if (!newStopName.trim()) return;
        setStops([...stops, { name: newStopName.trim(), pickupTime: newStopTime.trim(), order: stops.length + 1 }]);
        setNewStopName('');
        setNewStopTime('');
    };

    const removeStop = (index: number) => {
        const updated = stops.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }));
        setStops(updated);
    };

    const moveStop = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === stops.length - 1)) return;
        const newStops = [...stops];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newStops[index], newStops[swapIndex]] = [newStops[swapIndex], newStops[index]];
        setStops(newStops.map((s, i) => ({ ...s, order: i + 1 })));
    };

    const handleSubmit = async () => {
        setSaving(true);
        await onSave({ ...form, stops });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-black/5 flex items-center justify-between rounded-t-[24px]">
                    <div>
                        <h2 className="text-lg font-bold text-[#0B0828] font-display">{isNew ? 'Add New Bus Route' : 'Edit Bus Route'}</h2>
                        <p className="text-[10px] text-[#5B6077] font-semibold mt-0.5">{isNew ? 'Create a new route with stops' : `Editing ${bus?.routeNumber}`}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-xl transition-colors"><X className="w-5 h-5 text-[#5B6077]" /></button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Route Number</label>
                            <input value={form.routeNumber} onChange={e => setForm({...form, routeNumber: e.target.value})}
                                placeholder="Route 1" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Route Name</label>
                            <input value={form.routeName} onChange={e => setForm({...form, routeName: e.target.value})}
                                placeholder="VT Road - Patrakar Colony" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Vehicle Number</label>
                            <input value={form.vehicleNumber} onChange={e => setForm({...form, vehicleNumber: e.target.value})}
                                placeholder="RJ14PE0972" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Driver Name</label>
                            <input value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})}
                                placeholder="AJIT SINGH" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Driver Phone</label>
                            <input value={form.driverPhone} onChange={e => setForm({...form, driverPhone: e.target.value})}
                                placeholder="7976061630" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">First Pickup Point</label>
                        <input value={form.firstPickupPoint} onChange={e => setForm({...form, firstPickupPoint: e.target.value})}
                            placeholder="V.T.Road Near Tejaji Temple" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Arrival at JKLU</label>
                            <input value={form.arrivalAtJKLU} onChange={e => setForm({...form, arrivalAtJKLU: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Departure</label>
                            <input value={form.departureFromJKLU} onChange={e => setForm({...form, departureFromJKLU: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Capacity</label>
                            <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value) || 50})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Status</label>
                            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors">
                                <option value="scheduled">Scheduled</option>
                                <option value="active">Active</option>
                                <option value="delayed">Delayed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Stops Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase">Route Stops ({stops.length})</label>
                        </div>
                        
                        {/* Existing Stops */}
                        <div className="space-y-1.5 mb-3 max-h-[240px] overflow-y-auto pr-1">
                            {stops.map((stop, i) => (
                                <div key={i} className="flex items-center gap-2 bg-black/[0.02] rounded-xl px-3 py-2 group">
                                    <span className="w-5 h-5 rounded-full bg-[#8FA0D8]/15 flex items-center justify-center text-[9px] font-bold text-[#8FA0D8] shrink-0">{stop.order}</span>
                                    <span className="text-xs font-semibold text-[#0B0828] flex-1 truncate">{stop.name}</span>
                                    {stop.pickupTime && <span className="text-[10px] text-[#5B6077] shrink-0">{stop.pickupTime}</span>}
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button onClick={() => moveStop(i, 'up')} disabled={i === 0}
                                            className="p-1 hover:bg-white rounded-lg disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button>
                                        <button onClick={() => moveStop(i, 'down')} disabled={i === stops.length - 1}
                                            className="p-1 hover:bg-white rounded-lg disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button>
                                        <button onClick={() => removeStop(i)}
                                            className="p-1 hover:bg-red-50 rounded-lg text-red-400"><X className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add New Stop */}
                        <div className="flex items-center gap-2">
                            <input value={newStopName} onChange={e => setNewStopName(e.target.value)} placeholder="Stop name"
                                className="flex-1 bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors"
                                onKeyDown={e => e.key === 'Enter' && addStop()} />
                            <input value={newStopTime} onChange={e => setNewStopTime(e.target.value)} placeholder="Time (opt)"
                                className="w-24 bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#8FA0D8] transition-colors"
                                onKeyDown={e => e.key === 'Enter' && addStop()} />
                            <button onClick={addStop} className="px-3 py-2 bg-[#0B0828] text-white rounded-xl text-xs font-bold shrink-0">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-black/5 flex justify-end gap-3 rounded-b-[24px]">
                    <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-[#5B6077] hover:bg-black/5 rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={saving || !form.routeNumber || !form.routeName}
                        className="px-6 py-2.5 bg-[#0B0828] text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-40 transition-all hover:bg-[#1a1540]">
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isNew ? 'Create Route' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ——— Edit Modal for Shuttle ———
function ShuttleEditModal({ shuttle, onClose, onSave }: { shuttle: ShuttleData | null; onClose: () => void; onSave: (data: Partial<ShuttleData>) => void }) {
    const isNew = !shuttle?._id;
    const [form, setForm] = useState({
        shuttleNumber: shuttle?.shuttleNumber || '',
        routeName: shuttle?.routeName || '',
        schedule: shuttle?.schedule || 'working_days',
        routeType: shuttle?.routeType || '',
        capacity: shuttle?.capacity || 32,
        status: shuttle?.status || 'scheduled',
        contactPerson: shuttle?.contactPerson || 'Mr. Mukesh',
        contactPhone: shuttle?.contactPhone || '+91 9782008380',
    });
    const [stops, setStops] = useState(shuttle?.stops || []);
    const [newStop, setNewStop] = useState({ name: '', time: '', type: 'stop' });
    const [saving, setSaving] = useState(false);

    const addStop = () => {
        if (!newStop.name.trim() || !newStop.time.trim()) return;
        setStops([...stops, { name: newStop.name.trim(), time: newStop.time.trim(), type: newStop.type }]);
        setNewStop({ name: '', time: '', type: 'stop' });
    };

    const removeStop = (index: number) => setStops(stops.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        setSaving(true);
        await onSave({ ...form, stops } as any);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-black/5 flex items-center justify-between rounded-t-[24px]">
                    <div>
                        <h2 className="text-lg font-bold text-[#0B0828] font-display">{isNew ? 'Add Shuttle Schedule' : 'Edit Shuttle'}</h2>
                        <p className="text-[10px] text-[#5B6077] font-semibold mt-0.5">{isNew ? 'Create a new shuttle service' : `Editing ${shuttle?.shuttleNumber}`}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-xl transition-colors"><X className="w-5 h-5 text-[#5B6077]" /></button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Shuttle Number</label>
                            <input value={form.shuttleNumber} onChange={e => setForm({...form, shuttleNumber: e.target.value})}
                                placeholder="SH-WD-R1-1" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Route Name</label>
                            <input value={form.routeName} onChange={e => setForm({...form, routeName: e.target.value})}
                                placeholder="JKLU → Metro" className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Schedule</label>
                            <select value={form.schedule} onChange={e => setForm({...form, schedule: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]">
                                <option value="working_days">Working Days</option>
                                <option value="weekends_holidays">Weekends/Holidays</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Capacity</label>
                            <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value) || 32})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Status</label>
                            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]">
                                <option value="scheduled">Scheduled</option>
                                <option value="active">Active</option>
                                <option value="full">Full</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Contact Person</label>
                            <input value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Contact Phone</label>
                            <input value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})}
                                className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                        </div>
                    </div>

                    {/* Stops */}
                    <div>
                        <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-2 block">Stops ({stops.length})</label>
                        <div className="space-y-1.5 mb-3 max-h-[180px] overflow-y-auto">
                            {stops.map((stop, i) => (
                                <div key={i} className="flex items-center gap-2 bg-black/[0.02] rounded-xl px-3 py-2 group">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${stop.type === 'departure' ? 'bg-green-100 text-green-700' : stop.type === 'arrival' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {stop.type === 'departure' ? 'DEP' : stop.type === 'arrival' ? 'ARR' : 'STOP'}
                                    </span>
                                    <span className="text-xs font-semibold text-[#0B0828] flex-1 truncate">{stop.name}</span>
                                    <span className="text-[10px] text-[#5B6077]">{stop.time}</span>
                                    <button onClick={() => removeStop(i)} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg text-red-400 transition-opacity">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newStop.name} onChange={e => setNewStop({...newStop, name: e.target.value})} placeholder="Stop name"
                                className="flex-1 bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                            <input value={newStop.time} onChange={e => setNewStop({...newStop, time: e.target.value})} placeholder="Time"
                                className="w-24 bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                            <select value={newStop.type} onChange={e => setNewStop({...newStop, type: e.target.value})}
                                className="w-20 bg-black/[0.02] border border-black/5 rounded-xl px-2 py-2 text-xs font-semibold outline-none focus:border-[#8FA0D8]">
                                <option value="departure">Dep</option>
                                <option value="stop">Stop</option>
                                <option value="arrival">Arr</option>
                            </select>
                            <button onClick={addStop} className="px-3 py-2 bg-[#0B0828] text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-black/5 flex justify-end gap-3 rounded-b-[24px]">
                    <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-[#5B6077] hover:bg-black/5 rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={saving || !form.shuttleNumber || !form.routeName}
                        className="px-6 py-2.5 bg-[#0B0828] text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-40 hover:bg-[#1a1540] transition-all">
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isNew ? 'Create Shuttle' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ——— Delete Confirmation Modal ———
function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel}>
            <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-center font-bold text-[#0B0828] font-display mb-1">{title}</h3>
                <p className="text-center text-xs text-[#5B6077] mb-6">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-xs font-bold text-[#5B6077] border border-black/10 rounded-xl hover:bg-black/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

// ——— Toast Notification ———
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-4 ${
            type === 'success' ? 'bg-[#0B0828] text-white' : 'bg-red-500 text-white'
        }`}>
            {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message}
        </div>
    );
}

// ——— Main Page ———
export default function AdminTransportPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'overview' | 'buses' | 'shuttles' | 'attendance' | 'location'>('overview');
    
    const [buses, setBuses] = useState<BusRoute[]>([]);
    const [shuttles, setShuttles] = useState<ShuttleData[]>([]);
    const [stats, setStats] = useState({ totalBuses: 0, totalShuttles: 0, activeShuttles: 0, totalRequests: 0, utilization: 0 });
    const [loading, setLoading] = useState(true);

    // Modal states
    const [editingBus, setEditingBus] = useState<BusRoute | null>(null);
    const [showBusModal, setShowBusModal] = useState(false);
    const [editingShuttle, setEditingShuttle] = useState<ShuttleData | null>(null);
    const [showShuttleModal, setShowShuttleModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'bus' | 'shuttle'; id: string; name: string } | null>(null);

    // Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Attendance
    const [selectedBusForAttendance, setSelectedBusForAttendance] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    // GPS
    const [gpsVehicle, setGpsVehicle] = useState('');
    const [gpsVehicleType, setGpsVehicleType] = useState<'bus' | 'shuttle'>('bus');
    const [gpsLat, setGpsLat] = useState('');
    const [gpsLng, setGpsLng] = useState('');
    const [gpsSaving, setGpsSaving] = useState(false);

    // Expanded bus rows for viewing stops inline
    const [expandedBus, setExpandedBus] = useState<string | null>(null);

    // Search
    const [busSearch, setBusSearch] = useState('');

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            router.push('/');
        } else if (isAdmin) {
            fetchData();
        }
    }, [isAdmin, authLoading, router]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [busRes, shuttleRes] = await Promise.all([
                api.get('/api/bus/routes').catch(() => ({ data: [] })),
                api.get('/api/shuttle/schedules').catch(() => ({ data: [] })),
            ]);
            setBuses(busRes.data);
            setShuttles(shuttleRes.data);

            let shuttleStats = { totalRequests: 0, utilization: 0 };
            try {
                const statsRes = await api.get('/api/shuttle/admin/stats');
                shuttleStats = statsRes.data;
            } catch {}

            setStats({
                totalBuses: busRes.data.length,
                totalShuttles: shuttleRes.data.length,
                activeShuttles: shuttleRes.data.filter((s: any) => s.status === 'active').length,
                totalRequests: shuttleStats.totalRequests || 0,
                utilization: shuttleStats.utilization || Math.round((shuttleRes.data.reduce((acc: number, s: any) => acc + (s.currentBookings || 0), 0) / Math.max(1, shuttleRes.data.reduce((acc: number, s: any) => acc + s.capacity, 0))) * 100),
            });
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ——— Bus CRUD ———
    const handleSaveBus = async (data: Partial<BusRoute>) => {
        try {
            if (editingBus?._id) {
                await api.put(`/api/bus/routes/${editingBus._id}`, data);
                setToast({ message: `${data.routeNumber} updated successfully`, type: 'success' });
            } else {
                await api.post('/api/bus/routes', data);
                setToast({ message: `${data.routeNumber} created successfully`, type: 'success' });
            }
            setShowBusModal(false);
            setEditingBus(null);
            fetchData();
        } catch (err: any) {
            setToast({ message: err?.response?.data?.error || 'Failed to save bus route', type: 'error' });
        }
    };

    const handleDeleteBus = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/api/bus/routes/${deleteTarget.id}`);
            setToast({ message: `${deleteTarget.name} deleted`, type: 'success' });
            setDeleteTarget(null);
            fetchData();
        } catch (err: any) {
            setToast({ message: err?.response?.data?.error || 'Failed to delete', type: 'error' });
        }
    };

    // ——— Shuttle CRUD ———
    const handleSaveShuttle = async (data: Partial<ShuttleData>) => {
        try {
            if (editingShuttle?._id) {
                await api.put(`/api/shuttle/admin/schedules/${editingShuttle._id}`, data);
                setToast({ message: `${data.shuttleNumber} updated successfully`, type: 'success' });
            } else {
                await api.post('/api/shuttle/admin/schedules', data);
                setToast({ message: `${data.shuttleNumber} created successfully`, type: 'success' });
            }
            setShowShuttleModal(false);
            setEditingShuttle(null);
            fetchData();
        } catch (err: any) {
            setToast({ message: err?.response?.data?.error || 'Failed to save shuttle', type: 'error' });
        }
    };

    const handleDeleteShuttle = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/api/shuttle/admin/schedules/${deleteTarget.id}`);
            setToast({ message: `${deleteTarget.name} deleted`, type: 'success' });
            setDeleteTarget(null);
            fetchData();
        } catch (err: any) {
            setToast({ message: err?.response?.data?.error || 'Failed to delete', type: 'error' });
        }
    };

    // ——— Attendance ———
    const fetchAttendance = async () => {
        if (!selectedBusForAttendance || !attendanceDate) return;
        setAttendanceLoading(true);
        try {
            const res = await api.get(`/api/bus/attendance/${selectedBusForAttendance}/${attendanceDate}`);
            setAttendanceRecords(res.data);
        } catch (err) {
            setToast({ message: 'Failed to fetch attendance', type: 'error' });
        } finally {
            setAttendanceLoading(false);
        }
    };

    const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
        try {
            await api.post('/api/bus/attendance/mark', {
                studentId,
                busId: selectedBusForAttendance,
                date: attendanceDate,
                status,
            });
            setToast({ message: `Marked ${status}`, type: 'success' });
            fetchAttendance();
        } catch (err) {
            setToast({ message: 'Failed to mark attendance', type: 'error' });
        }
    };

    // ——— GPS Update ———
    const updateGPS = async () => {
        if (!gpsVehicle || !gpsLat || !gpsLng) return;
        setGpsSaving(true);
        try {
            const endpoint = gpsVehicleType === 'bus'
                ? `/api/bus/routes/${gpsVehicle}/location`
                : `/api/shuttle/admin/schedules/${gpsVehicle}/location`;
            await api.put(endpoint, { lat: parseFloat(gpsLat), lng: parseFloat(gpsLng) });
            setToast({ message: 'Location updated successfully', type: 'success' });
            setGpsLat('');
            setGpsLng('');
        } catch (err) {
            setToast({ message: 'Failed to update location', type: 'error' });
        } finally {
            setGpsSaving(false);
        }
    };

    const filteredBuses = buses.filter(b =>
        !busSearch || b.routeNumber.toLowerCase().includes(busSearch.toLowerCase()) ||
        b.routeName.toLowerCase().includes(busSearch.toLowerCase()) ||
        b.driverName.toLowerCase().includes(busSearch.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#8FA0D8] animate-spin" />
            </div>
        );
    }

    if (!isAdmin) return null;

    const statusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-[#67C587]/10 text-[#67C587]';
            case 'scheduled': return 'bg-[#8FA0D8]/10 text-[#8FA0D8]';
            case 'delayed': return 'bg-[#FF8400]/10 text-[#FF8400]';
            case 'cancelled': return 'bg-red-100 text-red-500';
            case 'full': return 'bg-amber-100 text-amber-600';
            default: return 'bg-black/5 text-[#5B6077]';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: BusIcon, color: '#8FA0D8', label: 'Total Buses', value: stats.totalBuses },
                                { icon: Activity, color: '#67C587', label: 'Active Shuttles', value: `${stats.activeShuttles}/${stats.totalShuttles}` },
                                { icon: Users, color: '#FF8400', label: "Today's Requests", value: stats.totalRequests },
                                { icon: Activity, color: '#E76F51', label: 'Capacity Utilization', value: `${stats.utilization}%` },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-5 rounded-[20px] border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}15` }}>
                                        <card.icon className="w-5 h-5" style={{ color: card.color }} />
                                    </div>
                                    <p className="text-[10px] text-[#5B6077] font-bold uppercase">{card.label}</p>
                                    <p className="text-2xl font-bold text-[#0B0828] font-display mt-1">{card.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quick actions */}
                        <div className="bg-white rounded-[20px] border border-black/5 p-5">
                            <h3 className="text-sm font-bold text-[#0B0828] font-display mb-3">Quick Actions</h3>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => { setEditingBus(null); setShowBusModal(true); }} className="px-4 py-2 bg-[#0B0828] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#1a1540] transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Bus Route
                                </button>
                                <button onClick={() => { setEditingShuttle(null); setShowShuttleModal(true); }} className="px-4 py-2 bg-[#8FA0D8] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#7b8ec8] transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Shuttle
                                </button>
                                <button onClick={() => setActiveTab('attendance')} className="px-4 py-2 bg-black/5 text-[#0B0828] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-black/10 transition-colors">
                                    <Calendar className="w-3.5 h-3.5" /> Mark Attendance
                                </button>
                            </div>
                        </div>

                        {/* Recent buses summary */}
                        <div className="bg-white rounded-[20px] border border-black/5 p-5">
                            <h3 className="text-sm font-bold text-[#0B0828] font-display mb-3">Fleet Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {buses.slice(0, 6).map(bus => (
                                    <div key={bus._id} className="flex items-center gap-3 bg-black/[0.02] rounded-xl px-4 py-3">
                                        <span className="w-8 h-8 rounded-lg bg-[#8FA0D8]/10 flex items-center justify-center text-[10px] font-bold text-[#8FA0D8]">
                                            {bus.routeNumber.replace('Route ', 'R')}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-[#0B0828] truncate">{bus.routeName}</p>
                                            <p className="text-[10px] text-[#5B6077]">{bus.driverName} • {bus.vehicleNumber}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColor(bus.status)}`}>
                                            {bus.status?.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'buses':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6077]/40" />
                                <input value={busSearch} onChange={e => setBusSearch(e.target.value)} placeholder="Search routes, drivers..."
                                    className="w-full bg-white border border-black/5 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8] shadow-sm transition-colors" />
                            </div>
                            <button onClick={() => { setEditingBus(null); setShowBusModal(true); }}
                                className="px-4 py-2.5 bg-[#0B0828] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#1a1540] transition-colors whitespace-nowrap">
                                <Plus className="w-3.5 h-3.5" /> Add Bus
                            </button>
                        </div>

                        <div className="bg-white rounded-[20px] border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-black/[0.02] text-[#5B6077]">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">Route</th>
                                            <th className="px-5 py-3 font-semibold">Route Name</th>
                                            <th className="px-5 py-3 font-semibold">Driver</th>
                                            <th className="px-5 py-3 font-semibold">Vehicle</th>
                                            <th className="px-5 py-3 font-semibold">Stops</th>
                                            <th className="px-5 py-3 font-semibold">Timing</th>
                                            <th className="px-5 py-3 font-semibold">Status</th>
                                            <th className="px-5 py-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBuses.map(bus => (
                                            <React.Fragment key={bus._id}>
                                                <tr className="border-b border-black/5 last:border-0 hover:bg-black/[0.01] transition-colors">
                                                    <td className="px-5 py-3">
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#8FA0D8]/10 text-[10px] font-bold text-[#8FA0D8]">
                                                            {bus.routeNumber.replace('Route ', 'R')}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <p className="font-bold text-[#0B0828]">{bus.routeName}</p>
                                                        <p className="text-[10px] text-[#5B6077] mt-0.5">{bus.firstPickupPoint}</p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <p className="font-semibold text-[#0B0828]">{bus.driverName}</p>
                                                        <p className="text-[10px] text-[#5B6077] flex items-center gap-1 mt-0.5"><Phone className="w-2.5 h-2.5" />{bus.driverPhone}</p>
                                                    </td>
                                                    <td className="px-5 py-3 font-mono text-[#5B6077]">{bus.vehicleNumber}</td>
                                                    <td className="px-5 py-3">
                                                        <button onClick={() => setExpandedBus(expandedBus === bus._id ? null : bus._id)}
                                                            className="flex items-center gap-1 text-[#8FA0D8] hover:underline font-semibold">
                                                            {bus.stops?.length || 0} stops
                                                            {expandedBus === bus._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                        </button>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <p className="text-[10px] text-[#5B6077]">Arr: <strong className="text-[#0B0828]">{bus.arrivalAtJKLU}</strong></p>
                                                        <p className="text-[10px] text-[#5B6077]">Dep: <strong className="text-[#0B0828]">{bus.departureFromJKLU}</strong></p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColor(bus.status)}`}>
                                                            {bus.status?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button onClick={() => { setEditingBus(bus); setShowBusModal(true); }}
                                                                className="p-2 text-[#8FA0D8] hover:bg-[#8FA0D8]/10 rounded-lg transition-colors" title="Edit">
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => setDeleteTarget({ type: 'bus', id: bus._id, name: bus.routeNumber })}
                                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Expanded stops row */}
                                                {expandedBus === bus._id && bus.stops && (
                                                    <tr>
                                                        <td colSpan={8} className="px-5 py-3 bg-black/[0.015]">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {bus.stops.map((stop, i) => (
                                                                    <span key={i} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#0B0828] border border-black/5">
                                                                        <span className="w-4 h-4 rounded-full bg-[#8FA0D8]/10 flex items-center justify-center text-[8px] font-bold text-[#8FA0D8]">{stop.order}</span>
                                                                        {stop.name}
                                                                        {stop.pickupTime && <span className="text-[#5B6077] ml-1">({stop.pickupTime})</span>}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredBuses.length === 0 && (
                                    <div className="text-center py-10 text-xs text-[#5B6077]">
                                        {busSearch ? 'No routes match your search' : 'No bus routes found. Add one to get started.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'shuttles':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-[#5B6077] font-semibold">{shuttles.length} shuttle schedules</p>
                            <button onClick={() => { setEditingShuttle(null); setShowShuttleModal(true); }}
                                className="px-4 py-2.5 bg-[#0B0828] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#1a1540] transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add Shuttle
                            </button>
                        </div>

                        <div className="bg-white rounded-[20px] border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-black/[0.02] text-[#5B6077]">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">Shuttle No.</th>
                                            <th className="px-5 py-3 font-semibold">Route Name</th>
                                            <th className="px-5 py-3 font-semibold">Schedule</th>
                                            <th className="px-5 py-3 font-semibold">Stops</th>
                                            <th className="px-5 py-3 font-semibold">Capacity</th>
                                            <th className="px-5 py-3 font-semibold">Status</th>
                                            <th className="px-5 py-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shuttles.map(shuttle => (
                                            <tr key={shuttle._id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.01] transition-colors">
                                                <td className="px-5 py-3 font-bold text-[#0B0828] font-mono">{shuttle.shuttleNumber}</td>
                                                <td className="px-5 py-3">
                                                    <p className="font-semibold text-[#0B0828]">{shuttle.routeName}</p>
                                                    <p className="text-[10px] text-[#5B6077] mt-0.5">{shuttle.routeType}</p>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${shuttle.schedule === 'working_days' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                        {shuttle.schedule === 'working_days' ? 'Weekdays' : 'Weekends'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-[#5B6077]">
                                                    {shuttle.stops?.map((s, i) => (
                                                        <span key={i} className="block text-[10px]">
                                                            <span className={`font-bold ${s.type === 'departure' ? 'text-green-600' : s.type === 'arrival' ? 'text-red-500' : 'text-[#5B6077]'}`}>
                                                                {s.time}
                                                            </span> {s.name}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-[#0B0828]">{shuttle.currentBookings || 0}/{shuttle.capacity}</span>
                                                        <div className="w-12 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#8FA0D8] rounded-full transition-all" style={{ width: `${((shuttle.currentBookings || 0) / shuttle.capacity) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColor(shuttle.status)}`}>
                                                        {shuttle.status?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button onClick={() => { setEditingShuttle(shuttle); setShowShuttleModal(true); }}
                                                            className="p-2 text-[#8FA0D8] hover:bg-[#8FA0D8]/10 rounded-lg transition-colors" title="Edit">
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button onClick={() => setDeleteTarget({ type: 'shuttle', id: shuttle._id, name: shuttle.shuttleNumber })}
                                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {shuttles.length === 0 && (
                                    <div className="text-center py-10 text-xs text-[#5B6077]">No shuttle schedules found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'attendance':
                return (
                    <div className="space-y-4">
                        <div className="bg-white rounded-[20px] border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] p-5">
                            <h3 className="font-bold text-[#0B0828] font-display mb-4">Attendance Management</h3>
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="flex-1 min-w-[180px]">
                                    <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Bus Route</label>
                                    <select value={selectedBusForAttendance} onChange={e => setSelectedBusForAttendance(e.target.value)}
                                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]">
                                        <option value="">Select Bus Route</option>
                                        {buses.map(b => <option key={b._id} value={b._id}>{b.routeNumber} — {b.routeName}</option>)}
                                    </select>
                                </div>
                                <div className="min-w-[160px]">
                                    <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Date</label>
                                    <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                                </div>
                                <button onClick={fetchAttendance} disabled={!selectedBusForAttendance || attendanceLoading}
                                    className="px-5 py-2.5 bg-[#0B0828] text-white text-xs font-bold rounded-xl disabled:opacity-40 flex items-center gap-2 hover:bg-[#1a1540] transition-colors">
                                    {attendanceLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                    View
                                </button>
                            </div>
                        </div>

                        {attendanceRecords.length > 0 && (
                            <div className="bg-white rounded-[20px] border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-black/[0.02] text-[#5B6077]">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">Student</th>
                                            <th className="px-5 py-3 font-semibold">Roll No.</th>
                                            <th className="px-5 py-3 font-semibold">Status</th>
                                            <th className="px-5 py-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceRecords.map(record => (
                                            <tr key={record._id} className="border-b border-black/5 last:border-0">
                                                <td className="px-5 py-3 font-semibold text-[#0B0828]">{record.studentId?.name || 'Unknown'}</td>
                                                <td className="px-5 py-3 text-[#5B6077] font-mono">{record.studentId?.rollNumber || '—'}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${record.status === 'present' ? 'bg-[#67C587]/10 text-[#67C587]' : 'bg-red-100 text-red-500'}`}>
                                                        {record.status?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button onClick={() => markAttendance(record.studentId?._id, 'present')}
                                                            className="px-2.5 py-1 bg-[#67C587]/10 text-[#67C587] text-[10px] font-bold rounded-lg hover:bg-[#67C587]/20 transition-colors">Present</button>
                                                        <button onClick={() => markAttendance(record.studentId?._id, 'absent')}
                                                            className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-100 transition-colors">Absent</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedBusForAttendance && attendanceRecords.length === 0 && !attendanceLoading && (
                            <div className="bg-white rounded-[20px] border border-black/5 p-8 text-center">
                                <Calendar className="w-10 h-10 text-[#5B6077]/20 mx-auto mb-3" />
                                <p className="text-xs text-[#5B6077] font-semibold">No attendance records found for this date.</p>
                            </div>
                        )}
                    </div>
                );

            case 'location':
                return (
                    <div className="bg-white rounded-[20px] border border-black/5 shadow-[0_2px_8px_rgba(11,8,40,0.01)] p-6">
                        <div className="max-w-md mx-auto text-center">
                            <div className="w-14 h-14 rounded-2xl bg-[#FF8400]/10 flex items-center justify-center mx-auto mb-4">
                                <Navigation className="w-7 h-7 text-[#FF8400]" />
                            </div>
                            <h3 className="font-bold text-[#0B0828] font-display mb-1">Manual GPS Override</h3>
                            <p className="text-xs text-[#5B6077] mb-6">Update vehicle coordinates manually if GPS tracker fails.</p>

                            <div className="space-y-3 text-left">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Vehicle Type</label>
                                        <select value={gpsVehicleType} onChange={e => { setGpsVehicleType(e.target.value as any); setGpsVehicle(''); }}
                                            className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]">
                                            <option value="bus">Bus</option>
                                            <option value="shuttle">Shuttle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Select Vehicle</label>
                                        <select value={gpsVehicle} onChange={e => setGpsVehicle(e.target.value)}
                                            className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]">
                                            <option value="">Choose...</option>
                                            {gpsVehicleType === 'bus'
                                                ? buses.map(b => <option key={b._id} value={b._id}>{b.routeNumber}</option>)
                                                : shuttles.map(s => <option key={s._id} value={s._id}>{s.shuttleNumber}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Latitude</label>
                                        <input value={gpsLat} onChange={e => setGpsLat(e.target.value)} placeholder="26.8467"
                                            className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[#5B6077] uppercase mb-1 block">Longitude</label>
                                        <input value={gpsLng} onChange={e => setGpsLng(e.target.value)} placeholder="75.7655"
                                            className="w-full bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#8FA0D8]" />
                                    </div>
                                </div>
                                <button onClick={updateGPS} disabled={!gpsVehicle || !gpsLat || !gpsLng || gpsSaving}
                                    className="w-full px-4 py-3 bg-[#FF8400] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-[#e67700] transition-colors">
                                    {gpsSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update Coordinates
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-full bg-[#FDFDFD] p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0B0828] font-display">Transport Admin</h1>
                    <p className="text-xs text-[#5B6077] font-semibold">Manage campus fleet, routes, and schedules</p>
                </div>
                <button onClick={fetchData} className="p-2.5 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-black/5 transition-colors">
                    <RefreshCw className="w-4 h-4 text-[#0B0828]" />
                </button>
            </div>

            <div className="flex gap-2 border-b border-black/5 pb-2 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'buses', label: 'Buses', icon: BusIcon },
                    { id: 'shuttles', label: 'Shuttles', icon: Route },
                    { id: 'attendance', label: 'Attendance', icon: Calendar },
                    { id: 'location', label: 'Live Location', icon: Navigation },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === tab.id ? 'bg-[#0B0828] text-white' : 'bg-black/5 text-[#5B6077] hover:bg-black/10'
                        }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="pt-2">
                {renderContent()}
            </div>

            {/* Modals */}
            {showBusModal && (
                <BusEditModal
                    bus={editingBus}
                    onClose={() => { setShowBusModal(false); setEditingBus(null); }}
                    onSave={handleSaveBus}
                />
            )}

            {showShuttleModal && (
                <ShuttleEditModal
                    shuttle={editingShuttle}
                    onClose={() => { setShowShuttleModal(false); setEditingShuttle(null); }}
                    onSave={handleSaveShuttle}
                />
            )}

            {deleteTarget && (
                <ConfirmModal
                    title={`Delete ${deleteTarget.name}?`}
                    message="This action cannot be undone. All associated data will be lost."
                    onConfirm={deleteTarget.type === 'bus' ? handleDeleteBus : handleDeleteShuttle}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
