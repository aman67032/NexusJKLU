'use client';

import { useState } from 'react';
import { Building2, MessageSquare, Shield } from 'lucide-react';

// Subcomponents for each tab
import CouncilsTab from './CouncilsTab';
import ClubsTab from './ClubsTab';
import VoiceTab from './VoiceTab';

export default function OrganizationsAdmin() {
    const [activeTab, setActiveTab] = useState<'councils' | 'clubs' | 'voice'>('councils');

    const tabs = [
        { id: 'councils', label: 'Councils', icon: Shield },
        { id: 'clubs', label: 'Clubs', icon: Building2 },
        { id: 'voice', label: 'Campus Voice', icon: MessageSquare },
    ];

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-nexus-linen tracking-tight">Organizations</h1>
                    <p className="text-nexus-camel mt-1">Manage infrastructure, assign leadership roles, and configure system entities.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-nexus-camel/20" style={{ scrollbarWidth: 'none' }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'councils' | 'clubs' | 'voice')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-colors border-b-2 whitespace-nowrap ${isActive
                                    ? 'text-nexus-brass border-nexus-brass bg-nexus-coffee/10'
                                    : 'text-nexus-khaki border-transparent hover:text-nexus-linen hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-[#151515] border border-nexus-camel/20 rounded-2xl min-h-[500px]">
                {activeTab === 'councils' && <CouncilsTab />}
                {activeTab === 'clubs' && <ClubsTab />}
                {activeTab === 'voice' && <VoiceTab />}
            </div>
        </div>
    );
}
