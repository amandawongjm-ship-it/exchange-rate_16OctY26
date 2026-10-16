import { X, Landmark, Compass, Shield, ArrowRight } from 'lucide-react';

interface MasPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MasPolicyModal({ isOpen, onClose }: MasPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Monetary Authority of Singapore (MAS) FX Framework
              </h3>
              <p className="text-xs text-slate-500">
                Understanding the S$NEER Policy Band and Why SGD is Unique
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Core concept */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed space-y-2">
            <div className="font-bold text-sm text-slate-900">
              Why doesn&rsquo;t Singapore use Interest Rates?
            </div>
            <p>
              Unlike central banks such as the US Federal Reserve or the Bank of England, the <strong>Monetary Authority of Singapore (MAS)</strong> does not set domestic interest rates. Because Singapore is a small, hyper-open economy with external trade exceeding <strong>300% of GDP</strong>, domestic prices and consumer inflation are primarily driven by the cost of imported food, energy, and goods.
            </p>
            <p>
              MAS therefore uses the <strong>exchange rate</strong> as its principal monetary policy instrument to preserve price stability and anchor medium-term inflation.
            </p>
          </div>

          {/* 3 Pillars of S$NEER */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              The 3 Levers of the S$NEER Policy Band
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Compass className="w-4 h-4 text-rose-600" />
                  <span>1. Slope</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  The targeted rate of appreciation or depreciation of the policy band over time (e.g. tightening via a steeper appreciating slope to combat imported inflation).
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>2. Width</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  The undisclosed tolerance zone (typically ~±2%) allowing the SGD to absorb short-term global market volatility without abrupt central bank interventions.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Landmark className="w-4 h-4 text-sky-600" />
                  <span>3. Mid-Point</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  The center of the policy band, which MAS can re-center upwards or downwards during major macroeconomic shifts.
                </p>
              </div>
            </div>
          </div>

          {/* Trade-Weighted Currency Basket */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Trade-Weighted Basket Composition
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The SGD is managed against a trade-weighted basket of currencies of Singapore&rsquo;s major trading partners (including the <strong>US Dollar, Chinese Yuan, Malaysian Ringgit, Euro, Japanese Yen, and British Pound</strong>). The exact weights are undisclosed by MAS to deter speculative attacks on the currency.
            </p>
          </div>

          {/* Brunei Interchangeability Agreement */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <span>🇧🇳 🇸🇬 1967 Currency Interchangeability Agreement</span>
            </h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Under this historic agreement between Brunei Darussalam and Singapore, the <strong>Brunei Dollar (BND)</strong> and the <strong>Singapore Dollar (SGD)</strong> are accepted at par (1:1 exchange rate) without exchange commission in both countries. Brunei banknotes are customary legal tender in Singapore shops and banks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
