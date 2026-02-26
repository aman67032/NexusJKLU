'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Code, ChevronRight, FileText, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
// Syntax Highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Question { id?: number; _id?: string; order?: number; title: string; question: string; code_snippets?: { [key: string]: string }; available_languages?: string[]; explanation?: string; media_link?: string | null; }
interface Contest { _id?: string; id?: string; date: string; title?: string; description?: string; questions: Question[]; }

export default function ChallengePage() {
    const params = useParams();
    const router = useRouter();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeQ, setActiveQ] = useState(0);
    const [activeLang, setActiveLang] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get(`/learn/contests/${params.id}`)
            .then(res => {
                const c = res.data.contest || res.data;
                setContest(c);
                if (c?.questions?.[0]?.available_languages?.[0]) setActiveLang(c.questions[0].available_languages[0]);
                else if (c?.questions?.[0]?.code_snippets) setActiveLang(Object.keys(c.questions[0].code_snippets)[0] || '');
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [params.id]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-nexus-camel/20 border-t-emerald-500 rounded-full animate-spin" /></div>;
    if (!contest) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold text-nexus-linen mb-4">Challenge Not Found</h2><button onClick={() => router.back()} className="text-emerald-400 hover:underline">Go Back</button></div>;

    const q = contest.questions?.[activeQ];
    const languages = q?.available_languages || (q?.code_snippets ? Object.keys(q.code_snippets) : []);

    return (
        <div className="min-h-screen relative">
            <div className="glow-orb w-[500px] h-[500px] -top-48 -right-48 bg-emerald-500" style={{ opacity: 0.06 }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Header */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-nexus-camel hover:text-nexus-linen transition-colors mb-6 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Coding Hour
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-nexus-linen mb-2">{contest.title || 'Coding Challenge'}</h1>
                    {contest.description && <p className="text-nexus-camel">{contest.description}</p>}
                    <p className="text-xs text-white/20 mt-2">Date: {new Date(contest.date).toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Question Navigation */}
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-bold text-nexus-camel uppercase tracking-wider mb-3">Questions</h3>
                        <div className="space-y-2">
                            {contest.questions?.map((question, idx) => (
                                <button key={idx} onClick={() => { setActiveQ(idx); const langs = question.available_languages || (question.code_snippets ? Object.keys(question.code_snippets) : []); setActiveLang(langs[0] || ''); }} className={`w-full text-left p-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeQ === idx ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-white/[0.03] border border-nexus-camel/10 text-nexus-camel hover:bg-white/5'}`}>
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${activeQ === idx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>{idx + 1}</span>
                                    <span className="truncate">{question.title || `Question ${idx + 1}`}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {q && (
                            <motion.div key={activeQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="glass-card p-6 mb-6">
                                    <h2 className="text-xl font-bold text-nexus-linen mb-4">{q.title || `Question ${activeQ + 1}`}</h2>
                                    <div className="prose max-w-none text-nexus-khaki leading-relaxed whitespace-pre-wrap text-sm">{q.question}</div>

                                    {/* Media Rendering (PDF or Image) */}
                                    {q.media_link && (
                                        <div className="mt-6 rounded-xl overflow-hidden border border-nexus-camel/20 bg-nexus-black/20 p-2">
                                            {q.media_link.toLowerCase().endsWith('.pdf') ? (
                                                <iframe src={q.media_link} className="w-full h-[500px] rounded-lg" title="Question PDF" />
                                            ) : (
                                                <img src={q.media_link} alt="Question media" className="rounded-lg max-w-full w-auto" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Code Snippets */}
                                {languages.length > 0 && q.code_snippets && (
                                    <div className="glass-card overflow-hidden relative group">
                                        <div className="flex items-center justify-between p-2 border-b border-nexus-camel/20 bg-white/[0.02]">
                                            <div className="flex items-center gap-1">
                                                {languages.map(lang => (
                                                    <button key={lang} onClick={() => setActiveLang(lang)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${activeLang === lang ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/30 hover:text-nexus-khaki'}`}>{lang}</button>
                                                ))}
                                            </div>

                                            {/* Copy Code Button */}
                                            <button
                                                onClick={() => handleCopy(q.code_snippets![activeLang] || '')}
                                                className="px-3 py-1.5 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-nexus-khaki hover:text-nexus-linen transition-colors rounded-md text-xs font-medium"
                                            >
                                                {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Code</>}
                                            </button>
                                        </div>

                                        {/* Rich Syntax Highlighting */}
                                        <div className="text-sm">
                                            <SyntaxHighlighter
                                                language={activeLang === 'c++' || activeLang === 'cpp' ? 'cpp' : activeLang.toLowerCase()}
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '13px' }}
                                                showLineNumbers
                                            >
                                                {q.code_snippets[activeLang] || '// No code available'}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                )}

                                {/* Explanation */}
                                {q.explanation && (
                                    <div className="glass-card p-6 mt-6 border-emerald-500/20">
                                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Explanation</h3>
                                        <p className="text-nexus-camel text-sm leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between mt-8">
                            <button onClick={() => setActiveQ(Math.max(0, activeQ - 1))} disabled={activeQ === 0} className="px-5 py-2.5 rounded-xl bg-white/5 border border-nexus-camel/20 text-nexus-camel disabled:opacity-30 hover:bg-white/10 hover:text-nexus-linen transition-all text-sm font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Previous Question</button>
                            <button onClick={() => setActiveQ(Math.min((contest.questions?.length || 1) - 1, activeQ + 1))} disabled={activeQ >= (contest.questions?.length || 1) - 1} className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 disabled:opacity-30 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all text-sm font-semibold flex items-center gap-2">Next Question <ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
