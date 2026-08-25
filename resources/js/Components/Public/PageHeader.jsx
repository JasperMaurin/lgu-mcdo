import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PageHeader({ eyebrow, title, titleLine2, description }) {
    const reducedMotion = useReducedMotion();

    const fade = (delay = 0) =>
        reducedMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 14 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] },
              };

    return (
        <div className="relative max-w-5xl mx-auto text-center mb-12 sm:mb-16 pt-2">
            <motion.div
                {...fade(0)}
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full mb-5 shadow-sm"
            >
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="public-eyebrow text-[11px] font-extrabold uppercase text-slate-700 dark:text-slate-300">{eyebrow}</span>
            </motion.div>

            <motion.h1 {...fade(0.08)} className="font-outfit text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5">
                <span>{title}</span>
                {titleLine2 && (
                    <>
                        <br />
                        <span className="text-blue-600 dark:text-blue-400">{titleLine2}</span>
                    </>
                )}
            </motion.h1>

            {description && (
                <motion.p
                    {...fade(0.16)}
                    className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2 mb-6"
                >
                    {description}
                </motion.p>
            )}

            {/* Solid accent bar */}
            <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <motion.div
                    className="h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={reducedMotion ? { width: '3rem' } : { width: 0 }}
                    animate={{ width: '3rem' }}
                    transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
                />
                <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500" />
            </div>
        </div>
    );
}
