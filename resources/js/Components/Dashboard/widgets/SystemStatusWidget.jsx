import { motion } from 'framer-motion';
import { Activity, Database, Server, Wifi } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const systems = [
    { name: 'API Server', status: 'operational', icon: Server, latency: '42ms' },
    { name: 'Database', status: 'operational', icon: Database, latency: '12ms' },
    { name: 'Network', status: 'operational', icon: Wifi, latency: '8ms' },
    { name: 'Background Jobs', status: 'degraded', icon: Activity, latency: '—' },
];

const statusStyles = {
    operational: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Operational' },
    degraded: { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'Degraded' },
    down: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', label: 'Down' },
};

export default function SystemStatusWidget() {
    const reducedMotion = useReducedMotion();

    return (
        <div className="dashboard-card">
            <h3 className="font-outfit text-lg font-bold text-slate-900 dark:text-white mb-4">System Status</h3>
            <ul className="space-y-3" role="list">
                {systems.map((sys, index) => {
                    const Icon = sys.icon;
                    const style = statusStyles[sys.status];
                    return (
                        <motion.li
                            key={sys.name}
                            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                        >
                            <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                                <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{sys.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`w-2 h-2 rounded-full ${style.dot} ${sys.status === 'operational' ? 'animate-pulse' : ''}`} />
                                    <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{sys.latency}</span>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}
