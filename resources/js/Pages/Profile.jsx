import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, ShieldCheck, Lock, Eye, EyeOff, User, Shield, CheckCircle2, AlertCircle, RefreshCw, Save } from 'lucide-react';
import DashboardLayout from '../Components/Dashboard/layout/DashboardLayout';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../Components/Dashboard/ui/Toast';
import LogoutSuccess from '../Components/Dashboard/ui/LogoutSuccess';

function getPasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
        case 1: return { score: 25, label: 'Weak', color: 'bg-red-500' };
        case 2: return { score: 50, label: 'Fair', color: 'bg-amber-500' };
        case 3: return { score: 75, label: 'Good', color: 'bg-blue-500' };
        case 4: return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
        default: return { score: 10, label: 'Very Weak', color: 'bg-red-500' };
    }
}

export default function Profile() {
    const { isDark, toggleTheme, mounted } = useTheme();
    const { addToast } = useToast();
    const { auth } = usePage().props;

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

    const [activeTab, setActiveTab] = useState('password');
    const [step, setStep] = useState('edit');

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const timerRef = useRef(null);

    const currentUser = auth?.user || JSON.parse(localStorage.getItem('auth_user') || 'null') || {};
    const currentName = currentUser.name || 'Administrator';
    const currentEmail = currentUser.email || 'admin@opol.gov.ph';
    const initials = currentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

    const pwdStrength = getPasswordStrength(password);

    useEffect(() => {
        if (step === 'verify' && resendTimer > 0) {
            timerRef.current = setInterval(() => {
                setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [step, resendTimer]);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setShowLogoutSuccess(true);
        }
    };

    const handleSendCode = async (e) => {
        e?.preventDefault();

        if (activeTab === 'password') {
            if (password.length < 8) {
                addToast('New password must be at least 8 characters long', 'error');
                return;
            }
            if (password !== confirmPassword) {
                addToast('New passwords do not match', 'error');
                return;
            }
            if (password === currentPassword) {
                addToast('New password must be different from current password', 'error');
                return;
            }
        }

        setIsLoading(true);
        try {
            const payload = activeTab === 'email'
                ? { type: 'email', email }
                : { type: 'password', current_password: currentPassword, password, password_confirmation: confirmPassword };

            const response = await axios.post('/profile/send-code', payload);

            addToast(response.data.message, 'success');
            if (response.data.debug_code) {
                addToast(`Verification code: ${response.data.debug_code}`, 'info');
            }
            setStep('verify');
            setResendTimer(60);
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to send verification code', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = authCode.join('');

        if (code.length !== 6) {
            addToast('Please enter the full 6-digit code', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/profile/verify', { code });
            addToast(response.data.message, 'success');
            if (response.data.user) {
                localStorage.setItem('auth_user', JSON.stringify(response.data.user));
            }
            setStep('edit');
            setAuthCode(['', '', '', '', '', '']);
            setCurrentPassword('');
            setPassword('');
            setConfirmPassword('');
            setEmail('');
        } catch (error) {
            addToast(error.response?.data?.message || 'Verification failed. Please check your code.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        const clean = value.replace(/\D/g, '');
        if (!clean && value !== '') return;

        const newCode = [...authCode];
        newCode[index] = clean.slice(-1);
        setAuthCode(newCode);

        if (clean && index < 5) {
            const nextInput = document.getElementById(`page-code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !authCode[index] && index > 0) {
            const prevInput = document.getElementById(`page-code-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
        if (pasted) {
            const newCode = [...authCode];
            for (let i = 0; i < 6; i++) {
                newCode[i] = pasted[i] || '';
            }
            setAuthCode(newCode);
            const lastIndex = Math.min(pasted.length - 1, 5);
            const lastInput = document.getElementById(`page-code-${lastIndex}`);
            if (lastInput) lastInput.focus();
        }
    };

    return (
        <>
            <DashboardLayout
                isDark={isDark}
                onToggleTheme={toggleTheme}
                mounted={mounted}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed(val => !val)}
                mobileOpen={mobileOpen}
                onMobileOpen={() => setMobileOpen(true)}
                onMobileClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
            >
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Header Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-slate-900 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
                        <div className="absolute -right-12 -top-12 h-60 w-60 rounded-full bg-red-600/20 blur-3xl" />
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white/10">
                                    {initials}
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                        System Administrator
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 font-outfit">{currentName}</h1>
                                    <p className="text-sm text-slate-300 mt-0.5">{currentEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-200">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>2FA Security Verification Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar Status Card */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    Account Details
                                </h3>
                                <dl className="space-y-4 text-xs">
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400">Full Name</dt>
                                        <dd className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{currentName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400">Primary Email</dt>
                                        <dd className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 truncate">{currentEmail}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400">Role & Access</dt>
                                        <dd className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">Administrator</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400">Office</dt>
                                        <dd className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">MCDO Opol Municipal Hall</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                                <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-red-500" />
                                    Password Guidelines
                                </h4>
                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Minimum 8 characters</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Mix of uppercase & numbers</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Verification code sent to email</li>
                                </ul>
                            </div>
                        </div>

                        {/* Settings Form Card */}
                        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            {/* Tabs */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('password'); setStep('edit'); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                                        activeTab === 'password'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <KeyRound className="w-4 h-4" />
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('email'); setStep('edit'); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                                        activeTab === 'email'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <Mail className="w-4 h-4" />
                                    Change Email
                                </button>
                            </div>

                            {step === 'edit' ? (
                                <form onSubmit={handleSendCode} className="space-y-5">
                                    {activeTab === 'password' ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                        <Lock className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                        placeholder="Enter current password"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                    >
                                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                        <Lock className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                        placeholder="Min. 8 characters"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                {password.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex justify-between items-center text-[11px]">
                                                            <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                                                            <span className="font-semibold text-slate-700 dark:text-slate-200">{pwdStrength.label}</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${pwdStrength.color} transition-all duration-300`}
                                                                style={{ width: `${pwdStrength.score}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                        <Lock className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                        placeholder="Re-enter new password"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                                    Current Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={currentEmail}
                                                    readOnly
                                                    className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                                    New Email Address
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                        <Mail className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                        placeholder="Enter new email address"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200 disabled:opacity-60"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        {isLoading ? 'Requesting Security Verification Code...' : 'Send Verification Code'}
                                    </button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <div className="w-14 h-14 bg-blue-500/15 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-blue-500/10">
                                            <ShieldCheck className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security Code Verification</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            Please enter the 6-digit code sent to<br />
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">{currentEmail}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerify} className="space-y-5">
                                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                                            {authCode.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`page-code-${index}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                                            <span>Didn't receive the code?</span>
                                            {resendTimer > 0 ? (
                                                <span className="font-medium text-slate-600 dark:text-slate-300">Resend in {resendTimer}s</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendCode}
                                                    disabled={isLoading}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setStep('edit')}
                                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-all duration-200"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading || authCode.join('').length !== 6}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200 disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4" />
                                                {isLoading ? 'Verifying...' : 'Confirm Change'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {showLogoutSuccess && (
                <LogoutSuccess onComplete={() => { window.location.href = '/login'; }} />
            )}
        </>
    );
}
