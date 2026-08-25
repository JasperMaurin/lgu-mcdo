import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const suggestions = [
    { label: 'Overview', href: '/dashboard', category: 'Dashboard' },
    { label: 'New Association', href: '#', category: 'Farmers Associations' },
    { label: 'Association Registry', href: '#', category: 'Farmers Associations' },
    { label: 'New Cooperative', href: '#', category: 'Cooperatives' },
    { label: 'Cooperative Registry', href: '#', category: 'Cooperatives' },
    { label: 'New RIC Enrollment', href: '#', category: 'Rural Improvement Club' },
    { label: 'RIC Registry', href: '#', category: 'Rural Improvement Club' },
];

export default function SearchBar({ onSelect }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const reducedMotion = useReducedMotion();

    const filtered = query.trim()
        ? suggestions.filter(
              (s) =>
                  s.label.toLowerCase().includes(query.toLowerCase()) ||
                  s.category.toLowerCase().includes(query.toLowerCase())
          )
        : suggestions;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        setQuery('');
        setOpen(false);
        onSelect?.(item);
        if (item.href && item.href !== '#') {
            window.location.href = item.href;
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search pages, actions..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-300"
                    aria-label="Search dashboard"
                    aria-expanded={open}
                    aria-controls="search-results"
                    role="combobox"
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {open && filtered.length > 0 && (
                    <motion.ul
                        id="search-results"
                        role="listbox"
                        initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? {} : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                    >
                        {filtered.map((item) => (
                            <li key={item.label} role="option">
                                <button
                                    onClick={() => handleSelect(item)}
                                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 flex flex-col gap-0.5"
                                >
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.category}</span>
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
