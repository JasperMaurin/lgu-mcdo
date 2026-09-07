import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    UsersIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    AcademicCapIcon,
    CalendarIcon,
    MapPinIcon,
    PhotoIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    ArrowsPointingOutIcon,
    CheckCircleIcon,
    BuildingLibraryIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import {
    ACHIEVEMENTS_DATA,
    ACHIEVEMENTS_CATEGORIES,
    ACHIEVEMENTS_METRICS,
} from '../../data/achievementsData';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function AchievementsShowcase({
    initialCategory = 'all',
    compact = false,
    showMetrics = true,
}) {
    const reducedMotion = useReducedMotion();
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [activeTabLanguage, setActiveTabLanguage] = useState('executive'); // 'executive' | 'local'
    const [activeAchievementId, setActiveAchievementId] = useState('civic-parade');

    // Lightbox modal state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxAlbum, setLightboxAlbum] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxTitle, setLightboxTitle] = useState('');

    const filteredAchievements =
        selectedCategory === 'all'
            ? ACHIEVEMENTS_DATA
            : ACHIEVEMENTS_DATA.filter((item) => item.categoryKey === selectedCategory);

    const activeFeatured =
        ACHIEVEMENTS_DATA.find((item) => item.id === activeAchievementId) ||
        filteredAchievements[0] ||
        ACHIEVEMENTS_DATA[0];

    const openLightbox = (album, index = 0, title = '') => {
        setLightboxAlbum(album);
        setLightboxIndex(index);
        setLightboxTitle(title);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextPhoto = useCallback(() => {
        if (!lightboxAlbum.length) return;
        setLightboxIndex((prev) => (prev + 1) % lightboxAlbum.length);
    }, [lightboxAlbum.length]);

    const prevPhoto = useCallback(() => {
        if (!lightboxAlbum.length) return;
        setLightboxIndex((prev) => (prev - 1 + lightboxAlbum.length) % lightboxAlbum.length);
    }, [lightboxAlbum.length]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, nextPhoto, prevPhoto]);

    // Icon lookup for category tabs
    const renderCategoryIcon = (key) => {
        const props = { className: 'w-4 h-4 shrink-0' };
        switch (key) {
            case 'civic':
                return <UsersIcon {...props} />;
            case 'environment':
                return <GlobeAltIcon {...props} />;
            case 'governance':
                return <ShieldCheckIcon {...props} />;
            case 'formation':
                return <AcademicCapIcon {...props} />;
            default:
                return <SparklesIcon {...props} />;
        }
    };

    return (
        <div className="w-full">
            {/* ══════════════════════════════════════════════════════════
                1. METRIC COUNTERS STRIP (OPTIONAL)
               ══════════════════════════════════════════════════════════ */}
            {showMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    <div className="public-card p-4 sm:p-5 border-t-2 border-red-600 dark:border-red-500">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Key Milestones
                            </span>
                            <SparklesIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            {ACHIEVEMENTS_METRICS.totalMilestones} Major
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Official 2026 Office Operations
                        </p>
                    </div>

                    <div className="public-card p-4 sm:p-5 border-t-2 border-emerald-600 dark:border-emerald-500">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Community Outreach
                            </span>
                            <UsersIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            14 Barangays
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Coast-to-upland mobilization
                        </p>
                    </div>

                    <div className="public-card p-4 sm:p-5 border-t-2 border-blue-600 dark:border-blue-500">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Photographic Records
                            </span>
                            <PhotoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            {ACHIEVEMENTS_METRICS.totalPhotos} Photos
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Verified on-ground galleries
                        </p>
                    </div>

                    <div className="public-card p-4 sm:p-5 border-t-2 border-indigo-600 dark:border-indigo-500">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Agency Synergy
                            </span>
                            <BuildingLibraryIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            CDA & LGU
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Aligned statutory standards
                        </p>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                2. FILTER TABS & LANGUAGE TOGGLE BAR
               ══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
                    {ACHIEVEMENTS_CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.key;
                        const count =
                            cat.key === 'all'
                                ? ACHIEVEMENTS_DATA.length
                                : ACHIEVEMENTS_DATA.filter((i) => i.categoryKey === cat.key).length;

                        return (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {renderCategoryIcon(cat.key)}
                                <span>{cat.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                        isActive
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Perspective Switcher (Executive English vs Bisaya Dispatch) */}
                <div className="flex items-center self-end lg:self-auto gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <button
                        type="button"
                        onClick={() => setActiveTabLanguage('executive')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                            activeTabLanguage === 'executive'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <DocumentTextIcon className="w-3.5 h-3.5" />
                        <span>Executive Brief</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTabLanguage('local')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                            activeTabLanguage === 'local'
                                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" />
                        <span>Field Dispatch (Cebuano)</span>
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                3. MAIN ACHIEVEMENTS SHOWCASE CARDS
               ══════════════════════════════════════════════════════════ */}
            <div className="space-y-10">
                {filteredAchievements.map((achievement, index) => {
                    const isExpanded = activeAchievementId === achievement.id;

                    return (
                        <motion.article
                            key={achievement.id}
                            id={achievement.id}
                            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="public-card public-card-accent overflow-hidden shadow-sm hover:shadow-md"
                            data-accent={achievement.accent}
                        >
                            {/* Card Header Strip */}
                            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${achievement.accentColor}`}
                                    >
                                        <SparklesIcon className="w-3 h-3" />
                                        {achievement.badge}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                                        {achievement.date}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPinIcon className="w-3.5 h-3.5 text-red-500" />
                                        <span className="hidden sm:inline">{achievement.venue}</span>
                                        <span className="sm:hidden">{achievement.venue.split(',')[0]}</span>
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <button
                                        type="button"
                                        onClick={() => openLightbox(achievement.gallery, 0, achievement.title)}
                                        className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        <PhotoIcon className="w-3.5 h-3.5" />
                                        <span>{achievement.gallery.length} Photos</span>
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Layout (Split Columns: Left Text & Right Photo Grid) */}
                            <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                                {/* Left Side: Narrative & Details */}
                                <div className="lg:col-span-7 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                                            {achievement.title}
                                        </h3>

                                        {/* Tagline / User Caption Banner */}
                                        <div className="inline-block bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 mb-5">
                                            <p className="text-xs sm:text-sm font-semibold italic flex items-center gap-2">
                                                <span className="text-red-500">“</span>
                                                <span>{achievement.tagline}</span>
                                                <span className="text-red-500">”</span>
                                            </p>
                                        </div>

                                        {/* Bilingual Narrative Switcher View */}
                                        <div className="mb-6">
                                            <AnimatePresence mode="wait">
                                                {activeTabLanguage === 'executive' ? (
                                                    <motion.div
                                                        key="executive"
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-3"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                                                                Official Institutional Summary
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                                            {achievement.executiveSummary}
                                                        </p>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="local"
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-3 bg-red-50/40 dark:bg-red-950/20 p-4 rounded-xl border border-red-200/70 dark:border-red-900/50"
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="w-2 h-2 rounded-full bg-red-600" />
                                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-300">
                                                                {achievement.localCaption.headline}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                                                            {achievement.localCaption.body}
                                                        </p>
                                                        {achievement.localCaption.quote && (
                                                            <p className="text-xs font-bold text-red-700 dark:text-red-400 italic pt-1 border-t border-red-200/60 dark:border-red-900/60">
                                                                "{achievement.localCaption.quote}"
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Highlight Points */}
                                        <div className="space-y-2 mb-6">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                                Key Institutional Highlights:
                                            </p>
                                            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                                {achievement.highlights.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2.5">
                                                        <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                        <span className="leading-snug">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Stat Badges / Quick Metrics */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {achievement.stats.map((stat, i) => (
                                            <div
                                                key={i}
                                                className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50"
                                            >
                                                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                                    {stat.label}
                                                </span>
                                                <span className="font-outfit font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate block">
                                                    {stat.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Dynamic Photo Gallery Grid */}
                                <div className="lg:col-span-5 flex flex-col gap-3">
                                    {/* Cover / Featured Image */}
                                    <div
                                        onClick={() => openLightbox(achievement.gallery, 0, achievement.title)}
                                        className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900"
                                    >
                                        <img
                                            src={achievement.coverImage}
                                            alt={achievement.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-90 group-hover:opacity-100 transition-opacity" />

                                        {/* Top Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                                                Featured Photo
                                            </span>
                                        </div>

                                        {/* Bottom Action Bar */}
                                        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
                                            <div className="min-w-0 pr-2">
                                                <p className="text-xs font-bold truncate">
                                                    {achievement.gallery[0]?.title || achievement.title}
                                                </p>
                                                <p className="text-[10px] text-white/75 truncate">
                                                    {achievement.venue}
                                                </p>
                                            </div>
                                            <span className="shrink-0 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors">
                                                <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Thumbnail Strip (Remaining Photos) */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {achievement.gallery.slice(1, 5).map((photo, pIdx) => {
                                            const actualIndex = pIdx + 1;
                                            const isLastSlot = pIdx === 3 && achievement.gallery.length > 5;
                                            const remainingCount = achievement.gallery.length - 4;

                                            return (
                                                <div
                                                    key={pIdx}
                                                    onClick={() =>
                                                        openLightbox(
                                                            achievement.gallery,
                                                            actualIndex,
                                                            achievement.title
                                                        )
                                                    }
                                                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-800"
                                                >
                                                    <img
                                                        src={photo.src}
                                                        alt={photo.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />

                                                    {isLastSlot ? (
                                                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-1">
                                                            <span className="font-outfit font-extrabold text-sm sm:text-base">
                                                                +{remainingCount}
                                                            </span>
                                                            <span className="text-[9px] uppercase font-bold tracking-wider">
                                                                More
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                            <ArrowsPointingOutIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Open Full Album Button */}
                                    <button
                                        type="button"
                                        onClick={() => openLightbox(achievement.gallery, 0, achievement.title)}
                                        className="w-full mt-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-150"
                                    >
                                        <PhotoIcon className="w-4 h-4" />
                                        <span>View Complete Album ({achievement.gallery.length} Photos)</span>
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>

            {/* ══════════════════════════════════════════════════════════
                4. INTERACTIVE LIGHTBOX MODAL
               ══════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {lightboxOpen && lightboxAlbum[lightboxIndex] && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md"
                        onClick={closeLightbox}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl max-h-[95vh] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400 truncate">
                                        {lightboxTitle}
                                    </p>
                                    <h4 className="font-outfit font-bold text-sm sm:text-base text-white truncate">
                                        {lightboxAlbum[lightboxIndex].title}
                                    </h4>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                                        {lightboxIndex + 1} / {lightboxAlbum.length}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={closeLightbox}
                                        aria-label="Close photo preview"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Main Stage */}
                            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[300px] sm:min-h-[460px] bg-black/50 overflow-hidden">
                                <img
                                    src={lightboxAlbum[lightboxIndex].src}
                                    alt={lightboxAlbum[lightboxIndex].title}
                                    className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg select-none"
                                />

                                {/* Prev / Next Arrows */}
                                <button
                                    type="button"
                                    onClick={prevPhoto}
                                    aria-label="Previous photo"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-slate-700/60 transition-all"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={nextPhoto}
                                    aria-label="Next photo"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-slate-700/60 transition-all"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Footer Caption & Thumbnail Strip */}
                            <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-slate-300 max-w-2xl text-center sm:text-left leading-relaxed">
                                    {lightboxAlbum[lightboxIndex].caption}
                                </p>

                                {/* Thumbnail Selector */}
                                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-thin">
                                    {lightboxAlbum.map((photo, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setLightboxIndex(i)}
                                            className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                                i === lightboxIndex
                                                    ? 'border-blue-500 scale-105 shadow-md'
                                                    : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={photo.src}
                                                alt={photo.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
