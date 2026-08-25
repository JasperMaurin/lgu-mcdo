const fs = require('fs');
const path = require('path');

const files = [
    'resources/js/Pages/About.jsx',
    'resources/js/Pages/AuthLanding.jsx',
    'resources/js/Pages/Services.jsx',
    'resources/js/Pages/Cooperatives.jsx',
    'resources/js/Pages/Contact.jsx'
];

const replacements = [
    // Theme toggles
    {
        match: /<svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">.*?<\/svg>/gs,
        replace: '<SunIcon className="w-5 h-5 text-amber-400" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-900 dark:text-slate-700 dark:text-white\/80" fill="currentColor" viewBox="0 0 20 20">.*?<\/svg>/gs,
        replace: '<MoonIcon className="w-5 h-5 text-slate-900 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">.*?<\/svg>/gs,
        replace: '<MoonIcon className="w-5 h-5 text-slate-600" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-900 dark:text-white\/80" fill="currentColor" viewBox="0 0 20 20">.*?<\/svg>/gs,
        replace: '<MoonIcon className="w-5 h-5 text-slate-900 dark:text-white/80" />'
    },
    // Arrows
    {
        match: /<svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">.*?<\/svg>/gs,
        replace: '<ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />'
    },
    {
        match: /<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"><\/path><\/svg>/g,
        replace: '<ArrowRightIcon className="w-4 h-4" />'
    },
    // Menus
    {
        match: /<svg className="w-5 h-5 text-slate-900 dark:text-slate-700 dark:text-white\/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"><\/path><\/svg>/g,
        replace: '<XMarkIcon className="w-5 h-5 text-slate-900 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-900 dark:text-slate-700 dark:text-white\/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"><\/path><\/svg>/g,
        replace: '<Bars3Icon className="w-5 h-5 text-slate-900 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-600 dark:text-white\/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"><\/path><\/svg>/g,
        replace: '<XMarkIcon className="w-5 h-5 text-slate-600 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-600 dark:text-white\/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"><\/path><\/svg>/g,
        replace: '<Bars3Icon className="w-5 h-5 text-slate-600 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-900 dark:text-white\/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"><\/path><\/svg>/g,
        replace: '<XMarkIcon className="w-5 h-5 text-slate-900 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-900 dark:text-white\/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"><\/path><\/svg>/g,
        replace: '<Bars3Icon className="w-5 h-5 text-slate-900 dark:text-white/80" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"><\/path><\/svg>/g,
        replace: '<XMarkIcon className="w-5 h-5 text-slate-600" />'
    },
    {
        match: /<svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"><\/path><\/svg>/g,
        replace: '<Bars3Icon className="w-5 h-5 text-slate-600" />'
    },
    // Footer / Contact
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17\.657 16\.657.*?<\/svg>/gs,
        replace: '<MapPinIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2.*?<\/svg>/gs,
        replace: '<PhoneIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7\.89 5\.26.*?<\/svg>/gs,
        replace: '<EnvelopeIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3.*?<\/svg>/gs,
        replace: '<ClockIcon className="$1" />'
    },
    // Other icons
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"><\/path><\/svg>/g,
        replace: '<BoltIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0.*?<\/svg>/gs,
        replace: '<EyeIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2.*?<\/svg>/gs,
        replace: '<UsersIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2.*?<\/svg>/gs,
        replace: '<BuildingOfficeIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9.*?<\/svg>/gs,
        replace: '<ScaleIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2.*?<\/svg>/gs,
        replace: '<DocumentTextIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"><\/path><\/svg>/g,
        replace: '<ShieldCheckIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1\.657 0-3 \.895-3 2.*?<\/svg>/gs,
        replace: '<BanknotesIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5\.618-4\.016.*?<\/svg>/gs,
        replace: '<SparklesIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4\.354a4 4 0 110 5\.292.*?<\/svg>/gs,
        replace: '<AcademicCapIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2.*?<\/svg>/gs,
        replace: '<ClipboardDocumentCheckIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10\.325 4\.317.*?<\/svg>/gs,
        replace: '<CogIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2.*?<\/svg>/gs,
        replace: '<DocumentPlusIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2.*?<\/svg>/gs,
        replace: '<ChartBarIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"><\/path><\/svg>/g,
        replace: '<ArrowsRightLeftIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4\.318 6\.318a4\.5 4\.5 0 000 6\.364.*?<\/svg>/gs,
        replace: '<HeartIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z.*?<\/svg>/gs,
        replace: '<AcademicCapIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"><\/path><\/svg>/g,
        replace: '<UserIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2\.586.*?<\/svg>/gs,
        replace: '<InboxIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"><\/path><\/svg>/g,
        replace: '<ChevronDownIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"><\/path><\/svg>/g,
        replace: '<ArrowDownIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"><\/path><\/svg>/g,
        replace: '<CheckCircleIcon className="$1" />'
    },
    {
        match: /<svg className="([^"]*)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"><\/path><\/svg>/g,
        replace: '<PaperAirplaneIcon className="$1" />'
    },
    // Fix dark colors
    {
        match: /dark:bg-\[\#080b16\]/g,
        replace: 'dark:bg-[#0a0a0f]'
    },
    {
        match: /dark:bg-\[\#0b0f1d\]/g,
        replace: 'dark:bg-[#0a0a0f]'
    },
    {
        match: /bg-slate-950/g,
        replace: 'bg-[#0a0a0f]'
    }
];

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    
    replacements.forEach(r => {
        content = content.replace(r.match, r.replace);
    });

    // Extract all used icons from content
    const iconRegex = /<([A-Z][a-zA-Z0-9]*Icon)\b/g;
    const icons = new Set();
    let match;
    while ((match = iconRegex.exec(content)) !== null) {
        icons.add(match[1]);
    }

    if (icons.size > 0) {
        const importStatement = `import { ${Array.from(icons).join(', ')} } from '@heroicons/react/24/outline';\n`;
        // add import statement after framer-motion or react if not there
        if (!content.includes('@heroicons/react/24/outline')) {
            content = content.replace(/(import React.*?;\n)(import .*?\n)*/, `$1$2${importStatement}`);
        }
    }

    fs.writeFileSync(path.join(__dirname, file), content);
});
console.log('done');
