import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import AnimatedSection from './AnimatedSection';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CtaBanner({ title, description, primaryHref = '/login', primaryLabel = 'Access Portal', secondaryHref, secondaryLabel }) {
    const reducedMotion = useReducedMotion();

    return (
        <AnimatedSection className="max-w-4xl mx-auto">
            <div className="public-cta group">
                <div className="absolute inset-0 public-grid-pattern opacity-10" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" aria-hidden="true" />

                <motion.div
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-white mb-3">{title}</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">{description}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a
                            href={primaryHref}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-7 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <span>{primaryLabel}</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </a>
                        {secondaryHref && secondaryLabel && (
                            <a
                                href={secondaryHref}
                                className="inline-flex items-center gap-2 font-semibold py-3 px-7 rounded-xl border-2 border-white/40 text-white hover:bg-white hover:text-slate-900 transition-all duration-200"
                            >
                                {secondaryLabel}
                            </a>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
