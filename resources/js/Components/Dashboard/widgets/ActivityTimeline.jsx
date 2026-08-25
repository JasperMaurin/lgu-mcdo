import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function ActivityTimeline({ activities }) {
    const reducedMotion = useReducedMotion();

    return (
        <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-7 bg-gradient-to-b from-red-500 to-blue-500 rounded-full" aria-hidden="true" />
                <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h3>
            </div>

            <div className="relative">
                <div className="absolute left-[23px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

                <ul className="space-y-1" role="list">
                    {activities.map((activity, index) => {
                        const isCompleted = activity.status === 'completed';
                        return (
                            <motion.li
                                key={activity.id}
                                initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeInOut' }}
                                className="relative flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 group"
                            >
                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {activity.action}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">by {activity.user}</p>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shrink-0">
                                    {activity.time}
                                </span>
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
