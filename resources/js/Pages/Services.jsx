import { DocumentPlusIcon, ChartBarIcon, BuildingOfficeIcon, BanknotesIcon, UsersIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import SectionHeading from '../Components/Public/SectionHeading';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';

const FEATURED = [
    { icon: DocumentPlusIcon, title: 'Registration & Renewal', desc: 'Guided assistance for registering new cooperatives and renewing certificates of good standing.', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/15', accent: 'blue' },
    { icon: ChartBarIcon, title: 'Compliance & Monitoring', desc: 'Reportorial tracking and governance support to keep cooperatives compliant year-round.', color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/15', accent: 'red' },
    { icon: BuildingOfficeIcon, title: 'Capacity Building', desc: 'Workshops on leadership, bookkeeping, and cooperative principles for officers and members.', color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15', accent: 'amber' },
    { icon: BanknotesIcon, title: 'Financial Advisory', desc: 'Guidance on savings mobilization, lending policy, and sustainable financial planning.', color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/15', accent: 'indigo' },
];

const DETAILED = [
    { icon: UsersIcon, title: 'Capacity Building', desc: 'Training programs and workshops to enhance cooperative management skills and operational efficiency.', tags: ['Leadership', 'Bookkeeping', 'Governance'], solidBg: 'bg-red-600', accent: 'red' },
    { icon: ChartBarIcon, title: 'Financial Advisory', desc: 'Expert guidance on financial planning, capital management, and long-term sustainability strategies.', tags: ['Planning', 'Capital', 'Audit'], solidBg: 'bg-blue-600', accent: 'blue' },
    { icon: SparklesIcon, title: 'Compliance Support', desc: 'Assistance with regulatory requirements, documentation, and cooperative governance standards.', tags: ['Reporting', 'Audits', 'CDA'], solidBg: 'bg-indigo-600', accent: 'indigo' },
    { icon: AcademicCapIcon, title: 'Member Development', desc: 'Programs to empower cooperative members through education, skills training, and member-benefit initiatives.', tags: ['Education', 'Benefits'], solidBg: 'bg-amber-600', accent: 'amber' },
];

const TAG_COLORS = {
    red: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
};

const STEPS = [
    { step: '01', title: 'Intake', desc: 'You reach out through the portal or in person.' },
    { step: '02', title: 'Assessment', desc: "We review your cooperative's current state." },
    { step: '03', title: 'Plan', desc: 'Tailored recommendations and support plan.' },
    { step: '04', title: 'Grow', desc: 'Ongoing advisory, training, and monitoring.' },
];

export default function Services() {
    return (
        <PublicLayout activePage="services">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                <PageHeader eyebrow="What we offer" title="Programs &" titleLine2="Services" description="From registration to long-term sustainability, MCDO Opol supports cooperatives at every stage of their growth." />

                {/* ── Featured Services ── */}
                <AnimatedGrid className="max-w-7xl mx-auto mb-16 sm:mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {FEATURED.map(({ icon: Icon, title, desc, color, accent }) => (
                        <AnimatedItem key={title}>
                            <article className="public-card public-card-accent p-6 h-full" data-accent={accent}>
                                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-5 ring-1 ring-slate-200/50 dark:ring-slate-600/30`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                            </article>
                        </AnimatedItem>
                    ))}
                </AnimatedGrid>

                {/* ── Detailed Services ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-16 sm:mb-20 space-y-4 sm:space-y-5">
                    {DETAILED.map(({ icon: Icon, title, desc, tags, solidBg, accent }) => (
                        <div key={title} className="public-card public-card-left-accent p-6 sm:p-8 hover:!translate-y-0" data-accent={accent}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <div className="md:col-span-2 flex justify-center">
                                    <div className={`w-16 h-16 rounded-2xl ${solidBg} flex items-center justify-center shadow-md ring-2 ring-white/20 dark:ring-white/5`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="md:col-span-7">
                                    <h3 className="font-outfit font-bold text-xl text-slate-900 dark:text-white mb-2">{title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                                </div>
                                <div className="md:col-span-3 flex flex-wrap gap-2 justify-start md:justify-end">
                                    {tags.map((tag) => (
                                        <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${TAG_COLORS[accent] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-600/60'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatedSection>

                {/* ── Engagement Process ── */}
                <AnimatedSection className="max-w-5xl mx-auto mb-16 sm:mb-20">
                    <SectionHeading eyebrow="How it works" title="Our engagement process" />
                    <div className="relative">
                        {/* Solid connector */}
                        <div className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-blue-200 dark:bg-blue-900" />
                        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-6 relative">
                            {STEPS.map(({ step, title, desc }) => (
                                <AnimatedItem key={step}>
                                    <div className="public-card p-5 text-center pt-8 md:pt-5 group hover:shadow-lg">
                                        <div className="w-14 h-14 mx-auto md:-mt-10 mb-3 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900 group-hover:bg-blue-700 transition-colors duration-200">
                                            <span className="font-outfit font-bold text-white text-sm">{step}</span>
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Step {step}</p>
                                        <h3 className="font-outfit font-bold text-slate-900 dark:text-white mt-1 mb-1">{title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                                    </div>
                                </AnimatedItem>
                            ))}
                        </AnimatedGrid>
                    </div>
                </AnimatedSection>

                {/* ── Pre-Registration Seminar Spotlight Banner ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-16 sm:mb-20">
                    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border-2 border-blue-500/40 shadow-xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full mb-3 text-blue-200 text-xs font-bold uppercase tracking-wider">
                                    <span>⭐ Mandatory For New Cooperatives</span>
                                </div>
                                <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white mb-2">
                                    Request a Pre-Registration Seminar (PMES)
                                </h3>
                                <p className="text-sm text-blue-100/90 leading-relaxed">
                                    Planning to register a new cooperative in Opol? MCDO conducts free Pre-Membership Education Seminars (PMES) required for CDA registration. Send us a request through email today.
                                </p>
                            </div>
                            <a
                                href="/contact?subject=pre-registration-seminar"
                                className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 shrink-0 text-sm uppercase tracking-wider"
                            >
                                <span>Request Seminar</span>
                                <AcademicCapIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </AnimatedSection>

                <CtaBanner title="Ready to put these services to work?" description="Sign in to the portal to start a request, or contact our office to speak with a cooperative development officer." secondaryHref="/contact?subject=pre-registration-seminar" secondaryLabel="Request Seminar" />
            </main>
        </PublicLayout>
    );
}
