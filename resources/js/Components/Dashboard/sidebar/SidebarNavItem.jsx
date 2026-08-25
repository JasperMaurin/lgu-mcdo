import { memo } from 'react';
import { motion } from 'framer-motion';
import Tooltip from '../ui/Tooltip';

function SidebarNavItem({ item, collapsed, reducedMotion, onNavigate }) {
    const Icon = item.icon;
    const isActive = item.active;

    const link = (
        <motion.a
            href={item.href}
            onClick={onNavigate}
            whileHover={reducedMotion ? {} : { x: collapsed ? 0 : 3 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`
                group relative flex items-center gap-3 rounded-xl font-medium text-[13px]
                transition-all duration-200 outline-none select-none
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                ${collapsed ? 'justify-center w-10 h-10 p-0 mx-auto' : 'px-3 py-2.5'}
                ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }
            `}
            aria-current={isActive ? 'page' : undefined}
        >
            {isActive && !collapsed && (
                <span
                    className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-sm"
                    aria-hidden="true"
                />
            )}

            <div className="relative shrink-0 flex items-center justify-center">
                {Icon && (
                    <Icon
                        className={`w-[18px] h-[18px] transition-all duration-200 ${isActive
                            ? 'text-white scale-105'
                            : 'text-slate-400 group-hover:text-blue-400 group-hover:scale-110'
                        }`}
                        aria-hidden="true"
                        strokeWidth={isActive ? 2.25 : 1.9}
                    />
                )}
                {collapsed && item.badge != null && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 shadow-sm" />
                )}
            </div>

            {!collapsed && (
                <span className="truncate flex-1 tracking-normal font-medium">
                    {item.label}
                </span>
            )}

            {!collapsed && item.badge != null && item.badge > 0 && (
                <span className="shrink-0 min-w-[22px] h-5 px-1.5 flex items-center justify-center text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/40 rounded-full shadow-sm">
                    {item.badge}
                </span>
            )}
        </motion.a>
    );

    if (collapsed) {
        return (
            <Tooltip content={item.badge ? `${item.label} (${item.badge})` : item.label} disabled={!collapsed}>
                <div className="flex justify-center w-full my-0.5">
                    {link}
                </div>
            </Tooltip>
        );
    }

    return link;
}

export default memo(SidebarNavItem);

