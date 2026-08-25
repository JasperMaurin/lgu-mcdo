import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

function SidebarSection({
    section,
    collapsed,
    isOpen,
    onToggle,
    reducedMotion,
    onNavigate,
    index,
}) {
    const hasActiveChild = section.items.some((item) => item.active);
    const canCollapse = section.collapsible && !collapsed;
    const SectionIcon = section.icon;

    // Calculate total badges in section if any
    const totalBadges = section.items.reduce((acc, item) => acc + (item.badge || 0), 0);

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
            className="mb-2.5"
        >
            {!collapsed && (
                <div className="px-1 mb-1">
                    {canCollapse ? (
                        <button
                            type="button"
                            onClick={onToggle}
                            className={`
                                w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                                text-[13px] font-semibold transition-all duration-200 select-none outline-none
                                focus-visible:ring-2 focus-visible:ring-blue-500
                                ${isOpen || hasActiveChild
                                    ? 'text-white bg-slate-900/60 border border-slate-800/80 shadow-xs'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                                }
                            `}
                            aria-expanded={isOpen}
                        >
                            <span className="flex items-center gap-2.5 min-w-0">
                                {SectionIcon && (
                                    <SectionIcon
                                        className={`w-4.5 h-4.5 shrink-0 transition-colors duration-200 ${isOpen || hasActiveChild ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}
                                        aria-hidden="true"
                                        strokeWidth={1.9}
                                    />
                                )}
                                <span className="truncate tracking-tight font-medium text-[13px]">
                                    {section.title}
                                </span>
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                {hasActiveChild && !isOpen && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-400/30" aria-label="Contains active page" />
                                )}
                                {!isOpen && totalBadges > 0 && (
                                    <span className="px-1.5 py-0.5 text-[9.5px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
                                        {totalBadges}
                                    </span>
                                )}
                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-0 text-blue-400' : '-rotate-90'}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </button>
                    ) : (
                        <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                {section.title}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {collapsed && section.title !== 'Overview' && section.title !== 'Dashboard' && (
                <div className="my-2.5 mx-3 border-t border-slate-800/80" role="separator" />
            )}

            <AnimatePresence initial={false}>
                {(collapsed || isOpen || !canCollapse) && (
                    <motion.div
                        initial={canCollapse && !collapsed && !reducedMotion ? { height: 0, opacity: 0 } : false}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={canCollapse && !collapsed && !reducedMotion ? { height: 0, opacity: 0 } : {}}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className={`overflow-hidden ${canCollapse && !collapsed ? 'pl-3.5 ml-4 border-l border-slate-800/80 space-y-1 my-1' : 'space-y-1'}`}
                    >
                        {section.items.map((item) => (
                            <SidebarNavItem
                                key={item.label}
                                item={item}
                                collapsed={collapsed}
                                reducedMotion={reducedMotion}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default memo(SidebarSection);

