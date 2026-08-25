import { motion } from 'framer-motion';
import { BarChart3, Settings, UserPlus } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const actions = [
    {
        title: 'Add New Member',
        description: 'Register a new cooperative member',
        icon: UserPlus,
        gradient: 'from-red-500 to-red-600',
        hoverColor: 'group-hover:text-red-600 dark:group-hover:text-red-400',
    },
    {
        title: 'Generate Reports',
        description: 'View and export financial reports',
        icon: BarChart3,
        gradient: 'from-blue-500 to-blue-600',
        hoverColor: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    },
    {
        title: 'Settings',
        description: 'Manage system configurations',
        icon: Settings,
        gradient: 'from-emerald-500 to-emerald-600',
        hoverColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
];

export default function QuickActions({ onAction }) {
    const reducedMotion = useReducedMotion();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <motion.button
                        key={action.title}
                        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.35, ease: 'easeInOut' }}
                        whileHover={reducedMotion ? {} : { y: -4, scale: 1.02 }}
                        whileTap={reducedMotion ? {} : { scale: 0.98 }}
                        onClick={() => onAction?.(action.title)}
                        className="dashboard-card text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                            <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                        </div>
                        <h3 className={`font-bold text-slate-900 dark:text-white mb-1 text-base transition-colors ${action.hoverColor}`}>
                            {action.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                    </motion.button>
                );
            })}
        </div>
    );
}
