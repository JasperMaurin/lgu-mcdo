import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function CalendarWidget() {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const reducedMotion = useReducedMotion();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const events = [5, 12, 18, 25];

    return (
        <div className="dashboard-card h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-outfit text-lg font-bold text-slate-900 dark:text-white">Calendar</h3>
                <div className="flex items-center gap-1">
                    <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Previous month">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={`${year}-${month}`}
                            initial={reducedMotion ? false : { opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reducedMotion ? {} : { opacity: 0, y: 4 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-[120px] text-center"
                        >
                            {MONTHS[month]} {year}
                        </motion.span>
                    </AnimatePresence>
                    <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Next month">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-slate-400 uppercase py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    const hasEvent = day && events.includes(day);
                    return (
                        <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-colors duration-200
                                ${!day ? '' : isToday ? 'bg-gradient-to-br from-red-500 to-blue-600 text-white font-bold shadow-md' : hasEvent ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-950/50' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                        >
                            {day || ''}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
