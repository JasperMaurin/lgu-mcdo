import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

// Import Pages
import AuthLanding from './Pages/AuthLanding';
import About from './Pages/About';
import Services from './Pages/Services';
import Contact from './Pages/Contact';
import Cooperatives from './Pages/Cooperatives';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import FeedbackCreate from './Pages/Feedback/Create';

const routes = {
    '/': AuthLanding,
    '/about': About,
    '/services': Services,
    '/contact': Contact,
    '/cooperatives': Cooperatives,
    '/login': Login,
    '/dashboard': Dashboard,
    '/profile': Profile,
    '/feedback/create': FeedbackCreate,
};

function App() {
    const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname || '/');
        };

        const handleLinkClick = (e) => {
            const anchor = e.target.closest('a');
            if (
                anchor &&
                anchor.href &&
                anchor.origin === window.location.origin &&
                !anchor.target &&
                !anchor.hasAttribute('download') &&
                !anchor.getAttribute('href')?.startsWith('#') &&
                !anchor.getAttribute('href')?.startsWith('mailto:') &&
                !anchor.getAttribute('href')?.startsWith('tel:')
            ) {
                const url = new URL(anchor.href);
                e.preventDefault();
                window.history.pushState({}, '', url.pathname + url.search + url.hash);
                setCurrentPath(url.pathname);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        window.addEventListener('popstate', handlePopState);
        document.addEventListener('click', handleLinkClick);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    // Match path (normalize trailing slash)
    const normalized = currentPath === '' ? '/' : (currentPath !== '/' && currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath);
    const Component = routes[normalized] || AuthLanding;

    return <Component />;
}

const container = document.getElementById('root');
if (container) {
    createRoot(container).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
