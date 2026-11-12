import { ActivityRecord } from '../types';

/**
 * Format currency in USD with Intl.NumberFormat
 */
export function formatUSD(amount: number, minimumFractionDigits = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(amount);
}

/**
 * Format cryptocurrency quantity
 */
export function formatCryptoQty(qty: number, maxDecimals = 6): string {
  if (qty === 0) return '0.00';
  if (qty >= 1000) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(qty);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(qty);
}

/**
 * Format percentage change
 */
export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Format standard ET timestamp: "Nov 12, 2026, 10:42 AM ET"
 */
export function formatDateTimeET(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  };
  return `${new Intl.DateTimeFormat('en-US', options).format(d)} ET`;
}

/**
 * Simple date format: "Nov 12, 2026"
 */
export function formatDate(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Seeded pseudo-random generator to ensure chart data is realistic and stable across renders
 */
export function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generate smooth random walk chart points for timeframes (1D, 1W, 1M, 3M, 1Y, ALL)
 */
export function generateChartData(
  startVal: number,
  points: number,
  volatility = 0.015,
  drift = 0.002,
  seed = 42
) {
  const rng = createSeededRandom(seed);
  const data: { label: string; value: number }[] = [];
  let current = startVal;

  for (let i = 0; i < points; i++) {
    const shock = (rng() - 0.48) * volatility;
    current = Math.max(current * 0.7, current * (1 + shock + drift));
    
    // Label format based on point count
    let label = `T-${points - i}`;
    if (points <= 24) {
      const hour = (9 + Math.floor(i * 0.5)) % 12 || 12;
      const ampm = i < 6 ? 'AM' : 'PM';
      label = `${hour}:00 ${ampm}`;
    } else if (points <= 30) {
      label = `Day ${i + 1}`;
    } else {
      label = `Wk ${Math.floor(i / 7) + 1}`;
    }

    data.push({
      label,
      value: Math.round(current * 100) / 100,
    });
  }

  return data;
}

/**
 * Generate and trigger download of CSV file from activity items
 */
export function exportActivityToCSV(records: ActivityRecord[], filename = 'Northvault-IRA-Activity-Ledger.csv') {
  const headers = ['Transaction ID', 'Date & Time (ET)', 'Account ID', 'Category', 'Description', 'Asset', 'Quantity', 'Amount (USD)', 'Status'];
  const rows = records.map((r) => [
    r.referenceId,
    formatDateTimeET(r.timestamp),
    r.accountId,
    r.category,
    `"${r.description.replace(/"/g, '""')}"`,
    r.asset || 'USD',
    r.quantity ? r.quantity.toString() : '',
    r.amount.toFixed(2),
    r.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Classnames joining helper
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
