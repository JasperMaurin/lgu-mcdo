import { Menu } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import NotificationsPanel from '../ui/NotificationsPanel';
import UserProfileDropdown from '../ui/UserProfileDropdown';
import ThemeToggle from '../ui/ThemeToggle';
import { useToast } from '../ui/Toast';

export default function Header({ isDark, onToggleTheme, onMobileMenuOpen, onLogout }) {
    const { addToast } = useToast();

    return (
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-8 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/50">
            <button
                onClick={onMobileMenuOpen}
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Open navigation menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
                <SearchBar onSelect={(item) => addToast(`Navigating to ${item.label}`, 'info', 2500)} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
                <NotificationsPanel />
                <UserProfileDropdown onLogout={onLogout} />
            </div>
        </header>
    );
}
