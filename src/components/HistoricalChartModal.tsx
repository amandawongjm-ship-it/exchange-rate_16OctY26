import React, { useState, useMemo } from 'react';
import { X, TrendingUp, Calendar, Info } from 'lucide-react';
import { CurrencyInfo, FxRateData } from '../types';
import { generateSimulatedHistory } from '../data/currencies';

interface HistoricalChartModalProps {
  currency: CurrencyInfo | null;
  rateData: FxRateData;
  onClose: () => void;
}

type Timeframe = '7d' | '30d' | '90d' | '1y';

export function HistoricalChartModal({
  currency,
  rateData,
  onClose,
}: HistoricalChartModalProps) {
  if (!currency) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
  const currentRate = rateData.rates[currency.code] || 1;

  const points = useMemo(() => {
    return generateSimulatedHistory(currentRate, currency.code, days);
  }, [currentRate, currency.code, days]);

  const rates = points.map((p) => p.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const rateRange = maxRate - minRate || 1;

  // 52-Week Position (0 to 100%)
  const positionPct = Math.min(100, Math.max(0, ((currentRate - minRate) / rateRange) * 100));

  // Chart dimensions
  const width = 640;
  const height = 220;
  const padding = 20;

  // Generate SVG polyline coordinates
  const svgPoints = points
    .map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p.rate - minRate) / rateRange) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label={currency.country}>
              {currency.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">
                  SGD / {currency.code} Exchange History
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {currency.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                1 Singapore Dollar (SGD) expressed in {currency.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top Metrics & Timeframe Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {activePoint.date} Value
              </div>
              <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {activePoint.rate.toFixed(currency.decimals <= 2 ? 2 : 4)}{' '}
                <span className="text-sm font-sans font-medium text-slate-500">{currency.code}</span>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
              {(['7d', '30d', '90d', '1y'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="relative">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-44 overflow-visible"
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Horizontal reference grids */}
                <line
                  x1={padding}
                  y1={padding}
                  x2={width - padding}
                  y2={padding}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padding}
                  y1={height / 2}
                  x2={width - padding}
                  y2={height / 2}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padding}
                  y1={height - padding}
                  x2={width - padding}
                  y2={height - padding}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />

                {/* The Trend Line */}
                <polyline
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPoints}
                />

                {/* Hover dots / interaction overlay */}
                {points.map((p, idx) => {
                  const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
                  const y = height - padding - ((p.rate - minRate) / rateRange) * (height - padding * 2);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={hoverIndex === idx ? 5 : 2}
                      className="cursor-pointer"
                      fill={hoverIndex === idx ? '#9f1239' : '#e11d48'}
                      onMouseEnter={() => setHoverIndex(idx)}
                    />
                  );
                })}
              </svg>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>{points[0].date}</span>
                <span>{points[Math.floor(points.length / 2)].date}</span>
                <span>Today ({points[points.length - 1].date})</span>
              </div>
            </div>
          </div>

          {/* Summary Stat Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Period Low</div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                {minRate.toFixed(currency.decimals <= 2 ? 2 : 4)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Period Average</div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                {avgRate.toFixed(currency.decimals <= 2 ? 2 : 4)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Period High</div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                {maxRate.toFixed(currency.decimals <= 2 ? 2 : 4)}
              </div>
            </div>
          </div>

          {/* Range Continuum Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
              <span>Period Low ({minRate.toFixed(2)})</span>
              <span>
                Current SGD Strength: <strong className="font-mono">{positionPct.toFixed(0)}%</strong> of Range
              </span>
              <span>Period High ({maxRate.toFixed(2)})</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${positionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Close Chart
          </button>
        </div>
      </div>
    </div>
  );
}
