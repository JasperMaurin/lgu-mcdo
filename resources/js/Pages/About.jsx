import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import voxImg from '../../Images/Vox.jpg';
import jayImg from '../../Images/Jay.jpg';
import mailynImg from '../../Images/Mailyn Quiblat.jpg';
import darlineImg from '../../Images/Darline Yasay.jpg';
import jasperImg from '../../Images/Jasper Maurin.jpg';
import { BoltIcon, EyeIcon, UsersIcon, BuildingOfficeIcon, ScaleIcon } from '@heroicons/react/24/outline';
import PublicLayout from '../Components/Public/PublicLayout';
import PageHeader from '../Components/Public/PageHeader';
import SectionHeading from '../Components/Public/SectionHeading';
import AnimatedSection, { AnimatedGrid, AnimatedItem } from '../Components/Public/AnimatedSection';
import CtaBanner from '../Components/Public/CtaBanner';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TEAM = [
    { name: 'Mailyn Quiblat', role: 'MCDO Designate', img: mailynImg, fallback: 'Mailyn+Quiblat&background=1d4ed8' },
    { name: 'Darline Yasay', role: 'MCDO Staff', img: darlineImg, fallback: 'Darline+Yasay&background=EF4444' },
    { name: 'Jasper Maurin', role: 'MCDO IT Staff', img: jasperImg, fallback: 'Jasper+Maurin&background=64748B' },
];

const PILLARS = [
    { icon: UsersIcon, title: 'Strategic Partnerships', desc: 'Building strong alliances with government agencies, NGOs, and private sectors to expand cooperative resources.', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/15', accent: 'blue' },
    { icon: BuildingOfficeIcon, title: 'Capacity Building', desc: 'Providing continuous education, training programs, and technical assistance to enhance cooperative management.', color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15', accent: 'amber' },
    { icon: ScaleIcon, title: 'Regulatory Support', desc: 'Ensuring cooperatives remain compliant while helping them navigate legal and structural requirements effectively.', color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/15', accent: 'indigo' },
];

export default function About() {
    const [mayorActive, setMayorActive] = useState(true);
    const reducedMotion = useReducedMotion();
    useEffect(() => { const interval = setInterval(() => setMayorActive((p) => !p), 5000); return () => clearInterval(interval); }, []);

    return (
        <PublicLayout activePage="about">
            <main className="px-4 sm:px-8 lg:px-12 pt-4 pb-16 lg:pb-24">
                <PageHeader eyebrow="Discover our purpose" title="About MCDO" titleLine2="Opol" description="Empowering local cooperatives through comprehensive support, capacity building, and sustainable development initiatives in Misamis Oriental." />

                {/* ── Municipal Officials Slider ── */}
                <AnimatedSection className="max-w-5xl mx-auto mb-16 sm:mb-20">
                    <SectionHeading eyebrow="Leadership" title="Municipal Officials" />
                    <div className="relative w-full aspect-[4/5] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60 shadow-lg bg-slate-900">
                        <AnimatePresence mode="wait">
                            {mayorActive ? (
                                <motion.div key="mayor" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? {} : { opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-slate-900 p-6 sm:p-10 flex flex-col justify-center order-2 sm:order-1 relative border-r border-slate-800">
                                        <div className="relative z-10">
                                            <span className="inline-block self-start px-3 py-1 bg-red-900/60 border border-red-500/50 text-red-200 text-xs font-extrabold uppercase tracking-wider rounded-full mb-4">Municipal Mayor</span>
                                            <h3 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white mb-2">Hon. Jay B. Bago</h3>
                                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">Dedicated to sustainable growth and community empowerment across all municipalities of Opol.</p>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2 h-1/2 sm:h-full relative order-1 sm:order-2 bg-slate-950">
                                        <img src={jayImg} alt="Municipal Mayor Hon. Jay B. Bago" className="w-full h-full object-cover object-top" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Jay+Bago&background=1d4ed8&color=fff&size=512'; }} />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="vice-mayor" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? {} : { opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-slate-900 p-6 sm:p-10 flex flex-col justify-center order-2 sm:order-1 relative border-r border-slate-800">
                                        <div className="relative z-10">
                                            <span className="inline-block self-start px-3 py-1 bg-red-900/60 border border-red-500/50 text-red-200 text-xs font-extrabold uppercase tracking-wider rounded-full mb-4">Municipal Vice Mayor</span>
                                            <h3 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white mb-2">Hon. Vox B. Bago</h3>
                                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">Working hand-in-hand to implement visionary policies for cooperative excellence.</p>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2 h-1/2 sm:h-full relative order-1 sm:order-2 bg-slate-950">
                                        <img src={voxImg} alt="Municipal Vice Mayor Hon. Vox B. Bago" className="w-full h-full object-cover object-top" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Vox+Bago&background=dc2626&color=fff&size=512'; }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Slide indicators with labels */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                            <button type="button" onClick={() => setMayorActive(true)} aria-label="Show mayor" className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${mayorActive ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-800 text-white/70 hover:bg-slate-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${mayorActive ? 'bg-blue-600' : 'bg-slate-400'}`} />
                                Mayor
                            </button>
                            <button type="button" onClick={() => setMayorActive(false)} aria-label="Show vice mayor" className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${!mayorActive ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-800 text-white/70 hover:bg-slate-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${!mayorActive ? 'bg-red-600' : 'bg-slate-400'}`} />
                                Vice Mayor
                            </button>
                        </div>
                    </div>
                </AnimatedSection>

                {/* ── Mission & Vision ── */}
                <AnimatedGrid className="max-w-6xl mx-auto mb-16 sm:mb-20 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <AnimatedItem>
                        <article className="public-card public-card-accent p-7 sm:p-10 h-full" data-accent="red">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mb-6 shadow-sm relative z-10">
                                    <BoltIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">To foster a thriving cooperative ecosystem that contributes significantly to the economic development of Opol. We work tirelessly alongside cooperative members to ensure growth, financial stability, and meaningful community impact.</p>
                            </div>
                        </article>
                    </AnimatedItem>
                    <AnimatedItem>
                        <article className="public-card public-card-accent p-7 sm:p-10 h-full" data-accent="blue">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-sm relative z-10">
                                    <EyeIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">To be the premier catalyst for cooperative excellence, cultivating a unified community where robust, self-sustaining cooperatives drive continuous prosperity and elevated quality of life for all residents of Opol.</p>
                            </div>
                        </article>
                    </AnimatedItem>
                </AnimatedGrid>

                {/* ── Core Pillars ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-16 sm:mb-20">
                    <SectionHeading eyebrow="Our foundation" title="Core Pillars of Support" description="The foundational elements that drive our initiatives and cooperative partnerships." />
                    <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                        {PILLARS.map(({ icon: Icon, title, desc, color, accent }) => (
                            <AnimatedItem key={title}>
                                <article className="public-card public-card-accent p-6 sm:p-7 h-full" data-accent={accent}>
                                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-outfit text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                                </article>
                            </AnimatedItem>
                        ))}
                    </AnimatedGrid>
                </AnimatedSection>

                {/* ── Team ── */}
                <AnimatedSection className="max-w-6xl mx-auto mb-16 sm:mb-20">
                    <SectionHeading eyebrow="Our team" title="MCDO Staff" />
                    <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {TEAM.map(({ name, role, img, fallback }) => (
                            <AnimatedItem key={name}>
                                <article className="public-card p-5 text-center h-full group">
                                    <div className="w-24 h-32 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-700 mb-4 overflow-hidden public-photo-frame border border-slate-200/80 dark:border-slate-700/60 ring-2 ring-transparent group-hover:ring-red-500/20 dark:group-hover:ring-red-400/20 transition-all duration-300">
                                        <img src={img} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${fallback}&color=fff&size=200`; }} />
                                    </div>
                                    <h3 className="font-outfit font-bold text-sm text-slate-900 dark:text-white">{name}</h3>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 mt-1 bg-red-50 dark:bg-red-500/15 inline-block px-2.5 py-0.5 rounded-full">{role}</p>
                                </article>
                            </AnimatedItem>
                        ))}
                    </AnimatedGrid>
                </AnimatedSection>

                <CtaBanner title="Want to work with our office?" description="Reach out and a cooperative development officer will respond within one business day." primaryHref="/contact" primaryLabel="Get in touch" />
            </main>
        </PublicLayout>
    );
}
