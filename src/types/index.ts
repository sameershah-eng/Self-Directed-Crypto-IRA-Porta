export type AssetSymbol =
  | 'BTC'
  | 'ETH'
  | 'SOL'
  | 'USDC'
  | 'AVAX'
  | 'LINK'
  | 'LTC'
  | 'XRP'
  | 'DOT'
  | 'ADA';

export interface CryptoAsset {
  symbol: AssetSymbol;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  sparkline: number[];
  color: string;
  description: string;
}

export interface PortfolioHolding {
  symbol: AssetSymbol;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocationPercent: number;
  color: string;
}

export interface IRAAccount {
  id: string;
  type: 'Traditional IRA' | 'Roth IRA' | 'SEP IRA';
  accountNumber: string;
  custodian: string;
  status: 'Active' | 'Pending Funding' | 'Restricted';
  totalValue: number;
  cashBalance: number;
  cryptoValue: number;
  dayChangeDollar: number;
  dayChangePercent: number;
  openedDate: string;
  contributionLimit2026: number;
  contributed2026: number;
  holdings: PortfolioHolding[];
}

export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'Filled' | 'Pending' | 'Partially filled' | 'Cancelled' | 'Rejected';

export interface OrderRecord {
  id: string;
  accountId: string;
  timestamp: string;
  asset: AssetSymbol;
  side: OrderSide;
  quantity: number;
  executedPrice: number;
  totalValue: number;
  status: OrderStatus;
  fee: number;
  venue: string;
  settlementHash: string;
  stepUpVerified?: boolean;
}

export type ActivityCategory =
  | 'TRADE'
  | 'CONTRIBUTION'
  | 'ROLLOVER'
  | 'CUSTODY_FEE'
  | 'DISTRIBUTION';

export interface ActivityRecord {
  id: string;
  accountId: string;
  timestamp: string;
  category: ActivityCategory;
  description: string;
  amount: number;
  asset?: AssetSymbol;
  quantity?: number;
  status: 'Completed' | 'Pending' | 'Processing';
  referenceId: string;
}

export interface StatementRecord {
  id: string;
  period: string;
  type: 'Monthly Statement' | 'Form 1099-R' | 'Form 5498' | 'Annual Summary';
  generatedDate: string;
  fileSize: string;
  taxYear?: string;
  downloadUrl: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  sharePercent: number;
  type: 'Primary' | 'Contingent';
  ssnMasked: string;
}

export interface PasskeyDevice {
  id: string;
  name: string;
  createdDate: string;
  lastUsedDate: string;
  type: 'Touch ID' | 'Face ID' | 'Hardware Security Key';
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: 'Verified' | 'Pending Review' | 'Flagged';
  accountStatus: 'Active' | 'Frozen' | 'Restricted';
  iraType: string;
  accountNumber: string;
  totalAUM: number;
  registeredDate: string;
  riskScore: 'Low' | 'Medium' | 'High';
  notes: string[];
}

export interface ReconciliationReport {
  runDate: string;
  status: 'Matched' | 'Mismatched';
  totalAccountsAudited: number;
  matchedCount: number;
  mismatchedCount: number;
  pendingSettlements: number;
  totalCustodyDifferenceUsd: number;
  items: {
    accountId: string;
    clientName: string;
    asset: AssetSymbol;
    ledgerBalance: number;
    custodianBalance: number;
    difference: number;
    status: 'Flagged' | 'Resolved' | 'Pending Review';
    note: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: 'System' | 'Customer' | 'Ops Agent' | 'Compliance Officer';
  action: string;
  target: string;
  ipAddress: string;
  result: 'Success' | 'Denied' | 'Warning';
}
