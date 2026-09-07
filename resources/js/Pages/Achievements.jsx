import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import SectionHeading from '../Components/Public/SectionHeading';
import AnimatedSection from '../Components/Public/AnimatedSection';
import AchievementsShowcase from '../Components/Public/AchievementsShowcase';
import CtaBanner from '../Components/Public/CtaBanner';
import {
    CalendarDaysIcon,
    MapPinIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UsersIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const TIMELINE_HIGHLIGHTS = [
    {
        date: 'July 4, 2026',
        title: 'Municipal Cooperative Clean-Up Drive',
        venue: 'Taboc Gym, Opol',
        category: 'Environmental Stewardship',
        accent: 'emerald',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
        date: 'August 5, 2026',
        title: 'Pre-Registration Seminar (PRS) with CDA',
        venue: 'Citihomes, Malanang, Opol',
        category: 'Cooperative Formation',
        accent: 'indigo',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
        date: 'August 18, 2026',
        title: 'Monitoring & Evaluation of 3 Cooperatives',
        venue: 'Tuling, Patag & Poblacion',
        category: 'Governance & Compliance',
        accent: 'blue',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
        date: 'August 2026',
        title: 'Municipal Civic Parade & Solidarity Walk',
        venue: 'Poblacion to Municipal Grounds',
        category: 'Civic & Community Solidarity',
        accent: 'red',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-200 dark:border-red-800',
    },
];

export default function Achievements() {
    return (
        <PublicLayout activePage="achievements">
            <main className="px-4 sm:px-8 lg:px-12 pt-6 pb-16 lg:pb-24">
                {/* ══════════════════════════════════════════════════════════
                    PAGE HEADER
                   ══════════════════════════════════════════════════════════ */}
                <PageHeader
                    eyebrow="Official Accomplishments & Field Milestones"
                    title="Office Achievements"
                    titleLine2="Empowering Opol Through Collective Action"
                    description="Official records and photographic documentation of MCDO Opol's on-ground operations, civic parades, environmental campaigns, statutory audits, and capacity-building seminars."
                />

                {/* ══════════════════════════════════════════════════════════
                    CHRONOLOGICAL MILESTONES ROADMAP STRIP
                   ══════════════════════════════════════════════════════════ */}
                <AnimatedSection className="max-w-6xl mx-auto mb-14">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
                                    Operational Timeline
                                </span>
                                <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
                                    2026 Major Accomplishments at a Glance
                                </h3>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                                <span>Verified Operations</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {TIMELINE_HIGHLIGHTS.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={`#${item.title.toLowerCase().includes('parade') ? 'civic-parade' : item.title.toLowerCase().includes('clean') ? 'clean-up-drive' : item.title.toLowerCase().includes('monitoring') ? 'monitoring-evaluation' : 'pre-registration-seminar'}`}
                                    className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                            {item.date}
                                        </span>
                                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                                            {item.category.split(' ')[0]}
                                        </span>
                                    </div>
                                    <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                        <MapPinIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                        <span className="truncate">{item.venue}</span>
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ══════════════════════════════════════════════════════════
                    MAIN ACHIEVEMENTS SHOWCASE (INTERACTIVE)
                   ══════════════════════════════════════════════════════════ */}
                <AnimatedSection className="max-w-6xl mx-auto mb-20 sm:mb-28">
                    <SectionHeading
                        eyebrow="Field Documentation & Photographic Records"
                        title="Documented Milestones & Activities"
                        description="Browse detailed mission reports, authentic community messages, impact indicators, and high-resolution photo galleries from our field engagements."
                    />

                    <AchievementsShowcase />
                </AnimatedSection>

                {/* ══════════════════════════════════════════════════════════
                    CALL TO ACTION
                   ══════════════════════════════════════════════════════════ */}
                <CtaBanner
                    title="Partner with MCDO Opol for your cooperative's growth"
                    description="Whether you are organizing a new association, preparing for compliance audits, or seeking training assistance, our office is ready to serve you."
                    primaryHref="/contact"
                    primaryLabel="Contact Our Office"
                    secondaryHref="/services"
                    secondaryLabel="Explore Our Services"
                />
            </main>
        </PublicLayout>
    );
}
