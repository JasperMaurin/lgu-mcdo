import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const data = [
    { month: 'Jan', members: 120, capital: 180 },
    { month: 'Feb', members: 145, capital: 210 },
    { month: 'Mar', members: 168, capital: 245 },
    { month: 'Apr', members: 190, capital: 280 },
    { month: 'May', members: 215, capital: 310 },
    { month: 'Jun', members: 240, capital: 350 },
];

const maxMembers = Math.max(...data.map((d) => d.members));

export default function ChartWidget() {
    const reducedMotion = useReducedMotion();
    const [animated, setAnimated] = useState(reducedMotion);

    useEffect(() => {
        if (reducedMotion) {
            setAnimated(true);
            return;
        }
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, [reducedMotion]);

    return (
        <div className="dashboard-card h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">Growth Overview</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Member registrations over 6 months</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-red-600 to-red-400" />
                        Members
                    </span>
                </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-48 px-1" role="img" aria-label="Bar chart showing member growth from January to June">
                {data.map((item, index) => {
                    const height = (item.members / maxMembers) * 100;
                    return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                                className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-red-600 to-red-400 shadow-md"
                                initial={{ height: 0 }}
                                animate={{ height: animated ? `${height}%` : 0 }}
                                transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeInOut' }}
                                style={{ minHeight: animated ? 4 : 0 }}
                            />
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
