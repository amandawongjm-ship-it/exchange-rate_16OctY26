import React from 'react';
import { SINGAPORE_FX_PROVIDERS } from '../data/currencies';
import { CurrencyInfo, FxRateData } from '../types';
import { ShieldCheck, MapPin, Clock, CreditCard, Banknote, AlertCircle } from 'lucide-react';

interface MoneyChangerComparisonProps {
  sgdAmount: number;
  selectedCurrency: CurrencyInfo;
  rateData: FxRateData;
}

export function MoneyChangerComparison({
  sgdAmount,
  selectedCurrency,
  rateData,
}: MoneyChangerComparisonProps) {
  const midMarketRate = rateData.rates[selectedCurrency.code] || 1;
  const benchmarkTotal = sgdAmount * midMarketRate;

  return (
    <section id="money-changers" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              Singapore Retail FX Ecosystem
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Singapore Money Changers vs Travel Cards vs Banks
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Comparing how much {selectedCurrency.name} ({selectedCurrency.code}) you receive for{' '}
              <strong className="text-slate-900 font-semibold font-mono">
                S${sgdAmount.toLocaleString()}
              </strong>{' '}
              across Singapore's famous exchange hubs and digital cards.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Mid-Market Benchmark:</span>
            <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
              {benchmarkTotal.toLocaleString('en-US', {
                maximumFractionDigits: selectedCurrency.decimals <= 2 ? 2 : 4,
              })}{' '}
              {selectedCurrency.code}
            </span>
          </div>
        </div>

        {/* Singapore Specific Advice Callout */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Singapore Smart Traveler Tip for {selectedCurrency.country}: </span>
            {selectedCurrency.code === 'MYR' && (
              <span>
                For Johor Bahru & KL trips, <strong>The Arcade</strong> or <strong>People's Park</strong> gives top cash rates. Alternatively, multi-currency cards (YouTrip/Revolut) work seamlessly at Malaysian card terminals and Touch 'n Go eWallet top-ups.
              </span>
            )}
            {selectedCurrency.code === 'JPY' && (
              <span>
                While cashless payments (Suica/Pasmo Apple Wallet) are widespread in Tokyo, small ramen tickets, temples, and izakayas in Kyoto still demand physical Yen notes. Change cash at The Arcade or Mustafa before departure to avoid 4%+ airport markup.
              </span>
            )}
            {selectedCurrency.code === 'THB' && (
              <span>
                Bangkok night markets (Chatuchak, Jodd Fairs) and street vendors are predominantly cash. The Arcade and Mustafa offer the tightest SGD/THB cash spreads in Singapore.
              </span>
            )}
            {selectedCurrency.code === 'IDR' && (
              <span>
                For Batam, Bintan resorts, or Bali, get physical Rupiah at People's Park Complex or The Arcade. Avoid exchanging SGD at Indonesian resort hotels where spreads often exceed 8%.
              </span>
            )}
            {!['MYR', 'JPY', 'THB', 'IDR'].includes(selectedCurrency.code) && (
              <span>
                For {selectedCurrency.name}, digital multi-currency cards offer near zero-markup for tap transactions, while physical cash is best secured at The Arcade (CBD) or Mustafa Centre (24/7) rather than airport transit counters.
              </span>
            )}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SINGAPORE_FX_PROVIDERS.map((provider) => {
            // Apply spread penalty to rate
            const effectiveRate = midMarketRate * (1 - provider.typicalSpreadPct / 100);
            const payoutAmount = sgdAmount * effectiveRate;
            const spreadCostSgd = (sgdAmount * (provider.typicalSpreadPct / 100));
            const isBest = provider.id === 'travel-wallet' || (provider.id === 'the-arcade' && provider.type === 'money-changer');

            return (
              <div
                key={provider.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  provider.id === 'changi-airport'
                    ? 'border-amber-200 bg-amber-50/20'
                    : provider.id === 'mid-market'
                    ? 'border-slate-300 bg-slate-50/50'
                    : isBest
                    ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar of Provider */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{provider.location}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        provider.typicalSpreadPct === 0
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : provider.typicalSpreadPct <= 0.5
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : provider.typicalSpreadPct <= 1.0
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : provider.typicalSpreadPct <= 2.5
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                      }`}
                    >
                      {provider.typicalSpreadPct === 0
                        ? '0% Spread'
                        : `~${provider.typicalSpreadPct.toFixed(2)}% Spread`}
                    </span>
                  </div>

                  {/* Effective Rate and Payout */}
                  <div className="my-4 py-3 px-3.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
                      <span>Rate Quoted:</span>
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        1 SGD = {effectiveRate.toFixed(selectedCurrency.decimals <= 2 ? 2 : 4)} {selectedCurrency.code}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mb-1">Total You Receive:</div>
                    <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {payoutAmount.toLocaleString('en-US', {
                        maximumFractionDigits: selectedCurrency.decimals <= 2 ? 2 : 2,
                      })}{' '}
                      <span className="text-xs text-slate-500 font-sans font-medium">
                        {selectedCurrency.code}
                      </span>
                    </div>

                    {provider.typicalSpreadPct > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Estimated Spread Markup:</span>
                        <span className="font-mono font-medium text-rose-600">
                          -S${spreadCostSgd.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features & Hours */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{provider.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{provider.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Best for: </span>
                  {provider.bestFor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning on Airport FX */}
        <div className="mt-6 flex items-center gap-2.5 text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Airport Caution:</strong> Changi Airport terminal booths carry significant operating overheads with retail spreads typically exceeding 4% to 6%. Whenever possible, exchange your cash beforehand at The Arcade, Mustafa, or preload a multi-currency card.
          </span>
        </div>
      </div>
    </section>
  );
}
