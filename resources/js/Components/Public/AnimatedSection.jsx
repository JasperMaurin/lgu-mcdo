import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function AnimatedSection({ children, className = '', delay = 0, as: Tag = 'section' }) {
    const reducedMotion = useReducedMotion();
    const MotionTag = motion[Tag] ?? motion.section;

    return (
        <MotionTag
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
            className={className}
        >
            {children}
        </MotionTag>
    );
}

export function AnimatedGrid({ children, className = '', stagger = 0.08 }) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={
                reducedMotion
                    ? {}
                    : {
                          hidden: {},
                          visible: { transition: { staggerChildren: stagger } },
                      }
            }
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedItem({ children, className = '' }) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            variants={
                reducedMotion
                    ? {}
                    : {
                          hidden: { opacity: 0, y: 14 },
                          visible: {
                              opacity: 1,
                              y: 0,
                              transition: { type: 'spring', stiffness: 300, damping: 30 },
                          },
                      }
            }
            className={className}
        >
            {children}
        </motion.div>
    );
}
