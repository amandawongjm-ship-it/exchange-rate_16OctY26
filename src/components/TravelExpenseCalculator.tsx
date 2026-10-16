import React, { useState } from 'react';
import { Plus, Trash2, ShieldCheck, DollarSign, Calculator, Luggage, CreditCard } from 'lucide-react';
import { CurrencyInfo, FxRateData, ExpenseItem } from '../types';

interface TravelExpenseCalculatorProps {
  selectedCurrency: CurrencyInfo;
  rateData: FxRateData;
}

const DEFAULT_ITEMS: Record<string, ExpenseItem[]> = {
  MYR: [
    { id: '1', description: 'Seafood Dinner in Johor Bahru', amountForeign: 280, category: 'food' },
    { id: '2', description: 'Mid Valley Southkey Shopping', amountForeign: 650, category: 'shopping' },
    { id: '3', description: 'Car Fuel & Touch n Go Tolls', amountForeign: 120, category: 'transport' },
  ],
  JPY: [
    { id: '1', description: '3 Nights Tokyo Hotel (Shinjuku)', amountForeign: 54000, category: 'accommodation' },
    { id: '2', description: 'Ichiran & Omotesando Cafe Dinners', amountForeign: 18000, category: 'food' },
    { id: '3', description: 'Don Quijote & Bic Camera Tax-Free Shopping', amountForeign: 45000, category: 'shopping' },
    { id: '4', description: 'Shinkansen Bullet Train to Kyoto', amountForeign: 28000, category: 'transport' },
  ],
  THB: [
    { id: '1', description: 'Boutique Hotel in Sukhumvit', amountForeign: 8500, category: 'accommodation' },
    { id: '2', description: 'Chatuchak Weekend Market Haul', amountForeign: 4200, category: 'shopping' },
    { id: '3', description: 'Thai Massage & Spa Treatments', amountForeign: 2500, category: 'activities' },
  ],
};

export function TravelExpenseCalculator({
  selectedCurrency,
  rateData,
}: TravelExpenseCalculatorProps) {
  const currentRate = rateData.rates[selectedCurrency.code] || 1;
  const initialItems = DEFAULT_ITEMS[selectedCurrency.code] || [
    { id: '1', description: `Hotel / Accommodation in ${selectedCurrency.country}`, amountForeign: 300, category: 'accommodation' },
    { id: '2', description: 'Local Dining & Food', amountForeign: 150, category: 'food' },
    { id: '3', description: 'Souvenirs & Retail Purchases', amountForeign: 200, category: 'shopping' },
  ];

  const [items, setItems] = useState<ExpenseItem[]>(initialItems);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('shopping');
  const [tripDuration, setTripDuration] = useState<'under48' | 'over48'>('over48');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newAmount || newAmount <= 0) return;
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      description: newDesc.trim(),
      amountForeign: Number(newAmount),
      category: newCategory,
    };
    setItems([...items, newItem]);
    setNewDesc('');
    setNewAmount('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Calculations
  const totalForeign = items.reduce((sum, item) => sum + item.amountForeign, 0);
  const totalSgdMidMarket = currentRate > 0 ? totalForeign / currentRate : 0;

  // Shopping total for SG GST relief
  const shoppingForeign = items
    .filter((i) => i.category === 'shopping')
    .reduce((sum, item) => sum + item.amountForeign, 0);
  const shoppingSgd = currentRate > 0 ? shoppingForeign / currentRate : 0;

  // Singapore Customs GST Relief: S$100 if < 48 hours abroad, S$500 if >= 48 hours abroad
  const gstReliefThreshold = tripDuration === 'under48' ? 100 : 500;
  const taxableShoppingSgd = Math.max(0, shoppingSgd - gstReliefThreshold);
  const estimatedSgGst = taxableShoppingSgd * 0.09; // Singapore 9% GST

  // Bank Credit Card FX Admin Fee: ~3.25% markup
  const bankCardFeeSgd = totalSgdMidMarket * 0.0325;
  // Multi-currency card (YouTrip/Revolut/Trust): ~0% markup
  const multiCurrencySavings = bankCardFeeSgd;

  return (
    <section id="travel-calc" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              Singapore Overseas Travel Intelligence
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Trip Budget & Singapore Customs GST Calculator
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Calculate total spending in {selectedCurrency.name} ({selectedCurrency.code}), compare bank card 3.25% FX fees, and check your Singapore Customs 9% GST relief allowance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 cols: Interactive Expense List & Add Item */}
          <div className="lg:col-span-7 space-y-4">
            {/* Add Item Form */}
            <form onSubmit={addItem} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-3">
                + Add Travel Expense Item ({selectedCurrency.code})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Dinner, Hotel, Souvenir"
                  className="sm:col-span-5 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ExpenseItem['category'])}
                  className="sm:col-span-3 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden"
                >
                  <option value="shopping">Shopping</option>
                  <option value="food">Food & Dining</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="transport">Transport</option>
                  <option value="activities">Activities</option>
                </select>
                <div className="sm:col-span-3 relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    {selectedCurrency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Amount"
                    className="w-full pl-6 pr-2 py-2 text-xs rounded-lg border border-slate-200 bg-white text-right font-mono font-medium focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <button
                  type="submit"
                  className="sm:col-span-1 p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  title="Add item"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Item List */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No expenses added yet. Add items above to calculate your total budget.
                </div>
              ) : (
                items.map((item) => {
                  const itemSgd = currentRate > 0 ? item.amountForeign / currentRate : 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                          {item.category}
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {item.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {selectedCurrency.symbol}{' '}
                            {item.amountForeign.toLocaleString('en-US', {
                              maximumFractionDigits: selectedCurrency.decimals <= 2 ? 2 : 2,
                            })}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400 tabular-nums">
                            ≈ S${itemSgd.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right 5 cols: Summary Breakdown, Singapore Customs & Card Fee Comparison */}
          <div className="lg:col-span-5 space-y-4">
            {/* Total Budget Card */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Estimated Total Trip Outlay
              </div>
              <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1 tabular-nums">
                S${totalSgdMidMarket.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-300 font-mono tabular-nums mb-4">
                = {selectedCurrency.symbol}{' '}
                {totalForeign.toLocaleString('en-US', {
                  maximumFractionDigits: selectedCurrency.decimals <= 2 ? 2 : 2,
                })}{' '}
                {selectedCurrency.code}
              </div>

              {/* Card Savings Highlight */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-300" />
                    <span>Bank Card Fee (3.25%):</span>
                  </span>
                  <span className="font-mono text-rose-300 tabular-nums">
                    +S${bankCardFeeSgd.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium">
                    Savings using Multi-Currency Card:
                  </span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    S${multiCurrencySavings.toFixed(2)} saved
                  </span>
                </div>
              </div>
            </div>

            {/* Singapore Customs GST Relief Guide */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Luggage className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Singapore Customs 9% GST Relief Check
                </h3>
              </div>

              {/* Trip Duration Selector */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setTripDuration('under48')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                    tripDuration === 'under48'
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Away &lt; 48 Hours (S$100 Relief)
                </button>
                <button
                  onClick={() => setTripDuration('over48')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                    tripDuration === 'over48'
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Away &ge; 48 Hours (S$500 Relief)
                </button>
              </div>

              {/* GST Computation */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Declared Shopping Purchases:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    S${shoppingSgd.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Customs GST Relief Allowance:</span>
                  <span className="font-mono font-semibold">
                    -S${Math.min(shoppingSgd, gstReliefThreshold).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Estimated SG Customs 9% GST Payable:</span>
                  <span className="font-mono text-rose-600">
                    {estimatedSgGst > 0 ? `S$${estimatedSgGst.toFixed(2)}` : 'S$0.00 (Exempt)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
