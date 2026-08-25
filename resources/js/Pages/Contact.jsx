import { useState, useEffect } from 'react';
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
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';

const CONTACT_CARDS = [
    { icon: MapPinIcon, title: 'Visit Us', lines: ['Municipal Hall, Poblacion', 'Opol, Misamis Oriental'], color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/15', accent: 'red' },
    { icon: PhoneIcon, title: 'Call Us', lines: ['0906-358-0335', '0970-079-4574'], color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/15', hrefs: ['tel:+639063580335', 'tel:+639700794574'], accent: 'blue' },
    { icon: EnvelopeIcon, title: 'Email Us', lines: ['opolmcdo@gmail.com'], color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/15', hrefs: ['mailto:opolmcdo@gmail.com'], accent: 'indigo' },
    { icon: ClockIcon, title: 'Office Hours', lines: ['Mon–Fri', '8:00 AM – 5:00 PM'], color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15', accent: 'amber' },
];

const SUBJECT_OPTIONS = [
    { value: 'Pre-Registration Seminar (PMES)', label: '⭐ Pre-Registration Seminar (PMES)', isSeminar: true },
    { value: 'Registration & Renewal', label: 'Registration & Renewal', isSeminar: false },
    { value: 'Compliance & Monitoring', label: 'Compliance & Monitoring', isSeminar: false },
    { value: 'Capacity Building & Training', label: 'Capacity Building & Training', isSeminar: false },
    { value: 'Financial Advisory', label: 'Financial Advisory', isSeminar: false },
    { value: 'Other Inquiry', label: 'Other Inquiry', isSeminar: false },
];

function getOfficeStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
}

export default function Contact({ initialSubject = '' }) {
    const isOpen = getOfficeStatus();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Pre-Registration Seminar (PMES)',
        cooperative_name: '',
        attendees_count: '',
        preferred_date: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitErrors, setSubmitErrors] = useState({});
    const [submittedSuccess, setSubmittedSuccess] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Pre-populate subject from URL query parameters if present
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const querySubject = urlParams.get('subject') || urlParams.get('type') || initialSubject;

        if (querySubject) {
            const lower = querySubject.toLowerCase();
            if (lower.includes('seminar') || lower.includes('pmes') || lower.includes('pre-reg')) {
                setFormData((prev) => ({
                    ...prev,
                    subject: 'Pre-Registration Seminar (PMES)',
                    message: prev.message || 'We would like to request a Pre-Registration Seminar (PMES) for our proposed cooperative in Opol.'
                }));
            } else if (lower.includes('reg')) {
                setFormData((prev) => ({ ...prev, subject: 'Registration & Renewal' }));
            } else if (lower.includes('comp')) {
                setFormData((prev) => ({ ...prev, subject: 'Compliance & Monitoring' }));
            } else if (lower.includes('train') || lower.includes('cap')) {
                setFormData((prev) => ({ ...prev, subject: 'Capacity Building & Training' }));
            } else if (lower.includes('fin')) {
                setFormData((prev) => ({ ...prev, subject: 'Financial Advisory' }));
            }
        }
    }, [initialSubject]);

    const isPreRegSeminar = formData.subject === 'Pre-Registration Seminar (PMES)';

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

    const handleSubjectChange = (e) => {
        const val = e.target.value;
        setFormData((prev) => ({
            ...prev,
            subject: val,
            message: val === 'Pre-Registration Seminar (PMES)' && !prev.message
                ? 'We would like to request a Pre-Registration Seminar (PMES) for our proposed cooperative in Opol.'
                : prev.message
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitErrors({});
        setErrorMessage('');

        try {
            const response = await axios.post('/contact', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.data && response.data.success) {
                setSubmittedSuccess(response.data);
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 5000);
            }
        } catch (err) {
            if (err.response && err.response.status === 422 && err.response.data.errors) {
                setSubmitErrors(err.response.data.errors);
                setErrorMessage('Please check the form for errors and try again.');
            } else if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred while sending your request. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: 'Pre-Registration Seminar (PMES)',
            cooperative_name: '',
            attendees_count: '',
            preferred_date: '',
            message: '',
        });
        setSubmittedSuccess(null);
        setSubmitErrors({});
        setErrorMessage('');
    };

    return (
        <PublicLayout activePage="contact">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                <PageHeader
                    eyebrow="Get in touch"
                    title="Contact &"
                    titleLine2="Seminar Request"
                    description="Reach out to MCDO Opol for inquiries or submit a request for a mandatory Pre-Registration Seminar (PMES)."
                />

                {/* ── Contact Info Cards ── */}
                <AnimatedGrid className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
                    {CONTACT_CARDS.map(({ icon: Icon, title, lines, color, hrefs, accent }) => (
                        <AnimatedItem key={title}>
                            <article className="public-card public-card-accent p-5 sm:p-6 text-center h-full" data-accent={accent}>
                                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mx-auto mb-4 ring-1 ring-slate-200/50 dark:ring-slate-600/30`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h4 className="font-outfit font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
                                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {lines.map((line, i) =>
                                        hrefs?.[i] ? (
                                            <a key={line} href={hrefs[i]} className="block hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">{line}</a>
                                        ) : (
                                            <span key={line} className="block">{line}</span>
                                        )
                                    )}
                                </div>
                            </article>
                        </AnimatedItem>
                    ))}
                </AnimatedGrid>

                {/* ── Form + Sidebar ── */}
                <AnimatedSection className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
                    <div className="lg:col-span-3">
                        <div className="public-card p-0 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                            {/* Form header strip */}
                            <div className="bg-slate-900 border-b-2 border-red-600 px-6 sm:px-8 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isPreRegSeminar ? (
                                        <AcademicCapIcon className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <PaperAirplaneIcon className="w-5 h-5 text-red-500" />
                                    )}
                                    <h2 className="font-outfit text-base font-bold uppercase tracking-wider text-white">
                                        {isPreRegSeminar ? 'Pre-Registration Seminar Request' : 'Send Us a Message'}
                                    </h2>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded">
                                    Official LGU Portal
                                </span>
                            </div>

                            {/* Success State View */}
                            {submittedSuccess ? (
                                <div className="p-6 sm:p-10 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-200 dark:border-emerald-800">
                                        <CheckCircleIcon className="w-9 h-9" />
                                    </div>
                                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 mb-3">
                                        Reference #{submittedSuccess.reference_no}
                                    </span>
                                    <h3 className="font-outfit text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                                        {submittedSuccess.is_seminar ? 'Seminar Request Sent!' : 'Message Sent Successfully!'}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
                                        A notification has been delivered to the MCDO office, and an automated confirmation receipt was emailed to{' '}
                                        <strong className="text-slate-900 dark:text-white">{submittedSuccess.details?.email}</strong>.
                                    </p>

                                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-left max-w-md mx-auto mb-8 text-xs space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Topic:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{submittedSuccess.details?.subject}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Requester:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{submittedSuccess.details?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Expected Response:</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Within 1 business day</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleResetForm}
                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
                                        >
                                            <ArrowPathIcon className="w-4 h-4" />
                                            <span>Send Another Request</span>
                                        </button>
                                        <a
                                            href="/"
                                            className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-200"
                                        >
                                            <span>Back to Home</span>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="p-6 sm:p-8">
                                    {/* Top Alert when Pre-Registration Seminar is chosen */}
                                    {isPreRegSeminar && (
                                        <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-start gap-3.5">
                                            <AcademicCapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                            <div className="text-xs">
                                                <p className="font-bold text-blue-900 dark:text-blue-200">
                                                    Pre-Registration Seminar (PMES) Service
                                                </p>
                                                <p className="text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">
                                                    MCDO Opol conducts orientation and capacity building for prospective cooperatives in Opol to satisfy CDA registration requirements. Fill out your details below to schedule your seminar.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {errorMessage && (
                                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-3">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Full Name */}
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Juan Dela Cruz"
                                                className={`w-full bg-slate-50 dark:bg-slate-700/60 border ${
                                                    submitErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200/80 dark:border-slate-600/60 focus:border-red-500'
                                                } rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all`}
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
                                                Email Address <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="email"
                                                required
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                className={`w-full bg-slate-50 dark:bg-slate-700/60 border ${
                                                    submitErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200/80 dark:border-slate-600/60 focus:border-red-500'
                                                } rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all`}
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
                                                Phone Number
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="09xx-xxx-xxxx"
                                                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                            {submitErrors.phone && (
                                                <span className="text-[11px] text-red-500 font-medium mt-1 block">
                                                    {submitErrors.phone[0]}
                                                </span>
                                            )}
                                        </label>

                                        {/* Subject Dropdown */}
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                Subject / Request Topic <span className="text-red-500">*</span>
                                            </span>
                                            <select
                                                required
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleSubjectChange}
                                                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                            >
                                                {SUBJECT_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Dynamic Fields for Pre-Registration Seminar */}
                                        {isPreRegSeminar && (
                                            <>
                                                <label className="block sm:col-span-2">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Proposed Cooperative / Organization Name
                                                    </span>
                                                    <div className="relative">
                                                        <BuildingOffice2Icon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="text"
                                                            name="cooperative_name"
                                                            value={formData.cooperative_name}
                                                            onChange={handleChange}
                                                            placeholder="e.g., Opol Farmers & Transport Cooperative"
                                                            className="w-full pl-11 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                                        />
                                                    </div>
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Estimated Attendees / Officers
                                                    </span>
                                                    <div className="relative">
                                                        <UsersIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            name="attendees_count"
                                                            value={formData.attendees_count}
                                                            onChange={handleChange}
                                                            placeholder="e.g., 15"
                                                            className="w-full pl-11 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                                        />
                                                    </div>
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                        Preferred Seminar Date
                                                    </span>
                                                    <div className="relative">
                                                        <CalendarDaysIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="date"
                                                            name="preferred_date"
                                                            value={formData.preferred_date}
                                                            onChange={handleChange}
                                                            className="w-full pl-11 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600/60 rounded-xl pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                                        />
                                                    </div>
                                                </label>
                                            </>
                                        )}

                                        {/* Message */}
                                        <label className="block sm:col-span-2">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                                                {isPreRegSeminar ? 'Seminar Request Details / Notes' : 'Message'} <span className="text-red-500">*</span>
                                            </span>
                                            <textarea
                                                required
                                                name="message"
                                                rows="4"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder={
                                                    isPreRegSeminar
                                                        ? 'Provide details about your group, target barangay/sector, or questions about the pre-registration seminar...'
                                                        : 'Tell us how we can help...'
                                                }
                                                className={`w-full bg-slate-50 dark:bg-slate-700/60 border ${
                                                    submitErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-200/80 dark:border-slate-600/60 focus:border-red-500'
                                                } rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-y`}
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
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <InformationCircleIcon className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>Emails are processed directly by MCDO staff.</span>
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white font-bold py-3 px-8 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span>Sending Request...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{isPreRegSeminar ? 'Submit Seminar Request' : 'Send Message'}</span>
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <aside className="lg:col-span-2 space-y-5 sm:space-y-6">
                        {/* Map */}
                        <div className="public-card overflow-hidden !p-0 hover:!translate-y-0">
                            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
                                <MapPinIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Find our office</h3>
                            </div>
                            <iframe
                                title="MCDO Opol Office Location"
                                src="https://maps.google.com/maps?q=Municipal+Hall,+Poblacion,+Opol,+Misamis+Oriental&t=m&z=15&ie=UTF8&iwloc=B&output=embed"
                                width="100%"
                                height="280"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        </div>

                        {/* Office Hours */}
                        <div className="public-card p-6 hover:!translate-y-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white">Office Hours</h3>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                    isOpen
                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`} style={isOpen ? { animation: 'pulse-dot 2s infinite' } : {}} />
                                    {isOpen ? 'Open Now' : 'Closed'}
                                </span>
                            </div>
                            <ul className="divide-y divide-slate-200/60 dark:divide-slate-700/60 text-sm">
                                {[
                                    ['Monday – Friday', '8:00 AM – 5:00 PM', true, 'bg-emerald-500'],
                                    ['Saturday', 'Closed', false, 'bg-slate-300 dark:bg-slate-600'],
                                    ['Sunday', 'Closed', false, 'bg-slate-300 dark:bg-slate-600'],
                                    ['Holidays', 'Closed', false, 'bg-slate-300 dark:bg-slate-600'],
                                ]?.map(([day, hours, open, dotColor]) => (
                                    <li key={day} className="flex items-center justify-between py-2.5 gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                                            <span className="text-slate-600 dark:text-slate-300">{day}</span>
                                        </div>
                                        <span className={open ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-400 dark:text-slate-500'}>{hours}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </AnimatedSection>
            </main>

            <AnimatePresence>
                {toastVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2"
                    >
                        <CheckCircleIcon className="w-5 h-5 shrink-0" />
                        <span>Your request has been submitted and confirmation sent via email!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </PublicLayout>
    );
}
