import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InboxIcon, MapPinIcon, UserIcon, UsersIcon, BuildingOfficeIcon, ClockIcon, ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ICON_COLORS = [
    'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/15',
    'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/15',
    'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/15',
    'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15',
    'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/15',
    'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/15',
];

const ACCENT_COLORS = ['blue', 'red', 'indigo', 'amber', 'emerald', 'purple'];

const STAT_ICONS = [UsersIcon, GlobeAltIcon, ChartBarIcon, ClockIcon];
const STAT_ACCENTS = ['blue', 'red', 'indigo', 'amber'];

export default function Cooperatives({ initialCoops = [] }) {
    const [filter, setFilter] = useState('all');
    const reducedMotion = useReducedMotion();
    const coops = initialCoops.length > 0 ? initialCoops : [
        { coop_name: 'Opol Farmers Cooperative', coop_type: 'Agriculture', address: 'Barangay 1, Opol', contact_person: 'Juan Dela Cruz', members_total: 120 },
        { coop_name: 'Opol Transport Cooperative', coop_type: 'Transport', address: 'Poblacion, Opol', contact_person: 'Maria Santos', members_total: 85 },
        { coop_name: 'Opol Vendors Multi-Purpose', coop_type: 'Multi-Purpose', address: 'Public Market, Opol', contact_person: 'Pedro Reyes', members_total: 310 },
        { coop_name: 'Opol Fisherfolks Coop', coop_type: 'Fishery', address: 'Luyong Bonbon, Opol', contact_person: 'Jose Rizal', members_total: 60 },
        { coop_name: 'Opol Teachers Cooperative', coop_type: 'Credit', address: 'Opol Central School', contact_person: 'Ana Magtubo', members_total: 215 },
        { coop_name: "Opol Women's Coop", coop_type: 'Advocacy', address: 'Barangay 2, Opol', contact_person: 'Liza Soberano', members_total: 95 },
    ];
    const sectors = [...new Set(coops.map((c) => c.coop_type || 'General'))].slice(0, 6);
    const filteredCoops = filter === 'all' ? coops : coops.filter((c) => c.coop_type === filter);

    return (
        <PublicLayout activePage="cooperatives">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                <PageHeader eyebrow="Registered Organizations" title="Our Partner" titleLine2="Cooperatives" description="A growing directory of cooperatives served by the Municipal Cooperative Development Office of Opol, Misamis Oriental." />

                {/* ── Stats ── */}
                <AnimatedGrid className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
                    {[{ value: coops.length, label: 'Co-ops on file' }, { value: 14, label: 'Barangays' }, { value: 8, label: 'Sectors represented' }, { value: 12, label: 'Years of service' }].map(({ value, label }, i) => {
                        const StatIcon = STAT_ICONS[i];
                        return (
                            <AnimatedItem key={label}>
                                <div className="public-card public-card-accent p-4 sm:p-5 text-center" data-accent={STAT_ACCENTS[i]}>
                                    <div className="flex justify-center mb-2">
                                        <div className={`w-8 h-8 rounded-lg ${ICON_COLORS[i]} flex items-center justify-center`}>
                                            <StatIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                                </div>
                            </AnimatedItem>
                        );
                    })}
                </AnimatedGrid>

                {/* ── Filter Pills ── */}
                <AnimatedSection className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
                    {['all', ...sectors].map((sector) => (
                        <button
                            key={sector}
                            type="button"
                            onClick={() => setFilter(sector)}
                            className={`relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                                filter === sector
                                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:border-red-400/50 hover:text-red-600 dark:hover:text-red-400'
                            }`}
                        >
                            {sector === 'all' ? 'All' : sector}
                        </button>
                    ))}
                </AnimatedSection>

                {/* ── Directory Grid ── */}
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredCoops.length === 0 ? (
                            <motion.div key="empty" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="public-card p-12 text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="absolute inset-0 -m-4 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700" />
                                    <InboxIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 relative" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400">No cooperatives found matching that filter.</p>
                            </motion.div>
                        ) : (
                            <motion.div key={filter} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                    {filteredCoops.map((coop, i) => (
                                        <AnimatedItem key={coop.coop_name}>
                                            <article className="public-card public-card-left-accent p-5 h-full" data-accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}>
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 ${ICON_COLORS[i % ICON_COLORS.length]} rounded-xl flex items-center justify-center shrink-0 ring-1 ring-slate-200/50 dark:ring-slate-600/30`}>
                                                        <UsersIcon className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-outfit font-bold text-slate-900 dark:text-white truncate" title={coop.coop_name}>{coop.coop_name}</h3>
                                                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600/60 mt-1">{coop.coop_type}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                                    <p className="flex items-center gap-2"><MapPinIcon className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" /><span className="truncate">{coop.address}</span></p>
                                                    <p className="flex items-center gap-2"><UserIcon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" /><span className="truncate">{coop.contact_person}</span></p>
                                                    <p className="flex items-center gap-2"><UsersIcon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />{coop.members_total} members</p>
                                                </div>
                                            </article>
                                        </AnimatedItem>
                                    ))}
                                </AnimatedGrid>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-16 sm:mt-20"><CtaBanner title="Want your cooperative listed here?" description="Sign in to the portal to keep your records current, file compliance reports, and update your membership details." /></div>
            </main>
        </PublicLayout>
    );
}
