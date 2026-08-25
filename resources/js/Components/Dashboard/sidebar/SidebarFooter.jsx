import { memo } from 'react';
import { motion } from 'framer-motion';
import mcdoLogo from '../../../../Images/mcdologs.jpg';
import Tooltip from '../ui/Tooltip';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

function SidebarFooter({ collapsed }) {
    const reducedMotion = useReducedMotion();

    if (collapsed) {
        return (
            <div className="mt-auto py-3 px-2 flex flex-col items-center justify-center border-t border-slate-800/80 bg-[#0B0F19]">
                <Tooltip content="Municipality of Opol · Official Seal">
                    <motion.div
                        whileHover={reducedMotion ? {} : { scale: 1.08 }}
                        className="w-10 h-10 rounded-full bg-white p-0.5 ring-2 ring-white border-2 border-blue-600 shadow-lg overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                        <img
                            src={mcdoLogo}
                            alt="Municipality of Opol Seal"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </Tooltip>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" title="White" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-xs" title="Blue" />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-xs" title="Red" />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-auto relative w-full overflow-hidden shrink-0 select-none bg-transparent">
            {/* Municipal High-Visibility Wave Graphic Banner */}
            <div className="relative w-full h-[84px] overflow-hidden">
                <svg
                    viewBox="0 0 280 84"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full block"
                    preserveAspectRatio="none"
                >
                    {/* 1. Crisp Brilliant White Top Highlight Ribbon */}
                    <path
                        d="M0 16 C60 8, 120 28, 155 36 C205 46, 245 46, 280 50 L280 84 L0 84 Z"
                        fill="#FFFFFF"
                    />

                    {/* 2. Vivid Sky Blue Accent Wave */}
                    <path
                        d="M0 22 C55 16, 115 34, 150 42 C195 52, 240 52, 280 56 L280 84 L0 84 Z"
                        fill="#38BDF8"
                    />

                    {/* 3. Bold Vivid Crimson Red Swoosh Ribbon (Right side) */}
                    <path
                        d="M115 42 C165 44, 220 50, 280 62 L280 84 L140 84 Z"
                        fill="#DC2626"
                    />

                    {/* 4. Rich Electric Royal Blue Main Wave */}
                    <path
                        d="M0 32 C45 24, 95 40, 140 50 C185 60, 230 60, 280 64 L280 84 L0 84 Z"
                        fill="#2563EB"
                    />

                    {/* 5. Deep Midnight Navy Blue Base Anchor */}
                    <path
                        d="M0 44 C40 38, 85 50, 125 58 C175 66, 220 70, 280 74 L280 84 L0 84 Z"
                        fill="#0A1128"
                    />
                </svg>

                {/* Overlapping Official Circular Municipal Seal */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 z-10">
                    <motion.div
                        whileHover={reducedMotion ? {} : { scale: 1.06 }}
                        transition={{ duration: 0.2 }}
                        className="w-13 h-13 rounded-full bg-white p-0.5 ring-2 ring-white border-2 border-blue-600 shadow-2xl overflow-hidden flex items-center justify-center cursor-pointer"
                        title="Municipality of Opol Official Seal"
                    >
                        <img
                            src={mcdoLogo}
                            alt="Municipality of Opol Official Seal"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default memo(SidebarFooter);



