import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Users,
  Power,
  RefreshCw,
  FileCheck,
  Eye,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BACKOFFICE_CLIENTS,
  RECONCILIATION_DATA,
  AUDIT_LOGS,
} from '../../data/mockData';
import { AdminClient, AuditLogEntry } from '../../types';
import { formatUSD, formatDateTimeET } from '../../lib/utils';
import { useToast } from '../../components/common/ToastContext';
import { Logo } from '../../components/common/Logo';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'clients' | 'killswitch' | 'reconciliation' | 'audit'>('clients');

  // Client Search & Detail
  const [searchClient, setSearchClient] = useState('');
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(BACKOFFICE_CLIENTS[0]);
  const [clientList, setClientList] = useState(BACKOFFICE_CLIENTS);

  // Trading Kill Switch
  const [isGlobalKillSwitchActive, setIsGlobalKillSwitchActive] = useState(false);
  const [isKillSwitchModalOpen, setIsKillSwitchModalOpen] = useState(false);
  const [killSwitchReason, setKillSwitchReason] = useState('Scheduled Custody Migration Maintenance');

  // Audit Logs Filter
  const [auditFilter, setAuditFilter] = useState('ALL');

  const filteredClients = clientList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchClient.toLowerCase()) ||
      c.email.toLowerCase().includes(searchClient.toLowerCase()) ||
      c.accountNumber.toLowerCase().includes(searchClient.toLowerCase())
  );

  const toggleClientTradingFreeze = (clientId: string) => {
    setClientList((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newStatus = c.accountStatus === 'Frozen' ? 'Active' : 'Frozen';
          showToast({
            title: `Client Account ${newStatus === 'Frozen' ? 'Frozen' : 'Unfrozen'}`,
            description: `${c.name} trading privileges updated.`,
            type: newStatus === 'Frozen' ? 'warning' : 'success',
          });
          return { ...c, accountStatus: newStatus };
        }
        return c;
      })
    );
  };

  const handleToggleGlobalKillSwitch = () => {
    setIsKillSwitchModalOpen(true);
  };

  const confirmKillSwitch = () => {
    const newState = !isGlobalKillSwitchActive;
    setIsGlobalKillSwitchActive(newState);
    setIsKillSwitchModalOpen(false);
    showToast({
      title: newState ? 'GLOBAL TRADING KILL SWITCH ACTIVATED' : 'Global Trading Resumed',
      description: newState
        ? 'All ECN order books paused. All venues notified.'
        : 'Order routing restored across all market makers.',
      type: newState ? 'error' : 'success',
      duration: 6000,
    });
  };

  const handleViewAsCustomer = (client: AdminClient) => {
    navigate('/app?view_as=customer');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F6] text-[#0B1530] flex flex-col font-sans">
      {/* Back-Office Top Bar */}
      <header className="h-16 bg-[#0B1530] text-white px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={28} showWordmark={false} />
            <span className="font-bold text-white tracking-tight text-base">Northvault Operations</span>
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700 uppercase font-semibold">
            Institutional Console
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 hidden sm:inline">South Dakota Trust Gateway: Nominal</span>
          </div>

          <Link
            to="/app"
            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Switch to Client Portal
          </Link>
        </div>
      </header>

      {/* Global Kill Switch Banner if active */}
      {isGlobalKillSwitchActive && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 mx-auto">
            <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            <span>GLOBAL TRADING ENGINE KILL SWITCH IS CURRENTLY ACTIVE — ORDER PLACEMENT DISABLED</span>
          </div>
          <button
            onClick={() => setIsGlobalKillSwitchActive(false)}
            className="bg-white text-rose-700 px-3 py-0.5 rounded text-[11px] font-bold hover:bg-rose-50"
          >
            Resume Trading
          </button>
        </div>
      )}

      {/* Console Subnav Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center gap-1 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('clients')}
          className={`py-3.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'clients'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Client Accounts (25)
        </button>
        <button
          onClick={() => setActiveTab('killswitch')}
          className={`py-3.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'killswitch'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>Emergency Trading Controls</span>
        </button>
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`py-3.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'reconciliation'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Nightly Custody Reconciliation</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Append-Only Audit Log (50)</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1">
        {/* TAB 1: CLIENT OPERATIONS & VIEW AS CUSTOMER */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Client Roster Table */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search name, email, or account number..."
                      value={searchClient}
                      onChange={(e) => setSearchClient(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-mono shrink-0">
                    {filteredClients.length} clients
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Client</th>
                        <th className="py-2.5 px-3">KYC Status</th>
                        <th className="py-2.5 px-3 text-right">AUM</th>
                        <th className="py-2.5 px-3 text-center">Trading</th>
                        <th className="py-2.5 px-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredClients.map((client) => {
                        const isSelected = selectedClient?.id === client.id;
                        return (
                          <tr
                            key={client.id}
                            onClick={() => setSelectedClient(client)}
                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                              isSelected ? 'bg-indigo-50/50' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{client.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{client.accountNumber}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  client.kycStatus === 'Verified'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : client.kycStatus === 'Flagged'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {client.kycStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                              {formatUSD(client.totalAUM)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                  client.accountStatus === 'Active'
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-rose-700 bg-rose-50'
                                }`}
                              >
                                {client.accountStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClient(client);
                                }}
                                className="text-xs text-indigo-600 font-semibold hover:underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Client Operations Detail & View as Customer */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {selectedClient ? (
                <>
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedClient.id}</span>
                      <h2 className="text-xl font-bold text-slate-900">{selectedClient.name}</h2>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{selectedClient.email}</div>
                    </div>

                    {/* View As Customer Button */}
                    <button
                      onClick={() => handleViewAsCustomer(selectedClient)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-sm flex items-center gap-1.5 transition-colors"
                      title="Launch client session in read-only mode"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View as customer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Custodied AUM</span>
                      <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                        {formatUSD(selectedClient.totalAUM)}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">IRA Account Type</span>
                      <div className="text-xs font-bold text-slate-900 mt-1">{selectedClient.iraType}</div>
                    </div>
                  </div>

                  {/* Per-Client Trading Block Toggle */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Trading Authorization</div>
                      <div className="text-[11px] text-slate-500">
                        Status: <strong className="font-mono">{selectedClient.accountStatus}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleClientTradingFreeze(selectedClient.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedClient.accountStatus === 'Active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {selectedClient.accountStatus === 'Active' ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Freeze Trading</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unfreeze</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900">Compliance & Advisor Notes</div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
                      {selectedClient.notes.map((n, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-slate-400">•</span>
                          <span>{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Select a client to view operations profile.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EMERGENCY TRADING KILL SWITCH */}
        {activeTab === 'killswitch' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <Power className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Global Trading Kill Switch</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Emergency breaker. Instantly pauses order execution and order entry across all connected institutional liquidity providers and qualified custody channels.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">Global Venue Order Routing</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Current Status:{' '}
                  <span className={`font-bold font-mono ${isGlobalKillSwitchActive ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isGlobalKillSwitchActive ? 'LOCKED / PAUSED' : 'ONLINE / ACTIVE'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleGlobalKillSwitch}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                  isGlobalKillSwitchActive
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isGlobalKillSwitchActive ? 'Resume Trading' : 'Engage Kill Switch'}
              </button>
            </div>

            <div className="text-xs text-slate-500 space-y-2 border-t border-slate-100 pt-4">
              <div className="font-semibold text-slate-800">Operational Safeguards:</div>
              <p>• Engaging requires 2-person cryptographic authorization and an explicit incident log reason.</p>
              <p>• In-flight filled orders will complete settlement; pending limit orders will be cancelled.</p>
            </div>
          </div>
        )}

        {/* TAB 3: NIGHTLY RECONCILIATION REPORT */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Automated Trust Audit</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">Nightly Custody Reconciliation</h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Run: {formatDateTimeET(RECONCILIATION_DATA.runDate)} · Target: 842 IRA Accounts
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    2 Minor Timing Mismatches
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Audited Accounts</span>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    {RECONCILIATION_DATA.totalAccountsAudited}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">100% Matched</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                    {RECONCILIATION_DATA.matchedCount}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Pending Settle</span>
                  <div className="text-xl font-bold font-mono text-amber-600 mt-1">
                    {RECONCILIATION_DATA.pendingSettlements}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Net Variance</span>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    ${RECONCILIATION_DATA.totalCustodyDifferenceUsd.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Mismatches Table */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Flagged Items Requiring Resolution
                </h3>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Client</th>
                        <th className="py-2.5 px-3">Asset</th>
                        <th className="py-2.5 px-3 text-right">Internal Ledger</th>
                        <th className="py-2.5 px-3 text-right">Custodian Vault</th>
                        <th className="py-2.5 px-4">Audit Note</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {RECONCILIATION_DATA.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{item.clientName}</td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">{item.asset}</td>
                          <td className="py-3 px-3 text-right font-mono">{item.ledgerBalance}</td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                            {item.custodianBalance}
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs">{item.note}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                showToast({
                                  title: 'Discrepancy Cleared',
                                  description: `Reconciliation note updated for ${item.clientName}.`,
                                  type: 'success',
                                });
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px]"
                            >
                              Resolve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLIANCE AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cryptographically Chained Audit Trail</h3>
                <p className="text-xs text-slate-500">Immutable record of client & administrative operations.</p>
              </div>

              <div className="flex items-center gap-2">
                {(['ALL', 'Customer', 'Ops Agent', 'System'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAuditFilter(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      auditFilter === r ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Timestamp (ET)</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Target Entity</th>
                    <th className="py-2.5 px-3">IP Origin</th>
                    <th className="py-2.5 px-4 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AUDIT_LOGS.filter((a) => (auditFilter === 'ALL' ? true : a.role === auditFilter)).map(
                    (entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {formatDateTimeET(entry.timestamp)}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{entry.actor}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {entry.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{entry.action}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{entry.target}</td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{entry.ipAddress}</td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                              entry.result === 'Success'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {entry.result}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal for Kill Switch */}
      {isKillSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsKillSwitchModalOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Confirm Trading Kill Switch</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to pause all digital asset execution routes. Please provide an operational reason for the compliance audit log.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Incident Ref</label>
              <input
                type="text"
                value={killSwitchReason}
                onChange={(e) => setKillSwitchReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsKillSwitchModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmKillSwitch}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
              >
                Confirm & Engage Breaker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
