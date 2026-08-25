import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { buildNavSections, SIDEBAR_WIDTH } from '../sidebar/navConfig';
import SidebarHeader from '../sidebar/SidebarHeader';
import SidebarSection from '../sidebar/SidebarSection';
import SidebarFooter from '../sidebar/SidebarFooter';
import Tooltip from '../ui/Tooltip';

function SidebarClock({ collapsed }) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })
            );
            setCurrentDate(
                now.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                })
            );
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    if (collapsed) {
        return (
            <div className="px-2 py-3 flex justify-center border-b border-slate-800/80">
                <Tooltip content={`Philippine Standard Time: ${currentTime || '--:--:--'} · ${currentDate || 'Today'}`}>
                    <div className="relative w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-blue-400 hover:border-slate-700 hover:text-white transition-all cursor-default">
                        <Clock className="w-4 h-4" aria-label={`Philippines Time: ${currentTime}`} />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                    </div>
                </Tooltip>
            </div>
        );
    }

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-3 my-3 p-3 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/70 border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-slate-700/80 transition-all"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                        Philippines Time (PST)
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[8.5px] font-extrabold text-emerald-400 tracking-wider">
                        LIVE
                    </span>
                </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
                <p className="text-[15px] font-extrabold text-white font-mono tracking-tight tabular-nums">
                    {currentTime || '08:00:00 AM'}
                </p>
                <span className="text-[10.5px] text-slate-300 font-semibold bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded-md">
                    {currentDate || 'Today'}
                </span>
            </div>
        </motion.div>
    );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const reducedMotion = useReducedMotion();
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
    const navSections = useMemo(() => buildNavSections(pathname), [pathname]);

    const [openSections, setOpenSections] = useState(() => {
        const initial = {};
        navSections.forEach((section) => {
            if (section.collapsible) {
                initial[section.title] = section.items.some((item) => item.active);
            }
        });
        return initial;
    });

    useEffect(() => {
        navSections.forEach((section) => {
            if (section.collapsible && section.items.some((item) => item.active)) {
                setOpenSections((prev) => ({ ...prev, [section.title]: true }));
            }
        });
    }, [navSections]);

    const toggleSection = useCallback((title) => {
        setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    }, []);

    const handleNavigate = useCallback(() => {
        onMobileClose?.();
    }, [onMobileClose]);

    useEffect(() => {
        if (!mobileOpen) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onMobileClose?.();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [mobileOpen, onMobileClose]);

    const width = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;

    return (
        <>
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onMobileClose}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ width }}
                transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={`
                    fixed top-0 left-0 h-full z-50 flex flex-col
                    bg-[#0B0F19] text-white
                    border-r border-slate-800/80
                    shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                `}
                style={{ width }}
                aria-label="Sidebar navigation"
            >
                <button
                    type="button"
                    onClick={onMobileClose}
                    className="lg:hidden absolute top-3.5 right-3 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Close navigation menu"
                >
                    <X className="w-5 h-5" />
                </button>

                <SidebarHeader collapsed={collapsed} />

                <SidebarClock collapsed={collapsed} />

                <nav
                    className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin"
                    aria-label="Main navigation"
                >
                    {navSections.map((section, index) => (
                        <SidebarSection
                            key={section.title}
                            section={section}
                            collapsed={collapsed}
                            isOpen={openSections[section.title] ?? section.items.some((item) => item.active)}
                            onToggle={() => toggleSection(section.title)}
                            reducedMotion={reducedMotion}
                            onNavigate={handleNavigate}
                            index={index}
                        />
                    ))}
                </nav>

                <SidebarFooter collapsed={collapsed} />

                <button
                    type="button"
                    onClick={onToggle}
                    className="hidden lg:flex absolute -right-3.5 top-6.5 w-7 h-7 rounded-full bg-[#111726] border border-blue-500/30 items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200 shadow-md shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:scale-105"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </motion.aside>
        </>
    );
}

