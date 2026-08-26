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
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ── Static Official Cooperatives of Opol ──
const OFFICIAL_OPOL_COOPERATIVES = [
    {
        id: 1,
        coop_name: 'Misamis Oriental Farmers Credit Cooperative (MOFACCO)',
        coop_type: 'Credit',
        address: 'Poblacion, Opol, Misamis Oriental',
        contact_person: 'Board Chairperson / Operations Head',
        members_total: 185,
        status: 'Active / Registered',
        accent: 'red',
    },
    {
        id: 2,
        coop_name: 'Bonbon Opol Samahang Nayon Multi-purpose Cooperative',
        coop_type: 'Multi-Purpose Coop.',
        address: 'Bonbon, Opol, Misamis Oriental',
        contact_person: 'Samahang Nayon Chairperson',
        members_total: 142,
        status: 'Active / Registered',
        accent: 'blue',
    },
    {
        id: 3,
        coop_name: 'Employed and Entrepreneurial Credit Cooperative (EECC)',
        coop_type: 'Credit',
        address: 'Igpit, Opol, Misamis Oriental',
        contact_person: 'Loan Operations Officer',
        members_total: 98,
        status: 'Active / Registered',
        accent: 'red',
    },
    {
        id: 4,
        coop_name: 'United Transport Cooperative',
        coop_type: 'Transportation',
        address: 'Poblacion / National Highway, Opol',
        contact_person: 'Fleet Management Lead',
        members_total: 125,
        status: 'Active / Registered',
        accent: 'amber',
    },
    {
        id: 5,
        coop_name: 'OPOL CENTRAL SCHOOL TEACHERS AND EMPLOYEES CREDIT COOPERATIVE',
        coop_type: 'Credit',
        address: 'Opol Central School, Poblacion, Opol',
        contact_person: 'Faculty Association Chairperson',
        members_total: 164,
        status: 'Active / Registered',
        accent: 'red',
    },
    {
        id: 6,
        coop_name: 'Opol Community College Employees Credit Cooperative',
        coop_type: 'Credit',
        address: 'Opol Community College, Taboc, Opol',
        contact_person: 'College Board Secretary / Treasurer',
        members_total: 88,
        status: 'Active / Registered',
        accent: 'red',
    },
    {
        id: 7,
        coop_name: 'Patag Agrarian Reform Cooperative',
        coop_type: 'Primary',
        address: 'Patag, Opol, Misamis Oriental',
        contact_person: 'Agrarian Reform Beneficiaries Head',
        members_total: 110,
        status: 'Active / Registered',
        accent: 'emerald',
    },
    {
        id: 8,
        coop_name: 'Taboc Farmers MPC',
        coop_type: 'Multi-Purpose',
        address: 'Taboc, Opol, Misamis Oriental',
        contact_person: 'Farmers MPC Chairperson',
        members_total: 156,
        status: 'Active / Registered',
        accent: 'blue',
    },
    {
        id: 9,
        coop_name: 'Bayugbayogan Opol Community Multi Purpose Cooperative',
        coop_type: 'Multipurpose',
        address: 'Bayugbayogan, Malanang, Opol',
        contact_person: 'Community Enterprise Manager',
        members_total: 92,
        status: 'Active / Registered',
        accent: 'blue',
    },
    {
        id: 10,
        coop_name: 'Tuling Coconut Farmers Multi-Purpose Cooperative',
        coop_type: 'Primary',
        address: 'Tuling, Nangcaon, Opol, Misamis Oriental',
        contact_person: 'Coconut Farmers Lead / Manager',
        members_total: 134,
        status: 'Active / Registered',
        accent: 'emerald',
    },
    {
        id: 11,
        coop_name: 'OPOL EMPLOYEES MULTI-PURPOSE COOPERATIVE',
        coop_type: 'Credit',
        address: 'Municipal Hall Compound, Poblacion, Opol',
        contact_person: 'LGU Employees Association Head',
        members_total: 210,
        status: 'Active / Registered',
        accent: 'red',
    },
];

const TYPE_CONFIG = {
    Credit: {
        badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
        dot: 'bg-red-600',
    },
    'Multi-Purpose Coop.': {
        badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
        dot: 'bg-red-600',
    },
    'Multi-Purpose': {
        badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
        dot: 'bg-red-600',
    },
    Multipurpose: {
        badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
        dot: 'bg-red-600',
    },
    Transportation: {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
        dot: 'bg-red-600',
    },
    Primary: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
        dot: 'bg-red-600',
    },
};

const STAT_ICONS = [BuildingLibraryIcon, GlobeAltIcon, ChartBarIcon, UsersIcon];
const STAT_ACCENTS = ['blue', 'red', 'indigo', 'emerald'];

export default function Cooperatives() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
    const reducedMotion = useReducedMotion();

    const coops = OFFICIAL_OPOL_COOPERATIVES;

    const sectors = useMemo(() => {
        return ['all', ...Array.from(new Set(coops.map((c) => c.coop_type)))];
    }, [coops]);

    const totalMembers = useMemo(() => {
        return coops.reduce((sum, c) => sum + (Number(c.members_total) || 0), 0);
    }, [coops]);

    const filteredCoops = useMemo(() => {
        return coops.filter((c) => {
            const matchesFilter = filter === 'all' || c.coop_type === filter;
            const matchesSearch =
                searchQuery === '' ||
                c.coop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.coop_type && c.coop_type.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesFilter && matchesSearch;
        });
    }, [coops, filter, searchQuery]);

    return (
        <PublicLayout activePage="cooperatives">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                <PageHeader
                    eyebrow="Official Registry"
                    title="Municipal Cooperative"
                    titleLine2="Directory of Opol"
                    description="Official registry of active cooperatives in the Municipality of Opol, Misamis Oriental under the guidance of the Municipal Cooperative Development Office (MCDO)."
                />

                {/* ── Key Stats ── */}
                <AnimatedGrid className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
                    {[
                        { value: coops.length, label: 'Registered Co-ops' },
                        { value: 14, label: 'Barangays Covered' },
                        { value: sectors.length - 1, label: 'Active Sectors' },
                        { value: totalMembers.toLocaleString(), label: 'Total Co-op Members' },
                    ].map(({ value, label }, i) => {
                        const StatIcon = STAT_ICONS[i];
                        return (
                            <AnimatedItem key={label}>
                                <div className="public-card public-card-accent p-4 sm:p-5 text-center" data-accent={STAT_ACCENTS[i]}>
                                    <div className="flex justify-center mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                            <StatIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                                </div>
                            </AnimatedItem>
                        );
                    })}
                </AnimatedGrid>

                {/* ── Search, Filter & View Controls ── */}
                <AnimatedSection className="max-w-5xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm backdrop-blur-sm">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search cooperatives, sector, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Controls on the right: Sector Filters + View Toggle */}
                        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
                            {/* Sector Filter Pills */}
                            <div className="flex flex-wrap items-center gap-1">
                                {sectors.map((sector) => (
                                    <button
                                        key={sector}
                                        type="button"
                                        onClick={() => setFilter(sector)}
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 border ${
                                            filter === sector
                                                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400'
                                        }`}
                                    >
                                        {sector === 'all' ? 'All' : sector}
                                    </button>
                                ))}
                            </div>

                            {/* View Switcher: List vs Cards */}
                            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    aria-label="List View"
                                    title="List View"
                                    className={`p-1.5 rounded-lg transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-bold'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <ListBulletIcon className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('cards')}
                                    aria-label="Grid Cards View"
                                    title="Grid Cards View"
                                    className={`p-1.5 rounded-lg transition-colors ${
                                        viewMode === 'cards'
                                            ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <Squares2X2Icon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── Cooperative Directory Display (List or Cards) ── */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredCoops.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="public-card p-12 text-center max-w-xl mx-auto"
                            >
                                <div className="relative inline-block mb-4">
                                    <InboxIcon className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto" />
                                </div>
                                <h4 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-200">No cooperatives found</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Try adjusting your search keywords or clearing the filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilter('all');
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </motion.div>
                        ) : viewMode === 'list' ? (
                            /* ── Clean List View (Exactly matching screenshot aesthetic) ── */
                            <motion.div
                                key="list-view"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="public-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm"
                            >
                                {filteredCoops.map((coop) => (
                                    <article
                                        key={coop.id}
                                        className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                    >
                                        <div className="space-y-1 min-w-0">
                                            <h3 className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {coop.coop_name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                                                <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {coop.coop_type}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                    {coop.address}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                                                {coop.members_total} members
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-full">
                                                Active
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </motion.div>
                        ) : (
                            /* ── Grid Cards View ── */
                            <motion.div
                                key="cards-view"
                                initial={reducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredCoops.map((coop) => {
                                        const config = TYPE_CONFIG[coop.coop_type] || {
                                            badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
                                            dot: 'bg-red-600',
                                        };
                                        const accent = coop.accent || 'blue';

                                        return (
                                            <AnimatedItem key={coop.id}>
                                                <article
                                                    className="public-card public-card-left-accent p-6 h-full flex flex-col justify-between group hover:shadow-md transition-all duration-300"
                                                    data-accent={accent}
                                                >
                                                    <div>
                                                        {/* Top row: Type with Red Dot & Registered Tag */}
                                                        <div className="flex items-center justify-between gap-2 mb-3">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${config.badge}`}
                                                            >
                                                                <span className="w-2 h-2 rounded-full bg-red-600" />
                                                                {coop.coop_type}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                                <CheckBadgeIcon className="w-3 h-3" />
                                                                Active
                                                            </span>
                                                        </div>

                                                        {/* Cooperative Name */}
                                                        <h3
                                                            className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                                            title={coop.coop_name}
                                                        >
                                                            {coop.coop_name}
                                                        </h3>

                                                        {/* Location details */}
                                                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                            <p className="flex items-start gap-2">
                                                                <MapPinIcon className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                                                                <span className="leading-tight">{coop.address}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Footer */}
                                                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                                                            <UsersIcon className="w-4 h-4 text-slate-400" />
                                                            {coop.members_total} Members
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                                            MCDO Opol
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

                {/* ── Strategic Alignment: Bag-ong Opol ── */}
                <AnimatedSection className="max-w-6xl mx-auto mt-16 sm:mt-20">
                    <div className="public-card public-card-accent p-6 sm:p-10" data-accent="red">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 px-3 py-1 rounded-full text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                                <span>Municipal Strategic Vision Alignment</span>
                            </div>
                            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                "Bag-ong Opol: A Vibrant, Inclusive, Smart, Eco-Town Where Sustainability Meets Innovation"
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                Aligned with the Municipality of Opol's vision of <strong className="text-slate-900 dark:text-white font-semibold">"Bag-ong Opol: A Vibrant, Inclusive, Smart, Eco-Town Where Sustainability Meets Innovation,"</strong> the MCDO integrates its programs and services with the municipality's strategic priorities under the pillars of <strong className="text-slate-900 dark:text-white font-semibold">Social, Economic, Infrastructure, Environment, and Institutional Development</strong>.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                Through this alignment, the Office positions cooperatives as key partners in promoting inclusive growth, resilient livelihoods, sustainable enterprises, environmental stewardship, and good governance.
                            </p>

                            {/* 5 Strategic Pillars Pills */}
                            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                                {[
                                    { name: 'Social Development', desc: 'Resilient livelihoods & empowerment', color: 'border-red-200 dark:border-red-800/80 bg-red-50/70 dark:bg-red-950/40 text-red-700 dark:text-red-300' },
                                    { name: 'Economic Development', desc: 'Sustainable enterprises & trade', color: 'border-blue-200 dark:border-blue-800/80 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' },
                                    { name: 'Infrastructure Development', desc: 'Smart facilities & access', color: 'border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
                                    { name: 'Environment Development', desc: 'Eco-town & stewardship', color: 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' },
                                    { name: 'Institutional Development', desc: 'Good governance & compliance', color: 'border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
                                ].map((pillar) => (
                                    <div key={pillar.name} className={`p-3 rounded-xl border ${pillar.color} flex flex-col justify-between`}>
                                        <span className="font-outfit font-bold text-xs leading-tight mb-1">{pillar.name}</span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{pillar.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── Call to Action Banner ── */}
                <div className="mt-16 sm:mt-20">
                    <CtaBanner
                        title="Want your cooperative listed or need compliance support?"
                        description="Visit the Municipal Cooperative Development Office at the Municipal Hall, Poblacion, Opol or submit an inquiry through our portal."
                        primaryHref="/contact"
                        primaryLabel="Contact MCDO"
                        secondaryHref="/services"
                        secondaryLabel="View Support Programs"
                    />
                </div>
            </main>
        </PublicLayout>
    );
}

