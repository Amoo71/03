# J.A.R.V.I.S TradeAnalyzer v2.0 Master

A responsive dark CLI-style research terminal for current multi-market discovery, conservative deep analysis and forward-test paper trading.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and add server-managed keys if desired.
3. Run `npm start`.
4. Open `http://localhost:4173`.

No third-party packages are required.

## Free deployment on Render

The repository includes a ready-to-use `render.yaml` Blueprint. Render is the recommended host for this build because the API Vault keeps short-lived sessions in server memory.

1. Open [Render](https://dashboard.render.com/) and choose **New → Blueprint**.
2. Connect the GitHub repository `Amoo71/03`.
3. Render detects `render.yaml`; confirm the free web service.
4. Deploy and open the generated `onrender.com` address.
5. Use **API Vault** on the website to connect your OpenAI key for the current session.

For a server-managed key instead, add `OPENAI_API_KEY` under **Environment** in the Render dashboard. Optional provider secrets are `CMC_API_KEY`, `COINALYZE_API_KEY` and `OPENMARKET_API_KEY`. Never commit real keys to GitHub.

Render's free web service can sleep after inactivity. A restart clears temporary API-Vault sessions, so reconnect the key when required. The paper-trading journal remains browser-local.

## API connection modes

- **Recommended production setup:** configure `OPENAI_API_KEY` and optional provider keys as server environment secrets. They never reach browser code.
- **Personal session mode:** paste keys into the API Vault. They are sent once to the same-origin server, kept only in short-lived server memory, cleared from the form immediately and removed on disconnect, expiry or restart. Use this only on a trusted device over HTTPS.

Optional direct adapters:

- `CMC_API_KEY` — CoinMarketCap higher limits. The public market strip can use the supported keyless endpoint when available.
- `COINALYZE_API_KEY` — open interest, current/predicted funding and futures context.
- `OPENMARKET_API_KEY` — Kiyotaka/OpenMarket orderflow, funding, liquidations and market points.

Arkham public intelligence is queried through the domain-restricted OpenAI web-search step. The app does not invent a private or undocumented Arkham API.

## Master Scanner

The global scanner is deliberately two-stage:

1. **Discovery:** searches current public information for a small list of candidates with genuinely independent signal types.
2. **Deep analysis:** each candidate receives the full score matrix, fresh provider checks, eToro Germany execution check, reward/risk calculation and deterministic hard-veto enforcement.

It supports global, crypto, meme-coin, equities and macro scopes. The Morning Brief preset deep-checks up to five candidates. A result reaches the alert feed only if it is executable, scores at least 82, has sufficient independent confirmations, passes eToro checks, has a clear invalidation and has a server-recalculated reward/risk of at least 2:1.

Meme-coin deep analysis includes contract/chain identity, token age and supply, holder concentration, liquidity and exit liquidity, LP state, mint/freeze controls, honeypot/taxes, deployer history, snipers/bundles, wallet clusters, manipulation and narrative context. A critical unresolved item is a hard veto.

## Monitoring and alerts

The built-in monitor repeats the selected master scan every 15, 30 or 60 minutes **only while the page remains open**. A+ setups can alert again while still live; A setups are de-duplicated. Browser notifications are optional and require permission.

True unattended 24/7 monitoring requires a hosted worker/scheduler plus durable storage. This local build never claims a permanent tick stream.

## Journal, evaluation and risk

- Every generated decision is timestamped before any later outcome evaluation.
- Exact signal levels are immutable; evaluation cannot rewrite trigger, entry, stop or target.
- The evaluator reports `UNVERIFIED` when price ordering cannot be established.
- Performance metrics use only verified closed A/A+ paper signals with a numeric R multiple.
- The position-size calculator starts from maximum acceptable loss and deducts estimated round-trip fees before calculating units.
- Real orders are never sent.

## Validation

Run:

```bash
npm run check
```

The check validates JavaScript syntax, frontend element contracts and mocked end-to-end flows for API session setup, single-asset analysis, global discovery/deep scan, A/A+ gating and paper-trade evaluation.

## Important limits

Provider availability, rate limits, plan coverage, regional eToro eligibility, spreads and fees can change. The app returns unavailable or no-trade states instead of fabricating missing live data. It is a research and paper-trading system, not financial advice, and it never guarantees profit.
