import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Scan,
  CheckCircle2,
  FileCheck2,
  UserCheck,
  Building2,
  Sparkles,
  RotateCcw,
  Headphones,
  Lock,
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../components/common/ToastContext';

export const ApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<'self_serve' | 'agent_assisted'>('self_serve');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [accountType, setAccountType] = useState<'traditional' | 'roth' | 'sep'>('roth');
  const [firstName, setFirstName] = useState('Michael');
  const [lastName, setLastName] = useState('Turner');
  const [email, setEmail] = useState('m.turner@turner-partners.com');
  const [phone, setPhone] = useState('+1 (415) 892-4102');
  const [ssn, setSsn] = useState('•••-••-4821');
  const [dob, setDob] = useState('1984-06-18');
  const [employment, setEmployment] = useState('Employed / Executive');

  // Step 3 ID verification animation
  const [idScanState, setIdScanState] = useState<'idle' | 'scanning' | 'verified'>('idle');

  // Step 4 Beneficiaries
  const [beneficiaryName, setBeneficiaryName] = useState('Elena Vance-Turner');
  const [beneficiaryRelation, setBeneficiaryRelation] = useState('Spouse');
  const [beneficiaryShare, setBeneficiaryShare] = useState('100');

  // Step 5 Funding & Signature
  const [fundingMethod, setFundingMethod] = useState<'rollover' | 'transfer' | 'contribution'>('rollover');
  const [fundingSource, setFundingSource] = useState('Fidelity Investments 401(k)');
  const [fundingAmount, setFundingAmount] = useState('75000');
  const [hasAgreedTerms, setHasAgreedTerms] = useState(false);

  // Canvas Signature Pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const steps = [
    { num: 1, label: 'Account Type' },
    { num: 2, label: 'Personal Details' },
    { num: 3, label: 'Identity Verification' },
    { num: 4, label: 'Beneficiaries' },
    { num: 5, label: 'Funding & E-Sign' },
  ];

  // Signature drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#0B1530';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleStartIdScan = () => {
    setIdScanState('scanning');
    setTimeout(() => {
      setIdScanState('verified');
      showToast({
        title: 'ID Verification Successful',
        description: 'US Driver’s License matched with South Dakota trust database.',
        type: 'success',
      });
    }, 2000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedTerms) {
      showToast({
        title: 'Consent Required',
        description: 'Please review and accept the self-directed IRA custody agreement.',
        type: 'warning',
      });
      return;
    }
    if (!hasSignature) {
      showToast({
        title: 'Signature Required',
        description: 'Please sign on the electronic signature pad.',
        type: 'warning',
      });
      return;
    }

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#7C3AED', '#14B8A6', '#C9A227'],
    });

    showToast({
      title: 'IRA Application Approved',
      description: 'Account #NV-4821 provisioned with Fortis Custody Trust.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-[#0B1530] pb-24">
      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={28} />
        </Link>

        {/* Mode Toggle: Self-serve vs Agent-assisted */}
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('self_serve')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'self_serve' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Self-serve
            </button>
            <button
              onClick={() => setMode('agent_assisted')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                mode === 'agent_assisted' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Agent-assisted</span>
            </button>
          </div>
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 hidden sm:inline">
            Cancel
          </Link>
        </div>
      </header>

      {/* Agent-assisted banner if enabled */}
      {mode === 'agent_assisted' && (
        <div className="bg-indigo-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Assisted Onboarding Session with Advisor <strong>Sarah Lin, CFP®</strong> (ID: NV-ADV-8821)</span>
            </div>
            <button
              onClick={() => showToast({ title: 'Invitation Link Copied', description: 'https://northvault.com/apply?invite=8821' })}
              className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition-colors"
            >
              Copy Client Link
            </button>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12">
        {/* Animated 5-Step Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-xs font-medium text-slate-500">
            <span>Step {currentStep} of 5: {steps[currentStep - 1].label}</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Auto-saved
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {steps.map((st) => (
              <div key={st.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    st.num <= currentStep
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500'
                      : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`text-[10px] truncate hidden sm:block ${
                    st.num === currentStep
                      ? 'text-indigo-600 font-semibold'
                      : st.num < currentStep
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body Window */}
        <div className="bg-white rounded-3xl border border-[#E6E9F0] shadow-xl p-6 sm:p-10">
          {isSuccess ? (
            /* Celebratory Success Screen */
            <div className="text-center py-8 space-y-5">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold mb-2">
                  ACCOUNT PROVISIONED
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Welcome to Northvault, {firstName}.
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                  Your <strong className="text-slate-800">{accountType.toUpperCase()} IRA</strong> has been successfully opened with Fortis Qualified Custody Trust.
                </p>
              </div>

              {/* Account Card Details */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-mono font-bold text-slate-900">NV-4821-ROTH</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Legal Custodian</span>
                  <span className="font-medium text-slate-900">Fortis Custody Trust, LLC</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Funding Method</span>
                  <span className="font-medium text-slate-900 capitalize">{fundingMethod} ({fundingSource})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Initial Transfer</span>
                  <span className="font-mono font-bold text-indigo-700">${Number(fundingAmount).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/app')}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all"
                >
                  Enter Client Portal
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: ACCOUNT TYPE */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Choose your IRA type</h2>
                    <p className="text-xs text-slate-500 mt-1">Select the tax treatment best suited for your investment horizon.</p>
                  </div>

                  <div className="space-y-3">
                    <label
                      onClick={() => setAccountType('roth')}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                        accountType === 'roth'
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="accountType"
                            checked={accountType === 'roth'}
                            onChange={() => setAccountType('roth')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">Roth Crypto IRA</div>
                            <div className="text-xs text-slate-500">100% tax-free growth and tax-free retirement withdrawals.</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          RECOMMENDED
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setAccountType('traditional')}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                        accountType === 'traditional'
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="accountType"
                          checked={accountType === 'traditional'}
                          onChange={() => setAccountType('traditional')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Traditional Crypto IRA</div>
                          <div className="text-xs text-slate-500">Tax-deductible contributions today with tax-deferred compounding.</div>
                        </div>
                      </div>
                    </label>

                    <label
                      onClick={() => setAccountType('sep')}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                        accountType === 'sep'
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="accountType"
                          checked={accountType === 'sep'}
                          onChange={() => setAccountType('sep')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">SEP Crypto IRA</div>
                          <div className="text-xs text-slate-500">For self-employed professionals with up to $69,000 contribution limits.</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Personal & Legal Details</h2>
                    <p className="text-xs text-slate-500 mt-1">Required by South Dakota Division of Banking regulations for qualified trust custody.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">First name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Last name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Social Security Number (SSN)</label>
                      <input
                        type="text"
                        value={ssn}
                        onChange={(e) => setSsn(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: IDENTITY VERIFICATION ANIMATION */}
              {currentStep === 3 && (
                <div className="space-y-6 text-center py-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Identity Verification</h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Automated AML/KYC credential check with South Dakota division of trust registries.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    {idScanState === 'idle' && (
                      <div className="py-6 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                          <Scan className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Government ID Ready for Verification</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Simulated real-time document validation for {firstName} {lastName}.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleStartIdScan}
                          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
                        >
                          Scan & Verify ID
                        </button>
                      </div>
                    )}

                    {idScanState === 'scanning' && (
                      <div className="py-8 space-y-4">
                        <div className="relative w-24 h-16 bg-slate-200 rounded-lg mx-auto overflow-hidden border border-slate-300">
                          {/* Animated Scan Line */}
                          <motion.div
                            animate={{ y: [0, 56, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                            className="w-full h-1 bg-indigo-600 shadow-md shadow-indigo-500"
                          />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900">Scanning Document & Validating OFAC…</h4>
                        <p className="text-[11px] text-slate-400 font-mono">Comparing biometric features & state records</p>
                      </div>
                    )}

                    {idScanState === 'verified' && (
                      <div className="py-6 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Identity Confirmed & Cleared</h4>
                        <p className="text-xs text-emerald-700 font-medium">Passed all OFAC, FinCEN & Patriot Act verifications.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: BENEFICIARIES */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Designate Beneficiaries</h2>
                    <p className="text-xs text-slate-500 mt-1">Designate who will inherit your self-directed crypto IRA assets.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Primary Beneficiary (100%)</span>
                      <span className="text-[11px] text-indigo-600 font-medium">Auto-allocated</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          value={beneficiaryName}
                          onChange={(e) => setBeneficiaryName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                        <select
                          value={beneficiaryRelation}
                          onChange={(e) => setBeneficiaryRelation(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                        >
                          <option>Spouse</option>
                          <option>Child</option>
                          <option>Sibling</option>
                          <option>Trust / Estate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Share (%)</label>
                        <input
                          type="text"
                          value={beneficiaryShare}
                          onChange={(e) => setBeneficiaryShare(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: FUNDING & E-SIGNATURE */}
              {currentStep === 5 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Funding Method & Electronic Signature</h2>
                    <p className="text-xs text-slate-500 mt-1">Review transfer details and execute South Dakota custody agreement.</p>
                  </div>

                  {/* Funding Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFundingMethod('rollover')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        fundingMethod === 'rollover'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 font-semibold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs text-slate-900 font-bold">401(k) / IRA Rollover</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Direct tax-free rollover</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFundingMethod('transfer')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        fundingMethod === 'transfer'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 font-semibold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs text-slate-900 font-bold">Custodian Transfer</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">From another trust</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFundingMethod('contribution')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        fundingMethod === 'contribution'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 font-semibold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs text-slate-900 font-bold">2026 Contribution</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Wire or ACH deposit</div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Transfer Institution / Plan</label>
                      <input
                        type="text"
                        value={fundingSource}
                        onChange={(e) => setFundingSource(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Transfer Amount ($ USD)</label>
                      <input
                        type="number"
                        value={fundingAmount}
                        onChange={(e) => setFundingAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* HTML5 Canvas Signature Pad */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-indigo-600" />
                        <span>Draw Electronic Signature</span>
                      </label>
                      {hasSignature && (
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear pad</span>
                        </button>
                      )}
                    </div>

                    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-slate-50/50 relative">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 cursor-crosshair touch-none"
                      />
                      {!hasSignature && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 font-medium">
                          Sign with mouse, trackpad, or finger here
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAgreedTerms}
                      onChange={(e) => setHasAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I authorize Fortis Qualified Custody Trust, LLC to act as custodian for my self-directed IRA and agree to the institutional custodial fee schedule and electronic disclosures.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
                  >
                    Submit IRA Application & Provision Account
                  </button>
                </form>
              )}

              {/* Navigation Back & Next Buttons */}
              {currentStep < 5 && (
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 3 && idScanState !== 'verified') {
                        setIdScanState('verified');
                      }
                      setCurrentStep(Math.min(5, currentStep + 1));
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5"
                  >
                    <span>Next step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
