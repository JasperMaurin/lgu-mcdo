import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function SectionHeading({ eyebrow, title, description, className = '' }) {
    const reducedMotion = useReducedMotion();

    const headingMotion = reducedMotion
        ? {}
        : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: 'easeOut' } };

    return (
        <motion.div className={`text-center mb-12 sm:mb-14 ${className}`} {...headingMotion}>
            {eyebrow && (
                <span className="public-eyebrow text-[11px] font-bold uppercase text-red-600 dark:text-red-400">
                    {eyebrow}
                </span>
            )}
            {title && (
                <h2 className="font-outfit text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                    {title}
                </h2>
            )}
            {description && (
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
                    {description}
                </p>
            )}
            {/* Ornament accent — solid dot • line • dot */}
            <div className="flex items-center justify-center gap-2 mt-5">
                <motion.span
                    className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                    initial={reducedMotion ? { scale: 1 } : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                />
                <motion.div
                    className="h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={reducedMotion ? { width: '2rem' } : { width: 0 }}
                    whileInView={{ width: '2rem' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                />
                <motion.span
                    className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500"
                    initial={reducedMotion ? { scale: 1 } : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                />
            </div>
        </motion.div>
    );
}
