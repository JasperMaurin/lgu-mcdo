import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AcademicCapIcon,
    DocumentCheckIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    CalculatorIcon,
    UsersIcon,
    BanknotesIcon,
    BuildingStorefrontIcon,
    BuildingLibraryIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    CheckIcon,
    ArrowRightIcon,
    ClockIcon,
    CurrencyDollarIcon,
    InformationCircleIcon,
    CalendarDaysIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import SectionHeading from '../Components/Public/SectionHeading';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ── 8 Comprehensive MCDO Frontline Services ──
const MCDO_SERVICES = [
    {
        id: 'pmes',
        title: 'Pre-Membership Education Seminar (PMES)',
        shortTitle: 'PMES Training',
        category: 'organization',
        categoryLabel: 'Organization & Formation',
        desc: 'Foundational training module on cooperative principles, member rights, financial responsibilities, and legal structures required for all prospective cooperative organizers in Opol.',
        icon: AcademicCapIcon,
        accent: 'blue',
        solidBg: 'bg-blue-600',
        processingTime: 'Half-Day Seminar (4 Hours)',
        fee: '100% Free Public Service',
        beneficiaries: 'Founding Members (Min. 15 pax), Community Groups, Micro-Entrepreneurs',
        legalBasis: 'Republic Act No. 9520 & CDA Memorandum Circulars',
        requirements: [
            'Letter of Request addressed to the Municipal Mayor / MCDO Officer',
            'List of at least 15 prospective founding members with contact details',
            'Designated venue or attendance at Municipal Hall Training Hall',
            'Valid ID of principal organizers / interim officers',
        ],
        steps: [
            'Submit request letter and member roster to MCDO or via online inquiry.',
            'Coordinate with the assigned MCDO training officer for schedule confirmation.',
            'Conduct the 4-hour interactive PMES module covering co-op values and laws.',
            'Receive official Certificate of PMES Completion for CDA submission.',
        ],
        tags: ['Founding', 'Orientation', 'CDA Requirement'],
    },
    {
        id: 'registration',
        title: 'New Cooperative Registration & CDA Endorsement',
        shortTitle: 'Registration & Endorsement',
        category: 'organization',
        categoryLabel: 'Organization & Formation',
        desc: 'Technical assistance in drafting, validating, and endorsing Articles of Cooperation, By-Laws, and Economic Survey for official accreditation with CDA Region X.',
        icon: DocumentCheckIcon,
        accent: 'emerald',
        solidBg: 'bg-emerald-600',
        processingTime: '2–3 Working Days (Document Review)',
        fee: 'Free LGU Assistance (CDA statutory fees apply separately)',
        beneficiaries: 'Newly formed cooperatives, Agrarian associations, Transport groups',
        legalBasis: 'RA 9520 (Philippine Cooperative Code) & Municipal Ordinance No. 2025-03A',
        requirements: [
            'Four (4) signed copies of Articles of Cooperation & By-Laws',
            'Economic Survey with 3-year operational & financial feasibility plan',
            'Treasurer’s Affidavit & proof of minimum paid-up share capital',
            'Certificates of PMES Completion of all founding cooperators',
            'Clearance / Endorsement from Barangay of primary operations',
        ],
        steps: [
            'Submit complete draft constitution and bylaws to MCDO for technical review.',
            'Undergo consultation and formatting verification with MCDO technical staff.',
            'Receive official MCDO Letter of Endorsement to CDA Region X Extension Office.',
            'Assist during CDA online e-Coop registration submission.',
        ],
        tags: ['Registration', 'Articles of Co-op', 'CDA Endorsement'],
    },
    {
        id: 'capr',
        title: 'Mandatory Annual Reportorial Compliance (CAPR & AFS)',
        shortTitle: 'Annual Reporting (CAPR)',
        category: 'governance',
        categoryLabel: 'Governance & Regulatory',
        desc: 'Assistance in the preparation, verification, and submission of the Cooperative Annual Progress Report (CAPR), Audited Financial Statements, and Social Audit reports.',
        icon: ChartBarIcon,
        accent: 'red',
        solidBg: 'bg-red-600',
        processingTime: '1–2 Working Days per audit review',
        fee: '100% Free Public Service',
        beneficiaries: 'All registered operating cooperatives within the Municipality of Opol',
        legalBasis: 'CDA MC No. 2022-07 & RA 9520 Mandatory Reportorial Guidelines',
        requirements: [
            'Accomplished CAPR forms (Management, Social, & Performance modules)',
            'Audited Financial Statements (AFS) signed by an accredited CPA',
            'List of current Board of Directors and Committee Officers',
            'Minutes of the Annual General Assembly Meeting',
        ],
        steps: [
            'Provide draft CAPR and audited financials to MCDO prior to April 30 annual deadline.',
            'MCDO performs compliance review and cross-checks performance ratios.',
            'Issue compliance endorsement and guidance for CDA Electronic Web Filing.',
            'File copy with MCDO Local Database to maintain Good Standing certificate.',
        ],
        tags: ['CAPR', 'Annual Deadline', 'AFS Review', 'Good Standing'],
    },
    {
        id: 'governance',
        title: 'Cooperative Governance & By-Laws Amendment Advisory',
        shortTitle: 'Governance Advisory',
        category: 'governance',
        categoryLabel: 'Governance & Regulatory',
        desc: 'Consultancy on parliamentary procedures, board resolutions, mediation, election guidelines, policy formulation, and formal amendments to cooperative by-laws.',
        icon: ShieldCheckIcon,
        accent: 'indigo',
        solidBg: 'bg-indigo-600',
        processingTime: '1–3 Working Days',
        fee: '100% Free Public Service',
        beneficiaries: 'Board of Directors, Committee Chairs, General Managers, Secretaries',
        legalBasis: 'RA 9520 Sub-chapter on Cooperative Governance & By-Laws',
        requirements: [
            'Copy of existing Registered Articles of Cooperation and By-Laws',
            'Proposed amendments or specific governance issues for resolution',
            'Board Resolution requesting MCDO advisory or mediation assistance',
        ],
        steps: [
            'Schedule advisory session with MCDO Cooperative Officer.',
            'Review proposed policy guidelines or charter amendments for legal compliance.',
            'Conduct General Assembly briefing if charter amendment approval is needed.',
            'Endorse approved amendments to CDA for formal registration.',
        ],
        tags: ['By-Laws', 'Board Policies', 'Mediation', 'Resolutions'],
    },
    {
        id: 'bookkeeping',
        title: 'Standardized Bookkeeping & Accounting Training',
        shortTitle: 'Bookkeeping Training',
        category: 'capacity',
        categoryLabel: 'Education & Capacity Building',
        desc: 'Hands-on workshops on the Standard Chart of Accounts (SCA), cash flow recording, general ledger management, and financial statement preparation for cooperative treasurers.',
        icon: CalculatorIcon,
        accent: 'amber',
        solidBg: 'bg-amber-600',
        processingTime: '2-Day Practical Workshop',
        fee: '100% Free Training Material & Facilitation',
        beneficiaries: 'Cooperative Bookkeepers, Treasurers, Audit Committee Members',
        legalBasis: 'CDA Standard Chart of Accounts (SCA) Guidelines',
        requirements: [
            'Endorsement letter signed by Cooperative Chairperson / Manager',
            'Current financial notebooks or accounting templates in use',
            'Designation of at least one treasurer and one bookkeeper per co-op',
        ],
        steps: [
            'Register for upcoming quarterly MCDO Bookkeeping Cohort.',
            'Participate in hands-on ledger and computerized spreadsheet accounting modules.',
            'Complete practical audit simulation and balance sheet balancing exercises.',
            'Receive Certificate of Competency and continuous MCDO desk coaching.',
        ],
        tags: ['Accounting', 'Standard Chart of Accounts', 'Treasurers'],
    },
    {
        id: 'leadership',
        title: 'Officers Mandatory Training & Leadership Development',
        shortTitle: 'Mandatory Officers Training',
        category: 'capacity',
        categoryLabel: 'Education & Capacity Building',
        desc: 'Accredited training modules required for Board of Directors, Committee Members, General Managers, and Secretaries to maintain regulatory compliance and leadership excellence.',
        icon: UsersIcon,
        accent: 'purple',
        solidBg: 'bg-purple-600',
        processingTime: 'Scheduled Modular Courses (8–16 Hours)',
        fee: '100% Free Municipal Sponsorship',
        beneficiaries: 'Elected Officers, BOD Members, Committee Heads, Management Staff',
        legalBasis: 'CDA MC No. 2015-09 (Mandatory Training for Cooperative Officers)',
        requirements: [
            'Official list of elected officers following General Assembly elections',
            'Proof of prior training attended (for continuing education credits)',
            'Confirmation of officer attendance for scheduled seminar slots',
        ],
        steps: [
            'MCDO issues schedule of accredited training modules for the fiscal year.',
            'Cooperative enrolls eligible officers via portal or municipal office.',
            'Officers complete Core Modules: Governance, Fundamentals, and Financial Management.',
            'MCDO validates training certificates with CDA compliance registry.',
        ],
        tags: ['BOD Training', 'Accredited Modules', 'Mandatory Credits'],
    },
    {
        id: 'financial',
        title: 'Financial Planning, Audit & Capital Mobilization',
        shortTitle: 'Financial Advisory',
        category: 'financial',
        categoryLabel: 'Financial & Enterprise Advisory',
        desc: 'Diagnostic review of loan portfolios, capital build-up strategies, delinquency management (PAR tracking), liquidity analysis, and financial sustainability roadmaps.',
        icon: BanknotesIcon,
        accent: 'blue',
        solidBg: 'bg-blue-600',
        processingTime: '2–4 Working Days',
        fee: '100% Free Public Service',
        beneficiaries: 'Credit Co-ops, Multi-Purpose Co-ops with lending windows, Micro-finance arms',
        legalBasis: 'CDA Risk Management Framework & Financial Standards',
        requirements: [
            'Latest trial balance and summary of loan aging report',
            'Existing credit and collection policies manual',
            'Written request for financial diagnostic assessment',
        ],
        steps: [
            'Submit historical loan and savings performance records for appraisal.',
            'MCDO financial team analyzes portfolio at risk (PAR) and liquidity ratios.',
            'Formulate custom Capital Build-Up (CBU) and credit policy recommendations.',
            'Conduct officer coaching on risk mitigation and loan collection systems.',
        ],
        tags: ['Capital Build-Up', 'Delinquency Control', 'Portfolio Audit'],
    },
    {
        id: 'market',
        title: 'Market Linkage & Agri-Enterprise Acceleration',
        shortTitle: 'Market & Enterprise Linkage',
        category: 'financial',
        categoryLabel: 'Financial & Enterprise Advisory',
        desc: 'Facilitating supply chain linkages between local farmer/producer cooperatives, institutional buyers, municipal markets, provincial trade fairs, and national agency grants (DA/DAR/DTI).',
        icon: BuildingStorefrontIcon,
        accent: 'emerald',
        solidBg: 'bg-emerald-600',
        processingTime: 'Ongoing Developmental Partnership',
        fee: '100% Free Public Service',
        beneficiaries: 'Agricultural Co-ops, Fisherfolk Co-ops, Artisan & Producer Groups',
        legalBasis: 'LGU Opol Bag-ong Opol Economic Pillar & RA 11364 Partnership Framework',
        requirements: [
            'Product catalog / volume output specification of agricultural commodities',
            'Certificate of Good Standing with CDA and LGU Accreditation',
            'Designated enterprise liaison officer',
        ],
        steps: [
            'Profile cooperative production capacity and seasonal crop yields.',
            'Connect cooperative with institutional buyers, local supermarkets, and LGU feeding programs.',
            'Facilitate access to DTI Shared Service Facilities (SSF) and DA grant machinery.',
            'Feature cooperative products in official Opol trade fairs and digital showcases.',
        ],
        tags: ['Agri-Trade', 'Supply Chain', 'DTI/DA Linkage', 'Bag-ong Opol'],
    },
];

const SERVICE_CATEGORIES = {
    all: { label: 'All Services', icon: BuildingLibraryIcon, color: 'blue' },
    organization: { label: 'Organization & Formation', icon: AcademicCapIcon, color: 'blue' },
    governance: { label: 'Governance & Regulatory', icon: ShieldCheckIcon, color: 'red' },
    capacity: { label: 'Capacity & Training', icon: UsersIcon, color: 'purple' },
    financial: { label: 'Financial & Enterprise', icon: BanknotesIcon, color: 'emerald' },
};

const STAT_METRICS = [
    { label: 'Frontline Programs', value: '8', icon: BuildingLibraryIcon, accent: 'blue', tag: 'Complete Spectrum' },
    { label: 'LGU Advisory Fee', value: '100% Free', icon: CurrencyDollarIcon, accent: 'emerald', tag: 'Public Service Mandate' },
    { label: 'Review Turnaround', value: '1–3 Days', icon: ClockIcon, accent: 'amber', tag: 'Fast Technical Action' },
    { label: 'Training Delivery', value: 'Year-Round', icon: CalendarDaysIcon, accent: 'purple', tag: 'Monthly Cohorts' },
];

const ENGAGEMENT_STEPS = [
    {
        step: '01',
        title: 'Intake & Consultation',
        desc: 'Submit your inquiry, PMES seminar request, or compliance documents in-person at the MCDO Office or through our digital portal.',
        icon: AcademicCapIcon,
        color: 'bg-blue-600',
    },
    {
        step: '02',
        title: 'Assessment & Audit',
        desc: 'Our cooperative development officers conduct a diagnostic assessment of your organization, documents, and regulatory status.',
        icon: ChartBarIcon,
        color: 'bg-amber-600',
    },
    {
        step: '03',
        title: 'Action Plan & Endorsement',
        desc: 'Receive tailored coaching, accredited seminar completion, official CDA endorsements, and financial policy templates.',
        icon: DocumentCheckIcon,
        color: 'bg-emerald-600',
    },
    {
        step: '04',
        title: 'Growth & Market Linkage',
        desc: 'Continuous advisory, compliance monitoring, enterprise acceleration, and institutional market integration across Northern Mindanao.',
        icon: BuildingStorefrontIcon,
        color: 'bg-purple-600',
    },
];

const COMPLIANCE_ROADMAP = [
    {
        quarter: 'Q1 (Jan–Mar)',
        title: 'General Assembly & Elections',
        desc: 'Conduct annual general membership meeting, election of new directors and committee heads, and budget approval.',
        tag: 'Governance',
        color: 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40',
    },
    {
        quarter: 'Q2 (By April 30)',
        title: 'Annual Mandatory Reporting (CAPR)',
        desc: 'Mandatory deadline for submission of CAPR, Audited Financial Statements (AFS), Social Audit, and List of Officers to CDA & MCDO.',
        tag: 'Critical Statutory',
        color: 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 bg-red-50/70 dark:bg-red-950/40',
    },
    {
        quarter: 'Q3 (Jul–Sep)',
        title: 'Officers Mandatory Training',
        desc: 'Complete required CDA-accredited training hours for new Board members, Treasurers, Audit Committees, and General Managers.',
        tag: 'Capacity Building',
        color: 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40',
    },
    {
        quarter: 'Q4 (Oct–Dec)',
        title: 'Co-op Month & Year-End Audit',
        desc: 'Celebrate National Cooperative Month, participate in municipal trade showcases, and prepare preliminary financial closing books.',
        tag: 'Enterprise & Trade',
        color: 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40',
    },
];

export default function Services() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedServiceModal, setSelectedServiceModal] = useState(null);
    const reducedMotion = useReducedMotion();

    const categoryCounts = useMemo(() => {
        const counts = { all: MCDO_SERVICES.length };
        MCDO_SERVICES.forEach((s) => {
            counts[s.category] = (counts[s.category] || 0) + 1;
        });
        return counts;
    }, []);

    const filteredServices = useMemo(() => {
        return MCDO_SERVICES.filter((s) => {
            const matchesFilter = filter === 'all' || s.category === filter;
            const matchesSearch =
                searchQuery === '' ||
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery]);

    return (
        <PublicLayout activePage="services">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                {/* ── Page Header ── */}
                <PageHeader
                    eyebrow="Municipal Frontline Programs"
                    title="Programs &"
                    titleLine2="Developmental Services"
                    description="From pre-registration and foundational education to regulatory compliance, bookkeeping mastery, and enterprise acceleration — MCDO Opol empowers local cooperatives at every stage."
                />

                {/* ── Key Metrics Bar ── */}
                <AnimatedGrid className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
                    {STAT_METRICS.map(({ label, value, icon: Icon, accent, tag }) => (
                        <AnimatedItem key={label}>
                            <article className="public-card public-card-accent p-4 sm:p-5 h-full flex flex-col justify-between" data-accent={accent}>
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60">
                                            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60">
                                            {tag}
                                        </span>
                                    </div>
                                    <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                        {value}
                                    </p>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {label}
                                </p>
                            </article>
                        </AnimatedItem>
                    ))}
                </AnimatedGrid>

                {/* ── Search & Category Filter Suite ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-10">
                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm backdrop-blur-sm space-y-4">
                        {/* Search Input Bar */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by service name, keyword (e.g. PMES, Bookkeeping, CAPR, By-Laws)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    title="Clear search"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter Chips */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                                Categories:
                            </span>
                            {Object.entries(SERVICE_CATEGORIES).map(([key, meta]) => {
                                const count = categoryCounts[key] || 0;
                                const isActive = filter === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFilter(key)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 border ${
                                            isActive
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <span>{meta.label}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results Counter & Active Query Feedback */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 mt-3">
                        <p>
                            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredServices.length}</strong> of{' '}
                            <strong>{MCDO_SERVICES.length}</strong> frontline services
                            {searchQuery && (
                                <span>
                                    {' '}
                                    matching "<em>{searchQuery}</em>"
                                </span>
                            )}
                        </p>
                        {(filter !== 'all' || searchQuery) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFilter('all');
                                    setSearchQuery('');
                                }}
                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </AnimatedSection>

                {/* ── Frontline Services Catalog Grid ── */}
                <div className="max-w-6xl mx-auto mb-20">
                    <AnimatePresence mode="wait">
                        {filteredServices.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="public-card p-12 text-center max-w-xl mx-auto"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <InformationCircleIcon className="w-8 h-8" />
                                </div>
                                <h4 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">
                                    No Services Found
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                    No frontline service matches your current search term. Try adjusting your query or resetting filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilter('all');
                                        setSearchQuery('');
                                    }}
                                    className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
                                >
                                    Reset Filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="services-grid"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredServices.map((service) => {
                                        const ServiceIcon = service.icon;
                                        return (
                                            <AnimatedItem key={service.id}>
                                                <article
                                                    onClick={() => setSelectedServiceModal(service)}
                                                    className="public-card public-card-left-accent p-6 sm:p-7 h-full flex flex-col justify-between group hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                    data-accent={service.accent}
                                                >
                                                    <div>
                                                        {/* Top Row: Icon + Category Badge + Fee Tag */}
                                                        <div className="flex items-start justify-between gap-3 mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-12 h-12 rounded-xl ${service.solidBg} text-white flex items-center justify-center shadow-md`}>
                                                                    <ServiceIcon className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 block w-fit">
                                                                        {service.categoryLabel}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1">
                                                                        <CheckBadgeIcon className="w-3.5 h-3.5" />
                                                                        <span>{service.fee}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800 flex items-center gap-1">
                                                                <ClockIcon className="w-3 h-3 text-slate-400" />
                                                                <span>{service.processingTime}</span>
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {service.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                                            {service.desc}
                                                        </p>

                                                        {/* Tag Pills */}
                                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                            {service.tags.map((t) => (
                                                                <span key={t} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                                    #{t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Card Bottom Action */}
                                                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                                        <span className="text-slate-400 font-medium truncate max-w-[200px]">
                                                            Target: {service.beneficiaries.split(',')[0]}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                                            <span>View Requirements & Process</span>
                                                            <ArrowRightIcon className="w-3.5 h-3.5" />
                                                        </span>
                                                    </div>
                                                </article>
                                            </AnimatedItem>
                                        );
                                    })}
                                </AnimatedGrid>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Pre-Registration Seminar (PMES) Spotlight Hub ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-20">
                    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border-2 border-blue-500/40 shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-blue-200 text-xs font-bold uppercase tracking-wider">
                                    <AcademicCapIcon className="w-4 h-4" />
                                    <span>Mandatory Accreditation Prerequisite</span>
                                </div>
                                <h3 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                                    Request a Pre-Membership Education Seminar (PMES)
                                </h3>
                                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
                                    Planning to register a new cooperative or induct a new cohort of member-owners in Opol? MCDO conducts free, accredited Pre-Membership Education Seminars (PMES) required for CDA statutory compliance.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    {[
                                        '100% Free Public Service',
                                        'Minimum of 15 Founding Members',
                                        'Official CDA PMES Certificate Issued',
                                        'Covers Co-op Code (RA 9520) & Taxation',
                                    ].map((feat) => (
                                        <div key={feat} className="flex items-center gap-2 text-xs text-blue-100 font-medium">
                                            <CheckBadgeIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                                <a
                                    href="/contact?subject=pre-registration-seminar"
                                    className="inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl hover:shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm uppercase tracking-wider text-center"
                                >
                                    <span>Book PMES Seminar</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setSelectedServiceModal(MCDO_SERVICES[0])}
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-2xl border border-white/20 transition-all text-xs uppercase tracking-wider"
                                >
                                    <span>View PMES Checklist</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── 4-Step Client Journey Stepper ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-20">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 mb-2">
                            End-to-End Service Delivery
                        </span>
                        <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            Our Client Engagement Process
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            How we partner with cooperatives from initial consultation to long-term sustainability.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Desktop Connector Line */}
                        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-6 z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            {ENGAGEMENT_STEPS.map(({ step, title, desc, icon: Icon, color }) => (
                                <div key={step} className="public-card p-6 flex flex-col justify-between h-full bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="font-outfit font-black text-2xl text-slate-300 dark:text-slate-700">
                                                {step}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            Stage {step}
                                        </span>
                                        <h4 className="font-outfit font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-1 mb-2">
                                            {title}
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── Annual Cooperative Compliance Roadmap ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-20">
                    <div className="public-card p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-3 py-0.5 rounded-full border border-red-200 dark:border-red-800 mb-2">
                                    <CalendarDaysIcon className="w-3.5 h-3.5" />
                                    <span>Citizen's Charter & Regulatory Timelines</span>
                                </div>
                                <h3 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Cooperative Annual Compliance Calendar
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Key statutory milestones for all registered cooperatives operating in Opol to maintain Good Standing.
                                </p>
                            </div>
                            <a
                                href="/contact"
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 transition-colors shrink-0 text-center"
                            >
                                Inquire About Compliance
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {COMPLIANCE_ROADMAP.map((item) => (
                                <div key={item.quarter} className={`p-4 rounded-2xl border ${item.color} flex flex-col justify-between space-y-2`}>
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-outfit font-black text-sm uppercase tracking-wider">
                                                {item.quarter}
                                            </span>
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/50 dark:bg-black/30">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── Call to Action Banner ── */}
                <CtaBanner
                    title="Ready to organize, train, or grow your cooperative?"
                    description="Visit the Municipal Cooperative Development Office at the Municipal Hall, Poblacion, Opol or connect with our developmental officers online."
                    primaryHref="/contact"
                    primaryLabel="Contact MCDO Office"
                    secondaryHref="/cooperatives"
                    secondaryLabel="View Opol Co-op Directory"
                />

                {/* ── Interactive Service Detail & Requirements Modal ── */}
                <AnimatePresence>
                    {selectedServiceModal && (
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setSelectedServiceModal(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
                                    <div className="space-y-1.5 pr-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                {selectedServiceModal.categoryLabel}
                                            </span>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                {selectedServiceModal.fee}
                                            </span>
                                        </div>
                                        <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
                                            {selectedServiceModal.title}
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedServiceModal(null)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                                        aria-label="Close details"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1.5">
                                            Program Description
                                        </h4>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {selectedServiceModal.desc}
                                        </p>
                                    </div>

                                    {/* Document Requirements Checklist */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5">
                                            Checklist of Requirements
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedServiceModal.requirements.map((req, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200">
                                                    <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                    <span className="leading-tight">{req}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step-by-Step Procedure */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5">
                                            Step-by-Step Citizen Procedure
                                        </h4>
                                        <div className="space-y-2.5">
                                            {selectedServiceModal.steps.map((step, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-xs">
                                                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                                                        {idx + 1}
                                                    </span>
                                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                                                        {step}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Service Specifications Table */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                                            Service Specifications
                                        </h4>
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <dt className="text-slate-400">Processing Time</dt>
                                                <dd className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                                    {selectedServiceModal.processingTime}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-400">Government Fees</dt>
                                                <dd className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                    {selectedServiceModal.fee}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                                                <dt className="text-slate-400">Target Beneficiaries</dt>
                                                <dd className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                                                    {selectedServiceModal.beneficiaries}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                                                <dt className="text-slate-400">Legal Authority</dt>
                                                <dd className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                                                    {selectedServiceModal.legalBasis}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
                                    <a
                                        href={`/contact?subject=${selectedServiceModal.id}`}
                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <span>Request / Inquire about this Service</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedServiceModal(null)}
                                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </PublicLayout>
    );
}

