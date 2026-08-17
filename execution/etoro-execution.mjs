import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const VALID_MODES = new Set(["PAPER", "DEMO_EXCHANGE", "LIVE"]);
const TERMINAL_ORDER_STATUS_IDS = new Set([3, 4, 5, 10]);

export function createExecutionManager({ env = process.env, fetchImpl = globalThis.fetch, now = () => Date.now() } = {}) {
  const config = readExecutionConfig(env);
  const runtime = {
    armedUntil: 0,
    armedMode: null,
    armId: null,
    killSwitch: config.killSwitchOnBoot,
    executionLocked: false,
    lockReason: null,
    inFlight: false,
    lastReconciliation: null,
    lastOrder: null,
    previews: new Map(),
    executedTickets: new Map(),
  };

  function publicStatus(authenticated = false) {
    purgeRuntime();
    const modeConfigured = config.mode === "PAPER" || Boolean(
      config.brokerConfigured &&
      config.operatorConfigured &&
      config.signingConfigured &&
      config.allowedSymbols.length
    );
    return {
      mode: config.mode,
      broker: "ETORO",
      brokerConfigured: config.brokerConfigured,
      operatorConfigured: config.operatorConfigured,
      signingConfigured: config.signingConfigured,
      modeConfigured,
      writesEnabled: config.writesEnabled,
      liveEnabled: config.liveEnabled,
      authenticated,
      armed: isArmed(),
      armedUntil: isArmed() ? new Date(runtime.armedUntil).toISOString() : null,
      killSwitch: runtime.killSwitch,
      executionLocked: runtime.executionLocked,
      lockReason: authenticated ? runtime.lockReason : runtime.executionLocked ? "RECONCILIATION_REQUIRED" : null,
      limits: {
        allowedSymbols: config.allowedSymbols,
        maxOrderUsd: config.maxOrderUsd,
        maxRiskUsd: config.maxRiskUsd,
        maxOpenPositions: config.maxOpenPositions,
        maxDailyLossUsd: config.maxDailyLossUsd,
        maxSpreadPct: config.maxSpreadPct,
        maxEntryDeviationPct: config.maxEntryDeviationPct,
        leverage: 1,
      },
      reconciliation: authenticated ? runtime.lastReconciliation : summarizeReconciliation(runtime.lastReconciliation),
      lastOrder: authenticated ? runtime.lastOrder : summarizeOrder(runtime.lastOrder),
    };
  }

  function login(password) {
    if (!config.operatorConfigured) {
      throw executionError(503, "Operator access is not configured.", "OPERATOR_NOT_CONFIGURED");
    }
    if (!constantTimeStringEqual(String(password || ""), config.operatorPassword)) {
      throw executionError(401, "Operator access denied.", "OPERATOR_AUTH_FAILED");
    }
    const issuedAt = Math.floor(now() / 1000);
    return signObject({ type: "operator-session", iat: issuedAt, exp: issuedAt + config.sessionSeconds, nonce: randomUUID() }, config.sessionSecret);
  }

  function verifySession(token) {
    const payload = verifySignedObject(token, config.sessionSecret);
    if (!payload || payload.type !== "operator-session") return false;
    const current = Math.floor(now() / 1000);
    return Number(payload.iat) <= current + 30 && Number(payload.exp) > current;
  }

  function issueTicket(analysis) {
    const unavailable = (reason) => ({ eligible: false, ticket: null, expiresAt: null, reason });
    if (config.mode === "PAPER") return unavailable("Execution mode is PAPER.");
    if (!config.signingConfigured) return unavailable("Execution signing is not configured.");
    if (!analysis?.executable || !["A", "A+"].includes(analysis?.verdict)) return unavailable("Only executable A/A+ signals can receive an execution ticket.");
    if (!["BUY", "SELL"].includes(analysis?.direction)) return unavailable("A BUY or SELL direction is required.");
    const asset = normalizeBrokerSymbol(analysis.asset);
    if (!asset) return unavailable("The asset cannot be mapped to a broker symbol.");
    const trade = analysis.trade || {};
    const entry = numericLevel(trade.entry);
    const trigger = numericLevel(trade.trigger);
    const stop = numericLevel(trade.stop);
    const target = numericLevel(trade.target);
    const rr = Number(trade.rr);
    if (![entry, trigger, stop, target, rr].every(Number.isFinite) || rr < 2) return unavailable("Complete numeric trade levels are required.");
    if (!["AT_OR_ABOVE", "AT_OR_BELOW"].includes(trade.triggerCondition)) return unavailable("A deterministic trigger condition is required.");
    const dataTimestamp = new Date(analysis.dataAsOf || analysis.dataQuality?.freshness || "").getTime();
    if (!Number.isFinite(dataTimestamp) || dataTimestamp > now() + 60_000 || now() - dataTimestamp > config.maxSignalAgeMs) {
      return unavailable("The signal data is not fresh enough for execution.");
    }
    const issuedAt = Math.floor(now() / 1000);
    const payload = {
      type: "execution-ticket",
      v: 1,
      jti: randomUUID(),
      iat: issuedAt,
      exp: issuedAt + config.ticketSeconds,
      asset,
      assetClass: String(analysis.assetClass || "OTHER").slice(0, 20),
      direction: analysis.direction,
      verdict: analysis.verdict,
      score: Number(analysis.score),
      dataAsOf: new Date(dataTimestamp).toISOString(),
      trigger,
      triggerCondition: trade.triggerCondition,
      entry,
      stop,
      target,
      rr,
    };
    return {
      eligible: true,
      ticket: signObject(payload, config.signingSecret),
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      signal: sanitizeTicket(payload),
    };
  }

  function verifyTicket(token) {
    const payload = verifySignedObject(token, config.signingSecret);
    const current = Math.floor(now() / 1000);
    if (!payload || payload.type !== "execution-ticket" || payload.v !== 1) {
      throw executionError(400, "The execution ticket is invalid.", "INVALID_EXECUTION_TICKET");
    }
    if (Number(payload.iat) > current + 30 || Number(payload.exp) <= current) {
      throw executionError(409, "The execution ticket has expired.", "EXECUTION_TICKET_EXPIRED");
    }
    if (!config.allowedSymbols.includes(payload.asset)) {
      throw executionError(403, "The asset is not on the execution allowlist.", "ASSET_NOT_ALLOWED");
    }
    return payload;
  }

  async function reconcile() {
    assertBrokerReadable();
    const date = new Date(now()).toISOString().slice(0, 10);
    const demo = config.mode === "DEMO_EXCHANGE";
    const pnlPath = demo ? "/api/v1/trading/info/demo/pnl" : "/api/v1/trading/info/real/pnl";
    const historyPath = demo ? "/api/v1/trading/info/trade/demo/history" : "/api/v1/trading/info/trade/history";
    const historyQuery = new URLSearchParams({ minDate: date, page: "1", pageSize: "100" });
    const [portfolioPayload, historyPayload] = await Promise.all([
      brokerRequest(pnlPath),
      brokerRequest(`${historyPath}?${historyQuery}`),
    ]);
    const portfolio = normalizePortfolio(portfolioPayload, historyPayload, date);
    runtime.lastReconciliation = { ...portfolio, reconciledAt: new Date(now()).toISOString() };
    return runtime.lastReconciliation;
  }

  async function arm(confirmation) {
    assertBrokerWritable();
    const expected = config.mode === "LIVE" ? "ARM LIVE" : "ARM DEMO";
    if (String(confirmation || "").trim().toUpperCase() !== expected) {
      throw executionError(400, `Type ${expected} to arm execution.`, "ARM_CONFIRMATION_REQUIRED");
    }
    if (runtime.killSwitch) throw executionError(423, "The kill switch is active.", "KILL_SWITCH_ACTIVE");
    if (runtime.executionLocked) throw executionError(423, "Execution is locked until broker state is reconciled.", "EXECUTION_LOCKED");
    const reconciliation = await reconcile();
    if (reconciliation.dailyLossEstimateUsd >= config.maxDailyLossUsd) {
      runtime.killSwitch = true;
      throw executionError(423, "The daily loss limit has been reached.", "DAILY_LOSS_LIMIT");
    }
    runtime.armedUntil = now() + config.armSeconds * 1000;
    runtime.armedMode = config.mode;
    runtime.armId = randomUUID();
    return publicStatus(true);
  }

  function disarm() {
    runtime.armedUntil = 0;
    runtime.armedMode = null;
    runtime.armId = null;
    return publicStatus(true);
  }

  function activateKillSwitch() {
    runtime.killSwitch = true;
    if (!runtime.executionLocked) {
      runtime.executionLocked = true;
      runtime.lockReason = "KILL_SWITCH_ACTIVATED";
    }
    disarm();
    return publicStatus(true);
  }

  async function clearKillSwitch(confirmation) {
    assertBrokerWritable();
    const expected = `CLEAR ${config.mode === "LIVE" ? "LIVE" : "DEMO"} KILL SWITCH`;
    if (String(confirmation || "").trim().toUpperCase() !== expected) {
      throw executionError(400, `Type ${expected} to reset the kill switch.`, "KILL_SWITCH_CONFIRMATION_REQUIRED");
    }
    const reconciliation = await reconcile();
    if (reconciliation.dailyLossEstimateUsd >= config.maxDailyLossUsd) {
      runtime.killSwitch = true;
      throw executionError(423, "The daily loss limit is still active; the kill switch cannot be cleared.", "DAILY_LOSS_LIMIT");
    }
    runtime.killSwitch = false;
    if (runtime.lockReason === "KILL_SWITCH_ACTIVATED") {
      runtime.executionLocked = false;
      runtime.lockReason = null;
    }
    return publicStatus(true);
  }

  async function preview({ ticket, amountUsd }) {
    assertBrokerReadable();
    purgeRuntime();
    const signal = verifyTicket(ticket);
    const amount = normalizeAmount(amountUsd);
    const instrument = await resolveInstrument(signal.asset);
    const [rate, eligibilityPayload, costsPayload, portfolio] = await Promise.all([
      getRate(instrument.instrumentId),
      getEligibility(instrument.instrumentId),
      getCosts(instrument.instrumentId, signal.direction, amount),
      reconcile(),
    ]);
    const blockers = [];
    const entryRate = signal.direction === "BUY" ? rate.ask : rate.bid;
    const midpoint = (rate.ask + rate.bid) / 2;
    const spreadPct = midpoint > 0 ? ((rate.ask - rate.bid) / midpoint) * 100 : Infinity;
    const rateAgeMs = now() - new Date(rate.date).getTime();
    const eligibility = Array.isArray(eligibilityPayload?.eligibilities)
      ? eligibilityPayload.eligibilities.find((item) => Number(item?.instrumentId) === instrument.instrumentId)
      : null;
    const direction = signal.direction === "BUY" ? "LONG" : "SHORT";
    const leverageConfig = eligibility?.leverageConfigs?.find((item) => String(item?.direction).toUpperCase() === direction && item?.leverageValues?.map(Number).includes(1));
    const minAmount = Math.max(0, Number(eligibility?.minPositionExposure) || 0, Number(leverageConfig?.minPositionAmount) || 0);
    const stopDistancePct = entryRate > 0 ? (Math.abs(entryRate - signal.stop) / entryRate) * 100 : Infinity;
    const targetDistancePct = entryRate > 0 ? (Math.abs(signal.target - entryRate) / entryRate) * 100 : Infinity;
    const costs = normalizeCosts(costsPayload);
    const riskEstimateUsd = Number.isFinite(stopDistancePct)
      ? round(amount * stopDistancePct / 100 + Math.max(0, costs.totalKnownUsd), 2)
      : Infinity;

    if (!config.writesEnabled) blockers.push("Broker writes are disabled by server configuration.");
    if (config.mode === "LIVE" && !config.liveEnabled) blockers.push("Live trading is not explicitly enabled.");
    if (runtime.killSwitch) blockers.push("The kill switch is active.");
    if (runtime.executionLocked) blockers.push("Execution is locked pending reconciliation.");
    if (!Number.isFinite(rateAgeMs) || rateAgeMs < -30_000 || rateAgeMs > config.maxRateAgeMs) blockers.push("Broker market rate is stale or has an invalid timestamp.");
    if (!Number.isFinite(spreadPct) || spreadPct > config.maxSpreadPct) blockers.push(`Spread ${formatNumber(spreadPct)}% exceeds the configured limit.`);
    if (!eligibility?.allowOpenPosition) blockers.push("The broker does not allow opening this instrument.");
    if (!leverageConfig) blockers.push("Unleveraged execution is not eligible for this direction.");
    if (amount < minAmount) blockers.push(`Order amount is below the broker minimum of $${formatNumber(minAmount)}.`);
    if (amount > config.maxOrderUsd) blockers.push(`Order amount exceeds the server limit of $${formatNumber(config.maxOrderUsd)}.`);
    if (!Number.isFinite(riskEstimateUsd) || riskEstimateUsd > config.maxRiskUsd) blockers.push(`Estimated stop risk and known costs exceed the server limit of $${formatNumber(config.maxRiskUsd)}.`);
    if (portfolio.positions.length >= config.maxOpenPositions) blockers.push("The maximum number of open positions has been reached.");
    if (portfolio.positions.some((position) => position.instrumentId === instrument.instrumentId)) blockers.push("A position in this instrument is already open.");
    if (portfolio.pendingOpenOrders.some((order) => order.instrumentId === instrument.instrumentId)) blockers.push("An open order for this instrument is already pending.");
    if (portfolio.pendingOpenOrders.length) blockers.push("A broker open order is still pending.");
    if (portfolio.dailyLossEstimateUsd >= config.maxDailyLossUsd) blockers.push("The daily loss limit has been reached.");
    if (!triggerReached(signal.triggerCondition, entryRate, signal.trigger)) blockers.push("The signed signal trigger has not been reached.");
    const deviationPct = signal.entry > 0 ? (Math.abs(entryRate - signal.entry) / signal.entry) * 100 : Infinity;
    if (!Number.isFinite(deviationPct) || deviationPct > config.maxEntryDeviationPct) blockers.push(`Current entry deviates ${formatNumber(deviationPct)}% from the signed entry.`);
    if (!validTradeStructure(signal, entryRate)) blockers.push("Stop or target is invalid at the current broker rate.");
    if (leverageConfig?.allowStopLossTakeProfit === false) blockers.push("The broker eligibility response does not allow stop-loss/take-profit protection.");
    if (Number.isFinite(Number(leverageConfig?.minStopLossPercentage)) && stopDistancePct < Number(leverageConfig.minStopLossPercentage)) blockers.push("Stop-loss distance is below the broker minimum.");
    if (Number.isFinite(Number(leverageConfig?.maxStopLossPercentage)) && stopDistancePct > Number(leverageConfig.maxStopLossPercentage)) blockers.push("Stop-loss distance exceeds the broker maximum.");
    if (Number.isFinite(Number(leverageConfig?.minTakeProfitPercentage)) && targetDistancePct < Number(leverageConfig.minTakeProfitPercentage)) blockers.push("Take-profit distance is below the broker minimum.");
    if (Number.isFinite(Number(leverageConfig?.maxTakeProfitPercentage)) && targetDistancePct > Number(leverageConfig.maxTakeProfitPercentage)) blockers.push("Take-profit distance exceeds the broker maximum.");

    const previewId = randomUUID();
    const expiresAt = now() + config.previewSeconds * 1000;
    const normalized = {
      previewId,
      ready: blockers.length === 0,
      expiresAt: new Date(expiresAt).toISOString(),
      mode: config.mode,
      signal: sanitizeTicket(signal),
      order: {
        instrumentId: instrument.instrumentId,
        symbol: instrument.symbol,
        direction: signal.direction,
        transaction: signal.direction === "BUY" ? "buy" : "sellShort",
        amountUsd: amount,
        leverage: 1,
        stopLossRate: signal.stop,
        takeProfitRate: signal.target,
        riskEstimateUsd,
      },
      market: { bid: rate.bid, ask: rate.ask, entryRate, spreadPct: round(spreadPct, 4), rateAt: rate.date, deviationPct: round(deviationPct, 4) },
      eligibility: { allowOpenPosition: Boolean(eligibility?.allowOpenPosition), minAmountUsd: minAmount, settlementType: leverageConfig?.settlementType || null },
      costs,
      portfolio,
      blockers,
    };
    runtime.previews.set(previewId, { expiresAt, ticketId: signal.jti, amount, normalized });
    return normalized;
  }

  async function execute({ ticket, amountUsd, previewId, confirmation }) {
    assertBrokerWritable();
    purgeRuntime();
    const signal = verifyTicket(ticket);
    const amount = normalizeAmount(amountUsd);
    const expected = `EXECUTE ${config.mode === "LIVE" ? "LIVE" : "DEMO"} ${signal.asset}`;
    if (String(confirmation || "").trim().toUpperCase() !== expected) {
      throw executionError(400, `Type ${expected} to submit this order.`, "ORDER_CONFIRMATION_REQUIRED");
    }
    if (!isArmed()) throw executionError(423, "Execution is not armed or the arming window expired.", "EXECUTION_NOT_ARMED");
    if (runtime.killSwitch) throw executionError(423, "The kill switch is active.", "KILL_SWITCH_ACTIVE");
    if (runtime.executionLocked) throw executionError(423, "Execution is locked pending reconciliation.", "EXECUTION_LOCKED");
    if (runtime.inFlight) throw executionError(409, "Another broker mutation is already in flight.", "EXECUTION_IN_FLIGHT");
    if (runtime.executedTickets.has(signal.jti)) throw executionError(409, "This signed signal ticket has already been submitted.", "DUPLICATE_EXECUTION");
    const storedPreview = runtime.previews.get(String(previewId || ""));
    if (!storedPreview || storedPreview.expiresAt <= now() || storedPreview.ticketId !== signal.jti || storedPreview.amount !== amount || !storedPreview.normalized.ready) {
      throw executionError(409, "A fresh successful broker preview is required.", "PREVIEW_REQUIRED");
    }

    runtime.inFlight = true;
    try {
      const fresh = await preview({ ticket, amountUsd: amount });
      if (!fresh.ready) throw executionError(409, "The final broker check blocked this order.", "FINAL_CHECK_FAILED", { blockers: fresh.blockers });
      const endpoint = config.mode === "DEMO_EXCHANGE" ? "/api/v2/trading/execution/demo/orders" : "/api/v2/trading/execution/orders";
      const body = {
        action: "open",
        transaction: signal.direction === "BUY" ? "buy" : "sellShort",
        instrumentId: fresh.order.instrumentId,
        orderType: "mkt",
        leverage: 1,
        amount,
        orderCurrency: "usd",
        stopLossRate: signal.stop,
        takeProfitRate: signal.target,
        stopLossType: "fixed",
      };
      const submittedAt = new Date(now()).toISOString();
      runtime.executedTickets.set(signal.jti, { orderId: null, referenceId: signal.jti, submittedAt });
      runtime.lastOrder = {
        submitted: false,
        mode: config.mode,
        action: "OPEN",
        ticketId: signal.jti,
        orderId: null,
        referenceId: signal.jti,
        state: "SUBMITTING",
        submittedAt,
      };
      let submitted;
      try {
        submitted = await brokerRequest(endpoint, { method: "POST", body, requestId: signal.jti });
      } catch (error) {
        runtime.lastOrder.state = ["BROKER_UNAVAILABLE", "BROKER_OUTCOME_UNKNOWN"].includes(error.code)
          ? "SUBMISSION_UNKNOWN"
          : "REJECTED_BEFORE_ACCEPTANCE";
        if (["BROKER_UNAVAILABLE", "BROKER_OUTCOME_UNKNOWN"].includes(error.code)) {
          lockExecution("Order submission outcome is unknown; confirm it with eToro before continuing.");
        }
        throw error;
      }
      const orderId = integerOrNull(submitted?.orderId ?? submitted?.orderForOpen?.orderID);
      const referenceId = String(submitted?.referenceId || signal.jti);
      if (!orderId) {
        lockExecution("Broker accepted a request without a verifiable order ID.");
        throw executionError(502, "The broker response has no verifiable order ID.", "BROKER_ORDER_ID_MISSING");
      }
      runtime.executedTickets.set(signal.jti, { orderId, referenceId, submittedAt });
      runtime.lastOrder.orderId = orderId;
      runtime.lastOrder.referenceId = referenceId;
      runtime.lastOrder.submitted = true;
      runtime.lastOrder.state = "SUBMITTED_PENDING";
      let order = null;
      try {
        order = await lookupOrder({ orderId, referenceId });
      } catch {
        lockExecution("Order was submitted but its status could not be confirmed.");
      }
      const statusId = Number(order?.status?.id);
      if (!TERMINAL_ORDER_STATUS_IDS.has(statusId)) lockExecution("Order is still pending; wait for a terminal broker status.");
      const result = {
        submitted: true,
        mode: config.mode,
        action: "OPEN",
        orderId,
        referenceId,
        state: orderState(statusId),
        status: order,
        submittedAt,
      };
      runtime.lastOrder = result;
      disarm();
      return result;
    } finally {
      runtime.inFlight = false;
    }
  }

  async function lookupOrder({ orderId, referenceId } = {}) {
    assertBrokerReadable();
    const query = new URLSearchParams();
    const requestedOrderId = integerOrNull(orderId);
    const requestedReferenceId = requestedOrderId ? null : referenceId ? String(referenceId).slice(0, 80) : null;
    if (requestedOrderId) query.set("orderId", String(requestedOrderId));
    else if (requestedReferenceId) query.set("referenceId", requestedReferenceId);
    else throw executionError(400, "Order ID or reference ID is required.", "ORDER_REFERENCE_REQUIRED");
    const path = config.mode === "DEMO_EXCHANGE" ? "/api/v2/trading/info/demo/orders:lookup" : "/api/v2/trading/info/orders:lookup";
    const payload = await brokerRequest(`${path}?${query}`);
    const statusId = Number(payload?.status?.id);
    const sanitized = sanitizeOrderLookup(payload);
    const tracked = runtime.lastOrder?.action !== "CLOSE" && runtime.lastOrder;
    const matchesTracked = Boolean(tracked && (
      (requestedOrderId && Number(tracked.orderId) === requestedOrderId) ||
      (requestedReferenceId && String(tracked.referenceId) === requestedReferenceId)
    ));
    if (matchesTracked && statusId === 10) {
      lockExecution("Order was partially filled and then rejected; reconcile the resulting exposure before continuing.");
    } else if (matchesTracked && TERMINAL_ORDER_STATUS_IDS.has(statusId)) {
      runtime.executionLocked = false;
      runtime.lockReason = null;
    } else if (matchesTracked) {
      lockExecution("Order is still pending; wait for a terminal broker status.");
    }
    if (matchesTracked) {
      if (tracked.ticketId) {
        runtime.executedTickets.set(tracked.ticketId, {
          orderId: sanitized?.orderId || tracked.orderId || null,
          referenceId: sanitized?.referenceId || tracked.referenceId,
          submittedAt: tracked.submittedAt,
        });
      }
      runtime.lastOrder.status = sanitized;
      runtime.lastOrder.state = orderState(statusId);
    }
    return sanitized;
  }

  async function closePosition({ positionId, confirmation }) {
    // Closing is deliberately allowed while the kill switch or reconciliation
    // lock is active because it reduces exposure. It still requires the
    // deployment's broker-write and LIVE opt-in gates.
    assertBrokerWritable();
    const id = integerOrNull(positionId);
    if (!id) throw executionError(400, "A valid position ID is required.", "POSITION_ID_REQUIRED");
    const expected = `CLOSE POSITION ${id}`;
    if (String(confirmation || "").trim().toUpperCase() !== expected) {
      throw executionError(400, `Type ${expected} to close the position.`, "CLOSE_CONFIRMATION_REQUIRED");
    }
    if (runtime.inFlight) throw executionError(409, "Another broker mutation is already in flight.", "EXECUTION_IN_FLIGHT");
    const portfolio = await reconcile();
    const position = portfolio.positions.find((item) => item.positionId === id);
    if (!position) throw executionError(404, "The position is not present in the reconciled broker portfolio.", "POSITION_NOT_FOUND");
    runtime.inFlight = true;
    try {
      const requestId = randomUUID();
      const submittedAt = new Date(now()).toISOString();
      const path = config.mode === "DEMO_EXCHANGE"
        ? `/api/v1/trading/execution/demo/market-close-orders/positions/${id}`
        : `/api/v1/trading/execution/market-close-orders/positions/${id}`;
      runtime.lastOrder = {
        submitted: false,
        mode: config.mode,
        action: "CLOSE",
        orderId: null,
        referenceId: requestId,
        positionId: id,
        state: "SUBMITTING",
        submittedAt,
      };
      let payload;
      try {
        payload = await brokerRequest(path, { method: "POST", requestId, body: { InstrumentID: position.instrumentId, UnitsToDeduct: null } });
      } catch (error) {
        runtime.lastOrder.state = ["BROKER_UNAVAILABLE", "BROKER_OUTCOME_UNKNOWN"].includes(error.code)
          ? "SUBMISSION_UNKNOWN"
          : "REJECTED_BEFORE_ACCEPTANCE";
        if (["BROKER_UNAVAILABLE", "BROKER_OUTCOME_UNKNOWN"].includes(error.code)) {
          lockExecution("Close request outcome is unknown; reconcile with eToro immediately.");
        }
        throw error;
      }
      const orderId = integerOrNull(payload?.orderId ?? payload?.orderForClose?.orderID ?? payload?.orderForClose?.orderId);
      if (!orderId) {
        lockExecution("Broker accepted a close request without a verifiable order ID.");
        throw executionError(502, "The broker close response has no verifiable order ID.", "BROKER_ORDER_ID_MISSING");
      }
      runtime.lastOrder = {
        submitted: true,
        mode: config.mode,
        action: "CLOSE",
        orderId,
        referenceId: requestId,
        positionId: id,
        state: "SUBMITTED_PENDING",
        submittedAt,
      };
      try {
        const status = await lookupCloseOrder({ orderId });
        runtime.lastOrder.status = status;
        runtime.lastOrder.state = status.state;
      } catch {
        lockExecution("Close order was submitted but its status could not be confirmed.");
      }
      return runtime.lastOrder;
    } finally {
      runtime.inFlight = false;
    }
  }

  async function lookupCloseOrder({ orderId } = {}) {
    assertBrokerReadable();
    const id = integerOrNull(orderId);
    if (!id) throw executionError(400, "A valid close order ID is required.", "ORDER_REFERENCE_REQUIRED");
    const scope = config.mode === "DEMO_EXCHANGE" ? "demo" : "real";
    const payload = await brokerRequest(`/api/v1/trading/info/${scope}/close-orders/${id}`);
    const positions = Array.isArray(payload?.positions)
      ? payload.positions.slice(0, 20).map((item) => ({
          positionId: integerOrNull(item?.positionID ?? item?.positionId),
          occurredAt: validIsoOrNull(item?.occurred),
          rate: finiteOrNull(item?.rate),
          units: finiteOrNull(item?.units),
          amount: finiteOrNull(item?.amount),
        }))
      : [];
    const errorCode = finiteOrNull(payload?.errorCode);
    const errorMessage = payload?.errorMessage ? String(payload.errorMessage).slice(0, 240) : null;
    const state = positions.length ? "CLOSED" : errorCode || errorMessage ? "REJECTED" : "SUBMITTED_PENDING";
    const matchesTracked = runtime.lastOrder?.action === "CLOSE" && Number(runtime.lastOrder.orderId) === id;
    if (matchesTracked && state === "SUBMITTED_PENDING") lockExecution("Close order is still pending; reconcile before continuing.");
    else if (matchesTracked && state === "CLOSED") {
      runtime.executionLocked = false;
      runtime.lockReason = null;
    } else if (matchesTracked && state === "REJECTED") {
      lockExecution("Close order was rejected; reconcile the remaining exposure before continuing.");
    }
    const sanitized = {
      orderId: integerOrNull(payload?.orderID ?? payload?.orderId) || id,
      statusId: integerOrNull(payload?.statusID ?? payload?.statusId),
      instrumentId: integerOrNull(payload?.instrumentID ?? payload?.instrumentId),
      referenceId: payload?.referenceID ? String(payload.referenceID).slice(0, 80) : null,
      state,
      errorCode,
      errorMessage,
      requestedAt: validIsoOrNull(payload?.requestOccurred),
      proceeds: finiteOrNull(payload?.proceeds),
      positions,
    };
    if (matchesTracked) {
      runtime.lastOrder.status = sanitized;
      runtime.lastOrder.state = state;
    }
    return sanitized;
  }

  function assertBrokerReadable() {
    if (config.mode === "PAPER") throw executionError(409, "Execution mode is PAPER.", "PAPER_MODE");
    if (!config.brokerConfigured) throw executionError(503, "eToro credentials are not configured.", "BROKER_NOT_CONFIGURED");
    if (!config.signingConfigured) throw executionError(503, "Execution signing is not configured.", "SIGNING_NOT_CONFIGURED");
  }

  function assertBrokerWritable() {
    assertBrokerReadable();
    if (!config.writesEnabled) throw executionError(423, "Broker writes are disabled by server configuration.", "BROKER_WRITES_DISABLED");
    if (config.mode === "LIVE" && !config.liveEnabled) throw executionError(423, "Live trading is not explicitly enabled.", "LIVE_TRADING_DISABLED");
  }

  async function resolveInstrument(symbol) {
    const query = new URLSearchParams({ internalSymbolFull: symbol });
    const payload = await brokerRequest(`/api/v1/market-data/search?${query}`);
    const items = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
    const match = items.find((item) => normalizeBrokerSymbol(item?.internalSymbolFull || item?.symbolFull || item?.symbol) === symbol);
    const instrumentId = integerOrNull(match?.instrumentId ?? match?.instrumentID);
    if (!match || !instrumentId) throw executionError(404, "The eToro instrument could not be resolved exactly.", "INSTRUMENT_NOT_FOUND");
    return { instrumentId, symbol };
  }

  async function getRate(instrumentId) {
    const query = new URLSearchParams({ instrumentIds: String(instrumentId) });
    const payload = await brokerRequest(`/api/v1/market-data/instruments/rates?${query}`);
    const item = payload?.rates?.find((rate) => Number(rate?.instrumentID ?? rate?.instrumentId) === instrumentId);
    const bid = Number(item?.bid);
    const ask = Number(item?.ask);
    const timestamp = new Date(item?.date || "").getTime();
    if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask < bid || !Number.isFinite(timestamp)) {
      throw executionError(502, "The broker returned no valid bid/ask rate.", "BROKER_RATE_INVALID");
    }
    return { bid, ask, date: new Date(timestamp).toISOString() };
  }

  function getEligibility(instrumentId) {
    const path = config.mode === "DEMO_EXCHANGE" ? "/api/v2/trading/info/demo/eligibility" : "/api/v2/trading/info/eligibility";
    return brokerRequest(path, { method: "POST", body: { instrumentIds: [instrumentId], currency: "USD" } });
  }

  function getCosts(instrumentId, direction, amount) {
    const path = config.mode === "DEMO_EXCHANGE" ? "/api/v2/trading/info/demo/costs" : "/api/v2/trading/info/costs";
    return brokerRequest(path, { method: "POST", body: { action: "open", transaction: direction === "BUY" ? "buy" : "sellShort", instrumentId, orderType: "mkt", leverage: 1, amount, orderCurrency: "usd" } });
  }

  async function brokerRequest(path, { method = "GET", body, requestId = randomUUID() } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.brokerTimeoutMs);
    let response;
    try {
      response = await fetchImpl(`${config.apiBase}${path}`, {
        method,
        headers: {
          Accept: "application/json",
          "x-api-key": config.apiKey,
          "x-user-key": config.userKey,
          "x-request-id": requestId,
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      throw executionError(503, error?.name === "AbortError" ? "eToro request timed out." : "eToro is unreachable.", "BROKER_UNAVAILABLE");
    } finally {
      clearTimeout(timer);
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = String(payload?.detail || payload?.errorMessage || payload?.title || `eToro returned HTTP ${response.status}.`).slice(0, 240);
      const status = response.status === 401 || response.status === 403 ? 502 : response.status === 429 ? 429 : 502;
      const code = response.status === 429
        ? "BROKER_RATE_LIMITED"
        : response.status >= 500
          ? "BROKER_OUTCOME_UNKNOWN"
          : "BROKER_REJECTED_REQUEST";
      throw executionError(status, message, code);
    }
    return payload;
  }

  function lockExecution(reason) {
    runtime.executionLocked = true;
    runtime.lockReason = String(reason || "Broker reconciliation required.").slice(0, 240);
    runtime.armedUntil = 0;
    runtime.armedMode = null;
    runtime.armId = null;
  }

  function isArmed() {
    return runtime.armedMode === config.mode && runtime.armedUntil > now();
  }

  function purgeRuntime() {
    if (runtime.armedUntil <= now()) {
      runtime.armedUntil = 0;
      runtime.armedMode = null;
      runtime.armId = null;
    }
    for (const [id, item] of runtime.previews) if (item.expiresAt <= now()) runtime.previews.delete(id);
  }

  return {
    config: publicStatus(false),
    publicStatus,
    login,
    verifySession,
    issueTicket,
    verifyTicket,
    reconcile,
    arm,
    disarm,
    activateKillSwitch,
    clearKillSwitch,
    preview,
    execute,
    lookupOrder,
    lookupCloseOrder,
    closePosition,
  };
}

export function readExecutionConfig(env = process.env) {
  const rawMode = String(env.TRADING_MODE || "PAPER").trim().toUpperCase();
  const mode = VALID_MODES.has(rawMode) ? rawMode : "PAPER";
  const sessionSecret = String(env.SESSION_SECRET || "").trim();
  const signingSecret = String(env.EXECUTION_SIGNING_SECRET || sessionSecret).trim();
  const operatorPassword = String(env.OPERATOR_PASSWORD || "");
  const allowedSymbols = [...new Set(String(env.EXECUTION_ALLOWED_SYMBOLS || "").split(",").map(normalizeBrokerSymbol).filter(Boolean))].slice(0, 100);
  const defaultKillSwitch = mode === "LIVE";
  return {
    mode,
    apiBase: String(env.ETORO_API_BASE || "https://public-api.etoro.com").replace(/\/$/, ""),
    apiKey: String(env.ETORO_API_KEY || "").trim(),
    userKey: String(env.ETORO_USER_KEY || "").trim(),
    brokerConfigured: Boolean(String(env.ETORO_API_KEY || "").trim() && String(env.ETORO_USER_KEY || "").trim()),
    operatorPassword,
    operatorConfigured: operatorPassword.length >= 12 && sessionSecret.length >= 32,
    sessionSecret,
    signingSecret,
    signingConfigured: signingSecret.length >= 32,
    writesEnabled: envBoolean(env.EXCHANGE_WRITES_ENABLED, false),
    liveEnabled: envBoolean(env.LIVE_TRADING_ENABLED, false),
    killSwitchOnBoot: envBoolean(env.EXECUTION_KILL_SWITCH, defaultKillSwitch),
    allowedSymbols,
    maxOrderUsd: boundedNumber(env.EXECUTION_MAX_ORDER_USD, mode === "LIVE" ? 100 : 1000, 1, 1_000_000),
    maxRiskUsd: boundedNumber(env.EXECUTION_MAX_RISK_USD, mode === "LIVE" ? 5 : 100, 0.01, 1_000_000),
    maxOpenPositions: Math.round(boundedNumber(env.EXECUTION_MAX_OPEN_POSITIONS, 1, 1, 100)),
    maxDailyLossUsd: boundedNumber(env.EXECUTION_MAX_DAILY_LOSS_USD, mode === "LIVE" ? 50 : 1000, 1, 1_000_000),
    maxSpreadPct: boundedNumber(env.EXECUTION_MAX_SPREAD_PCT, 0.5, 0.001, 25),
    maxEntryDeviationPct: boundedNumber(env.EXECUTION_MAX_ENTRY_DEVIATION_PCT, 0.75, 0.01, 25),
    maxSignalAgeMs: boundedNumber(env.EXECUTION_MAX_SIGNAL_AGE_SECONDS, 900, 30, 86_400) * 1000,
    maxRateAgeMs: boundedNumber(env.EXECUTION_MAX_RATE_AGE_SECONDS, 90, 5, 600) * 1000,
    ticketSeconds: boundedNumber(env.EXECUTION_TICKET_TTL_SECONDS, 600, 30, 3600),
    previewSeconds: boundedNumber(env.EXECUTION_PREVIEW_TTL_SECONDS, 45, 10, 300),
    armSeconds: boundedNumber(env.EXECUTION_ARM_SECONDS, 300, 30, 1800),
    sessionSeconds: boundedNumber(env.OPERATOR_SESSION_SECONDS, 3600, 300, 86_400),
    brokerTimeoutMs: boundedNumber(env.ETORO_TIMEOUT_MS, 12_000, 1000, 30_000),
  };
}

function normalizePortfolio(payload, historyPayload, date) {
  const root = payload?.clientPortfolio || payload || {};
  const containers = [root, ...(Array.isArray(root.mirrors) ? root.mirrors : [])];
  const positions = dedupeBy(
    containers.flatMap((container) => Array.isArray(container?.positions) ? container.positions : []).map(sanitizePosition).filter(Boolean),
    (item) => item.positionId
  );
  const pendingOpenOrders = dedupeBy(
    containers.flatMap((container) => Array.isArray(container?.ordersForOpen) ? container.ordersForOpen : []).map(sanitizePendingOrder).filter(Boolean),
    (item) => item.orderId
  );
  const history = Array.isArray(historyPayload) ? historyPayload : Array.isArray(historyPayload?.items) ? historyPayload.items : [];
  const closedToday = history.filter((item) => String(item?.closeTimestamp || "").startsWith(date));
  const realizedTodayUsd = round(closedToday.reduce((sum, item) => sum + (Number(item?.netProfit) || 0), 0), 2);
  const openLossUsd = Math.abs(round(positions.reduce((sum, item) => sum + Math.min(0, Number(item.pnl) || 0), 0), 2));
  const dailyLossEstimateUsd = round(Math.abs(Math.min(0, realizedTodayUsd)) + openLossUsd, 2);
  return {
    credit: finiteOrNull(root.credit),
    unrealizedPnl: finiteOrNull(root.unrealizedPnL ?? root.unrealizedPnl),
    realizedTodayUsd,
    dailyLossEstimateUsd,
    openPositionCount: positions.length,
    pendingOpenOrderCount: pendingOpenOrders.length,
    positions,
    pendingOpenOrders,
  };
}

function sanitizePosition(item) {
  const positionId = integerOrNull(item?.positionId ?? item?.positionID);
  const instrumentId = integerOrNull(item?.instrumentId ?? item?.instrumentID);
  if (!positionId || !instrumentId) return null;
  return {
    positionId,
    instrumentId,
    direction: item?.isBuy === false ? "SELL" : "BUY",
    amount: finiteOrNull(item?.amount ?? item?.initialAmountInDollars),
    units: finiteOrNull(item?.units),
    openRate: finiteOrNull(item?.openRate),
    stopLossRate: finiteOrNull(item?.stopLossRate),
    takeProfitRate: finiteOrNull(item?.takeProfitRate),
    leverage: finiteOrNull(item?.leverage),
    pnl: finiteOrNull(item?.pnL ?? item?.pnl),
    openedAt: validIsoOrNull(item?.openDateTime),
  };
}

function sanitizePendingOrder(item) {
  const orderId = integerOrNull(item?.orderId ?? item?.orderID);
  const instrumentId = integerOrNull(item?.instrumentId ?? item?.instrumentID);
  if (!orderId || !instrumentId) return null;
  return { orderId, instrumentId, direction: item?.isBuy === false ? "SELL" : "BUY", amount: finiteOrNull(item?.amount), createdAt: validIsoOrNull(item?.openDateTime) };
}

function sanitizeOrderLookup(payload) {
  if (!payload || typeof payload !== "object") return null;
  return {
    orderId: integerOrNull(payload.orderId),
    referenceId: payload.referenceId ? String(payload.referenceId).slice(0, 80) : null,
    status: payload.status ? { id: integerOrNull(payload.status.id), name: String(payload.status.name || "UNKNOWN").slice(0, 60), errorCode: finiteOrNull(payload.status.errorCode), errorMessage: payload.status.errorMessage ? String(payload.status.errorMessage).slice(0, 240) : null } : null,
    asset: payload.asset ? { symbol: String(payload.asset.symbol || "").slice(0, 32), instrumentId: integerOrNull(payload.asset.instrumentId), settlementType: String(payload.asset.settlementType || "").slice(0, 40), leverage: finiteOrNull(payload.asset.leverage), side: String(payload.asset.side || "").slice(0, 20) } : null,
    totalCosts: finiteOrNull(payload.totalCosts),
    positionExecutions: Array.isArray(payload.positionExecutions) ? payload.positionExecutions.slice(0, 20).map((item) => ({ positionId: integerOrNull(item?.positionId), state: String(item?.state || "").slice(0, 30), remainingUnits: finiteOrNull(item?.remainingUnits), stopLossRate: finiteOrNull(item?.stopLossRate), takeProfitRate: finiteOrNull(item?.takeProfitRate), averagePrice: finiteOrNull(item?.openingData?.avgPrice), fees: finiteOrNull(item?.openingData?.fees), executionTime: validIsoOrNull(item?.openingData?.executionTime) })) : [],
    lastUpdate: validIsoOrNull(payload.lastUpdate),
  };
}

function normalizeCosts(payload) {
  const items = Array.isArray(payload?.costs) ? payload.costs.slice(0, 20).map((item) => ({ type: String(item?.costType || "unknown").slice(0, 50), amount: finiteOrNull(item?.amount), currency: String(item?.currency || "USD").slice(0, 8) })) : [];
  return { items, totalKnownUsd: round(items.filter((item) => item.currency.toUpperCase() === "USD" && Number.isFinite(item.amount)).reduce((sum, item) => sum + item.amount, 0), 4), updatedAt: validIsoOrNull(payload?.lastUpdated) };
}

function sanitizeTicket(payload) {
  return {
    id: payload.jti,
    asset: payload.asset,
    assetClass: payload.assetClass,
    direction: payload.direction,
    verdict: payload.verdict,
    score: payload.score,
    dataAsOf: payload.dataAsOf,
    trigger: payload.trigger,
    triggerCondition: payload.triggerCondition,
    entry: payload.entry,
    stop: payload.stop,
    target: payload.target,
    rr: payload.rr,
    expiresAt: new Date(Number(payload.exp) * 1000).toISOString(),
  };
}

function validTradeStructure(signal, entryRate) {
  if (signal.direction === "BUY") return signal.stop < entryRate && signal.target > entryRate;
  return signal.stop > entryRate && signal.target < entryRate;
}

function triggerReached(condition, rate, trigger) {
  if (condition === "AT_OR_ABOVE") return rate >= trigger;
  if (condition === "AT_OR_BELOW") return rate <= trigger;
  return false;
}

function orderState(statusId) {
  if (statusId === 3) return "FILLED";
  if (statusId === 5) return "PARTIALLY_FILLED";
  if (statusId === 10) return "PARTIALLY_FILLED_REJECTED";
  if (statusId === 4) return "REJECTED";
  return "SUBMITTED_PENDING";
}

function normalizeAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) throw executionError(400, "A positive USD order amount is required.", "INVALID_ORDER_AMOUNT");
  return round(amount, 2);
}

function normalizeBrokerSymbol(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) return "";
  const aliases = new Map([["BITCOIN", "BTC"], ["XBT", "BTC"], ["ETHEREUM", "ETH"], ["GOLD", "GOLD"]]);
  const parts = raw.split(/[-_/\s]+/).filter(Boolean);
  const symbol = (parts[0] || raw).replace(/[^A-Z0-9.]/g, "");
  return (aliases.get(symbol) || symbol).slice(0, 24);
}

function signObject(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifySignedObject(token, secret) {
  if (!secret || typeof token !== "string") return null;
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return null;
  const expected = createHmac("sha256", secret).update(encoded).digest("base64url");
  if (!constantTimeStringEqual(signature, expected)) return null;
  try { return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")); } catch { return null; }
}

function constantTimeStringEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function envBoolean(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return /^(1|true|yes|on)$/i.test(String(value));
}

function boundedNumber(value, fallback, min, max) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function numericLevel(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  const match = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function finiteOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function integerOrNull(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

function validIsoOrNull(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function formatNumber(value) {
  return Number.isFinite(Number(value)) ? round(Number(value), 4).toString() : "unknown";
}

function dedupeBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function summarizeReconciliation(value) {
  if (!value) return null;
  return { reconciledAt: value.reconciledAt, openPositionCount: value.openPositionCount, pendingOpenOrderCount: value.pendingOpenOrderCount, dailyLossEstimateUsd: value.dailyLossEstimateUsd };
}

function summarizeOrder(value) {
  if (!value) return null;
  return { orderId: value.orderId || null, state: value.state || null, submittedAt: value.submittedAt || null };
}

function executionError(statusCode, message, code, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  if (details) error.details = details;
  return error;
}
