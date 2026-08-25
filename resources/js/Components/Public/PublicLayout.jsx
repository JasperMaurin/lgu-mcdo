import PublicBackground from './PublicBackground';
import PublicNav from './PublicNav';
import PublicFooter from './PublicFooter';
import { useTheme } from '../../hooks/useTheme';

export default function PublicLayout({ activePage, children, className = '' }) {
    const { isDark, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <div className="public-page">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className={`public-page flex flex-col ${className}`}>
            <PublicBackground />
            <PublicNav activePage={activePage} isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="relative z-10 flex-1 flex flex-col">{children}</div>
            <PublicFooter />
        </div>
    );
}
