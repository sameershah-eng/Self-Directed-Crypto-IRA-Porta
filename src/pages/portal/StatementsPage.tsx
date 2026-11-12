import React from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { STATEMENTS_DATA } from '../../data/mockData';
import { useToast } from '../../components/common/ToastContext';

export const StatementsPage: React.FC = () => {
  const { showToast } = useToast();

  const handleDownload = (statementName: string) => {
    showToast({
      title: 'Downloading Statement',
      description: `${statementName} generated and signed with custodian seal.`,
      type: 'success',
    });
  };

  const monthlyStatements = STATEMENTS_DATA.filter((s) => s.type === 'Monthly Statement' || s.type === 'Annual Summary');
  const taxDocuments = STATEMENTS_DATA.filter((s) => s.type === 'Form 1099-R' || s.type === 'Form 5498');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Statements & Tax Documents</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official South Dakota trust statements and IRS annual tax filings for digital asset self-directed IRAs.
        </p>
      </div>

      {/* IRS Tax Forms Box */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E9F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Official IRS Tax Filings</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">IRS Form 5498 & 1099-R</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Because trades within a self-directed crypto IRA are not taxable events, individual capital gains are not reported on Schedule D. Form 5498 reports your annual contributions to the IRS.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {taxDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{doc.type} ({doc.period})</div>
                  <div className="text-[10px] text-slate-400 font-mono">Issued: {doc.generatedDate} · {doc.fileSize}</div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(`${doc.type} ${doc.period}`)}
                className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
                title="Download IRS Tax PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Statements Table */}
      <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Monthly Custodial Statements</h3>
          <span className="text-xs text-slate-400 font-mono">PDF Archive</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {monthlyStatements.map((stmt) => (
            <div
              key={stmt.id}
              className="px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">
                    {stmt.period} — {stmt.type}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Generated: {stmt.generatedDate} · Size: {stmt.fileSize}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(stmt.period)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
