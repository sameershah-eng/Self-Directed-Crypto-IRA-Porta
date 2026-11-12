import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { SUPPORTED_ASSETS, DEMO_ACCOUNTS } from '../../data/mockData';
import { AssetSymbol, OrderSide } from '../../types';
import { formatUSD, formatCryptoQty } from '../../lib/utils';
import { CoinIcon } from '../../components/common/CoinIcon';
import { StepUpModal } from '../../components/common/StepUpModal';
import { useToast } from '../../components/common/ToastContext';

export const TradePage: React.FC = () => {
  const { selectedAccountId } = useOutletContext<{ selectedAccountId: string }>();
  const { showToast } = useToast();

  const [side, setSide] = useState<OrderSide>('BUY');
  const [selectedSymbol, setSelectedSymbol] = useState<AssetSymbol>('BTC');
  const [inputMode, setInputMode] = useState<'USD' | 'UNITS'>('USD');
  const [amountUSD, setAmountUSD] = useState<string>('5000');
  const [orderStage, setOrderStage] = useState<'FORM' | 'REVIEW' | 'SUCCESS'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  const selectedAsset = SUPPORTED_ASSETS.find((a) => a.symbol === selectedSymbol) || SUPPORTED_ASSETS[0];

  const parsedUSD = Number(amountUSD) || 0;
  const estimatedUnits = selectedAsset.price > 0 ? parsedUSD / selectedAsset.price : 0;
  const tradingFee = parsedUSD * 0.002; // 0.20%
  const totalCost = side === 'BUY' ? parsedUSD + tradingFee : parsedUSD - tradingFee;

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedUSD <= 0) {
      showToast({ title: 'Invalid Amount', description: 'Please enter a valid dollar amount.', type: 'warning' });
      return;
    }
    setOrderStage('REVIEW');
  };

  const handleConfirmOrder = () => {
    // If it's a SELL order, SEC / FINRA custody rules mandate step-up verification!
    if (side === 'SELL') {
      setIsStepUpOpen(true);
      return;
    }
    executeFinalOrder();
  };

  const executeFinalOrder = () => {
    setIsSubmitting(true);
    const mockId = `NV-ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setCreatedOrderId(mockId);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderStage('SUCCESS');
      showToast({
        title: 'Order Executed & Settling',
        description: `Order ${mockId} filled on institutional venue.`,
        type: 'success',
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Trading Desk</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute digital asset market orders settled directly inside your qualified self-directed IRA custody trust.
        </p>
      </div>

      {/* Main Trade Card */}
      <div className="bg-white rounded-3xl border border-[#E6E9F0] shadow-sm p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* STAGE 1: ORDER ENTRY FORM */}
          {orderStage === 'FORM' && (
            <motion.form
              key="stage-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleReviewOrder}
              className="space-y-6"
            >
              {/* Buy / Sell Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSide('BUY')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    side === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Buy Asset
                </button>
                <button
                  type="button"
                  onClick={() => setSide('SELL')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    side === 'SELL'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sell Asset (Step-Up Protected)
                </button>
              </div>

              {/* Asset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Digital Asset</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SUPPORTED_ASSETS.slice(0, 5).map((asset) => (
                    <button
                      key={asset.symbol}
                      type="button"
                      onClick={() => setSelectedSymbol(asset.symbol)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        selectedSymbol === asset.symbol
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CoinIcon symbol={asset.symbol} size={24} />
                      <div className="mt-2">
                        <div className="font-bold text-slate-900 text-xs">{asset.symbol}</div>
                        <div className="text-[10px] font-mono text-slate-500 tabular-nums">
                          {formatUSD(asset.price, 0)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Order Amount</label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Live Price: {formatUSD(selectedAsset.price)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-bold font-mono text-slate-400">$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={amountUSD}
                    onChange={(e) => setAmountUSD(e.target.value)}
                    required
                    className="w-full pl-9 pr-24 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                  <div className="absolute right-3 top-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-mono font-semibold">
                      USD
                    </span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 pt-1">
                  {['1000', '2500', '5000', '10000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountUSD(preset)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 hover:bg-slate-100"
                    >
                      ${Number(preset).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Estimation Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Estimated Quantity</span>
                  <span className="font-mono font-bold text-slate-900">
                    ≈ {formatCryptoQty(estimatedUnits, 6)} {selectedAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Trading Venue Execution Fee (0.20%)</span>
                  <span className="font-mono text-slate-700">{formatUSD(tradingFee)}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-200 pt-2 font-bold text-slate-900">
                  <span>Total Settlement Amount</span>
                  <span className="font-mono text-indigo-700">{formatUSD(totalCost)}</span>
                </div>
              </div>

              {/* Price Movement Notice */}
              <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-amber-50/50 border border-amber-200/50 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Market order note:</strong> Digital asset spot prices fluctuate continuously. Orders are matched against top-of-book institutional liquidity.
                </span>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 ${
                  side === 'BUY'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-rose-600 to-purple-600 shadow-rose-600/20'
                }`}
              >
                <span>Review {side} Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.form>
          )}

          {/* STAGE 2: REVIEW STEP CARD */}
          {orderStage === 'REVIEW' && (
            <motion.div
              key="stage-review"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-slate-100">
                <span className="text-[11px] font-mono font-semibold uppercase text-indigo-600">
                  Step 2 of 2: Verification
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Confirm Order Execution</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Order Action</span>
                  <span className={`font-bold font-mono ${side === 'BUY' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {side} {selectedAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Target Asset</span>
                  <span className="font-semibold text-slate-900">{selectedAsset.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Estimated Quantity</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCryptoQty(estimatedUnits)} {selectedAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Execution Price (Benchmark)</span>
                  <span className="font-mono text-slate-900">{formatUSD(selectedAsset.price)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Execution Fee</span>
                  <span className="font-mono text-slate-900">{formatUSD(tradingFee)}</span>
                </div>
                <div className="flex justify-between py-1 pt-1 font-bold text-sm text-slate-900">
                  <span>Total Settlement</span>
                  <span className="font-mono text-indigo-700">{formatUSD(totalCost)}</span>
                </div>
              </div>

              {side === 'SELL' && (
                <div className="flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-xl p-3.5">
                  <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Step-up challenge required:</strong> Sells require passkey biometric confirmation before venue release.
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOrderStage('FORM')}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Edit Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    side === 'BUY'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting to Custodian…</span>
                    </>
                  ) : (
                    <span>Confirm & Authorize {side}</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: ORDER SUCCESS & TIMELINE */}
          {orderStage === 'SUCCESS' && (
            <motion.div
              key="stage-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold uppercase bg-emerald-50 px-2.5 py-0.5 rounded">
                  ORDER FILLED & SETTLING
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">Order {createdOrderId}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Successfully matched on institutional venue and routed to Fortis Trust cold storage vault.
                </p>
              </div>

              {/* Order Status Timeline (4 steps) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Order Submitted</div>
                      <div className="text-[10px] text-slate-400 font-mono">Timestamp verified with client session</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Accepted by Venue ECN</div>
                      <div className="text-[10px] text-slate-400 font-mono">Matched against institutional order book</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Filled</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatCryptoQty(estimatedUnits)} {selectedAsset.symbol} @ {formatUSD(selectedAsset.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold animate-pulse">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-800">Settled by Trust Custodian</div>
                      <div className="text-[10px] text-emerald-600 font-mono">
                        Vault cold-storage allocation confirmed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderStage('FORM')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Place Another Order
                </button>
                <Link
                  to="/app/orders"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  View in Order History
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step-Up Modal for Sell Authorization */}
      <StepUpModal
        isOpen={isStepUpOpen}
        onClose={() => setIsStepUpOpen(false)}
        onSuccess={() => {
          setIsStepUpOpen(false);
          executeFinalOrder();
        }}
        title="Authorize Digital Asset Sale"
        actionDescription={`Sell ${formatCryptoQty(estimatedUnits)} ${selectedAsset.symbol} from qualified IRA`}
        amount={formatUSD(parsedUSD)}
      />
    </div>
  );
};
