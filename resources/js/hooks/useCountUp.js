import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

function parseValue(value) {
    const str = String(value);
    const match = str.match(/^([^\d]*?)([\d,]+\.?\d*)(.*)$/);
    if (!match) return { prefix: '', suffix: '', numeric: 0, format: 'plain' };

    const [, prefix, numPart, suffix] = match;
    const numeric = parseFloat(numPart.replace(/,/g, ''));

    return {
        prefix,
        suffix,
        numeric: Number.isFinite(numeric) ? numeric : 0,
        format: suffix.includes('M') ? 'millions' : numPart.includes(',') ? 'integer' : 'decimal',
    };
}

function formatValue(current, { prefix, suffix, format }) {
    if (format === 'millions') {
        return `${prefix}${current.toFixed(1)}${suffix}`;
    }
    if (format === 'integer') {
        return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
    }
    return `${prefix}${Math.round(current)}${suffix}`;
}

export function useCountUp(value, duration = 1200) {
    const reducedMotion = useReducedMotion();
    const parsed = parseValue(value);
    const [display, setDisplay] = useState(reducedMotion ? value : formatValue(0, parsed));

    useEffect(() => {
        if (reducedMotion) {
            setDisplay(value);
            return;
        }

        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = parsed.numeric * eased;
            setDisplay(formatValue(current, parsed));

            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [value, duration, reducedMotion, parsed.numeric, parsed.prefix, parsed.suffix, parsed.format]);

    return display;
}
