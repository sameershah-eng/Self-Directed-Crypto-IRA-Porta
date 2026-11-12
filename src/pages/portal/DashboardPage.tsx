import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShieldCheck,
  Clock,
  ArrowRight,
  PieChart as PieIcon,
  ChevronRight,
  PlusCircle,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DEMO_ACCOUNTS,
  TOTAL_PORTFOLIO_VALUE,
  TOTAL_DAY_CHANGE_DOLLAR,
  TOTAL_DAY_CHANGE_PERCENT,
  ACTIVITY_LEDGER,
} from '../../data/mockData';
import { formatUSD, formatPercent, generateChartData, formatDateTimeET } from '../../lib/utils';
import { CoinIcon } from '../../components/common/CoinIcon';

export const DashboardPage: React.FC = () => {
  const { selectedAccountId } = useOutletContext<{ selectedAccountId: string }>();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);

  // Count up balance state
  const [displayBalance, setDisplayBalance] = useState(200000);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.id === selectedAccountId);
  const targetBalance = selectedAccount ? selectedAccount.totalValue : TOTAL_PORTFOLIO_VALUE;
  const targetDayChangeDollar = selectedAccount ? selectedAccount.dayChangeDollar : TOTAL_DAY_CHANGE_DOLLAR;
  const targetDayChangePercent = selectedAccount ? selectedAccount.dayChangePercent : TOTAL_DAY_CHANGE_PERCENT;

  // Animated count-up effect
  useEffect(() => {
    let start = targetBalance * 0.95;
    const end = targetBalance;
    const duration = 600;
    const steps = 25;
    const stepDuration = duration / steps;
    const increment = (end - start) / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      start += increment;
      if (step >= steps) {
        setDisplayBalance(end);
        clearInterval(timer);
      } else {
        setDisplayBalance(start);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetBalance]);

  // Generate chart points based on timeframe
  useEffect(() => {
    let points = 24;
    let seed = 101;
    if (timeframe === '1D') {
      points = 24;
      seed = 42;
    } else if (timeframe === '1W') {
      points = 28;
      seed = 55;
    } else if (timeframe === '1M') {
      points = 30;
      seed = 77;
    } else if (timeframe === '3M') {
      points = 45;
      seed = 88;
    } else if (timeframe === '1Y') {
      points = 52;
      seed = 99;
    } else if (timeframe === 'ALL') {
      points = 60;
      seed = 123;
    }

    const data = generateChartData(targetBalance * 0.88, points, 0.012, 0.002, seed);
    // Ensure final point matches current balance
    data[data.length - 1].value = targetBalance;
    setChartData(data);
  }, [timeframe, targetBalance]);

  // Consolidated holdings for donut
  const holdings = selectedAccount
    ? selectedAccount.holdings
    : [
        { symbol: 'BTC', name: 'Bitcoin', marketValue: 150305.03, color: '#F7931A', allocationPercent: 60.53 },
        { symbol: 'ETH', name: 'Ethereum', marketValue: 39825.75, color: '#627EEA', allocationPercent: 16.04 },
        { symbol: 'SOL', name: 'Solana', marketValue: 27040.80, color: '#14F195', allocationPercent: 10.89 },
        { symbol: 'USDC', name: 'USD Coin', marketValue: 17571.31, color: '#2775CA', allocationPercent: 7.08 },
        { symbol: 'LINK', name: 'Chainlink', marketValue: 7395.00, color: '#375BD2', allocationPercent: 2.98 },
        { symbol: 'AVAX', name: 'Avalanche', marketValue: 6174.65, color: '#E84142', allocationPercent: 2.48 },
      ];

  // 2026 Contribution calculations
  const totalContributed = selectedAccount
    ? selectedAccount.contributed2026
    : DEMO_ACCOUNTS.reduce((sum, a) => sum + a.contributed2026, 0);
  const totalLimit = 7000; // standard limit
  const remainingRoom = Math.max(0, totalLimit - (selectedAccount ? selectedAccount.contributed2026 : 4500));
  const progressPercent = Math.min(100, Math.round(((totalLimit - remainingRoom) / totalLimit) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good afternoon, Michael</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Portfolio overview for <strong className="text-slate-700">{selectedAccount ? selectedAccount.type : 'All Custodied Accounts'}</strong> · Last verified 12s ago
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/app/trade"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/15 flex items-center gap-1.5 transition-all"
          >
            <span>Trade Digital Assets</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/app/transfers"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Fund / Rollover</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Total Value & Day Change Card */}
        <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Custodied Value (USD)
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight mt-1 tabular-nums">
                {formatUSD(displayBalance)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-mono font-semibold px-2.5 py-1 rounded-lg text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>{formatPercent(targetDayChangePercent)}</span>
                <span className="text-[11px] text-emerald-600">({formatUSD(targetDayChangeDollar)})</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Today</span>
            </div>
          </div>

          {/* Timeframe Selector Bar */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <span className="text-xs font-semibold text-slate-700">Performance History</span>
            <div className="flex p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
              {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    timeframe === tf ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Area Chart */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="portalChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatUSD(Number(val || 0)), 'Portfolio Value']}
                  contentStyle={{
                    backgroundColor: '#0B1530',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  itemStyle={{ color: '#E0E7FF' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#portalChartGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2026 Contribution Room & Pending Alert */}
        <div className="md:col-span-4 space-y-5 flex flex-col justify-between">
          {/* Contribution Room Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                2026 Contribution Room
              </span>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                IRA Cap
              </span>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {formatUSD(remainingRoom)} remaining
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                of $7,000.00 annual federal limit ({progressPercent}% utilized)
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="pt-2 flex justify-between text-[11px] text-slate-500">
              <span>Contributed: {formatUSD(totalLimit - remainingRoom)}</span>
              <Link to="/app/transfers" className="text-indigo-600 font-semibold hover:underline">
                Deposit now →
              </Link>
            </div>
          </div>

          {/* Pending Settlement Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Rollover Transfer in Progress</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Direct transfer of $45,000 from Fidelity 401(k) settled by trust custodian. Funds will unlock for digital asset trading in 1 business day.
            </p>
            <Link
              to="/app/transfers"
              className="inline-block text-[11px] font-semibold text-amber-950 hover:underline pt-1"
            >
              Track transfer status →
            </Link>
          </div>

          {/* Quick Tax Notice */}
          <div className="bg-white rounded-2xl p-4 border border-[#E6E9F0] shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">IRS Form 5498 & 1099-R</div>
                <div className="text-[11px] text-slate-400">Electronic tax filing active</div>
              </div>
            </div>
            <Link to="/app/statements" className="text-indigo-600 font-medium hover:underline text-xs">
              View forms
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Asset Allocation Donut & Top Holdings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Allocation Donut */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Asset Allocation</span>
            <span className="text-[11px] text-slate-400 font-mono">100% Segregated</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={holdings}
                  dataKey="marketValue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {holdings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatUSD(Number(val || 0)), 'Value']}
                  contentStyle={{
                    backgroundColor: '#0B1530',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Assets</div>
              <div className="text-base font-bold text-slate-900 font-mono">{holdings.length}</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {holdings.slice(0, 4).map((h) => (
              <div key={h.symbol} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                  <span className="font-semibold text-slate-800">{h.name}</span>
                  <span className="text-slate-400 text-[10px] font-mono">({h.symbol})</span>
                </div>
                <div className="font-mono text-right">
                  <span className="text-slate-900 font-semibold">{formatUSD(h.marketValue)}</span>
                  <span className="text-slate-400 text-[10px] ml-1.5">({h.allocationPercent.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Holdings Table Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Current Holdings</span>
            <Link to="/app/portfolio" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
              <span>Full Portfolio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto my-2">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-2">Asset</th>
                  <th className="py-2.5 px-2 text-right">Market Value</th>
                  <th className="py-2.5 px-2 text-right">Allocation</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holdings.slice(0, 5).map((h) => (
                  <tr key={h.symbol} className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 flex items-center gap-2.5">
                      <CoinIcon symbol={h.symbol} size={24} />
                      <div>
                        <div className="font-bold text-slate-900">{h.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{h.symbol}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatUSD(h.marketValue)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600 tabular-nums">
                      {h.allocationPercent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        to="/app/trade"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md"
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Custodian: Fortis Trust Segregated Vault</span>
            <span className="font-mono text-emerald-600 font-medium">Reconciled Nightly</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Financial Activity Ledger Snippet */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6E9F0] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-900">Recent Account Activity</span>
            <span className="text-slate-400 text-xs ml-2">Trades, rollovers & contributions</span>
          </div>
          <Link to="/app/activity" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
            <span>View all ledger entries</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {ACTIVITY_LEDGER.slice(0, 5).map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    act.category === 'TRADE'
                      ? 'bg-indigo-50 text-indigo-700'
                      : act.category === 'CONTRIBUTION'
                      ? 'bg-emerald-50 text-emerald-700'
                      : act.category === 'ROLLOVER'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {act.category === 'TRADE' ? 'TR' : act.category === 'CONTRIBUTION' ? 'CT' : 'RO'}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{act.description}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {formatDateTimeET(act.timestamp)} · Ref: {act.referenceId}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div
                  className={`font-bold tabular-nums ${
                    act.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {act.amount > 0 ? `+${formatUSD(act.amount)}` : formatUSD(act.amount)}
                </div>
                <div className="text-[10px] text-slate-400 font-sans">{act.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
