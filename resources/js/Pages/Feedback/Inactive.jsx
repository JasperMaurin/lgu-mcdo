import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    QrCode, AlertTriangle, ArrowLeft, Building2, MapPin, 
    Calendar, PhoneCall, Mail, Clock, Volume2, VolumeX, ShieldAlert,
    HelpCircle
} from 'lucide-react';
import MCDOLogo from '../../../Images/mcdologs.jpg';

const TRANSLATIONS = {
    en: {
        headerOffice: 'Municipal Cooperative Development Office',
        inactiveTitle: 'QR Code Inactive',
        notFoundTitle: 'QR Code Not Found',
        expiredTitle: 'QR Code Expired',
        defaultMsg: 'This QR code is currently inactive or has been disabled by the Municipal Cooperative Development Office (MCDO). Feedback collection for this link is closed.',
        notFoundMsg: 'The QR code link you scanned or opened does not exist or may have been permanently deleted.',
        expiredMsg: 'This QR code feedback period has expired and is no longer accepting new submissions.',
        eventDetails: 'Target Service / Event Details',
        serviceName: 'Service Name',
        category: 'Category',
        venue: 'Venue',
        date: 'Event Date',
        statusLabel: 'Current Status',
        officeInfoTitle: 'Need Assistance?',
        officeName: 'LGU-Opol MCDO Office',
        location: 'Municipal Hall Building, Poblacion, Opol, Misamis Oriental',
        hours: 'Monday to Friday | 8:00 AM – 5:00 PM',
        contactUs: 'Contact MCDO',
        returnHome: 'Return to Homepage',
        readAloud: 'Read Aloud',
        stopAudio: 'Stop Audio',
        noticeHeader: 'Notice to Citizens',
        noticeText: 'If you require assistance or wish to submit feedback directly to our office, please visit the MCDO office during office hours or contact us via our official page.',
    },
    fil: {
        headerOffice: 'Tanggapan ng Pagpapaunlad ng Kooperatiba ng Munisipyo',
        inactiveTitle: 'Hindi Aktibo ang QR Code',
        notFoundTitle: 'Hindi Nahanap ang QR Code',
        expiredTitle: 'Nakalipas na ang QR Code',
        defaultMsg: 'Ang QR code na ito ay kasalukuyang hindi aktibo o in-disable ng Municipal Cooperative Development Office (MCDO). Isinara na ang pagtanggap ng puna para sa link na ito.',
        notFoundMsg: 'Ang QR code link na iyong ini-scan o binuksan ay hindi umiiral o maaaring permanenteng nabura na.',
        expiredMsg: 'Ang panahon ng pagbibigay ng puna para sa QR code na ito ay nakalipas na at hindi na tumatanggap ng mga bagong tugon.',
        eventDetails: 'Mga Detalye ng Serbisyo / Kaganapan',
        serviceName: 'Pangalan ng Serbisyo',
        category: 'Kategorya',
        venue: 'Lugar',
        date: 'Petsa ng Kaganapan',
        statusLabel: 'Kasalukuyang Katayuan',
        officeInfoTitle: 'Kailangan ng Tulong?',
        officeName: 'Tanggapan ng LGU-Opol MCDO',
        location: 'Gusali ng Pamahalaang Bayan, Poblacion, Opol, Misamis Oriental',
        hours: 'Lunes hanggang Biyernes | 8:00 AM – 5:00 PM',
        contactUs: 'Makipag-ugnayan sa MCDO',
        returnHome: 'Bumalik sa Home Page',
        readAloud: 'Pakinggan',
        stopAudio: 'Itigil ang Salita',
        noticeHeader: 'Pabatid sa mga Mamamayan',
        noticeText: 'Kung kailangan ninyo ng tulong o nais magpasa ng puna nang direkta sa aming tanggapan, mangyaring bumisita sa opisina ng MCDO sa oras ng trabaho.',
    }
};

export default function Inactive({ code, status = 'inactive', title, message, qrDetails }) {
    const [lang, setLang] = useState('en');
    const t = TRANSLATIONS[lang];
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const pageTitle = title || (status === 'not_found' ? t.notFoundTitle : status === 'Expired' ? t.expiredTitle : t.inactiveTitle);
    const pageMsg = message || (status === 'not_found' ? t.notFoundMsg : status === 'Expired' ? t.expiredMsg : t.defaultMsg);

    const toggleSpeech = () => {
        if (!('speechSynthesis' in window)) return;
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        } else {
            window.speechSynthesis.cancel();
            const textToSpeak = `${pageTitle}. ${pageMsg}. ${qrDetails?.name ? 'Event: ' + qrDetails.name : ''}`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = lang === 'fil' ? 'tl-PH' : 'en-US';
            utterance.rate = 0.9;
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);
            setSpeaking(true);
            window.speechSynthesis.speak(utterance);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString(lang === 'fil' ? 'fil-PH' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
            <Head title={`${pageTitle} — LGU-OPOL MCDO`} />

            {/* Top Navigation Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                            <img src={MCDOLogo} alt="MCDO Logo" className="w-10 h-10 object-contain rounded-lg" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-900 leading-none tracking-wide">LGU-OPOL MCDO</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{t.headerOffice}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-semibold">
                            <button
                                type="button"
                                onClick={() => setLang('en')}
                                className={`px-2.5 py-1 rounded-lg transition-all ${lang === 'en' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setLang('fil')}
                                className={`px-2.5 py-1 rounded-lg transition-all ${lang === 'fil' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Filipino
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden"
                >
                    {/* Status Header Banner */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/50 p-8 border-b border-amber-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
                        <div className="w-20 h-20 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-inner relative z-10">
                            <div className="relative">
                                <QrCode className="w-10 h-10 text-amber-600 opacity-40" />
                                <ShieldAlert className="w-8 h-8 text-amber-600 absolute inset-0 m-auto" />
                            </div>
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {status === 'Expired' ? 'Expired QR Code' : status === 'not_found' ? 'Invalid Link' : 'Inactive QR Code'}
                                </span>
                                {code && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-500 font-mono text-xs rounded-full">
                                        ID: {code}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                {pageTitle}
                            </h1>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                {pageMsg}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={toggleSpeech}
                            className={`sm:absolute sm:top-6 sm:right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                                speaking 
                                    ? 'bg-amber-500 text-white border-amber-600 animate-pulse shadow-md' 
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:text-amber-700 shadow-sm'
                            }`}
                            title={speaking ? t.stopAudio : t.readAloud}
                        >
                            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
                            <span>{speaking ? t.stopAudio : t.readAloud}</span>
                        </button>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">

                        {/* Associated Event / Service Info Card if available */}
                        {qrDetails && (
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                    {t.eventDetails}
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    {qrDetails.name && (
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">{t.serviceName}</p>
                                            <p className="font-bold text-slate-800 mt-0.5">{qrDetails.name}</p>
                                        </div>
                                    )}
                                    {qrDetails.category && (
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">{t.category}</p>
                                            <p className="font-semibold text-slate-700 mt-0.5">{qrDetails.category}</p>
                                        </div>
                                    )}
                                    {qrDetails.venue && (
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">{t.venue}</p>
                                            <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                {qrDetails.venue}
                                            </p>
                                        </div>
                                    )}
                                    {qrDetails.date && (
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">{t.date}</p>
                                            <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                {formatDate(qrDetails.date)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notice Box */}
                        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">{t.noticeHeader}</h4>
                                <p className="text-xs text-blue-800 mt-1 leading-relaxed">{t.noticeText}</p>
                            </div>
                        </div>

                        {/* Office Information & Assistance */}
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                {t.officeInfoTitle}
                            </h3>
                            <div className="space-y-2 text-xs text-slate-600">
                                <p className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                                    {t.officeName}
                                </p>
                                <p className="flex items-center gap-2 pl-6">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {t.location}
                                </p>
                                <p className="flex items-center gap-2 pl-6">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {t.hours}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.href = '/'}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t.returnHome}
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.href = '/contact'}
                                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm transition-all"
                            >
                                <PhoneCall className="w-4 h-4 text-blue-600" />
                                {t.contactUs}
                            </button>
                        </div>

                    </div>
                </motion.div>

                {/* Footer Credits */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    © {new Date().getFullYear()} Municipal Cooperative Development Office — LGU Opol, Misamis Oriental
                </p>
            </main>
        </div>
    );
}
