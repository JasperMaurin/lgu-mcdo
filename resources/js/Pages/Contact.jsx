import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
    PaperAirplaneIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    AcademicCapIcon,
    CalendarDaysIcon,
    UsersIcon,
    BuildingOffice2Icon,
    InformationCircleIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ShieldCheckIcon,
    MapIcon,
    SparklesIcon,
    CheckBadgeIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    BuildingStorefrontIcon,
    TruckIcon,
    BanknotesIcon,
    UserGroupIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';

// ── 14 Barangays of Municipality of Opol ──
const OPOL_BARANGAYS = [
    'Poblacion',
    'Barra',
    'Bonbon',
    'Igpit',
    'Malanang',
    'Patag',
    'Awang',
    'Bagocboc',
    'Cauyonan',
    'Limonda',
    'Luyongbonbon',
    'Nangcaon',
    'Taboc',
    'Tingalan',
];

// ── Inquiry Topics ──
const SUBJECT_OPTIONS = [
    { value: 'Pre-Registration Seminar (PMES)', label: '🎓 Pre-Registration Seminar (PMES)', isSeminar: true },
    { value: 'Registration & Renewal', label: '📋 New Cooperative Registration & CDA Endorsement', isSeminar: false },
    { value: 'Compliance & Monitoring', label: '📊 Annual Reportorial Compliance (CAPR & AFS)', isSeminar: false },
    { value: 'Capacity Building & Training', label: '📚 Mandatory Capacity Building & Training', isSeminar: false },
    { value: 'Financial Advisory', label: '💰 Financial & Accounting Advisory', isSeminar: false },
    { value: 'By-Laws & Governance', label: '⚖️ By-Laws & Charter Amendment Advisory', isSeminar: false },
    { value: 'Other Inquiry', label: '✉️ General Inquiry & Public Consultation', isSeminar: false },
];

// ── Sector Quick Presets for Seminar ──
const SECTOR_PRESETS = [
    {
        id: 'agri',
        name: 'Agriculture & Farmers',
        icon: '🌾',
        desc: 'Producers, agrarian reform beneficiaries, crop & livestock growers',
        sampleName: 'Opol Agri-Producers Cooperative',
        attendees: 18,
        defaultMsg: 'We are organizing an agricultural cooperative for local crop and vegetable farmers in Opol. We would like to schedule a Pre-Registration Seminar (PMES) for our founding members.',
    },
    {
        id: 'transport',
        name: 'Transport & Operators',
        icon: '🚐',
        desc: 'Tricycle, jeepney, and van drivers & operators',
        sampleName: 'Opol Transport Operators Transport Cooperative',
        attendees: 20,
        defaultMsg: 'Our transport operators association wishes to organize into an accredited transport service cooperative under CDA and LTFRB modernization guidelines. We request a PMES orientation.',
    },
    {
        id: 'consumer',
        name: 'Consumers & Retail',
        icon: '🏪',
        desc: 'Community grocers, market vendors, and consumers',
        sampleName: 'Poblacion Community Consumers Cooperative',
        attendees: 15,
        defaultMsg: 'Our community group is planning to establish a consumer and retail cooperative to provide wholesale goods to neighborhood sari-sari stores. We request a PMES session.',
    },
    {
        id: 'credit',
        name: 'Credit & Savings',
        icon: '💼',
        desc: 'Micro-entrepreneurs, women groups, and market vendors',
        sampleName: 'Opol Micro-Entrepreneurs Credit Cooperative',
        attendees: 16,
        defaultMsg: 'We represent small enterprise owners and market vendors forming a savings and credit cooperative for mutual financial assistance. We request a formal PMES schedule.',
    },
];

// ── Quick Prompt Chips for General Inquiries ──
const QUICK_PROMPTS = [
    {
        label: 'CAPR Guidelines & Filing',
        subject: 'Compliance & Monitoring',
        message: 'Hello MCDO team, we need guidance regarding the submission of our Cooperative Annual Progress Report (CAPR) and Audited Financial Statements before the deadline.',
    },
    {
        label: 'New Co-op Requirements Checklist',
        subject: 'Registration & Renewal',
        message: 'Good day. May we request the complete checklist and template forms required for registering a new primary cooperative with the CDA Region X Extension Office?',
    },
    {
        label: 'By-Laws Amendment Consultation',
        subject: 'By-Laws & Governance',
        message: 'We would like to consult on the legal procedure and documentation required to amend our cooperative’s existing By-Laws and increase authorized share capital.',
    },
    {
        label: 'Free Bookkeeping Training',
        subject: 'Capacity Building & Training',
        message: 'We are requesting hands-on training for our newly elected treasurer and bookkeeper on the CDA Standard Chart of Accounts (SCA).',
    },
];

// ── Frequently Asked Questions ──
const FAQ_ITEMS = [
    {
        q: 'Is the Pre-Registration Seminar (PMES) completely free of charge?',
        a: 'Yes! The PMES is 100% free of charge as part of the public service mandate of the Local Government Unit of Opol through the Municipal Cooperative Development Office (MCDO). No fees are collected for materials or certificates.',
        category: 'seminar',
    },
    {
        q: 'What is the minimum number of members needed to organize a cooperative?',
        a: 'Under Republic Act No. 9520 (Philippine Cooperative Code), a primary cooperative must have at least fifteen (15) natural persons who are Filipino citizens of legal age, having a common bond of interest, and residing or working in the intended area of operation.',
        category: 'formation',
    },
    {
        q: 'Can MCDO conduct the PMES seminar on-site in our barangay?',
        a: 'Yes. While seminars are regularly hosted at the Municipal Hall 2nd Floor Training Room, MCDO officers can conduct on-site sessions in your Barangay Hall or community center for groups of 15 or more attendees, coordinated with your Barangay Council.',
        category: 'seminar',
    },
    {
        q: 'When is the deadline for annual reportorial compliance (CAPR)?',
        a: 'Operating cooperatives are legally mandated to submit their Cooperative Annual Progress Report (CAPR), Audited Financial Statements (AFS), and Social Audit Report within one hundred twenty (120) days following the close of each calendar year (on or before April 30 annually).',
        category: 'compliance',
    },
    {
        q: 'How long does it take for MCDO to respond to online inquiries?',
        a: 'Under the Ease of Doing Business Act (RA 11032), our team reviews online submissions within 1 to 2 business days. For seminar requests, an officer will contact your designated organizer to finalize the schedule and confirm attendance.',
        category: 'service',
    },
    {
        q: 'What initial documents should we prepare before attending the PMES?',
        a: 'Bring a preliminary roster of prospective members (names, contact numbers, and signatures), a proposed cooperative name, and 1 valid government-issued ID per interim officer. Formal Articles of Cooperation and By-Laws are drafted after completing the PMES.',
        category: 'formation',
    },
];

// ── Philippine Standard Time & Office Hours Check ──
function getPHTStatus() {
    // Determine Philippine Standard Time (UTC+8)
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const phtTime = new Date(utcTime + 3600000 * 8);

    const day = phtTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour = phtTime.getHours();
    const minute = phtTime.getMinutes();

    const isWeekday = day >= 1 && day <= 5;
    const isOpenHours = (hour > 8 || (hour === 8 && minute >= 0)) && hour < 17;
    const isOpen = isWeekday && isOpenHours;

    const timeString = phtTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    let statusText = 'Closed';
    let subtext = 'Opens Monday at 8:00 AM';

    if (isWeekday) {
        if (hour < 8) {
            statusText = 'Opens Today at 8:00 AM';
            subtext = 'Staff preparing frontline services';
        } else if (isOpenHours) {
            statusText = 'Open Now';
            subtext = 'Closes at 5:00 PM (No Noon Break)';
        } else {
            statusText = 'Closed for Today';
            subtext = day === 5 ? 'Opens Monday at 8:00 AM' : 'Opens tomorrow at 8:00 AM';
        }
    } else {
        statusText = 'Closed for Weekend';
        subtext = 'Opens Monday at 8:00 AM';
    }

    return { isOpen, timeString, statusText, subtext };
}

export default function Contact({ initialSubject = '' }) {
    // Live time state
    const [phtStatus, setPhtStatus] = useState(getPHTStatus());

    useEffect(() => {
        const interval = setInterval(() => {
            setPhtStatus(getPHTStatus());
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Active mode tab: 'seminar' | 'inquiry' | 'track'
    const [activeTab, setActiveTab] = useState('seminar');

    // Sidebar view tab: 'map' | 'commute'
    const [sidebarTab, setSidebarTab] = useState('map');

    // FAQ active index
    const [openFaq, setOpenFaq] = useState(0);

    // Copy to clipboard notification
    const [copiedKey, setCopiedKey] = useState(null);
    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
    };

    // Minimum date: tomorrow in YYYY-MM-DD
    const minDateString = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Pre-Registration Seminar (PMES)',
        cooperative_name: '',
        attendees_count: '15',
        preferred_date: '',
        venue_option: 'Municipal Hall Training Room (2nd Floor)',
        preferred_session: 'Morning (8:00 AM – 12:00 PM)',
        barangay: 'Poblacion',
        message: 'We would like to request a Pre-Registration Seminar (PMES) for our proposed cooperative in Opol.',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitErrors, setSubmitErrors] = useState({});
    const [submittedSuccess, setSubmittedSuccess] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Status Tracking State
    const [trackRef, setTrackRef] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [trackResult, setTrackResult] = useState(null);
    const [trackError, setTrackError] = useState('');

    // Handle initial subject passed via prop or URL query
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const querySubject = urlParams.get('subject') || urlParams.get('type') || initialSubject;
        const queryRef = urlParams.get('ref') || urlParams.get('reference');

        if (queryRef) {
            setTrackRef(queryRef);
            setActiveTab('track');
            executeTrack(queryRef);
        } else if (querySubject) {
            const lower = querySubject.toLowerCase();
            if (lower.includes('seminar') || lower.includes('pmes') || lower.includes('pre-reg')) {
                setActiveTab('seminar');
                setFormData((prev) => ({
                    ...prev,
                    subject: 'Pre-Registration Seminar (PMES)',
                }));
            } else {
                setActiveTab('inquiry');
                const matched = SUBJECT_OPTIONS.find((opt) =>
                    opt.value.toLowerCase().includes(lower) || opt.label.toLowerCase().includes(lower)
                );
                if (matched) {
                    setFormData((prev) => ({ ...prev, subject: matched.value }));
                }
            }
        }
    }, [initialSubject]);

    // Update form subject when switching top tabs
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setErrorMessage('');
        setSubmitErrors({});
        if (tab === 'seminar') {
            setFormData((prev) => ({
                ...prev,
                subject: 'Pre-Registration Seminar (PMES)',
                message: prev.message.includes('Pre-Registration Seminar')
                    ? prev.message
                    : 'We would like to request a Pre-Registration Seminar (PMES) for our proposed cooperative in Opol.',
            }));
        } else if (tab === 'inquiry') {
            setFormData((prev) => ({
                ...prev,
                subject: prev.subject === 'Pre-Registration Seminar (PMES)' ? 'Registration & Renewal' : prev.subject,
                message: prev.message.includes('Pre-Registration Seminar') ? '' : prev.message,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (submitErrors[name]) {
            setSubmitErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    // Apply quick presets for seminar
    const applySectorPreset = (preset) => {
        setFormData((prev) => ({
            ...prev,
            cooperative_name: preset.sampleName,
            attendees_count: preset.attendees.toString(),
            message: preset.defaultMsg,
        }));
    };

    // Apply quick prompts for general inquiries
    const applyQuickPrompt = (prompt) => {
        setFormData((prev) => ({
            ...prev,
            subject: prompt.subject,
            message: prompt.message,
        }));
    };

    // Form submit handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitErrors({});
        setErrorMessage('');

        // Prepend venue & session to message if seminar for comprehensive record
        let finalMessage = formData.message;
        if (activeTab === 'seminar') {
            const venueInfo = `[Venue: ${formData.venue_option} | Session: ${formData.preferred_session} | Barangay: ${formData.barangay}]`;
            if (!finalMessage.includes('[Venue:')) {
                finalMessage = `${venueInfo}\n\n${finalMessage}`;
            }
        }

        const payload = {
            ...formData,
            message: finalMessage,
        };

        try {
            const response = await axios.post('/contact', payload, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data && response.data.success) {
                setSubmittedSuccess(response.data);
            }
        } catch (err) {
            if (err.response && err.response.status === 422 && err.response.data.errors) {
                setSubmitErrors(err.response.data.errors);
                setErrorMessage('Please check the highlighted fields below and try again.');
            } else if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred while processing your request. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reference Tracker lookup function
    const executeTrack = async (refCode) => {
        const query = (refCode || trackRef).trim();
        if (!query) {
            setTrackError('Please enter a valid Reference Number.');
            return;
        }

        setIsTracking(true);
        setTrackError('');
        setTrackResult(null);

        try {
            const res = await axios.get(`/contact/track/${encodeURIComponent(query)}`);
            if (res.data && res.data.found) {
                setTrackResult(res.data.data);
            } else {
                setTrackError(res.data.message || 'Reference number not found.');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setTrackError(err.response.data.message);
            } else {
                setTrackError('Could not locate reference number. Please confirm the code from your confirmation email.');
            }
        } finally {
            setIsTracking(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: 'Pre-Registration Seminar (PMES)',
            cooperative_name: '',
            attendees_count: '15',
            preferred_date: '',
            venue_option: 'Municipal Hall Training Room (2nd Floor)',
            preferred_session: 'Morning (8:00 AM – 12:00 PM)',
            barangay: 'Poblacion',
            message: 'We would like to request a Pre-Registration Seminar (PMES) for our proposed cooperative in Opol.',
        });
        setSubmittedSuccess(null);
        setSubmitErrors({});
        setErrorMessage('');
    };

    return (
        <PublicLayout activePage="contact">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-20 lg:pb-28">
                {/* ── Page Header ── */}
                <PageHeader
                    eyebrow="Official LGU Frontline Desk"
                    title="Contact &"
                    titleLine2="Seminar Request"
                    description="Reach out to the Municipal Cooperative Development Office of Opol. Request a mandatory Pre-Registration Seminar (PMES), submit regulatory inquiries, or track your pending submission."
                />

                {/* ── Top Interactive Contact Cards ── */}
                <AnimatedGrid className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
                    {/* Card 1: Visit Us */}
                    <AnimatedItem>
                        <article className="public-card public-card-accent p-5 sm:p-6 text-center h-full flex flex-col justify-between" data-accent="red">
                            <div>
                                <div className="w-13 h-13 rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400 flex items-center justify-center mx-auto mb-4 ring-1 ring-red-200/60 dark:ring-red-500/20">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-base mb-1">Visit Our Office</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1 font-medium">
                                    Ground Floor, Executive Hall
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Municipal Hall, Poblacion, Opol
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <a
                                    href="https://maps.google.com/?q=Municipal+Hall,+Poblacion,+Opol,+Misamis+Oriental"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
                                >
                                    <span>Get Directions</span>
                                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </article>
                    </AnimatedItem>

                    {/* Card 2: Call Us */}
                    <AnimatedItem>
                        <article className="public-card public-card-accent p-5 sm:p-6 text-center h-full flex flex-col justify-between" data-accent="blue">
                            <div>
                                <div className="w-13 h-13 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 ring-1 ring-blue-200/60 dark:ring-blue-500/20">
                                    <PhoneIcon className="w-6 h-6" />
                                </div>
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-base mb-1">Official Hotlines</h3>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-center gap-2">
                                        <a href="tel:+639063580335" className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                                            0906-358-0335
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy('09063580335', 'p1')}
                                            title="Copy number"
                                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-0.5 transition-colors"
                                        >
                                            {copiedKey === 'p1' ? <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <a href="tel:+639700794574" className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                                            0970-079-4574
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy('09700794574', 'p2')}
                                            title="Copy number"
                                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-0.5 transition-colors"
                                        >
                                            {copiedKey === 'p2' ? <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                                Globe & Smart mobile lines
                            </div>
                        </article>
                    </AnimatedItem>

                    {/* Card 3: Email Us */}
                    <AnimatedItem>
                        <article className="public-card public-card-accent p-5 sm:p-6 text-center h-full flex flex-col justify-between" data-accent="indigo">
                            <div>
                                <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 ring-1 ring-indigo-200/60 dark:ring-indigo-500/20">
                                    <EnvelopeIcon className="w-6 h-6" />
                                </div>
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-base mb-1">Official Email</h3>
                                <div className="flex items-center justify-center gap-1.5">
                                    <a
                                        href="mailto:opolmcdo@gmail.com"
                                        className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors break-all"
                                    >
                                        opolmcdo@gmail.com
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy('opolmcdo@gmail.com', 'email')}
                                        title="Copy email"
                                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 transition-colors shrink-0"
                                    >
                                        {copiedKey === 'email' ? <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                                Reply within 1–2 business days
                            </div>
                        </article>
                    </AnimatedItem>

                    {/* Card 4: Office Status & Live Time */}
                    <AnimatedItem>
                        <article className="public-card public-card-accent p-5 sm:p-6 text-center h-full flex flex-col justify-between" data-accent="emerald">
                            <div>
                                <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-200/60 dark:ring-emerald-500/20">
                                    <ClockIcon className="w-6 h-6" />
                                </div>
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-base mb-1">Office Schedule</h3>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    <span
                                        className={`w-2 h-2 rounded-full ${phtStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
                                    />
                                    <span>{phtStatus.statusText}</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    Mon–Fri • 8:00 AM – 5:00 PM
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                PHT: {phtStatus.timeString} (No Noon Break)
                            </div>
                        </article>
                    </AnimatedItem>
                </AnimatedGrid>

                {/* ── Main Service Hub & Sidebar ── */}
                <AnimatedSection className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left 7 Columns: Interaction Area */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        {/* ── Mode Switcher Tabs ── */}
                        <div className="bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl mb-6 flex flex-wrap sm:flex-nowrap gap-1 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                            <button
                                type="button"
                                onClick={() => handleTabSwitch('seminar')}
                                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'seminar'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <AcademicCapIcon className="w-4 h-4 shrink-0" />
                                <span>PMES Seminar</span>
                                <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-blue-700/80 text-blue-100">
                                    Mandatory
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabSwitch('inquiry')}
                                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'inquiry'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <EnvelopeIcon className="w-4 h-4 shrink-0" />
                                <span>General Inquiry</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabSwitch('track')}
                                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'track'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
                                <span>Track Status</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-extrabold">
                                    Live
                                </span>
                            </button>
                        </div>

                        {/* ── Main Container Box ── */}
                        <div className="public-card p-0 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                            {/* Form Header Strip */}
                            <div className="bg-slate-900 border-b-2 border-red-600 px-6 sm:px-8 py-4.5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {activeTab === 'seminar' && (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                                                <AcademicCapIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="font-outfit text-base font-bold uppercase tracking-wider text-white">
                                                    Pre-Registration Seminar (PMES)
                                                </h2>
                                                <p className="text-[11px] text-slate-400">
                                                    Official CDA-Mandatory Formation Module for Opol
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'inquiry' && (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                                                <PaperAirplaneIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="font-outfit text-base font-bold uppercase tracking-wider text-white">
                                                    Technical Inquiry & Advisory
                                                </h2>
                                                <p className="text-[11px] text-slate-400">
                                                    Regulatory, Governance, Compliance & Assistance
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'track' && (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                                                <MagnifyingGlassIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="font-outfit text-base font-bold uppercase tracking-wider text-white">
                                                    Inquiry & Seminar Request Tracker
                                                </h2>
                                                <p className="text-[11px] text-slate-400">
                                                    Instant status lookup by Reference Code
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded">
                                    LGU Opol Portal
                                </span>
                            </div>

                            {/* ── SUCCESS STATE VIEW ── */}
                            {submittedSuccess ? (
                                <div className="p-6 sm:p-10 text-center">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                                        <CheckCircleIcon className="w-11 h-11" />
                                    </div>

                                    <span className="inline-block text-xs font-mono font-extrabold tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 mb-4">
                                        REF #{submittedSuccess.reference_no}
                                    </span>

                                    <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                        {submittedSuccess.is_seminar
                                            ? 'Seminar Request Submitted!'
                                            : 'Message Received by MCDO!'}
                                    </h3>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                                        Your request has been officially recorded in the municipal registry. An automated acknowledgment receipt was dispatched to{' '}
                                        <strong className="text-slate-900 dark:text-white">
                                            {submittedSuccess.details?.email}
                                        </strong>.
                                    </p>

                                    {/* Summary Card */}
                                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-left max-w-md mx-auto mb-8 text-xs space-y-3 shadow-sm">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Tracking Number:</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {submittedSuccess.reference_no}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(submittedSuccess.reference_no, 'ref_success')}
                                                    className="text-slate-400 hover:text-blue-600"
                                                    title="Copy Reference Number"
                                                >
                                                    {copiedKey === 'ref_success' ? (
                                                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-500" />
                                                    ) : (
                                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Topic / Service:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white text-right">
                                                {submittedSuccess.details?.subject}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Designated Requester:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {submittedSuccess.details?.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Assigned Review Window:</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                Within 24 to 48 Hours
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const ref = submittedSuccess.reference_no;
                                                setSubmittedSuccess(null);
                                                setActiveTab('track');
                                                setTrackRef(ref);
                                                executeTrack(ref);
                                            }}
                                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <MagnifyingGlassIcon className="w-4 h-4" />
                                            <span>Track This Request Live</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleResetForm}
                                            className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-200"
                                        >
                                            <ArrowPathIcon className="w-4 h-4" />
                                            <span>Submit Another Inquiry</span>
                                        </button>
                                    </div>
                                </div>
                            ) : activeTab === 'track' ? (
                                /* ── TRACK REFERENCE TAB VIEW ── */
                                <div className="p-6 sm:p-8">
                                    <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                                            <CheckBadgeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span>Citizen Request Status Lookup</span>
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            Enter the official reference code provided after submission or found in your automated email receipt (e.g., <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-slate-800 dark:text-slate-200">PR-260903-XXXX</code> or <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-slate-800 dark:text-slate-200">INQ-260903-XXXX</code>).
                                        </p>

                                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={trackRef}
                                                    onChange={(e) => setTrackRef(e.target.value.toUpperCase())}
                                                    placeholder="e.g., PR-260903-AB12"
                                                    onKeyDown={(e) => e.key === 'Enter' && executeTrack()}
                                                    className="w-full uppercase font-mono tracking-wider bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                disabled={isTracking}
                                                onClick={() => executeTrack()}
                                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
                                            >
                                                {isTracking ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        <span>Searching...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MagnifyingGlassIcon className="w-4 h-4" />
                                                        <span>Check Status</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {trackError && (
                                            <div className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                                                <ExclamationTriangleIcon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                                <span>{trackError}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lookup Result View */}
                                    {trackResult && (
                                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-slate-900/90 shadow-sm space-y-6">
                                            {/* Top Result Banner */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                                                <div>
                                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                                        Official Reference Code
                                                    </span>
                                                    <h4 className="font-mono text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                        <span>{trackResult.reference_no}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(trackResult.reference_no, 'trk_code')}
                                                            title="Copy code"
                                                            className="text-slate-400 hover:text-blue-600"
                                                        >
                                                            {copiedKey === 'trk_code' ? (
                                                                <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </h4>
                                                </div>

                                                <div>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                                                        trackResult.status === 'Completed' || trackResult.status === 'Approved'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                                            : trackResult.status === 'Scheduled' || trackResult.status === 'In Review'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                                                    }`}>
                                                        <span className="w-2 h-2 rounded-full bg-current" />
                                                        <span>Status: {trackResult.status}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Stepper */}
                                            <div>
                                                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                                                    Processing Milestone
                                                </span>
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                                                    {[
                                                        { step: 1, label: 'Logged', desc: 'Reference Issued', done: true },
                                                        { step: 2, label: 'Officer Review', desc: 'Requirements Check', done: trackResult.status !== 'Pending' },
                                                        { step: 3, label: 'Scheduled / Contacted', desc: 'Direct Confirmation', done: trackResult.status === 'Scheduled' || trackResult.status === 'Completed' },
                                                        { step: 4, label: 'Completed', desc: 'Seminar / Resolved', done: trackResult.status === 'Completed' },
                                                    ].map((st) => (
                                                        <div
                                                            key={st.step}
                                                            className={`p-3 rounded-xl border ${
                                                                st.done
                                                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                                                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                {st.done ? (
                                                                    <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                ) : (
                                                                    <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] flex items-center justify-center">
                                                                        {st.step}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs font-bold">{st.label}</span>
                                                            </div>
                                                            <p className="text-[10px]">{st.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Detailed Attributes */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                                                <div>
                                                    <span className="text-slate-400 block font-medium">Service / Topic</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {trackResult.subject}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block font-medium">Submitted By</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {trackResult.name} ({trackResult.email})
                                                    </span>
                                                </div>
                                                {trackResult.cooperative_name && (
                                                    <div>
                                                        <span className="text-slate-400 block font-medium">Proposed Cooperative</span>
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {trackResult.cooperative_name}
                                                        </span>
                                                    </div>
                                                )}
                                                {trackResult.preferred_date && (
                                                    <div>
                                                        <span className="text-slate-400 block font-medium">Requested Seminar Date</span>
                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                            {trackResult.preferred_date}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-slate-400 block font-medium">Recorded Date</span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {trackResult.created_at} ({trackResult.created_relative})
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                                                <span>Need immediate follow-up? Contact our hotline with this reference code.</span>
                                                <a
                                                    href="tel:+639063580335"
                                                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                                >
                                                    <PhoneIcon className="w-3.5 h-3.5" />
                                                    <span>Call Desk: 0906-358-0335</span>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* ── FORM VIEW (SEMINAR / INQUIRY) ── */
                                <form onSubmit={handleFormSubmit} className="p-6 sm:p-8">
                                    {/* Pre-Registration Seminar Alert & Quick Presets */}
                                    {activeTab === 'seminar' && (
                                        <div className="mb-6 space-y-4">
                                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-start gap-3.5">
                                                <AcademicCapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                                <div className="text-xs">
                                                    <p className="font-bold text-blue-900 dark:text-blue-200">
                                                        Mandatory CDA Pre-Membership Education Seminar (PMES)
                                                    </p>
                                                    <p className="text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                                                        Under RA 9520, founding cooperators must complete this 4-hour module covering cooperative values, responsibilities, and legal rights before CDA accreditation. Provided 100% free by the Municipal Government of Opol.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Sector Quick Presets */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                        <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                                                        <span>Quick-Fill Co-op Sector Templates:</span>
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {SECTOR_PRESETS.map((p) => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => applySectorPreset(p)}
                                                            className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-xs group"
                                                        >
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                <span>{p.icon}</span>
                                                                <span>{p.name}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                                                {p.desc}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* General Inquiry Quick Prompt Chips */}
                                    {activeTab === 'inquiry' && (
                                        <div className="mb-6">
                                            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                                <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                                                <span>Common Technical Inquiry Topics:</span>
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {QUICK_PROMPTS.map((qp, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => applyQuickPrompt(qp)}
                                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-all"
                                                    >
                                                        + {qp.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Error Banner */}
                                    {errorMessage && (
                                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-3">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        {/* Full Name */}
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                Lead Organizer / Full Name <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g., Maria Santos"
                                                className={`w-full bg-slate-50 dark:bg-slate-700/60 border ${
                                                    submitErrors.name
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-slate-200/80 dark:border-slate-600/60 focus:border-blue-500'
                                                } rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                            />
                                            {submitErrors.name && (
                                                <span className="text-[11px] text-red-500 font-medium mt-1 block">
                                                    {submitErrors.name[0]}
                                                </span>
                                            )}
                                        </label>

                                        {/* Email Address */}
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                Official Email Address <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="email"
                                                required
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                className={`w-full bg-slate-50 dark:bg-slate-700/60 border ${
                                                    submitErrors.email
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-slate-200/80 dark:border-slate-600/60 focus:border-blue-500'
                                                } rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                            />
                                            {submitErrors.email && (
                                                <span className="text-[11px] text-red-500 font-medium mt-1 block">
                                                    {submitErrors.email[0]}
                                                </span>
                                            )}
                                        </label>

                                        {/* Phone Number */}
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                Mobile / Telephone Number <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="tel"
                                                required
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="09xx-xxx-xxxx"
                                                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            />
                                            {submitErrors.phone && (
                                                <span className="text-[11px] text-red-500 font-medium mt-1 block">
                                                    {submitErrors.phone[0]}
                                                </span>
                                            )}
                                        </label>

                                        {/* Subject / Service Selection */}
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                Service Topic <span className="text-red-500">*</span>
                                            </span>
                                            <select
                                                required
                                                name="subject"
                                                value={formData.subject}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData((prev) => ({ ...prev, subject: val }));
                                                }}
                                                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                {SUBJECT_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* ── SEMINAR SPECIFIC FIELDS ── */}
                                        {activeTab === 'seminar' && (
                                            <>
                                                {/* Proposed Co-op Name */}
                                                <label className="block sm:col-span-2">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Proposed Cooperative / Organization Name <span className="text-red-500">*</span>
                                                    </span>
                                                    <div className="relative">
                                                        <BuildingOffice2Icon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="text"
                                                            required
                                                            name="cooperative_name"
                                                            value={formData.cooperative_name}
                                                            onChange={handleChange}
                                                            placeholder="e.g., Opol Coastal Fisherfolks & Marketing Cooperative"
                                                            className="w-full pl-11 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                        />
                                                    </div>
                                                </label>

                                                {/* Attendees Count */}
                                                <label className="block">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                                            Founding Attendees <span className="text-red-500">*</span>
                                                        </span>
                                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                                            Min. 15 by law
                                                        </span>
                                                    </div>
                                                    <div className="relative">
                                                        <UsersIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="number"
                                                            required
                                                            min="15"
                                                            max="500"
                                                            name="attendees_count"
                                                            value={formData.attendees_count}
                                                            onChange={handleChange}
                                                            placeholder="15"
                                                            className="w-full pl-11 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                        />
                                                    </div>
                                                </label>

                                                {/* Preferred Date */}
                                                <label className="block">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Preferred Date <span className="text-red-500">*</span>
                                                    </span>
                                                    <div className="relative">
                                                        <CalendarDaysIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="date"
                                                            required
                                                            min={minDateString}
                                                            name="preferred_date"
                                                            value={formData.preferred_date}
                                                            onChange={handleChange}
                                                            className="w-full pl-11 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                        />
                                                    </div>
                                                </label>

                                                {/* Target Barangay */}
                                                <label className="block">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Primary Barangay in Opol
                                                    </span>
                                                    <select
                                                        name="barangay"
                                                        value={formData.barangay}
                                                        onChange={handleChange}
                                                        className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        {OPOL_BARANGAYS.map((bgy) => (
                                                            <option key={bgy} value={bgy}>
                                                                Brgy. {bgy}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>

                                                {/* Preferred Training Venue */}
                                                <label className="block">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Seminar Venue
                                                    </span>
                                                    <select
                                                        name="venue_option"
                                                        value={formData.venue_option}
                                                        onChange={handleChange}
                                                        className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        <option value="Municipal Hall Training Room (2nd Floor)">
                                                            Municipal Hall Training Room (Poblacion)
                                                        </option>
                                                        <option value="On-Site in Our Barangay Hall">
                                                            On-Site in Our Barangay / Community Hall
                                                        </option>
                                                        <option value="Virtual / Hybrid (Zoom or Google Meet)">
                                                            Virtual / Online Session
                                                        </option>
                                                    </select>
                                                </label>
                                            </>
                                        )}

                                        {/* Message Field */}
                                        <label className="block sm:col-span-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                                    {activeTab === 'seminar'
                                                        ? 'Seminar Details, Group Background, & Special Notes'
                                                        : 'Detailed Inquiry / Message'}{' '}
                                                    <span className="text-red-500">*</span>
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {formData.message.length} / 5000 chars
                                                </span>
                                            </div>
                                            <textarea
                                                required
                                                name="message"
                                                rows={activeTab === 'seminar' ? 3 : 5}
                                                maxLength={5000}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder={
                                                    activeTab === 'seminar'
                                                        ? 'Describe your organizers group, proposed initial business line (e.g. rice trading, transport, consumer store), or specific dates...'
                                                        : 'Provide context on your inquiry, cooperative registration number if applicable, or questions for our technical staff...'
                                                }
                                                className={`w-full bg-slate-50 dark:bg-slate-700/60 border ${
                                                    submitErrors.message
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-slate-200/80 dark:border-slate-600/60 focus:border-blue-500'
                                                } rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y`}
                                            />
                                            {submitErrors.message && (
                                                <span className="text-[11px] text-red-500 font-medium mt-1 block">
                                                    {submitErrors.message[0]}
                                                </span>
                                            )}
                                        </label>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700/80 pt-5">
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Protected under Republic Act 10173 (Data Privacy Act of 2012).</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm uppercase tracking-wider"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span>Submitting to MCDO...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        {activeTab === 'seminar'
                                                            ? 'Submit PMES Seminar Request'
                                                            : 'Submit Technical Inquiry'}
                                                    </span>
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right 5 Columns: Sidebar & Office Context */}
                    <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
                        {/* ── Interactive Map & Commuter Guide ── */}
                        <div className="public-card overflow-hidden !p-0">
                            {/* Sub-tabs for Map vs Directions */}
                            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                                <button
                                    type="button"
                                    onClick={() => setSidebarTab('map')}
                                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                                        sidebarTab === 'map'
                                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <MapIcon className="w-4 h-4" />
                                    <span>Interactive Map</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSidebarTab('commute')}
                                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                                        sidebarTab === 'commute'
                                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <TruckIcon className="w-4 h-4" />
                                    <span>Commuter Guide</span>
                                </button>
                            </div>

                            {sidebarTab === 'map' ? (
                                <div>
                                    <iframe
                                        title="MCDO Opol Office Location"
                                        src="https://maps.google.com/maps?q=Municipal+Hall,+Poblacion,+Opol,+Misamis+Oriental&t=m&z=15&ie=UTF8&iwloc=B&output=embed"
                                        width="100%"
                                        height="280"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full block"
                                    />
                                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-slate-400 truncate">
                                            Poblacion Town Plaza Compound
                                        </span>
                                        <a
                                            href="https://maps.google.com/?q=Municipal+Hall,+Poblacion,+Opol,+Misamis+Oriental"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                                        >
                                            <span>Enlarge</span>
                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 text-xs space-y-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                                            <span>From Cagayan de Oro City (Bulua Terminal)</span>
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5">
                                            Board any Opol, El Salvador, or Initao public jeepney/bus along Bulua Westbound Terminal (approx. 10–15 mins). Request the driver to drop you off at <strong>Opol Town Plaza / Poblacion Municipal Hall</strong>.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                            <span>From Western Misamis Oriental (Laguindingan / Iligan)</span>
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5">
                                            Take any CDO-bound Rural Transit bus or public utility van along the National Highway. Alight at the Poblacion Opol intersection across Prince Hypermart.
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-500 dark:text-slate-400">
                                            <strong>Office Location:</strong> Ground Floor, Left Wing (adjacent to the Municipal Agriculture Office and Assessor's Hall).
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Office Schedule & ARTA Commitment ── */}
                        <div className="public-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                                    Weekly Schedule
                                </h3>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                    phtStatus.isOpen
                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${phtStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                    {phtStatus.isOpen ? 'Open Now' : 'Closed'}
                                </span>
                            </div>

                            <ul className="divide-y divide-slate-200/70 dark:divide-slate-700/70 text-xs">
                                <li className="flex items-center justify-between py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-slate-700 dark:text-slate-200 font-medium">Monday – Friday</span>
                                    </div>
                                    <span className="text-slate-900 dark:text-white font-bold">8:00 AM – 5:00 PM</span>
                                </li>
                                <li className="flex items-center justify-between py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <span className="text-slate-600 dark:text-slate-300">Noon Break (12–1 PM)</span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Continuous Service</span>
                                </li>
                                <li className="flex items-center justify-between py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <span className="text-slate-500 dark:text-slate-400">Saturday & Sunday</span>
                                    </div>
                                    <span className="text-slate-400 dark:text-slate-500">Closed</span>
                                </li>
                                <li className="flex items-center justify-between py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <span className="text-slate-500 dark:text-slate-400">Official Holidays</span>
                                    </div>
                                    <span className="text-slate-400 dark:text-slate-500">Closed</span>
                                </li>
                            </ul>

                            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                                    <span>Ease of Doing Business Pledge</span>
                                </p>
                                <p className="leading-relaxed text-[10px] text-slate-500 dark:text-slate-400">
                                    Compliant with RA 11032 (Zero-Contact / Citizen's Charter). Simple inquiries evaluated within 3 business days; complex transactions within 7 business days.
                                </p>
                            </div>
                        </div>

                        {/* ── Inter-Agency Directory ── */}
                        <div className="public-card p-6">
                            <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                <BuildingOffice2Icon className="w-4 h-4 text-red-600" />
                                <span>Emergency & Inter-Agency Lines</span>
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="font-bold text-slate-900 dark:text-white">CDA Region X Extension Office</div>
                                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Cagayan de Oro City</div>
                                    <div className="font-mono text-blue-600 dark:text-blue-400 font-semibold mt-1">(088) 856-4293 / 856-4294</div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="font-bold text-slate-900 dark:text-white">Municipal Mayor's Office</div>
                                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Executive Building, 2nd Floor</div>
                                    <div className="font-mono text-blue-600 dark:text-blue-400 font-semibold mt-1">mayoropol@gmail.com</div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="font-bold text-slate-900 dark:text-white">MDRRMO Opol (Emergency Rescue)</div>
                                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">24/7 Operations Center</div>
                                    <div className="font-mono text-red-600 dark:text-red-400 font-semibold mt-1">0917-123-OPOL (6765)</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </AnimatedSection>

                {/* ── Frequently Asked Questions (FAQ) Accordion ── */}
                <AnimatedSection className="max-w-4xl mx-auto mt-16 sm:mt-20">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
                            <QuestionMarkCircleIcon className="w-4 h-4" />
                            <span>Frequently Asked Questions</span>
                        </div>
                        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            Cooperative Formation & Inquiries FAQ
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-2">
                            Quick answers to common questions regarding PMES requirements, cooperative registration steps, and reportorial timelines.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {FAQ_ITEMS.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div
                                    key={index}
                                    className="public-card !p-0 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        <span className="font-outfit font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                            {faq.q}
                                        </span>
                                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                                            {isOpen ? (
                                                <ChevronUpIcon className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </AnimatedSection>
            </main>
        </PublicLayout>
    );
}
