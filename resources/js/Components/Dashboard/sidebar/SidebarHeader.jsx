import { memo } from 'react';
import { motion } from 'framer-motion';
import mcdoLogo from '../../../../Images/mcdologs.jpg';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import Tooltip from '../ui/Tooltip';

function SidebarHeader({ collapsed }) {
    const reducedMotion = useReducedMotion();

    const logoContent = (
        <motion.div
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative shrink-0"
        >
            <div className="w-10 h-10 rounded-xl bg-white p-1 ring-1 ring-white/20 border border-slate-700/80 flex items-center justify-center shadow-md shadow-blue-900/20 overflow-hidden">
                <img src={mcdoLogo} alt="MCDO Logo" className="w-8 h-8 object-contain" />
            </div>
            {/* Online indicator dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </motion.div>
    );

    return (
        <div className={`border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-transparent ${collapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                {collapsed ? (
                    <Tooltip content="MCDO OPOL · Management Portal">
                        <div className="flex justify-center w-full">
                            {logoContent}
                        </div>
                    </Tooltip>
                ) : (
                    logoContent
                )}

                {!collapsed && (
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="min-w-0 flex-1"
                    >
                        <div className="flex items-center gap-1.5">
                            <h1 className="font-outfit text-[15px] font-extrabold tracking-tight text-white truncate">
                                MCDO OPOL
                            </h1>
                            <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white rounded shadow-sm shadow-red-600/30 border border-red-500/40">
                                LGU
                            </span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 truncate mt-0.5 flex items-center gap-1">
                            Management Portal
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-[10px] text-slate-400 truncate font-medium">
                                Misamis Oriental · Active
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default memo(SidebarHeader);

