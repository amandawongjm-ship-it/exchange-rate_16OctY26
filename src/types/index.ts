export type CurrencyCategory = 'all' | 'asean' | 'east-asia' | 'major' | 'remittance' | 'favorites';

export interface CurrencyInfo {
  code: string;
  name: string;
  country: string;
  flag: string;
  symbol: string;
  decimals: number;
  category: 'asean' | 'east-asia' | 'major' | 'remittance' | 'other';
  popularInSingapore?: boolean;
  singaporeTravelNote?: string;
  unitMultiplier?: number; // e.g. 100 JPY or 100 IDR for conventional quoting
}

export interface FxRateData {
  base: string; // 'SGD'
  date: string;
  timestamp: number;
  rates: Record<string, number>;
  source: 'live-api' | 'cached-api' | 'fallback';
  lastUpdatedText: string;
  nextUpdateText?: string;
}

export interface RateHistoryPoint {
  date: string;
  rate: number;
}

export interface MoneyChangerProvider {
  id: string;
  name: string;
  location: string;
  type: 'travel-card' | 'money-changer' | 'bank' | 'airport';
  typicalSpreadPct: number; // e.g. 0.3% for multi-currency card, 0.6% for The Arcade, 2.0% for bank, 4.5% for Changi Airport
  operatingHours: string;
  addressHighlight: string;
  bestFor: string;
  paymentMethod: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amountForeign: number;
  category: 'accommodation' | 'food' | 'shopping' | 'transport' | 'activities';
}

export interface RateAlert {
  id: string;
  targetCurrency: string;
  targetRate: number;
  direction: 'above' | 'below';
  createdAt: number;
  active: boolean;
  notes?: string;
}
