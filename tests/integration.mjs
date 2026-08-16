import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mock = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/responses") {
    const body = JSON.parse(await readBody(req));
    const name = body?.text?.format?.name;
    const result = name === "candidate_discovery" ? discoveryFixture() : name === "paper_trade_evaluation" ? evaluationFixture() : analysisFixture();
    return json(res, 200, {
      id: `resp_${name}`,
      model: "gpt-5.6",
      output: [{
        type: "message",
        content: [{
          type: "output_text",
          text: JSON.stringify(result),
          annotations: [{ type: "url_citation", title: "SEC filing", url: "https://www.sec.gov/Archives/test" }],
        }],
      }],
    });
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
    OPENAI_API_BASE: `http://127.0.0.1:${mockPort}`,
    CMC_PUBLIC_API_BASE: `http://127.0.0.1:${mockPort}`,
    CMC_PRO_API_BASE: `http://127.0.0.1:${mockPort}`,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  await waitForHealth(appPort);
  const health = await api(appPort, "/api/health");
  assert.equal(health.payload.version, "2.0.0");
  const page = await fetch(`http://127.0.0.1:${appPort}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-security-policy") || "", /default-src 'self'/);
  assert.match(await page.text(), /MASTER SCANNER/);

  const session = await api(appPort, "/api/session", { method: "POST", body: { keys: { openai: "test-key" } } });
  assert.equal(session.status, 201);
  assert.ok(session.payload.sessionToken);
  const headers = { "X-JARVIS-Session": session.payload.sessionToken };

  const direct = await api(appPort, "/api/analyze", {
    method: "POST",
    headers,
    body: { asset: "TEST", assetClass: "STOCK", language: "en", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(direct.status, 200);
  assert.equal(direct.payload.analysis.verdict, "A+");
  assert.equal(direct.payload.analysis.executable, true);
  assert.equal(direct.payload.analysis.trade.rr, 2);

  const scan = await api(appPort, "/api/scan", {
    method: "POST",
    headers,
    body: { scope: "GLOBAL", maxCandidates: 3, language: "en", sourceMode: "EXTENDED", horizon: "SWING" },
  });
  assert.equal(scan.status, 200);
  assert.equal(scan.payload.analyses.length, 1);
  assert.equal(scan.payload.alerts.length, 1);
  assert.equal(scan.payload.noTrade, false);

  const record = {
    id: "test-record",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    analysis: scan.payload.alerts[0].analysis,
  };
  const evaluation = await api(appPort, "/api/evaluate", { method: "POST", headers, body: { record } });
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
  for (const id of ["scannerForm", "scannerResults", "analysisForm", "journalList", "positionForm", "apiDialog"]) {
    assert.ok(ids.includes(id), `missing #${id}`);
    assert.ok(js.includes(`#${id}`), `frontend does not bind #${id}`);
  }
  for (const view of ["dashboard", "scanner", "analyzer", "journal", "sources"]) {
    assert.ok(html.includes(`data-view="${view}"`), `missing ${view} view`);
  }
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
      directionBias: "BUY", catalyst: "Current filing", signalTypes: ["CATALYST", "VOLUME"], reasonToResearch: "Fresh catalyst and breakout.",
    }],
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

function evaluationFixture() {
  return {
    evaluatedAt: new Date().toISOString(), status: "TARGET_REACHED", triggerReached: true, stopReached: false,
    targetReached: true, entry: "100", exit: "110", periodHigh: "111", periodLow: "99", performancePct: 10,
    rMultiple: 2, notes: ["Trigger preceded target."],
    sources: [{ name: "SEC", url: "https://www.sec.gov/Archives/test", type: "PRIMARY", freshness: "Current" }],
  };
}
