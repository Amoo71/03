import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let openRouterFailuresRemaining = 1;
let openRouterModelsObserved = false;
const requestedCmcSymbols = [];
const mock = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url?.endsWith("/chat/completions")) {
    if (req.url.startsWith("/openrouter/") && openRouterFailuresRemaining > 0) {
      openRouterFailuresRemaining -= 1;
      return json(res, 429, { error: { message: "test rate limit" } });
    }
    const body = JSON.parse(await readBody(req));
    if (req.url.startsWith("/openrouter/") && Array.isArray(body.models)) openRouterModelsObserved = body.models.includes("openrouter/free-backup");
    const name = body?.response_format?.json_schema?.name;
    const prompt = body?.messages?.map((message) => message.content).join("\n") || "";
    const result = name === "candidate_discovery" ? (prompt.includes('"scope":"CRYPTO"') ? badDiscoveryFixture() : discoveryFixture()) : name === "paper_trade_evaluation" ? evaluationFixture() : prompt.includes('"asset":"BTC-USD"') ? cryptoAnalysisFixture() : analysisFixture();
    return json(res, 200, {
      id: `chat_${name}`,
      model: req.url.startsWith("/hf/") ? "openai/gpt-oss-120b" : "openrouter/free-test",
      choices: [{ message: {
        role: "assistant",
        content: JSON.stringify(result),
        annotations: [
          { type: "url_citation", url_citation: { title: "SEC filing", url: "https://www.sec.gov/Archives/test" } },
          { type: "url_citation", url_citation: { title: "eToro market", url: "https://www.etoro.com/markets/test" } },
        ],
      } }],
    });
  }
  if (req.url?.includes("/cryptocurrency/quotes/latest")) {
    const requestUrl = new URL(req.url, "http://mock.local");
    const symbol = requestUrl.searchParams.get("symbol");
    requestedCmcSymbols.push(symbol);
    if (symbol !== "BTC") return json(res, 200, { data: {} });
    return json(res, 200, { data: { BTC: [{ symbol: "BTC", name: "Bitcoin", quote: { USD: { price: 100000, percent_change_24h: 1.25, volume_24h: 50_000_000_000, market_cap: 2_000_000_000_000, fully_diluted_market_cap: 2_100_000_000_000 } } }] } });
  }
  if (req.url?.startsWith("/coinbase/products/BTC-USD/ticker")) {
    return json(res, 200, { price: "100000", bid: "99995", ask: "100005", volume: "25000", time: new Date().toISOString() });
  }
  if (req.url?.startsWith("/coinbase/products/BTC-USD/candles")) {
    const now = Math.floor(Date.now() / 3_600_000) * 3_600;
    return json(res, 200, Array.from({ length: 30 }, (_, index) => [now - index * 3600, 98_000 + index, 100_100, 98_500, 100_000 - index * 20, 900 + index]));
  }
  if (req.url?.startsWith("/coinbase/products/BTC-USD/book")) {
    return json(res, 200, { sequence: 1, bids: [["99995", "1.2", 3]], asks: [["100005", "1.1", 2]] });
  }
  if (req.url?.startsWith("/kraken/0/public/Ticker")) {
    return json(res, 200, { error: [], result: { XXBTZUSD: { a: ["100006"], b: ["99994"], c: ["100001"], v: ["12000", "24000"] } } });
  }
  if (req.url?.startsWith("/kraken/0/public/OHLC")) {
    const now = Math.floor(Date.now() / 3_600_000) * 3_600;
    return json(res, 200, { error: [], result: { XXBTZUSD: Array.from({ length: 30 }, (_, index) => [now - (29 - index) * 3600, "98500", "100100", "98000", String(99_400 + index * 20), "99500", "800", 10]), last: now } });
  }
  if (req.url?.includes("/cryptocurrency/listings/latest")) {
    return json(res, 200, { data: [{ symbol: "BTC", name: "Bitcoin", quote: { USD: { price: 100000, percent_change_24h: 1.2, market_cap: 2_000_000_000_000 } } }] });
  }
  if (req.url?.includes("/global-metrics/quotes/latest")) {
    return json(res, 200, { data: { btc_dominance: 55, quote: { USD: { total_market_cap: 3_000_000_000_000 } } } });
  }
  if (req.url?.includes("/fear-and-greed/latest")) {
    return json(res, 200, { data: [{ value: 60, value_classification: "Greed" }] });
  }
  json(res, 404, { error: "not found" });
});

await new Promise((resolve) => mock.listen(0, "127.0.0.1", resolve));
const mockPort = mock.address().port;
const appPort = 44000 + Math.floor(Math.random() * 1000);
const app = spawn(process.execPath, ["server.mjs"], {
  cwd: root,
  env: {
    ...process.env,
    PORT: String(appPort),
    OPENROUTER_API_KEY: "openrouter-test-key",
    HUGGINGFACE_API_KEY: "huggingface-test-key",
    OPENROUTER_API_BASE: `http://127.0.0.1:${mockPort}/openrouter`,
    HUGGINGFACE_API_BASE: `http://127.0.0.1:${mockPort}/hf`,
    OPENROUTER_MODEL: "openrouter/free",
    OPENROUTER_FALLBACK_MODELS: "openrouter/free-backup",
    HUGGINGFACE_MODEL: "openai/gpt-oss-120b",
    CMC_PUBLIC_API_BASE: `http://127.0.0.1:${mockPort}`,
    CMC_PRO_API_BASE: `http://127.0.0.1:${mockPort}`,
    COINBASE_EXCHANGE_API_BASE: `http://127.0.0.1:${mockPort}/coinbase`,
    KRAKEN_API_BASE: `http://127.0.0.1:${mockPort}/kraken`,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  await waitForHealth(appPort);
  const health = await api(appPort, "/api/health");
  assert.equal(health.payload.version, "2.2.1");
  const config = await api(appPort, "/api/config");
  assert.equal(config.payload.analyzer.ready, true);
  assert.equal(config.payload.analyzer.primary, "openrouter");
  assert.equal(config.payload.analyzer.fallback, "huggingface");
  const page = await fetch(`http://127.0.0.1:${appPort}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-security-policy") || "", /default-src 'self'/);
  const html = await page.text();
  assert.match(html, /MASTER SCANNER/);
  assert.doesNotMatch(html, /API Vault|apiDialog|type="password"|data-open-api/);

  const fallback = await api(appPort, "/api/analyze", {
    method: "POST",
    body: { asset: "TEST", assetClass: "STOCK", language: "en", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(fallback.status, 200);
  assert.equal(fallback.payload.meta.provider, "huggingface", "Hugging Face must take over after the simulated OpenRouter limit");
  assert.equal(fallback.payload.meta.webResearch, false);
  assert.equal(fallback.payload.analysis.executable, false, "A non-browsing fallback cannot certify model-supplied sources");
  assert.equal(fallback.payload.analysis.verdict, "INSUFFICIENT_DATA");

  const direct = await api(appPort, "/api/analyze", {
    method: "POST",
    body: { asset: "TEST", assetClass: "STOCK", language: "en", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(direct.status, 200);
  assert.equal(direct.payload.analysis.verdict, "A+");
  assert.equal(direct.payload.analysis.executable, true);
  assert.equal(direct.payload.analysis.trade.rr, 2);
  assert.equal(direct.payload.meta.provider, "openrouter");
  assert.equal(direct.payload.meta.webResearch, true);
  assert.equal(openRouterModelsObserved, true, "OpenRouter model fallback routing must be enabled when configured");

  const crypto = await api(appPort, "/api/analyze", {
    method: "POST",
    body: { asset: "BTC-USD", assetClass: "CRYPTO", language: "de", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(crypto.status, 200);
  assert.equal(requestedCmcSymbols.at(-1), "BTC", "BTC-USD must resolve to the BTC base asset");
  assert.equal(crypto.payload.providerStatus.coinmarketcap.status, "ok");
  assert.equal(crypto.payload.providerStatus.coinbase.status, "ok");
  assert.equal(crypto.payload.providerStatus.kraken.status, "ok");
  assert.equal(crypto.payload.analysis.marketData.price, "$100,000");
  assert.equal(crypto.payload.analysis.marketData.change24h, "+1.25%");
  assert.equal(crypto.payload.analysis.executable, false, "direct prices alone must never create a signal");

  const scan = await api(appPort, "/api/scan", {
    method: "POST",
    body: { scope: "GLOBAL", maxCandidates: 3, language: "en", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(scan.status, 200);
  assert.equal(scan.payload.analyses.length, 1);
  assert.equal(scan.payload.alerts.length, 1);
  assert.equal(scan.payload.noTrade, false);

  const rejectedScan = await api(appPort, "/api/scan", {
    method: "POST",
    body: { scope: "CRYPTO", maxCandidates: 3, language: "de", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(rejectedScan.status, 200);
  assert.equal(rejectedScan.payload.discovery.candidates.length, 0, "price-only discovery candidates must be rejected before deep analysis");
  assert.equal(rejectedScan.payload.discovery.rejectedCandidates.length, 3);
  assert.equal(rejectedScan.payload.analyses.length, 0);
  assert.equal(rejectedScan.payload.noTrade, true);
  assert.equal(rejectedScan.payload.discovery.summary, "Kein Kandidat erfüllt aktuell die Quellen- und Konfluenzregeln. Kein Trade.");
  assert.doesNotMatch(rejectedScan.payload.discovery.summary, /[*#\[]/, "scanner summary must be concise plain text");

  const record = {
    id: "test-record",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    analysis: scan.payload.alerts[0].analysis,
  };
  const evaluation = await api(appPort, "/api/evaluate", { method: "POST", body: { record } });
  assert.equal(evaluation.status, 200);
  assert.equal(evaluation.payload.evaluation.status, "TARGET_REACHED");
  assert.equal(evaluation.payload.evaluation.rMultiple, 2);

  await validateFrontendContracts();
  process.stdout.write("J.A.R.V.I.S integration checks passed.\n");
} finally {
  app.kill("SIGTERM");
  await Promise.race([once(app, "exit"), new Promise((resolve) => setTimeout(resolve, 1500))]);
  await new Promise((resolve) => mock.close(resolve));
}

async function validateFrontendContracts() {
  const [html, js] = await Promise.all([
    readFile(path.join(root, "public/index.html"), "utf8"),
    readFile(path.join(root, "public/app.js"), "utf8"),
  ]);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML ids must be unique");
  for (const id of ["scannerForm", "scannerResults", "analysisForm", "journalList", "positionForm", "engineStatus"]) {
    assert.ok(ids.includes(id), `missing #${id}`);
    assert.ok(js.includes(`#${id}`), `frontend does not bind #${id}`);
  }
  for (const view of ["dashboard", "scanner", "analyzer", "journal", "sources"]) {
    assert.ok(html.includes(`data-view="${view}"`), `missing ${view} view`);
  }
  assert.equal((html.match(/class="mobile-icon"/g) || []).length, 5, "every mobile tab needs an icon");
  assert.match(js, /candidate-card diagnostic/, "insufficient-data candidates need a compact diagnostic state");
  assert.match(js, /provider-health/, "provider health must be visible in the result UI");
  const selectorIds = [...js.matchAll(/querySelector\(["']#([A-Za-z][\w-]*)["']\)/g)].map((match) => match[1]);
  for (const id of selectorIds) assert.ok(ids.includes(id), `JavaScript binds missing #${id}`);
  const translationKeys = [...html.matchAll(/data-i18n(?:-html)?="([A-Za-z][\w]*)"/g)].map((match) => match[1]);
  for (const key of new Set(translationKeys)) {
    const count = [...js.matchAll(new RegExp(`\\b${key}:`, "g"))].length;
    assert.ok(count >= 2, `missing bilingual translation for ${key}`);
  }
}

async function api(port, pathname, { method = "GET", headers = {}, body } = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
    method,
    headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, payload: await response.json() };
}

async function waitForHealth(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("App server did not start.");
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function discoveryFixture() {
  return {
    dataAsOf: new Date().toISOString(),
    marketTrend: "RISK_ON",
    summary: "One independently confirmed test candidate.",
    candidates: [{
      asset: "TEST", assetName: "Test Corporation", assetClass: "STOCK", contract: null, chain: null,
      directionBias: "BUY", catalyst: "Current filing",
      signals: [
        { type: "CATALYST", evidence: "A current filing provides a primary event catalyst.", sourceUrl: "https://www.sec.gov/Archives/test" },
        { type: "ETORO_EXECUTION", evidence: "The instrument page confirms venue coverage for execution research.", sourceUrl: "https://www.etoro.com/markets/test" },
      ],
      reasonToResearch: "Fresh catalyst and independently verified execution coverage.",
    }],
    noSetupReason: null,
  };
}

function badDiscoveryFixture() {
  const priceSignal = (asset) => [{
    type: "PRICE_VOLUME_MOMENTUM",
    evidence: `${asset} has a positive 24-hour price change and large market capitalization.`,
    sourceUrl: `https://coinmarketcap.com/currencies/${asset.toLowerCase()}/`,
  }];
  return {
    dataAsOf: new Date().toISOString(),
    marketTrend: "UNKNOWN",
    summary: "**Scanning Results** ### BTC and ETH lead; HYPE is excluded but returned anyway.",
    candidates: [
      { asset: "BTC", assetName: "Bitcoin", assetClass: "CRYPTO", contract: null, chain: null, directionBias: "BUY", catalyst: "Market dominance", signals: priceSignal("bitcoin"), reasonToResearch: "Large market cap." },
      { asset: "ETH", assetName: "Ethereum", assetClass: "CRYPTO", contract: null, chain: null, directionBias: "BUY", catalyst: "Relative price gain", signals: priceSignal("ethereum"), reasonToResearch: "Positive 24-hour move." },
      { asset: "HYPE", assetName: "Hyperliquid", assetClass: "MEME", contract: null, chain: null, directionBias: "WATCH", catalyst: "Rank", signals: priceSignal("hyperliquid"), reasonToResearch: "Does not meet the meme threshold." },
    ],
    noSetupReason: null,
  };
}

function analysisFixture() {
  return {
    asset: "TEST", assetName: "Test Corporation", assetClass: "STOCK", dataAsOf: new Date().toISOString(),
    marketTrend: "RISK_ON", headline: "Verified paper setup", score: 90, verdict: "A+", direction: "BUY", confidence: "HIGH",
    etoro: { status: "CONFIRMED", instrument: "Underlying stock", buyAvailable: true, sellAvailable: true, costNotes: "Spread applies; no CFD overnight fee for unleveraged BUY." },
    trade: { trigger: "100", entry: "100", stop: "95", target: "110", rr: 2, risk: "MEDIUM", invalidation: "Close below 95." },
    why: ["Fresh filing", "Volume breakout"],
    confirmations: [{ type: "CATALYST", evidence: "Current filing" }, { type: "PRICE_VOLUME", evidence: "Independent breakout" }],
    redFlags: ["Broad-market reversal"], hardVetoes: [],
    scoreBreakdown: { catalyst: 15, technical: 14, derivatives: 10, smartMoney: 11, execution: 10, traderConsensus: 10, riskReward: 10, dataQuality: 10 },
    marketData: { price: "$100", change24h: "+3%", volume24h: "$10M", marketCap: "$1B", fdv: null, liquidity: "High", openInterest: null, fundingRate: null, liquidations24h: null, timeframes: [] },
    memeDueDiligence: { applies: false, contract: null, chain: null, tokenAge: null, supply: null, holders: null, top10Share: null, top20Share: null, teamShare: null, creatorShare: null, liquidity: null, exitLiquidity: null, lpStatus: null, mintAuthority: null, freezeAuthority: null, honeypot: null, taxes: null, deployerHistory: null, sniperBundledRisk: null, walletClusters: null, manipulationRisk: null, socialNarrative: null, criticalRedFlag: false, notes: [] },
    dataQuality: { freshness: "Current", sourcesChecked: 2, conflicts: [], limitations: [] },
    sources: [
      { name: "SEC", url: "https://www.sec.gov/Archives/test", type: "PRIMARY", freshness: "Current" },
      { name: "eToro", url: "https://www.etoro.com/markets/test", type: "RAW_DATA", freshness: "Current" },
    ],
  };
}

function cryptoAnalysisFixture() {
  const fixture = analysisFixture();
  return {
    ...fixture,
    asset: "BTC-USD",
    assetName: "Bitcoin",
    assetClass: "CRYPTO",
    headline: "Market data available; no independently confirmed trade setup.",
    score: 0,
    verdict: "INSUFFICIENT_DATA",
    direction: "NONE",
    confidence: "LOW",
    etoro: { status: "UNCONFIRMED", instrument: null, buyAvailable: null, sellAvailable: null, costNotes: "Not verified." },
    trade: { trigger: null, entry: null, stop: null, target: null, rr: null, risk: "UNKNOWN", invalidation: "" },
    why: ["No independent setup confirmation"],
    confirmations: [],
    redFlags: ["Execution is not verified"],
    hardVetoes: [],
    scoreBreakdown: { catalyst: 0, technical: 0, derivatives: 0, smartMoney: 0, execution: 0, traderConsensus: 0, riskReward: 0, dataQuality: 0 },
    marketData: { price: null, change24h: null, volume24h: null, marketCap: null, fdv: null, liquidity: null, openInterest: null, fundingRate: null, liquidations24h: null, timeframes: [] },
    dataQuality: { freshness: "Unknown", sourcesChecked: 0, conflicts: [], limitations: ["No derivatives confirmation"] },
    sources: [],
  };
}

function evaluationFixture() {
  return {
    evaluatedAt: new Date().toISOString(), status: "TARGET_REACHED", triggerReached: true, stopReached: false,
    targetReached: true, entry: "100", exit: "110", periodHigh: "111", periodLow: "99", performancePct: 10,
    rMultiple: 2, notes: ["Trigger preceded target."],
    sources: [{ name: "SEC", url: "https://www.sec.gov/Archives/test", type: "PRIMARY", freshness: "Current" }],
  };
}
