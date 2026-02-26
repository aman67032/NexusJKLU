'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

interface ClubEventCardProps {
    id: string | number;
    title: string;
    date: string;
    venue?: string;
    imageUrl?: string;
    status?: string;
    desc?: string;
    color?: string;
    bg?: string;
    border?: string;
    is_enrolled?: boolean;
}

export default function ClubEventCard({ id, title, date, venue, imageUrl, status, desc, is_enrolled }: ClubEventCardProps) {
    return (
        <Link href={`/council/events/${id}`}>
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer border border-nexus-camel/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-xl hover:shadow-[var(--primary)]/5">
                {/* Image */}
                <div className="h-36 w-full relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {imageUrl && (
                        <>
                            <img
                                src={imageUrl}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        </>
                    )}
                    {is_enrolled && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider z-10">
                            Enrolled
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                        <div className="flex items-center gap-1.5 text-[11px] text-nexus-khaki mb-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(date), 'MMM d, yyyy')}
                        </div>
                        <h4 className="text-sm font-bold text-nexus-linen line-clamp-2 drop-shadow-md">{title}</h4>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 pt-3">
                    {venue && (
                        <div className="flex items-center gap-1.5 text-xs text-nexus-camel mb-2">
                            <MapPin className="w-3 h-3" />
                            {venue}
                        </div>
                    )}
                    {desc && <p className="text-xs text-white/30 line-clamp-2 mb-3">{desc}</p>}
                    <div className="flex items-center justify-between pt-2 border-t border-nexus-camel/10">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider group-hover:text-nexus-khaki transition-colors">View Event</span>
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--primary)] transition-all">
                            <ChevronRight className="w-3 h-3 text-nexus-camel group-hover:text-nexus-linen" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
