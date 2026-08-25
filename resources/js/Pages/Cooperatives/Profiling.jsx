import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Components/Dashboard/layout/DashboardLayout';
import { useTheme } from '../../hooks/useTheme';
import {
    BuildingOffice2Icon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    ArrowPathIcon,
    DocumentArrowDownIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    UserGroupIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    Squares2X2Icon,
    ListBulletIcon,
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    IdentificationIcon,
    CalendarIcon,
    TagIcon,
    CheckIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';

const ALL_SERVICES = [
    'Agricultural Support',
    'Copra Marketing and Trading',
    'Insurance Services',
    'Marketing Support',
    'Rice and Grocery Retail',
    'Social Services',
    'Technical Assistance',
    'Consumer Store',
    'Financial Services',
    'Lending/Credit Assistance for Member',
    'Other',
    'Skills Training and Livelihood Assistance',
    'Supply Chain',
    'Training Programs'
];

const OPOL_BARANGAYS = [
    'Awang',
    'Bagocboc',
    'Barra',
    'Bonbon',
    'Cauyonan',
    'Igpit',
    'Limonda',
    'Luyongbonbon',
    'Malanang',
    'Nangcaon',
    'Patag',
    'Poblacion',
    'Taboc',
    'Tingalan'
];

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <motion.div
        whileHover={{ y: -3 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm relative overflow-hidden flex items-center justify-between"
    >
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
            <p className={`text-xs font-medium mt-1 ${colorClass}`}>{subtitle}</p>
        </div>
        <div className={`p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 ${colorClass}`}>
            <Icon className="w-7 h-7" />
        </div>
    </motion.div>
);

const ComplianceBadge = ({ status }) => {
    const config = {
        'Compliant': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50', icon: CheckCircleIcon },
        'Under Audit': { bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50', icon: ClockIcon },
        'Non-Compliant': { bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50', icon: ExclamationTriangleIcon },
        'Pending Renewal': { bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50', icon: ClockIcon },
    };
    const style = config[status] || config['Compliant'];
    const IconComponent = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style.bg}`}>
            <IconComponent className="w-3.5 h-3.5" />
            {status}
        </span>
    );
};

const AssetBadge = ({ classification }) => {
    const styles = {
        Micro: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        Small: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400',
        Medium: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400',
        Large: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400',
    };
    return (
        <span className={`px-2 py-0.5 text-[11px] font-medium rounded border border-transparent ${styles[classification] || styles['Micro']}`}>
            {classification} Scale
        </span>
    );
};

export default function CooperativeProfiling({ profiles = [] }) {
    const { isDark, toggleTheme, mounted } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Filters & View mode state
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [isLoading, setIsLoading] = useState(false);

    // Modal states
    const [viewProfile, setViewProfile] = useState(null);
    const [activeDetailTab, setActiveDetailTab] = useState('overview');

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [activeFormTab, setActiveFormTab] = useState('basic');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    // Dynamic Printable Statistical Report Analytics
    const reportStats = useMemo(() => {
        const total = profiles.length;
        let micro = 0, small = 0, medium = 0, large = 0;
        let compliant = 0, underAudit = 0, nonCompliant = 0, pending = 0;
        let totalMembers = 0, totalMale = 0, totalFemale = 0, totalYouth = 0, totalSeniorIp = 0;
        let totalAssets = 0, totalCBU = 0, totalSurplus = 0;

        profiles.forEach(p => {
            const assets = parseFloat(p.economic_performance?.totalAssets) || parseFloat(p.total_assets) || 0;
            const cbu = parseFloat(p.economic_performance?.cbuCollected) || parseFloat(p.share_capital) || 0;
            const surplus = parseFloat(p.economic_performance?.netSurplus) || 0;

            let scale = p.asset_classification;
            if (!scale) {
                if (assets > 100000000) scale = 'Large';
                else if (assets > 15000000) scale = 'Medium';
                else if (assets > 3000000) scale = 'Small';
                else scale = 'Micro';
            }

            if (scale === 'Micro') micro++;
            else if (scale === 'Small') small++;
            else if (scale === 'Medium') medium++;
            else if (scale === 'Large') large++;

            const status = p.compliance_status || 'Compliant';
            if (status === 'Compliant') compliant++;
            else if (status === 'Under Audit') underAudit++;
            else if (status === 'Non-Compliant') nonCompliant++;
            else if (status === 'Pending Renewal') pending++;

            const m = parseInt(p.members_male) || 0;
            const f = parseInt(p.members_female) || 0;
            totalMale += m;
            totalFemale += f;
            totalMembers += (p.total_members || (m + f));
            totalYouth += parseInt(p.members_youth) || 0;
            totalSeniorIp += parseInt(p.members_senior_ip) || 0;

            totalAssets += assets;
            totalCBU += cbu;
            totalSurplus += surplus;
        });

        const avgAssets = total > 0 ? totalAssets / total : 0;
        const avgMembers = total > 0 ? Math.round(totalMembers / total) : 0;

        return {
            total,
            micro, small, medium, large,
            compliant, underAudit, nonCompliant, pending,
            totalMembers, totalMale, totalFemale, totalYouth, totalSeniorIp,
            totalAssets, totalCBU, totalSurplus,
            avgAssets, avgMembers
        };
    }, [profiles]);

    const FORM_TABS = ['basic', 'membership', 'org', 'services', 'financials'];
    const FORM_STEPS = [
        { key: 'basic', label: 'Basic Info', desc: 'Identity & Registration', icon: IdentificationIcon },
        { key: 'membership', label: 'Membership', desc: 'Demographics & Counts', icon: UserGroupIcon },
        { key: 'org', label: 'Organization', desc: 'Board & Governance', icon: BriefcaseIcon },
        { key: 'services', label: 'Services', desc: 'Programs & Operations', icon: TagIcon },
        { key: 'financials', label: 'Performance', desc: 'Assets & Financials', icon: BanknotesIcon },
    ];

    const currentStepIndex = FORM_TABS.indexOf(activeFormTab);

    const handleNextTab = () => {
        const currentIndex = FORM_TABS.indexOf(activeFormTab);
        if (activeFormTab === 'basic') {
            const errors = {};
            if (!formData.name.trim()) errors.name = 'Cooperative name is required';
            if (!formData.cda_registration_no.trim()) errors.cda_registration_no = 'CDA Registration No. is required';
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }
            setFormErrors({});
        }
        if (currentIndex < FORM_TABS.length - 1) {
            setActiveFormTab(FORM_TABS[currentIndex + 1]);
        }
    };

    const handlePrevTab = () => {
        const currentIndex = FORM_TABS.indexOf(activeFormTab);
        if (currentIndex > 0) {
            setActiveFormTab(FORM_TABS[currentIndex - 1]);
        }
    };


    // Form state with all input fields requested
    const [formData, setFormData] = useState({
        cda_registration_no: '',
        date_of_registration: '',
        name: '',
        coop_type: '',
        barangay: '',
        address: '',
        chairperson: '',
        contact_email: '',
        contact_number: '',
        members_male: 0,
        members_female: 0,
        members_youth: 0,
        members_senior_ip: 0,
        total_assets: 0,
        share_capital: 0,
        asset_classification: '',
        compliance_status: '',
        coc_issued_date: '',
        tin_number: '',
        notes: '',
        org_structure: {
            board: ['', '', '', '', ''],
            management: { manager: '', bookkeeper: '', secretary: '', treasurer: '', loanManager: '' },
            committees: {
                audit: ['', '', ''],
                election: ['', '', ''],
                credit: ['', '', ''],
                ethics: ['', '', ''],
                mediation: ['', '', ''],
                education: ['', '', ''],
                gad: ['', '', ''],
                gadFocal: ''
            }
        },
        services_offered: [],
        economic_performance: {
            totalAssets: 0,
            netSurplus: 0,
            cbuCollected: 0,
            annualGrossIncome: 0,
            authorizeCapital: 0,
            subscribeCapital: 0,
            businessOperationDesc: '',
            businessOperationAmount: 0,
            serviceFeesDesc: '',
            serviceFeesAmount: 0,
            otherIncomeDesc: '',
            otherIncomeAmount: 0
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const formModalRef = useRef(null);
    const viewModalRef = useRef(null);
    const deleteModalRef = useRef(null);

    // Keyboard accessibility: Escape to close modals
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (deleteConfirmId) setDeleteConfirmId(null);
                else if (formModalOpen) setFormModalOpen(false);
                else if (viewProfile) setViewProfile(null);
                else if (reportModalOpen) setReportModalOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [deleteConfirmId, formModalOpen, viewProfile, reportModalOpen]);

    // Body scroll lock when any modal is open
    useEffect(() => {
        const anyModalOpen = !!viewProfile || formModalOpen || !!deleteConfirmId || reportModalOpen;
        if (anyModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [viewProfile, formModalOpen, deleteConfirmId, reportModalOpen]);

    const sectors = ['Multipurpose', 'Agriculture', 'Transport', 'Fishery', 'Credit', 'Consumer', 'Advocacy'];

    const filteredProfiles = useMemo(() => {
        return profiles.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.cda_registration_no.toLowerCase().includes(search.toLowerCase()) ||
                (p.chairperson && p.chairperson.toLowerCase().includes(search.toLowerCase())) ||
                p.barangay.toLowerCase().includes(search.toLowerCase());
            const matchesType = typeFilter === 'All' || p.coop_type === typeFilter;
            const matchesStatus = statusFilter === 'All' || p.compliance_status === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [search, typeFilter, statusFilter, profiles]);

    const totalMembersSum = useMemo(() => profiles.reduce((sum, p) => sum + (p.total_members || 0), 0), [profiles]);
    const totalAssetsSum = useMemo(() => profiles.reduce((sum, p) => sum + (parseFloat(p.total_assets) || 0), 0), [profiles]);
    const compliantCount = useMemo(() => profiles.filter((p) => p.compliance_status === 'Compliant').length, [profiles]);

    const calculatedFormMembers = useMemo(() => {
        return (parseInt(formData.members_male) || 0) + (parseInt(formData.members_female) || 0);
    }, [formData.members_male, formData.members_female]);

    const handleRefresh = () => {
        setIsLoading(true);
        router.reload({ onFinish: () => setIsLoading(false) });
    };

    const openCreateModal = () => {
        setEditingProfile(null);
        setActiveFormTab('basic');
        setFormData({
            cda_registration_no: '',
            date_of_registration: '',
            name: '',
            coop_type: '',
            barangay: '',
            address: '',
            chairperson: '',
            contact_email: '',
            contact_number: '',
            members_male: '',
            members_female: '',
            members_youth: '',
            members_senior_ip: '',
            total_assets: '',
            share_capital: '',
            asset_classification: '',
            compliance_status: '',
            coc_issued_date: '',
            tin_number: '',
            notes: '',
            org_structure: {
                board: ['', '', '', '', ''],
                management: { manager: '', bookkeeper: '', secretary: '', treasurer: '', loanManager: '' },
                committees: {
                    audit: ['', '', ''],
                    election: ['', '', ''],
                    credit: ['', '', ''],
                    ethics: ['', '', ''],
                    mediation: ['', '', ''],
                    education: ['', '', ''],
                    gad: ['', '', ''],
                    gadFocal: ''
                }
            },
            services_offered: [],
            economic_performance: {
                totalAssets: '',
                netSurplus: '',
                cbuCollected: '',
                annualGrossIncome: '',
                authorizeCapital: '',
                subscribeCapital: '',
                businessOperationDesc: '',
                businessOperationAmount: '',
                serviceFeesDesc: '',
                serviceFeesAmount: '',
                otherIncomeDesc: '',
                otherIncomeAmount: ''
            }
        });
        setFormModalOpen(true);
    };

    const openEditModal = (p) => {
        setEditingProfile(p);
        setActiveFormTab('basic');
        setFormData({
            cda_registration_no: p.cda_registration_no || '',
            date_of_registration: p.date_of_registration ? p.date_of_registration.split('T')[0] : '',
            name: p.name || '',
            coop_type: p.coop_type || '',
            barangay: p.barangay || '',
            address: p.address || '',
            chairperson: p.chairperson || '',
            contact_email: p.contact_email || '',
            contact_number: p.contact_number || '',
            members_male: p.members_male || 0,
            members_female: p.members_female || 0,
            members_youth: p.members_youth || 0,
            members_senior_ip: p.members_senior_ip || 0,
            total_assets: p.total_assets || 0,
            share_capital: p.share_capital || 0,
            asset_classification: p.asset_classification || '',
            compliance_status: p.compliance_status || '',
            coc_issued_date: p.coc_issued_date ? p.coc_issued_date.split('T')[0] : '',
            tin_number: p.tin_number || '',
            notes: p.notes || '',
            org_structure: p.org_structure || {
                board: ['', '', '', '', ''],
                management: { manager: '', bookkeeper: '', secretary: '', treasurer: '', loanManager: '' },
                committees: {
                    audit: ['', '', ''],
                    election: ['', '', ''],
                    credit: ['', '', ''],
                    ethics: ['', '', ''],
                    mediation: ['', '', ''],
                    education: ['', '', ''],
                    gad: ['', '', ''],
                    gadFocal: ''
                }
            },
            services_offered: p.services_offered || [],
            economic_performance: p.economic_performance || {
                totalAssets: p.total_assets || 0,
                netSurplus: 0,
                cbuCollected: p.share_capital || 0,
                annualGrossIncome: 0,
                authorizeCapital: 0,
                subscribeCapital: 0,
                businessOperationDesc: '',
                businessOperationAmount: 0,
                serviceFeesDesc: '',
                serviceFeesAmount: 0,
                otherIncomeDesc: '',
                otherIncomeAmount: 0
            }
        });
        setFormModalOpen(true);
    };

    const toggleServiceCheckbox = (serviceName) => {
        setFormData((prev) => {
            const current = prev.services_offered || [];
            if (current.includes(serviceName)) {
                return { ...prev, services_offered: current.filter((s) => s !== serviceName) };
            } else {
                return { ...prev, services_offered: [...current, serviceName] };
            }
        });
    };

    const handleFinalSaveClick = (e) => {
        if (e) e.preventDefault();

        // Basic validation
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Cooperative name is required';
        if (!formData.cda_registration_no.trim()) errors.cda_registration_no = 'CDA Registration No. is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setActiveFormTab('basic');
            return;
        }

        setFormErrors({});
        setIsSubmitting(true);

        const payload = {
            ...formData,
            total_assets: parseFloat(formData.economic_performance?.totalAssets) || parseFloat(formData.total_assets) || 0,
            share_capital: parseFloat(formData.economic_performance?.cbuCollected) || parseFloat(formData.share_capital) || 0,
        };

        if (editingProfile) {
            router.put(`/cooperatives/profiling/${editingProfile.id}`, payload, {
                onSuccess: () => {
                    setFormModalOpen(false);
                    setIsSubmitting(false);
                    setToastNotification({
                        title: 'Profile Record Updated',
                        message: 'Cooperative profile updated and confirmation email sent!'
                    });
                    setTimeout(() => setToastNotification(null), 7000);
                },
                onError: () => setIsSubmitting(false),
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/cooperatives/profiling', payload, {
                onSuccess: () => {
                    setFormModalOpen(false);
                    setIsSubmitting(false);
                    setToastNotification({
                        title: 'Profile Saved & Registered',
                        message: 'Cooperative successfully attached to MCDO system and confirmation email sent!'
                    });
                    setTimeout(() => setToastNotification(null), 7000);
                },
                onError: () => setIsSubmitting(false),
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteConfirmId) return;
        router.delete(`/cooperatives/profiling/${deleteConfirmId}`, {
            onSuccess: () => {
                setDeleteConfirmId(null);
                if (viewProfile && viewProfile.id === deleteConfirmId) setViewProfile(null);
            },
        });
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val || 0);
    };

    return (
        <>
            <Head title="Cooperative Profiling - MCDO" />
            <DashboardLayout
                isDark={isDark}
                onToggleTheme={toggleTheme}
                mounted={mounted}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileOpen}
                onMobileOpen={() => setMobileOpen(true)}
                onMobileClose={() => setMobileOpen(false)}
                onLogout={() => {
                    window.location.href = '/login';
                }}
            >
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 font-sans text-slate-800 dark:text-slate-100">

                    {/* Header Banner */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                                    <BuildingOffice2Icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cooperative Profiling System</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Census, regulatory compliance, asset classification, and directory of Opol cooperatives.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                                title="Refresh data"
                            >
                                <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={() => setReportModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm"
                            >
                                <PrinterIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Export Printable Report
                            </button>
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                <PlusIcon className="w-5 h-5" /> Add New Profile
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            title="Total Registered Profiles"
                            value={profiles.length}
                            subtitle="Recorded in MCDO database"
                            icon={BuildingOffice2Icon}
                            colorClass="text-blue-600 dark:text-blue-400"
                        />
                        <StatCard
                            title="Fully Compliant Co-ops"
                            value={`${compliantCount} / ${profiles.length}`}
                            subtitle={`${profiles.length > 0 ? Math.round((compliantCount / profiles.length) * 100) : 0}% compliance rate`}
                            icon={ShieldCheckIcon}
                            colorClass="text-emerald-600 dark:text-emerald-400"
                        />
                        <StatCard
                            title="Total Combined Members"
                            value={totalMembersSum.toLocaleString()}
                            subtitle="Active co-op members"
                            icon={UserGroupIcon}
                            colorClass="text-amber-600 dark:text-amber-400"
                        />
                        <StatCard
                            title="Aggregate Assets Value"
                            value={formatCurrency(totalAssetsSum)}
                            subtitle="Cumulative total capitalization"
                            icon={BanknotesIcon}
                            colorClass="text-indigo-600 dark:text-indigo-400"
                        />
                    </div>

                    {/* Main Profiling Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">

                        {/* Toolbar */}
                        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
                            <div className="flex flex-wrap gap-3 flex-1">
                                <div className="relative w-full sm:w-80">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search Coop Name, CDA Reg, Chairperson..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-shadow"
                                    />
                                </div>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="text-sm border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="All">All Categories / Sectors</option>
                                    {sectors.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="text-sm border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="All">All Compliance Statuses</option>
                                    <option value="Compliant">Compliant</option>
                                    <option value="Under Audit">Under Audit</option>
                                    <option value="Non-Compliant">Non-Compliant</option>
                                    <option value="Pending Renewal">Pending Renewal</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                    >
                                        <ListBulletIcon className="w-4 h-4" /> Table
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                    >
                                        <Squares2X2Icon className="w-4 h-4" /> Grid
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Views */}
                        {viewMode === 'table' ? (
                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">CDA Reg. No.</th>
                                            <th className="px-6 py-4">Cooperative Name & Sector</th>
                                            <th className="px-6 py-4">Barangay Location</th>
                                            <th className="px-6 py-4">Chairperson</th>
                                            <th className="px-6 py-4">Members</th>
                                            <th className="px-6 py-4">Assets & Scale</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {filteredProfiles.length > 0 ? (
                                            filteredProfiles.map((p) => (
                                                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400 font-semibold">
                                                        {p.cda_registration_no}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                            {p.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                                            {p.coop_type}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                                            <MapPinIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                            {p.barangay}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                                        <div className="font-medium text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                            <UserIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                            {p.chairperson || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800 dark:text-slate-200">{p.total_members}</div>
                                                        <div className="text-[10px] text-slate-500">M: {p.members_male} | F: {p.members_female}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{formatCurrency(p.total_assets)}</div>
                                                        <AssetBadge classification={p.asset_classification} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <ComplianceBadge status={p.compliance_status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => { setViewProfile(p); setActiveDetailTab('overview'); }}
                                                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openEditModal(p)}
                                                                className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors"
                                                                title="Edit Profile"
                                                            >
                                                                <PencilSquareIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(p.id)}
                                                                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                                                title="Delete Profile"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <BuildingOffice2Icon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                                                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No cooperative profiles found</h3>
                                                        <p className="text-slate-500 text-sm mt-1 mb-4">Try clearing filters or search query.</p>
                                                        <button
                                                            onClick={() => {
                                                                setSearch('');
                                                                setTypeFilter('All');
                                                                setStatusFilter('All');
                                                            }}
                                                            className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-semibold rounded-xl text-xs"
                                                        >
                                                            Reset Filters
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredProfiles.length > 0 ? (
                                    filteredProfiles.map((p) => (
                                        <div
                                            key={p.id}
                                            className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-red-400/50 transition-all shadow-sm"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div>
                                                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-1.5">
                                                            {p.coop_type}
                                                        </span>
                                                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">{p.name}</h3>
                                                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">{p.cda_registration_no}</p>
                                                    </div>
                                                    <ComplianceBadge status={p.compliance_status} />
                                                </div>

                                                <div className="space-y-2 mt-4 text-xs text-slate-600 dark:text-slate-300">
                                                    <p className="flex items-center gap-2">
                                                        <MapPinIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                        <span className="truncate">{p.address || p.barangay}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <UserIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span className="truncate">Chairperson: {p.chairperson || 'N/A'}</span>
                                                    </p>
                                                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 block">Total Members</span>
                                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{p.total_members}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] text-slate-400 block">Total Assets</span>
                                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(p.total_assets)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                                                <AssetBadge classification={p.asset_classification} />
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => { setViewProfile(p); setActiveDetailTab('overview'); }}
                                                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-700/60 rounded-lg hover:bg-slate-200 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-slate-500">
                                        No cooperatives match your criteria.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>

            {/* View Profile Details Modal */}
            <AnimatePresence>
                {viewProfile && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setViewProfile(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="view-modal-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 10 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            ref={viewModalRef}
                            className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <BuildingOffice2Icon className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 id="view-modal-title" className="text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">{viewProfile.name}</h2>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{viewProfile.cda_registration_no}</p>
                                            <ComplianceBadge status={viewProfile.compliance_status} />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewProfile(null)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                                    aria-label="Close modal"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 px-5 gap-1 text-xs font-medium overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                                {[
                                    { key: 'overview', label: 'Basic Info', icon: IdentificationIcon },
                                    { key: 'members', label: 'Membership', icon: UserGroupIcon },
                                    { key: 'org', label: 'Organization', icon: BriefcaseIcon },
                                    { key: 'services', label: 'Programs & Services', icon: TagIcon },
                                    { key: 'financials', label: 'Performance', icon: BanknotesIcon },
                                ].map(({ key, label, icon: TabIcon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveDetailTab(key)}
                                        className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${activeDetailTab === key
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                                            : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        <TabIcon className="w-3.5 h-3.5" />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm text-slate-700 dark:text-slate-300">
                                {activeDetailTab === 'overview' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <IdentificationIcon className="w-4 h-4 mr-1 text-blue-500" />
                                                    <span>CDA Registration No.</span>
                                                </div>
                                                <p className="font-mono font-bold text-slate-900 dark:text-white text-xs">{viewProfile.cda_registration_no || 'N/A'}</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <CalendarIcon className="w-4 h-4 mr-1 text-emerald-500" />
                                                    <span>Date of Registration</span>
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white text-xs">
                                                    {viewProfile.date_of_registration ? (typeof viewProfile.date_of_registration === 'string' ? viewProfile.date_of_registration.split('T')[0] : viewProfile.date_of_registration) : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <TagIcon className="w-4 h-4 mr-1 text-amber-500" />
                                                    <span>Coop Sector / Type</span>
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white text-xs">{viewProfile.coop_type}</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <CheckCircleIcon className="w-4 h-4 mr-1 text-teal-500" />
                                                    <span>COC Issued Date</span>
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white text-xs">
                                                    {viewProfile.coc_issued_date ? (typeof viewProfile.coc_issued_date === 'string' ? viewProfile.coc_issued_date.split('T')[0] : viewProfile.coc_issued_date) : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <IdentificationIcon className="w-4 h-4 mr-1 text-indigo-500" />
                                                    <span>TIN Number</span>
                                                </div>
                                                <p className="font-mono font-bold text-slate-900 dark:text-white text-xs">{viewProfile.tin_number || 'N/A'}</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <ShieldCheckIcon className="w-4 h-4 mr-1 text-purple-500" />
                                                    <span>Compliance Status</span>
                                                </div>
                                                <div className="mt-0.5"><ComplianceBadge status={viewProfile.compliance_status} /></div>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 sm:col-span-2 lg:col-span-3">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <MapPinIcon className="w-4 h-4 mr-1 text-rose-500" />
                                                    <span>Complete Address</span>
                                                </div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{viewProfile.address || viewProfile.barangay || 'N/A'}</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <UserIcon className="w-4 h-4 mr-1 text-blue-500" />
                                                    <span>Chairperson / Contact</span>
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white text-xs">{viewProfile.chairperson || 'N/A'}</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <PhoneIcon className="w-4 h-4 mr-1 text-emerald-500" />
                                                    <span>Phone Number</span>
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white text-xs">{viewProfile.contact_number || 'N/A'}</p>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center text-slate-400 text-xs mb-1">
                                                    <EnvelopeIcon className="w-4 h-4 mr-1 text-amber-500" />
                                                    <span>Email Address</span>
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{viewProfile.contact_email || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {viewProfile.notes && (
                                            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                                                <h5 className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" /> Official Notes & Remarks
                                                </h5>
                                                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">{viewProfile.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeDetailTab === 'members' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                                                <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">Total Members</p>
                                                <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-200 mt-1">{viewProfile.total_members || 0}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                                                <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">Male</p>
                                                <p className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200 mt-1">{viewProfile.members_male || 0}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                                                <p className="text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">Female</p>
                                                <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-200 mt-1">{viewProfile.members_female || 0}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                                                <p className="text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">Youth (&lt;30 yrs)</p>
                                                <p className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 mt-1">{viewProfile.members_youth || 0}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                                                <div>
                                                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">Senior Citizens & IPs</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Special sector representation</p>
                                                </div>
                                                <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">{viewProfile.members_senior_ip || 0}</p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Gender Balance Ratio</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        {viewProfile.total_members > 0 ? `${Math.round(((viewProfile.members_female || 0) / viewProfile.total_members) * 100)}% Female` : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                                                    {viewProfile.total_members > 0 ? `${Math.round(((viewProfile.members_male || 0) / viewProfile.total_members) * 100)}% M` : '0%'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeDetailTab === 'org' && (() => {
                                    const org = viewProfile.org_structure || {};
                                    const board = org.board || [];
                                    const mgmt = org.management || {};
                                    const committees = org.committees || {};

                                    const committeeList = [
                                        { key: 'audit', title: 'Audit & Inventory Committee', icon: ShieldCheckIcon, color: 'text-blue-600 dark:text-blue-400' },
                                        { key: 'election', title: 'Election Committee', icon: IdentificationIcon, color: 'text-indigo-600 dark:text-indigo-400' },
                                        { key: 'credit', title: 'Credit & Loans Committee', icon: BanknotesIcon, color: 'text-emerald-600 dark:text-emerald-400' },
                                        { key: 'ethics', title: 'Ethics Committee', icon: ShieldCheckIcon, color: 'text-purple-600 dark:text-purple-400' },
                                        { key: 'mediation', title: 'Mediation & Conciliation Committee', icon: UserGroupIcon, color: 'text-amber-600 dark:text-amber-400' },
                                        { key: 'education', title: 'Education & Training Committee', icon: AcademicCapIcon, color: 'text-teal-600 dark:text-teal-400' },
                                        { key: 'gad', title: 'Gender & Development (GAD) Committee', icon: UserIcon, color: 'text-rose-600 dark:text-rose-400' },
                                    ];

                                    return (
                                        <div className="space-y-6">
                                            {/* Board of Directors */}
                                            <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <BriefcaseIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    Board of Directors (BOD)
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                    {[0, 1, 2, 3, 4].map((idx) => {
                                                        const name = board[idx];
                                                        return (
                                                            <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5">
                                                                <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <div className="min-w-0 flex-1">
                                                                    <span className="text-[10px] text-slate-400 block">Director {idx + 1}</span>
                                                                    <span className={`text-xs font-bold truncate block ${name ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 italic'}`}>
                                                                        {name || 'Vacant / Not specified'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Executive Officers / Management */}
                                            <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <UserGroupIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                    Key Executive & Management Officers
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                    {[
                                                        { label: 'General Manager', val: mgmt.manager },
                                                        { label: 'Bookkeeper', val: mgmt.bookkeeper },
                                                        { label: 'Secretary', val: mgmt.secretary },
                                                        { label: 'Treasurer', val: mgmt.treasurer },
                                                        { label: 'Loan / Credit Manager', val: mgmt.loanManager },
                                                    ].map(({ label, val }) => (
                                                        <div key={label} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                                                            <span className="text-[10px] text-slate-400 block font-semibold">{label}</span>
                                                            <span className={`text-xs font-bold truncate block ${val ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 italic'}`}>
                                                                {val || 'Unassigned'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Statutory Standing Committees */}
                                            <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <ShieldCheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                        Statutory Standing Committees
                                                    </h4>
                                                    {committees.gadFocal && (
                                                        <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg text-[11px] font-bold">
                                                            GAD Focal Officer: {committees.gadFocal}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                                    {committeeList.map(({ key, title, icon: CommIcon, color }) => {
                                                        const members = committees[key] || [];
                                                        const activeMembers = Array.isArray(members) ? members.filter(m => m && m.trim() !== '') : [];

                                                        return (
                                                            <div key={key} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <CommIcon className={`w-4 h-4 ${color}`} />
                                                                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{title}</h5>
                                                                </div>
                                                                <div className="space-y-1 pl-6">
                                                                    {activeMembers.length > 0 ? (
                                                                        activeMembers.map((m, mIdx) => (
                                                                            <div key={mIdx} className="flex items-center gap-2 text-xs">
                                                                                <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-bold flex items-center justify-center">
                                                                                    {mIdx + 1}
                                                                                </span>
                                                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{m}</span>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-[11px] text-slate-400 italic">No committee members registered.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {activeDetailTab === 'services' && (
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                            <TagIcon className="w-4 h-4 text-red-500" />
                                            Registered Programs & Operational Services Offered
                                        </h4>

                                        {(viewProfile.services_offered || []).length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {viewProfile.services_offered.map((s) => (
                                                    <div key={s} className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300">
                                                        <CheckIcon className="w-4 h-4 text-red-600 shrink-0 stroke-[3]" />
                                                        <span>{s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-400 text-xs italic">
                                                No active operational services recorded for this profile.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeDetailTab === 'financials' && (() => {
                                    const econ = viewProfile.economic_performance || {};
                                    return (
                                        <div className="space-y-5">
                                            {/* Portfolio Summary Cards */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                                                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">Total Assets</p>
                                                    <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">{formatCurrency(viewProfile.total_assets)}</p>
                                                    <div className="mt-2"><AssetBadge classification={viewProfile.asset_classification} /></div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
                                                    <p className="text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">Capital Build-Up (CBU)</p>
                                                    <p className="text-xl font-extrabold text-teal-900 dark:text-teal-200 mt-1">{formatCurrency(viewProfile.share_capital)}</p>
                                                    <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-2">Member equity capitalization</p>
                                                </div>

                                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                                                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">Net Surplus</p>
                                                    <p className="text-xl font-extrabold text-blue-900 dark:text-blue-200 mt-1">{formatCurrency(econ.netSurplus)}</p>
                                                    <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-2">Annual surplus generated</p>
                                                </div>

                                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                    <p className="text-slate-400 text-xs font-medium">Annual Gross Income</p>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{formatCurrency(econ.annualGrossIncome)}</p>
                                                </div>

                                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                    <p className="text-slate-400 text-xs font-medium">Authorized Share Capital</p>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{formatCurrency(econ.authorizeCapital)}</p>
                                                </div>

                                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                                                    <p className="text-slate-400 text-xs font-medium">Subscribed Share Capital</p>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{formatCurrency(econ.subscribeCapital)}</p>
                                                </div>
                                            </div>

                                            {/* Revenue Streams Breakdown */}
                                            <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-3">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                    <BanknotesIcon className="w-4 h-4 text-emerald-600" /> Primary Revenue & Income Streams
                                                </h4>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                                                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Business Operations</span>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{econ.businessOperationDesc || 'None specified'}</p>
                                                        <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs mt-1">{formatCurrency(econ.businessOperationAmount)}</p>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                                                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Service Fees & Rentals</span>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{econ.serviceFeesDesc || 'None specified'}</p>
                                                        <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs mt-1">{formatCurrency(econ.serviceFeesAmount)}</p>
                                                    </div>

                                                    {econ.otherIncomeDesc && (
                                                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 sm:col-span-2">
                                                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Other Income Streams</span>
                                                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{econ.otherIncomeDesc}</p>
                                                            <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs mt-1">{formatCurrency(econ.otherIncomeAmount)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(viewProfile.id)}
                                    className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1.5 px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
                                >
                                    <TrashIcon className="w-3.5 h-3.5" /> Delete
                                </button>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => {
                                            const p = viewProfile;
                                            setViewProfile(null);
                                            openEditModal(p);
                                        }}
                                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => setViewProfile(null)}
                                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Redesigned Government-Grade Form Modal Wizard */}
            <AnimatePresence>
                {formModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-md"
                        onClick={() => setFormModalOpen(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="form-modal-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            ref={formModalRef}
                            className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] relative"
                        >
                            {/* Top Decorative Gradient Accent Bar */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600" />

                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${editingProfile ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20'}`}>
                                        {editingProfile ? <PencilSquareIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 id="form-modal-title" className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                {editingProfile ? 'Edit Cooperative Profile' : 'Add New Cooperative Profile'}
                                            </h2>
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-full">
                                                Registry Wizard
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {editingProfile ? 'Modify existing official record in MCDO database' : 'Complete the step-by-step municipal cooperative registry form'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFormModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-all shrink-0"
                                    aria-label="Close modal"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stepper Wizard Progress Header */}
                            <div className="bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5">
                                <div className="hidden sm:grid grid-cols-5 gap-2 relative">
                                    {FORM_STEPS.map((stepItem, idx) => {
                                        const StepIcon = stepItem.icon;
                                        const isCompleted = idx < currentStepIndex;
                                        const isActive = idx === currentStepIndex;

                                        return (
                                            <button
                                                key={stepItem.key}
                                                type="button"
                                                onClick={() => {
                                                    // Allow jumping back to completed steps freely
                                                    if (idx < currentStepIndex) {
                                                        setActiveFormTab(stepItem.key);
                                                    } else if (idx > currentStepIndex) {
                                                        handleNextTab();
                                                    }
                                                }}
                                                className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all relative ${isActive
                                                    ? 'bg-white dark:bg-slate-900 border border-blue-500/30 dark:border-blue-500/40 shadow-sm'
                                                    : isCompleted
                                                        ? 'hover:bg-white/60 dark:hover:bg-slate-900/40 cursor-pointer'
                                                        : 'opacity-60 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-all ${isCompleted
                                                        ? 'bg-emerald-500 text-white shadow-sm'
                                                        : isActive
                                                            ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-500/20 dark:ring-blue-400/20'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                                        }`}
                                                >
                                                    {isCompleted ? <CheckIcon className="w-4 h-4 stroke-[3]" /> : idx + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {stepItem.label}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 hidden md:block">
                                                        {stepItem.desc}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Mobile Stepper Progress Bar */}
                                <div className="sm:hidden space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">{currentStepIndex + 1}</span>
                                            {FORM_STEPS[currentStepIndex].label}
                                        </span>
                                        <span className="text-[11px] text-slate-400">Step {currentStepIndex + 1} of 5</span>
                                    </div>
                                </div>

                                {/* Animated Linear Progress Line */}
                                <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${((currentStepIndex + 1) / FORM_STEPS.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Form Body Content */}
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                                        e.preventDefault();
                                    }
                                }}
                                className="p-6 overflow-y-auto flex-1 space-y-5 text-xs"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFormTab}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* STEP 1: BASIC INFO */}
                                        {activeFormTab === 'basic' && (
                                            <div className="space-y-5">
                                                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-start gap-3">
                                                    <IdentificationIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                                    <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                                                        Enter official registration credentials issued by the Cooperative Development Authority (CDA). Fields marked with <span className="text-red-500 font-bold">*</span> are required for legal registration.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="sm:col-span-2">
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                                                            Name of Cooperative <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                required
                                                                placeholder="e.g. Opol Farmers Agricultural Cooperative"
                                                                value={formData.name}
                                                                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: '' }); }}
                                                                className={`w-full px-3.5 py-2.5 border rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${formErrors.name ? 'border-red-400 dark:border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700'}`}
                                                            />
                                                        </div>
                                                        {formErrors.name && (
                                                            <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                                                                <ExclamationTriangleIcon className="w-3.5 h-3.5" />{formErrors.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                                                            CDA Registration No. <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="CDA-REG-XXXX-XXXXXX"
                                                            value={formData.cda_registration_no}
                                                            onChange={(e) => { setFormData({ ...formData, cda_registration_no: e.target.value }); if (formErrors.cda_registration_no) setFormErrors({ ...formErrors, cda_registration_no: '' }); }}
                                                            className={`w-full px-3.5 py-2.5 border rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${formErrors.cda_registration_no ? 'border-red-400 dark:border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700'}`}
                                                        />
                                                        {formErrors.cda_registration_no && (
                                                            <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                                                                <ExclamationTriangleIcon className="w-3.5 h-3.5" />{formErrors.cda_registration_no}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Date of Registration</label>
                                                        <input
                                                            type="date"
                                                            value={formData.date_of_registration}
                                                            onChange={(e) => setFormData({ ...formData, date_of_registration: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Type / Sector of Cooperative</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Multipurpose, Credit, Agriculture"
                                                            value={formData.coop_type}
                                                            onChange={(e) => setFormData({ ...formData, coop_type: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Barangay Location</label>
                                                        <select
                                                            value={formData.barangay}
                                                            onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
                                                        >
                                                            <option value="">Select Barangay in Opol...</option>
                                                            {OPOL_BARANGAYS.map((bgy) => (
                                                                <option key={bgy} value={bgy}>
                                                                    {bgy}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Complete Official Address</label>
                                                        <textarea
                                                            rows="2"
                                                            placeholder="Purok / Zone, Barangay, Opol, Misamis Oriental"
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Primary Contact Person / Chairperson</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter full name"
                                                            value={formData.chairperson}
                                                            onChange={(e) => setFormData({ ...formData, chairperson: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Contact Phone Number</label>
                                                        <input
                                                            type="text"
                                                            placeholder="+63 9XX XXX XXXX"
                                                            value={formData.contact_number}
                                                            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                                        />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Official Email Address</label>
                                                        <input
                                                            type="email"
                                                            placeholder="cooperative@example.com"
                                                            value={formData.contact_email}
                                                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                                        />
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                                                            <EnvelopeIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                            An official confirmation email with the MCDO logo will be sent to this email upon saving.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 2: MEMBERSHIP */}
                                        {activeFormTab === 'membership' && (
                                            <div className="space-y-5">
                                                {/* Calculated total banner */}
                                                <div className="p-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Total Regular Members</p>
                                                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">{calculatedFormMembers}</h3>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Automatically computed from Male + Female tally.</p>
                                                    </div>
                                                    <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-md">
                                                        <UserGroupIcon className="w-7 h-7" />
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <UserIcon className="w-4 h-4 text-blue-500" />
                                                        Gender & Demographic Breakdown
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Male Members</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={formData.members_male}
                                                                onChange={(e) => setFormData({ ...formData, members_male: e.target.value })}
                                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>

                                                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Female Members</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={formData.members_female}
                                                                onChange={(e) => setFormData({ ...formData, members_female: e.target.value })}
                                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>

                                                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Youth Members (below 30 yrs)</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={formData.members_youth}
                                                                onChange={(e) => setFormData({ ...formData, members_youth: e.target.value })}
                                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>

                                                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Senior Citizens / IPs</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={formData.members_senior_ip}
                                                                onChange={(e) => setFormData({ ...formData, members_senior_ip: e.target.value })}
                                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 3: ORGANIZATION */}
                                        {activeFormTab === 'org' && (
                                            <div className="space-y-6">
                                                {/* Board of Directors Card */}
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                                                        Board of Directors (BOD)
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {[0, 1, 2, 3, 4].map((idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-lg bg-slate-200/70 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Board Member ${idx + 1} Name`}
                                                                    value={formData.org_structure.board[idx] || ''}
                                                                    onChange={(e) => {
                                                                        const arr = [...formData.org_structure.board];
                                                                        arr[idx] = e.target.value;
                                                                        setFormData({ ...formData, org_structure: { ...formData.org_structure, board: arr } });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Key Management Staff */}
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <UserGroupIcon className="w-4 h-4 text-indigo-600" />
                                                        Key Executive & Management Officers
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {[
                                                            { key: 'manager', label: 'General Manager' },
                                                            { key: 'bookkeeper', label: 'Bookkeeper' },
                                                            { key: 'secretary', label: 'Secretary' },
                                                            { key: 'treasurer', label: 'Treasurer' },
                                                            { key: 'loanManager', label: 'Loan / Credit Manager' },
                                                        ].map(({ key, label }) => (
                                                            <div key={key}>
                                                                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1 text-[11px]">{label}</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Enter ${label} Name`}
                                                                    value={formData.org_structure.management[key] || ''}
                                                                    onChange={(e) => {
                                                                        setFormData({
                                                                            ...formData,
                                                                            org_structure: {
                                                                                ...formData.org_structure,
                                                                                management: { ...formData.org_structure.management, [key]: e.target.value }
                                                                            }
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Statutory Committees */}
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                                                        Statutory Standing Committees
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {[
                                                            { key: 'audit', name: 'Audit & Inventory Committee' },
                                                            { key: 'election', name: 'Election Committee' },
                                                            { key: 'credit', name: 'Credit & Loans Committee' },
                                                            { key: 'ethics', name: 'Ethics Committee' },
                                                            { key: 'mediation', name: 'Mediation & Conciliation Committee' },
                                                            { key: 'education', name: 'Education & Training Committee' },
                                                            { key: 'gad', name: 'Gender & Development (GAD) Committee' },
                                                        ].map(({ key, name }) => (
                                                            <div key={key} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2">
                                                                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{name}</p>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {[0, 1, 2].map((mIdx) => (
                                                                        <input
                                                                            key={mIdx}
                                                                            type="text"
                                                                            placeholder={`Member ${mIdx + 1}`}
                                                                            value={formData.org_structure.committees[key]?.[mIdx] || ''}
                                                                            onChange={(e) => {
                                                                                const arr = [...(formData.org_structure.committees[key] || ['', '', ''])];
                                                                                arr[mIdx] = e.target.value;
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    org_structure: {
                                                                                        ...formData.org_structure,
                                                                                        committees: { ...formData.org_structure.committees, [key]: arr }
                                                                                    }
                                                                                });
                                                                            }}
                                                                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-800">
                                                            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1 text-xs">GAD Focal Officer</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter GAD focal officer name"
                                                                value={formData.org_structure.committees.gadFocal || ''}
                                                                onChange={(e) => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        org_structure: {
                                                                            ...formData.org_structure,
                                                                            committees: { ...formData.org_structure.committees, gadFocal: e.target.value }
                                                                        }
                                                                    });
                                                                }}
                                                                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 4: SERVICES */}
                                        {activeFormTab === 'services' && (
                                            <div className="space-y-4">
                                                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Programs & Operational Services</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Select all services and programs provided by the cooperative to its members and community.</p>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    {ALL_SERVICES.map((service) => {
                                                        const isChecked = (formData.services_offered || []).includes(service);
                                                        return (
                                                            <motion.div
                                                                key={service}
                                                                whileHover={{ scale: 1.01 }}
                                                                whileTap={{ scale: 0.99 }}
                                                                onClick={() => toggleServiceCheckbox(service)}
                                                                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${isChecked
                                                                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold shadow-sm'
                                                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                                                                    }`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`}>
                                                                    {isChecked && <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />}
                                                                </div>
                                                                <span className="text-xs">{service}</span>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 5: PERFORMANCE & FINANCIALS */}
                                        {activeFormTab === 'financials' && (
                                            <div className="space-y-6">
                                                {/* Financial Overview Card */}
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <BanknotesIcon className="w-4 h-4 text-emerald-600" />
                                                        Capitalization & Asset Portfolio (PHP ₱)
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Total Assets (₱)</label>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.economic_performance.totalAssets}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, totalAssets: e.target.value } })}
                                                                className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Capital Build-Up (CBU) (₱)</label>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.economic_performance.cbuCollected}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, cbuCollected: e.target.value } })}
                                                                className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Net Surplus (₱)</label>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.economic_performance.netSurplus}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, netSurplus: e.target.value } })}
                                                                className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Annual Gross Income (₱)</label>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.economic_performance.annualGrossIncome}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, annualGrossIncome: e.target.value } })}
                                                                className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Authorized Share Capital (₱)</label>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.economic_performance.authorizeCapital}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, authorizeCapital: e.target.value } })}
                                                                className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Subscribed Share Capital (₱)</label>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.economic_performance.subscribeCapital}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, subscribeCapital: e.target.value } })}
                                                                className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Regulatory Status */}
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                                    <label className="font-bold text-slate-900 dark:text-white block mb-1.5 text-xs uppercase tracking-wider">
                                                        CDA Regulatory Compliance Status
                                                    </label>
                                                    <select
                                                        value={formData.compliance_status}
                                                        onChange={(e) => setFormData({ ...formData, compliance_status: e.target.value })}
                                                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                    >
                                                        <option value="Compliant">✓ Compliant (Good Standing)</option>
                                                        <option value="Under Audit">⏳ Under Audit / Examination</option>
                                                        <option value="Non-Compliant">⚠️ Non-Compliant</option>
                                                        <option value="Pending Renewal">🔄 Pending Renewal</option>
                                                    </select>
                                                </div>

                                                {/* Revenue Streams */}
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                                        Primary Revenue & Income Streams
                                                    </h4>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">BUSINESS OPERATIONS</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Lending, Rice Trading"
                                                                value={formData.economic_performance.businessOperationDesc}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, businessOperationDesc: e.target.value } })}
                                                                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
                                                            />
                                                            <div className="relative">
                                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">₱</span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Annual Amount"
                                                                    value={formData.economic_performance.businessOperationAmount}
                                                                    onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, businessOperationAmount: e.target.value } })}
                                                                    className="w-full pl-7 px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">SERVICE FEES & RENTALS</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Equipment Rental, Service Fee"
                                                                value={formData.economic_performance.serviceFeesDesc}
                                                                onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, serviceFeesDesc: e.target.value } })}
                                                                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
                                                            />
                                                            <div className="relative">
                                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">₱</span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Annual Amount"
                                                                    value={formData.economic_performance.serviceFeesAmount}
                                                                    onChange={(e) => setFormData({ ...formData, economic_performance: { ...formData.economic_performance, serviceFeesAmount: e.target.value } })}
                                                                    className="w-full pl-7 px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Footer Action Toolbar */}
                                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 w-full sm:w-auto">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                        <span>Step <strong>{currentStepIndex + 1}</strong> of 5 — {FORM_STEPS[currentStepIndex].label}</span>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setFormModalOpen(false)}
                                            disabled={isSubmitting}
                                            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        {activeFormTab !== 'basic' && (
                                            <button
                                                type="button"
                                                onClick={handlePrevTab}
                                                disabled={isSubmitting}
                                                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5"
                                            >
                                                <ChevronLeftIcon className="w-4 h-4" /> Back
                                            </button>
                                        )}

                                        {activeFormTab !== 'financials' ? (
                                            <button
                                                type="button"
                                                onClick={handleNextTab}
                                                disabled={isSubmitting}
                                                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                                            >
                                                Next Step <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleFinalSaveClick}
                                                disabled={isSubmitting}
                                                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Saving Record...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheckIcon className="w-4 h-4" />
                                                        <span>{editingProfile ? 'Update Official Profile' : 'Save Profile Record'}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setDeleteConfirmId(null)}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            ref={deleteModalRef}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrashIcon className="w-6 h-6" />
                            </div>
                            <h2 id="delete-modal-title" className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Delete Cooperative Profile?</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 text-xs leading-relaxed">
                                Are you sure you want to remove this cooperative from the MCDO profiling system? This action cannot be undone.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors text-xs flex items-center justify-center gap-1.5"
                                >
                                    <TrashIcon className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Toast Notification */}
            <AnimatePresence>
                {toastNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-5 right-5 z-[200] max-w-md bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-2xl rounded-2xl p-4 flex items-start gap-3.5"
                    >
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{toastNotification.title}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{toastNotification.message}</p>
                        </div>
                        <button
                            onClick={() => setToastNotification(null)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Official Executive Statistical Printable Report Modal */}
            <AnimatePresence>
                {reportModalOpen && (
                    <div
                        className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
                        onClick={() => setReportModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 15 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-100 dark:bg-slate-900 w-full max-w-7xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh] my-auto"
                        >
                            {/* Modal Control Header (Hidden when printing) */}
                            <div className="px-6 py-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 no-print">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                        <PrinterIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Printable Statistical Profiling Report (Landscape)</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Wide landscape executive summary and complete cooperative registry breakdown.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
                                    >
                                        <PrinterIcon className="w-4 h-4" /> Print / Save as PDF
                                    </button>
                                    <button
                                        onClick={() => setReportModalOpen(false)}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Printable Document Container */}
                            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-200/50 dark:bg-slate-950/50">
                                <div
                                    id="printable-report"
                                    className="bg-white text-slate-900 p-6 sm:p-8 max-w-[1120px] mx-auto shadow-xl rounded-xl border border-slate-200 space-y-3.5 font-sans"
                                    style={{ color: '#0f172a' }}
                                >
                                    {/* Print-specific style tag */}
                                    <style>{`
                                        @media print {
                                            html, body {
                                                height: 100% !important;
                                                overflow: hidden !important;
                                                background: #ffffff !important;
                                            }
                                            body * {
                                                visibility: hidden !important;
                                            }
                                            #printable-report, #printable-report * {
                                                visibility: visible !important;
                                            }
                                            #printable-report {
                                                position: absolute !important;
                                                left: 0 !important;
                                                top: 0 !important;
                                                width: 100% !important;
                                                height: 100% !important;
                                                max-height: 100vh !important;
                                                margin: 0 !important;
                                                padding: 8px 12px !important;
                                                background: #ffffff !important;
                                                color: #0f172a !important;
                                                box-shadow: none !important;
                                                border: none !important;
                                                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
                                                overflow: hidden !important;
                                                page-break-after: avoid !important;
                                                page-break-inside: avoid !important;
                                            }
                                            .no-print {
                                                display: none !important;
                                            }
                                            @page {
                                                size: A4 landscape;
                                                margin: 5mm 6mm;
                                            }
                                        }
                                    `}</style>

                                    {/* Executive Header Banner */}
                                    <div className="text-center border-b border-slate-800 pb-2 relative">
                                        <div className="h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-amber-500 -mx-6 -mt-6 mb-3 rounded-t-xl" />

                                        <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500">REPUBLIC OF THE PHILIPPINES</p>
                                        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-700">PROVINCE OF MISAMIS ORIENTAL • MUNICIPALITY OF OPOL</p>
                                        <h1 className="text-lg sm:text-xl font-black text-blue-950 uppercase tracking-tight mt-0.5">MUNICIPAL COOPERATIVE DEVELOPMENT OFFICE</h1>
                                        <div className="inline-block px-3 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-blue-900 font-extrabold text-[11px] uppercase tracking-wider mt-1">
                                            Complete Cooperative Profiling & Statistical Audit Report
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200 font-mono">
                                            <span>Report Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span>Doc Ref: MCDO-STAT-2026-{String(profiles.length).padStart(3, '0')}</span>
                                        </div>
                                    </div>

                                    {/* SECTIONS 1 & 2: LANDSCAPE SIDE-BY-SIDE SUMMARY PANELS */}
                                    <div className="grid grid-cols-12 gap-3 print:gap-2">
                                        {/* Left Panel: CDA Asset Categories (5 cols) */}
                                        <div className="col-span-5 border border-slate-300 rounded-xl p-2.5 bg-slate-50/50 print:p-1.5">
                                            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                                Cooperative Categories
                                            </h3>
                                            <div className="grid grid-cols-4 gap-1.5 text-center">
                                                <div className="p-1.5 rounded-lg border border-slate-300 bg-white print:p-1">
                                                    <span className="text-[8.5px] font-bold uppercase text-slate-500 block">MICRO</span>
                                                    <span className="text-lg font-black text-slate-900 block leading-tight">{reportStats.micro}</span>
                                                    <span className="text-[8px] text-slate-500 block">≤₱3M</span>
                                                </div>
                                                <div className="p-1.5 rounded-lg border border-teal-200 bg-teal-50/40 print:p-1">
                                                    <span className="text-[8.5px] font-bold uppercase text-teal-700 block">SMALL</span>
                                                    <span className="text-lg font-black text-teal-950 block leading-tight">{reportStats.small}</span>
                                                    <span className="text-[8px] text-teal-700 block">₱3M-15M</span>
                                                </div>
                                                <div className="p-1.5 rounded-lg border border-indigo-200 bg-indigo-50/40 print:p-1">
                                                    <span className="text-[8.5px] font-bold uppercase text-indigo-700 block">MEDIUM</span>
                                                    <span className="text-lg font-black text-indigo-950 block leading-tight">{reportStats.medium}</span>
                                                    <span className="text-[8px] text-indigo-700 block">₱15M-100M</span>
                                                </div>
                                                <div className="p-1.5 rounded-lg border border-purple-200 bg-purple-50/40 print:p-1">
                                                    <span className="text-[8.5px] font-bold uppercase text-purple-700 block">LARGE</span>
                                                    <span className="text-lg font-black text-purple-950 block leading-tight">{reportStats.large}</span>
                                                    <span className="text-[8px] text-purple-700 block">&gt;₱100M</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Panel: Portfolio Highlights (7 cols) */}
                                        <div className="col-span-7 border border-blue-200 rounded-xl p-2.5 bg-blue-50/30 print:p-1.5">
                                            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 mb-1.5 flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                                Portfolio & Demographic Highlights
                                            </h3>
                                            <div className="grid grid-cols-4 gap-1.5 text-left">
                                                <div className="p-1.5 rounded-lg border border-blue-200 bg-white print:p-1">
                                                    <span className="text-[8.5px] font-extrabold uppercase text-blue-800 block">TOTAL COOPS</span>
                                                    <span className="text-base font-black text-blue-950 block leading-tight">{reportStats.total}</span>
                                                    <span className="text-[8px] text-slate-500 block">Registered</span>
                                                </div>
                                                <div className="p-1.5 rounded-lg border border-emerald-200 bg-white print:p-1">
                                                    <span className="text-[8.5px] font-extrabold uppercase text-emerald-800 block">TOTAL MEMBERS</span>
                                                    <span className="text-base font-black text-emerald-950 block leading-tight">{reportStats.totalMembers.toLocaleString()}</span>
                                                    <span className="text-[8px] text-slate-500 block">M:{reportStats.totalMale} | F:{reportStats.totalFemale}</span>
                                                </div>
                                                <div className="p-1.5 rounded-lg border border-indigo-200 bg-white col-span-2 print:p-1">
                                                    <span className="text-[8.5px] font-extrabold uppercase text-indigo-800 block">TOTAL CUMULATIVE ASSETS</span>
                                                    <span className="text-base font-black text-indigo-950 block leading-tight">{formatCurrency(reportStats.totalAssets)}</span>
                                                    <span className="text-[8px] text-slate-500 block">Avg: {formatCurrency(reportStats.avgAssets)} / coop</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 3: REGISTERED COOPERATIVES DIRECTORY TABLE */}
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                                Detailed Cooperative Directory & Performance Breakdown
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500">Total Entries: {profiles.length}</span>
                                        </h3>

                                        <table className="w-full text-left text-[10px] border-collapse border border-slate-300 print:text-[9px]">
                                            <thead>
                                                <tr className="bg-blue-900 text-white font-bold uppercase tracking-wider text-[8.5px]">
                                                    <th className="border border-blue-800 p-1.5 print:p-1 text-center w-6">#</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1">Cooperative Name</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1">CDA Number</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1">Category</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1">Address</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1">Contact Person</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1 text-center">Members</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1 text-right">Assets (₱)</th>
                                                    <th className="border border-blue-800 p-1.5 print:p-1 text-right">Net Surplus (₱)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {profiles.map((p, idx) => {
                                                    const surplus = parseFloat(p.economic_performance?.netSurplus) || 0;
                                                    return (
                                                        <tr key={p.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 text-center font-bold text-slate-500">{idx + 1}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 font-bold text-slate-900">
                                                                {p.name}
                                                                <span className="block text-[8px] text-slate-500 font-normal">{p.coop_type}</span>
                                                            </td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 font-mono text-[8.5px]">{p.cda_registration_no}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 font-semibold text-slate-700">{p.asset_classification || 'Micro'}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 text-slate-700">{p.barangay || p.address || 'Poblacion'}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 text-slate-800 font-medium">{p.chairperson || p.contact_number || 'N/A'}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 text-center font-bold">{p.total_members || 0}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 text-right font-bold text-slate-900">{formatCurrency(p.total_assets)}</td>
                                                            <td className="border border-slate-300 p-1.5 print:py-0.5 print:px-1 text-right font-semibold text-emerald-800">{formatCurrency(surplus)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* SECTION 4: OFFICIAL CERTIFICATION & SIGNATURE BLOCK */}
                                    <div className="pt-2 border-t border-slate-300 mt-2 space-y-2 print:pt-1.5 print:mt-1.5 print:space-y-1.5">
                                        <p className="text-[8.5px] text-slate-500 italic text-center print:text-[8px]">
                                            I hereby certify that the information contained in this Cooperative Statistical Profile is true, accurate, and extracted from official filings submitted to the Municipal Cooperative Development Office (MCDO) of Opol.
                                        </p>

                                        <div className="grid grid-cols-3 gap-6 text-center pt-1 print:pt-0.5">
                                            <div>
                                                <div className="h-7 flex items-end justify-center border-b border-slate-400 pb-0.5 print:h-5">
                                                    <span className="font-bold text-[10px] uppercase text-slate-900 print:text-[9px]">Jasper Maurin</span>
                                                </div>
                                                <span className="text-[8.5px] text-slate-500 uppercase tracking-wider block mt-0.5">Develop By</span>
                                            </div>

                                            <div>
                                                <div className="h-7 flex items-end justify-center border-b border-slate-400 pb-0.5 print:h-5">
                                                    <span className="font-bold text-[10px] uppercase text-slate-900 print:text-[9px]">Municipal Coop Officer</span>
                                                </div>
                                                <span className="text-[8.5px] text-slate-500 uppercase tracking-wider block mt-0.5">Verified & Certified Correct</span>
                                            </div>

                                            <div>
                                                <div className="h-7 flex items-end justify-center border-b border-slate-400 pb-1 print:h-5">
                                                    <span className="font-bold text-[10px] uppercase text-slate-900 print:text-[9px]">Municipal Mayor</span>
                                                </div>
                                                <span className="text-[8.5px] text-slate-500 uppercase tracking-wider block mt-0.5">Approved By</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
