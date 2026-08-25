import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ArrowRightIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import mcdoLogo from '../../../Images/mcdologs.jpg';
import { PUBLIC_NAV_LINKS } from './navConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PublicNav({ activePage, isDark, onToggleTheme }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const reducedMotion = useReducedMotion();

    const navEntrance = reducedMotion
        ? {}
        : { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: 'easeOut' } };

    const mobileMenuMotion = reducedMotion
        ? {}
        : { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3, ease: 'easeOut' } };

    return (
        <motion.nav className="public-nav" {...navEntrance}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Logo */}
                <a href="/" className="flex items-center gap-3 sm:gap-3.5 min-w-0 group">
                    <div className="shrink-0 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-blue-500 transition-colors duration-200">
                        <img src={mcdoLogo} alt="MCDO Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="font-outfit font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white truncate">
                                MCDO OPOL
                            </h2>
                            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-900/60">
                                LGU
                            </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold truncate">
                            Municipal Cooperative Development Office
                        </p>
                    </div>
                </a>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {PUBLIC_NAV_LINKS.map(({ href, label, key }) => (
                        <a key={key} href={href} className={activePage === key ? 'public-nav-link public-nav-link-active' : 'public-nav-link'}>
                            {label}
                        </a>
                    ))}
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-2.5">
                    <motion.button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-blue-500 transition-colors duration-200"
                        whileHover={reducedMotion ? {} : { rotate: 12 }}
                        whileTap={reducedMotion ? {} : { scale: 0.95 }}
                    >
                        {isDark ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
                    </motion.button>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span>Access Portal</span>
                        <ArrowRightIcon className="w-4 h-4" />
                    </a>
                </div>

                {/* Mobile toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <motion.button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                        whileHover={reducedMotion ? {} : { rotate: 12 }}
                        whileTap={reducedMotion ? {} : { scale: 0.95 }}
                    >
                        {isDark ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
                    </motion.button>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((o) => !o)}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle menu"
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                    >
                        {mobileMenuOpen
                            ? <XMarkIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                            : <Bars3Icon className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div {...mobileMenuMotion} className="md:hidden overflow-hidden">
                        <div className="pt-4 pb-2 space-y-1 border-t border-slate-200 dark:border-slate-800 mt-3">
                            {PUBLIC_NAV_LINKS.map(({ href, label, key }) => (
                                <a
                                    key={key}
                                    href={href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                                        activePage === key
                                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {label}
                                </a>
                            ))}
                            <a
                                href="/login"
                                className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl text-center mt-3 shadow-sm"
                            >
                                Access Portal
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
