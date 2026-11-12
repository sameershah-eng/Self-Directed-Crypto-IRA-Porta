import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ORDERS_HISTORY } from '../../data/mockData';
import { OrderRecord, OrderStatus, OrderSide, AssetSymbol } from '../../types';
import { formatUSD, formatCryptoQty, formatDateTimeET } from '../../lib/utils';
import { CoinIcon } from '../../components/common/CoinIcon';
import { useToast } from '../../components/common/ToastContext';

export const OrdersPage: React.FC = () => {
  const { selectedAccountId } = useOutletContext<{ selectedAccountId: string }>();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sideFilter, setSideFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = ORDERS_HISTORY.filter((order) => {
    if (selectedAccountId !== 'all' && order.accountId !== selectedAccountId) return false;
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    if (sideFilter !== 'ALL' && order.side !== sideFilter) return false;
    if (
      search &&
      !order.id.toLowerCase().includes(search.toLowerCase()) &&
      !order.asset.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Executions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of digital asset market transactions and custodian settlement records.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order ID (e.g. NV-ORD)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E6E9F0]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Status:</span>
          {(['ALL', 'Filled', 'Pending', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Side:</span>
          {(['ALL', 'BUY', 'SELL'] as const).map((sd) => (
            <button
              key={sd}
              onClick={() => setSideFilter(sd)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                sideFilter === sd ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sd}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-[#E6E9F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-4">Date & Time (ET)</th>
                <th className="py-3.5 px-4">Side</th>
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-4 text-right">Quantity</th>
                <th className="py-3.5 px-4 text-right">Executed Price</th>
                <th className="py-3.5 px-4 text-right">Total Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isBuy = order.side === 'BUY';
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                        {formatDateTimeET(order.timestamp)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            isBuy ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {order.side}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <CoinIcon symbol={order.asset} size={20} />
                        <span className="font-bold text-slate-900">{order.asset}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-medium text-slate-800 tabular-nums">
                        {formatCryptoQty(order.quantity)} {order.asset}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-700 tabular-nums">
                        {formatUSD(order.executedPrice)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatUSD(order.totalValue)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            order.status === 'Filled'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-50 px-2.5 py-1 rounded-md"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Execution Receipt</span>
                  <h3 className="text-lg font-bold font-mono text-slate-900 mt-0.5">{selectedOrder.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Asset & Side</span>
                  <span className="font-bold font-mono text-slate-900">
                    {selectedOrder.side} {selectedOrder.asset}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Executed Quantity</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {formatCryptoQty(selectedOrder.quantity)} {selectedOrder.asset}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Execution Price</span>
                  <span className="font-mono text-slate-900">{formatUSD(selectedOrder.executedPrice)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Notional</span>
                  <span className="font-mono font-bold text-slate-900">{formatUSD(selectedOrder.totalValue)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Venue Execution Fee</span>
                  <span className="font-mono text-slate-900">{formatUSD(selectedOrder.fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-200 pt-2 font-medium">
                  <span className="text-slate-500">Custody Settlement Hash</span>
                  <span className="font-mono text-indigo-700 text-[11px]">{selectedOrder.settlementHash}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Settlement Timeline</h4>
                <div className="space-y-2 text-xs border-l-2 border-emerald-500 pl-3">
                  <div>
                    <div className="font-semibold text-slate-900">1. Order Executed on {selectedOrder.venue}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatDateTimeET(selectedOrder.timestamp)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">2. Fortis Custody Segregated Vault Credit</div>
                    <div className="text-[10px] text-slate-400 font-mono">1:1 Cold-Storage Settlement Complete</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  showToast({ title: 'Receipt Downloaded', description: `PDF statement for ${selectedOrder.id} saved.` });
                }}
                className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Download Execution PDF
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
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
