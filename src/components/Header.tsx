interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
  onOpenMasGuide: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Header({
  onOpenAlerts,
  onOpenMasGuide,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('converter')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-sm shadow-xs group-hover:bg-rose-700 transition-colors">
              S$
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                SingaFX
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('converter')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Converter
          </button>
          <button
            onClick={() => onNavigate('money-changers')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Money Changers
          </button>
          <button
            onClick={() => onNavigate('matrix')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Rates Matrix
          </button>
          <button
            onClick={() => onNavigate('travel-calc')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Travel Calculator
          </button>
          <button
            onClick={onOpenMasGuide}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>S$NEER Guide</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAlerts}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Rate Alerts</span>
          </button>
        </div>
      </div>
    </header>
  );
}
