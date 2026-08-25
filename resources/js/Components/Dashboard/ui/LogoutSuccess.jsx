import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function LogoutSuccess({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[10000] grid min-h-[100dvh] place-items-center bg-slate-950/70 p-4 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-white px-7 py-9 text-center shadow-2xl shadow-blue-950/30 dark:bg-[#101522]"
            >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-500/15 blur-3xl" />
                <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25 ring-4 ring-blue-500/10">
                    <CheckCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-outfit text-2xl font-extrabold text-white mb-2">Logged Out</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    You have been securely signed out of the MCDO Feedback Management System.
                </p>
                <p className="mt-3 text-xs font-medium text-slate-400">Returning to sign in…</p>
                <div className="mt-5 w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-500 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.8, ease: 'linear' }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
