import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import mcdoLogo from '../../../Images/mcdologs.jpg';
import { PUBLIC_NAV_LINKS } from './navConfig';

export default function PublicFooter() {
    return (
        <footer className="relative mt-auto border-t-2 border-blue-600 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-14 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <img src={mcdoLogo} alt="MCDO Logo" className="w-9 h-9 object-contain" />
                            </div>
                            <div>
                                <h3 className="font-outfit font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">MCDO OPOL</h3>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">LGU Misamis Oriental</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            The Municipal Cooperative Development Office serves the cooperative sector of Opol, Misamis Oriental with registration, compliance, training, and financial advisory support.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-outfit font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-5">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm">
                            {PUBLIC_NAV_LINKS.map(({ href, label }) => (
                                <li key={href}>
                                    <a href={href} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 hover:translate-x-0.5 inline-block">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-outfit font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-5">Services</h4>
                        <ul className="space-y-2.5 text-sm">
                            {['Registration & Renewal', 'Compliance & Monitoring', 'Capacity Building', 'Financial Advisory'].map((service) => (
                                <li key={service}>
                                    <a href="/services" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 hover:translate-x-0.5 inline-block">
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-outfit font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-5">Get in Touch</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPinIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <span className="text-slate-600 dark:text-slate-300">Municipal Hall, Poblacion, Opol, Misamis Oriental</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <PhoneIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-slate-600 dark:text-slate-300">0906-358-0335</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-slate-600 dark:text-slate-300">opolmcdo@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ClockIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <span className="text-slate-600 dark:text-slate-300">Mon–Fri, 8:00 AM – 5:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} MCDO Opol. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                            aria-label="Back to top"
                        >
                            <ArrowUpIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
