import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  PieChart,
  ArrowLeftRight,
  ClipboardList,
  History,
  SendHorizontal,
  FileText,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { DemoBanner } from '../components/common/DemoBanner';
import { DEMO_ACCOUNTS, DEMO_USER, TOTAL_PORTFOLIO_VALUE } from '../data/mockData';
import { formatUSD } from '../lib/utils';
import { useToast } from '../components/common/ToastContext';

export const PortalLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Read-only session state when viewed from Back-Office
  const isReadOnly = location.search.includes('view_as=customer');

  const navItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { label: 'Portfolio', path: '/app/portfolio', icon: PieChart },
    { label: 'Trade', path: '/app/trade', icon: ArrowLeftRight },
    { label: 'Orders', path: '/app/orders', icon: ClipboardList },
    { label: 'Activity', path: '/app/activity', icon: History },
    { label: 'Transfers', path: '/app/transfers', icon: SendHorizontal },
    { label: 'Statements', path: '/app/statements', icon: FileText },
    { label: 'Settings', path: '/app/settings', icon: Settings },
    { label: 'Support', path: '/app/support', icon: HelpCircle },
  ];

  // 600ms skeleton transition when route changes in portal
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.id === selectedAccountId);

  const notifications = [
    {
      id: 'n1',
      title: 'Order Executed: Buy 0.2500 BTC',
      time: '12m ago',
      read: false,
      desc: 'Filled at $96,800.00 via Institutional ECN. Custodian settled.',
    },
    {
      id: 'n2',
      title: 'Monthly Statement Available',
      time: '2h ago',
      read: false,
      desc: 'October 2026 account statement is ready for review.',
    },
    {
      id: 'n3',
      title: 'Passkey Re-Authentication Successful',
      time: 'Yesterday',
      read: true,
      desc: 'Touch ID signature verified for account access.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-[#0B1530] flex flex-col font-sans">
      {/* Background Soft Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 right-10 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.05] blur-[100px]" />
        <div className="absolute top-[40%] -left-32 w-[450px] h-[450px] rounded-full bg-teal-500/[0.05] blur-[100px]" />
      </div>

      {/* Top Banner when viewing as customer */}
      <DemoBanner isReadOnly={isReadOnly} />

      <div className="flex-1 flex overflow-hidden z-10">
        {/* DESKTOP COLLAPSIBLE SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#E6E9F0] bg-white transition-all duration-300 relative z-20 shrink-0 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Header with Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <Link to="/app" className="flex items-center overflow-hidden">
              <Logo size={28} showWordmark={!isCollapsed} />
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Account Mini Badge */}
          {!isCollapsed && (
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Custody Status</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Fortis Trust Segregated Cold Storage</span>
              </div>
            </div>
          )}

          {/* Nav Items List */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/app'
                  ? location.pathname === '/app'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 relative z-10 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />
                  {!isCollapsed && <span className="relative z-10 truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Back-Office Switcher Footer Link */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <Link
              to="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Open Back-Office Operations Console"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              {!isCollapsed && <span>Back-Office Console</span>}
            </Link>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* STICKY TOP BAR */}
          <header className="h-16 sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[#E6E9F0] px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Account Selector Dropdown & Market Status */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">
                    {selectedAccountId === 'all'
                      ? 'All Accounts ($248,312.54)'
                      : `${selectedAccount?.type} (${selectedAccount?.accountNumber})`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    <button
                      onClick={() => {
                        setSelectedAccountId('all');
                        setIsAccountMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                        selectedAccountId === 'all'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">Combined Portfolio</div>
                        <div className="text-[11px] text-slate-500 font-mono">Traditional + Roth</div>
                      </div>
                      <span className="font-mono font-medium">{formatUSD(TOTAL_PORTFOLIO_VALUE)}</span>
                    </button>

                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccountId(acc.id);
                          setIsAccountMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between mt-1 ${
                          selectedAccountId === acc.id
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{acc.type}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{acc.accountNumber}</div>
                        </div>
                        <span className="font-mono font-medium">{formatUSD(acc.totalValue)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Venue ECN: Online</span>
              </div>
            </div>

            {/* Right: Search, Notifications & Profile Menu */}
            <div className="flex items-center gap-3">
              {/* Global Search Input */}
              <div className="hidden sm:flex items-center relative w-48 md:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search assets, txns, orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100/70 hover:bg-slate-100 focus:bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 text-xs">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-900">Notifications</span>
                      <button
                        onClick={() => {
                          showToast({ title: 'All notifications marked read' });
                          setIsNotificationsOpen(false);
                        }}
                        className="text-[11px] text-indigo-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="py-2 space-y-2">
                      {notifications.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{item.title}</span>
                            <span className="text-[10px] text-slate-400">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    MT
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-semibold text-slate-800 leading-none">Michael Turner</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Private Client</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-semibold text-slate-900">Michael Turner</div>
                      <div className="text-[11px] text-slate-500 truncate">{DEMO_USER.email}</div>
                    </div>
                    <Link
                      to="/app/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Security & Beneficiaries</span>
                    </Link>
                    <Link
                      to="/app/statements"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Tax Documents (1099-R / 5498)</span>
                    </Link>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          showToast({ title: 'Signed out securely' });
                          navigate('/signin');
                        }}
                        className="w-full px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER WITH 600ms SKELETON TRANSITION */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
            <AnimatePresence mode="wait">
              {isPageLoading ? (
                <motion.div
                  key="skeleton-portal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-6 w-48 rounded bg-slate-200 animate-shimmer" />
                      <div className="h-4 w-72 rounded bg-slate-100 animate-shimmer" />
                    </div>
                    <div className="h-9 w-32 rounded-xl bg-slate-200 animate-shimmer" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="h-32 rounded-2xl bg-slate-200 animate-shimmer" />
                    <div className="h-32 rounded-2xl bg-slate-200 animate-shimmer" />
                    <div className="h-32 rounded-2xl bg-slate-200 animate-shimmer" />
                  </div>
                  <div className="h-72 rounded-2xl bg-slate-200 animate-shimmer" />
                </motion.div>
              ) : (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Outlet context={{ selectedAccountId }} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around">
        <Link
          to="/app"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname === '/app' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/app/portfolio"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/app/portfolio') ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span>Portfolio</span>
        </Link>
        <Link
          to="/app/trade"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/app/trade') ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center -mt-3 shadow-md">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span>Trade</span>
        </Link>
        <Link
          to="/app/activity"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/app/activity') ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Activity</span>
        </Link>
        <button
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            isMobileMoreOpen ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile More Drawer Sheet */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMoreOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 bg-white rounded-t-2xl p-5 shadow-2xl border-t border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-900 text-sm">More Navigation</span>
                <button
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/app/orders"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5 font-medium text-slate-800"
                >
                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/app/transfers"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5 font-medium text-slate-800"
                >
                  <SendHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>Transfers & Wire</span>
                </Link>
                <Link
                  to="/app/statements"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5 font-medium text-slate-800"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Tax & Statements</span>
                </Link>
                <Link
                  to="/app/settings"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5 font-medium text-slate-800"
                >
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <span>Settings & Passkeys</span>
                </Link>
                <Link
                  to="/app/support"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5 font-medium text-slate-800"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Support</span>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-3 rounded-xl bg-amber-50 flex items-center gap-2.5 font-medium text-amber-900 border border-amber-200"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Back-Office</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
