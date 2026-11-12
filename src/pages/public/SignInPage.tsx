import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../components/common/ToastContext';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<'credentials' | 'mfa' | 'passkey_scan'>('credentials');
  const [email, setEmail] = useState('m.turner@turner-partners.com');
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('mfa');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '') && val) {
      triggerSuccess();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    if (pasted.length === 6) {
      triggerSuccess();
    }
  };

  const triggerPasskeyFlow = () => {
    setStep('passkey_scan');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast({
        title: 'Passkey Authenticated',
        description: 'Welcome back, Michael. Secure session established.',
        type: 'success',
      });
      navigate('/app');
    }, 1400);
  };

  const triggerSuccess = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast({
        title: 'MFA Verified',
        description: 'Session authorized via SMS token.',
        type: 'success',
      });
      navigate('/app');
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FB] p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-[#E6E9F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Branded Gradient Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Ambient circles */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-teal-500/20 blur-2xl" />

          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-block">
              <Logo size={36} wordmarkClassName="text-white" />
            </Link>

            <div className="pt-6 space-y-3">
              <span className="inline-block px-2.5 py-1 rounded bg-white/10 text-teal-300 font-mono text-[11px] font-semibold tracking-wider uppercase">
                Zero-Trust Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Private wealth custody for the digital era.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hardware-backed WebAuthn authentication safeguards your retirement assets against credential theft and unauthorized withdrawals.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Segregated South Dakota Trust Custody</span>
            </div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>FIDO2 Passkeys & Biometric MFA</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Multi-Step Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Top Bar with Demo Badge */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Demo Mode · Pre-filled</span>
                </span>
              </div>
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
                Back to home
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: CREDENTIALS */}
              {step === 'credentials' && (
                <motion.div
                  key="step-cred"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to Northvault</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter credentials for client <span className="font-semibold text-slate-800">Michael Turner</span>.
                    </p>
                  </div>

                  {/* Passkey Fast Action */}
                  <button
                    type="button"
                    onClick={triggerPasskeyFlow}
                    className="w-full py-3 px-4 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>Sign in with registered Passkey (Touch ID)</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase">
                      or with email & password
                    </span>
                  </div>

                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">Password</label>
                        <span className="text-[11px] text-indigo-600 cursor-pointer hover:underline">Forgot?</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Continue to MFA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: MFA OTP VERIFICATION */}
              {step === 'mfa' && (
                <motion.div
                  key="step-mfa"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the 6-digit verification code sent to registered device ending in <span className="font-mono font-medium text-slate-900">•••-4102</span>.
                    </p>
                  </div>

                  <div className="flex justify-center gap-2" onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="text-center text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(['4', '8', '2', '1', '9', '0']);
                        triggerSuccess();
                      }}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Click to auto-fill sample OTP (482190)
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={triggerSuccess}
                      disabled={isVerifying}
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      {isVerifying ? 'Verifying session token...' : 'Authorize Client Session'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="w-full py-2 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Change sign in method
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PASSKEY BIOMETRIC SCANNING ANIMATION */}
              {step === 'passkey_scan' && (
                <motion.div
                  key="step-passkey"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-60" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500 text-white flex items-center justify-center shadow-lg">
                      <Fingerprint className="w-10 h-10 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Validating Hardware Passkey…</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Touch the biometric sensor on your device to sign in.
                    </p>
                  </div>

                  <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50 py-1.5 px-3 rounded-lg inline-block">
                    FIDO2 / WebAuthn Challenge Active
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Link to Onboarding */}
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an IRA with Northvault yet?{' '}
            <Link to="/apply" className="font-semibold text-indigo-600 hover:underline">
              Open an IRA in 5 minutes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
