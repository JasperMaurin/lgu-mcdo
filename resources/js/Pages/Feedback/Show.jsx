import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, CheckCircle, User, Mail, Users, MapPin,
    Calendar, Briefcase, QrCode, Loader2, Info,
    ArrowLeft, RefreshCw, ChevronDown, Globe, Shield,
    Volume2, VolumeX
} from 'lucide-react';
import MCDOLogo from '../../../Images/mcdologs.jpg';

const TRANSLATIONS = {
    en: {
        headerOffice: 'Municipal Cooperative Development Office',
        defaultTitle: 'Service Feedback Form',
        defaultDesc: 'Share your experience to help us serve you better.',
        formProgress: 'Form Progress',
        completed: 'completed',
        sections: ['Overall Satisfaction', 'Service Evaluation', 'Additional Insights', 'Contact Information'],

        readAloud: 'Read Aloud',
        stopAudio: 'Stop Audio',

        sec1Title: 'Overall Satisfaction',
        sec1Desc: 'How would you rate your overall experience with our service today?',
        tapStar: 'Tap a star to rate',
        ratingLabels: {
            1: 'Very Dissatisfied',
            2: 'Dissatisfied',
            3: 'Neutral',
            4: 'Satisfied',
            5: 'Very Satisfied',
        },

        sec2Title: 'Service Evaluation',
        sec2Desc: 'Rate us on each of the following criteria.',
        metrics: [
            { id: 'timeliness', label: 'Timeliness of Service', desc: 'Was the service delivered in a timely manner?' },
            { id: 'professionalism', label: 'Staff Professionalism & Courtesy', desc: 'Were our staff professional and courteous?' },
            { id: 'clarity', label: 'Clarity of Information', desc: 'Was information communicated clearly?' },
        ],
        evalOptions: [
            { value: 'Excellent', label: 'Excellent', color: 'emerald' },
            { value: 'Good', label: 'Good', color: 'blue' },
            { value: 'Average', label: 'Average', color: 'amber' },
            { value: 'Poor', label: 'Poor', color: 'red' },
        ],

        sec3Title: 'Additional Insights',
        sec3Desc: 'Tell us more about your visit or contact with our office.',
        visitReasonLabel: 'Primary Reason for Visit / Contact',
        visitReasonPlaceholder: 'Select a reason...',
        visitReasons: [
            { value: 'Cooperative Registration', label: 'Cooperative Registration' },
            { value: 'Training / Seminar', label: 'Training / Seminar' },
            { value: 'Financial Assistance Inquiry', label: 'Financial Assistance Inquiry' },
            { value: 'General Information', label: 'General Information' },
            { value: 'Other', label: 'Other' },
        ],
        strengthsLabel: 'What did we do well?',
        strengthsPlaceholder: 'Share your positive experiences with us...',
        improvementsLabel: 'How can we improve?',
        improvementsPlaceholder: 'Suggest areas for improvement...',

        sec4Title: 'Contact Information',
        sec4Desc: "Provide your details if you'd like us to follow up with you.",
        anonymousLabel: 'Submit anonymously',
        anonymousDesc: 'Your identity will not be recorded',
        anonymousInfo: 'You are submitting anonymously. Contact fields are optional. Any information entered will only be used if follow-up is needed.',
        fullName: 'Full Name',
        fullNamePlaceholder: 'e.g. Jasper Maurin',
        barangay: 'Barra',
        barangayPlaceholder: 'Select Barangay in Opol...',
        cooperative: 'Cooperative / Association',
        cooperativePlaceholder: 'e.g. Opol Farmers Cooperative',
        email: 'Email Address',
        emailPlaceholder: 'e.g. juan@email.com',

        submit: 'Submit Feedback',
        submitting: 'Submitting...',
        incompleteWarning: 'Please complete all required sections before submitting.',
        privacyNotice: 'Information provided is protected under the Data Privacy Act of the Philippines.',

        thankYou: 'Thank You!',
        successMsg: 'Your feedback has been successfully submitted. Your response helps us improve our services for the community.',
        returnHome: 'Return Home',
        submitAnother: 'Submit Another',

        // Training Evaluation
        trainingEvalTitle: 'Training Evaluation',
        trainingEvalDesc: 'Since you attended a training, please answer these additional questions.',
        likedMostLabel: 'What did you appreciate about this training?',
        likedMostPlaceholder: 'Your feedback...',
        dislikedLabel: 'What did you not like about this training?',
        dislikedPlaceholder: 'Your feedback...',
        helpfulTopicLabel: 'Which topic/subject will be a great help to you?',
        helpfulTopicPlaceholder: 'Your feedback...',
        unusableTopicLabel: 'Which topics/subjects can you not use?',
        unusableTopicPlaceholder: 'Your feedback...',
        futureTrainingLabel: 'What other training would you like to join in the future?',
        futureTrainingPlaceholder: 'Your feedback...',
        trainerRatingLabel: 'How would you rate the trainer/speaker?',
        timeSufficientLabel: 'Was the training duration sufficient?',
        venueFeedbackLabel: 'How was the training venue/facility?',
        venueFeedbackPlaceholder: 'Your feedback...',
        recommendTrainingLabel: 'Would you recommend this training to others?',
        yesLabel: 'Yes',
        noLabel: 'No',
        selectOption: 'Select an option...',

        trainingViewsTitle: 'What are your views on the following:',
        timePerTopicLabel: 'Time allotted for each topic/activity',
        trainingDurationLabel: 'Overall duration of the training',
        justRightLabel: 'Just Right',
        needsMoreLabel: 'Needs More',
        whatToAddLabel: 'What needs to be added?',
        whatToAddPlaceholder: 'Please specify...',

        trainingRatingTitle: 'Overall rating of the Training:',
        trainingMetrics: [
            { id: 'expectationsMet', label: 'Expectations met' },
            { id: 'objectivesAchieved', label: 'Objectives of the training achieved' },
            { id: 'topicsContent', label: 'Topics and their content' },
            { id: 'activitiesConducted', label: 'Activities conducted' },
            { id: 'teachingMethods', label: 'Teaching methods' },
            { id: 'teachingMaterials', label: 'Teaching materials' },
            { id: 'speakersRating', label: 'Speakers' },
            { id: 'facilitatorsRating', label: 'Training facilitators' },
            { id: 'facilitiesServices', label: 'Training facilities and services' },
        ],
        trainingEvalOptions: [
            { value: 'Very Good', label: 'Very Good', color: 'emerald' },
            { value: 'Good', label: 'Good', color: 'blue' },
            { value: 'Fair', label: 'Fair', color: 'amber' },
            { value: 'Poor', label: 'Poor', color: 'orange' },
            { value: 'Very Poor', label: 'Very Poor', color: 'red' },
        ]
    },
    fil: {
        headerOffice: 'Tanggapan ng Pagpapaunlad ng Kooperatiba ng Munisipyo',
        defaultTitle: 'Pormularyo ng Puna sa Serbisyo',
        defaultDesc: 'Ibahagi ang iyong karanasan upang matulungan kaming mapabuti ang aming serbisyo.',
        formProgress: 'Progres ng Pormularyo',
        completed: 'natapos',
        sections: ['Kabuuan ng Kasiyahan', 'Pagsusuri ng Serbisyo', 'Karagdagang Opinyon', 'Impormasyon sa Pagtawag'],

        readAloud: 'Pakinggan',
        stopAudio: 'Itigil ang Salita',

        sec1Title: 'Kabuuan ng Kasiyahan',
        sec1Desc: 'Paano mo tatayahin ang iyong pangkalahatang karanasan sa aming serbisyo ngayong araw?',
        tapStar: 'Pindutin ang bituin upang mag-rate',
        ratingLabels: {
            1: 'Lubos na Hindi Nasiyahan',
            2: 'Hindi Nasiyahan',
            3: 'Katamtaman / Neutral',
            4: 'Nasiyahan',
            5: 'Lubos na Nasiyahan',
        },

        sec2Title: 'Pagsusuri ng Serbisyo',
        sec2Desc: 'I-rate kami batay sa mga sumusunod na pamantayan.',
        metrics: [
            { id: 'timeliness', label: 'Kabilisan ng Serbisyo', desc: 'Naihatid ba ang serbisyo sa tamang oras?' },
            { id: 'professionalism', label: 'Kagalangan at Propesyonalismo ng Kawani', desc: 'Magalang at propesyonal ba ang aming mga kawani?' },
            { id: 'clarity', label: 'Kalinawan ng Impormasyon', desc: 'Malinaw bang naipaliwanag ang impormasyon?' },
        ],
        evalOptions: [
            { value: 'Excellent', label: 'Napakahusay', color: 'emerald' },
            { value: 'Good', label: 'Mahusay', color: 'blue' },
            { value: 'Average', label: 'Katamtaman', color: 'amber' },
            { value: 'Poor', label: 'Mababa', color: 'red' },
        ],

        sec3Title: 'Karagdagang Opinyon',
        sec3Desc: 'Magbahagi pa tungkol sa iyong pagbisita o pakikipag-ugnayan sa aming tanggapan.',
        visitReasonLabel: 'Pangunahing Dahilan ng Pagbisita / Pakikipag-ugnayan',
        visitReasonPlaceholder: 'Pumili ng dahilan...',
        visitReasons: [
            { value: 'Cooperative Registration', label: 'Rehistrasyon ng Kooperatiba' },
            { value: 'Training / Seminar', label: 'Pagsasanay / Seminar' },
            { value: 'Financial Assistance Inquiry', label: 'Pagtatanong ukol sa Tulong Pinansyal' },
            { value: 'General Information', label: 'Pangkalahatang Impormasyon' },
            { value: 'Other', label: 'Iba pa' },
        ],
        strengthsLabel: 'Ano ang magandang nagawa namin?',
        strengthsPlaceholder: 'Ibahagi ang iyong magagandang karanasan sa amin...',
        improvementsLabel: 'Paano pa namin mapapabuti ang serbisyo?',
        improvementsPlaceholder: 'Magbigay ng mungkahing pagpapabuti...',

        sec4Title: 'Impormasyon sa Pagtawag',
        sec4Desc: 'Ibigay ang iyong detalye kung nais mong makipag-ugnayan kami sa iyo.',
        anonymousLabel: 'Magpasa nang Anonimo (Walang Pangalan)',
        anonymousDesc: 'Hindi itatala ang iyong pagkakakilanlan',
        anonymousInfo: 'Nagmumungkahi ka nang anonimo. Opsyonal lamang ang mga patlang ng impormasyon. Gagamitin lamang ito kung kailangan ng follow-up.',
        fullName: 'Buong Pangalan',
        fullNamePlaceholder: 'hal. Jasper Maurin',
        barangay: 'Barangay',
        barangayPlaceholder: 'Pumili ng Barangay sa Opol...',
        cooperative: 'Kooperatiba / Asosasyon',
        cooperativePlaceholder: 'hal. Opol Farmers Cooperative',
        email: 'Email Address',
        emailPlaceholder: 'hal. juan@email.com',

        submit: 'Ipadala ang Puna',
        submitting: 'Ipinapadala...',
        incompleteWarning: 'Mangyaring kompletuhin ang lahat ng kailangang bahagi bago magpasa.',
        privacyNotice: 'Ang ibinigay na impormasyon ay protektado sa ilalim ng Data Privacy Act ng Pilipinas.',

        thankYou: 'Maraming Salamat!',
        successMsg: 'Matagumpay na naipasa ang iyong puna. Ang iyong tugon ay nakatutulong sa pagpapabuti ng aming mga serbisyo para sa komunidad.',
        returnHome: 'Bumalik sa Home',
        submitAnother: 'Magpasa Ulit',

        // Pagsusuri ng Pagsasanay
        trainingEvalTitle: 'Pagsusuri ng Pagsasanay',
        trainingEvalDesc: 'Dahil dumalo ka sa isang pagsasanay, mangyaring sagutan ang mga karagdagang katanungang ito.',
        likedMostLabel: 'Ano ang pinakagusto mo o na-appreciate mo sa pagsasanay na ito?',
        likedMostPlaceholder: 'Ang iyong puna...',
        dislikedLabel: 'Ano ang hindi mo nagustuhan sa pagsasanay na ito?',
        dislikedPlaceholder: 'Ang iyong puna...',
        helpfulTopicLabel: 'Anong paksa ang pinakamalaking tulong para sa iyo?',
        helpfulTopicPlaceholder: 'Ang iyong puna...',
        unusableTopicLabel: 'Anong mga paksa ang tingin mo ay hindi mo magagamit?',
        unusableTopicPlaceholder: 'Ang iyong puna...',
        futureTrainingLabel: 'Ano pang mga pagsasanay ang nais mong salihan sa hinaharap?',
        futureTrainingPlaceholder: 'Ang iyong puna...',
        trainerRatingLabel: 'Paano mo ire-rate ang tagapagsanay/tagapagsalita?',
        timeSufficientLabel: 'Sapat ba ang oras na inilaan para sa pagsasanay?',
        venueFeedbackLabel: 'Ano ang masasabi mo sa lugar at pasilidad ng pagsasanay?',
        venueFeedbackPlaceholder: 'Ang iyong puna...',
        recommendTrainingLabel: 'Irerekomenda mo ba ang pagsasanay na ito sa iba?',
        yesLabel: 'Oo',
        noLabel: 'Hindi',
        selectOption: 'Pumili ng opsyon...',

        trainingViewsTitle: 'Unsa imong mga pagtan-aw ining mosunod:',
        timePerTopicLabel: 'Gigahin nga oras sa matag topiko/kalihukan',
        trainingDurationLabel: 'Kadugayon sa Pagbansay',
        justRightLabel: 'Insakto Ra',
        needsMoreLabel: 'Kinahanglan dugangan',
        whatToAddLabel: 'Unsa ang angayan dugangan?',
        whatToAddPlaceholder: 'Ibutang ang detalye...',

        trainingRatingTitle: 'Ang kinatibuk-ang grado sa Pagbansay:',
        trainingMetrics: [
            { id: 'expectationsMet', label: 'Naabot ang gilauman' },
            { id: 'objectivesAchieved', label: 'Nakab-ot ang katoyuan sa pagbansay' },
            { id: 'topicsContent', label: 'Mga topiko ug unod niini' },
            { id: 'activitiesConducted', label: 'Mga kalihukan nga gipahigayon' },
            { id: 'teachingMethods', label: 'Mga pamaagi sa pagtudlo' },
            { id: 'teachingMaterials', label: 'Mga kagamiton sa pagtudlo' },
            { id: 'speakersRating', label: 'Mga Mamumulong' },
            { id: 'facilitatorsRating', label: 'Mga nagdumala sa pagbansay' },
            { id: 'facilitiesServices', label: 'Mga kagamiton ug serbisyo sa pagbansay' },
        ],
        trainingEvalOptions: [
            { value: 'Very Good', label: 'Maayo Kaayo', color: 'emerald' },
            { value: 'Good', label: 'Maayo', color: 'blue' },
            { value: 'Fair', label: 'Igo Ra', color: 'amber' },
            { value: 'Poor', label: 'Kulang', color: 'orange' },
            { value: 'Very Poor', label: 'Kulang Kaayo', color: 'red' },
        ]
    }
};

const RATING_COLORS = {
    1: 'text-red-600 bg-red-50 border-red-200',
    2: 'text-orange-600 bg-orange-50 border-orange-200',
    3: 'text-amber-600 bg-amber-50 border-amber-200',
    4: 'text-blue-600 bg-blue-50 border-blue-200',
    5: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const OPTION_STYLES = {
    emerald: { active: 'bg-emerald-600 border-emerald-600 text-white', hover: 'hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700' },
    blue: { active: 'bg-blue-600 border-blue-600 text-white', hover: 'hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700' },
    amber: { active: 'bg-amber-500 border-amber-500 text-white', hover: 'hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700' },
    orange: { active: 'bg-orange-500 border-orange-500 text-white', hover: 'hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700' },
    red: { active: 'bg-red-500 border-red-500 text-white', hover: 'hover:border-red-400 hover:bg-red-50 hover:text-red-700' },
};

function ProgressBar({ data, t }) {
    const completed = [
        data.rating > 0,
        data.timeliness && data.professionalism && data.clarity,
        data.visitReason,
        data.isAnonymous || (data.name && data.barangay && data.cooperative && data.email),
    ];
    const count = completed.filter(Boolean).length;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t.formProgress}</span>
                <span className="text-xs font-bold text-blue-700">{count} / {t.sections.length} {t.completed}</span>
            </div>
            <div className="flex gap-1.5">
                {t.sections.map((s, i) => (
                    <div key={i} className="flex-1">
                        <div className={`h-1.5 rounded-full transition-colors duration-500 ${completed[i] ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        <p className="text-[9px] text-slate-400 mt-1 truncate hidden sm:block">{s}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionCard({ number, title, description, speechId, speakingField, onSpeak, t, children }) {
    const isSpeaking = speakingField === speechId;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: number * 0.07 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {number}
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 leading-tight">{title}</h2>
                        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
                    </div>
                </div>
                {onSpeak && (
                    <button
                        type="button"
                        onClick={() => onSpeak(speechId, `${title}. ${description || ''}`)}
                        title={isSpeaking ? t.stopAudio : t.readAloud}
                        className={`p-2 rounded-xl transition-all border shrink-0 ${isSpeaking ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border-slate-200'}`}
                    >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                )}
            </div>
            <div className="px-6 py-6">{children}</div>
        </motion.div>
    );
}

function SelectField({ icon: Icon, label, value, onChange, disabled, children, placeholder }) {
    return (
        <div>
            {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon className={`w-4 h-4 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
                    </div>
                )}
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-9 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${!value ? 'text-slate-400' : 'text-slate-800'}`}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {children}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}

function TextField({ icon: Icon, label, type = 'text', placeholder, value, onChange, disabled, required }) {
    return (
        <div>
            {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon className={`w-4 h-4 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                />
            </div>
        </div>
    );
}

function TextareaField({ label, placeholder, value, onChange, maxLength = 500 }) {
    return (
        <div>
            {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>}
            <textarea
                rows={4}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
            <p className="text-right text-[10px] text-slate-400 mt-1">{value.length}/{maxLength}</p>
        </div>
    );
}

export default function FeedbackShow({ code, qrDetails }) {
    const [lang, setLang] = useState('en');
    const t = TRANSLATIONS[lang];

    const [speakingField, setSpeakingField] = useState(null);

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speakText = (id, text) => {
        if (!('speechSynthesis' in window)) return;

        if (window.speechSynthesis.speaking && speakingField === id) {
            window.speechSynthesis.cancel();
            setSpeakingField(null);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'fil' ? 'tl-PH' : 'en-US';
        utterance.rate = 0.9;

        utterance.onend = () => setSpeakingField(null);
        utterance.onerror = () => setSpeakingField(null);

        setSpeakingField(id);
        window.speechSynthesis.speak(utterance);
    };

    const { data, setData, post, processing } = useForm({
        rating: 0,
        timeliness: '',
        professionalism: '',
        clarity: '',
        visitReason: '',
        strengths: '',
        improvements: '',
        likedMost: '',
        disliked: '',
        helpfulTopic: '',
        unusableTopic: '',
        futureTraining: '',
        trainerRating: '',
        timeSufficient: '',
        venueFeedback: '',
        recommendTraining: '',
        timePerTopicRating: '',
        timePerTopicComment: '',
        trainingDurationRating: '',
        trainingDurationComment: '',
        expectationsMet: '',
        objectivesAchieved: '',
        topicsContent: '',
        activitiesConducted: '',
        teachingMethods: '',
        teachingMaterials: '',
        speakersRating: '',
        facilitatorsRating: '',
        facilitiesServices: '',
        name: '',
        barangay: '',
        cooperative: '',
        email: '',
        isAnonymous: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/feedback/${code}`, {
            preserveScroll: false,
            onSuccess: () => {
                setSubmitted(true);
            },
        });
    };

    const isFormValid = () => {
        if (data.rating === 0) return false;
        if (!data.timeliness || !data.professionalism || !data.clarity) return false;
        if (!data.visitReason) return false;
        if (!data.isAnonymous) {
            if (!data.name || !data.barangay || !data.cooperative || !data.email) return false;
        }
        return true;
    };

    const displayRating = hoverRating || data.rating;

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Head title="Feedback Submitted" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-8 text-center"
                >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{t.thankYou}</h2>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        {t.successMsg}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> {t.returnHome}
                        </button>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setData({ rating: 0, timeliness: '', professionalism: '', clarity: '', visitReason: '', strengths: '', improvements: '', likedMost: '', disliked: '', helpfulTopic: '', unusableTopic: '', futureTraining: '', trainerRating: '', timeSufficient: '', venueFeedback: '', recommendTraining: '', timePerTopicRating: '', timePerTopicComment: '', trainingDurationRating: '', trainingDurationComment: '', expectationsMet: '', objectivesAchieved: '', topicsContent: '', activitiesConducted: '', teachingMethods: '', teachingMaterials: '', speakersRating: '', facilitatorsRating: '', facilitiesServices: '', name: '', barangay: '', cooperative: '', email: '', isAnonymous: false });
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> {t.submitAnother}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900" style={{ scrollBehavior: 'smooth' }}>
            <Head title={`Service Feedback — ${qrDetails?.name || code}`} />

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
                            <img src={MCDOLogo} alt="MCDO Logo" className="w-9 h-9 object-contain rounded" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-blue-800 leading-none">LGU-OPOL MCDO</p>
                            <p className="text-[10px] text-slate-500 leading-tight truncate">{t.headerOffice}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold">
                            <button
                                type="button"
                                onClick={() => setLang('en')}
                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'en' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setLang('fil')}
                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${lang === 'fil' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Filipino
                            </button>
                        </div>

                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-semibold text-blue-700">
                            <QrCode className="w-2.5 h-2.5" /> {code}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">

                {/* Page Title & Read Aloud Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                            {qrDetails?.name || t.defaultTitle}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {qrDetails?.description || t.defaultDesc}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {qrDetails?.category && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                                    <Briefcase className="w-3 h-3 text-blue-600" /> {qrDetails.category}
                                </span>
                            )}
                            {qrDetails?.venue && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                                    <MapPin className="w-3 h-3 text-blue-600" /> {qrDetails.venue}
                                </span>
                            )}
                            {qrDetails?.date && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                                    <Calendar className="w-3 h-3 text-blue-600" />
                                    {new Date(qrDetails.date).toLocaleDateString(lang === 'fil' ? 'fil-PH' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '')}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => speakText('header', `${qrDetails?.name || t.defaultTitle}. ${qrDetails?.description || t.defaultDesc}`)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border shrink-0 transition-all ${speakingField === 'header' ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-700'}`}
                    >
                        {speakingField === 'header' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                        <span className="hidden sm:inline">{speakingField === 'header' ? t.stopAudio : t.readAloud}</span>
                    </button>
                </div>

                {/* Progress */}
                <ProgressBar data={data} t={t} />

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* 1. Overall Satisfaction */}
                    <SectionCard
                        number="1" title={t.sec1Title} description={t.sec1Desc}
                        speechId="sec1" speakingField={speakingField} onSpeak={speakText} t={t}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 sm:gap-3" role="group" aria-label="Overall satisfaction rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        aria-label={`${star} star — ${t.ratingLabels[star]}`}
                                        onClick={() => setData('rating', star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full transition-transform hover:scale-110 active:scale-95 p-1"
                                    >
                                        <Star
                                            className={`w-10 h-10 sm:w-11 sm:h-11 transition-all duration-200 ${displayRating >= star
                                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                                : 'fill-transparent text-slate-200'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence mode="wait">
                                {displayRating > 0 && (
                                    <motion.span
                                        key={displayRating}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.15 }}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${RATING_COLORS[displayRating]}`}
                                    >
                                        {displayRating} — {t.ratingLabels[displayRating]}
                                    </motion.span>
                                )}
                                {displayRating === 0 && (
                                    <motion.span
                                        key="none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-slate-400"
                                    >
                                        {t.tapStar}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </SectionCard>

                    {/* 2. Service Evaluation */}
                    <SectionCard
                        number="2" title={t.sec2Title} description={t.sec2Desc}
                        speechId="sec2" speakingField={speakingField} onSpeak={speakText} t={t}
                    >
                        <div className="space-y-5">
                            {t.metrics.map((metric) => (
                                <div key={metric.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{metric.label}</p>
                                            <p className="text-xs text-slate-400">{metric.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => speakText(`metric_${metric.id}`, `${metric.label}. ${metric.desc}`)}
                                            className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                                            title={t.readAloud}
                                        >
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2" role="group" aria-label={metric.label}>
                                        {t.evalOptions.map((opt) => {
                                            const isActive = data[metric.id] === opt.value;
                                            const styles = OPTION_STYLES[opt.color];
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    aria-pressed={isActive}
                                                    onClick={() => setData(metric.id, opt.value)}
                                                    className={`py-2.5 px-1 rounded-xl border-2 text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isActive ? styles.active + ' shadow-sm' : 'bg-white border-slate-200 text-slate-600 ' + styles.hover}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* 3. Additional Insights */}
                    <SectionCard
                        number="3" title={t.sec3Title} description={t.sec3Desc}
                        speechId="sec3" speakingField={speakingField} onSpeak={speakText} t={t}
                    >
                        <div className="space-y-5">
                            <SelectField
                                label={t.visitReasonLabel}
                                value={data.visitReason}
                                onChange={(e) => setData('visitReason', e.target.value)}
                                placeholder={t.visitReasonPlaceholder}
                            >
                                {t.visitReasons.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </SelectField>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextareaField
                                    label={t.strengthsLabel}
                                    placeholder={t.strengthsPlaceholder}
                                    value={data.strengths}
                                    onChange={(e) => setData('strengths', e.target.value)}
                                />
                                <TextareaField
                                    label={t.improvementsLabel}
                                    placeholder={t.improvementsPlaceholder}
                                    value={data.improvements}
                                    onChange={(e) => setData('improvements', e.target.value)}
                                />
                            </div>

                            <AnimatePresence>
                                {data.visitReason === 'Training / Seminar' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 mt-6 border-t border-slate-100 space-y-5">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800">{t.trainingEvalTitle}</h3>
                                                    <p className="text-xs text-slate-500">{t.trainingEvalDesc}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <TextareaField
                                                    label={t.likedMostLabel}
                                                    placeholder={t.likedMostPlaceholder}
                                                    value={data.likedMost}
                                                    onChange={(e) => setData('likedMost', e.target.value)}
                                                />
                                                <TextareaField
                                                    label={t.dislikedLabel}
                                                    placeholder={t.dislikedPlaceholder}
                                                    value={data.disliked}
                                                    onChange={(e) => setData('disliked', e.target.value)}
                                                />
                                                <TextareaField
                                                    label={t.helpfulTopicLabel}
                                                    placeholder={t.helpfulTopicPlaceholder}
                                                    value={data.helpfulTopic}
                                                    onChange={(e) => setData('helpfulTopic', e.target.value)}
                                                />
                                                <TextareaField
                                                    label={t.unusableTopicLabel}
                                                    placeholder={t.unusableTopicPlaceholder}
                                                    value={data.unusableTopic}
                                                    onChange={(e) => setData('unusableTopic', e.target.value)}
                                                />
                                                <TextareaField
                                                    label={t.futureTrainingLabel}
                                                    placeholder={t.futureTrainingPlaceholder}
                                                    value={data.futureTraining}
                                                    onChange={(e) => setData('futureTraining', e.target.value)}
                                                />
                                                <TextareaField
                                                    label={t.venueFeedbackLabel}
                                                    placeholder={t.venueFeedbackPlaceholder}
                                                    value={data.venueFeedback}
                                                    onChange={(e) => setData('venueFeedback', e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <SelectField
                                                    label={t.trainerRatingLabel}
                                                    value={data.trainerRating}
                                                    onChange={(e) => setData('trainerRating', e.target.value)}
                                                    placeholder={t.selectOption}
                                                >
                                                    <option value="Excellent">Excellent / Napakahusay</option>
                                                    <option value="Good">Good / Mahusay</option>
                                                    <option value="Average">Average / Katamtaman</option>
                                                    <option value="Poor">Poor / Mababa</option>
                                                </SelectField>
                                                
                                                <SelectField
                                                    label={t.timeSufficientLabel}
                                                    value={data.timeSufficient}
                                                    onChange={(e) => setData('timeSufficient', e.target.value)}
                                                    placeholder={t.selectOption}
                                                >
                                                    <option value="Yes">{t.yesLabel}</option>
                                                    <option value="No">{t.noLabel}</option>
                                                </SelectField>
                                                
                                                <SelectField
                                                    label={t.recommendTrainingLabel}
                                                    value={data.recommendTraining}
                                                    onChange={(e) => setData('recommendTraining', e.target.value)}
                                                    placeholder={t.selectOption}
                                                >
                                                    <option value="Yes">{t.yesLabel}</option>
                                                    <option value="No">{t.noLabel}</option>
                                                </SelectField>
                                            </div>

                                            <div className="pt-6 mt-6 border-t border-slate-100 space-y-6">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800">{t.trainingViewsTitle}</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {/* Row 1: Time per topic */}
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                        <p className="text-sm font-semibold text-slate-800 mb-3">{t.timePerTopicLabel}</p>
                                                        <div className="flex flex-wrap gap-3 mb-3">
                                                            {['Just Right', 'Needs More'].map(val => (
                                                                <button
                                                                    key={val} type="button"
                                                                    onClick={() => setData('timePerTopicRating', val)}
                                                                    className={`px-4 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${data.timePerTopicRating === val ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}
                                                                >
                                                                    {val === 'Just Right' ? t.justRightLabel : t.needsMoreLabel}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {data.timePerTopicRating === 'Needs More' && (
                                                            <TextField
                                                                label={t.whatToAddLabel}
                                                                placeholder={t.whatToAddPlaceholder}
                                                                value={data.timePerTopicComment}
                                                                onChange={(e) => setData('timePerTopicComment', e.target.value)}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Row 2: Training Duration */}
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                        <p className="text-sm font-semibold text-slate-800 mb-3">{t.trainingDurationLabel}</p>
                                                        <div className="flex flex-wrap gap-3 mb-3">
                                                            {['Just Right', 'Needs More'].map(val => (
                                                                <button
                                                                    key={val} type="button"
                                                                    onClick={() => setData('trainingDurationRating', val)}
                                                                    className={`px-4 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${data.trainingDurationRating === val ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}
                                                                >
                                                                    {val === 'Just Right' ? t.justRightLabel : t.needsMoreLabel}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {data.trainingDurationRating === 'Needs More' && (
                                                            <TextField
                                                                label={t.whatToAddLabel}
                                                                placeholder={t.whatToAddPlaceholder}
                                                                value={data.trainingDurationComment}
                                                                onChange={(e) => setData('trainingDurationComment', e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 mt-6 border-t border-slate-100 space-y-5">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800">{t.trainingRatingTitle}</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {t.trainingMetrics.map((metric) => (
                                                        <div key={metric.id} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-semibold text-slate-800">{metric.label}</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => speakText(`metric_${metric.id}`, metric.label)}
                                                                    className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                                                                >
                                                                    <Volume2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                                                                {t.trainingEvalOptions.map((opt) => {
                                                                    const isActive = data[metric.id] === opt.value;
                                                                    const styles = OPTION_STYLES[opt.color];
                                                                    return (
                                                                        <button
                                                                            key={opt.value}
                                                                            type="button"
                                                                            onClick={() => setData(metric.id, opt.value)}
                                                                            className={`py-2 px-1 rounded-xl border-2 text-[10px] sm:text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 break-words leading-tight flex items-center justify-center text-center h-full min-h-[44px] ${isActive ? styles.active + ' shadow-sm' : 'bg-white border-slate-200 text-slate-600 ' + styles.hover}`}
                                                                        >
                                                                            {opt.label}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </SectionCard>

                    {/* 4. Contact Information */}
                    <SectionCard
                        number="4" title={t.sec4Title} description={t.sec4Desc}
                        speechId="sec4" speakingField={speakingField} onSpeak={speakText} t={t}
                    >
                        {/* Anonymous toggle */}
                        <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer mb-5 transition-all ${data.isAnonymous ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                            onClick={() => {
                                const next = !data.isAnonymous;
                                setData(d => ({ ...d, isAnonymous: next, ...(next ? { name: '', barangay: '', cooperative: '', email: '' } : {}) }));
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Shield className={`w-4 h-4 ${data.isAnonymous ? 'text-blue-600' : 'text-slate-400'}`} />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{t.anonymousLabel}</p>
                                    <p className="text-xs text-slate-500">{t.anonymousDesc}</p>
                                </div>
                            </div>
                            <div className="relative shrink-0">
                                <input
                                    type="checkbox"
                                    checked={data.isAnonymous}
                                    onChange={() => { }}
                                    className="peer sr-only"
                                    aria-label={t.anonymousLabel}
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${data.isAnonymous ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${data.isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {data.isAnonymous && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mb-5"
                                >
                                    <div className="flex gap-2.5 bg-blue-50 border border-blue-100 p-3.5 rounded-xl">
                                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            {t.anonymousInfo}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            animate={{ opacity: data.isAnonymous ? 0.45 : 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <TextField
                                icon={User} label={t.fullName} placeholder={t.fullNamePlaceholder}
                                value={data.name} onChange={(e) => setData('name', e.target.value)}
                                disabled={data.isAnonymous} required={!data.isAnonymous}
                            />
                            <SelectField
                                icon={MapPin} label={t.barangay}
                                value={data.barangay} onChange={(e) => setData('barangay', e.target.value)}
                                disabled={data.isAnonymous} placeholder={t.barangayPlaceholder}
                            >
                                {['Awang', 'Bagocboc', 'Barra', 'Bonbon', 'Cauyonan', 'Igpit', 'Limonda', 'Luyongbonbon', 'Malanang', 'Nangcaon', 'Patag', 'Poblacion', 'Taboc', 'Tingalan'].map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </SelectField>
                            <TextField
                                icon={Users} label={t.cooperative} placeholder={t.cooperativePlaceholder}
                                value={data.cooperative} onChange={(e) => setData('cooperative', e.target.value)}
                                disabled={data.isAnonymous} required={!data.isAnonymous}
                            />
                            <TextField
                                icon={Mail} label={t.email} type="email" placeholder={t.emailPlaceholder}
                                value={data.email} onChange={(e) => setData('email', e.target.value)}
                                disabled={data.isAnonymous} required={!data.isAnonymous}
                            />
                        </motion.div>
                    </SectionCard>

                    {/* Submit */}
                    <div className="pt-2 pb-8">
                        <button
                            type="submit"
                            disabled={processing || !isFormValid()}
                            className="w-full flex items-center justify-center gap-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-700/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            {processing ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> {t.submitting}</>
                            ) : (
                                t.submit
                            )}
                        </button>
                        {!isFormValid() && (
                            <p className="text-center text-xs text-slate-400 mt-2">{t.incompleteWarning}</p>
                        )}
                    </div>
                </form>

                <div className="text-center pb-10 -mt-4">
                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        {t.privacyNotice}
                    </p>
                </div>
            </main>
        </div>
    );
}
     