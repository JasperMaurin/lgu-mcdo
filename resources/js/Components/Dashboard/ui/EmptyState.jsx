import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function EmptyState({
    icon: Icon = Inbox,
    title = 'No data yet',
    description = 'There is nothing to display at the moment.',
    action,
}) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-4 shadow-inner">
                <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </motion.div>
    );
}
