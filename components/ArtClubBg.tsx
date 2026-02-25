'use client';

// Artistic animated background for the Art Club page
export default function ArtClubBg() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Soft watercolor blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-yellow-200/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-blue-200/15 rounded-full blur-[90px]" />
            {/* Subtle canvas texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20l2.83-2.83 1.41 1.41L1.41 21.41 0 20zm0-18.59L2.83-1.41l1.41 1.41L1.41 2.83 0 1.41V0h.59z\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} />
        </div>
    );
}
