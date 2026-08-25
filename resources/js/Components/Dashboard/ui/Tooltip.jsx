import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function Tooltip({ content, children, disabled = false }) {
    const [visible, setVisible] = useState(false);
    const reducedMotion = useReducedMotion();

    if (disabled || !content) return children;

    return (
        <div
            className="relative flex w-full"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        role="tooltip"
                        initial={reducedMotion ? false : { opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reducedMotion ? {} : { opacity: 0, x: -4 }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[200] pointer-events-none px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-xl border border-white/10 whitespace-nowrap"
                    >
                        {content}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" aria-hidden="true" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
