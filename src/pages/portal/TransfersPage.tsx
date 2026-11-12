import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Copy,
  Check,
  SendHorizontal,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../data/mockData';
import { formatUSD } from '../../lib/utils';
import { StepUpModal } from '../../components/common/StepUpModal';
import { useToast } from '../../components/common/ToastContext';

export const TransfersPage: React.FC = () => {
  const { selectedAccountId } = useOutletContext<{ selectedAccountId: string }>();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'deposit' | 'rollover' | 'withdraw'>('deposit');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('2500');
  const [linkedBank, setLinkedBank] = useState('Chase Private Client (•••• 9102)');

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawReason, setWithdrawReason] = useState('Normal Distribution (Age 59½+)');
  const [isWithdrawStepUpOpen, setIsWithdrawStepUpOpen] = useState(false);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.id === selectedAccountId) || DEMO_ACCOUNTS[0];

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast({ title: 'Copied to Clipboard', description: `${field}: ${text}` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'ACH Contribution Initiated',
      description: `Deposit of ${formatUSD(Number(depositAmount))} scheduled from ${linkedBank}.`,
      type: 'success',
    });
  };

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawStepUpOpen(true);
  };

  const handleWithdrawalSuccess = () => {
    setIsWithdrawStepUpOpen(false);
    showToast({
      title: 'Withdrawal Authorized',
      description: `Wire distribution of ${formatUSD(Number(withdrawAmount))} submitted to custodian.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transfers & Custody Funding</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fund your self-directed IRA via domestic wire, direct 401(k) rollover, or linked bank account.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'deposit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Deposit & Wire
        </button>
        <button
          onClick={() => setActiveTab('rollover')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'rollover' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Rollover Tracker
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'withdraw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Distribution / Withdraw
        </button>
      </div>

      {/* TAB 1: DEPOSIT INSTRUCTIONS & ACH CONTRIBUTION */}
      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Wire Instructions Card */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Official Domestic Wire Instructions</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                FDIC Omnibus Bank
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Send wires from your commercial or private bank account matching your legal name (<strong>Michael Turner</strong>). Funds typically credit within 2-4 business hours.
            </p>

            <div className="space-y-2.5 text-xs bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Beneficiary Bank:</span>
                <span className="font-semibold text-slate-900">First Republic / JPMorgan Chase</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Routing Number (ABA):</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">021000021</span>
                  <button
                    onClick={() => handleCopy('ABA Routing', '021000021')}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                  >
                    {copiedField === 'ABA Routing' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">8940-1928-4421</span>
                  <button
                    onClick={() => handleCopy('Account Number', '8940-1928-4421')}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                  >
                    {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-200 pt-2">
                <span className="text-slate-500">Mandatory Memo / Reference:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    NV-4821-M-TURNER
                  </span>
                  <button
                    onClick={() => handleCopy('Wire Memo', 'NV-4821-M-TURNER')}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                  >
                    {copiedField === 'Wire Memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Linked ACH Contribution */}
          <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <SendHorizontal className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">Annual IRA Contribution</span>
            </div>

            <form onSubmit={handleExecuteDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target IRA Account</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50">
                  <option>{selectedAccount.type} ({selectedAccount.accountNumber})</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Source</label>
                <select
                  value={linkedBank}
                  onChange={(e) => setLinkedBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50"
                >
                  <option>Chase Private Client (•••• 9102)</option>
                  <option>Bank of America Business (•••• 4410)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contribution Amount ($ USD)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Remaining 2026 limit room: $2,500.00
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
              >
                Schedule ACH Contribution
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ROLLOVER TRACKER */}
      {activeTab === 'rollover' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Tracking Ref: NV-ROLL-88310</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Direct Rollover from Fidelity Investments 401(k)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              $45,000.00 USD
            </span>
          </div>

          {/* Stepper Status */}
          <div className="relative space-y-6 pl-6 border-l-2 border-indigo-600">
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              <div className="text-xs font-bold text-slate-900">1. Transfer Paperwork Executed</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Rollover request packet authorized via DocuSign and transmitted to Fidelity plan administrator.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              <div className="text-xs font-bold text-slate-900">2. Fidelity Wire Released</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                $45,000 wired to Fortis Qualified Custody Trust omnibus account on Nov 10, 2026.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] animate-pulse">
                •
              </span>
              <div className="text-xs font-bold text-indigo-900">3. Custodian Final Settlement (In Progress)</div>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Under South Dakota trust verification. Expected digital asset trade availability: Tomorrow, 9:00 AM ET.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WITHDRAWAL FORM (STEP-UP PROTECTED) */}
      {activeTab === 'withdraw' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-slate-900">Request IRA Distribution / Wire Withdrawal</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Distributions before age 59½ may be subject to a 10% IRS early withdrawal penalty and ordinary income tax. Northvault generates Form 1099-R for all distributions.
            </span>
          </div>

          <form onSubmit={handleWithdrawalRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Source Account</label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50">
                <option>Traditional IRA (•••• 4821) - Available Cash: $12,450.00</option>
                <option>Roth IRA (•••• 9310) - Available Cash: $5,120.00</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Withdrawal Amount ($ USD)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">IRS Distribution Reason</label>
              <select
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50"
              >
                <option>Normal Distribution (Age 59½+)</option>
                <option>Early Distribution (No known exception - 10% penalty)</option>
                <option>First-Time Homebuyer Exception ($10k max)</option>
                <option>Qualified Higher Education Expenses</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Continue to Step-Up Security Verification</span>
            </button>
          </form>
        </div>
      )}

      {/* Step-Up Verification Modal for Withdrawal */}
      <StepUpModal
        isOpen={isWithdrawStepUpOpen}
        onClose={() => setIsWithdrawStepUpOpen(false)}
        onSuccess={handleWithdrawalSuccess}
        title="Authorize Outgoing Distribution"
        actionDescription={`Wire withdrawal of funds from ${selectedAccount.type}`}
        amount={formatUSD(Number(withdrawAmount))}
      />
    </div>
  );
};
