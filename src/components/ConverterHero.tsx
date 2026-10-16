import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw, Info, Sparkles } from 'lucide-react';
import { CURRENCIES } from '../data/currencies';
import { FxRateData, CurrencyInfo } from '../types';

interface ConverterHeroProps {
  rateData: FxRateData;
  selectedCurrency: CurrencyInfo;
  onSelectCurrency: (currency: CurrencyInfo) => void;
  sgdAmount: number;
  onSgdAmountChange: (amount: number) => void;
  onOpenHistory: (currency: CurrencyInfo) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SGD_PRESETS = [100, 500, 1000, 2500, 5000];

export function ConverterHero({
  rateData,
  selectedCurrency,
  onSelectCurrency,
  sgdAmount,
  onSgdAmountChange,
  onOpenHistory,
  onRefresh,
  isRefreshing,
}: ConverterHeroProps) {
  const [isReverse, setIsReverse] = useState(false);
  const [foreignAmount, setForeignAmount] = useState<number>(0);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentRate = rateData.rates[selectedCurrency.code] || 1;
  const reciprocalRate = currentRate > 0 ? 1 / currentRate : 0;

  // Sync inputs
  const calculatedForeign = Number((sgdAmount * currentRate).toFixed(selectedCurrency.decimals <= 2 ? 2 : 4));
  const calculatedSgd = foreignAmount > 0 && currentRate > 0 ? Number((foreignAmount / currentRate).toFixed(2)) : 0;

  const handleSgdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onSgdAmountChange(val);
  };

  const handleForeignInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setForeignAmount(val);
    if (currentRate > 0) {
      onSgdAmountChange(Number((val / currentRate).toFixed(2)));
    }
  };

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.country.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section className="pt-8 pb-10 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subheader & Last Updated context */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Monetary Authority of Singapore (MAS) Framework</span>
              <span aria-hidden="true">·</span>
              <span>Mid-Market Wholesale Rates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Singapore Dollar (SGD) Real-Time FX Converter
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right text-xs text-slate-500">
              <div className="font-mono tabular-nums font-medium text-slate-700">
                {rateData.lastUpdatedText}
              </div>
              <div className="text-[11px] text-slate-400">
                {rateData.source === 'live-api' ? 'Live Interbank Feed' : 'Benchmark Baseline'}
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh live exchange rates"
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Interactive Converter Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Main Exchange Conversion Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            {/* Left Box: SGD */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  You Pay / Base Currency
                </span>
                <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Singapore
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs shrink-0">
                  <span className="text-2xl" role="img" aria-label="Singapore Flag">
                    🇸🇬
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 leading-none">SGD</div>
                    <div className="text-[11px] text-slate-500 font-medium">S$ Dollar</div>
                  </div>
                </div>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={isReverse ? calculatedSgd || '' : sgdAmount || ''}
                    onChange={handleSgdInput}
                    placeholder="0.00"
                    className="w-full text-right text-2xl sm:text-3xl font-bold font-mono text-slate-900 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Quick SGD Presets */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Quick:</span>
                {SGD_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onSgdAmountChange(preset)}
                    className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md transition-colors cursor-pointer ${
                      sgdAmount === preset
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    S${preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle: Swap Button */}
            <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
              <button
                onClick={() => setIsReverse(!isReverse)}
                title="Invert conversion perspective"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer group"
              >
                <ArrowLeftRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Right Box: Target Foreign Currency */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  You Receive / Target Currency
                </span>
                <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {selectedCurrency.country}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Currency Selector Trigger */}
                <button
                  onClick={() => setIsCurrencyPickerOpen(!isCurrencyPickerOpen)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 shadow-2xs shrink-0 cursor-pointer text-left transition-colors"
                >
                  <span className="text-2xl" role="img" aria-label={selectedCurrency.country}>
                    {selectedCurrency.flag}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-900 leading-none">
                      {selectedCurrency.code}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate max-w-[90px]">
                      {selectedCurrency.symbol} · {selectedCurrency.name}
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs ml-1">▼</span>
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      isReverse
                        ? foreignAmount || ''
                        : calculatedForeign.toLocaleString('en-US', {
                            useGrouping: false,
                            maximumFractionDigits: selectedCurrency.decimals,
                          })
                    }
                    onChange={handleForeignInput}
                    placeholder="0.00"
                    className="w-full text-right text-2xl sm:text-3xl font-bold font-mono text-slate-900 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Travel Note & Unit Multiplier context */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate pr-2">
                  {selectedCurrency.singaporeTravelNote || `${selectedCurrency.name} (${selectedCurrency.code})`}
                </span>
                <button
                  onClick={() => onOpenHistory(selectedCurrency)}
                  className="shrink-0 text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Chart</span>
                </button>
              </div>

              {/* Currency Dropdown Modal */}
              {isCurrencyPickerOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-xl p-3 max-h-80 overflow-hidden flex flex-col">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search currency code, country (e.g. MYR, Japan, Euro)..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 mb-2 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    autoFocus
                  />
                  <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                    {filteredCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          onSelectCurrency(c);
                          setIsCurrencyPickerOpen(false);
                          setSearchFilter('');
                        }}
                        className={`w-full flex items-center justify-between p-2 text-left hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${
                          c.code === selectedCurrency.code ? 'bg-rose-50/60 font-semibold text-rose-900' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{c.flag}</span>
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-900 mr-1.5">{c.code}</span>
                            <span className="text-xs text-slate-600">{c.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-slate-700 tabular-nums">
                            {rateData.rates[c.code]
                              ? rateData.rates[c.code].toLocaleString('en-US', {
                                  maximumFractionDigits: c.decimals,
                                })
                              : '—'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rate Summary Strip & Reciprocal */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Mid-Market Rate:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  1 SGD = {currentRate.toLocaleString('en-US', { maximumFractionDigits: selectedCurrency.decimals <= 2 ? 4 : 5 })} {selectedCurrency.code}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span>Inversion:</span>
                <span className="font-mono font-medium text-slate-700 tabular-nums">
                  1 {selectedCurrency.code} = S${reciprocalRate.toFixed(4)}
                </span>
              </div>
              {selectedCurrency.unitMultiplier && (
                <div className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  Per {selectedCurrency.unitMultiplier} {selectedCurrency.code} = S${(reciprocalRate * selectedCurrency.unitMultiplier).toFixed(2)}
                </div>
              )}
            </div>

            {/* Quick Action to Money Changers */}
            <div className="flex items-center gap-3">
              <a
                href="#money-changers"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
              >
                <span>Compare The Arcade vs Mustafa vs Bank Spreads</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3-Column Highlights: Popular Cross-Border Pairs for Singaporeans */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { code: 'MYR', flag: '🇲🇾', label: 'Causeway Day-Trip', tag: 'Malaysia' },
            { code: 'JPY', flag: '🇯🇵', label: 'Top Holiday Hub', tag: 'Japan' },
            { code: 'THB', flag: '🇹🇭', label: 'Bangkok Shopping', tag: 'Thailand' },
            { code: 'USD', flag: '🇺🇸', label: 'Global Benchmark', tag: 'US Dollar' },
          ].map((item) => {
            const curr = CURRENCIES.find((c) => c.code === item.code);
            const rate = rateData.rates[item.code] || 0;
            return (
              <button
                key={item.code}
                onClick={() => curr && onSelectCurrency(curr)}
                className={`p-3 bg-white hover:bg-slate-50 rounded-xl border transition-all text-left cursor-pointer shadow-2xs ${
                  selectedCurrency.code === item.code
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{item.label}</span>
                  <span className="text-base">{item.flag}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-slate-900">{item.code}</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                    {rate.toLocaleString('en-US', { maximumFractionDigits: 3 })}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
