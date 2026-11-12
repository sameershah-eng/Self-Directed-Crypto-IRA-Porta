import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Fingerprint, Smartphone, CheckCircle, X, Lock } from 'lucide-react';

interface StepUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  actionDescription: string;
  amount?: string;
}

export const StepUpModal: React.FC<StepUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Step-Up Verification Required',
  actionDescription,
  amount,
}) => {
  const [method, setMethod] = useState<'passkey' | 'otp'>('passkey');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsVerifying(false);
      setIsSuccess(false);
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [isOpen]);

  const handlePasskeyAuth = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    }, 1200);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newDigits.every((d) => d !== '') && val) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 700);
      }, 900);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    if (pasted.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 700);
      }, 900);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-indigo-700">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-900">{title}</span>
            </div>
            <button
              onClick={onClose}
              disabled={isVerifying || isSuccess}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {/* Description Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{actionDescription}</p>
                  {amount && <p className="font-mono font-semibold text-indigo-700 text-sm mt-0.5">{amount}</p>}
                  <p className="mt-1 text-[11px] text-slate-500">
                    To safeguard retirement assets, SEC/FINRA compliance guidelines mandate cryptographic re-authentication for this action.
                  </p>
                </div>
              </div>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3"
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
                <h4 className="text-base font-semibold text-slate-900">Cryptographically Verified</h4>
                <p className="text-xs text-slate-500 mt-1">Executing authorized request with custodian...</p>
              </div>
            ) : (
              <>
                {/* Method Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                  <button
                    type="button"
                    onClick={() => setMethod('passkey')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                      method === 'passkey'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    FIDO2 Passkey / Touch ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('otp')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                      method === 'otp'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    SMS / Authenticator OTP
                  </button>
                </div>

                {/* Method 1: Passkey */}
                {method === 'passkey' && (
                  <div className="text-center py-2">
                    <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <div
                        className={`absolute inset-0 rounded-full bg-indigo-100 transition-transform ${
                          isVerifying ? 'animate-ping opacity-60' : ''
                        }`}
                      />
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md">
                        <Fingerprint className="w-8 h-8" />
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900">
                      {isVerifying ? 'Scanning Biometrics…' : 'Touch ID or Security Key'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      {isVerifying
                        ? 'Validating WebAuthn cryptographic signature...'
                        : 'Use your registered biometric sensor or YubiKey hardware key to verify identity.'}
                    </p>

                    <button
                      type="button"
                      onClick={handlePasskeyAuth}
                      disabled={isVerifying}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      {isVerifying ? 'Verifying with Hardware...' : 'Scan Passkey to Authorize'}
                    </button>
                  </div>
                )}

                {/* Method 2: OTP */}
                {method === 'otp' && (
                  <div className="py-2">
                    <p className="text-xs text-center text-slate-600 mb-4">
                      Enter the 6-digit one-time code sent to your registered phone ending in <span className="font-mono font-medium text-slate-900">•••-4102</span>
                    </p>

                    <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-11 h-12 text-center text-lg font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                      ))}
                    </div>

                    <div className="text-center text-[11px] text-slate-400">
                      Didn't receive code?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setOtpDigits(['7', '4', '8', '2', '9', '1']);
                          setIsVerifying(true);
                          setTimeout(() => {
                            setIsVerifying(false);
                            setIsSuccess(true);
                            setTimeout(() => {
                              onSuccess();
                              onClose();
                            }, 700);
                          }, 900);
                        }}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Auto-fill demo code (748291)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsVerifying(true);
                        setTimeout(() => {
                          setIsVerifying(false);
                          setIsSuccess(true);
                          setTimeout(() => {
                            onSuccess();
                            onClose();
                          }, 700);
                        }, 900);
                      }}
                      disabled={isVerifying}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      {isVerifying ? 'Verifying OTP Code...' : 'Submit & Authorize'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
