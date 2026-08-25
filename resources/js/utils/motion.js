export const transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

export const fadeInUp = (delay = 0, reducedMotion = false) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { ...transition, delay },
});

export const fadeIn = (delay = 0, reducedMotion = false) => ({
    initial: reducedMotion ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { ...transition, delay },
});

export const slideInRight = (reducedMotion = false) => ({
    initial: reducedMotion ? false : { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: reducedMotion ? {} : { opacity: 0, x: 24 },
    transition,
});

export const slideInLeft = (reducedMotion = false) => ({
    initial: reducedMotion ? false : { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: reducedMotion ? {} : { opacity: 0, x: -24 },
    transition,
});

export const scaleIn = (reducedMotion = false) => ({
    initial: reducedMotion ? false : { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: reducedMotion ? {} : { opacity: 0, scale: 0.96 },
    transition,
});

export const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } },
};
