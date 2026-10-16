import React, { useState } from 'react';
import { X, Bell, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { CURRENCIES } from '../data/currencies';
import { FxRateData, RateAlert } from '../types';

interface RateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: RateAlert[];
  onSaveAlerts: (alerts: RateAlert[]) => void;
  rateData: FxRateData;
}

export function RateAlertModal({
  isOpen,
  onClose,
  alerts,
  onSaveAlerts,
  rateData,
}: RateAlertModalProps) {
  if (!isOpen) return null;

  const [selectedCode, setSelectedCode] = useState('MYR');
  const [targetRate, setTargetRate] = useState<number | ''>('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [notes, setNotes] = useState('');

  const currentRate = rateData.rates[selectedCode] || 1;

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRate || targetRate <= 0) return;

    const newAlert: RateAlert = {
      id: Date.now().toString(),
      targetCurrency: selectedCode,
      targetRate: Number(targetRate),
      direction,
      createdAt: Date.now(),
      active: true,
      notes: notes.trim() || undefined,
    };

    onSaveAlerts([...alerts, newAlert]);
    setTargetRate('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    onSaveAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">SGD Rate Alerts</h3>
              <p className="text-xs text-slate-500">Track target exchange rates for travel or remittances</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to add alert */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleAddAlert} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Create New Target Alert
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Target Currency
                </label>
                <select
                  value={selectedCode}
                  onChange={(e) => {
                    setSelectedCode(e.target.value);
                    const r = rateData.rates[e.target.value] || 1;
                    setTargetRate(Number((r * 1.02).toFixed(2)));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:outline-hidden"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Condition
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'above' | 'below')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:outline-hidden"
                >
                  <option value="above">When 1 SGD rises above (≥)</option>
                  <option value="below">When 1 SGD drops below (≤)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Target Rate (Current: {currentRate.toFixed(2)})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 3.45"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-mono font-medium focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Note / Label (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. JB trip budget"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Alert</span>
              </button>
            </div>
          </form>

          {/* List of active alerts */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Active Saved Watchers ({alerts.length})
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  No rate alerts configured. Add a target rate above to monitor.
                </div>
              ) : (
                alerts.map((alert) => {
                  const rateNow = rateData.rates[alert.targetCurrency] || 0;
                  const isMet =
                    alert.direction === 'above'
                      ? rateNow >= alert.targetRate
                      : rateNow <= alert.targetRate;
                  const currency = CURRENCIES.find((c) => c.code === alert.targetCurrency);

                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isMet
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{currency?.flag || '🌐'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              1 SGD {alert.direction === 'above' ? '≥' : '≤'} {alert.targetRate.toFixed(2)}{' '}
                              {alert.targetCurrency}
                            </span>
                            {isMet ? (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Target Reached!</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>Current: {rateNow.toFixed(2)}</span>
                              </span>
                            )}
                          </div>
                          {alert.notes && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{alert.notes}</div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
