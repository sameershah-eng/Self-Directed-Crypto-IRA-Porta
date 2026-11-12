import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Fingerprint,
  Users,
  Smartphone,
  Laptop,
  Trash2,
  Plus,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_USER, BENEFICIARIES, PASSKEYS, ACTIVE_SESSIONS } from '../../data/mockData';
import { StepUpModal } from '../../components/common/StepUpModal';
import { useToast } from '../../components/common/ToastContext';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'beneficiaries' | 'security'>('security');
  const [phone, setPhone] = useState(DEMO_USER.phone);
  const [address, setAddress] = useState(DEMO_USER.address);
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);
  const [passkeys, setPasskeys] = useState(PASSKEYS);

  // Step-Up Modal for sensitive changes
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>('');

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAction('Update Legal Contact & Address');
    setIsStepUpOpen(true);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast({ title: 'Session Revoked', description: 'Device signed out from Northvault portal.' });
  };

  const handleAddPasskey = () => {
    setPendingAction('Register New Hardware Security Key');
    setIsStepUpOpen(true);
  };

  const handleStepUpSuccess = () => {
    setIsStepUpOpen(false);
    if (pendingAction.includes('Register')) {
      const newKey = {
        id: `key_${Date.now()}`,
        name: 'New YubiKey 5Ci (Registered)',
        createdDate: '2026-11-12',
        lastUsedDate: '2026-11-12',
        type: 'Hardware Security Key' as const,
      };
      setPasskeys((prev) => [...prev, newKey]);
      showToast({ title: 'Passkey Enrolled', description: 'New cryptographic key paired with account.' });
    } else {
      showToast({ title: 'Details Updated', description: 'Contact address saved to custodian profile.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings & Security Center</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified identity details, beneficiaries, and zero-trust FIDO2 passkeys.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'security' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Security & Passkeys
        </button>
        <button
          onClick={() => setActiveTab('beneficiaries')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'beneficiaries' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Beneficiaries
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Contact & Legal
        </button>
      </div>

      {/* TAB 1: SECURITY CENTER & PASSKEYS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Passkeys Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Enrolled Passkeys & Hardware Keys</h3>
              </div>
              <button
                type="button"
                onClick={handleAddPasskey}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Key</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {passkeys.map((key) => (
                <div key={key.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{key.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Added: {key.createdDate} · Last verified: {key.lastUsedDate}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    FIDO2 Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Active Authorized Sessions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Devices currently authenticated into this account.</p>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {sess.location} · {sess.ipAddress} · {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BENEFICIARIES */}
      {activeTab === 'beneficiaries' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Designated Beneficiaries</h3>
              <p className="text-xs text-slate-500 mt-0.5">Legal inheritors for your IRA digital assets.</p>
            </div>
            <button
              onClick={() => {
                setPendingAction('Add Contingent Beneficiary');
                setIsStepUpOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Beneficiary</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {BENEFICIARIES.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{b.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {b.relationship} · {b.type} · SSN: {b.ssnMasked}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm">{b.sharePercent}%</span>
                  <div className="text-[10px] text-slate-400">Allocation</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & LEGAL */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm max-w-xl space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Legal Contact Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifying phone or residential address mandates step-up cryptographic verification.
            </p>
          </div>

          <form onSubmit={handleUpdateContact} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={DEMO_USER.name}
                disabled
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="text"
                value={DEMO_USER.email}
                disabled
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Save & Verify via Step-Up</span>
            </button>
          </form>
        </div>
      )}

      {/* Step-Up Verification Modal */}
      <StepUpModal
        isOpen={isStepUpOpen}
        onClose={() => setIsStepUpOpen(false)}
        onSuccess={handleStepUpSuccess}
        title="Security Step-Up Challenge"
        actionDescription={pendingAction || 'Modify sensitive profile data'}
      />
    </div>
  );
};
