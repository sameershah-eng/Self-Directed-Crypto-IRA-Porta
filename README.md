# Northvault IRA — Self-Directed Crypto IRA Customer Portal

A production-quality frontend demonstration of a U.S. fintech self-directed crypto IRA customer portal, designed for high-net-worth investors and institutional custody partners.

## Key Features

- **Brand & Visuals**: Light gradient theme (#F7F8FB canvas with subtle indigo/purple/teal gradient blobs, deep navy `#0B1530`, slate `#5B6478`, and subtle gold `#C9A227` accents).
- **Public Experience**: 
  - Elite hero with an interactive in-code portfolio mockup ($248,312.54 total value, +12.4% YTD area chart, orbiting floating action cards).
  - Horizontally auto-scrolling live market ticker (10 crypto assets with custom vector coin marks).
  - 4-step custody process flow with connecting lines.
  - Interactive supported assets roster with 24h gainers and core asset filters.
  - Institutional security breakdown and illustrated South Dakota trust custody architecture diagram.
  - Traditional vs. Roth vs. SEP IRA comparative matrix.
  - Transparent fee schedule, verified customer testimonials, and comprehensive FAQ accordion.
- **Authentication**: Split-layout sign-in with email/password, 6-digit auto-advancing OTP, and hardware passkey (FIDO2 Touch ID / Face ID) biometric simulation.
- **Customer Portal**:
  - Multi-account switcher (Traditional IRA •••• 4821 / Roth IRA •••• 9310 / Consolidated portfolio).
  - Animated count-up balances and 1D/1W/1M/3M/1Y/ALL area charts.
  - Asset allocation donut and holdings breakdown.
  - 2026 federal IRA contribution room tracker ($7,000 / $8,000 limit).
  - Holdings table with sorting, search, and asset detail drawer.
  - Trading desk with buy/sell toggle, live estimations, order review card, step-up verification for sells, and 4-stage settlement timeline.
  - Complete order history with execution hashes.
  - Activity ledger with working client-side CSV download.
  - Domestic wire deposit instructions with copy buttons, rollover request tracker, and step-up protected withdrawals.
  - Official IRS tax documents (Form 5498 & Form 1099-R) and monthly PDF statements.
  - Security center with FIDO2 passkeys, session revocation, and beneficiary designations.
  - Concierge support ticketing system.
- **Account Application**: 5-step onboarding flow with automated document verification and HTML5 canvas signature pad.
- **Back-Office Operations Console (`/admin`)**:
  - 25 client accounts with KYC status, risk scores, and account freezing toggles.
  - "View as customer" read-only session launcher.
  - Global Emergency Trading Kill Switch.
  - Nightly custody reconciliation report with discrepancy flags.
  - Cryptographically chained audit logs with role filtering.

## Deploying to Vercel

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Deploy to Vercel
npx vercel deploy --prod
```

Routing rewrites are pre-configured in `vercel.json` for single-page application routing.
