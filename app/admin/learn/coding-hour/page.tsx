'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Loader2, Code, Calendar,
    Terminal, Trash2, Edit,
    LogOut, ChevronDown, ChevronUp,
    Megaphone, FileText, Upload, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Course {
    _id: string; // MongoDB uses _id
    code: string;
    name: string;
}

interface Question {
    _id?: string;
    order: number;
    title: string;
    question: string;
    codeSnippets: { [key: string]: string };
    explanation: string;
    mediaLink?: string;
}

interface Contest {
    _id: string;
    courseId: string | Course;
    date: string;
    title?: string;
    description?: string;
    questions: Question[];
}

interface Announcement {
    _id: string;
    courseId?: string | Course | null;
    title: string;
    content: string;
    attachmentUrl?: string;
    createdAt: string;
}

const SUPPORTED_LANGUAGES = ['c', 'python', 'cpp', 'java', 'javascript'];

export default function CodingHourAdmin() {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
    const [editingContestId, setEditingContestId] = useState<string | null>(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Announcement Form
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        content: '',
        courseId: '',
        attachmentUrl: '' // Simplified for now since Nexus backend expects a string URL
    });

    // Matrix Rain Ref
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Form state for multi-question contest
    const [contestForm, setContestForm] = useState({
        courseId: '',
        date: '',
        title: '',
        description: ''
    });

    const [questions, setQuestions] = useState<Question[]>([{
        order: 1,
        title: '',
        question: '',
        codeSnippets: { python: '' },
        explanation: '',
        mediaLink: ''
    }]);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41'; // Matrix Green
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 35);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Redirect if not a host
        if (!user || (!user.roles.includes('admin') && !user.roles.includes('coding_ta') && !user.roles.includes('learn_admin'))) {
            router.push('/');
            return;
        }
        if (token) {
            fetchData();
        }
    }, [user, router, token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [coursesRes, contestsRes, annRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/learn/courses`),
                axios.get(`${API_BASE_URL}/learn/contests`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/learn/announcements`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            let coursesData = coursesRes.data;

            // Optional: If user is strictly Coding TA, filter courses like legacy
            // Taking all courses for now or filtering only coding:
            coursesData = coursesData.filter((c: Course) =>
                c.code.includes('CODING') || c.name.toLowerCase().includes('coding')
            );

            setCourses(coursesData);
            setContests(contestsRes.data);
            setAnnouncements(annRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            order: questions.length + 1,
            title: '',
            question: '',
            codeSnippets: { python: '' },
            explanation: '',
            mediaLink: ''
        }]);
        setExpandedQuestion(questions.length);
    };

    const removeQuestion = (index: number) => {
        if (questions.length === 1) {
            alert('Contest must have at least one question');
            return;
        }
        const newQuestions = questions.filter((_, i) => i !== index);
        newQuestions.forEach((q, i) => q.order = i + 1);
        setQuestions(newQuestions);
        if (expandedQuestion === index) {
            setExpandedQuestion(0);
        }
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const toggleLanguage = (questionIndex: number, lang: string) => {
        const newQuestions = [...questions];
        const snippets = { ...newQuestions[questionIndex].codeSnippets };

        if (snippets[lang] !== undefined) {
            if (Object.keys(snippets).length === 1) {
                alert('At least one language must be selected');
                return;
            }
            delete snippets[lang];
        } else {
            snippets[lang] = '';
        }

        newQuestions[questionIndex].codeSnippets = snippets;
        setQuestions(newQuestions);
    };

    const updateCodeSnippet = (questionIndex: number, lang: string, code: string) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].codeSnippets[lang] = code;
        setQuestions(newQuestions);
    };

    const handleEdit = (contest: Contest) => {
        setEditingContestId(contest._id);
        setContestForm({
            courseId: typeof contest.courseId === 'object' ? contest.courseId._id : contest.courseId,
            date: contest.date,
            title: contest.title || '',
            description: contest.description || ''
        });

        // Deep copy questions
        setQuestions(contest.questions.map(q => ({
            ...q,
            codeSnippets: { ...q.codeSnippets }
        })));

        setShowCreateModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const selectedCourseId = contestForm.courseId;
            const selectedCourse = courses.find(c => c._id === selectedCourseId);
            const isCodingHourC = selectedCourse?.name === 'Coding Hour - C' || selectedCourse?.code === 'CODING_C';

            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (isCodingHourC) {
                    if (!q.codeSnippets['c'] || q.codeSnippets['c'].trim() === '') {
                        alert(`Question ${i + 1} must have C code snippet (Mandatory for Coding Hour - C).`);
                        setActionLoading(false);
                        return;
                    }
                } else {
                    if (Object.keys(q.codeSnippets).length === 0 || Object.values(q.codeSnippets).every(val => !val || val.trim() === '')) {
                        alert(`Question ${i + 1} must have at least one code snippet.`);
                        setActionLoading(false);
                        return;
                    }
                }
            }

            const contestData = {
                courseId: contestForm.courseId,
                date: contestForm.date,
                title: contestForm.title || `${contestForm.date} Challenge`,
                description: contestForm.description || undefined,
                questions: questions
            };

            if (editingContestId) {
                await axios.put(`${API_BASE_URL}/learn/contests/${editingContestId}`, contestData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/learn/contests`, contestData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setShowCreateModal(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(error.response?.data?.error || 'Failed to save contest');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAnnouncementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/learn/announcements`, {
                title: announcementForm.title,
                content: announcementForm.content,
                courseId: announcementForm.courseId || undefined,
                attachmentUrl: announcementForm.attachmentUrl || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowAnnouncementModal(false);
            setAnnouncementForm({ title: '', content: '', courseId: '', attachmentUrl: '' });
            fetchData();
        } catch (error: any) {
            console.error('Announcement submit error:', error);
            alert(error.response?.data?.error || 'Failed to post announcement');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/learn/announcements/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            alert('Failed to delete announcement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this contest?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/learn/contests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContests(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            alert('Failed to delete contest');
        }
    };

    const resetForm = () => {
        setContestForm({ courseId: '', date: '', title: '', description: '' });
        setQuestions([{
            order: 1, title: '', question: '', codeSnippets: { python: '' }, explanation: '', mediaLink: ''
        }]);
        setExpandedQuestion(0);
        setEditingContestId(null);
    };

    if (loading && contests.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-green-500 w-12 h-12" />
                <p className="text-green-400 font-mono text-sm animate-pulse">Wait... Accessing System...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-black text-gray-200 font-sans overflow-hidden">
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0" />

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 bg-black/40 backdrop-blur-md border-b border-green-500/30 shadow-lg shadow-green-900/20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                                    Host Command Center
                                </h1>
                                <p className="text-xs text-green-500/70 font-mono">system.role = 'coding_ta'</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/20 border border-green-500/30">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-mono text-green-400">SYSTEM ONLINE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Terminal className="text-green-500 w-8 h-8" />
                            Active Contests
                        </h2>
                        <p className="text-gray-400">Manage weekly coding problems for students.</p>
                    </div>
                    <div className="flex-1 flex justify-end gap-3 self-end md:self-auto">
                        <button
                            onClick={() => setShowAnnouncementModal(true)}
                            className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all flex items-center gap-2 font-medium"
                        >
                            <Megaphone size={18} />
                            Announce
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-900/40 transition-all flex items-center gap-2 font-medium"
                        >
                            <Plus size={18} />
                            New Contest
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {contests.map((contest, index) => (
                        <motion.div
                            key={contest._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-gray-900/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    <span className="font-mono text-green-400 font-bold">{contest.date}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(contest)}
                                        className="p-1.5 text-gray-500 hover:text-green-400 transition-colors bg-gray-800 rounded-md"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(contest._id)}
                                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors bg-gray-800 rounded-md"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                {contest.title || contest.date}
                            </h3>

                            <div className="mb-4">
                                <div className="text-sm text-gray-400 mb-2">
                                    {contest.questions?.length || 0} Question{(contest.questions?.length !== 1) ? 's' : ''}
                                </div>
                                {contest.questions?.slice(0, 2).map((q, i) => (
                                    <div key={i} className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                                        <Code className="w-3 h-3 text-gray-600" />
                                        <span className="line-clamp-1">{q.title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-xs text-gray-500 border-t border-white/5 pt-4">
                                ID: {contest._id.substring(0, 8)}...
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Announcements */}
                {announcements.length > 0 && (
                    <div className="mt-12 mb-12">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                            <Megaphone className="text-blue-500" />
                            Active Announcements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.map((ann) => (
                                <div key={ann._id} className="bg-gray-800/50 border border-blue-500/20 rounded-xl p-6 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-white">{ann.title}</h4>
                                        <button onClick={() => handleDeleteAnnouncement(ann._id)} className="text-gray-500 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{ann.content}</p>
                                    {ann.attachmentUrl && (
                                        <a href={ann.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-400 bg-blue-900/20 px-3 py-1.5 rounded-lg w-fit hover:bg-blue-900/40">
                                            <FileText size={14} /> View Link
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-gray-900 border border-green-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 shadow-2xl"
                            >
                                <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-green-500/20 p-6 flex justify-between items-center z-10">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Terminal className="text-green-500" />
                                        {editingContestId ? 'Edit Contest' : 'Initialize Contest'}
                                    </h2>
                                    <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">TARGET_COURSE</label>
                                            <select
                                                value={contestForm.courseId}
                                                onChange={(e) => setContestForm({ ...contestForm, courseId: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/40 border border-green-500/20 rounded-lg text-white focus:outline-none focus:border-green-500 font-mono"
                                                required
                                            >
                                                <option value="">SELECT COURSE...</option>
                                                {courses.map((c) => (
                                                    <option key={c._id} value={c._id}>[{c.code}] {c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">EXECUTION_DATE</label>
                                            <input
                                                type="text"
                                                value={contestForm.date}
                                                onChange={(e) => setContestForm({ ...contestForm, date: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/40 border border-green-500/20 rounded-lg text-white focus:outline-none focus:border-green-500 font-mono"
                                                placeholder="Week 1 - Day 1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CONTEST_TITLE (Optional)</label>
                                        <input
                                            type="text"
                                            value={contestForm.title}
                                            onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/40 border border-green-500/20 rounded-lg text-white focus:outline-none focus:border-green-500 font-mono"
                                            placeholder="Introduction to C"
                                        />
                                    </div>

                                    {/* Questions List */}
                                    <div className="border-t border-green-500/20 pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Code className="text-green-500" />
                                                Questions ({questions.length})
                                            </h3>
                                            <button type="button" onClick={addQuestion} className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg border border-green-500/30 flex items-center gap-2 text-sm">
                                                <Plus size={16} /> Add Question
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {questions.map((q, qIndex) => (
                                                <div key={qIndex} className="border border-green-500/20 rounded-lg bg-black/20 overflow-hidden">
                                                    <div className="flex justify-between items-center p-4 bg-green-900/10 cursor-pointer" onClick={() => setExpandedQuestion(expandedQuestion === qIndex ? null : qIndex)}>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-green-400 font-mono font-bold">Q{qIndex + 1}</span>
                                                            <span className="text-white text-sm">{q.title || 'Untitled'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {questions.length > 1 && (
                                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeQuestion(qIndex); }} className="p-1.5 text-gray-500 hover:text-red-400">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                            {expandedQuestion === qIndex ? <ChevronUp className="text-green-400" size={16} /> : <ChevronDown className="text-green-400" size={16} />}
                                                        </div>
                                                    </div>

                                                    {expandedQuestion === qIndex && (
                                                        <div className="p-4 space-y-4 border-t border-green-500/10">
                                                            <input
                                                                type="text"
                                                                value={q.title}
                                                                onChange={(e) => updateQuestion(qIndex, 'title', e.target.value)}
                                                                className="w-full px-4 py-2 bg-black/40 border border-green-500/20 rounded-lg text-white text-sm focus:border-green-500"
                                                                placeholder="Question Title"
                                                                required
                                                            />
                                                            <textarea
                                                                value={q.question}
                                                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                                className="w-full px-4 py-2 bg-black/40 border border-green-500/20 rounded-lg text-white text-sm min-h-[100px] focus:border-green-500"
                                                                placeholder="Problem Statement"
                                                                required
                                                            />

                                                            {/* Languages */}
                                                            <div>
                                                                <label className="block text-xs text-green-400 mb-2 uppercase tracking-wider">Languages</label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {SUPPORTED_LANGUAGES.map(lang => (
                                                                        <label key={lang} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-xs uppercase ${q.codeSnippets[lang] !== undefined ? 'bg-green-600/30 border-green-500 text-green-300' : 'bg-gray-800/50 border-gray-600 text-gray-400'}`}>
                                                                            <input type="checkbox" className="sr-only" checked={q.codeSnippets[lang] !== undefined} onChange={() => toggleLanguage(qIndex, lang)} />
                                                                            {lang}
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Snippets */}
                                                            <div className="space-y-3">
                                                                {Object.keys(q.codeSnippets).map(lang => (
                                                                    <div key={lang}>
                                                                        <label className="block text-xs mb-1 text-green-400 uppercase">{lang} Code</label>
                                                                        <textarea
                                                                            value={q.codeSnippets[lang]}
                                                                            onChange={(e) => updateCodeSnippet(qIndex, lang, e.target.value)}
                                                                            className="w-full px-4 py-2 bg-[#1e1e1e] border border-green-500/30 rounded-lg text-green-300 font-mono text-sm min-h-[150px] focus:border-green-500"
                                                                            placeholder={`Enter boilerplate for ${lang}...`}
                                                                            required
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <textarea
                                                                value={q.explanation}
                                                                onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                                                className="w-full px-4 py-2 bg-black/40 border border-green-500/20 rounded-lg text-white text-sm focus:border-green-500"
                                                                placeholder="Explanation..."
                                                                required
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-green-500/20">
                                        <button type="submit" disabled={actionLoading} className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-mono font-bold flex justify-center items-center gap-2">
                                            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : (editingContestId ? 'UPDATE' : 'DEPLOY CONTEST')}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Announcement Modal */}
                <AnimatePresence>
                    {showAnnouncementModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-gray-900 border border-blue-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Megaphone className="text-blue-500" /> Post Announcement</h2>
                                    <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        value={announcementForm.title}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/40 border border-blue-500/20 rounded-lg text-white text-sm focus:border-blue-500"
                                        required placeholder="Announcement Title"
                                    />
                                    <textarea
                                        value={announcementForm.content}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/40 border border-blue-500/20 rounded-lg text-white text-sm min-h-[100px] focus:border-blue-500"
                                        required placeholder="Content details..."
                                    />
                                    <input
                                        type="text"
                                        value={announcementForm.attachmentUrl}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, attachmentUrl: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/40 border border-blue-500/20 rounded-lg text-white text-sm focus:border-blue-500"
                                        placeholder="Attachment Link (Optional URLs like Drive/Docs)"
                                    />
                                    <button type="submit" disabled={actionLoading} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex justify-center mt-4">
                                        {actionLoading ? <Loader2 className="animate-spin" size={18} /> : 'Post Announcement'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
