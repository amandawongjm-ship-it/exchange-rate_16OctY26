# SingaFX Project Chat History & Prompts

Exported project conversation and prompt log for **SingaFX (Singapore Exchange Rate Tool)**.

---

## Session Overview
- **Project**: SingaFX - Singapore Real-Time SGD Exchange Rate Tool & MAS API Integration
- **Framework**: React 19, TypeScript, Vite, Tailwind CSS v4, Express Serverless API handlers
- **Created Date**: 16 October 2026

---

## Turn 1: Initial Application Specification

### User Prompt
```text
build a singapore-based exchange rate tool that provides real-time currency conversions for sgd against global currencies

build just front end for now. i will add server keys later
```

### Action Taken
- Initialized project configuration, metadata, and design tokens adhering to Singapore financial institutional standards.
- Designed and built **SingaFX**:
  1. **SGD Real-Time Currency Converter**: Real-time mid-market rate calculation with reciprocal rates, quick Singapore Dollar denomination buttons (S$100, S$500, S$1,000, S$2,500, S$5,000), and currency switcher.
  2. **Singapore Money Changer Comparison Engine**: Direct side-by-side spread and payout comparison for physical cash money changers (*The Arcade @ Raffles Place*, *Mustafa Centre 24/7*, *People's Park Complex Chinatown*), digital travel wallets (*YouTrip, Revolut, Trust Bank*), local retail banks (*DBS, OCBC, UOB*), and *Changi Airport* counters.
  3. **Global Currency Matrix & Watchlist**: 25+ global currencies with ASEAN, East Asia, Major, and Remittance categorization, unit multiplier quotes (e.g. 100 JPY, 1,000 IDR), and local storage favorites.
  4. **Overseas Travel Budget & Customs GST Relief Calculator**: Expense basket calculator with bank credit card 3.25% FX fee breakdown vs 0% multi-currency card savings, plus Singapore Customs 9% GST relief allowance checker (<48h: S$100 relief; ≥48h: S$500 relief).
  5. **Historical Trend Visualizer**: Interactive SVG chart with 7D, 30D, 90D, and 1Y ranges, plus 52-week SGD strength continuum.
  6. **Rate Alert Tracker**: Browser-persistent target rate watcher.
  7. **MAS S$NEER Policy Explainer**: Guide detailing the Singapore Dollar Nominal Effective Exchange Rate band (Slope, Width, Mid-point) and the 1967 Singapore-Brunei 1:1 Currency Interchangeability Agreement.

---

## Turn 2: Git Repository Setup & Push Attempt

### User Prompt
```text
git push https://https://github.com/amandawongjm-ship-it/psi_16OctY26_Morning.git@https://github.com/amandawongjm-ship-it/exchange-rate_16OctY26.git
```

### Action Taken
- Initialized local Git repository at project root.
- Staged all files and created initial commit: `feat: initial Singapore exchange rate tool (SingaFX)`.
- Set branch name to `main`.
- Added remote origin: `https://github.com/amandawongjm-ship-it/exchange-rate_16OctY26.git`.
- Attempted `git push -u origin main`.
- GitHub reported authentication required (`fatal: could not read Username for 'https://github.com': No such device or address`).
- Documented authentication step with Personal Access Token (PAT).

---

## Turn 3: Monetary Authority of Singapore (MAS) API Catalogue Integration

### User Prompt
```text
1. add a serverless API connection that pulls live data from MAS API cataglogue using the following end point:

GET https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily?end_of_day=2026-10-14

2. store this in /api folder at the project root level not the src folder
3. include a /health.ts and /exchangerates.ts within the same subfolder
4. do NOT hardcode any API key, i will manually include them
```

### Action Taken
- Created root-level `/api` folder (separate from `/src`).
- Built `/api/health.ts`:
  - Returns service status, timestamp, uptime, and configuration status of `MAS_API_KEY`.
- Built `/api/exchangerates.ts`:
  - Connects to the official MAS API Catalogue endpoint:
    `https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily`
  - Accepts dynamic `end_of_day` and `limit` query parameters, defaulting to `2026-10-14`.
  - Zero hardcoded API keys: dynamically extracts keys from `process.env.MAS_API_KEY`, request headers (`x-mas-api-key`, `apikey`, `Authorization: Bearer`), or query parameters.
  - Passes required headers to the MAS Vordel API Gateway and returns normalized JSON responses with troubleshooting hints if unauthenticated.
- Created `/server.ts` Express entry point mounting both `/api/health` and `/api/exchangerates` serverless handlers alongside Vite SPA development middleware.
- Updated `package.json` with `"dev": "tsx server.ts"` and `"start": "tsx server.ts"`.
- Updated `.env.example` to document `MAS_API_KEY`.

---

## Turn 4: Export Chat as PROMPTS.MD

### User Prompt
```text
export this chat as a .md file as PROMPTS.MD
```

### Action Taken
- Exported the complete conversation history, specifications, technical decisions, and code architecture to `PROMPTS.MD` at the project root.
