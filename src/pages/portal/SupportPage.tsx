import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileQuestion,
  Headphones,
  CheckCircle2,
  Clock,
  Plus,
  Send,
} from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  createdDate: string;
  lastUpdate: string;
}

export const SupportPage: React.FC = () => {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Rollover & Transfer Status');
  const [ticketMessage, setTicketMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-8921',
      subject: 'Fidelity 401(k) Rollover Clearing Window',
      category: 'Rollovers',
      status: 'In Progress',
      createdDate: 'Nov 10, 2026',
      lastUpdate: '2 hours ago',
    },
    {
      id: 'TCK-8410',
      subject: 'YubiKey 5C NFC enrollment confirmation',
      category: 'Security',
      status: 'Resolved',
      createdDate: 'Oct 28, 2026',
      lastUpdate: 'Oct 29, 2026',
    },
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      status: 'Open',
      createdDate: 'Nov 12, 2026',
      lastUpdate: 'Just now',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setIsNewTicketOpen(false);
    setTicketSubject('');
    setTicketMessage('');

    showToast({
      title: 'Support Request Dispatched',
      description: `Ticket ${newTicket.id} assigned to private client team.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support & Concierge Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated private client support for account funding, rollovers, and custodian operations.
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Support Request</span>
        </button>
      </div>

      {/* Concierge Advisor Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6E9F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            SL
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Sarah Lin, CFP®</div>
            <div className="text-xs text-slate-500">Dedicated Private Client Advisor · Fortis Trust Team</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">Direct Desk: (415) 892-4190</span>
          <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Available</span>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Your Support Tickets</h3>
          <span className="text-xs text-slate-400 font-mono">{tickets.length} total</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {tickets.map((t) => (
            <div key={t.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{t.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-800">{t.subject}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Category: {t.category} · Opened: {t.createdDate} · Last reply: {t.lastUpdate}
                </div>
              </div>

              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  t.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Ticket */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsNewTicketOpen(false)}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Submit New Concierge Ticket</h3>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inquiry Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none"
                >
                  <option>Rollover & Transfer Status</option>
                  <option>Digital Asset Trading & ECN</option>
                  <option>Security & Passkeys (WebAuthn)</option>
                  <option>IRS Form 5498 & 1099-R Filing</option>
                  <option>Beneficiary Designation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Summary of request..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Details</label>
                <textarea
                  rows={4}
                  placeholder="Provide any relevant transaction IDs, dates or details..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
