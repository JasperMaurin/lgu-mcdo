import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../Components/Dashboard/layout/DashboardLayout';
import { useTheme } from '../../hooks/useTheme';
import LogoutSuccess from '../../Components/Dashboard/ui/LogoutSuccess';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function CreateFeedback() {
    const { isDark, toggleTheme, mounted } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

    const handleLogout = async () => {
        try { 
            setShowLogoutSuccess(true); 
        } finally { 
            localStorage.removeItem('auth_token'); 
            localStorage.removeItem('auth_user'); 
        }
    };

    return (
        <>
            <Head title="Submit Feedback - MCDO" />
            <DashboardLayout 
                isDark={isDark} 
                onToggleTheme={toggleTheme} 
                mounted={mounted} 
                sidebarCollapsed={sidebarCollapsed} 
                onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
                mobileOpen={mobileOpen} 
                onMobileOpen={() => setMobileOpen(true)} 
                onMobileClose={() => setMobileOpen(false)} 
                onLogout={handleLogout}
            >
                <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-blue-900 to-blue-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Submit Feedback</h1>
                                <p className="text-blue-100 max-w-xl">
                                    Manually enter feedback from paper forms or direct interactions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
                        <ChatBubbleLeftRightIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Feedback Submission Form</h2>
                        <p className="text-slate-500 mt-2 text-center max-w-md">
                            This is the placeholder for the internal manual feedback submission page. You can add your form fields here.
                        </p>
                    </div>
                </div>
            </DashboardLayout>
            {showLogoutSuccess && <LogoutSuccess onComplete={() => { window.location.href = '/login'; }} />}
        </>
    );
}
