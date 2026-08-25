import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const tasks = [
    { id: 1, label: 'Review pending applications', done: false, priority: 'high' },
    { id: 2, label: 'Update cooperative registry', done: true, priority: 'medium' },
    { id: 3, label: 'Prepare monthly report', done: false, priority: 'high' },
    { id: 4, label: 'Verify member documents', done: false, priority: 'low' },
    { id: 5, label: 'Schedule board meeting', done: true, priority: 'medium' },
];

const priorityColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    low: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
};

export default function TaskSummary() {
    const reducedMotion = useReducedMotion();
    const completed = tasks.filter((t) => t.done).length;
    const progress = Math.round((completed / tasks.length) * 100);

    return (
        <div className="dashboard-card h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-outfit text-lg font-bold text-slate-900 dark:text-white">Task Summary</h3>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{completed}/{tasks.length}</span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeInOut', delay: reducedMotion ? 0 : 0.3 }}
                    />
                </div>
            </div>

            <ul className="space-y-2" role="list">
                {tasks.map((task, index) => (
                    <motion.li
                        key={task.id}
                        initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        {task.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-label="Completed" />
                        ) : (
                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" aria-label="Pending" />
                        )}
                        <span className={`text-sm flex-1 ${task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.label}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}
