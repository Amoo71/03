import assert from "node:assert/strict";
import { createExecutionManager, readExecutionConfig } from "../execution/etoro-execution.mjs";

const nowMs = Date.UTC(2026, 7, 17, 10, 0, 0);
let openPosition = false;
let submittedRequestId = null;
let submittedOrder = null;
let submittedClose = null;
let lookupStatusId = 3;

const fetchImpl = async (input, init = {}) => {
  const url = new URL(input);
  const path = `${url.pathname}${url.search}`;
  const requestId = new Headers(init.headers).get("x-request-id");
  assert.match(requestId || "", /^[0-9a-f-]{36}$/i, "every eToro request needs a UUID request id");

  if (path.startsWith("/api/v1/market-data/search")) {
    return response({ items: [{ instrumentId: 101, internalSymbolFull: "TEST" }] });
  }
  if (path.startsWith("/api/v1/market-data/instruments/rates")) {
    return response({ rates: [{ instrumentID: 101, bid: 99.9, ask: 100, date: new Date(nowMs).toISOString() }] });
  }
  if (path === "/api/v2/trading/info/demo/eligibility") {
    return response({
      currency: "USD",
      eligibilities: [{
        instrumentId: 101,
        minPositionExposure: 10,
        allowOpenPosition: true,
        leverageConfigs: [{
          settlementType: "CFD",
          direction: "LONG",
          leverageValues: [1],
          allowStopLossTakeProfit: true,
          minStopLossPercentage: 1,
          maxStopLossPercentage: 20,
          minTakeProfitPercentage: 1,
          maxTakeProfitPercentage: 30,
        }],
      }],
    });
  }
  if (path === "/api/v2/trading/info/demo/costs") {
    return response({ costs: [{ costType: "marketSpread", amount: 0.1, currency: "USD" }], lastUpdated: new Date(nowMs).toISOString() });
  }
  if (path === "/api/v1/trading/info/demo/pnl") {
    return response({
      clientPortfolio: {
        credit: 10_000,
        unrealizedPnL: openPosition ? 2 : 0,
        positions: openPosition ? [{ positionId: 9001, instrumentId: 101, isBuy: true, amount: 100, units: 1, openRate: 100, stopLossRate: 95, takeProfitRate: 110, leverage: 1, pnL: 2, openDateTime: new Date(nowMs).toISOString() }] : [],
        ordersForOpen: [],
        mirrors: [],
      },
    });
  }
  if (path.startsWith("/api/v1/trading/info/trade/demo/history")) return response([]);
  if (path === "/api/v2/trading/execution/demo/orders" && init.method === "POST") {
    submittedRequestId = requestId;
    submittedOrder = JSON.parse(init.body);
    openPosition = true;
    return response({ orderId: 7001, referenceId: requestId });
  }
  if (path.startsWith("/api/v2/trading/info/demo/orders:lookup")) {
    return response({
      orderId: 7001,
      referenceId: submittedRequestId,
      status: { id: lookupStatusId, name: lookupStatusId === 3 ? "Filled" : "Received" },
      asset: { symbol: "TEST", instrumentId: 101, settlementType: "CFD", leverage: 1, side: "Buy" },
      positionExecutions: [{ positionId: 9001, state: "Open", remainingUnits: 0, stopLossRate: 95, takeProfitRate: 110, openingData: { avgPrice: 100, fees: 0.1, executionTime: new Date(nowMs).toISOString() } }],
      lastUpdate: new Date(nowMs).toISOString(),
    });
  }
  if (path === "/api/v1/trading/execution/demo/market-close-orders/positions/9001" && init.method === "POST") {
    submittedClose = JSON.parse(init.body);
    return response({ orderForClose: { positionID: 9001, instrumentID: 101, orderID: 8001 } });
  }
  if (path === "/api/v1/trading/info/demo/close-orders/8001") {
    openPosition = false;
    return response({ orderID: 8001, statusID: 3, instrumentID: 101, requestOccurred: new Date(nowMs).toISOString(), proceeds: 101, positions: [{ positionID: 9001, occurred: new Date(nowMs).toISOString(), rate: 101, units: 1, amount: 101 }] });
  }
  return response({ detail: `Unhandled test request: ${init.method || "GET"} ${path}` }, 404);
};

const env = {
  TRADING_MODE: "DEMO_EXCHANGE",
  ETORO_API_BASE: "https://broker.test",
  ETORO_API_KEY: "demo-api-key",
  ETORO_USER_KEY: "demo-user-key",
  OPERATOR_PASSWORD: "correct-horse-battery",
  SESSION_SECRET: "session-secret-that-is-at-least-32-characters",
  EXECUTION_SIGNING_SECRET: "ticket-secret-that-is-at-least-32-characters",
  EXECUTION_ALLOWED_SYMBOLS: "TEST",
  EXCHANGE_WRITES_ENABLED: "true",
  EXECUTION_KILL_SWITCH: "false",
  EXECUTION_MAX_ORDER_USD: "200",
  EXECUTION_MAX_OPEN_POSITIONS: "1",
  EXECUTION_MAX_DAILY_LOSS_USD: "25",
  EXECUTION_MAX_SPREAD_PCT: "0.5",
  EXECUTION_MAX_ENTRY_DEVIATION_PCT: "1",
};

assert.equal(readExecutionConfig({}).mode, "PAPER", "unknown deployments must default to PAPER");
assert.equal(readExecutionConfig({ TRADING_MODE: "LIVE" }).killSwitchOnBoot, true, "LIVE must boot with its kill switch on by default");

const manager = createExecutionManager({ env, fetchImpl, now: () => nowMs });
assert.equal(manager.publicStatus(false).mode, "DEMO_EXCHANGE");
assert.equal(manager.publicStatus(false).authenticated, false);
assert.doesNotMatch(JSON.stringify(manager.publicStatus(false)), /demo-api-key|demo-user-key|correct-horse-battery/);

const session = manager.login("correct-horse-battery");
assert.equal(manager.verifySession(session), true);
assert.equal(manager.verifySession(`${session}tampered`), false);

const issued = manager.issueTicket({
  executable: true,
  verdict: "A+",
  direction: "BUY",
  asset: "TEST",
  assetClass: "STOCK",
  score: 94,
  dataAsOf: new Date(nowMs).toISOString(),
  trade: { trigger: 99, triggerCondition: "AT_OR_ABOVE", entry: 100, stop: 95, target: 110, rr: 2 },
});
assert.equal(issued.eligible, true);
await assert.rejects(() => manager.preview({ ticket: `${issued.ticket}x`, amountUsd: 100 }), (error) => error.code === "INVALID_EXECUTION_TICKET");

const preview = await manager.preview({ ticket: issued.ticket, amountUsd: 100 });
assert.equal(preview.ready, true);
assert.equal(preview.market.entryRate, 100);
assert.equal(preview.order.leverage, 1);
assert.equal(preview.costs.totalKnownUsd, 0.1);

await assert.rejects(
  () => manager.execute({ ticket: issued.ticket, amountUsd: 100, previewId: preview.previewId, confirmation: "EXECUTE DEMO TEST" }),
  (error) => error.code === "EXECUTION_NOT_ARMED"
);

await manager.arm("ARM DEMO");
const result = await manager.execute({ ticket: issued.ticket, amountUsd: 100, previewId: preview.previewId, confirmation: "EXECUTE DEMO TEST" });
assert.equal(result.state, "FILLED");
assert.equal(submittedRequestId, issued.signal.id, "the signed signal id must be reused as broker idempotency key");
assert.deepEqual(submittedOrder, {
  action: "open",
  transaction: "buy",
  instrumentId: 101,
  orderType: "mkt",
  leverage: 1,
  amount: 100,
  orderCurrency: "usd",
  stopLossRate: 95,
  takeProfitRate: 110,
  stopLossType: "fixed",
});

await manager.arm("ARM DEMO");
await assert.rejects(
  () => manager.execute({ ticket: issued.ticket, amountUsd: 100, previewId: preview.previewId, confirmation: "EXECUTE DEMO TEST" }),
  (error) => error.code === "DUPLICATE_EXECUTION"
);

const close = await manager.closePosition({ positionId: 9001, confirmation: "CLOSE POSITION 9001" });
assert.equal(close.state, "CLOSED");
assert.deepEqual(submittedClose, { InstrumentID: 101, UnitsToDeduct: null });
assert.equal((await manager.reconcile()).openPositionCount, 0);
assert.equal(manager.activateKillSwitch().killSwitch, true);
await assert.rejects(() => manager.clearKillSwitch("CLEAR KILL SWITCH"), (error) => error.code === "KILL_SWITCH_CONFIRMATION_REQUIRED");
assert.equal((await manager.clearKillSwitch("CLEAR DEMO KILL SWITCH")).killSwitch, false);

const riskCapped = createExecutionManager({ env: { ...env, EXECUTION_MAX_RISK_USD: "4" }, fetchImpl, now: () => nowMs });
const riskTicket = riskCapped.issueTicket({
  executable: true, verdict: "A+", direction: "BUY", asset: "TEST", assetClass: "STOCK", score: 94,
  dataAsOf: new Date(nowMs).toISOString(), trade: { trigger: 99, triggerCondition: "AT_OR_ABOVE", entry: 100, stop: 95, target: 110, rr: 2 },
});
const blockedByRisk = await riskCapped.preview({ ticket: riskTicket.ticket, amountUsd: 100 });
assert.equal(blockedByRisk.ready, false);
assert.ok(blockedByRisk.blockers.some((value) => value.includes("Estimated stop risk")));

const liveWithoutOptIn = createExecutionManager({ env: { ...env, TRADING_MODE: "LIVE", LIVE_TRADING_ENABLED: "false" }, fetchImpl, now: () => nowMs });
await assert.rejects(() => liveWithoutOptIn.arm("ARM LIVE"), (error) => error.code === "LIVE_TRADING_DISABLED");

const outcomeUnknown = createExecutionManager({
  env,
  now: () => nowMs,
  fetchImpl: async (input, init = {}) => {
    if (new URL(input).pathname === "/api/v2/trading/execution/demo/orders" && init.method === "POST") {
      return response({ detail: "temporary broker failure" }, 503);
    }
    return fetchImpl(input, init);
  },
});
const unknownTicket = outcomeUnknown.issueTicket({
  executable: true, verdict: "A+", direction: "BUY", asset: "TEST", assetClass: "STOCK", score: 94,
  dataAsOf: new Date(nowMs).toISOString(), trade: { trigger: 99, triggerCondition: "AT_OR_ABOVE", entry: 100, stop: 95, target: 110, rr: 2 },
});
const unknownPreview = await outcomeUnknown.preview({ ticket: unknownTicket.ticket, amountUsd: 100 });
await outcomeUnknown.arm("ARM DEMO");
await assert.rejects(
  () => outcomeUnknown.execute({ ticket: unknownTicket.ticket, amountUsd: 100, previewId: unknownPreview.previewId, confirmation: "EXECUTE DEMO TEST" }),
  (error) => error.code === "BROKER_OUTCOME_UNKNOWN"
);
assert.equal(outcomeUnknown.publicStatus(true).executionLocked, true, "an ambiguous broker response must fail closed");
assert.equal(outcomeUnknown.publicStatus(true).lastOrder.referenceId, unknownTicket.signal.id, "the idempotency reference must remain recoverable");
lookupStatusId = 3;
await outcomeUnknown.lookupOrder({ referenceId: unknownTicket.signal.id });
await outcomeUnknown.arm("ARM DEMO");
await assert.rejects(
  () => outcomeUnknown.execute({ ticket: unknownTicket.ticket, amountUsd: 100, previewId: unknownPreview.previewId, confirmation: "EXECUTE DEMO TEST" }),
  (error) => error.code === "DUPLICATE_EXECUTION"
);

openPosition = false;
const pendingManager = createExecutionManager({ env, fetchImpl, now: () => nowMs });
const pendingTicket = pendingManager.issueTicket({
  executable: true, verdict: "A+", direction: "BUY", asset: "TEST", assetClass: "STOCK", score: 94,
  dataAsOf: new Date(nowMs).toISOString(), trade: { trigger: 99, triggerCondition: "AT_OR_ABOVE", entry: 100, stop: 95, target: 110, rr: 2 },
});
const pendingPreview = await pendingManager.preview({ ticket: pendingTicket.ticket, amountUsd: 100 });
await pendingManager.arm("ARM DEMO");
lookupStatusId = 1;
assert.equal((await pendingManager.execute({ ticket: pendingTicket.ticket, amountUsd: 100, previewId: pendingPreview.previewId, confirmation: "EXECUTE DEMO TEST" })).state, "SUBMITTED_PENDING");
assert.equal(pendingManager.publicStatus(true).executionLocked, true);
lookupStatusId = 3;
await pendingManager.lookupOrder({ orderId: 9999 });
assert.equal(pendingManager.publicStatus(true).executionLocked, true, "an unrelated order lookup must not clear the execution lock");
await pendingManager.lookupOrder({ orderId: 7001 });
assert.equal(pendingManager.publicStatus(true).executionLocked, false, "the tracked order's terminal status may clear its lock");

process.stdout.write("J.A.R.V.I.S execution checks passed.\n");

function response(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json" } });
}
