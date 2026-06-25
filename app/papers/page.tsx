'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PapersRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/learn/papers');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-nexus-black">
            <div className="w-8 h-8 rounded-full border-2 border-nexus-camel/20 border-t-[var(--secondary)] animate-spin" />
        </div>
    );
}
