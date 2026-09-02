import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    InboxIcon,
    MapPinIcon,
    UsersIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    CheckBadgeIcon,
    BuildingLibraryIcon,
    Squares2X2Icon,
    ListBulletIcon,
    XMarkIcon,
    ArrowRightIcon,
    CheckIcon,
    AcademicCapIcon,
    TruckIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    SparklesIcon,
    InformationCircleIcon,
    DocumentTextIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ── Official Cooperatives Registry of Opol ──
const OFFICIAL_OPOL_COOPERATIVES = [
    {
        id: 1,
        coop_name: 'Misamis Oriental Farmers Credit Cooperative (MOFACCO)',
        coop_type: 'Credit & Financial',
        sector: 'credit',
        barangay: 'Poblacion',
        address: 'Poblacion, Opol, Misamis Oriental',
        contact_person: 'Board Chairperson / Operations Head',
        members_total: 185,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'red',
        description: 'Provides accessible agricultural loans, savings facilities, emergency credit windows, and mutual financial assistance for farming families across Opol.',
        services: [
            'Micro-loans & Crop Financing',
            'Member Savings & Time Deposits',
            'Emergency Credit Windows',
            'Financial Literacy Coaching',
        ],
    },
    {
        id: 2,
        coop_name: 'Bonbon Opol Samahang Nayon Multi-Purpose Cooperative',
        coop_type: 'Multi-Purpose',
        sector: 'multipurpose',
        barangay: 'Bonbon',
        address: 'Bonbon, Opol, Misamis Oriental',
        contact_person: 'Samahang Nayon Chairperson',
        members_total: 142,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'blue',
        description: 'Community multi-purpose cooperative delivering consumer goods retail, coastal livelihood support, member patronage dividends, and emergency capital.',
        services: [
            'Consumer Goods Store & Retail',
            'Livelihood Capital Assistance',
            'Member Dividends & Patronage',
            'Community Emergency Fund',
        ],
    },
    {
        id: 3,
        coop_name: 'Employed and Entrepreneurial Credit Cooperative (EECC)',
        coop_type: 'Credit & Financial',
        sector: 'credit',
        barangay: 'Igpit',
        address: 'Igpit, Opol, Misamis Oriental',
        contact_person: 'Loan Operations Officer',
        members_total: 98,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'red',
        description: 'Serving micro-entrepreneurs and employed professionals with accessible low-interest credit, enterprise startup capital, and savings schemes.',
        services: [
            'Micro-Enterprise Credit',
            'Salary & Personal Loans',
            'Savings & Capital Build-Up',
            'Business Planning Advice',
        ],
    },
    {
        id: 4,
        coop_name: 'United Transport Cooperative of Opol',
        coop_type: 'Transportation',
        sector: 'transport',
        barangay: 'Poblacion',
        address: 'Poblacion / National Highway, Opol',
        contact_person: 'Fleet Management Lead',
        members_total: 125,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'amber',
        description: 'Organizes public utility drivers and operators, managing standardized transport routes, fleet modernizations, fuel discounts, and driver welfare.',
        services: [
            'Transport Route Management',
            'Fleet Modernization Support',
            'Driver Welfare & Mutual Aid',
            'Cooperative Fuel Discount Program',
        ],
    },
    {
        id: 5,
        coop_name: 'Opol Central School Teachers & Employees Credit Cooperative',
        coop_type: 'Institutional & Academic',
        sector: 'institutional',
        barangay: 'Poblacion',
        address: 'Opol Central School, Poblacion, Opol',
        contact_person: 'Faculty Association Chairperson',
        members_total: 164,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'purple',
        description: 'Dedicated financial cooperative supporting public school educators, administrators, and educational staff with credit and provident funds.',
        services: [
            'Educators Loan Facilities',
            'Provident & Retirement Savings',
            'Emergency Educational Grants',
            'Year-End Patronage Dividends',
        ],
    },
    {
        id: 6,
        coop_name: 'Opol Community College Employees Credit Cooperative',
        coop_type: 'Institutional & Academic',
        sector: 'institutional',
        barangay: 'Taboc',
        address: 'Opol Community College, Taboc, Opol',
        contact_person: 'College Board Secretary / Treasurer',
        members_total: 88,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'purple',
        description: 'Higher education institutional cooperative fostering savings culture, faculty loans, welfare packages, and mutual aid for collegiate personnel.',
        services: [
            'Faculty Emergency Loans',
            'Institutional Savings Accounts',
            'Medical Assistance Fund',
            'Special Investment Windows',
        ],
    },
    {
        id: 7,
        coop_name: 'Patag Agrarian Reform Cooperative',
        coop_type: 'Agriculture & Agrarian',
        sector: 'agriculture',
        barangay: 'Patag',
        address: 'Patag, Opol, Misamis Oriental',
        contact_person: 'Agrarian Reform Beneficiaries Head',
        members_total: 110,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'emerald',
        description: 'Empowers agrarian reform beneficiaries (ARBs) through farm inputs consolidation, collective tractor/machinery rental, and bulk crop distribution.',
        services: [
            'Bulk Farm Inputs & Fertilizers',
            'Tractor & Machinery Rental',
            'Crop Marketing & Wholesale',
            'DAR & MCDO Technical Training',
        ],
    },
    {
        id: 8,
        coop_name: 'Taboc Farmers Multi-Purpose Cooperative',
        coop_type: 'Multi-Purpose',
        sector: 'multipurpose',
        barangay: 'Taboc',
        address: 'Taboc, Opol, Misamis Oriental',
        contact_person: 'Farmers MPC Chairperson',
        members_total: 156,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'blue',
        description: 'Diversified agricultural multi-purpose co-op providing post-harvest processing, member grocery discounts, seedling distribution, and grain trading.',
        services: [
            'Post-Harvest Processing & Drying',
            'Cooperative Mini-Mart',
            'Seedling & Organic Fertilizer Supply',
            'Credit & Emergency Cash',
        ],
    },
    {
        id: 9,
        coop_name: 'Bayugbayogan Opol Community Multi-Purpose Cooperative',
        coop_type: 'Multi-Purpose',
        sector: 'multipurpose',
        barangay: 'Malanang',
        address: 'Bayugbayogan, Malanang, Opol',
        contact_person: 'Community Enterprise Manager',
        members_total: 92,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'blue',
        description: 'Grassroots rural cooperative advancing communal livestock breeding, table egg distribution, community water management, and mutual aid.',
        services: [
            'Community Enterprise Incubator',
            'Livestock & Poultry Feed Supply',
            'Water Utility Distribution',
            'Livelihood Loans',
        ],
    },
    {
        id: 10,
        coop_name: 'Tuling Coconut Farmers Multi-Purpose Cooperative',
        coop_type: 'Agriculture & Agrarian',
        sector: 'agriculture',
        barangay: 'Nangcaon',
        address: 'Tuling, Nangcaon, Opol, Misamis Oriental',
        contact_person: 'Coconut Farmers Lead / Manager',
        members_total: 134,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'emerald',
        description: 'Highland agro-cooperative specializing in high-grade copra trading, coconut by-product development, fertilizer subsidies, and intercropping support.',
        services: [
            'Copra Buying & Direct Trading',
            'PCA & CDA Convergence Assistance',
            'Intercropping Seedlings (Cacao/Coffee)',
            'Farm Input Subsidy Distribution',
        ],
    },
    {
        id: 11,
        coop_name: 'Opol Employees Multi-Purpose Cooperative (OEMPC)',
        coop_type: 'Credit & Financial',
        sector: 'credit',
        barangay: 'Poblacion',
        address: 'Municipal Hall Compound, Poblacion, Opol',
        contact_person: 'LGU Employees Association Head',
        members_total: 210,
        status: 'Active / Registered',
        cda_status: 'CDA Accredited',
        accent: 'red',
        description: 'The flagship cooperative of the Local Government Unit of Opol civil servants, facilitating salary loans, emergency funds, and consumer credit.',
        services: [
            'Civil Service Salary Advances',
            'Emergency & Calamity Loans',
            'Capital Share Dividends',
            'LGU Consumer Commissary',
        ],
    },
];

const SECTOR_METADATA = {
    all: {
        label: 'All Sectors',
        icon: BuildingLibraryIcon,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    },
    credit: {
        label: 'Credit & Financial',
        icon: BanknotesIcon,
        color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800',
    },
    multipurpose: {
        label: 'Multi-Purpose',
        icon: BuildingStorefrontIcon,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    },
    agriculture: {
        label: 'Agriculture & Agrarian',
        icon: SparklesIcon,
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    },
    institutional: {
        label: 'Institutional & Academic',
        icon: AcademicCapIcon,
        color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    },
    transport: {
        label: 'Transportation',
        icon: TruckIcon,
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    },
};

const STAT_ITEMS = [
    { label: 'Registered Co-ops', value: '11', icon: BuildingLibraryIcon, accent: 'blue', tag: 'Official CDA Roster' },
    { label: 'Barangays Covered', value: '14', icon: GlobeAltIcon, accent: 'red', tag: '100% Geographic Reach' },
    { label: 'Active Sectors', value: '5', icon: ChartBarIcon, accent: 'amber', tag: 'Diversified Economy' },
    { label: 'Total Co-op Members', value: '1,504', icon: UsersIcon, accent: 'emerald', tag: 'Empowered Citizens' },
];

const REGISTRATION_STEPS = [
    {
        step: '01',
        title: 'PMES & Founding Assembly',
        desc: 'Attend the Pre-Membership Education Seminar (PMES) facilitated by MCDO with a minimum of 15 founding cooperators.',
        icon: AcademicCapIcon,
        color: 'bg-blue-600',
    },
    {
        step: '02',
        title: 'Documentation & Feasibility',
        desc: 'Draft Articles of Cooperation, By-Laws, Economic Survey, and establish paid-up capital requirements with MCDO guidance.',
        icon: DocumentTextIcon,
        color: 'bg-amber-600',
    },
    {
        step: '03',
        title: 'CDA Registration & Endorsement',
        desc: 'Submit statutory requirements to the Cooperative Development Authority (CDA Region X) and secure official Municipal Accreditation.',
        icon: CheckBadgeIcon,
        color: 'bg-emerald-600',
    },
];

export default function Cooperatives() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
    const [selectedCoopModal, setSelectedCoopModal] = useState(null);
    const reducedMotion = useReducedMotion();

    const coops = OFFICIAL_OPOL_COOPERATIVES;

    const sectorCounts = useMemo(() => {
        const counts = { all: coops.length };
        coops.forEach((c) => {
            counts[c.sector] = (counts[c.sector] || 0) + 1;
        });
        return counts;
    }, [coops]);

    const filteredCoops = useMemo(() => {
        return coops.filter((c) => {
            const matchesFilter = filter === 'all' || c.sector === filter;
            const matchesSearch =
                searchQuery === '' ||
                c.coop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.coop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.contact_person.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [coops, filter, searchQuery]);

    return (
        <PublicLayout activePage="cooperatives">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                {/* ── Page Header ── */}
                <PageHeader
                    eyebrow="Official Registry & Economic Convergence"
                    title="Municipal Cooperative"
                    titleLine2="Directory of Opol"
                    description="Official registry of accredited cooperatives in the Municipality of Opol, Misamis Oriental under the supervision and developmental guidance of the Municipal Cooperative Development Office (MCDO)."
                />

                {/* ── Key Registry Stats Bar ── */}
                <AnimatedGrid className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
                    {STAT_ITEMS.map(({ label, value, icon: Icon, accent, tag }) => (
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

                {/* ── Search, Sector Filters & View Mode Controls ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-8">
                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm backdrop-blur-sm space-y-4">
                        {/* Top Row: Search Input & View Switcher */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by cooperative name, barangay, sector, or keyword..."
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

                            {/* View Switcher (Grid Cards vs List) */}
                            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shrink-0 self-end sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('cards')}
                                    aria-label="Grid Cards View"
                                    title="Grid Cards View"
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                        viewMode === 'cards'
                                            ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <Squares2X2Icon className="w-4 h-4" />
                                    <span>Cards Grid</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    aria-label="List Table View"
                                    title="List Table View"
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <ListBulletIcon className="w-4 h-4" />
                                    <span>List View</span>
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row: Sector Filter Chips */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-750 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                                Sectors:
                            </span>
                            {Object.entries(SECTOR_METADATA).map(([key, meta]) => {
                                const count = sectorCounts[key] || 0;
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
                            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredCoops.length}</strong> of{' '}
                            <strong>{coops.length}</strong> registered cooperatives
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

                {/* ── Cooperatives Directory Display ── */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredCoops.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="public-card p-12 text-center max-w-xl mx-auto"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <InboxIcon className="w-8 h-8" />
                                </div>
                                <h4 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">
                                    No Cooperatives Found
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                    No registered cooperative matches your current search or sector filter. Try adjusting your query.
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
                        ) : viewMode === 'list' ? (
                            /* ── Enhanced List / Table View ── */
                            <motion.div
                                key="list-view"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="public-card overflow-hidden divide-y divide-slate-200/80 dark:divide-slate-800 border border-slate-200/90 dark:border-slate-800 shadow-sm"
                            >
                                {filteredCoops.map((coop) => {
                                    const meta = SECTOR_METADATA[coop.sector] || SECTOR_METADATA.all;
                                    const SectorIcon = meta.icon;
                                    return (
                                        <article
                                            key={coop.id}
                                            onClick={() => setSelectedCoopModal(coop)}
                                            className="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                                        >
                                            <div className="space-y-1.5 min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${meta.color}`}>
                                                        <SectorIcon className="w-3 h-3" />
                                                        <span>{coop.coop_type}</span>
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/60">
                                                        Brgy. {coop.barangay}
                                                    </span>
                                                </div>
                                                <h3 className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {coop.coop_name}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                                    <MapPinIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                    <span>{coop.address}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60">
                                                    <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{coop.members_total} Members</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-full">
                                                    <CheckBadgeIcon className="w-3 h-3" />
                                                    <span>Active</span>
                                                </span>
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                    <span>Details</span>
                                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            /* ── Enhanced Grid Cards View ── */
                            <motion.div
                                key="cards-view"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                                    {filteredCoops.map((coop) => {
                                        const meta = SECTOR_METADATA[coop.sector] || SECTOR_METADATA.all;
                                        const SectorIcon = meta.icon;
                                        return (
                                            <AnimatedItem key={coop.id}>
                                                <article
                                                    onClick={() => setSelectedCoopModal(coop)}
                                                    className="public-card public-card-left-accent p-6 h-full flex flex-col justify-between group hover:shadow-md transition-all duration-300 cursor-pointer"
                                                    data-accent={coop.accent}
                                                >
                                                    <div>
                                                        {/* Top Metadata Row: Sector Badge + Active Status */}
                                                        <div className="flex items-center justify-between gap-2 mb-3.5">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.color}`}
                                                            >
                                                                <SectorIcon className="w-3 h-3" />
                                                                <span>{coop.coop_type}</span>
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                                                                <CheckBadgeIcon className="w-3 h-3" />
                                                                <span>Active</span>
                                                            </span>
                                                        </div>

                                                        {/* Cooperative Name */}
                                                        <h3
                                                            className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                                                            title={coop.coop_name}
                                                        >
                                                            {coop.coop_name}
                                                        </h3>

                                                        {/* Brief Description */}
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                                                            {coop.description}
                                                        </p>

                                                        {/* Location & Contact Info */}
                                                        <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                                                            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                                                <MapPinIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                                <span className="leading-tight font-medium">{coop.address}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                                <UserCircleIcon className="w-4 h-4 text-slate-400 shrink-0" />
                                                                <span className="truncate">{coop.contact_person}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card Bottom Footer */}
                                                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                                        <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                                            <UsersIcon className="w-4 h-4 text-slate-400" />
                                                            <span>{coop.members_total} Members</span>
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                                                            <span>View Profile</span>
                                                            <ArrowRightIcon className="w-3 h-3" />
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

                {/* ── Cooperative Formation & Registration Pathway ── */}
                <AnimatedSection className="max-w-6xl mx-auto mt-16 sm:mt-20">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 mb-2">
                            <InformationCircleIcon className="w-3.5 h-3.5" />
                            <span>MCDO Technical Guidance</span>
                        </div>
                        <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            How to Organize & Register a Cooperative in Opol
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                            MCDO provides end-to-end institutional support to help aspiring organizers fulfill statutory requirements under the Cooperative Development Authority (CDA).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {REGISTRATION_STEPS.map(({ step, title, desc, icon: Icon, color }) => (
                            <div
                                key={step}
                                className="public-card p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center shadow-sm`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-outfit font-black text-2xl text-slate-300 dark:text-slate-700">{step}</span>
                                    </div>
                                    <h4 className="font-outfit font-bold text-base text-slate-900 dark:text-white mb-2">{title}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        Step {step} Requirement
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* ── Strategic Alignment: Bag-ong Opol 5 Pillars ── */}
                <AnimatedSection className="max-w-6xl mx-auto mt-16 sm:mt-20">
                    <div className="public-card public-card-accent p-6 sm:p-10" data-accent="red">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 px-3.5 py-1 rounded-full text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                                <span>Municipal Strategic Vision Alignment</span>
                            </div>
                            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                "Bag-ong Opol: A Vibrant, Inclusive, Smart, Eco-Town Where Sustainability Meets Innovation"
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                Aligned with the Municipality of Opol's vision, MCDO integrates cooperative programs with the municipality's strategic development agenda across five foundational pillars:
                            </p>

                            {/* 5 Strategic Pillars Pills */}
                            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                {[
                                    { name: 'Social Development', desc: 'Resilient livelihoods & inclusive empowerment', color: 'border-red-200 dark:border-red-800/80 bg-red-50/70 dark:bg-red-950/40 text-red-700 dark:text-red-300' },
                                    { name: 'Economic Development', desc: 'Sustainable enterprises & agricultural trade', color: 'border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
                                    { name: 'Infrastructure Development', desc: 'Smart facilities & inter-barangay connectivity', color: 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' },
                                    { name: 'Environment Development', desc: 'Eco-town protection & coastal stewardship', color: 'border-teal-200 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300' },
                                    { name: 'Institutional Development', desc: 'Good governance, transparency & compliance', color: 'border-purple-200 dark:border-purple-800/80 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' },
                                ].map((pillar) => (
                                    <div key={pillar.name} className={`p-3.5 rounded-xl border ${pillar.color} flex flex-col justify-between`}>
                                        <span className="font-outfit font-bold text-xs leading-tight mb-1">{pillar.name}</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{pillar.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── Call to Action Banner ── */}
                <div className="mt-16 sm:mt-20">
                    <CtaBanner
                        title="Want your cooperative registered or need compliance assistance?"
                        description="Visit the Municipal Cooperative Development Office at the Municipal Hall, Poblacion, Opol or submit an official inquiry through our digital portal."
                        primaryHref="/contact"
                        primaryLabel="Contact MCDO Office"
                        secondaryHref="/services"
                        secondaryLabel="View Programs & Services"
                    />
                </div>

                {/* ── Interactive Cooperative Detail Modal ── */}
                <AnimatePresence>
                    {selectedCoopModal && (
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setSelectedCoopModal(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
                                    <div className="space-y-1.5 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                {selectedCoopModal.coop_type}
                                            </span>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                {selectedCoopModal.cda_status}
                                            </span>
                                        </div>
                                        <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
                                            {selectedCoopModal.coop_name}
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCoopModal(null)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                                        aria-label="Close details"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1.5">
                                            Organizational Overview
                                        </h4>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {selectedCoopModal.description}
                                        </p>
                                    </div>

                                    {/* Core Services */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                                            Key Programs & Member Services
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {selectedCoopModal.services.map((srv) => (
                                                <div key={srv} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200">
                                                    <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                                    <span>{srv}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specifications Table */}
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                                            Official Registry Details
                                        </h4>
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <dt className="text-slate-400">Jurisdiction / Barangay</dt>
                                                <dd className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                                    Brgy. {selectedCoopModal.barangay}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-400">Total Active Members</dt>
                                                <dd className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                                    {selectedCoopModal.members_total} Member-Owners
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-400">Official Representation</dt>
                                                <dd className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                                    {selectedCoopModal.contact_person}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-400">Regulatory Accreditation</dt>
                                                <dd className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                    CDA Region X & MCDO
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                                                <dt className="text-slate-400">Registered Office Address</dt>
                                                <dd className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                                                    {selectedCoopModal.address}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
                                    <a
                                        href="/contact"
                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <span>Inquire with MCDO</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCoopModal(null)}
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


