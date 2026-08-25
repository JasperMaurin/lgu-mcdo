import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X, XCircle } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const ToastContext = createContext(null);

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const reducedMotion = useReducedMotion();

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[400] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
                role="region"
                aria-live="polite"
                aria-label="Notifications"
            >
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => {
                        const Icon = icons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                layout
                                initial={reducedMotion ? false : { opacity: 0, x: 40, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={reducedMotion ? {} : { opacity: 0, x: 40, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-xl ${styles[toast.type]}`}
                            >
                                <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="text-sm font-medium flex-1">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                    aria-label="Dismiss notification"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}
