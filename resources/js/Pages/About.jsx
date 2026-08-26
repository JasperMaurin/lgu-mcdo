import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import voxImg from '../../Images/Vox.jpg';
import jayImg from '../../Images/Jay.jpg';
import mailynImg from '../../Images/Mailyn Quiblat.jpg';
import darlineImg from '../../Images/Darline Yasay.jpg';
import jasperImg from '../../Images/Jasper Maurin.jpg';
import mcdoLogo from '../../Images/mcdologs.jpg';
import coopImg from '../../Images/Coop.jpg';
import {
    BoltIcon,
    EyeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    BuildingOffice2Icon,
    BuildingLibraryIcon,
    ScaleIcon,
    MapPinIcon,
    GlobeAltIcon,
    SparklesIcon,
    DocumentCheckIcon,
    AcademicCapIcon,
    ShieldCheckIcon,
    HeartIcon,
    ArrowTrendingUpIcon,
    BriefcaseIcon,
    ClockIcon,
    CheckBadgeIcon,
    MapIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import SectionHeading from '../Components/Public/SectionHeading';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TEAM = [
    {
        name: 'Mailyn Quiblat',
        role: 'MCDO Designate',
        img: mailynImg,
        fallback: 'Mailyn+Quiblat&background=1d4ed8',
        tag: 'Office Head',
        desc: 'Leads municipal cooperative development programs, inter-agency partnerships with CDA, and strategic policy implementation across Opol.',
    },
    {
        name: 'Darline Yasay',
        role: 'MCDO Staff',
        img: darlineImg,
        fallback: 'Darline+Yasay&background=EF4444',
        tag: 'Operations & Records',
        desc: 'Facilitates cooperative registrations, membership assistance, annual compliance document intake, and day-to-day office coordination.',
    },
    {
        name: 'Jasper Maurin',
        role: 'MCDO IT Staff',
        img: jasperImg,
        fallback: 'Jasper+Maurin&background=64748B',
        tag: 'Systems & Technical',
        desc: 'Manages the MCDO digital portal infrastructure, database records, report automation, and IT technical support for cooperatives.',
    },
];

const MCDO_MANDATES = [
    {
        icon: AcademicCapIcon,
        title: 'Cooperative Organization & PMES',
        desc: 'Conducting Pre-Membership Education Seminars (PMES), guiding founding members through registration requirements, and facilitating official Cooperative Development Authority (CDA) accreditation.',
        accent: 'blue',
        badge: 'Formation',
        color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/15',
    },
    {
        icon: BuildingLibraryIcon,
        title: 'Governance & Capacity Building',
        desc: 'Delivering continuous mandatory and specialized training programs covering cooperative governance, financial management, basic bookkeeping, and ethical leadership.',
        accent: 'amber',
        badge: 'Education',
        color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Regulatory & Compliance Oversight',
        desc: 'Assisting co-ops in completing and submitting annual statutory requirements (CAPR, Audited Financial Statements, Social and Performance Audits) to sustain Certificates of Compliance (COC).',
        accent: 'red',
        badge: 'Compliance',
        color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/15',
    },
    {
        icon: ArrowTrendingUpIcon,
        title: 'Market Linkages & Livelihood Convergence',
        desc: 'Connecting local cooperatives to provincial and national agencies (CDA, DTI, DA, DOST, DOLE), financing windows, trade fairs, and municipal enterprise development initiatives.',
        accent: 'indigo',
        badge: 'Empowerment',
        color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/15',
    },
];

const OPOL_BARANGAYS = [
    { name: 'Poblacion', type: 'Town Center & Administration', icon: '🏛️' },
    { name: 'Barra', type: 'Coastal & Urban Residential', icon: '🌊' },
    { name: 'Igpit', type: 'Commercial & Industrial Corridor', icon: '🏭' },
    { name: 'Bonbon', type: 'Coastal & Eco-Tourism Haven', icon: '🌴' },
    { name: 'Luyong Bonbon', type: 'Fisherfolk & Marine Livelihood', icon: '⛵' },
    { name: 'Taboc', type: 'Coastal Enterprise Hub', icon: '⚓' },
    { name: 'Malanang', type: 'Agricultural & Inland Community', icon: '🌾' },
    { name: 'Patag', type: 'Lush Farming & Agro-Zone', icon: '🌱' },
    { name: 'Nangcaon', type: 'Scenic Upland Agribusiness', icon: '🌄' },
    { name: 'Awang', type: 'Highland Forest & Agri Reserve', icon: '🌲' },
    { name: 'Bagocboc', type: 'Rolling Hills & Livestock Farming', icon: '🐄' },
    { name: 'Cauyonan', type: 'Highland Agribusiness Community', icon: '⛰️' },
    { name: 'Limonda', type: 'Agroforestry & Farming Heartland', icon: '🌿' },
    { name: 'Tingalan', type: 'Upland Riverine & Farming Community', icon: '🏞️' },
];

const OPOL_HIGHLIGHTS = [
    {
        icon: GlobeAltIcon,
        title: 'Gateway to Western Misamis Oriental',
        desc: 'Strategically located directly along Macajalar Bay, adjacent to Cagayan de Oro City on the east and El Salvador City on the west.',
        accent: 'blue',
    },
    {
        icon: MapPinIcon,
        title: '14 Progressive Barangays',
        desc: 'Spanning 175.13 km² from scenic coastal shorelines to rich, productive highland valleys and agroforestry zones.',
        accent: 'red',
    },
    {
        icon: BriefcaseIcon,
        title: 'Dynamic Multi-Sector Economy',
        desc: 'Powered by thriving agribusiness, coastal aquaculture, retail and commercial commerce, eco-tourism, and grassroots cooperatives.',
        accent: 'amber',
    },
    {
        icon: HeartIcon,
        title: 'Vibrant Spirit of Bayanihan',
        desc: 'A proud tradition of community mutual aid, fostering cooperative organizations that turn collective effort into lasting prosperity.',
        accent: 'indigo',
    },
];

const CORE_VALUES = [
    {
        letter: 'I',
        title: 'Integrity',
        desc: 'Uphold the highest standards of honesty, fairness, and ethical conduct in the performance of our duties. We carry out our responsibilities with transparency, impartiality, and professionalism, ensuring that every action and decision strengthens public trust and confidence in the Office.',
        color: 'bg-red-600 text-white',
        accent: 'red',
    },
    {
        letter: 'S',
        title: 'Service Excellence',
        desc: 'Committed to providing timely, responsive, and client-focused services that meet the needs of cooperatives and the community. We strive to exceed expectations through efficient service delivery, continuous improvement, and a genuine commitment to public service.',
        color: 'bg-blue-600 text-white',
        accent: 'blue',
    },
    {
        letter: 'E',
        title: 'Excellence',
        desc: 'Pursue the highest standards of quality and performance in all our programs, projects, and services. Through innovation, competence, and continuous learning, we aim to deliver meaningful results that contribute to the growth and sustainability of the cooperative sector.',
        color: 'bg-amber-600 text-white',
        accent: 'amber',
    },
    {
        letter: 'R',
        title: 'Responsibility and Accountability',
        desc: 'Accept responsibility for our actions and decisions and remain accountable for the effective use of public resources. We perform our duties with diligence, uphold good governance, and ensure that our commitments are carried out with integrity and transparency.',
        color: 'bg-emerald-600 text-white',
        accent: 'emerald',
    },
    {
        letter: 'V',
        title: 'Value for Collaboration',
        desc: 'Recognize that sustainable development is achieved through strong partnerships and shared responsibility. We foster cooperation and mutual respect among cooperatives, government agencies, private institutions, and development partners to achieve common goals and maximize opportunities for community development.',
        color: 'bg-indigo-600 text-white',
        accent: 'indigo',
    },
    {
        letter: 'E',
        title: 'Empowerment and Innovation',
        desc: 'Empower cooperatives and communities by enhancing their knowledge, skills, and capacities while embracing innovative approaches to address emerging challenges. We encourage creativity, continuous learning, and the adoption of best practices that strengthen cooperative resilience, competitiveness, and long-term sustainability.',
        color: 'bg-purple-600 text-white',
        accent: 'purple',
    },
];

export default function About() {
    const [mayorActive, setMayorActive] = useState(true);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const interval = setInterval(() => setMayorActive((p) => !p), 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <PublicLayout activePage="about">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                {/* ── Page Header ── */}
                <PageHeader
                    eyebrow="Public Service & Local Progress"
                    title="About MCDO &"
                    titleLine2="The Municipality of Opol"
                    description="Empowering local cooperatives through dedicated governance, comprehensive capacity building, and sustainable development initiatives in Misamis Oriental."
                />

                {/* ── Section Quick Navigation Pills ── */}
                <AnimatedSection className="max-w-4xl mx-auto mb-14 sm:mb-16">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm backdrop-blur-sm">
                        <a
                            href="#about-mcdo"
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                        >
                            About MCDO
                        </a>
                        <a
                            href="#about-opol"
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                        >
                            About Opol
                        </a>
                        <a
                            href="#mission-vision"
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                        >
                            Mission & Vision
                        </a>
                        <a
                            href="#leadership"
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200"
                        >
                            Leadership
                        </a>
                        <a
                            href="#team"
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                        >
                            MCDO Team
                        </a>
                    </div>
                </AnimatedSection>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 1: MUNICIPAL COOPERATIVE DEVELOPMENT OFFICE (MCDO)
                   ══════════════════════════════════════════════════════════ */}
                <section id="about-mcdo" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-6xl mx-auto mb-12">
                        <SectionHeading
                            eyebrow="Institutional Mandate"
                            title="Municipal Cooperative Development Office"
                            description="The frontline agency of the Local Government of Opol mandated to foster, guide, and accelerate the growth of vibrant cooperative enterprises."
                        />

                        {/* Featured MCDO Overview Card */}
                        <div className="public-card public-card-accent p-6 sm:p-10 mb-10" data-accent="blue">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-8 space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-3 py-1 rounded-full text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                                        <BuildingOffice2Icon className="w-4 h-4" />
                                        <span>Mandated Under LGU Opol & Municipal Ordinance No. 2025-03A</span>
                                    </div>
                                    <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                        Empowering Communities Through Self-Help and Economic Cooperation
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                        The <strong className="text-slate-900 dark:text-white font-semibold">Municipal Cooperative Development Office (MCDO)</strong> is the Local Government Unit of Opol's lead office in promoting cooperative development as a catalyst for inclusive economic growth, social empowerment, and sustainable community development.
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                        Guided by <strong className="text-slate-900 dark:text-white font-semibold">Republic Act No. 9520</strong> (Philippine Cooperative Code of 2008), <strong className="text-slate-900 dark:text-white font-semibold">Republic Act No. 11364</strong> (Cooperative Development Authority Charter of 2019), <strong className="text-slate-900 dark:text-white font-semibold">Republic Act No. 7160</strong> (Local Government Code of 1991), and <strong className="text-slate-900 dark:text-white font-semibold">Municipal Ordinance No. 2025-03A</strong>, the Office is committed to strengthening cooperatives through responsive programs in governance, regulatory compliance, financial management, enterprise development, capacity-building, and market linkage.
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                        Aligned with the Municipality of Opol's vision of <strong className="text-slate-900 dark:text-white font-semibold">"Bag-ong Opol: A Vibrant, Inclusive, Smart, Eco-Town Where Sustainability Meets Innovation,"</strong> the MCDO integrates its programs and services with the municipality's strategic priorities under the pillars of <strong className="text-slate-900 dark:text-white font-semibold">Social, Economic, Infrastructure, Environment, and Institutional Development</strong>. Through this alignment, the Office positions cooperatives as key partners in promoting inclusive growth, resilient livelihoods, sustainable enterprises, environmental stewardship, and good governance.
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-3">
                                        <a
                                            href="/services"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all duration-200"
                                        >
                                            <span>Explore Our Services</span>
                                            <ArrowRightIcon className="w-3.5 h-3.5" />
                                        </a>
                                        <a
                                            href="/cooperatives"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700"
                                        >
                                            <span>View Registered Co-ops</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                            <img src={mcdoLogo} alt="MCDO Opol Seal" className="w-full h-full object-contain" />
                                        </div>
                                        <h4 className="font-outfit font-bold text-slate-900 dark:text-white text-base">MCDO Opol</h4>
                                        <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mt-0.5">Municipal Office</p>
                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-3 text-left">
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Jurisdiction</span>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">14 Barangays</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Accreditation</span>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">CDA Partner</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Consultation</span>
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">100% Free</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Location</span>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Municipal Hall</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Four Key Mandates Grid */}
                        <div className="mb-6">
                            <h4 className="font-outfit text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                Key Functions & Strategic Responsibilities
                            </h4>
                        </div>
                        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            {MCDO_MANDATES.map(({ icon: Icon, title, desc, accent, badge, color }) => (
                                <AnimatedItem key={title}>
                                    <article className="public-card public-card-left-accent p-6 sm:p-7 h-full flex flex-col justify-between" data-accent={accent}>
                                        <div>
                                            <div className="flex items-center justify-between gap-4 mb-4">
                                                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                                                    {badge}
                                                </span>
                                            </div>
                                            <h4 className="font-outfit text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                                        </div>
                                    </article>
                                </AnimatedItem>
                            ))}
                        </AnimatedGrid>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 2: ABOUT OPOL (MUNICIPALITY PROFILE)
                   ══════════════════════════════════════════════════════════ */}
                <section id="about-opol" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-6xl mx-auto mb-12">
                        <SectionHeading
                            eyebrow="Our Municipality"
                            title="About the Municipality of Opol"
                            description="Discover the rich cultural heritage, dynamic economic landscape, and the 14 vibrant barangays that make Opol the gateway to Western Misamis Oriental."
                        />

                        {/* Opol Narrative & Profile Grid */}
                        <div className="public-card public-card-accent p-6 sm:p-10 mb-10" data-accent="red">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 px-3 py-1 rounded-full text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                                        <MapIcon className="w-4 h-4" />
                                        <span>2nd District of Misamis Oriental • Northern Mindanao</span>
                                    </div>
                                    <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                        A Progressive Coastal Municipality with Boundless Potential
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                        The <strong className="text-slate-900 dark:text-white font-semibold">Municipality of Opol</strong> is a rapidly developing peri-urban municipality situated in the Province of Misamis Oriental, Region X. Serving as the primary western gateway immediately adjacent to Cagayan de Oro City, Opol occupies a prime position along the national highway network and the Macajalar Bay coast.
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                        Opol spans a diverse landscape of <strong className="text-slate-900 dark:text-white font-semibold">175.13 square kilometers</strong>, ranging from scenic shorelines, bustling fishing communities, and active commercial zones to lush upland agricultural plateaus. Its strategic location, natural resources, and industrious people have made it one of the fastest-growing investment and residential corridors in Northern Mindanao.
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                        Historically recognized for its deep communal roots and maritime traditions, Opol is today an engine of sustainable agri-industrial growth and grassroots cooperativism, where mutual support (<em className="italic">Bayanihan</em>) drives economic progress.
                                    </p>
                                </div>

                                <div className="lg:col-span-5 flex flex-col gap-3">
                                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                                        <h4 className="font-outfit font-bold text-lg text-white mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500" />
                                            Opol Fast Facts
                                        </h4>
                                        <dl className="space-y-3 text-xs">
                                            <div className="flex justify-between py-1.5 border-b border-slate-800">
                                                <dt className="text-slate-400">Province / Region</dt>
                                                <dd className="font-bold text-slate-100">Misamis Oriental (Region X)</dd>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-slate-800">
                                                <dt className="text-slate-400">Congressional District</dt>
                                                <dd className="font-bold text-slate-100">2nd District</dd>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-slate-800">
                                                <dt className="text-slate-400">Number of Barangays</dt>
                                                <dd className="font-bold text-red-400">14 Barangays</dd>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-slate-800">
                                                <dt className="text-slate-400">Land Area</dt>
                                                <dd className="font-bold text-slate-100">175.13 km²</dd>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-slate-800">
                                                <dt className="text-slate-400">Major Bodies of Water</dt>
                                                <dd className="font-bold text-slate-100">Macajalar Bay, Iponan River</dd>
                                            </div>
                                            <div className="flex justify-between py-1.5">
                                                <dt className="text-slate-400">Primary Economic Drivers</dt>
                                                <dd className="font-bold text-blue-400">Agribusiness, Trade, Fisheries, Co-ops</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opol Key Pillars & Highlights */}
                        <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
                            {OPOL_HIGHLIGHTS.map(({ icon: Icon, title, desc, accent }) => (
                                <AnimatedItem key={title}>
                                    <article className="public-card public-card-accent p-5 sm:p-6 h-full flex flex-col justify-between" data-accent={accent}>
                                        <div>
                                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-4 border border-slate-200/80 dark:border-slate-700/60">
                                                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h4 className="font-outfit text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                                        </div>
                                    </article>
                                </AnimatedItem>
                            ))}
                        </AnimatedGrid>

                        {/* 14 Barangays of Opol Showcase */}
                        <div id="barangays" className="scroll-mt-24 pt-4">
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h4 className="font-outfit text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                        The 14 Barangays of Opol
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        MCDO provides direct technical assistance and cooperative organizing across all 14 communities.
                                    </p>
                                </div>
                                <span className="inline-flex items-center self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    100% Geographic Coverage
                                </span>
                            </div>

                            <AnimatedGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 gap-3">
                                {OPOL_BARANGAYS.map(({ name, type, icon }) => (
                                    <AnimatedItem key={name}>
                                        <div className="public-card p-3.5 sm:p-4 hover:border-red-500/50 transition-all duration-200 group">
                                            <div className="flex items-start gap-3">
                                                <span className="text-xl sm:text-2xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:scale-110 transition-transform duration-200">
                                                    {icon}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <h5 className="font-outfit font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                        {name}
                                                    </h5>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{type}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedItem>
                                ))}
                            </AnimatedGrid>
                        </div>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 3: MISSION, VISION & CORE VALUES
                   ══════════════════════════════════════════════════════════ */}
                <section id="mission-vision" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-6xl mx-auto">
                        <SectionHeading
                            eyebrow="Our Guiding Compass"
                            title="Mission, Vision & Core Values"
                            description="The principles and aspirations that steer our programs, public service commitments, and cooperative development roadmaps."
                        />

                        {/* Mission & Vision Cards */}
                        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12">
                            <AnimatedItem>
                                <article className="public-card public-card-accent p-7 sm:p-10 h-full flex flex-col justify-between" data-accent="red">
                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mb-6 shadow-sm">
                                            <BoltIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-4">Mission</h3>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                            To promote and facilitate the establishment, growth, and Sustainability of cooperatives in Opol, guided by principles of inclusivity, transparency, and community empowerment.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Action & Empowerment</span>
                                    </div>
                                </article>
                            </AnimatedItem>

                            <AnimatedItem>
                                <article className="public-card public-card-accent p-7 sm:p-10 h-full flex flex-col justify-between" data-accent="blue">
                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-sm">
                                            <EyeIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-4">Vision</h3>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                            A cooperative sector that contributes to the economic development and social justice within the municipality.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Progress & Sustainability</span>
                                    </div>
                                </article>
                            </AnimatedItem>
                        </AnimatedGrid>

                        {/* Core Values: I-SERVE */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-3 py-1 rounded-full text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                                <span>Guiding Principles & Standards</span>
                            </div>
                            <h4 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                Core Values: The I-SERVE Framework
                            </h4>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
                                The Municipal Cooperative Development Office upholds the core values of <strong className="text-slate-900 dark:text-white font-semibold">I-SERVE</strong>, which embody the principles and standards that guide the Office in delivering responsive, ethical, and people-centered public service. These values reflect the Office's commitment to promoting cooperative excellence, fostering sustainable development, and building lasting partnerships with cooperatives and stakeholders.
                            </p>
                        </div>

                        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
                            {CORE_VALUES.map(({ letter, title, desc, color, accent }) => (
                                <AnimatedItem key={title}>
                                    <article className="public-card public-card-accent p-6 sm:p-7 h-full flex flex-col justify-between" data-accent={accent}>
                                        <div>
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div className={`w-12 h-12 rounded-2xl ${color} font-outfit font-extrabold text-xl flex items-center justify-center shadow-sm`}>
                                                    {letter}
                                                </div>
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                                                    I-SERVE Value
                                                </span>
                                            </div>
                                            <h5 className="font-outfit font-bold text-slate-900 dark:text-white text-lg mb-2">{title}</h5>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                                        </div>
                                    </article>
                                </AnimatedItem>
                            ))}
                        </AnimatedGrid>

                        {/* I-SERVE Summary Commitment Banner */}
                        <div className="public-card p-6 sm:p-8 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                "Through <strong className="text-slate-900 dark:text-white font-semibold not-italic">I-SERVE</strong>, the Municipal Cooperative Development Office reaffirms its commitment to delivering quality public service, strengthening the cooperative movement, and fostering an environment where cooperatives can thrive as partners in building an inclusive, resilient, and progressive municipality. Guided by these core values, the Office remains dedicated to empowering people, promoting good governance, and creating lasting opportunities for sustainable local economic development."
                            </p>
                        </div>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 4: EXECUTIVE LEADERSHIP
                   ══════════════════════════════════════════════════════════ */}
                <section id="leadership" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-5xl mx-auto">
                        <SectionHeading
                            eyebrow="Executive Direction"
                            title="Municipal Leadership"
                            description="Championing good governance, community empowerment, and cooperative growth for the Municipality of Opol."
                        />

                        {/* Leadership Slider */}
                        <div className="relative w-full aspect-[4/5] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60 shadow-lg bg-slate-900">
                            <AnimatePresence mode="wait">
                                {mayorActive ? (
                                    <motion.div
                                        key="mayor"
                                        initial={reducedMotion ? false : { opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={reducedMotion ? {} : { opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute inset-0 flex flex-col sm:flex-row"
                                    >
                                        <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-slate-900 p-6 sm:p-10 flex flex-col justify-center order-2 sm:order-1 relative border-r border-slate-800">
                                            <div className="relative z-10">
                                                <span className="inline-block self-start px-3 py-1 bg-red-900/60 border border-red-500/50 text-red-200 text-xs font-extrabold uppercase tracking-wider rounded-full mb-3">
                                                    Municipal Mayor
                                                </span>
                                                <h3 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white mb-2">Hon. Jay B. Bago</h3>
                                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                                                    Advocating for participatory local governance and robust cooperative empowerment to build a resilient, forward-looking Opol.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-1/2 h-1/2 sm:h-full relative order-1 sm:order-2 bg-slate-950">
                                            <img
                                                src={jayImg}
                                                alt="Municipal Mayor Hon. Jay B. Bago"
                                                className="w-full h-full object-cover object-top"
                                                onError={(e) => {
                                                    e.target.src = 'https://ui-avatars.com/api/?name=Jay+Bago&background=1d4ed8&color=fff&size=512';
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="vice-mayor"
                                        initial={reducedMotion ? false : { opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={reducedMotion ? {} : { opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute inset-0 flex flex-col sm:flex-row"
                                    >
                                        <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-slate-900 p-6 sm:p-10 flex flex-col justify-center order-2 sm:order-1 relative border-r border-slate-800">
                                            <div className="relative z-10">
                                                <span className="inline-block self-start px-3 py-1 bg-blue-900/60 border border-blue-500/50 text-blue-200 text-xs font-extrabold uppercase tracking-wider rounded-full mb-3">
                                                    Municipal Vice Mayor
                                                </span>
                                                <h3 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white mb-2">Hon. Vox Daroy</h3>
                                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                                                    Spearheading legislative measures in the Sangguniang Bayan that support cooperative incentives, social enterprise, and livelihood development.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-1/2 h-1/2 sm:h-full relative order-1 sm:order-2 bg-slate-950">
                                            <img
                                                src={voxImg}
                                                alt="Municipal Vice Mayor Hon. Vox Daroy"
                                                className="w-full h-full object-cover object-top"
                                                onError={(e) => {
                                                    e.target.src = 'https://ui-avatars.com/api/?name=Vox+Daroy&background=dc2626&color=fff&size=512';
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Slide indicators with labels */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMayorActive(true)}
                                    aria-label="Show mayor"
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${mayorActive ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-800 text-white/70 hover:bg-slate-700'
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${mayorActive ? 'bg-red-600' : 'bg-slate-400'}`} />
                                    Mayor Jay Bago
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMayorActive(false)}
                                    aria-label="Show vice mayor"
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${!mayorActive ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-800 text-white/70 hover:bg-slate-700'
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${!mayorActive ? 'bg-blue-600' : 'bg-slate-400'}`} />
                                    Vice Mayor Vox Daroy
                                </button>
                            </div>
                        </div>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 5: MCDO DEDICATED TEAM
                   ══════════════════════════════════════════════════════════ */}
                <section id="team" className="scroll-mt-24 mb-20 sm:mb-28">
                    <AnimatedSection className="max-w-6xl mx-auto">
                        <SectionHeading
                            eyebrow="Our Frontline Personnel"
                            title="MCDO Staff & Technical Team"
                            description="Meet the dedicated team working daily to assist, train, and support cooperative organizations across Opol."
                        />

                        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {TEAM.map(({ name, role, img, fallback, tag, desc }) => (
                                <AnimatedItem key={name}>
                                    <article className="public-card p-6 text-center h-full group flex flex-col justify-between">
                                        <div>
                                            <div className="w-28 h-36 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-700 mb-4 overflow-hidden public-photo-frame border border-slate-200/80 dark:border-slate-700/60 ring-2 ring-transparent group-hover:ring-red-500/20 dark:group-hover:ring-red-400/20 transition-all duration-300 shadow-sm">
                                                <img
                                                    src={img}
                                                    alt={name}
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${fallback}&color=fff&size=300`;
                                                    }}
                                                />
                                            </div>
                                            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">{name}</h3>
                                            <p className="text-[11px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 mt-1 bg-red-50 dark:bg-red-500/15 inline-block px-3 py-0.5 rounded-full">
                                                {role}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3 px-2">
                                                {desc}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tag}</span>
                                        </div>
                                    </article>
                                </AnimatedItem>
                            ))}
                        </AnimatedGrid>
                    </AnimatedSection>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 6: CALL TO ACTION & VISIT US
                   ══════════════════════════════════════════════════════════ */}
                <CtaBanner
                    title="Ready to organize or grow your cooperative in Opol?"
                    description="Visit the Municipal Cooperative Development Office at the Municipal Hall, Poblacion, Opol or submit an inquiry through our digital portal."
                    primaryHref="/contact"
                    primaryLabel="Contact MCDO Office"
                    secondaryHref="/services"
                    secondaryLabel="View Programs & Services"
                />
            </main>
        </PublicLayout>
    );
}

