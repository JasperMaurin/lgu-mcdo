import { useState } from 'react';
import { motion } from 'framer-motion';
import mailynImg from '../../Images/Mailyn Quiblat.jpg';
import darlineImg from '../../Images/Darline Yasay.jpg';
import jasperImg from '../../Images/Jasper Maurin.jpg';
import {
    ArrowRightIcon,
    ChevronDownIcon,
    UsersIcon,
    ArrowDownIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon,
    BanknotesIcon,
    CheckCircleIcon,
    BuildingLibraryIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import SectionHeading from '../Components/Public/SectionHeading';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SERVICES = [
    {
        id: 'reg',
        icon: DocumentTextIcon,
        title: 'Registration & Renewal',
        desc: 'Guided assistance for registering new cooperatives and renewing certificates of good standing.',
        badge: 'Mandatory',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-600 text-white',
        accent: 'blue',
        points: [
            'New cooperative documentation and validation',
            'Certificate of Good Standing renewals',
            'Bylaws and article amendments guidance',
        ],
    },
    {
        id: 'comp',
        icon: ShieldCheckIcon,
        title: 'Compliance & Monitoring',
        desc: 'Reportorial tracking and governance support to help cooperatives stay compliant year-round.',
        badge: 'Governance',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-200 dark:border-red-800',
        iconBg: 'bg-red-600 text-white',
        accent: 'red',
        points: [
            'Annual mandatory reportorial compliance',
            'Governance audits and record evaluations',
            'Early warning compliance advisory',
        ],
    },
    {
        id: 'cap',
        icon: BuildingOfficeIcon,
        title: 'Capacity Building',
        desc: 'Workshops on leadership, bookkeeping, and cooperative principles for officers and members.',
        badge: 'Education',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        iconBg: 'bg-amber-600 text-white',
        accent: 'amber',
        points: [
            'Leadership and officers training series',
            'Bookkeeping and financial recording seminars',
            'Member empowerment and cooperative principles',
        ],
    },
    {
        id: 'fin',
        icon: BanknotesIcon,
        title: 'Financial Advisory',
        desc: 'Guidance on savings mobilization, lending policy, and sustainable financial planning.',
        badge: 'Finance',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        iconBg: 'bg-indigo-600 text-white',
        accent: 'indigo',
        points: [
            'Savings mobilization strategies',
            'Lending policies and credit risk management',
            'Long-term capital sustainability planning',
        ],
    },
];

const TEAM = [
    {
        name: 'Mailyn Quiblat',
        role: 'MCDO Designate',
        img: mailynImg,
        fallback: 'Mailyn+Quiblat&background=1d4ed8',
        featured: true,
        duties: [
            'Oversees cooperative development programs',
            'Implements municipal cooperative policies',
            'Coordinates with local government units',
            'Monitors cooperative compliance',
        ],
    },
    {
        name: 'Darline Yasay',
        role: 'MCDO Staff',
        img: darlineImg,
        fallback: 'Darline+Yasay&background=EF4444',
        featured: false,
        duties: [
            'Handles daily office operations',
            'Assists cooperative registrations',
            'Maintains cooperative records',
            'Provides member assistance',
        ],
    },
    {
        name: 'Jasper Maurin',
        role: 'MCDO IT Staff',
        img: jasperImg,
        fallback: 'Jasper+Maurin&background=64748B',
        featured: false,
        duties: [
            'Maintains system infrastructure',
            'Provides technical support',
            'Manages database operations',
            'Ensures data security',
        ],
    },
];

const HIGHLIGHTS = [
    {
        icon: BuildingLibraryIcon,
        title: 'Municipal LGU Oversight',
        desc: 'Direct backing and institutional support from the Local Government of Opol.',
        tag: 'LGU Mandate',
    },
    {
        icon: ClipboardDocumentCheckIcon,
        title: 'CDA Regulatory Alignment',
        desc: 'Ensuring seamless compliance reporting and legal standing for all local co-ops.',
        tag: 'Compliance',
    },
    {
        icon: UsersIcon,
        title: '14 Barangays United',
        desc: 'Empowering agriculture, transport, market vendors, and credit unions.',
        tag: 'Community',
    },
];

export default function AuthLanding() {
    const reducedMotion = useReducedMotion();
    const [activeServiceId, setActiveServiceId] = useState('reg');
    const activeService = SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];

    const leader = TEAM.find((m) => m.featured) || TEAM[0];
    const staffMembers = TEAM.filter((m) => !m.featured);

    return (
        <PublicLayout activePage="home">
            {/* ── 1. Hero Section (Editorial Asymmetric Layout) ── */}
            <section className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-16 lg:pb-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left Column: Headline & Action Bar */}
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="lg:col-span-7"
                    >
                        {/* Municipal Authority Badge */}
                        <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full shadow-sm mb-6">
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                Office of the Local Government of Opol
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                                Misamis Oriental
                            </span>
                        </div>

                        <h1 className="font-outfit text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                            Building Stronger{' '}
                            <span className="text-blue-600 dark:text-blue-400">Cooperatives</span>{' '}
                            Together
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
                            The Municipal Cooperative Development Office equips Opol's cooperatives with registration
                            support, compliance monitoring, and financial guidance — all through one streamlined management
                            system.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
                            <a
                                href="/login"
                                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <span>Access Portal</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="/contact?subject=pre-registration-seminar"
                                className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <span>Request Pre-Registration Seminar</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                            >
                                <span>Explore Services</span>
                                <ChevronDownIcon className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        {/* Solid Metric Strip */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-2 border-t-blue-600 rounded-xl p-3 sm:p-4 text-center">
                                <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">14</p>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Barangays served</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-2 border-t-red-600 rounded-xl p-3 sm:p-4 text-center">
                                <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">4</p>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Core programs</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-2 border-t-blue-600 rounded-xl p-3 sm:p-4 text-center">
                                <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">1</p>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Digital portal</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Leadership & Operations Preview Card */}
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                            {/* Card Header Strip */}
                            <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b-2 border-blue-600">
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4 text-red-500" />
                                    <h2 className="font-outfit text-xs font-extrabold uppercase tracking-wider text-white">
                                        Office Leadership
                                    </h2>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Official LGU Portal
                                </span>
                            </div>

                            {/* Leader Photo & Profile */}
                            <div className="p-6 sm:p-7">
                                <div className="flex flex-col sm:flex-row items-center gap-5 mb-6">
                                    <div className="w-28 h-36 shrink-0 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                                        <img
                                            src={leader.img}
                                            alt={leader.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${leader.fallback}&color=fff`;
                                            }}
                                        />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded border border-red-200 dark:border-red-900 mb-2">
                                            {leader.role}
                                        </span>
                                        <h3 className="font-outfit font-extrabold text-xl text-slate-900 dark:text-white">
                                            {leader.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            Leading municipal cooperative development policies and public services in Opol.
                                        </p>
                                    </div>
                                </div>

                                {/* Leadership Highlights / Quick Badges */}
                                <div className="space-y-2 mb-6 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                                        <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                        <span>Oversees municipal cooperative programs</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                                        <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                        <span>Coordinates LGU compliance & certifications</span>
                                    </div>
                                </div>

                                {/* Quick Municipal Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center">
                                        <p className="font-outfit font-extrabold text-base text-slate-900 dark:text-white">{TEAM.length}</p>
                                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Staff members</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center">
                                        <p className="font-outfit font-extrabold text-base text-slate-900 dark:text-white">Opol</p>
                                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Misamis Oriental</p>
                                    </div>
                                </div>

                                <a
                                    href="#team"
                                    className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
                                >
                                    <span>Meet the full team</span>
                                    <ArrowDownIcon className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 2. Municipal Value Highlights Strip ── */}
            <section className="px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {HIGHLIGHTS.map(({ icon: Icon, title, desc, tag }) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-outfit font-bold text-base text-slate-900 dark:text-white">
                                            {title}
                                        </h3>
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {tag}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. Services Section (Asymmetric Modern Feature Grid) ── */}
            <section id="services" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="max-w-3xl mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-950/70 border border-red-200 dark:border-red-800 px-3 py-1 rounded-full mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-300">
                                What We Do
                            </span>
                        </div>
                        <h2 className="font-outfit text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Everything a cooperative needs, in one office
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                            From first-time registration to long-term financial health, MCDO Opol supports cooperatives
                            at every stage of their growth.
                        </p>
                    </AnimatedSection>

                    {/* Interactive Asymmetric Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Featured Spotlight Card */}
                        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-600 shadow-md p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-5">
                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${activeService.badgeColor}`}>
                                    {activeService.badge}
                                </span>
                                <span className="text-xs font-bold uppercase text-slate-400">Featured Service</span>
                            </div>

                            <div className={`w-14 h-14 rounded-xl ${activeService.iconBg} flex items-center justify-center mb-5 shadow-sm`}>
                                <activeService.icon className="w-7 h-7" />
                            </div>

                            <h3 className="font-outfit font-extrabold text-2xl text-slate-900 dark:text-white mb-3">
                                {activeService.title}
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                {activeService.desc}
                            </p>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mb-6">
                                <h4 className="font-outfit font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                                    Key Capabilities:
                                </h4>
                                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                    {activeService.points.map((pt) => (
                                        <li key={pt} className="flex items-start gap-2.5">
                                            <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a
                                href="/login"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-200"
                            >
                                <span>Access Portal for Service</span>
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        {/* 3 Interactive Service Grid Cards */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SERVICES.map((srv) => {
                                const isSelected = srv.id === activeServiceId;
                                const SrvIcon = srv.icon;
                                return (
                                    <div
                                        key={srv.id}
                                        onClick={() => setActiveServiceId(srv.id)}
                                        className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-200 border-2 ${
                                            isSelected
                                                ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-600 shadow-sm'
                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl ${srv.iconBg} flex items-center justify-center`}>
                                                <SrvIcon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${srv.badgeColor}`}>
                                                {srv.badge}
                                            </span>
                                        </div>
                                        <h4 className="font-outfit font-bold text-base text-slate-900 dark:text-white mb-1.5">
                                            {srv.title}
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
                                            {srv.desc}
                                        </p>
                                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                                            {isSelected ? 'Currently Viewing' : 'Click to view details'}
                                            <ArrowRightIcon className="w-3 h-3" />
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. Team & Organizational Structure Section ── */}
            <section id="team" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 bg-slate-50/60 dark:bg-[#070b14] border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="max-w-2xl mb-12 sm:mb-16">
                        <SectionHeading
                            eyebrow="Our Team"
                            title="Organizational Structure"
                            description="Fostering growth, collaboration, and financial sustainability across Opol, Misamis Oriental through a dedicated municipal team."
                        />
                    </AnimatedSection>

                    {/* Executive Leader Spotlight Card */}
                    <AnimatedSection className="mb-10">
                        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 border-t-4 border-t-blue-600 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                                <div className="w-32 sm:w-36 h-44 shrink-0 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                                    <img
                                        src={leader.img}
                                        alt={leader.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${leader.fallback}&color=fff`;
                                        }}
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                                            {leader.role}
                                        </span>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                                            Head of Office
                                        </span>
                                    </div>
                                    <h3 className="font-outfit font-extrabold text-2xl text-slate-900 dark:text-white mb-2">
                                        {leader.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                                        Oversees the execution of municipal cooperative development programs and enforces
                                        regulatory compliance across all cooperatives in Opol, Misamis Oriental.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                        {leader.duties.map((duty) => (
                                            <div key={duty} className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                                                <span>{duty}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Staff Directory Grid (2-Column Balanced Layout) */}
                    <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
                        {staffMembers.map((member) => (
                            <AnimatedItem key={member.name}>
                                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 border-t-3 border-t-red-600 rounded-2xl p-5 sm:p-6 flex flex-col h-full shadow-sm hover:border-blue-600 transition-all duration-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                                            <img
                                                src={member.img}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${member.fallback}&color=fff`;
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 mb-1">
                                                {member.role}
                                            </span>
                                            <h4 className="font-outfit font-extrabold text-base text-slate-900 dark:text-white">
                                                {member.name}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-3">
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                                            Responsibilities:
                                        </p>
                                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                            {member.duties.map((duty) => (
                                                <li key={duty} className="flex items-start gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-red-600 shrink-0 mt-1.5" />
                                                    <span>{duty}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </AnimatedItem>
                        ))}
                    </AnimatedGrid>
                </div>
            </section>

            {/* ── 5. Call To Action ── */}
            <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
                <div className="max-w-7xl mx-auto">
                    <CtaBanner
                        title="Ready to manage your cooperative online?"
                        description="Sign in to the portal to track compliance, submit reports, and stay connected with MCDO Opol."
                        primaryHref="/login"
                        primaryLabel="Access Portal"
                        secondaryHref="/contact"
                        secondaryLabel="Contact the Office"
                    />
                </div>
            </section>
        </PublicLayout>
    );
}
