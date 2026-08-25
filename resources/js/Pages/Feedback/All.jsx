import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Components/Dashboard/layout/DashboardLayout';
import { useTheme } from '../../hooks/useTheme';
import LogoutSuccess from '../../Components/Dashboard/ui/LogoutSuccess';
import { 
    QueueListIcon, 
    ChatBubbleLeftRightIcon, 
    ExclamationCircleIcon, 
    CheckBadgeIcon, 
    StarIcon as StarIconOutline,
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentArrowDownIcon,
    ArrowPathIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    ArrowUturnLeftIcon,
    UserPlusIcon,
    CheckIcon,
    ArchiveBoxIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Reusable Components
const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</h3>
            <p className={`text-xs font-semibold ${colorClass}`}>{subtitle}</p>
        </div>
        <div className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800 ${colorClass}`}>
            <Icon className="w-8 h-8" />
        </div>
    </motion.div>
);

const Badge = ({ type, text }) => {
    const styles = {
        Pending: 'bg-orange-100 text-orange-700 border-orange-200',
        'Under Review': 'bg-blue-100 text-blue-700 border-blue-200',
        Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Archived: 'bg-slate-100 text-slate-700 border-slate-200',
        Complaint: 'bg-red-50 text-red-600 border-red-200',
        Suggestion: 'bg-purple-50 text-purple-600 border-purple-200',
        Inquiry: 'bg-blue-50 text-blue-600 border-blue-200',
        Compliment: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[type] || styles['Pending']}`}>
            {text}
        </span>
    );
};

const RatingStars = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
            star <= rating 
                ? <StarIconSolid key={star} className="w-4 h-4 text-amber-400" />
                : <StarIconOutline key={star} className="w-4 h-4 text-slate-300" />
        ))}
    </div>
);

export default function AllFeedback({ feedbacks = [] }) {
    const { isDark, toggleTheme, mounted } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    const filteredData = useMemo(() => {
        return feedbacks.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()) || item.service.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            const matchesType = typeFilter === 'All' || item.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [search, statusFilter, typeFilter, feedbacks]);

    const openModal = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const updateStatus = (id, newStatus) => {
        // ID is like FB-00001, we need to extract the number
        const numericId = parseInt(id.replace('FB-', ''), 10);
        router.put(`/feedback/all/${numericId}/status`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedFeedback && selectedFeedback.id === id) {
                    setSelectedFeedback({...selectedFeedback, status: newStatus});
                }
            }
        });
    };

    const handleDelete = (id) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = () => {
        if (!deleteConfirmId) return;
        const id = deleteConfirmId;
        const numericId = parseInt(id.replace('FB-', ''), 10);
        router.delete(`/feedback/all/${numericId}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedFeedback && selectedFeedback.id === id) {
                    setIsModalOpen(false);
                }
                setDeleteConfirmId(null);
            }
        });
    };

    return (
        <>
            <Head title="All Feedback - MCDO" />
            <DashboardLayout 
                isDark={isDark} onToggleTheme={toggleTheme} mounted={mounted} 
                sidebarCollapsed={sidebarCollapsed} onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
                mobileOpen={mobileOpen} onMobileOpen={() => setMobileOpen(true)} onMobileClose={() => setMobileOpen(false)} 
                onLogout={() => { window.location.href = '/login'; }}
            >
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 font-sans text-slate-800">
                    
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback Management</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor, search, and resolve citizen feedback submitted via MCDO platforms.</p>
                        </div>
                        <div className="flex gap-4 text-sm bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="px-4 border-r border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500">Total Feedback</p>
                                <p className="font-bold text-slate-800 dark:text-white text-lg">{feedbacks.length}</p>
                            </div>
                            <div className="px-4 border-r border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500">New Today</p>
                                <p className="font-bold text-emerald-600 text-lg">+{feedbacks.filter(fb => new Date(fb.date).toDateString() === new Date().toDateString()).length}</p>
                            </div>
                            <div className="px-4">
                                <p className="text-slate-500">Last Updated</p>
                                <p className="font-bold text-slate-800 dark:text-white text-lg">Just now</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Feedback" value={feedbacks.length} subtitle="Recorded to date" icon={ChatBubbleLeftRightIcon} colorClass="text-blue-600" />
                        <StatCard title="Pending Review" value={feedbacks.filter(fb => fb.status === 'Pending').length} subtitle="Needs attention" icon={ExclamationCircleIcon} colorClass="text-orange-500" />
                        <StatCard title="Resolved" value={feedbacks.filter(fb => fb.status === 'Resolved').length} subtitle="Addressed" icon={CheckBadgeIcon} colorClass="text-emerald-500" />
                        <StatCard title="Average Rating" value={feedbacks.length > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) + " / 5" : "N/A"} subtitle="Based on all ratings" icon={StarIconSolid} colorClass="text-amber-500" />
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        
                        {/* Toolbar */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col lg:flex-row justify-between gap-4">
                            <div className="flex flex-wrap gap-3 flex-1">
                                <div className="relative w-full sm:w-72">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by ID, Name, or Service..." 
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    />
                                </div>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 outline-none">
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Archived">Archived</option>
                                </select>
                                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-sm border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 outline-none">
                                    <option value="All">All Types</option>
                                    <option value="Complaint">Complaint</option>
                                    <option value="Suggestion">Suggestion</option>
                                    <option value="Inquiry">Inquiry</option>
                                    <option value="Compliment">Compliment</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                    <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                    <DocumentArrowDownIcon className="w-4 h-4" /> Export
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                    <FunnelIcon className="w-4 h-4" /> Bulk Actions
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="overflow-x-auto relative min-h-[400px]">
                            {isLoading ? (
                                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                    <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                            ) : null}
                            
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                                        <th className="px-6 py-4">Ticket ID</th>
                                        <th className="px-6 py-4">Citizen Info</th>
                                        <th className="px-6 py-4">Service / Event</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Rating</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredData.length > 0 ? filteredData.map((row) => (
                                        <motion.tr 
                                            key={row.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                                                {row.id}
                                                <div className="text-[10px] text-slate-400 mt-1">{row.qrCode}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
                                                <div className="text-xs text-slate-500">{row.userType} • {row.municipality}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={row.service}>
                                                {row.service}
                                            </td>
                                            <td className="px-6 py-4"><Badge type={row.type} text={row.type} /></td>
                                            <td className="px-6 py-4"><RatingStars rating={row.rating} /></td>
                                            <td className="px-6 py-4"><Badge type={row.status} text={row.status} /></td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                <div className="mt-0.5">{new Date(row.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md tooltip-trigger" title="View Details"><EyeIcon className="w-4 h-4"/></button>
                                                    <a href={row.email ? `mailto:${row.email}` : '#'} onClick={(e) => { if(!row.email) { e.preventDefault(); alert('No email provided by this citizen.'); } }} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md tooltip-trigger inline-flex items-center" title="Reply"><ArrowUturnLeftIcon className="w-4 h-4"/></a>
                                                    <button onClick={() => updateStatus(row.id, 'Under Review')} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md tooltip-trigger" title="Assign / Review"><UserPlusIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => updateStatus(row.id, 'Resolved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md tooltip-trigger" title="Mark Resolved"><CheckIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => updateStatus(row.id, 'Archived')} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md tooltip-trigger" title="Archive"><ArchiveBoxIcon className="w-4 h-4"/></button>
                                                </div>
                                                <button className="p-1.5 text-slate-400 group-hover:hidden"><EllipsisVerticalIcon className="w-4 h-4"/></button>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                        <QueueListIcon className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No feedback records found.</h3>
                                                    <p className="text-slate-500 text-sm mt-1 mb-4">Try adjusting your filters or search query.</p>
                                                    <button onClick={() => {setSearch(''); setStatusFilter('All'); setTypeFilter('All');}} className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
                            <p className="text-slate-500">Showing <span className="font-bold text-slate-700 dark:text-slate-300">1–{Math.min(10, filteredData.length)}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{filteredData.length}</span> feedback records.</p>
                            <div className="flex items-center gap-1">
                                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold">1</button>
                                <button className="px-3 py-1.5 border border-transparent text-slate-600 hover:bg-slate-50 rounded-lg">2</button>
                                <button className="px-3 py-1.5 border border-transparent text-slate-600 hover:bg-slate-50 rounded-lg">3</button>
                                <span className="px-2 text-slate-400">...</span>
                                <button className="px-3 py-1.5 border border-transparent text-slate-600 hover:bg-slate-50 rounded-lg">125</button>
                                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* View Feedback Modal */}
            <AnimatePresence>
                {isModalOpen && selectedFeedback && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Feedback Details</h2>
                                        <Badge type={selectedFeedback.status} text={selectedFeedback.status} />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 font-mono">Ticket: {selectedFeedback.id} | QR: {selectedFeedback.qrCode}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-slate-500 mb-1">Citizen Name</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{selectedFeedback.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">User Type</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{selectedFeedback.userType}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Municipality</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{selectedFeedback.municipality}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Date Submitted</p>
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            {new Date(selectedFeedback.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex-1">
                                        <p className="text-slate-500 mb-1">Service / Event</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{selectedFeedback.service}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Feedback Type</p>
                                        <Badge type={selectedFeedback.type} text={selectedFeedback.type} />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Overall Rating</p>
                                        <RatingStars rating={selectedFeedback.rating} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-base">Detailed Comments</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                        {selectedFeedback.comments}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4"/> What we did well</h4>
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-emerald-800 dark:text-emerald-300 text-sm">
                                            {selectedFeedback.strengths || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2"><ExclamationCircleIcon className="w-4 h-4"/> Areas for improvement</h4>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-orange-800 dark:text-orange-300 text-sm">
                                            {selectedFeedback.improvements || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {selectedFeedback.trainingEvaluation && (
                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-6">
                                        <div>
                                            <h3 className="font-bold text-blue-700 dark:text-blue-400 text-base flex items-center gap-2">
                                                <span>Training / Seminar Detailed Evaluation</span>
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Individual responses for all training evaluation questions.</p>
                                        </div>
                                        
                                        {/* General Open-Ended & Rating Questions */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">1. What did you appreciate about this training?</p>
                                                <p className="text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{selectedFeedback.trainingEvaluation.liked_most || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">2. What did you not like about this training?</p>
                                                <p className="text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{selectedFeedback.trainingEvaluation.disliked || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">3. Which topic/subject will be a great help to you?</p>
                                                <p className="text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{selectedFeedback.trainingEvaluation.helpful_topic || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">4. Which topics/subjects can you not use?</p>
                                                <p className="text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{selectedFeedback.trainingEvaluation.unusable_topic || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">5. What other training would you like to join in the future?</p>
                                                <p className="text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{selectedFeedback.trainingEvaluation.future_training || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">6. How was the training venue/facility?</p>
                                                <p className="text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{selectedFeedback.trainingEvaluation.venue_feedback || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">Trainer/Speaker Rating:</p>
                                                <p className="text-slate-900 dark:text-white font-semibold">{selectedFeedback.trainingEvaluation.trainer_rating || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">Was Training Duration Sufficient?</p>
                                                <p className="text-slate-900 dark:text-white font-semibold">{selectedFeedback.trainingEvaluation.time_sufficient || 'N/A'}</p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 md:col-span-2">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">Would You Recommend This Training to Others?</p>
                                                <p className="text-slate-900 dark:text-white font-semibold">{selectedFeedback.trainingEvaluation.recommend_training || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Table 7: Views on Time & Duration */}
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">7. Views on Time & Duration</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <p className="text-slate-500 font-medium">Time allotted for each topic/activity:</p>
                                                    <p className="font-bold text-blue-600 mt-1">{selectedFeedback.trainingEvaluation.time_per_topic_rating || 'N/A'}</p>
                                                    {selectedFeedback.trainingEvaluation.time_per_topic_comment && (
                                                        <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px] italic">Details: {selectedFeedback.trainingEvaluation.time_per_topic_comment}</p>
                                                    )}
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <p className="text-slate-500 font-medium">Overall duration of the training:</p>
                                                    <p className="font-bold text-blue-600 mt-1">{selectedFeedback.trainingEvaluation.training_duration_rating || 'N/A'}</p>
                                                    {selectedFeedback.trainingEvaluation.training_duration_comment && (
                                                        <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px] italic">Details: {selectedFeedback.trainingEvaluation.training_duration_comment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Table 8: Overall Training Grade & Ratings Matrix */}
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">8. Overall Training Ratings Matrix</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Naabot ang gilauman (Expectations Met):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.expectations_met || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Nakab-ot ang katoyuan (Objectives Achieved):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.objectives_achieved || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Mga topiko ug unod (Topics & Content):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.topics_content || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Mga kalihukan (Activities Conducted):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.activities_conducted || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Mga pamaagi sa pagtudlo (Teaching Methods):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.teaching_methods || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Mga kagamiton (Teaching Materials):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.teaching_materials || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Mga Mamumulong (Speakers):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.speakers_rating || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Mga nagdumala (Training Facilitators):</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.facilitators_rating || 'N/A'}</strong>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 block text-[11px]">Facilities & Services:</span>
                                                    <strong className="text-slate-900 dark:text-white font-bold">{selectedFeedback.trainingEvaluation.facilities_services || 'N/A'}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                <button onClick={() => handleDelete(selectedFeedback.id)} className="text-sm font-medium text-slate-600 hover:text-red-600 flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white transition-colors">
                                    <TrashIcon className="w-4 h-4" /> Delete
                                </button>
                                <div className="flex gap-2">
                                    <select 
                                        value={selectedFeedback.status}
                                        onChange={(e) => updateStatus(selectedFeedback.id, e.target.value)}
                                        className="text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                    <a 
                                        href={selectedFeedback.email ? `mailto:${selectedFeedback.email}` : '#'}
                                        onClick={(e) => { if(!selectedFeedback.email) { e.preventDefault(); alert('No email provided by this citizen.'); } }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors"
                                    >
                                        <ArrowUturnLeftIcon className="w-4 h-4" /> Reply to Citizen
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal for Feedback */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrashIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Feedback Record?</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                                Are you absolutely sure you want to delete this feedback record? This action cannot be undone and will permanently remove this response from the database.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={() => setDeleteConfirmId(null)} 
                                    className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete} 
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
                                >
                                    Yes, Delete Feedback
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
