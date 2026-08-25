import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function ConfirmDialog({
    open,
    title = 'Confirm action',
    message = 'Are you sure you want to continue?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}) {
    const reducedMotion = useReducedMotion();
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        cancelRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCancel?.();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onCancel]);

    const confirmClass =
        variant === 'danger'
            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20'
            : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white';

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[9999] grid min-h-[100dvh] place-items-center p-4" role="presentation">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
                        onClick={onCancel}
                        aria-label="Close dialog"
                    />
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"
                        initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={reducedMotion ? {} : { opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-blue-950/30 dark:bg-[#101522]"
                    >
                        <div className="relative overflow-hidden p-6">
                            <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl" />
                            <div className="flex items-start gap-4">
                                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-300 ring-red-500/10' : 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 ring-blue-500/10'}`}>
                                    {variant === 'danger' ? <ArrowRightOnRectangleIcon className="w-6 h-6" aria-hidden="true" /> : <ExclamationTriangleIcon className="w-6 h-6" aria-hidden="true" />}
                                </div>
                                <div>
                                    <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {title}
                                    </h2>
                                    <p id="confirm-dialog-description" className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 bg-slate-50/80 px-6 py-4 dark:border-white/10 dark:bg-slate-950/25">
                            <button
                                ref={cancelRef}
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className={`px-4 py-2.5 text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${confirmClass}`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
