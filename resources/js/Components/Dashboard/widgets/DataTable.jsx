import { motion } from 'framer-motion';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const transactions = [
    { id: 'TXN-001', member: 'Juan Dela Cruz', type: 'Capital Contribution', amount: '₱5,000', date: 'Jul 28, 2026', status: 'completed' },
    { id: 'TXN-002', member: 'Maria Santos', type: 'Loan Payment', amount: '₱2,500', date: 'Jul 27, 2026', status: 'completed' },
    { id: 'TXN-003', member: 'Pedro Reyes', type: 'Loan Application', amount: '₱15,000', date: 'Jul 27, 2026', status: 'pending' },
    { id: 'TXN-004', member: 'Ana Garcia', type: 'Membership Fee', amount: '₱500', date: 'Jul 26, 2026', status: 'completed' },
    { id: 'TXN-005', member: 'Carlos Mendoza', type: 'Withdrawal', amount: '₱3,000', date: 'Jul 25, 2026', status: 'failed' },
];

const statusBadge = {
    completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

export default function DataTable() {
    const reducedMotion = useReducedMotion();

    return (
        <div className="dashboard-card overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Latest financial activity across cooperatives</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="More options">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm" role="table">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            {['ID', 'Member', 'Type', 'Amount', 'Date', 'Status'].map((col) => (
                                <th key={col} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider first:pl-0 last:pr-0">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((row, index) => (
                            <motion.tr
                                key={row.id}
                                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06, duration: 0.3 }}
                                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-200 group"
                            >
                                <td className="py-3.5 px-3 font-mono text-xs text-slate-500 dark:text-slate-400 first:pl-0">{row.id}</td>
                                <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-white">{row.member}</td>
                                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{row.type}</td>
                                <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white tabular-nums">{row.amount}</td>
                                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{row.date}</td>
                                <td className="py-3.5 px-3 last:pr-0">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[row.status]}`}>
                                        {row.status}
                                        {row.status === 'completed' && <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
