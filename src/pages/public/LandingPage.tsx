import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Landmark,
  ArrowUpRight,
  Database,
  KeyRound,
  FileSpreadsheet,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { SUPPORTED_ASSETS, FAQ_ITEMS, TOTAL_PORTFOLIO_VALUE } from '../../data/mockData';
import { formatUSD, formatPercent } from '../../lib/utils';
import { CoinIcon } from '../../components/common/CoinIcon';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<'all' | 'gainers' | 'core'>('all');
  const [searchAsset, setSearchAsset] = useState('');

  // Mock performance data for hero mockup chart
  const heroChartData = [
    { name: 'Jan', value: 182000 },
    { name: 'Feb', value: 191000 },
    { name: 'Mar', value: 188500 },
    { name: 'Apr', value: 204000 },
    { name: 'May', value: 198000 },
    { name: 'Jun', value: 212000 },
    { name: 'Jul', value: 219000 },
    { name: 'Aug', value: 214000 },
    { name: 'Sep', value: 228000 },
    { name: 'Oct', value: 239000 },
    { name: 'Nov', value: 248312 },
  ];

  const filteredAssets = SUPPORTED_ASSETS.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchAsset.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchAsset.toLowerCase());
    if (selectedAssetFilter === 'gainers') return matchesSearch && asset.change24h > 2.0;
    if (selectedAssetFilter === 'core') return matchesSearch && ['BTC', 'ETH', 'SOL', 'USDC'].includes(asset.symbol);
    return matchesSearch;
  });

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Prop & Trust */}
          <div className="lg:col-span-7 space-y-6">
            {/* Retirement / Trust Gold Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Self-Directed Crypto IRA · Traditional · Roth · SEP</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B1530] leading-[1.1] text-balance">
              Your retirement, in digital assets.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Held by a qualified custodian.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5B6478] max-w-2xl leading-relaxed">
              Invest in Bitcoin, Ethereum, and market-leading digital assets with tax-advantaged compounding. Built with bank-grade cold storage, segregated trust accounts, and instant trading.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/apply"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Open an IRA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0B1530] bg-white border border-[#E6E9F0] hover:bg-slate-50 shadow-sm active:scale-[0.98] transition-all"
              >
                See how it works
              </a>
            </div>

            {/* Trust Row */}
            <div className="pt-6 border-t border-[#E6E9F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#5B6478]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Qualified Custodian</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">SOC 2 In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">MFA & Passkeys</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">U.S.-Only Hosting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code-Built Realistic Floating Product Mockup */}
          <div className="lg:col-span-5 relative">
            {/* Background Mesh Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-teal-500/15 rounded-3xl blur-2xl transform -rotate-1 pointer-events-none" />

            {/* Main Mockup Card */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E6E9F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(11,21,48,0.04),0_12px_32px_rgba(11,21,48,0.08)]"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Portfolio Value</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0B1530] tracking-tight tabular-nums">
                    $248,312.54
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +12.4% YTD
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">+$27,410.12 total gain</div>
                </div>
              </div>

              {/* Mini Area Chart */}
              <div className="h-36 w-full my-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heroChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#heroGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Asset Allocation Mini Rows */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between font-medium text-slate-700 py-1">
                  <div className="flex items-center gap-2">
                    <CoinIcon symbol="BTC" size={20} />
                    <span>Bitcoin</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-semibold text-slate-900">$150,305.03</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(60.5%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-700 py-1">
                  <div className="flex items-center gap-2">
                    <CoinIcon symbol="ETH" size={20} />
                    <span>Ethereum</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-semibold text-slate-900">$39,825.75</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(16.0%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-700 py-1">
                  <div className="flex items-center gap-2">
                    <CoinIcon symbol="SOL" size={20} />
                    <span>Solana</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-semibold text-slate-900">$27,040.80</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(10.9%)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Satellite Card 1: Order Filled */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -top-5 -left-4 sm:-left-8 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 text-xs flex items-center gap-2.5 max-w-[210px]"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">Order filled · Buy 0.25 BTC</div>
                <div className="text-[10px] font-mono text-slate-500">$96,800.00 · Settled</div>
              </div>
            </motion.div>

            {/* Floating Satellite Card 2: Passkey Verified */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -right-2 sm:-right-6 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 text-xs flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Passkey verified</div>
                <div className="text-[10px] font-mono text-slate-500">Hardware Touch ID valid</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. LIVE MARKET STRIP (10 assets horizontally auto-scrolling) */}
      <section className="border-y border-[#E6E9F0] bg-white py-3 overflow-hidden shadow-xs">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {SUPPORTED_ASSETS.concat(SUPPORTED_ASSETS).map((asset, idx) => (
            <div key={`${asset.symbol}-${idx}`} className="inline-flex items-center gap-2.5 px-3">
              <CoinIcon symbol={asset.symbol} size={20} />
              <span className="font-bold text-xs text-slate-900">{asset.symbol}</span>
              <span className="text-xs font-mono text-slate-700 tabular-nums">{formatUSD(asset.price)}</span>
              <span
                className={`text-[11px] font-mono font-medium ${
                  asset.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {formatPercent(asset.change24h)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 steps with connecting line) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Process & Custody</div>
          <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">How your crypto IRA operates</h2>
          <p className="text-sm text-[#5B6478] mt-2">
            Seamlessly transition retirement funds into digital assets while staying fully compliant with IRS code.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold font-mono text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Apply in minutes</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                Choose Traditional, Roth, or SEP IRA. Complete automated KYC verification in under 5 minutes with zero paper forms.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">Step 1 of 4</div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold font-mono text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Fund by transfer or rollover</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                Roll over an existing 401(k), transfer from Charles Schwab/Fidelity, or make a direct annual contribution via wire/ACH.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">Step 2 of 4</div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 font-bold font-mono text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Trade on regulated venues</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                Execute market and limit orders 24/7/365 across institutional liquidity venues with low 0.20% fees and zero hidden markup.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">Step 3 of 4</div>
          </div>

          {/* Step 4 */}
          <div className="relative bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold font-mono text-sm flex items-center justify-center">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900">Custodian holds & settles</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                Fortis Qualified Custody Trust holds assets 1:1 in bankruptcy-remote cold vaults and handles all annual IRS Form 5498 filings.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">Step 4 of 4</div>
          </div>
        </div>
      </section>

      {/* 4. SUPPORTED ASSETS TABLE */}
      <section id="assets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Asset Roster</div>
            <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">Institutional-grade digital assets</h2>
            <p className="text-sm text-[#5B6478] mt-1">
              Curated assets vetted for liquidity, security, and long-term regulatory compliance.
            </p>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setSelectedAssetFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedAssetFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setSelectedAssetFilter('core')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedAssetFilter === 'core' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Core Assets
              </button>
              <button
                onClick={() => setSelectedAssetFilter('gainers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedAssetFilter === 'gainers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Top 24h
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E6E9F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Asset</th>
                  <th className="py-3.5 px-4 text-right">Price (USD)</th>
                  <th className="py-3.5 px-4 text-right">24h Change</th>
                  <th className="py-3.5 px-4 text-right hidden sm:table-cell">24h Volume</th>
                  <th className="py-3.5 px-4 text-right hidden md:table-cell">Market Cap</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <CoinIcon symbol={asset.symbol} size={30} />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{asset.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{asset.symbol}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {formatUSD(asset.price)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`inline-block font-semibold px-2 py-0.5 rounded text-xs ${
                          asset.change24h >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {formatPercent(asset.change24h)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600 hidden sm:table-cell tabular-nums">
                      {asset.volume24h}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600 hidden md:table-cell tabular-nums">
                      {asset.marketCap}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/signin"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>Trade</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. SECURITY & CUSTODY ARCHITECTURE */}
      <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Zero-Trust Custody</div>
          <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">Institutional defense in depth</h2>
          <p className="text-sm text-[#5B6478] mt-2">
            Retirement assets require protections that outlast market cycles. We partner with regulated trust companies to deliver segregated protection.
          </p>
        </div>

        {/* 6 Security Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Managed identity & passkeys</h3>
            <p className="text-xs text-[#5B6478] leading-relaxed">
              FIDO2 WebAuthn cryptographic authentication. Biometric Touch ID/Face ID and hardware YubiKeys eliminate credential stuffing and SIM-swaps.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Step-up verification</h3>
            <p className="text-xs text-[#5B6478] leading-relaxed">
              Mandatory secondary cryptographic challenges on all sales, withdrawals, and beneficiary modifications. No single compromised session can drain assets.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Server-side authorization</h3>
            <p className="text-xs text-[#5B6478] leading-relaxed">
              Every trade and fund movement is authorized against cryptographic custody policies and SEC/FINRA retirement account contribution limits.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Append-only audit logs</h3>
            <p className="text-xs text-[#5B6478] leading-relaxed">
              Cryptographically chained, immutable audit trails recording all operator actions, user authentications, and custodian settlements.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Encrypted secrets vault</h3>
            <p className="text-xs text-[#5B6478] leading-relaxed">
              Hardware Security Modules (HSMs) with multi-party computation (MPC) ensure raw private keys never exist in memory or single servers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Independent penetration testing</h3>
            <p className="text-xs text-[#5B6478] leading-relaxed">
              Annual external audits and continuous automated probers validating invariants across ledger balances and cold custody reserves.
            </p>
          </div>
        </div>

        {/* Illustrated Architecture Diagram in SVG */}
        <div className="bg-white rounded-2xl border border-[#E6E9F0] p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Custody Pipeline</span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">Segregated Custody Flow</h4>
          </div>

          <div className="w-full overflow-x-auto py-4">
            <div className="min-w-[680px] flex items-center justify-between relative px-6">
              {/* Box 1: Customer */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-200 w-44">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">
                  YOU
                </div>
                <div className="font-bold text-slate-900 text-xs">Verified Account Owner</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Passkey Authorized</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-2">
                <span className="text-[10px] font-mono text-indigo-600 font-semibold">TLS 1.3 / Signed</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                  <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-purple-500" />
                </div>
              </div>

              {/* Box 2: Northvault Portal */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 w-48 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  NV
                </div>
                <div className="font-bold text-indigo-950 text-xs">Northvault Portal & Engine</div>
                <div className="text-[10px] text-indigo-700 font-mono mt-0.5">Zero-Trust Authorization</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-2">
                <span className="text-[10px] font-mono text-purple-600 font-semibold">FIX Protocol / ECN</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-teal-500 relative">
                  <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-teal-500" />
                </div>
              </div>

              {/* Box 3: Regulated Custodian */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-teal-50/70 border border-teal-200 w-52 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  TRUST
                </div>
                <div className="font-bold text-teal-950 text-xs">Fortis Qualified Custody Trust</div>
                <div className="text-[10px] text-teal-700 font-mono mt-0.5">Segregated Cold Vaults (1:1)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. IRA TYPES COMPARISON (Traditional vs Roth vs SEP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Tax Structure</div>
          <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">Compare IRA Account Types</h2>
          <p className="text-sm text-[#5B6478] mt-2">
            Select the tax advantage that best fits your retirement time horizon and financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Traditional IRA */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-xs font-mono">
                TRADITIONAL IRA
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tax-Deferred Growth</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                Contributions may be tax-deductible today. Investments compound without capital gains taxes until retirement age.
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">2026 Limit</span>
                  <span className="font-mono font-bold text-slate-900">$7,000 ($8,000 age 50+)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Upfront Tax Break</span>
                  <span className="font-semibold text-emerald-600">Yes (income limits apply)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Capital Gains Tax</span>
                  <span className="font-semibold text-emerald-600">0% while in account</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Rollover Allowed</span>
                  <span className="font-semibold text-slate-900">401(k), 403(b), IRA</span>
                </div>
              </div>
            </div>

            <Link
              to="/apply"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Open Traditional IRA
            </Link>
          </div>

          {/* Roth IRA (Featured) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-indigo-600 shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-semibold text-[10px] uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 rounded bg-purple-50 text-purple-700 font-bold text-xs font-mono">
                ROTH IRA
              </div>
              <h3 className="text-xl font-bold text-slate-900">100% Tax-Free Compound</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                Contribute after-tax dollars. All future capital gains and retirement distributions are completely tax-free forever.
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">2026 Limit</span>
                  <span className="font-mono font-bold text-slate-900">$7,000 ($8,000 age 50+)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Retirement Taxes</span>
                  <span className="font-semibold text-emerald-600">$0 (100% Tax-Free)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Required Minimums (RMDs)</span>
                  <span className="font-semibold text-emerald-600">None during lifetime</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Rollover Allowed</span>
                  <span className="font-semibold text-slate-900">Roth 401(k), Roth IRA</span>
                </div>
              </div>
            </div>

            <Link
              to="/apply"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all"
            >
              Open Roth IRA
            </Link>
          </div>

          {/* SEP IRA */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E9F0] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 rounded bg-teal-50 text-teal-700 font-bold text-xs font-mono">
                SEP IRA
              </div>
              <h3 className="text-xl font-bold text-slate-900">Self-Employed & Small Biz</h3>
              <p className="text-xs text-[#5B6478] leading-relaxed">
                High contribution limits for business owners, contractors, and 1099 consultants looking to maximize crypto allocation.
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">2026 Limit</span>
                  <span className="font-mono font-bold text-slate-900">Up to $69,000 (25% comp)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Employer Deduction</span>
                  <span className="font-semibold text-emerald-600">100% Tax Deductible</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Eligibility</span>
                  <span className="font-semibold text-slate-900">Self-employed / LLC / S-Corp</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Setup Complexity</span>
                  <span className="font-semibold text-slate-900">Standard 5305-SEP form</span>
                </div>
              </div>
            </div>

            <Link
              to="/apply"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Open SEP IRA
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Transparent Pricing</div>
          <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">Institutional fee schedule</h2>
          <p className="text-sm text-[#5B6478] mt-2">
            No hidden spreads, zero account opening fees, and predictable cold custody safeguarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm text-center space-y-3">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase">Trading Execution</span>
            <div className="text-3xl font-bold font-mono text-slate-900">0.20%</div>
            <p className="text-xs text-slate-500">Per trade executed on institutional ECN. Zero spread markup.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-indigo-600 shadow-md text-center space-y-3 bg-indigo-50/20">
            <span className="text-xs font-mono font-semibold text-indigo-600 uppercase">Cold Custody Safeguard</span>
            <div className="text-3xl font-bold font-mono text-slate-900">0.25%</div>
            <p className="text-xs text-slate-500">Annual custody safeguarding fee billed monthly ($25 min).</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm text-center space-y-3">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase">IRS Compliance Reporting</span>
            <div className="text-3xl font-bold font-mono text-slate-900">$0</div>
            <p className="text-xs text-slate-500">Included free: Annual Form 5498 & Form 1099-R electronic filings.</p>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (3 realistic customers with photo URLs + fallbacks) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Client Experience</div>
          <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">Trusted by disciplined investors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Moving $140k from a stale legacy 401(k) to Northvault was completely painless. The direct rollover was tracked step-by-step, and knowing assets are in segregated South Dakota trust custody gives me total peace of mind."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Katherine Reynolds"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover bg-slate-200"
              />
              <div>
                <div className="font-bold text-slate-900 text-xs">Katherine Reynolds</div>
                <div className="text-[10px] text-slate-400">Roth IRA · Rollover from Fidelity</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "I run a boutique software agency and established a SEP IRA with Northvault. Being able to contribute up to 25% of compensation into Bitcoin with zero corporate taxable friction is the biggest financial unlock of my career."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="David Sterling"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover bg-slate-200"
              />
              <div>
                <div className="font-bold text-slate-900 text-xs">David Sterling</div>
                <div className="text-[10px] text-slate-400">SEP IRA · Founder, Sterling Tech</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The security architecture is what convinced me. Passkey verification for every trade and transfer, clear audit trails, and no lending or rehypothecation. It feels like private banking built for the modern era."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Julian Vance"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover bg-slate-200"
              />
              <div>
                <div className="font-bold text-slate-900 text-xs">Julian Vance</div>
                <div className="text-[10px] text-slate-400">Traditional IRA · Private Client</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION (8 questions) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Clarifications</div>
          <h2 className="text-3xl font-extrabold text-[#0B1530] tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E6E9F0] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#5B6478] leading-relaxed border-t border-slate-50 pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CTA BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold tracking-wider">
              2026 TAX YEAR OPEN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start building your tax-advantaged digital wealth today.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Open your self-directed crypto IRA in minutes. Transfer from an existing account or fund with a direct contribution.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/apply"
                className="px-6 py-3.5 rounded-xl text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 shadow-lg active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Open an IRA Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/signin"
                className="px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-[0.98] transition-all"
              >
                Existing Client Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
