import { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BellAlertIcon, ChartBarIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, EllipsisVerticalIcon, MagnifyingGlassIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useToast } from '../Dashboard/ui/Toast';

const stats = [['Total Feedback', '1,248', ChartBarIcon, 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'], ['Pending Feedback', '84', ClipboardDocumentCheckIcon, 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'], ['Under Review', '39', ChartBarIcon, 'text-violet-600 bg-violet-50 dark:bg-violet-500/10'], ['Resolved Feedback', '1,056', CheckCircleIcon, 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'], ['Average Rating', '4.7', StarIcon, 'text-red-600 bg-red-50 dark:bg-red-500/10'], ['Registered Farmers', '3,482', UserGroupIcon, 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'], ['Cooperative Members', '1,896', UserGroupIcon, 'text-violet-600 bg-violet-50 dark:bg-violet-500/10'], ['Associations', '62', UserGroupIcon, 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10']];
const rows = [{ticket:'MCDO-2026-0148', name:'Maria L. Santos', category:'Training & Seminars', subject:'Request for financial literacy training', status:'Pending', priority:'High'}, {ticket:'MCDO-2026-0147', name:'San Roque MPC', category:'Registration', subject:'Cooperative registration follow-up', status:'Under Review', priority:'Medium'}, {ticket:'MCDO-2026-0146', name:'Carlos B. Reyes', category:'Financial Assistance', subject:'Inquiry about loan requirements', status:'Resolved', priority:'Low'}, {ticket:'MCDO-2026-0145', name:'Opol Farmers Association', category:'Complaint', subject:'Delayed certificate processing', status:'Under Review', priority:'High'}];
const trend = [{month:'Feb',feedback:102},{month:'Mar',feedback:139},{month:'Apr',feedback:118},{month:'May',feedback:164},{month:'Jun',feedback:151},{month:'Jul',feedback:188}];
const category = [{name:'Programs',value:34,color:'#2563eb'},{name:'Registration',value:22,color:'#7c3aed'},{name:'Assistance',value:19,color:'#dc2626'},{name:'Others',value:25,color:'#94a3b8'}];
const statusClass = {Pending:'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300','Under Review':'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',Resolved:'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'};

export default function FeedbackDashboard() {
    const { addToast } = useToast();
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const h = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActive(null);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const filtered = useMemo(() => rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(query.toLowerCase())), [query]);

    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-xl">
                <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full bg-red-500/25 blur-3xl" />
                <p className="text-sm font-semibold text-blue-100">MCDO FEEDBACK MANAGEMENT SYSTEM</p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Good morning, Administrator</h1>
                        <p className="mt-2 text-blue-100">Track, resolve, and improve constituent experiences across cooperative services.</p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([title, value, Icon, style]) => (
                    <motion.article whileHover={{ y: -3 }} key={title} className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-slate-500">{title}</p>
                                <p className="mt-2 text-2xl font-bold">{value}</p>
                                <p className="mt-1 text-xs text-slate-500">Updated this month</p>
                            </div>
                            <span className={`h-fit rounded-xl p-3 ${style}`}>
                                <Icon className="h-5 w-5" />
                            </span>
                        </div>
                    </motion.article>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                    <h2 className="font-bold">Monthly Feedback Trend</h2>
                    <p className="mb-4 text-sm text-slate-500">Feedback submissions over the last six months</p>
                    <div className="h-64">
                        <ResponsiveContainer>
                            <LineChart data={trend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line dataKey="feedback" stroke="#2563eb" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="font-bold">Feedback by Category</h2>
                    <div className="h-52">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={category} dataKey="value" innerRadius={55} outerRadius={80}>
                                    {category.map(c => <Cell key={c.name} fill={c.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {category.map(c => (
                        <p key={c.name} className="inline-flex w-1/2 items-center gap-2 text-xs">
                            <i className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}
                        </p>
                    ))}
                </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <article className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:justify-between">
                        <div>
                            <h2 className="font-bold">Recent Feedback</h2>
                            <p className="text-sm text-slate-500">Review and manage incoming submissions</p>
                        </div>
                        <label className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search feedback" className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                        </label>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950">
                                <tr>
                                    {['Ticket', 'Name', 'Category', 'Subject', 'Status', 'Priority', ''].map(x => <th key={x} className="px-5 py-3">{x}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.ticket} className="border-t border-slate-100 hover:bg-blue-50/50 dark:border-slate-800">
                                        <td className="px-5 py-4 font-mono text-xs text-blue-700">{r.ticket}</td>
                                        <td className="px-5 py-4 font-medium">{r.name}</td>
                                        <td className="px-5 py-4 text-slate-500">{r.category}</td>
                                        <td className="px-5 py-4">{r.subject}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[r.status]}`}>{r.status}</span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold">{r.priority}</td>
                                        <td className="px-5 py-4">
                                            <div className="relative" ref={active === r.ticket ? dropdownRef : null}>
                                                <button onClick={() => setActive(active === r.ticket ? null : r.ticket)} aria-expanded={active === r.ticket} aria-haspopup="menu" className="text-slate-500 hover:text-blue-700 p-1 rounded-lg">
                                                    <EllipsisVerticalIcon className="h-5 w-5" />
                                                </button>
                                                {active === r.ticket && (
                                                    <div role="menu" onClick={e => e.stopPropagation()} className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1">
                                                        <button role="menuitem" onClick={() => { addToast(`Opening ${r.ticket}`, 'info'); setActive(null) }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                                                        <button role="menuitem" onClick={() => { addToast(`Generating QR for ${r.ticket}`, 'info'); setActive(null) }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Generate QR</button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>

                <aside className="space-y-6">
                    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex justify-between">
                            <h2 className="font-bold">Latest Announcements</h2>
                            <BellAlertIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="mt-4 border-l-2 border-blue-600 pl-3 text-sm font-semibold">
                            Cooperative Month 2026<br />
                            <span className="text-xs font-normal text-slate-500">Program activities now open</span>
                        </p>
                        <p className="mt-4 border-l-2 border-red-600 pl-3 text-sm font-semibold">
                            Training Schedule Updated<br />
                            <span className="text-xs font-normal text-slate-500">New slots available for members</span>
                        </p>
                    </article>

                    <article className="rounded-2xl bg-slate-900 p-5 text-white">
                        <h2 className="font-bold">Quick Actions</h2>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {['View Feedback', 'Add Announcement', 'Generate Report'].map(label => (
                                <button key={label} onClick={() => addToast(`${label} is ready for integration.`, 'info')} className="rounded-xl bg-white/10 p-3 text-left text-xs font-semibold hover:bg-white/20">
                                    {label}
                                </button>
                            ))}
                        </div>
                    </article>
                </aside>
            </section>
        </div>
    );
}
