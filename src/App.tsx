import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ConverterHero } from './components/ConverterHero';
import { MoneyChangerComparison } from './components/MoneyChangerComparison';
import { CurrencyMatrixTable } from './components/CurrencyMatrixTable';
import { TravelExpenseCalculator } from './components/TravelExpenseCalculator';
import { HistoricalChartModal } from './components/HistoricalChartModal';
import { RateAlertModal } from './components/RateAlertModal';
import { MasPolicyModal } from './components/MasPolicyModal';
import { CURRENCIES, FALLBACK_SGD_RATES } from './data/currencies';
import { CurrencyInfo, FxRateData, RateAlert } from './types';
import {
  fetchSgdRates,
  getStoredFavorites,
  setStoredFavorites,
  getStoredAlerts,
  saveStoredAlerts,
} from './services/fxService';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [rateData, setRateData] = useState<FxRateData>({
    base: 'SGD',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    rates: FALLBACK_SGD_RATES,
    source: 'fallback',
    lastUpdatedText: 'Initialising Singapore FX Rates...',
  });

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo>(
    CURRENCIES.find((c) => c.code === 'MYR') || CURRENCIES[0]
  );
  const [sgdAmount, setSgdAmount] = useState<number>(1000);
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites());
  const [alerts, setAlerts] = useState<RateAlert[]>(getStoredAlerts());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState('converter');

  // Modals
  const [historyCurrency, setHistoryCurrency] = useState<CurrencyInfo | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isMasModalOpen, setIsMasModalOpen] = useState(false);

  // Load live rates
  const loadRates = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchSgdRates();
      setRateData(data);
    } catch (e) {
      console.error('Failed to load rates', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
    // Refresh every 5 minutes in background
    const interval = setInterval(loadRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadRates]);

  const handleToggleFavorite = (code: string) => {
    const next = favorites.includes(code)
      ? favorites.filter((c) => c !== code)
      : [...favorites, code];
    setFavorites(next);
    setStoredFavorites(next);
  };

  const handleSaveAlerts = (newAlerts: RateAlert[]) => {
    setAlerts(newAlerts);
    saveStoredAlerts(newAlerts);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Bar adhering to strict Top Bar Contract */}
      <Header
        onRefresh={loadRates}
        isRefreshing={isRefreshing}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
        onOpenMasGuide={() => setIsMasModalOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {/* Converter Hero */}
        <div id="converter">
          <ConverterHero
            rateData={rateData}
            selectedCurrency={selectedCurrency}
            onSelectCurrency={setSelectedCurrency}
            sgdAmount={sgdAmount}
            onSgdAmountChange={setSgdAmount}
            onOpenHistory={setHistoryCurrency}
            onRefresh={loadRates}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Money Changer & Travel Card Spread Comparison */}
        <MoneyChangerComparison
          sgdAmount={sgdAmount}
          selectedCurrency={selectedCurrency}
          rateData={rateData}
        />

        {/* Global Currency Matrix */}
        <CurrencyMatrixTable
          rateData={rateData}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectCurrency={setSelectedCurrency}
          onOpenHistory={setHistoryCurrency}
        />

        {/* Travel Expenses & Customs GST Calculator */}
        <TravelExpenseCalculator
          selectedCurrency={selectedCurrency}
          rateData={rateData}
        />
      </main>

      {/* Modals */}
      <HistoricalChartModal
        currency={historyCurrency}
        rateData={rateData}
        onClose={() => setHistoryCurrency(null)}
      />

      <RateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alerts={alerts}
        onSaveAlerts={handleSaveAlerts}
        rateData={rateData}
      />

      <MasPolicyModal
        isOpen={isMasModalOpen}
        onClose={() => setIsMasModalOpen(false)}
      />

      {/* Quiet, Professional Singapore Financial Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-white font-bold text-base flex items-center gap-2">
                <span>SingaFX</span>
                <span className="text-xs font-normal text-slate-400">· Singapore Exchange Rate Matrix</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 max-w-xl">
                Providing real-time Singapore Dollar (SGD) mid-market rates, retail money changer spreads (The Arcade, Mustafa, People&rsquo;s Park), and overseas travel budget calculations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <button
                onClick={() => setIsMasModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                S$NEER Explained
              </button>
              <button
                onClick={() => handleNavigate('money-changers')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                The Arcade vs Mustafa
              </button>
              <button
                onClick={() => handleNavigate('travel-calc')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Customs GST Relief
              </button>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Rate Alerts
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500 text-[11px]">
            <div>
              Rates are for informational purposes. Physical money changer spreads reflect surveyed market averages in Singapore.
            </div>
            <div className="flex items-center gap-2">
              <span>Republic of Singapore</span>
              <span aria-hidden="true">·</span>
              <span>SGT (UTC+8)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
