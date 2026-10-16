import { FxRateData, RateAlert } from '../types';
import { FALLBACK_SGD_RATES } from '../data/currencies';

const CACHE_KEY = 'singafx_live_rates_v1';
const ALERTS_KEY = 'singafx_rate_alerts_v1';
const FAVORITES_KEY = 'singafx_favorite_currencies_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchSgdRates(): Promise<FxRateData> {
  const cached = getCachedRates();
  
  // Try fetching fresh live rates from open.er-api.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://open.er-api.com/v6/latest/SGD', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates === 'object') {
        const mergedRates: Record<string, number> = {
          ...FALLBACK_SGD_RATES,
          ...data.rates,
          SGD: 1.0,
        };

        const now = Date.now();
        const rateData: FxRateData = {
          base: 'SGD',
          date: new Date().toISOString().split('T')[0],
          timestamp: now,
          rates: mergedRates,
          source: 'live-api',
          lastUpdatedText: new Date().toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          }),
          nextUpdateText: data.time_next_update_utc
            ? new Date(data.time_next_update_utc).toLocaleTimeString('en-SG', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : undefined,
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(rateData));
        } catch {
          // ignore localStorage quota error
        }

        return rateData;
      }
    }
  } catch (err) {
    console.warn('Network rate fetch unsuccessful, using cached or fallback SGD rates:', err);
  }

  // If live fetch fails, use cached rates if valid
  if (cached) {
    return {
      ...cached,
      source: 'cached-api',
    };
  }

  // Otherwise return built-in realistic baseline
  return {
    base: 'SGD',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    rates: FALLBACK_SGD_RATES,
    source: 'fallback',
    lastUpdatedText: 'Benchmark Baseline (Monetary Authority of Singapore / Global Interbank)',
  };
}

export function getCachedRates(): FxRateData | null {
  try {
    const str = localStorage.getItem(CACHE_KEY);
    if (!str) return null;
    const data: FxRateData = JSON.parse(str);
    if (Date.now() - data.timestamp < CACHE_TTL_MS * 12) {
      return data;
    }
  } catch {
    return null;
  }
  return null;
}

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return ['MYR', 'JPY', 'THB', 'USD', 'EUR', 'GBP', 'AUD', 'IDR'];
}

export function setStoredFavorites(favs: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch {
    // ignore
  }
}

export function getStoredAlerts(): RateAlert[] {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  // Default illustrative alerts
  return [
    {
      id: 'default-1',
      targetCurrency: 'MYR',
      targetRate: 3.40,
      direction: 'above',
      createdAt: Date.now() - 86400000 * 2,
      active: true,
      notes: 'JB Weekend Shopping trigger',
    },
    {
      id: 'default-2',
      targetCurrency: 'JPY',
      targetRate: 118.0,
      direction: 'above',
      createdAt: Date.now() - 86400000 * 5,
      active: true,
      notes: 'Tokyo Autumn vacation target',
    },
  ];
}

export function saveStoredAlerts(alerts: RateAlert[]) {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch {
    // ignore
  }
}
