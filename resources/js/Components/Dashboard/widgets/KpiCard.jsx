import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useCountUp } from '../../../hooks/useCountUp';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function KpiCard({ title, value, change, icon: Icon, color, delay = 0 }) {
    const displayValue = useCountUp(value);
    const reducedMotion = useReducedMotion();
    const isPositive = change.startsWith('+');

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeInOut' }}
            whileHover={reducedMotion ? {} : { y: -4, scale: 1.02 }}
            className="dashboard-card group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 tabular-nums">{displayValue}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        </motion.div>
    );
}
