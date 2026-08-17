# J.A.R.V.I.S TradeAnalyzer v2.2.1 Master

A responsive dark CLI-style research terminal for current multi-market discovery, conservative deep analysis and forward-test paper trading.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and add the server-managed secrets.
3. Run `npm start`.
4. Open `http://localhost:4173`.

No third-party packages are required.

## Free deployment on Render

The repository includes a ready-to-use `render.yaml` Blueprint. Every credential stays in Render's protected server environment; the website contains no key form, API vault or browser-side secret storage.

1. Open [Render](https://dashboard.render.com/) and choose **New → Blueprint**.
2. Connect the GitHub repository `Amoo71/03`.
3. Render detects `render.yaml`. Enter `OPENROUTER_API_KEY` and `HUGGINGFACE_API_KEY` in the protected secret fields. Add the optional market-data keys when available.
4. Deploy and open the generated `onrender.com` address.
5. The header shows `ANALYZER READY` when at least one server-side AI provider is configured.

The secret entries use `sync: false`: Render requests the values during Blueprint setup and never writes them to GitHub. Never commit real keys to the repository or paste them into the website.

Render's free web service can sleep after inactivity. The paper-trading journal remains browser-local.

## Server-side AI providers

- `OPENROUTER_API_KEY` — preferred provider. The default model is the zero-cost `openrouter/free` router.
- `HUGGINGFACE_API_KEY` — automatic fallback. `HF_TOKEN` is also accepted. The default model is `openai/gpt-oss-120b:fastest`, letting Hugging Face select a currently available fast inference provider.
- `AI_PROVIDER` — optional priority override: `openrouter` (default) or `huggingface`.
- `OPENROUTER_MODEL` / `HUGGINGFACE_MODEL` — optional model overrides.
- `OPENROUTER_FALLBACK_MODELS` — optional comma-separated model fallbacks. OpenRouter tries them in order when the primary model is unavailable or rate-limited.
- `OPENROUTER_WEB_SEARCH` — `true` by default for current, domain-restricted research.

Claude is available through OpenRouter, not through Hugging Face. To use it, set `OPENROUTER_MODEL=~anthropic/claude-sonnet-latest` in Render and keep `OPENROUTER_FALLBACK_MODELS=openrouter/free`. Claude usage can be paid and is never presented as free. The default remains the free OpenRouter router with Hugging Face fallback.

If OpenRouter is rate-limited or unavailable, a request automatically retries through Hugging Face. Hugging Face fallback has no attached web-search tool and may use only the direct server data; the hard-veto layer therefore returns insufficient data instead of inventing current facts.

Free provider allowances and rate limits are controlled by OpenRouter and Hugging Face and can change. OpenRouter's web-search plugin can consume separate search credits even when the selected model is free.

## Optional market-data secrets

Optional direct adapters:

- `CMC_API_KEY` — CoinMarketCap higher limits. The public market strip can use the supported keyless endpoint when available.
- `COINALYZE_API_KEY` — open interest, current/predicted funding and futures context.
- `OPENMARKET_API_KEY` — Kiyotaka/OpenMarket orderflow, funding, liquidations and market points.

Coinbase Exchange and Kraken public market-data APIs require no key and are always queried for supported crypto assets. They provide direct ticker/candle data and top-of-book coverage. The server normalizes pair forms such as `BTC-USD`, `BTC/USD`, `BTCUSDT` and `XBTUSD`, reconciles exchange prices, replaces model estimates with verified raw values and hard-vetoes material cross-exchange conflicts.

Arkham public intelligence is queried through the domain-restricted OpenRouter web-research step when enabled. The app does not invent a private or undocumented Arkham API.

## Master Scanner

The global scanner is deliberately two-stage:

1. **Discovery:** searches current public information for a small list of candidates with genuinely independent signal types.
2. **Deep analysis:** each candidate receives the full score matrix, fresh provider checks, eToro Germany execution check, reward/risk calculation and deterministic hard-veto enforcement.

Discovery candidates are now rejected before deep analysis unless they provide fresh, source-linked and genuinely independent signal families. Price movement, volume, momentum, breakout and technical labels count as one family; market cap, rank and dominance never establish a trade candidate by themselves. The UI shows rejected discovery items separately and never renders raw model Markdown as a market result.

It supports global, crypto, meme-coin, equities and macro scopes. The Morning Brief preset deep-checks up to five candidates. A result reaches the alert feed only if it is executable, scores at least 82, has sufficient independent confirmations, passes eToro checks, has a clear invalidation and has a server-recalculated reward/risk of at least 2:1.

Only URLs actually returned as web-search citations plus direct server-provider sources are accepted into the final evidence list. Model-written source links are discarded. eToro Germany cannot be marked confirmed without a retrieved eToro citation.

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

The check validates JavaScript syntax, frontend element contracts, absence of browser key inputs, OpenRouter-to-Hugging-Face failover, single-asset analysis, global discovery/deep scan, A/A+ gating and paper-trade evaluation.

## Important limits

Provider availability, rate limits, plan coverage, regional eToro eligibility, spreads and fees can change. The app returns unavailable or no-trade states instead of fabricating missing live data. It is a research and paper-trading system, not financial advice, and it never guarantees profit.
