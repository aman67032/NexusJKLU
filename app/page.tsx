'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Building2, MessageSquare, Bus, FileText, PartyPopper, ArrowRight, Sparkles } from 'lucide-react';

const modules = [
  {
    title: 'Learning Portal',
    description: 'Access exam papers, quizzes, coding challenges, and academic resources.',
    icon: BookOpen,
    href: '/learn',
    color: 'var(--learn-color)',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    cardClass: 'module-card-learn',
    status: 'Live',
  },
  {
    title: 'Council & Clubs',
    description: 'Explore councils, join clubs, register for events, and earn certificates.',
    icon: Building2,
    href: '/council',
    color: 'var(--council-color)',
    gradient: 'from-orange-500/20 to-orange-600/5',
    cardClass: 'module-card-council',
    status: 'Live',
  },
  {
    title: 'CampusVoice',
    description: 'Submit anonymous complaints, raise issues, and make your voice heard.',
    icon: MessageSquare,
    href: '/voice',
    color: 'var(--voice-color)',
    gradient: 'from-violet-500/20 to-violet-600/5',
    cardClass: 'module-card-voice',
    status: 'Live',
  },
  {
    title: 'Bus Transport',
    description: 'Shuttle schedules, live tracking, and route information.',
    icon: Bus,
    href: '#',
    color: 'var(--transport-color)',
    gradient: 'from-amber-500/20 to-amber-600/5',
    cardClass: '',
    status: 'Coming Soon',
  },
  {
    title: 'Student Portfolio',
    description: 'Build your profile, manage resumes, and prepare for placements.',
    icon: FileText,
    href: '#',
    color: 'var(--portfolio-color)',
    gradient: 'from-pink-500/20 to-pink-600/5',
    cardClass: '',
    status: 'Coming Soon',
  },
  {
    title: 'Fests & Functions',
    description: 'All fests, cultural events, and campus function details in one place.',
    icon: PartyPopper,
    href: '#',
    color: '#06B6D4',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    cardClass: '',
    status: 'Coming Soon',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="glow-orb w-[600px] h-[600px] -top-64 -right-64 bg-[var(--primary)]" style={{ opacity: 0.08 }} />
      <div className="glow-orb w-[500px] h-[500px] -bottom-48 -left-48 bg-[var(--secondary)]" style={{ opacity: 0.06 }} />
      <div className="glow-orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)]" style={{ opacity: 0.04 }} />

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center mb-6">
              <img src="/white_jklu_logo.png" alt="JKLU Logo" className="w-20 h-20 md:w-28 md:h-28 mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
              <div className="px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Unified Campus Platform
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
              <span className="gradient-text-orange">Nexus</span>
              <span className="text-white">JKLU</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-4">
              Everything JKLU — academics, events, clubs, and campus life — unified in one powerful platform.
            </p>

            <p className="text-sm text-white/30 max-w-lg mx-auto">
              JK Lakshmipat University • Council of Technical Affairs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module Grid */}
      <section className="relative z-10 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {modules.map((module) => {
              const Icon = module.icon;
              const isLive = module.status === 'Live';

              return (
                <motion.div key={module.title} variants={itemVariants}>
                  {isLive ? (
                    <Link href={module.href} className="block">
                      <ModuleCard module={module} Icon={Icon} isLive={isLive} />
                    </Link>
                  ) : (
                    <div className="cursor-default opacity-60">
                      <ModuleCard module={module} Icon={Icon} isLive={isLive} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} NexusJKLU • JK Lakshmipat University • Council of Technical Affairs
          </p>
        </div>
      </footer>
    </div>
  );
}

function ModuleCard({ module, Icon, isLive }: { module: typeof modules[0]; Icon: any; isLive: boolean }) {
  return (
    <div className={`glass-card p-6 h-full relative overflow-hidden group ${module.cardClass}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${module.color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: module.color }} />
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isLive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-white/5 text-white/30 border border-white/10'
              }`}
          >
            {module.status}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
          {module.title}
        </h3>
        <p className="text-sm text-white/40 leading-relaxed mb-4">
          {module.description}
        </p>

        {/* Action */}
        {isLive && (
          <div className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ color: module.color }}>
            Explore
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
}
