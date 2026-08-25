import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, FileText, UserPlus, Wallet } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const notifications = [
    { id: 1, title: 'New member registration', message: 'Juan Dela Cruz joined Cooperative A', time: '2h ago', read: false, icon: UserPlus },
    { id: 2, title: 'Capital contribution', message: 'Maria Santos contributed ₱5,000', time: '4h ago', read: false, icon: Wallet },
    { id: 3, title: 'Document submitted', message: 'Ana Garcia uploaded registration docs', time: '1d ago', read: true, icon: FileText },
];

export default function NotificationsPanel() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(notifications);
    const panelRef = useRef(null);
    const reducedMotion = useReducedMotion();
    const unreadCount = items.filter((n) => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    return (
        <div ref={panelRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={open}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reducedMotion ? {} : { opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        role="dialog"
                        aria-label="Notifications panel"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                            {items.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.li
                                        key={item.id}
                                        initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.25 }}
                                        className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer ${!item.read ? 'bg-red-50/50 dark:bg-red-950/20' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.message}</p>
                                                <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                            </div>
                                            {!item.read && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-2" aria-label="Unread" />
                                            )}
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
