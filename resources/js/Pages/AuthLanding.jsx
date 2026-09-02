import { useState } from 'react';
import { motion } from 'framer-motion';
import mailynImg from '../../Images/Mailyn Quiblat.jpg';
import darlineImg from '../../Images/Darline Yasay.jpg';
import merlynImg from '../../Images/merlyn.jpg';
import jasperImg from '../../Images/Jasper Maurin.jpg';
import mcdoLogo from '../../Images/mcdologs.jpg';
import bagOngOpol from '../../Images/bag-ong opol.jpg';
import {
    ArrowRightIcon,
    ChevronDownIcon,
    UsersIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon,
    BuildingOffice2Icon,
    BanknotesIcon,
    CheckCircleIcon,
    BuildingLibraryIcon,
    ClipboardDocumentCheckIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
    MapPinIcon,
    ClockIcon,
    CheckBadgeIcon,
    AcademicCapIcon,
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
        title: 'Registration & PMES',
        desc: 'Comprehensive guidance for organizing new cooperatives, pre-registration PMES orientation, and securing official CDA registration.',
        badge: 'Formation',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-600 text-white',
        accent: 'blue',
        points: [
            'Pre-Membership Education Seminars (PMES) facilitation',
            'Articles of Cooperation & Bylaws drafting assistance',
            'Official CDA endorsement & local registration support',
        ],
    },
    {
        id: 'comp',
        icon: ShieldCheckIcon,
        title: 'Compliance & Governance',
        desc: 'Statutory compliance tracking and governance advisory to help cooperatives sustain Certificate of Compliance (COC) standing.',
        badge: 'Compliance',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-200 dark:border-red-800',
        iconBg: 'bg-red-600 text-white',
        accent: 'red',
        points: [
            'Annual mandatory CAPR & AFS reportorial intake',
            'Governance audits, social & performance assessments',
            'Early alert advisory for regulatory deadlines',
        ],
    },
    {
        id: 'cap',
        icon: BuildingOfficeIcon,
        title: 'Capacity Building & Training',
        desc: 'Specialized education modules covering cooperative leadership, internal audit, basic bookkeeping, and ethical management.',
        badge: 'Education',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        iconBg: 'bg-amber-600 text-white',
        accent: 'amber',
        points: [
            'Mandatory training for cooperative officers and staff',
            'Financial management and accounting workshops',
            'Strategic business planning and enterprise growth',
        ],
    },
    {
        id: 'fin',
        icon: BanknotesIcon,
        title: 'Market Linkages & Advisory',
        desc: 'Connecting grassroots cooperatives to provincial financing windows, national agency programs, and institutional trade partnerships.',
        badge: 'Enterprise',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        iconBg: 'bg-indigo-600 text-white',
        accent: 'indigo',
        points: [
            'Inter-agency convergence with CDA, DTI, DA, and DOLE',
            'Livelihood grant access and savings mobilization',
            'Municipal enterprise fair participation and market promotion',
        ],
    },
];

const TEAM = [
    {
        name: 'Mailyn Quiblat',
        role: 'MCDO Designate',
        img: mailynImg,
        fallback: 'Mailyn+Quiblat&background=1d4ed8',
        tag: 'Office Head',
        featured: true,
        desc: 'Leads municipal cooperative development programs, inter-agency partnerships with CDA, and strategic policy implementation across Opol.',
        duties: [
            'Oversees cooperative development programs & municipal mandates',
            'Implements LGU cooperative policies under Ordinance No. 2025-03A',
            'Coordinates with national agencies (CDA, DTI, DA, DOST, DOLE)',
            'Monitors regulatory compliance and evaluates cooperative performance',
        ],
    },
    {
        name: 'Darline Yasay',
        role: 'MCDO Staff',
        img: darlineImg,
        fallback: 'Darline+Yasay&background=EF4444',
        tag: 'Operations & Records',
        featured: false,
        desc: 'Facilitates cooperative registrations, membership assistance, annual compliance document intake, and day-to-day office coordination.',
        duties: [
            'Handles daily office operations and client intake',
            'Assists in cooperative registrations and PMES scheduling',
            'Maintains official cooperative records and compliance archives',
            'Provides direct front-desk member and officer assistance',
        ],
    },
    {
        name: 'Merlyn Maandig',
        role: 'MCDO Staff',
        img: merlynImg,
        fallback: 'Merlyn+Maandig&background=059669',
        tag: 'Operations & Field Support',
        featured: false,
        desc: 'Assists in cooperative monitoring, community outreach, frontline public inquiries, and administrative support services.',
        duties: [
            'Assists in cooperative field monitoring and community outreach',
            'Supports grassroots cooperative organizing across 14 barangays',
            'Handles public inquiries and seminar participant registration',
            'Provides administrative and document management support',
        ],
    },
    {
        name: 'Jasper Maurin',
        role: 'MCDO IT Staff',
        img: jasperImg,
        fallback: 'Jasper+Maurin&background=64748B',
        tag: 'Systems & Technical',
        featured: false,
        desc: 'Manages the MCDO digital portal infrastructure, database records, report automation, and IT technical support for cooperatives.',
        duties: [
            'Maintains digital portal infrastructure and database systems',
            'Provides technical support for cooperative administrators',
            'Automates compliance tracking and statistical report generation',
            'Ensures system reliability, backups, and data security standards',
        ],
    },
];

const HIGHLIGHTS = [
    {
        icon: BuildingLibraryIcon,
        title: 'Municipal LGU Mandate',
        desc: 'Backed by the Local Government of Opol under Municipal Ordinance No. 2025-03A and RA 7160.',
        tag: 'LGU Mandate',
        accent: 'blue',
    },
    {
        icon: ClipboardDocumentCheckIcon,
        title: 'CDA Regulatory Alignment',
        desc: 'Synchronized with Cooperative Development Authority guidelines under RA 9520 and RA 11364.',
        tag: 'Compliance',
        accent: 'red',
    },
    {
        icon: UsersIcon,
        title: '14 Barangays United',
        desc: 'Direct field support for agriculture, fisherfolk, transport, credit, and community cooperatives.',
        tag: 'Community',
        accent: 'amber',
    },
];

const PORTAL_QUICK_ACTIONS = [
    {
        title: 'Cooperative Directory',
        desc: 'Explore active cooperatives registered in Opol',
        href: '/cooperatives',
        icon: BuildingOffice2Icon,
        badge: 'Directory',
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
    },
    {
        title: 'Pre-Registration (PMES)',
        desc: 'Request mandatory PMES orientation seminar',
        href: '/contact?subject=pre-registration-seminar',
        icon: AcademicCapIcon,
        badge: 'Free Seminar',
        color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60',
    },
    {
        title: 'Programs & Services',
        desc: 'Capacity building, training, and compliance aid',
        href: '/services',
        icon: SparklesIcon,
        badge: 'Services',
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
    {
        title: 'Official Inquiries',
        desc: 'Direct consultation with MCDO officers',
        href: '/contact',
        icon: DocumentTextIcon,
        badge: 'Assistance',
        color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
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
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                {/* ══════════════════════════════════════════════════════════
                    SECTION 1: HERO SECTION (EDITORIAL ASYMMETRIC LAYOUT)
                   ══════════════════════════════════════════════════════════ */}
                <section className="scroll-mt-24 mb-20 sm:mb-28 pt-2 sm:pt-4">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                        {/* Left Column: Headline & Action Bar */}
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="lg:col-span-7"
                        >
                            {/* Municipal Authority Badge */}
                            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-1.5 rounded-full shadow-sm mb-6">
                                <span className="w-2 h-2 rounded-full bg-red-600" />
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    Local Government Unit of Opol
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
                                The Municipal Cooperative Development Office (MCDO) equips Opol's cooperatives with registration
                                support, compliance monitoring, and capacity-building programs — all coordinated through one streamlined management portal.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
                                <a
                                    href="/login"
                                    className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 text-xs uppercase tracking-wider"
                                >
                                    <span>Access Portal</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="/contact?subject=pre-registration-seminar"
                                    className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 text-xs uppercase tracking-wider"
                                >
                                    <span>Request PMES Seminar</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="#services"
                                    className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-xs uppercase tracking-wider shadow-sm"
                                >
                                    <span>Explore Services</span>
                                    <ChevronDownIcon className="w-3.5 h-3.5" />
                                </a>
                            </div>

                            {/* Solid Metric Strip */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200/80 dark:border-slate-800 pt-6">
                                <div className="public-card public-card-accent p-3 sm:p-4 text-center" data-accent="blue">
                                    <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">14</p>
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Barangays Served</p>
                                </div>
                                <div className="public-card public-card-accent p-3 sm:p-4 text-center" data-accent="red">
                                    <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">4</p>
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Core Programs</p>
                                </div>
                                <div className="public-card public-card-accent p-3 sm:p-4 text-center" data-accent="blue">
                                    <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">100%</p>
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Free Consultation</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Municipal Digital Gateway & Quick Action Hub */}
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                            className="lg:col-span-5"
                        >
                            <div className="public-card public-card-accent shadow-md overflow-hidden" data-accent="blue">
                                {/* Card Header Strip */}
                                <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <BuildingOffice2Icon className="w-4 h-4 text-red-500" />
                                        <h2 className="font-outfit text-xs font-extrabold uppercase tracking-wider text-white">
                                            MCDO Digital Gateway
                                        </h2>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded border border-blue-700/60">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Official LGU Portal
                                    </span>
                                </div>

                                {/* Gateway Overview Content */}
                                <div className="p-6 sm:p-7">
                                    {/* Office Identity Banner */}
                                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-14 h-14 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center justify-center">
                                            <img src={mcdoLogo} alt="MCDO Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                                                Municipal Cooperative Development Office
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                Municipal Hall, Poblacion, Opol, Misamis Oriental
                                            </p>
                                        </div>
                                    </div>

                                    {/* 4 Portal Quick Actions */}
                                    <div className="space-y-2.5 mb-6">
                                        {PORTAL_QUICK_ACTIONS.map(({ title, desc, href, icon: Icon, badge, color }) => (
                                            <a
                                                key={title}
                                                href={href}
                                                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-700/60 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-outfit font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                            {title}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                            {desc}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shrink-0 ml-2 group-hover:border-blue-400 transition-colors">
                                                    {badge}
                                                </span>
                                            </a>
                                        ))}
                                    </div>

                                    {/* Bottom Schedule & Status Strip */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <ClockIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span>Mon–Fri • 8:00 AM – 5:00 PM</span>
                                        </div>
                                        <a
                                            href="/login"
                                            className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline inline-flex items-center gap-1 uppercase tracking-wider text-[11px]"
                                        >
                                            <span>Sign In</span>
                                            <ArrowRightIcon className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 2: MUNICIPAL VALUE HIGHLIGHTS STRIP
                   ══════════════════════════════════════════════════════════ */}
                <AnimatedSection className="max-w-7xl mx-auto mb-20 sm:mb-28">
                    <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                        {HIGHLIGHTS.map(({ icon: Icon, title, desc, tag, accent }) => (
                            <AnimatedItem key={title}>
                                <article className="public-card public-card-accent p-6 h-full flex flex-col justify-between" data-accent={accent}>
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                                                {tag}
                                            </span>
                                        </div>
                                        <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white mb-2">
                                            {title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
                                </article>
                            </AnimatedItem>
                        ))}
                    </AnimatedGrid>
                </AnimatedSection>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 3: SERVICES SHOWCASE (ASYMMETRIC INTERACTIVE GRID)
                   ══════════════════════════════════════════════════════════ */}
                <section id="services" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-7xl mx-auto">
                        <SectionHeading
                            eyebrow="What We Do"
                            title="Core Programs & Services"
                            description="From initial formation to long-term financial health, MCDO Opol supports cooperatives at every stage of their growth."
                        />

                        {/* Interactive Asymmetric Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                            {/* Featured Spotlight Card */}
                            <div className="lg:col-span-5 public-card public-card-accent p-6 sm:p-8" data-accent={activeService.accent}>
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

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mb-6">
                                    <h4 className="font-outfit font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                                        Key Capabilities:
                                    </h4>
                                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                                        {activeService.points.map((pt) => (
                                            <li key={pt} className="flex items-start gap-2.5">
                                                <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                                <span className="leading-snug">{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="/services"
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm"
                                    >
                                        <span>View All Services</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                    </a>
                                    <a
                                        href="/contact"
                                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-200 border border-slate-200/80 dark:border-slate-700/60"
                                    >
                                        <span>Inquire Now</span>
                                    </a>
                                </div>
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
                                            className={`cursor-pointer public-card public-card-left-accent p-5 sm:p-6 transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-sm'
                                                    : 'hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                            data-accent={srv.accent}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-10 h-10 rounded-xl ${srv.iconBg} flex items-center justify-center shadow-sm`}>
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
                                                {isSelected ? 'Selected' : 'Click to view details'}
                                                <ArrowRightIcon className="w-3 h-3" />
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 4: TEAM & ORGANIZATIONAL STRUCTURE
                   ══════════════════════════════════════════════════════════ */}
                <section id="team" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-7xl mx-auto">
                        <SectionHeading
                            eyebrow="Our Frontline Personnel"
                            title="MCDO Dedicated Team"
                            description="Fostering cooperative development, good governance, and inclusive economic growth across the 14 barangays of Opol."
                        />

                        {/* Executive Leader Spotlight Card */}
                        <AnimatedSection className="mb-8">
                            <div className="public-card public-card-accent p-6 sm:p-8 max-w-4xl mx-auto shadow-sm" data-accent="blue">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                                    <div className="w-32 sm:w-36 h-44 shrink-0 rounded-2xl overflow-hidden public-photo-frame border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                                        <img
                                            src={leader.img}
                                            alt={leader.name}
                                            className="w-full h-full object-cover object-top"
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
                                            {leader.desc}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
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

                        {/* Staff Directory Grid (3-Column Balanced Layout) */}
                        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                            {staffMembers.map((member) => (
                                <AnimatedItem key={member.name}>
                                    <div className="public-card public-card-accent p-5 sm:p-6 flex flex-col h-full shadow-sm hover:border-blue-600 transition-all duration-200" data-accent={member.role.includes('IT') ? 'indigo' : member.name.includes('Merlyn') ? 'emerald' : 'red'}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-20 shrink-0 rounded-xl overflow-hidden public-photo-frame border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${member.fallback}&color=fff`;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/60 mb-1">
                                                    {member.role}
                                                </span>
                                                <h4 className="font-outfit font-extrabold text-base text-slate-900 dark:text-white">
                                                    {member.name}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 block font-semibold">{member.tag}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-3">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                                                Responsibilities:
                                            </p>
                                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                                {member.duties.map((duty) => (
                                                    <li key={duty} className="flex items-start gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-red-600 shrink-0 mt-1.5" />
                                                        <span className="leading-snug">{duty}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </AnimatedItem>
                            ))}
                        </AnimatedGrid>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 5: STRATEGIC VISION & LGU OPOL ALIGNMENT
                   ══════════════════════════════════════════════════════════ */}
                <AnimatedSection className="max-w-6xl mx-auto mb-20 sm:mb-28">
                    <div className="public-card public-card-accent overflow-hidden" data-accent="red">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
                            <div className="lg:col-span-7 space-y-4">
                                <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 px-3 py-1 rounded-full text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                                    <span>Municipal Strategic Vision</span>
                                </div>
                                <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    "Bag-ong Opol: A Vibrant, Inclusive, Smart, Eco-Town Where Sustainability Meets Innovation"
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                    The Municipal Cooperative Development Office aligns its programs with the municipal development pillars of <strong className="text-slate-900 dark:text-white font-semibold">Social, Economic, Infrastructure, Environment, and Institutional Governance</strong> to build a progressive, resilient cooperative movement across Opol.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-3">
                                    <a
                                        href="/about#about-opol"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all duration-200"
                                    >
                                        <span>Learn About Opol</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                    </a>
                                    <a
                                        href="/cooperatives"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 border border-slate-200/80 dark:border-slate-700/60"
                                    >
                                        <span>View 14 Barangays Directory</span>
                                    </a>
                                </div>
                            </div>
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60 shadow-lg bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={bagOngOpol}
                                        alt="Bag-ong Opol"
                                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 6: CALL TO ACTION
                   ══════════════════════════════════════════════════════════ */}
                <CtaBanner
                    title="Ready to manage or register your cooperative in Opol?"
                    description="Sign in to the digital portal or visit the Municipal Cooperative Development Office at the Municipal Hall, Poblacion, Opol."
                    primaryHref="/login"
                    primaryLabel="Access Portal"
                    secondaryHref="/contact?subject=pre-registration-seminar"
                    secondaryLabel="Request PMES Seminar"
                />
            </main>
        </PublicLayout>
    );
}
