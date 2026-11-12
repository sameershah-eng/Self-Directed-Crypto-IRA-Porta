import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { ACTIVITY_LEDGER } from '../../data/mockData';
import { ActivityCategory } from '../../types';
import { formatUSD, formatDateTimeET, exportActivityToCSV } from '../../lib/utils';
import { useToast } from '../../components/common/ToastContext';

export const ActivityPage: React.FC = () => {
  const { selectedAccountId } = useOutletContext<{ selectedAccountId: string }>();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredRecords = ACTIVITY_LEDGER.filter((item) => {
    if (selectedAccountId !== 'all' && item.accountId !== selectedAccountId) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (
      search &&
      !item.description.toLowerCase().includes(search.toLowerCase()) &&
      !item.referenceId.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    exportActivityToCSV(filteredRecords, `Northvault-IRA-Activity-Ledger-${Date.now()}.csv`);
    showToast({
      title: 'CSV Export Generated',
      description: `Downloaded ${filteredRecords.length} financial transactions.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete transaction history including contributions, rollovers, asset trades, and custodial safeguarding fees.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search description or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'TRADE', 'CONTRIBUTION', 'ROLLOVER', 'CUSTODY_FEE'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Transactions' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-[#E6E9F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Date & Time (ET)</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-4">Reference ID</th>
                <th className="py-3.5 px-6 text-right">Amount (USD)</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No ledger transactions found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const isPositive = item.amount > 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                        {formatDateTimeET(item.timestamp)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block font-mono font-semibold px-2 py-0.5 rounded text-[10px] ${
                            item.category === 'TRADE'
                              ? 'bg-indigo-50 text-indigo-700'
                              : item.category === 'CONTRIBUTION'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.category === 'ROLLOVER'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900 max-w-md truncate">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-500">{item.referenceId}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-sm tabular-nums">
                        <span className={isPositive ? 'text-emerald-600' : 'text-slate-900'}>
                          {isPositive ? `+${formatUSD(item.amount)}` : formatUSD(item.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
