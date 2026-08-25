import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import {
    ArrowLeftIcon, BuildingOffice2Icon, CheckCircleIcon, EyeIcon, EyeSlashIcon,
    LockClosedIcon, MapPinIcon, PhoneIcon, ShieldCheckIcon, UserGroupIcon,
    UserIcon, EnvelopeIcon, KeyIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import mcdoLogo from '../../Images/mcdologs.jpg';
import coopBg from '../../Images/Coop.jpg';

const initialRegistration = { name: '', email: '', contact: '', municipality: 'Opol', barangay: '', organization: '', userType: 'Farmer', password: '', confirmation: '', terms: false };

function Field({ icon: Icon, label, error, children }) {
    return (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="sr-only">{label}</span>
            <div className="group relative">
                <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 transition group-focus-within:text-blue-600" />
                {children}
            </div>
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </label>
    );
}

const input = 'w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-[#111827] dark:focus:ring-blue-500/15';

export default function Login() {
    const [mode, setMode] = useState('login');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState('');
    const [verifiedBanner, setVerifiedBanner] = useState('');
    const [login, setLogin] = useState({ email: '', password: '', remember: false });
    const [register, setRegister] = useState(initialRegistration);

    // Security Token / Trusted Device state
    const [tokenStep, setTokenStep] = useState(false);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [securityCode, setSecurityCode] = useState('');
    const [expireSeconds, setExpireSeconds] = useState(600); // 10 minutes default
    const [resendCooldown, setResendCooldown] = useState(0);

    const timerRef = useRef(null);
    const cooldownRef = useRef(null);

    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    // Countdown Timer for Code Expiration
    useEffect(() => {
        if (tokenStep && expireSeconds > 0) {
            timerRef.current = setInterval(() => {
                setExpireSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [tokenStep, expireSeconds]);

    // Resend Cooldown Timer
    useEffect(() => {
        if (resendCooldown > 0) {
            cooldownRef.current = setInterval(() => {
                setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            clearInterval(cooldownRef.current);
        }
        return () => clearInterval(cooldownRef.current);
    }, [resendCooldown]);

    const updateLogin = (e) => setLogin(v => ({ ...v, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    const updateRegister = (e) => setRegister(v => ({ ...v, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotice('');
        setVerifiedBanner('');
        try {
            const r = await axios.post('/login', { email: login.email, password: login.password, remember_me: login.remember });
            
            // Trusted device direct login (bypass 2FA)
            if (r.data.device_trusted && r.data.success) {
                localStorage.setItem('auth_token', r.data.token);
                localStorage.setItem('auth_user', JSON.stringify(r.data.user));
                setNotice('Device recognized. Signing in...');
                setTimeout(() => {
                    window.location.href = r.data.redirect;
                }, 400);
                return;
            }

            if (r.data.requires_security_token) {
                setTokenInfo({ user_id: r.data.user_id, email: r.data.email });
                setTokenStep(true);
                setSecurityCode('');
                setExpireSeconds(r.data.expires_in_seconds || 600);
                setResendCooldown(60);
                setNotice(r.data.message || 'We\'ve sent a verification code to your registered email address.');
                return;
            }

            if (r.data.success) {
                localStorage.setItem('auth_token', r.data.token);
                localStorage.setItem('auth_user', JSON.stringify(r.data.user));
                window.location.href = r.data.redirect;
                return;
            }
            setNotice(r.data.message || 'Unable to sign in.');
        } catch (err) {
            setNotice(err.response?.data?.message || 'Login failed. Check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    const tokenSubmit = async (e) => {
        e.preventDefault();
        if (securityCode.length !== 6) {
            setNotice('Please enter a complete 6-digit security code.');
            return;
        }

        setLoading(true);
        setNotice('');
        setVerifiedBanner('');
        try {
            const r = await axios.post('/login/verify-token', {
                user_id: tokenInfo.user_id,
                code: securityCode,
            });
            if (r.data.success) {
                localStorage.setItem('auth_token', r.data.token);
                localStorage.setItem('auth_user', JSON.stringify(r.data.user));
                setVerifiedBanner('Device Verified — You won\'t need to verify this device again for 14 days.');
                setTimeout(() => {
                    window.location.href = r.data.redirect;
                }, 1200);
                return;
            }
            setNotice(r.data.message || 'Invalid security code.');
        } catch (err) {
            setNotice(err.response?.data?.message || 'Invalid or expired 6-digit security code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0 || !tokenInfo?.user_id) return;
        setLoading(true);
        setNotice('');
        try {
            const r = await axios.post('/login/resend-token', { user_id: tokenInfo.user_id });
            if (r.data.success) {
                setExpireSeconds(600);
                setResendCooldown(60);
                if (r.data.debug_code) setSecurityCode(r.data.debug_code);
                setNotice('A new verification code has been sent to your email.');
            }
        } catch (err) {
            setNotice(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const registerSubmit = (e) => {
        e.preventDefault();
        if (register.password.length < 8) return setNotice('Use at least 8 characters for your password.');
        if (register.password !== register.confirmation) return setNotice('Passwords do not match.');
        if (!register.terms) return setNotice('Please accept the Terms and Privacy Policy.');
        setNotice('Account request validated. Connect this form to the Laravel registration endpoint to create the account.');
    };

    const strength = register.password.length >= 12 ? 'Strong' : register.password.length >= 8 ? 'Good' : 'Use 8+ characters';

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
                <section className="relative hidden overflow-hidden bg-cover bg-center p-10 text-white lg:flex lg:flex-col" style={{ backgroundImage: `url(${coopBg})` }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-800/80 to-red-900/75" />
                    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                    <motion.div animate={{ y: [0, -18, 0], x: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-red-500/30 blur-3xl" />
                    <motion.div animate={{ y: [0, 24, 0], x: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 10 }} className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
                    <header className="relative flex items-center gap-3">
                        <span className="rounded-2xl bg-white/15 p-2.5 ring-1 ring-white/25">
                            <img src={mcdoLogo} className="h-10 w-10 object-contain" alt="MCDO Opol logo" />
                        </span>
                        <div>
                            <p className="font-bold tracking-tight">MCDO OPOL</p>
                            <p className="text-xs text-blue-100">Municipal Cooperative Development Office</p>
                        </div>
                    </header>
                    <div className="relative my-auto max-w-xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />Digital public service
                        </span>
                        <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight">Municipal Cooperative Development Office</h1>
                        <p className="mt-5 max-w-lg text-lg leading-relaxed text-blue-100">Feedback Management System for Farmers, Cooperative Members, and Associations.</p>
                        <div className="mt-10 grid grid-cols-3 gap-3">
                            {[[UserGroupIcon, 'Community'], [BuildingOffice2Icon, 'Cooperatives'], [ShieldCheckIcon, 'Public service']].map(([Icon, label]) => (
                                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                                    <Icon className="h-6 w-6 text-red-200" />
                                    <p className="mt-3 text-sm font-semibold">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <footer className="relative text-xs text-blue-200">© {new Date().getFullYear()} Municipality of Opol · Misamis Oriental</footer>
                </section>

                <section className="relative flex items-center justify-center overflow-y-auto p-5 sm:p-8">
                    <div className="w-full max-w-xl">
                        <div className="mb-7 flex items-center gap-3 lg:hidden">
                            <img src={mcdoLogo} className="h-11 w-11 rounded-xl object-contain ring-1 ring-slate-200" alt="MCDO Opol logo" />
                            <div>
                                <p className="font-bold">MCDO OPOL</p>
                                <p className="text-xs text-slate-500">Feedback Management System</p>
                            </div>
                        </div>
                        <a href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                            <ArrowLeftIcon className="h-4 w-4" /> Back to Home
                        </a>
                        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl sm:p-8">
                            <div className="flex rounded-xl bg-slate-100 p-1">
                                <button onClick={() => { setMode('login'); setNotice(''); setTokenStep(false); setVerifiedBanner(''); }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}>Sign in</button>
                                <button onClick={() => { setMode('register'); setNotice(''); setTokenStep(false); setVerifiedBanner(''); }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}>Create account</button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div key={mode + (tokenStep ? '-token' : '-form')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="pt-7">
                                    {mode === 'login' ? (
                                        tokenStep ? (
                                            /* Trusted Device / Email Verification Screen */
                                            <form onSubmit={tokenSubmit} className="space-y-5">
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        <ShieldCheckIcon className="h-4 w-4" /> Security Verification
                                                    </span>
                                                    <h2 className="mt-3 text-2xl font-bold text-slate-900">Verify Your Device</h2>
                                                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                                                        We've sent a verification code to your registered email address (<span className="font-semibold text-slate-900">{tokenInfo?.email}</span>).
                                                    </p>
                                                </div>

                                                <Field icon={KeyIcon} label="Verification Code">
                                                    <input
                                                        required
                                                        type="text"
                                                        inputMode="numeric"
                                                        autoComplete="one-time-code"
                                                        maxLength={6}
                                                        value={securityCode}
                                                        onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="_ _ _ _ _ _"
                                                        className={`${input} tracking-[0.3em] font-mono text-xl font-bold text-center pl-4 text-slate-900`}
                                                    />
                                                </Field>

                                                {/* Countdown Timer & Expiration */}
                                                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                                    {expireSeconds > 0 ? (
                                                        <span className="font-medium flex items-center gap-1 text-blue-700">
                                                            ⏱️ Code expires in: <strong className="font-mono font-bold">{formatTime(expireSeconds)}</strong>
                                                        </span>
                                                    ) : (
                                                        <span className="font-bold text-red-600 flex items-center gap-1">
                                                            ⚠️ Code expired. Please resend code.
                                                        </span>
                                                    )}

                                                    {resendCooldown > 0 ? (
                                                        <span className="text-slate-400">Resend in {resendCooldown}s</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={handleResendCode}
                                                            disabled={loading}
                                                            className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors"
                                                        >
                                                            <ArrowPathIcon className="h-3.5 w-3.5" /> Resend Code
                                                        </button>
                                                    )}
                                                </div>



                                                <AuthButton loading={loading} disabled={expireSeconds === 0} label="Verify & Remember Device (14 Days)" />

                                                <button
                                                    type="button"
                                                    onClick={() => { setTokenStep(false); setNotice(''); setVerifiedBanner(''); }}
                                                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1"
                                                >
                                                    ← Cancel / Back to Login
                                                </button>
                                            </form>
                                        ) : (
                                            /* Standard Email & Password Screen */
                                            <form onSubmit={loginSubmit} className="space-y-5">
                                                <div>
                                                    <h2 className="text-2xl font-bold">Welcome back</h2>
                                                    <p className="mt-1 text-sm text-slate-500">Sign in to manage MCDO feedback and services.</p>
                                                </div>
                                                <Field icon={EnvelopeIcon} label="Email Address">
                                                    <input required name="email" type="email" value={login.email} onChange={updateLogin} placeholder="Email address" className={input} />
                                                </Field>
                                                <Field icon={LockClosedIcon} label="Password">
                                                    <input required name="password" type={show ? 'text' : 'password'} value={login.password} onChange={updateLogin} placeholder="Password" className={`${input} pr-12`} />
                                                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-slate-400" aria-label={show ? 'Hide password' : 'Show password'}>
                                                        {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                                    </button>
                                                </Field>
                                                <div className="flex items-center justify-between text-sm">
                                                    <label className="flex items-center gap-2 text-slate-600">
                                                        <input name="remember" type="checkbox" checked={login.remember} onChange={updateLogin} className="rounded border-slate-300 text-blue-600" />Remember me
                                                    </label>
                                                    <button type="button" onClick={() => setNotice('Please contact the MCDO administrator to reset your password.')} className="font-semibold text-blue-700">Forgot password?</button>
                                                </div>
                                                <AuthButton loading={loading} label="Sign in to your account" />
                                            </form>
                                        )
                                    ) : (
                                        <form onSubmit={registerSubmit} className="space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-bold">Create your account</h2>
                                                <p className="mt-1 text-sm text-slate-500">Register to submit and track MCDO feedback.</p>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <Field icon={UserIcon} label="Full Name">
                                                    <input required name="name" value={register.name} onChange={updateRegister} placeholder="Full name" className={input} />
                                                </Field>
                                                <Field icon={EnvelopeIcon} label="Email Address">
                                                    <input required name="email" type="email" value={register.email} onChange={updateRegister} placeholder="Email address" className={input} />
                                                </Field>
                                                <Field icon={PhoneIcon} label="Contact Number">
                                                    <input required name="contact" value={register.contact} onChange={updateRegister} placeholder="Contact number" className={input} />
                                                </Field>
                                                <Field icon={MapPinIcon} label="Municipality">
                                                    <input required name="municipality" value={register.municipality} onChange={updateRegister} className={input} />
                                                </Field>
                                                <Field icon={MapPinIcon} label="Barangay">
                                                    <input required name="barangay" value={register.barangay} onChange={updateRegister} placeholder="Barangay" className={input} />
                                                </Field>
                                                <Field icon={BuildingOffice2Icon} label="Cooperative / Association">
                                                    <input name="organization" value={register.organization} onChange={updateRegister} placeholder="Organization (optional)" className={input} />
                                                </Field>
                                            </div>
                                            <label className="block text-sm font-semibold">User Type
                                                <select name="userType" value={register.userType} onChange={updateRegister} className={`${input} mt-1.5 pl-4`}>
                                                    <option>Farmer</option>
                                                    <option>Cooperative Member</option>
                                                    <option>Association Representative</option>
                                                </select>
                                            </label>
                                            <Field icon={LockClosedIcon} label="Password">
                                                <input required name="password" type={show ? 'text' : 'password'} value={register.password} onChange={updateRegister} placeholder="Create password" className={input} />
                                            </Field>
                                            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                                                <b className="text-blue-700">Password strength: {strength}</b>
                                                <p className="mt-1">Use at least 8 characters, including uppercase, lowercase, and a number.</p>
                                            </div>
                                            <Field icon={LockClosedIcon} label="Confirm Password">
                                                <input required name="confirmation" type={show ? 'text' : 'password'} value={register.confirmation} onChange={updateRegister} placeholder="Confirm password" className={input} />
                                            </Field>
                                            <label className="flex items-start gap-2 text-xs text-slate-600">
                                                <input required name="terms" type="checkbox" checked={register.terms} onChange={updateRegister} className="mt-0.5 rounded border-slate-300 text-blue-600" />I accept the Terms of Service and Privacy Policy.
                                            </label>
                                            <AuthButton label="Create account" />
                                        </form>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {verifiedBanner && (
                                <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-pulse">
                                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                    <span>{verifiedBanner}</span>
                                </div>
                            )}

                            {notice && !verifiedBanner && (
                                <p role="alert" className={`mt-5 rounded-xl p-3 text-sm ${notice.includes('sent') || notice.includes('verified') || notice.includes('recognized') ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700'}`}>
                                    {notice}
                                </p>
                            )}
                        </div>
                        <p className="mt-5 text-center text-xs text-slate-400">Secure government service portal</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

function AuthButton({ loading, disabled, label }) {
    return (
        <button disabled={loading || disabled} className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-500 active:translate-y-0 disabled:opacity-50">
            {loading ? <span className="inline-flex items-center gap-2"><i className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Please wait…</span> : label}
        </button>
    );
}
