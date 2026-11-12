import React from 'react';
import { AssetSymbol } from '../../types';

interface CoinIconProps {
  symbol: AssetSymbol | string;
  size?: number;
  className?: string;
}

export const CoinIcon: React.FC<CoinIconProps> = ({ symbol, size = 32, className = '' }) => {
  const s = symbol.toUpperCase();

  const renderIcon = () => {
    switch (s) {
      case 'BTC':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#F7931A" />
            <path
              d="M21.5 13.8C21.8 12 20.7 11 18.8 10.6L19.2 8.8L18.1 8.5L17.7 10.3C17.4 10.2 17.1 10.1 16.8 10.1L17.2 8.3L16.1 8L15.7 9.8C15.4 9.7 15.2 9.7 15 9.6L13.5 9.2L13.2 10.4C13.2 10.4 14 10.6 14 10.6C14.4 10.7 14.5 11 14.4 11.3L13.2 16.1L12.4 15.9L12 17.1L13.4 17.5C13.6 17.5 13.9 17.6 14.1 17.7L13.7 19.5L14.8 19.8L15.2 18C15.5 18.1 15.8 18.2 16.1 18.2L15.7 20L16.8 20.3L17.2 18.5C19.1 18.9 20.5 18.4 20.9 16.6C21.2 15.2 20.7 14.4 19.7 13.9C20.4 13.7 21 13.1 21.5 13.8ZM18.7 16.3C18.3 17.8 15.9 17 15.2 16.8L15.8 14.4C16.5 14.6 19.1 14.8 18.7 16.3ZM19.1 13.1C18.7 14.5 16.7 13.8 16.1 13.7L16.7 11.5C17.3 11.6 19.5 11.8 19.1 13.1Z"
              fill="white"
            />
          </svg>
        );

      case 'ETH':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#627EEA" />
            <path d="M16 5V13.8L22.5 16.7L16 5Z" fill="white" fillOpacity="0.75" />
            <path d="M16 5L9.5 16.7L16 13.8V5Z" fill="white" />
            <path d="M16 19.8V26.9L22.5 18L16 19.8Z" fill="white" fillOpacity="0.75" />
            <path d="M16 26.9V19.8L9.5 18L16 26.9Z" fill="white" />
            <path d="M16 18.6L22.5 15.7L16 12.8V18.6Z" fill="white" fillOpacity="0.5" />
            <path d="M9.5 15.7L16 18.6V12.8L9.5 15.7Z" fill="white" fillOpacity="0.85" />
          </svg>
        );

      case 'SOL':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#14F195" />
            <path
              d="M9.5 21.6C9.6 21.5 9.8 21.4 10 21.4H21.5C21.8 21.4 22 21.7 21.9 21.9L20.8 23.3C20.7 23.4 20.5 23.5 20.3 23.5H8.8C8.5 23.5 8.3 23.2 8.4 23L9.5 21.6Z"
              fill="#0E1E2C"
            />
            <path
              d="M9.5 9.4C9.6 9.3 9.8 9.2 10 9.2H21.5C21.8 9.2 22 9.5 21.9 9.7L20.8 11.1C20.7 11.2 20.5 11.3 20.3 11.3H8.8C8.5 11.3 8.3 11 8.4 10.8L9.5 9.4Z"
              fill="#0E1E2C"
            />
            <path
              d="M20.8 15.5C20.7 15.4 20.5 15.3 20.3 15.3H8.8C8.5 15.3 8.3 15.6 8.4 15.8L9.5 17.2C9.6 17.3 9.8 17.4 10 17.4H21.5C21.8 17.4 22 17.1 21.9 16.9L20.8 15.5Z"
              fill="#0E1E2C"
            />
          </svg>
        );

      case 'USDC':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#2775CA" />
            <path
              d="M17.5 14.5C17.5 13.7 16.9 13.2 15.8 13.2H14V15.8H15.8C16.9 15.8 17.5 15.3 17.5 14.5ZM14 17.5V20.2H16C17.2 20.2 17.8 19.6 17.8 18.8C17.8 18 17.2 17.5 16 17.5H14Z"
              fill="white"
            />
            <path
              d="M16 6C10.5 6 6 10.5 6 16C6 21.5 10.5 26 16 26C21.5 26 26 21.5 26 16C26 10.5 21.5 6 16 6ZM18 20.6C18 21.9 16.8 22.8 15.2 22.8H12V10.6H15.1C16.6 10.6 17.7 11.5 17.7 12.7C17.7 13.5 17.3 14.2 16.5 14.5C17.5 14.9 18 15.7 18 16.8V20.6Z"
              fill="white"
            />
          </svg>
        );

      case 'AVAX':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#E84142" />
            <path
              d="M16 8L22.5 22H18.5L16 16.5L13.5 22H9.5L16 8Z"
              fill="white"
            />
          </svg>
        );

      case 'LINK':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#375BD2" />
            <path
              d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8ZM16 11L12.5 13V17L16 19L19.5 17V13L16 11Z"
              fill="white"
            />
          </svg>
        );

      case 'LTC':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#345D9D" />
            <path
              d="M13.5 8H16.5L14.8 14H18.5L18 16.5H14.1L12.5 23H20V25H10.5L13.5 8Z"
              fill="white"
            />
          </svg>
        );

      case 'XRP':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#23292F" />
            <path
              d="M21.5 9H23.5L17.5 15L23.5 21H21.5L16 15.5L10.5 21H8.5L14.5 15L8.5 9H10.5L16 14.5L21.5 9Z"
              fill="white"
            />
          </svg>
        );

      case 'DOT':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#E6007A" />
            <circle cx="16" cy="12" r="4" fill="white" />
            <circle cx="16" cy="21" r="2.5" fill="white" />
          </svg>
        );

      case 'ADA':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <circle cx="16" cy="16" r="16" fill="#0033AD" />
            <circle cx="16" cy="16" r="3" fill="white" />
            <circle cx="16" cy="9" r="1.5" fill="white" />
            <circle cx="16" cy="23" r="1.5" fill="white" />
            <circle cx="9" cy="16" r="1.5" fill="white" />
            <circle cx="23" cy="16" r="1.5" fill="white" />
            <circle cx="11" cy="11" r="1.2" fill="white" />
            <circle cx="21" cy="21" r="1.2" fill="white" />
            <circle cx="11" cy="21" r="1.2" fill="white" />
            <circle cx="21" cy="11" r="1.2" fill="white" />
          </svg>
        );

      default:
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase"
          >
            {s.slice(0, 3)}
          </div>
        );
    }
  };

  return <div className={`inline-flex shrink-0 ${className}`}>{renderIcon()}</div>;
};
