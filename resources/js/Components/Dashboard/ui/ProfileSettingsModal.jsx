import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Save, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useToast } from './Toast';
import { usePage } from '@inertiajs/react';

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

export default function ProfileSettingsModal({ isOpen, onClose }) {
    const { addToast } = useToast();
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('password'); // Default to password change
    const [step, setStep] = useState('edit'); // 'edit' or 'verify'
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const timerRef = useRef(null);

    const currentEmail = auth?.user?.email || JSON.parse(localStorage.getItem('auth_user') || 'null')?.email || 'admin@opol.gov.ph';
    const currentName = auth?.user?.name || JSON.parse(localStorage.getItem('auth_user') || 'null')?.name || 'Administrator';
    const initials = currentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

    const pwdStrength = getPasswordStrength(password);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

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

    const handleReset = () => {
        setStep('edit');
        setAuthCode(['', '', '', '', '', '']);
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setShowCurrentPassword(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
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
                addToast(`Local verification code: ${response.data.debug_code}`, 'info');
            }
            setStep('verify');
            setResendTimer(60);
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to send security verification code', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = authCode.join('');

        if (code.length !== 6) {
            addToast('Please enter the complete 6-digit code', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/profile/verify', { code });
            addToast(response.data.message, 'success');
            if (response.data.user) {
                localStorage.setItem('auth_user', JSON.stringify(response.data.user));
            }
            handleClose();
        } catch (error) {
            addToast(error.response?.data?.message || 'Verification failed. Please check the code.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeTrustedDevices = async () => {
        if (!confirm('Are you sure you want to log out of all trusted devices? Email verification will be required on your next login.')) return;
        setIsLoading(true);
        try {
            const response = await axios.post('/profile/revoke-trusted-devices');
            addToast(response.data.message, 'success');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to revoke trusted devices.', 'error');
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
            const nextInput = document.getElementById(`modal-code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !authCode[index] && index > 0) {
            const prevInput = document.getElementById(`modal-code-${index - 1}`);
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
            const lastInput = document.getElementById(`modal-code-${lastIndex}`);
            if (lastInput) lastInput.focus();
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] isolate">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
                        onClick={handleClose}
                    />

                    {/* Centered Modal */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                            className="w-full max-w-md bg-slate-900 border border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto text-slate-100"
                        >
                            {/* Header */}
                            <div className="relative p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white text-base font-bold shadow-md ring-2 ring-white/10">
                                        {initials}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white font-outfit leading-tight">Security & Profile Settings</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">{currentName} ({currentEmail})</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {step === 'edit' ? (
                                    <div className="space-y-5">
                                        {/* Tabs */}
                                        <div className="flex p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('password')}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeTab === 'password'
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:text-slate-200'
                                                    }`}
                                            >
                                                <KeyRound className="w-3.5 h-3.5" />
                                                Change Password
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('email')}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeTab === 'email'
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:text-slate-200'
                                                    }`}
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                                Change Email
                                            </button>
                                        </div>

                                        <form onSubmit={handleSendCode} className="space-y-4">
                                            {activeTab === 'password' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Current Password</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                                <Lock className="h-4 w-4" />
                                                            </div>
                                                            <input
                                                                type={showCurrentPassword ? 'text' : 'password'}
                                                                value={currentPassword}
                                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                                className="block w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                                placeholder="Enter current password"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                                            >
                                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">New Password</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                                <Lock className="h-4 w-4" />
                                                            </div>
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                className="block w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                                placeholder="Min. 8 characters"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                                            >
                                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>

                                                        {/* Password Strength Indicator */}
                                                        {password.length > 0 && (
                                                            <div className="mt-2 space-y-1">
                                                                <div className="flex justify-between items-center text-[11px]">
                                                                    <span className="text-slate-400">Password Strength:</span>
                                                                    <span className="font-semibold text-slate-200">{pwdStrength.label}</span>
                                                                </div>
                                                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full ${pwdStrength.color} transition-all duration-300`}
                                                                        style={{ width: `${pwdStrength.score}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Confirm New Password</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                                <Lock className="h-4 w-4" />
                                                            </div>
                                                            <input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                className="block w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                                placeholder="Re-enter new password"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Current Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={currentEmail}
                                                            readOnly
                                                            className="block w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">New Email Address</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                                <Mail className="h-4 w-4" />
                                                            </div>
                                                            <input
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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
                                                className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200 disabled:opacity-60"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                {isLoading ? 'Sending Security Code...' : 'Send Verification Code'}
                                            </button>
                                        </form>

                                        {/* Device Management Section */}
                                        <div className="pt-4 border-t border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Trusted Device Sessions</h4>
                                                    <p className="text-[11px] text-slate-400">Devices marked trusted for 14 days without requiring OTP.</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRevokeTrustedDevices}
                                                disabled={isLoading}
                                                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                Log out of all trusted devices
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-blue-500/15 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-blue-500/10">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                We sent a 6-digit authentication code to<br />
                                                <span className="text-white font-semibold">{currentEmail}</span>
                                            </p>
                                        </div>

                                        <form onSubmit={handleVerify} className="space-y-5">
                                            <div className="flex justify-between gap-2" onPaste={handlePaste}>
                                                {authCode.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        id={`modal-code-${index}`}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                                        className="w-11 h-13 text-center text-xl font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                                                <span>Didn't receive the code?</span>
                                                {resendTimer > 0 ? (
                                                    <span className="text-slate-400 font-medium">Resend in {resendTimer}s</span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleSendCode}
                                                        disabled={isLoading}
                                                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                                                    >
                                                        <RefreshCw className="w-3 h-3" /> Resend Code
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep('edit')}
                                                    className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all duration-200"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading || authCode.join('').length !== 6}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {isLoading ? 'Verifying...' : 'Confirm Change'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
