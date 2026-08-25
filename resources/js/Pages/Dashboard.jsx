import { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../Components/Dashboard/layout/DashboardLayout';
import FeedbackDashboard from '../Components/Feedback/FeedbackDashboard';
import { useTheme } from '../hooks/useTheme';
import LogoutSuccess from '../Components/Dashboard/ui/LogoutSuccess';

export default function Dashboard() {
    const { isDark, toggleTheme, mounted } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const handleLogout = async () => { try { await axios.post('/logout'); } finally { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); setShowLogoutSuccess(true); } };
    return <><DashboardLayout isDark={isDark} onToggleTheme={toggleTheme} mounted={mounted} sidebarCollapsed={sidebarCollapsed} onSidebarToggle={() => setSidebarCollapsed((value) => !value)} mobileOpen={mobileOpen} onMobileOpen={() => setMobileOpen(true)} onMobileClose={() => setMobileOpen(false)} onLogout={handleLogout}><FeedbackDashboard /></DashboardLayout>{showLogoutSuccess && <LogoutSuccess onComplete={() => { window.location.href = '/login'; }} />}</>;
}
