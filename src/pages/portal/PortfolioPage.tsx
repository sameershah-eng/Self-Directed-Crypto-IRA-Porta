import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Search,
  ArrowUpRight,
  X,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { DEMO_ACCOUNTS, SUPPORTED_ASSETS } from '../../data/mockData';
import { PortfolioHolding } from '../../types';
import { formatUSD, formatPercent, formatCryptoQty, generateChartData } from '../../lib/utils';
import { CoinIcon } from '../../components/common/CoinIcon';

export const PortfolioPage: React.FC = () => {
  const { selectedAccountId } = useOutletContext<{ selectedAccountId: string }>();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'marketValue' | 'unrealizedPnL' | 'quantity' | 'name'>('marketValue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.id === selectedAccountId);

  // Combine holdings if 'all' selected
  const allHoldings: PortfolioHolding[] = selectedAccount
    ? selectedAccount.holdings
    : [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          quantity: 1.5362,
          avgCost: 69100.00,
          currentPrice: 97842.10,
          marketValue: 150305.03,
          unrealizedPnL: 44159.15,
          unrealizedPnLPercent: 41.56,
          allocationPercent: 60.53,
          color: '#F7931A',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          quantity: 11.6700,
          avgCost: 2870.00,
          currentPrice: 3412.66,
          marketValue: 39825.75,
          unrealizedPnL: 6325.45,
          unrealizedPnLPercent: 18.88,
          allocationPercent: 16.04,
          color: '#627EEA',
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          quantity: 148.2500,
          avgCost: 129.40,
          currentPrice: 182.40,
          marketValue: 27040.80,
          unrealizedPnL: 7858.05,
          unrealizedPnLPercent: 40.96,
          allocationPercent: 10.89,
          color: '#14F195',
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          quantity: 17571.31,
          avgCost: 1.00,
          currentPrice: 1.00,
          marketValue: 17571.31,
          unrealizedPnL: 0.00,
          unrealizedPnLPercent: 0.00,
          allocationPercent: 7.08,
          color: '#2775CA',
        },
        {
          symbol: 'LINK',
          name: 'Chainlink',
          quantity: 340.0000,
          avgCost: 16.80,
          currentPrice: 21.75,
          marketValue: 7395.00,
          unrealizedPnL: 1683.00,
          unrealizedPnLPercent: 29.46,
          allocationPercent: 2.98,
          color: '#375BD2',
        },
        {
          symbol: 'AVAX',
          name: 'Avalanche',
          quantity: 162.0000,
          avgCost: 32.40,
          currentPrice: 38.12,
          marketValue: 6175.44,
          unrealizedPnL: 926.64,
          unrealizedPnLPercent: 17.65,
          allocationPercent: 2.48,
          color: '#E84142',
        },
      ];

  const filteredHoldings = allHoldings
    .filter(
      (h) =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') comp = a.name.localeCompare(b.name);
      else if (sortField === 'marketValue') comp = a.marketValue - b.marketValue;
      else if (sortField === 'unrealizedPnL') comp = a.unrealizedPnL - b.unrealizedPnL;
      else if (sortField === 'quantity') comp = a.quantity - b.quantity;
      return sortOrder === 'asc' ? comp : -comp;
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Mock price chart for drawer
  const drawerChartData = selectedHolding
    ? generateChartData(selectedHolding.currentPrice * 0.85, 30, 0.02, 0.003, 108)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portfolio Holdings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time balance breakdown across custodied digital assets and cash equivalents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by asset name or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
            />
          </div>
          <Link
            to="/app/trade"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 shadow-md shadow-indigo-600/15"
          >
            Execute Trade
          </Link>
        </div>
      </div>

      {/* Holdings Table Card */}
      <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-[#E6E9F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-6 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Asset</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('quantity')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Quantity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Avg Cost</th>
                <th className="py-3.5 px-4 text-right">Current Price</th>
                <th
                  onClick={() => handleSort('marketValue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Market Value</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('unrealizedPnL')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Unrealized P/L</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Allocation</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHoldings.map((h) => {
                const isGain = h.unrealizedPnL >= 0;
                return (
                  <tr
                    key={h.symbol}
                    onClick={() => setSelectedHolding(h)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <CoinIcon symbol={h.symbol} size={28} />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{h.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{h.symbol}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-medium text-slate-800 tabular-nums">
                      {formatCryptoQty(h.quantity)} {h.symbol}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {formatUSD(h.avgCost)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatUSD(h.currentPrice)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {formatUSD(h.marketValue)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <div className={`font-semibold ${isGain ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isGain ? `+${formatUSD(h.unrealizedPnL)}` : formatUSD(h.unrealizedPnL)}
                      </div>
                      <div className={`text-[10px] ${isGain ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatPercent(h.unrealizedPnLPercent)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600 tabular-nums">
                      <span className="inline-block bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded text-xs">
                        {h.allocationPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHolding(h);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-50 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail Drawer */}
      {selectedHolding && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedHolding(null)}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Window */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <CoinIcon symbol={selectedHolding.symbol} size={36} />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedHolding.name}</h3>
                    <span className="text-xs font-mono text-slate-400">{selectedHolding.symbol} · Custodied</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHolding(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price & Value KPI */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Current Price</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {formatUSD(selectedHolding.currentPrice)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Your Market Value</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {formatUSD(selectedHolding.marketValue)}
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <div>
                <span className="text-xs font-semibold text-slate-700">30-Day Custody Valuation Trend</span>
                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={drawerChartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="holdingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedHolding.color} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={selectedHolding.color} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="label" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(v: any) => [formatUSD(Number(v || 0)), 'Valuation']}
                        contentStyle={{
                          backgroundColor: '#0B1530',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={selectedHolding.color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#holdingGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Holding Details Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Holdings Quantity</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCryptoQty(selectedHolding.quantity)} {selectedHolding.symbol}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cost Basis (Average)</span>
                  <span className="font-mono text-slate-900">{formatUSD(selectedHolding.avgCost)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Unrealized Gain / Loss</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedHolding.unrealizedPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {formatUSD(selectedHolding.unrealizedPnL)} ({formatPercent(selectedHolding.unrealizedPnLPercent)})
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Custody Segregation</span>
                  <span className="font-medium text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Fortis Trust 1:1 Cold Vault
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
              <Link
                to="/app/trade"
                className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-colors"
              >
                Trade {selectedHolding.symbol}
              </Link>
              <button
                onClick={() => setSelectedHolding(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
