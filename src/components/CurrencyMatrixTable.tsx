import React, { useState } from 'react';
import { Star, Search, ArrowUpRight, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { CURRENCIES } from '../data/currencies';
import { CurrencyInfo, FxRateData, CurrencyCategory } from '../types';

interface CurrencyMatrixTableProps {
  rateData: FxRateData;
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  onSelectCurrency: (currency: CurrencyInfo) => void;
  onOpenHistory: (currency: CurrencyInfo) => void;
}

export function CurrencyMatrixTable({
  rateData,
  favorites,
  onToggleFavorite,
  onSelectCurrency,
  onOpenHistory,
}: CurrencyMatrixTableProps) {
  const [activeCategory, setActiveCategory] = useState<CurrencyCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [useUnitMultipliers, setUseUnitMultipliers] = useState(true);

  // Filter list
  const filteredList = CURRENCIES.filter((c) => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.code.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      c.country.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Category
    if (activeCategory === 'favorites') {
      return favorites.includes(c.code);
    }
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  return (
    <section id="matrix" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              Global Currency Matrix
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Singapore Dollar (SGD) Global Cross Rates
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Direct live rates and reciprocal conversions against major international currencies and regional trading partners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle unit multiplier standard */}
            <button
              onClick={() => setUseUnitMultipliers(!useUnitMultipliers)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>{useUnitMultipliers ? 'Money Changer Units (100 JPY)' : 'Per 1 Single Unit'}</span>
            </button>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          {/* Category Tabs (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs scrollbar-none">
            {[
              { id: 'all', label: 'All Currencies' },
              { id: 'asean', label: 'ASEAN & Neighbors' },
              { id: 'east-asia', label: 'East Asia' },
              { id: 'major', label: 'Major Currencies' },
              { id: 'remittance', label: 'Remittance Corridor' },
              { id: 'favorites', label: `Favorites (${favorites.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as CurrencyCategory)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, country..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Rates Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">Fav</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4 text-right">1 SGD Buys</th>
                  <th className="py-3 px-4 text-right">Inversion (In SGD)</th>
                  <th className="py-3 px-4 hidden md:table-cell">Singapore Travel / Trade Context</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      No matching currencies found for &ldquo;{searchTerm}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((c) => {
                    const isFav = favorites.includes(c.code);
                    const rate = rateData.rates[c.code] || 0;
                    const reciprocal = rate > 0 ? 1 / rate : 0;
                    const multiplier = useUnitMultipliers && c.unitMultiplier ? c.unitMultiplier : 1;
                    const displayReciprocal = reciprocal * multiplier;

                    return (
                      <tr
                        key={c.code}
                        className="hover:bg-slate-50/75 transition-colors group"
                      >
                        {/* Favorite star */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onToggleFavorite(c.code)}
                            className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isFav ? 'fill-amber-400 text-amber-500' : ''
                              }`}
                            />
                          </button>
                        </td>

                        {/* Currency Code & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl" role="img" aria-label={c.country}>
                              {c.flag}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                                <span>{c.code}</span>
                                {c.code === 'BND' && (
                                  <span className="text-[10px] font-sans bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200">
                                    1:1 Pegged
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                                {c.name} · {c.country}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 1 SGD Buys */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-mono font-bold text-slate-900 tabular-nums">
                            {c.symbol}{' '}
                            {rate.toLocaleString('en-US', {
                              maximumFractionDigits: c.decimals <= 2 ? 2 : 4,
                            })}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            1 SGD = {rate.toFixed(c.decimals <= 2 ? 2 : 4)}
                          </div>
                        </td>

                        {/* Inversion (Cost of 1 foreign unit in SGD) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-mono font-semibold text-slate-700 tabular-nums">
                            S${displayReciprocal.toFixed(multiplier > 1 ? 2 : 4)}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {multiplier > 1 ? `Per ${multiplier.toLocaleString()} ${c.code}` : `Per 1 ${c.code}`}
                          </div>
                        </td>

                        {/* Singapore Travel & Commerce Context */}
                        <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-600 max-w-xs">
                          <span className="line-clamp-2">
                            {c.singaporeTravelNote || `${c.country} commerce`}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenHistory(c)}
                              title="View historical trend chart"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                onSelectCurrency(c);
                                const el = document.getElementById('converter');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>Convert</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
