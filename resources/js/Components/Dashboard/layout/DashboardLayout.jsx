import Sidebar from './Sidebar';
import Header from './Header';
import { ToastProvider } from '../ui/Toast';
import { DashboardSkeleton } from '../ui/LoadingSkeleton';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

export default function DashboardLayout({
    children,
    isDark,
    onToggleTheme,
    mounted,
    sidebarCollapsed,
    onSidebarToggle,
    mobileOpen,
    onMobileOpen,
    onMobileClose,
    onLogout,
}) {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    if (!mounted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <DashboardSkeleton />
            </div>
        );
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={onSidebarToggle}
                    mobileOpen={mobileOpen}
                    onMobileClose={onMobileClose}
                />

                <div
                    className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isDesktop ? (sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]') : ''}`}
                >
                    <Header
                        isDark={isDark}
                        onToggleTheme={onToggleTheme}
                        onMobileMenuOpen={onMobileOpen}
                        onLogout={onLogout}
                    />
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto" id="main-content" role="main">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
