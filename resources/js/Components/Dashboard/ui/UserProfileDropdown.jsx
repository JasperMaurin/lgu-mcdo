import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useToast } from './Toast';
import ConfirmDialog from './ConfirmDialog';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function UserProfileDropdown({ onLogout }) {
    const { addToast } = useToast();
    const [open, setOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const dropdownRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setOpen(false);
        setConfirmLogout(true);
    };

    const handleProfileClick = () => {
        setOpen(false);
        setIsProfileModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setConfirmLogout(false);
        setTimeout(() => {
            onLogout?.();
        }, 300);
    };

    return (
        <>
            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-expanded={open}
                    aria-haspopup="menu"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        MA
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">Admin</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reducedMotion ? {} : { opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                            role="menu"
                        >
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 sm:hidden">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleProfileClick}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                            >
                                <User className="w-4 h-4" /> Profile
                            </button>

                            <hr className="my-1 border-slate-100 dark:border-slate-700" />
                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleLogoutClick}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ConfirmDialog
                open={confirmLogout}
                title="Sign out?"
                message="You will be logged out of the MCDO OPOL Management Portal. Any unsaved changes may be lost."
                confirmLabel="Sign out"
                cancelLabel="Stay signed in"
                variant="danger"
                onConfirm={handleConfirmLogout}
                onCancel={() => setConfirmLogout(false)}
            />

            <ProfileSettingsModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </>
    );
}