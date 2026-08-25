import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import DashboardLayout from '../../Components/Dashboard/layout/DashboardLayout';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../Components/Dashboard/ui/Toast';
import LogoutSuccess from '../../Components/Dashboard/ui/LogoutSuccess';
import { router } from '@inertiajs/react';
import { 
    QrCodeIcon, CheckCircleIcon, ChartBarIcon, ChatBubbleLeftRightIcon, 
    PlusIcon, MagnifyingGlassIcon, PrinterIcon, ArrowDownTrayIcon, 
    LinkIcon, TrashIcon, XMarkIcon, 
    DocumentDuplicateIcon, PlayIcon, PauseIcon, MapPinIcon, CalendarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MCDOLogo from '../../../Images/mcdologs.jpg';

const categories = ['All', 'Seminar', 'Training', 'Meeting', 'Registration', 'Event', 'Other'];
const statuses = ['All', 'Active', 'Inactive', 'Expired'];

export default function GenerateQr({ qrCodes = [] }) {
    const { isDark, toggleTheme, mounted } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

    const handleLogout = async () => {
        try { setShowLogoutSuccess(true); } finally { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); }
    };

    return (
        <>
            <DashboardLayout 
                isDark={isDark} onToggleTheme={toggleTheme} mounted={mounted} 
                sidebarCollapsed={sidebarCollapsed} onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
                mobileOpen={mobileOpen} onMobileOpen={() => setMobileOpen(true)} onMobileClose={() => setMobileOpen(false)} 
                onLogout={handleLogout}
            >
                <GenerateQrContent initialData={qrCodes} />
            </DashboardLayout>
            {showLogoutSuccess && <LogoutSuccess onComplete={() => { window.location.href = '/login'; }} />}
        </>
    );
}

const getAppBaseUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
};

const getAppHost = () => {
    if (typeof window === 'undefined') return '';
    return window.location.host;
};

function GenerateQrContent({ initialData = [] }) {
    const { addToast } = useToast();

    const data = initialData;
    
    const stats = useMemo(() => [
        { title: 'Total QR Codes', value: data.length, icon: QrCodeIcon, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
        { title: 'Active QR Codes', value: data.filter(qr => qr.status === 'Active').length, icon: CheckCircleIcon, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
        { title: 'Total QR Scans', value: data.reduce((acc, qr) => acc + (Number(qr.scans) || 0), 0).toLocaleString(), icon: ChartBarIcon, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
        { title: 'Total Feedback', value: data.reduce((acc, qr) => acc + (Number(qr.feedback) || 0), 0).toLocaleString(), icon: ChatBubbleLeftRightIcon, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' }
    ], [data]);
    
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [previewQr, setPreviewQr] = useState(null);
    const [printQr, setPrintQr] = useState(null);
    const [printTemplate, setPrintTemplate] = useState('poster'); // 'poster' | 'desk_tent' | 'banner'
    const [templateModalQr, setTemplateModalQr] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
            const matchesCat = catFilter === 'All' || item.category === catFilter;
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesCat && matchesStatus;
        });
    }, [data, search, catFilter, statusFilter]);

    const handleCreate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newQr = {
            id: `MCDO-QR-${Math.floor(Math.random() * 900) + 100}`,
            name: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description') || '',
            venue: formData.get('venue'),
            date: formData.get('date'),
            status: formData.get('status'),
        };

        router.post('/feedback/generate-qr', newQr, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setPreviewQr({ ...newQr, scans: 0, feedback: 0, rating: 0 });
                addToast('QR Code generated successfully!', 'success');
            }
        });
    };

    const toggleStatus = (id) => {
        const item = data.find(i => i.id === id);
        if (!item) return;
        
        const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
        router.put(`/feedback/generate-qr/${id}`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                addToast(`${id} is now ${newStatus}`, 'success');
                if (previewQr?.id === id) {
                    setPreviewQr({ ...previewQr, status: newStatus });
                }
            }
        });
    };

    const deleteQr = (id) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = () => {
        if (!deleteConfirmId) return;
        const id = deleteConfirmId;
        router.delete(`/feedback/generate-qr/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                addToast('QR Code deleted', 'success');
                if (previewQr?.id === id) setPreviewQr(null);
                setDeleteConfirmId(null);
            }
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                <StarIconSolid className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-sm">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
            </div>
        );
    };

    const openPrintModal = (qr) => {
        setTemplateModalQr(qr);
    };

    const handleConfirmPrint = () => {
        if (!templateModalQr) return;
        setPrintQr(templateModalQr);
        setTemplateModalQr(null);
        setTimeout(() => {
            window.print();
            setPrintQr(null);
        }, 500);
    };

    const handleDownloadPng = (qr) => {
        const svgEl = document.getElementById(`qr-svg-${qr.id}`) || document.getElementById(`qr-svg-preview-${qr.id}`);
        if (!svgEl) {
            addToast('Preparing PNG download...', 'info');
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 600;
        canvas.width = size;
        canvas.height = size + 160;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header blue bar
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(0, 0, canvas.width, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MCDO SERVICE FEEDBACK', canvas.width / 2, 42);

        ctx.font = '14px sans-serif';
        ctx.fillText('Scan to Rate & Provide Feedback', canvas.width / 2, 68);

        // Render QR Code from SVG
        const qrUrl = `${getAppBaseUrl()}/feedback/${qr.token || qr.id}`;
        const qrImage = new Image();
        
        // Simple canvas fallback generation for reliability
        const svgString = new XMLSerializer().serializeToString(svgEl || document.createElementNS("http://www.w3.org/2000/svg", "svg"));
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        qrImage.onload = () => {
            ctx.drawImage(qrImage, 100, 110, 400, 400);

            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(qr.name.substring(0, 35), canvas.width / 2, 550);

            ctx.fillStyle = '#64748b';
            ctx.font = '14px monospace';
            ctx.fillText(`ID: ${qr.token || qr.id}`, canvas.width / 2, 580);

            ctx.fillStyle = '#3b82f6';
            ctx.font = '12px sans-serif';
            ctx.fillText('Municipal Cooperative Development Office', canvas.width / 2, 610);

            const png = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = png;
            downloadLink.download = `MCDO_QR_${qr.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            addToast('QR Code PNG downloaded successfully!', 'success');
        };
        qrImage.src = blobURL;
    };

    return (
        <>
            <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-blue-900 to-blue-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">QR Code Management</h1>
                        <p className="text-blue-100 max-w-xl">
                            Create, manage, and track unique QR codes for MCDO services, seminars, and events to seamlessly collect public feedback.
                        </p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="relative z-10 flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        <PlusIcon className="w-5 h-5" />
                        Generate New QR Code
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Table Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="relative w-full sm:w-96">
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none">
                                        {statuses.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">QR Code</th>
                                            <th className="px-6 py-4 font-semibold">Event / Service</th>
                                            <th className="px-6 py-4 font-semibold">Metrics</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredData.map(row => (
                                            <tr key={row.id} onClick={() => setPreviewQr(row)} className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${previewQr?.id === row.id ? 'bg-blue-50 dark:bg-slate-800' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                                                        <QRCode id={`qr-svg-${row.id}`} value={`${getAppBaseUrl()}/feedback/${row.token || row.id}`} size={100} style={{ height: "100%", width: "100%" }} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-800 dark:text-white text-base">{row.name}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{row.id}</span>
                                                        <span>•</span>
                                                        <span>{row.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-xs text-slate-500">Scans</p>
                                                            <p className="font-semibold">{row.scans}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500">Feedback</p>
                                                            <p className="font-semibold">{row.feedback}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500">Rating</p>
                                                            {renderStars(row.rating)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        row.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                        row.status === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                        <button onClick={() => openPrintModal(row)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg tooltip-trigger" title="Print Template"><PrinterIcon className="w-5 h-5"/></button>
                                                        <button onClick={() => toggleStatus(row.id)} className={`p-2 rounded-lg ${row.status === 'Active' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800'}`} title={row.status === 'Active' ? 'Deactivate' : 'Activate'}>
                                                            {row.status === 'Active' ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
                                                        </button>
                                                        <button onClick={() => deleteQr(row.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredData.length === 0 && (
                                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No QR codes found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        {previewQr ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden sticky top-6">
                                <div className="p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative">
                                    <button onClick={() => setPreviewQr(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><XMarkIcon className="w-5 h-5"/></button>
                                    
                                    <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 mt-4 mb-6">
                                        <QRCode id={`qr-svg-preview-${previewQr.id}`} value={`${getAppBaseUrl()}/feedback/${previewQr.token || previewQr.id}`} size={180} />
                                    </div>
                                    
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{previewQr.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                                        previewQr.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                        previewQr.status === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                        {previewQr.status}
                                    </span>
                                    
                                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-500/20 w-full mb-2">
                                        <LinkIcon className="w-4 h-4 shrink-0" />
                                        <a href={`${getAppBaseUrl()}/feedback/${previewQr.token || previewQr.id}`} target="_blank" rel="noreferrer" className="truncate flex-1 text-left hover:underline font-medium">
                                            {getAppHost()}/feedback/{previewQr.token || previewQr.id}
                                        </a>
                                        <button onClick={() => { navigator.clipboard.writeText(`${getAppBaseUrl()}/feedback/${previewQr.token || previewQr.id}`); addToast('Link copied!', 'info'); }} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-500/30 rounded"><DocumentDuplicateIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => handleDownloadPng(previewQr)} className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors text-sm">
                                            <ArrowDownTrayIcon className="w-4 h-4" /> Download PNG
                                        </button>
                                        <button onClick={() => openPrintModal(previewQr)} className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 py-2.5 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors text-sm">
                                            <PrinterIcon className="w-4 h-4" /> Print Options
                                        </button>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 flex items-center gap-2"><MapPinIcon className="w-4 h-4"/> Venue</span>
                                            <span className="font-medium text-right">{previewQr.venue}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Date</span>
                                            <span className="font-medium text-right">{formatDate(previewQr.date)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-slate-500 mb-1">Scans</p>
                                            <p className="text-lg font-bold">{previewQr.scans}</p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-slate-500 mb-1">Feedback</p>
                                            <p className="text-lg font-bold">{previewQr.feedback}</p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center">
                                            <p className="text-xs text-slate-500 mb-1">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <StarIconSolid className="w-4 h-4 text-amber-400" />
                                                <span className="text-lg font-bold">{previewQr.rating > 0 ? previewQr.rating.toFixed(1) : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
                                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <QrCodeIcon className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Select a QR Code</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-[250px]">Click on any QR code in the table to view its details, download, or print a poster.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Print Template Selection Modal */}
            <AnimatePresence>
                {templateModalQr && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Print Template</h3>
                                    <p className="text-xs text-slate-500">Select format for {templateModalQr.name}</p>
                                </div>
                                <button onClick={() => setTemplateModalQr(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"><XMarkIcon className="w-5 h-5"/></button>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <button
                                    onClick={() => setPrintTemplate('poster')}
                                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${printTemplate === 'poster' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'}`}
                                >
                                    <div className="w-10 h-14 border-2 border-current rounded-md flex flex-col items-center justify-center gap-1 p-1">
                                        <div className="w-full h-2 bg-current rounded-xs" />
                                        <div className="w-4 h-4 border border-current rounded-xs" />
                                    </div>
                                    <span className="text-xs">Wall Poster (A4)</span>
                                </button>

                                <button
                                    onClick={() => setPrintTemplate('desk_tent')}
                                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${printTemplate === 'desk_tent' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'}`}
                                >
                                    <div className="w-12 h-10 border-2 border-current rounded-md flex items-center justify-center gap-1 p-1">
                                        <div className="w-3 h-3 border border-current rounded-xs" />
                                        <div className="w-0.5 h-full bg-slate-300 border-dashed" />
                                        <div className="w-3 h-3 border border-current rounded-xs" />
                                    </div>
                                    <span className="text-xs">Desk Tent (A5)</span>
                                </button>

                                <button
                                    onClick={() => setPrintTemplate('banner')}
                                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${printTemplate === 'banner' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'}`}
                                >
                                    <div className="w-14 h-9 border-2 border-current rounded-md flex items-center justify-between p-1">
                                        <div className="w-4 h-4 border border-current rounded-xs" />
                                        <div className="w-6 h-1.5 bg-current rounded-xs" />
                                    </div>
                                    <span className="text-xs">Event Banner</span>
                                </button>
                            </div>

                            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={() => setTemplateModalQr(null)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">Cancel</button>
                                <button onClick={handleConfirmPrint} className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md text-sm flex items-center gap-2">
                                    <PrinterIcon className="w-4 h-4" /> Print Selected Format
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create QR Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-8">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Generate QR Code</h2>
                                    <p className="text-sm text-slate-500 mt-1">Create a unique tracking code for your upcoming event or service.</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                    <XMarkIcon className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreate} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-5">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Basic Information</h3>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Service / Event Title</label>
                                            <input name="title" required placeholder="e.g. Financial Literacy Seminar" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Category</label>
                                            <select name="category" required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none">
                                                {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Description (Optional)</label>
                                            <textarea name="description" rows="3" placeholder="Brief description..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Logistics & Settings</h3>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Venue</label>
                                            <input name="venue" required placeholder="e.g. Opol Gymnasium" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5">Event Date</label>
                                                <input type="date" name="date" required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5">Status</label>
                                                <select name="status" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none">
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">Generate QR Code</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal */}
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete QR Code?</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                                Are you absolutely sure you want to delete this QR code? This action cannot be undone.
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
                                    Yes, Delete QR
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Multi-Format Print Hidden Templates */}
            {printQr && (
                <div className="fixed inset-0 bg-white z-[999] hidden print:flex flex-col items-center justify-center p-8 text-center">
                    {/* Template 1: Wall Poster (A4) */}
                    {printTemplate === 'poster' && (
                        <div className="max-w-2xl w-full mx-auto border-8 border-blue-900 rounded-[3rem] p-12 flex flex-col items-center bg-slate-50">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={MCDOLogo} alt="MCDO Logo" className="w-16 h-16 rounded-full border-2 border-slate-200 shadow-sm object-contain" />
                                <div className="text-left">
                                    <h1 className="text-2xl font-black text-blue-900 leading-tight">Municipal Cooperative</h1>
                                    <h2 className="text-xl font-bold text-blue-700">Development Office</h2>
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-slate-100 mb-6">
                                <QRCode value={`${getAppBaseUrl()}/feedback/${printQr.token || printQr.id}`} size={380} />
                            </div>
                            
                            <h2 className="text-3xl font-black text-slate-800 mb-3 uppercase tracking-wide">{printQr.name}</h2>
                            
                            <div className="flex gap-6 text-lg font-medium text-slate-600 mb-8">
                                <span className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-red-500"/> {printQr.venue}</span>
                                <span className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-500"/> {formatDate(printQr.date)}</span>
                            </div>
                            
                            <div className="bg-blue-600 text-white w-full py-5 rounded-2xl shadow-lg">
                                <p className="text-xl font-bold uppercase tracking-wider">SCAN TO RATE & PROVIDE FEEDBACK</p>
                            </div>
                            <p className="text-sm text-slate-400 mt-4 font-mono">ID: {printQr.token || printQr.id}</p>
                        </div>
                    )}

                    {/* Template 2: Desk Tent Counter Display (A5 Dual-Sided) */}
                    {printTemplate === 'desk_tent' && (
                        <div className="w-full max-w-3xl mx-auto border-4 border-slate-300 p-6 bg-white flex flex-col justify-between h-full">
                            <div className="p-6 border-2 border-blue-900 rounded-2xl bg-blue-50/40 text-center flex flex-col items-center">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={MCDOLogo} alt="MCDO Logo" className="w-10 h-10 rounded-full" />
                                    <span className="font-bold text-blue-900 text-base">MCDO CITIZEN SATISFACTION FEEDBACK</span>
                                </div>
                                <QRCode value={`${getAppBaseUrl()}/feedback/${printQr.token || printQr.id}`} size={180} />
                                <p className="font-bold text-slate-900 mt-2 text-sm">{printQr.name}</p>
                                <p className="text-xs text-blue-700 font-bold uppercase mt-1">SCAN WITH YOUR PHONE</p>
                            </div>

                            <div className="my-6 border-b-2 border-dashed border-slate-400 text-slate-400 text-xs font-mono">✂️ FOLD HERE FOR COUNTER DISPLAY TENT</div>

                            <div className="p-6 border-2 border-blue-900 rounded-2xl bg-blue-50/40 text-center flex flex-col items-center rotate-180">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={MCDOLogo} alt="MCDO Logo" className="w-10 h-10 rounded-full" />
                                    <span className="font-bold text-blue-900 text-base">MCDO CITIZEN SATISFACTION FEEDBACK</span>
                                </div>
                                <QRCode value={`${getAppBaseUrl()}/feedback/${printQr.token || printQr.id}`} size={180} />
                                <p className="font-bold text-slate-900 mt-2 text-sm">{printQr.name}</p>
                                <p className="text-xs text-blue-700 font-bold uppercase mt-1">SCAN WITH YOUR PHONE</p>
                            </div>
                        </div>
                    )}

                    {/* Template 3: Event Banner (Landscape 16:9) */}
                    {printTemplate === 'banner' && (
                        <div className="w-full max-w-4xl mx-auto border-8 border-blue-900 rounded-3xl p-10 bg-slate-900 text-white flex items-center justify-between gap-8 text-left">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <img src={MCDOLogo} alt="MCDO Logo" className="w-14 h-14 rounded-full border-2 border-white" />
                                    <div>
                                        <h2 className="text-lg font-bold text-blue-300 uppercase">MCDO Event Feedback</h2>
                                        <p className="text-xs text-slate-300">Municipal Cooperative Development Office</p>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-black text-white leading-tight">{printQr.name}</h1>
                                <p className="text-slate-300 text-sm">{printQr.description || 'Your feedback helps us improve future municipal services and seminars.'}</p>
                                <div className="flex items-center gap-4 text-xs font-semibold text-blue-200">
                                    <span>📍 {printQr.venue}</span>
                                    <span>📅 {formatDate(printQr.date)}</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl text-slate-900 text-center shrink-0">
                                <QRCode value={`${getAppBaseUrl()}/feedback/${printQr.token || printQr.id}`} size={240} />
                                <p className="font-bold text-xs mt-3 text-blue-900">SCAN TO RATE EVENT</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; }
                    .print\\:flex, .print\\:flex * { visibility: visible; }
                    .print\\:flex { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
                }
            `}} />
        </>
    );
}
