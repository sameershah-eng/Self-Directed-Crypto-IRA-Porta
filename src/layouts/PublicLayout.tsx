import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { DemoBanner } from '../components/common/DemoBanner';

export const PublicLayout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Assets', href: '#assets' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (currentY / totalScroll) * 100 : 0;
      setScrollProgress(progress);

      // Scrolled past 24px
      setIsScrolled(currentY > 24);

      // Hide on fast scroll down, show on scroll up
      if (currentY > lastScrollY && currentY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FB] text-[#0B1530] relative overflow-x-hidden">
      {/* Background Ambient Gradient Blobs (8-12% opacity) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.08] blur-[120px]" />
        <div className="absolute top-[25%] -right-40 w-[650px] h-[650px] rounded-full bg-purple-500/[0.08] blur-[140px]" />
        <div className="absolute top-[65%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-500/[0.08] blur-[130px]" />
      </div>

      {/* Sticky Top Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'h-16 glass-nav bg-white/75 backdrop-blur-md border-b border-[#E6E9F0]'
            : 'h-20 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
            <Logo size={isScrolled ? 30 : 34} />
          </Link>

          {/* Zone 2: Navigation Links with Animated Underline */}
          <nav
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredNav(link.label)}
                className="relative px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
                {hoveredNav === link.label && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to="/signin"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-all whitespace-nowrap shrink-0"
            >
              Sign in
            </Link>
            <Link
              to="/apply"
              className="relative group px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:opacity-95 shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Open an IRA</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/signin"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg"
            >
              Sign in
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Slide-in Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <Link
                  to="/apply"
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 shadow-md shadow-indigo-600/20"
                >
                  Open a Self-Directed IRA
                </Link>
                <Link
                  to="/signin"
                  className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Sign in to Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Slot */}
      <main className="flex-1 z-10 pt-20">
        <Outlet />
      </main>

      {/* Comprehensive Institutional Fintech Footer */}
      <footer className="z-10 bg-white border-t border-slate-200 mt-20 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
            {/* Col 1: Brand & Custody */}
            <div className="md:col-span-2 space-y-4">
              <Logo size={32} />
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Retirement, held in digital assets. Secured like it matters. Self-directed Traditional, Roth, and SEP IRAs custodied in bankruptcy-remote institutional cold storage by state-chartered trust partners.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Qualified Trust Custodian Partner: Fortis Custody Trust, LLC</span>
              </div>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Products</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/apply" className="hover:text-slate-900 transition-colors">Traditional Crypto IRA</Link></li>
                <li><Link to="/apply" className="hover:text-slate-900 transition-colors">Roth Crypto IRA</Link></li>
                <li><Link to="/apply" className="hover:text-slate-900 transition-colors">SEP Crypto IRA</Link></li>
                <li><a href="#how-it-works" className="hover:text-slate-900 transition-colors">401(k) Direct Rollover</a></li>
                <li><a href="#assets" className="hover:text-slate-900 transition-colors">Supported Digital Assets</a></li>
              </ul>
            </div>

            {/* Col 3: Institutional Security */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Security & Custody</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#security" className="hover:text-slate-900 transition-colors">Cold Storage Architecture</a></li>
                <li><a href="#security" className="hover:text-slate-900 transition-colors">FIDO2 WebAuthn & MFA</a></li>
                <li><a href="#security" className="hover:text-slate-900 transition-colors">SOC 2 Type II Compliance</a></li>
                <li><a href="#security" className="hover:text-slate-900 transition-colors">Append-Only Audit Logs</a></li>
                <li><a href="#security" className="hover:text-slate-900 transition-colors">Step-Up Verification</a></li>
              </ul>
            </div>

            {/* Col 4: Platform & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Portal</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/signin" className="hover:text-slate-900 transition-colors">Client Portal Sign In</Link></li>
                <li><Link to="/app" className="hover:text-slate-900 transition-colors">Portfolio Overview</Link></li>
                <li><Link to="/admin" className="hover:text-slate-900 transition-colors">Back-Office Operations</Link></li>
                <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Fee Schedule</a></li>
                <li><a href="#faq" className="hover:text-slate-900 transition-colors">Tax & IRA FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimers & Regulatory Notices */}
          <div className="pt-8 space-y-4 text-[11px] text-slate-400 leading-relaxed">
            <p>
              <strong>Important Disclosures:</strong> Self-directed individual retirement accounts (IRAs) holding digital assets involve significant risk, including market volatility and potential loss of principal. Digital assets are not legal tender, are not backed by the Federal Reserve, and are NOT FDIC insured. Cash balances awaiting investment or distribution are held in omnibus deposit accounts at FDIC-insured partner banks up to legal limits.
            </p>
            <p>
              Digital assets in your Northvault IRA are custodied by Fortis Qualified Custody Trust, LLC, a state-chartered trust company regulated by the South Dakota Division of Banking. Northvault Technologies, Inc. is an administrative software and technology service provider, not a bank, broker-dealer, or qualified custodian. Northvault does not provide tax, legal, or investment advice. Consult a licensed financial advisor or CPA regarding your tax situation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-slate-500">
              <p>© 2026 Northvault Technologies, Inc. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#faq" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                <span>·</span>
                <a href="#faq" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                <span>·</span>
                <a href="#faq" className="hover:text-slate-900 transition-colors">Custody Agreement</a>
                <span>·</span>
                <a href="#faq" className="hover:text-slate-900 transition-colors">Form 5498 & 1099-R Guide</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Persistent Demo Pill */}
      <DemoBanner />
    </div>
  );
};
