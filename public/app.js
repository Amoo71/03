const translations = {
  de: {
    command: "Asset analysieren",
    scanWholeMarket: "Gesamten Markt scannen",
    masterScanner: "MASTER-SCANNER",
    scannerTitle: "scan --scope global<br /><em>filter --strict</em>",
    scannerIntro: "Kandidatensuche mit anschließender vollständiger Einzelanalyse. Nur ausführbare A-/A+-Paper-Setups erreichen den Alarm-Feed.",
    scanConfiguration: "Scan-Konfiguration",
    marketScope: "Marktbereich",
    scopeGlobal: "Global — alle Märkte",
    scopeCrypto: "Krypto + Altcoins",
    scopeMeme: "Meme-Coins",
    scopeEquities: "Aktien + ETFs + Indizes",
    scopeMacro: "Gold + Forex + Makro",
    candidates: "Kandidaten",
    discoverThenVerify: "Erst entdecken, dann jeden Kandidaten prüfen",
    onlyAA: "Nur A/A+ gelangt in den Alarm-Feed",
    noForcedTrade: "Leeres Ergebnis ist gültig — kein Zwangstrade",
    paperNoOrders: "Nur Paper — sendet niemals eine Order",
    startMasterScan: "MASTER-SCAN STARTEN",
    morningBrief: "MORGEN-BRIEFING · TOP 5",
    monitoring: "Überwachung",
    scanInterval: "Scan-Intervall",
    monitorLimit: "Läuft nur, solange diese Seite geöffnet bleibt. Echte 24/7-Überwachung benötigt einen gehosteten Worker.",
    monitorOff: "AUS",
    monitorOn: "AKTIV",
    scannerReady: "Bereit zum Scannen.",
    scannerReadyCopy: "Marktbereich wählen und starten. Entdeckte Kandidaten sind erst nach allen Prüfregeln Signale.",
    discoveringCandidates: "Aktuelle Kandidaten werden gesucht…",
    discovery: "Entdeckung",
    deepChecks: "Deep-Checks",
    hardVetoFilter: "Hard-Veto-Filter",
    alertGate: "A/A+-Filter",
    scanFailed: "Master-Scan konnte nicht abgeschlossen werden.",
    noAASetup: "Kein A-/A+-Setup gefunden.",
    noAASetupCopy: "Die gescannten Kandidaten haben mindestens eine feste Qualitätsregel nicht bestanden. Kein Trade.",
    executableAlerts: "A-/A+-ALARME",
    researchedCandidates: "GEPRÜFTE KANDIDATEN",
    candidateError: "Deep-Analyse fehlgeschlagen",
    nextScan: "Nächster Scan",
    browserNotifications: "Browser-Benachrichtigungen wurden nicht erlaubt; In-App-Alarme bleiben aktiv.",
    navScan: "Scan",
    paperMode: "PAPER-MODUS",
    modeCopy: "Forward-Test · keine echten Orders",
    researchTerminal: "GLOBAL RESEARCH TERMINAL",
    heroTitle: "markt prüfen.<br /><em>setup oder kein trade.</em>",
    heroDescription: "Aktuelle Quellen rein. Feste Regeln drauf. Exakte Paper-Trade-Level raus — oder konsequent kein Trade.",
    assetInputLabel: "Asset, Ticker oder Contract",
    runAnalysis: "ANALYSE STARTEN",
    hardVeto: "Hard-Veto aktiv",
    freshData: "Nur frische Quellen",
    signalRadar: "SIGNAL-RADAR",
    standingBy: "BEREIT",
    threshold: "SIGNAL-SCHWELLE",
    decision: "STANDARDENTSCHEIDUNG",
    noTrade: "KEIN TRADE",
    marketPulse: "MARKT-PULS",
    awaitingFeed: "WARTE AUF FEED",
    loadingMarket: "aktuelle Marktdaten werden geladen…",
    globalTrend: "GLOBALER TREND",
    unknown: "UNBEKANNT",
    needsResearch: "Live-Recherche erforderlich",
    sourceHealth: "QUELLENSTATUS",
    coreSourcesReady: "Kernquellen bereit",
    qualityGate: "QUALITÄTSFILTER",
    belowRejected: "Unter 82 abgelehnt",
    executionMode: "AUSFÜHRUNGSMODUS",
    paper: "PAPER",
    realOrdersDisabled: "Echte Orders deaktiviert",
    latestDecision: "Letzte Entscheidung",
    openAnalyzer: "Analyzer öffnen",
    noVerifiedSignal: "Noch kein verifiziertes Signal.",
    connectAndRun: "Starte eine aktuelle serverseitige Analyse. Hier wird nichts erfunden.",
    sourceStatus: "Quellenstatus",
    onDemand: "AUF ANFRAGE",
    marketData: "Markt- + DEX-Daten",
    publicFeed: "ÖFFENTLICH",
    walletIntel: "Wallet Intelligence",
    webSearch: "WEB-SUCHE",
    derivativesData: "OI- + Funding-Daten",
    optionalKey: "SERVER-FEED",
    serverFeed: "SERVER-FEED",
    orderflowData: "Orderflow + Liquidationen",
    liveResearch: "LIVE-RECHERCHE",
    analyzerTitle: "analyze --asset<br /><em>verify --sources</em>",
    analyzerIntro: "Eine aktuelle Anfrage, mehrere unabhängige Prüfungen, eine unveränderliche Paper-Trade-Entscheidung.",
    analysisRequest: "Analyseanfrage",
    paperOnly: "NUR PAPER",
    assetContract: "Asset, Ticker oder Contract",
    assetExamples: "Beispiele: BTC, NVDA, XAUUSD oder Token-Contract",
    assetClass: "Assetklasse",
    chain: "Chain (optional)",
    horizon: "Zeithorizont",
    sourceMode: "Quellenmodus",
    coreOnly: "Nur Kernquellen",
    verifiedExtended: "Verifiziert erweitert",
    ruleFresh: "Aktuelle Quellen erforderlich",
    ruleRR: "Mindestens CRV 2:1",
    ruleEtoro: "eToro Deutschland geprüft",
    ruleVeto: "Hard-Veto nicht überschreibbar",
    startLiveAnalysis: "LIVE-ANALYSE STARTEN",
    readyForAsset: "Bereit für ein Asset.",
    readyCopy: "Ergebnisse erscheinen erst nach einer frischen Quellenprüfung. Bis dahin bleiben alle Level leer.",
    researchRunning: "RECHERCHE://LÄUFT",
    crossChecking: "Aktuelle Daten werden abgeglichen…",
    stageMarket: "Marktdaten",
    stageDerivatives: "Derivate",
    stageWallets: "Wallets",
    stageExecution: "Ausführung",
    stageScore: "Score",
    forwardTest: "FORWARD-TEST",
    journalTitle: "paper.log<br /><em>forward only</em>",
    journalIntro: "Nur Analysen, die vor einer Bewegung erstellt wurden, werden gespeichert. Keine rückwirkenden Gewinner.",
    analysisHistory: "Analyseverlauf",
    exportJson: "JSON exportieren",
    clear: "Leeren",
    storedAnalyses: "Gespeicherte Analysen",
    aSetups: "A- / A+-Setups",
    noTradeDecisions: "Kein-Trade-Entscheidungen",
    realOrders: "Echte Orders",
    journalEmpty: "Das Journal ist leer.",
    journalEmptyCopy: "Starte eine Live-Analyse, um die erste unveränderliche Entscheidung auf diesem Gerät zu speichern.",
    analyzeAsset: "ASSET ANALYSIEREN",
    sourceArchitecture: "QUELLENARCHITEKTUR",
    sourcesTitle: "sources.list<br /><em>primary first</em>",
    sourcesIntro: "Die Kernrecherche ist auf definierte Domains beschränkt. Alle Modell- und Datenzugänge bleiben in geschützten Server-Secrets.",
    cmcDescription: "Aktuelle Kryptopreise, Marktkapitalisierung, Volumen, DEX-Liquidität, Holder- und Token-Sicherheitsdaten.",
    arkhamDescription: "Öffentliche Entity-Labels, Wallet-Aktivität und nachvollziehbare On-Chain-Bewegungen für Whale-Kontext.",
    coinalyzeDescription: "Open Interest, aktuelle und erwartete Funding-Raten, Futures-Märkte und Positionierungsdaten.",
    openmarketDescription: "Candles, Orderflow, Liquidationen, Open Interest, Funding und Heatmap-fähige Marktpunkte.",
    officialDocs: "Offizielle Dokumentation",
    openPlatform: "Plattform öffnen",
    conflictPolicy: "Bei Datenkonflikten pausiert der Trade.",
    conflictCopy: "Primärquellen schlagen Rohdatenanbieter; Rohdaten schlagen Aggregatoren; Social-Daten bleiben Kontext. Wesentliche Konflikte führen zu keinem Trade.",
    disclaimer: "Research-Tool für Paper-Trading. Keine Finanzberatung. Keine Gewinngarantie.",
    navHome: "Home",
    navAnalyze: "Analyse",
    navJournal: "Journal",
    navSources: "Quellen",
    connected: "VERBUNDEN",
    unavailable: "NICHT VERFÜGBAR",
    enterAsset: "Bitte Asset, Ticker oder Contract eingeben.",
    analysisFailed: "Analyse konnte nicht abgeschlossen werden.",
    noSignalCreated: "Es wurde kein Signal erstellt.",
    latestLiveDecision: "Aktuelle Live-Entscheidung",
    trigger: "TRIGGER",
    entry: "EINSTIEG",
    stop: "STOP",
    target: "ZIEL",
    rr: "CRV",
    why: "WARUM",
    risksVetoes: "RISIKEN + VETOS",
    scoreBreakdown: "SCORE-AUFTEILUNG",
    verifiedSources: "VERIFIZIERTE QUELLEN",
    noSourceLinks: "Keine verifizierbaren Quellenlinks zurückgegeben.",
    exportResult: "Ergebnis exportieren",
    newAnalysis: "Neue Analyse",
    paperTrade: "Paper-Trade",
    generated: "Erstellt",
    etoro: "eToro DE",
    direction: "RICHTUNG",
    risk: "RISIKO",
    resultSaved: "Analyse unveränderlich im lokalen Journal gespeichert.",
    journalCleared: "Journal geleert.",
    confirmClear: "Alle gespeicherten Analysen auf diesem Gerät löschen?",
    nothingToExport: "Noch nichts zum Exportieren vorhanden.",
    marketUnavailable: "Live-Marktfeed derzeit nicht verfügbar.",
    dataAsOf: "Datenstand",
    sourceConnected: "DIREKT VERBUNDEN",
    viaAiSearch: "VIA WEB-SUCHE",
    sourceLimited: "QUELLE BEGRENZT",
    engineChecking: "ENGINE-PRÜFUNG",
    engineReady: "ANALYZER BEREIT",
    engineOffline: "ANALYZER OFFLINE",
    engineOfflineHelp: "Der Analyzer ist serverseitig nicht konfiguriert. Füge OpenRouter oder Hugging Face als Render-Secret hinzu.",
    serverSecretsOnly: "NUR SERVER-SECRETS",
    catalyst: "Katalysator",
    technical: "Chart + Momentum",
    derivatives: "Derivate + Flow",
    smartMoney: "Smart Money",
    execution: "Ausführung",
    traderConsensus: "Trader-Konsens",
    riskReward: "CRV + Invalidierung",
    dataQuality: "Datenqualität",
    marketSnapshot: "MARKT-SNAPSHOT",
    memeDueDiligence: "MEME-COIN DUE DILIGENCE",
    confirmations: "UNABHÄNGIGE BESTÄTIGUNGEN",
    closedTrades: "Abgeschlossene Trades",
    verifiedOnly: "nur verifiziert",
    winRate: "Trefferquote",
    averageR: "Durchschnittliches R",
    expectancy: "Erwartungswert",
    profitFactor: "Profit Factor",
    grossWinLoss: "Bruttogewinn / -verlust",
    maxDrawdown: "Max. Drawdown",
    streak: "G / V Serie",
    currentSeries: "aktuelle Serie",
    positionSizer: "Positionsgröße",
    accountSize: "Kontogröße",
    riskPercent: "Max. Risiko %",
    estimatedFees: "Geschätzte Round-Trip-Gebühren",
    maxLoss: "MAX. VERLUST",
    units: "EINHEITEN",
    notional: "POSITIONSWERT",
    sizerWarning: "Die Berechnung überschreibt keine Liquiditäts-, Hebel-, Spread- oder Hard-Veto-Regel.",
    evaluateNow: "JETZT AUSWERTEN",
    evaluating: "WIRD AUSGEWERTET…",
    evaluationSaved: "Paper-Trade-Auswertung gespeichert.",
    outcome: "ERGEBNIS",
  },
  en: {
    command: "Analyze asset",
    scanWholeMarket: "Scan the whole market",
    masterScanner: "MASTER SCANNER",
    scannerTitle: "scan --scope global<br /><em>filter --strict</em>",
    scannerIntro: "Candidate discovery followed by a complete independent deep analysis. Only executable A/A+ paper setups reach the alert feed.",
    scanConfiguration: "Scan configuration",
    marketScope: "Market scope",
    scopeGlobal: "Global — all markets",
    scopeCrypto: "Crypto + altcoins",
    scopeMeme: "Meme coins",
    scopeEquities: "Stocks + ETFs + indices",
    scopeMacro: "Gold + forex + macro",
    candidates: "Candidates",
    discoverThenVerify: "Discover first, verify each candidate second",
    onlyAA: "Only A/A+ enters the alert feed",
    noForcedTrade: "Empty result is valid — no forced trade",
    paperNoOrders: "Paper only — never sends an order",
    startMasterScan: "START MASTER SCAN",
    morningBrief: "MORNING BRIEF · TOP 5",
    monitoring: "Monitoring",
    scanInterval: "Scan interval",
    monitorLimit: "Runs only while this page stays open. True 24/7 monitoring requires a hosted worker.",
    monitorOff: "OFF",
    monitorOn: "ACTIVE",
    scannerReady: "Ready to scan.",
    scannerReadyCopy: "Select a market scope and start. Discovery candidates are signals only after every rule passes.",
    discoveringCandidates: "Discovering current candidates…",
    discovery: "Discovery",
    deepChecks: "Deep checks",
    hardVetoFilter: "Hard-veto filter",
    alertGate: "A/A+ gate",
    scanFailed: "Master scan could not be completed.",
    noAASetup: "No A/A+ setup found.",
    noAASetupCopy: "Every scanned candidate failed at least one fixed quality rule. No trade.",
    executableAlerts: "A/A+ ALERTS",
    researchedCandidates: "RESEARCHED CANDIDATES",
    candidateError: "Deep analysis failed",
    nextScan: "Next scan",
    browserNotifications: "Browser notifications were not allowed; in-app alerts remain active.",
    navScan: "Scan",
    paperMode: "PAPER MODE",
    modeCopy: "Forward test · no real orders",
    researchTerminal: "GLOBAL RESEARCH TERMINAL",
    heroTitle: "inspect market.<br /><em>setup or no trade.</em>",
    heroDescription: "Current sources in. Fixed rules applied. Exact paper-trade levels out — or no trade.",
    assetInputLabel: "Asset, ticker or contract",
    runAnalysis: "RUN ANALYSIS",
    hardVeto: "Hard-veto enforced",
    freshData: "Fresh sources only",
    signalRadar: "SIGNAL RADAR",
    standingBy: "STANDBY",
    threshold: "SIGNAL THRESHOLD",
    decision: "DEFAULT DECISION",
    noTrade: "NO TRADE",
    marketPulse: "MARKET PULSE",
    awaitingFeed: "AWAITING FEED",
    loadingMarket: "loading current market data…",
    globalTrend: "GLOBAL TREND",
    unknown: "UNKNOWN",
    needsResearch: "Requires live research",
    sourceHealth: "SOURCE HEALTH",
    coreSourcesReady: "Core sources ready",
    qualityGate: "QUALITY GATE",
    belowRejected: "Below 82 rejected",
    executionMode: "EXECUTION MODE",
    paper: "PAPER",
    realOrdersDisabled: "Real orders disabled",
    latestDecision: "Latest decision",
    openAnalyzer: "Open analyzer",
    noVerifiedSignal: "No verified signal yet.",
    connectAndRun: "Start a current server-side analysis. Nothing shown here is fabricated.",
    sourceStatus: "Source status",
    onDemand: "ON DEMAND",
    marketData: "Market + DEX data",
    publicFeed: "PUBLIC",
    walletIntel: "Wallet intelligence",
    webSearch: "WEB SEARCH",
    derivativesData: "OI + funding data",
    optionalKey: "SERVER FEED",
    serverFeed: "SERVER FEED",
    orderflowData: "Orderflow + liquidations",
    liveResearch: "LIVE RESEARCH",
    analyzerTitle: "analyze --asset<br /><em>verify --sources</em>",
    analyzerIntro: "One current request, multiple independent checks, one immutable paper-trade decision.",
    analysisRequest: "Analysis request",
    paperOnly: "PAPER ONLY",
    assetContract: "Asset, ticker or contract",
    assetExamples: "Examples: BTC, NVDA, XAUUSD or token contract",
    assetClass: "Asset class",
    chain: "Chain (optional)",
    horizon: "Horizon",
    sourceMode: "Source mode",
    coreOnly: "Core only",
    verifiedExtended: "Verified extended",
    ruleFresh: "Current sources required",
    ruleRR: "Minimum reward/risk 2:1",
    ruleEtoro: "eToro Germany checked",
    ruleVeto: "Hard veto cannot be overridden",
    startLiveAnalysis: "START LIVE ANALYSIS",
    readyForAsset: "Ready for an asset.",
    readyCopy: "Results appear only after a fresh source check. Until then, all levels remain blank.",
    researchRunning: "RESEARCH://RUNNING",
    crossChecking: "Cross-checking current data…",
    stageMarket: "Market data",
    stageDerivatives: "Derivatives",
    stageWallets: "Wallets",
    stageExecution: "Execution",
    stageScore: "Score",
    forwardTest: "FORWARD TEST",
    journalTitle: "paper.log<br /><em>forward only</em>",
    journalIntro: "Only analyses generated before a move are stored. No retroactive winners.",
    analysisHistory: "Analysis history",
    exportJson: "Export JSON",
    clear: "Clear",
    storedAnalyses: "Stored analyses",
    aSetups: "A / A+ setups",
    noTradeDecisions: "No-trade decisions",
    realOrders: "Real orders",
    journalEmpty: "The journal is empty.",
    journalEmptyCopy: "Run a live analysis to record the first immutable decision on this device.",
    analyzeAsset: "ANALYZE ASSET",
    sourceArchitecture: "SOURCE ARCHITECTURE",
    sourcesTitle: "sources.list<br /><em>primary first</em>",
    sourcesIntro: "Core research is domain-restricted. All model and data credentials stay in protected server secrets.",
    cmcDescription: "Current crypto prices, market cap, volume, DEX liquidity, holders and token security data.",
    arkhamDescription: "Public entity labels, wallet activity and traceable on-chain movements for whale context.",
    coinalyzeDescription: "Open interest, current and predicted funding rates, futures markets and positioning context.",
    openmarketDescription: "Candles, orderflow, liquidations, open interest, funding and heatmap-ready market points.",
    officialDocs: "Official docs",
    openPlatform: "Open platform",
    conflictPolicy: "When data conflicts, the trade pauses.",
    conflictCopy: "Primary sources beat raw-data providers; raw data beats aggregators; social stays context only. Material conflicts trigger no trade.",
    disclaimer: "Research tool for paper trading. No financial advice. No profit guarantees.",
    navHome: "Home",
    navAnalyze: "Analyze",
    navJournal: "Journal",
    navSources: "Sources",
    connected: "CONNECTED",
    unavailable: "UNAVAILABLE",
    enterAsset: "Enter an asset, ticker or contract.",
    analysisFailed: "Analysis could not be completed.",
    noSignalCreated: "No signal was created.",
    latestLiveDecision: "Latest live decision",
    trigger: "TRIGGER",
    entry: "ENTRY",
    stop: "STOP",
    target: "TARGET",
    rr: "R/R",
    why: "WHY",
    risksVetoes: "RISKS + VETOES",
    scoreBreakdown: "SCORE BREAKDOWN",
    verifiedSources: "VERIFIED SOURCES",
    noSourceLinks: "No verifiable source links were returned.",
    exportResult: "Export result",
    newAnalysis: "New analysis",
    paperTrade: "Paper trade",
    generated: "Generated",
    etoro: "eToro DE",
    direction: "DIRECTION",
    risk: "RISK",
    resultSaved: "Analysis stored immutably in the local journal.",
    journalCleared: "Journal cleared.",
    confirmClear: "Delete every stored analysis on this device?",
    nothingToExport: "There is nothing to export yet.",
    marketUnavailable: "Live market feed is currently unavailable.",
    dataAsOf: "Data as of",
    sourceConnected: "DIRECT CONNECTED",
    viaAiSearch: "VIA WEB SEARCH",
    sourceLimited: "SOURCE LIMITED",
    engineChecking: "ENGINE CHECK",
    engineReady: "ANALYZER READY",
    engineOffline: "ANALYZER OFFLINE",
    engineOfflineHelp: "The analyzer is not configured on the server. Add OpenRouter or Hugging Face as a Render secret.",
    serverSecretsOnly: "SERVER SECRETS ONLY",
    catalyst: "Catalyst",
    technical: "Chart + momentum",
    derivatives: "Derivatives + flow",
    smartMoney: "Smart money",
    execution: "Execution",
    traderConsensus: "Trader consensus",
    riskReward: "R/R + invalidation",
    dataQuality: "Data quality",
    marketSnapshot: "MARKET SNAPSHOT",
    memeDueDiligence: "MEME-COIN DUE DILIGENCE",
    confirmations: "INDEPENDENT CONFIRMATIONS",
    closedTrades: "Closed trades",
    verifiedOnly: "verified only",
    winRate: "Win rate",
    averageR: "Average R",
    expectancy: "expectancy",
    profitFactor: "Profit factor",
    grossWinLoss: "gross win / loss",
    maxDrawdown: "Max drawdown",
    streak: "W / L streak",
    currentSeries: "current series",
    positionSizer: "Position sizing",
    accountSize: "Account size",
    riskPercent: "Max risk %",
    estimatedFees: "Estimated round-trip fees",
    maxLoss: "MAX LOSS",
    units: "UNITS",
    notional: "NOTIONAL",
    sizerWarning: "The calculation does not override liquidity, leverage, spread or hard-veto rules.",
    evaluateNow: "EVALUATE NOW",
    evaluating: "EVALUATING…",
    evaluationSaved: "Paper-trade evaluation saved.",
    outcome: "OUTCOME",
  },
};

const state = {
  language: localStorage.getItem("jarvis.language") === "en" ? "en" : "de",
  engine: { ready: false, primary: null, fallback: null, webResearch: false },
  managedProviders: { cmc: false, coinalyze: false, openmarket: false },
  currentAnalysis: null,
  currentMeta: null,
  currentScan: null,
  journal: loadJournal(),
  running: false,
  scanning: false,
  monitorEnabled: false,
  monitorTimer: null,
  monitorNextAt: null,
};

const elements = {
  engineLed: document.querySelector("#engineLed"),
  engineStatusLabel: document.querySelector("#engineStatusLabel"),
  railEngineStatus: document.querySelector("#railEngineStatus"),
  languageToggle: document.querySelector("#languageToggle"),
  quickForm: document.querySelector("#quickForm"),
  quickAsset: document.querySelector("#quickAsset"),
  analysisForm: document.querySelector("#analysisForm"),
  assetInput: document.querySelector("#assetInput"),
  assetClass: document.querySelector("#assetClass"),
  chainField: document.querySelector("#chainField"),
  analysisIdle: document.querySelector("#analysisIdle"),
  scanProgress: document.querySelector("#scanProgress"),
  analysisResult: document.querySelector("#analysisResult"),
  scanAsset: document.querySelector("#scanAsset"),
  progressBar: document.querySelector("#progressBar"),
  scanStages: document.querySelector("#scanStages"),
  terminalLog: document.querySelector("#terminalLog"),
  analyzeButton: document.querySelector("#analyzeButton"),
  scannerForm: document.querySelector("#scannerForm"),
  scanButton: document.querySelector("#scanButton"),
  morningBriefButton: document.querySelector("#morningBriefButton"),
  scannerIdle: document.querySelector("#scannerIdle"),
  masterProgress: document.querySelector("#masterProgress"),
  masterProgressBar: document.querySelector("#masterProgressBar"),
  masterProgressValue: document.querySelector("#masterProgressValue"),
  masterProgressTitle: document.querySelector("#masterProgressTitle"),
  masterStages: document.querySelector("#masterStages"),
  masterLog: document.querySelector("#masterLog"),
  scannerResults: document.querySelector("#scannerResults"),
  monitorToggle: document.querySelector("#monitorToggle"),
  monitorInterval: document.querySelector("#monitorInterval"),
  monitorStatus: document.querySelector("#monitorStatus"),
  monitorNext: document.querySelector("#monitorNext"),
  marketTicker: document.querySelector("#marketTicker"),
  marketTimestamp: document.querySelector("#marketTimestamp"),
  globalTrendValue: document.querySelector("#globalTrendValue"),
  sourceCount: document.querySelector("#sourceCount"),
  dashboardSignal: document.querySelector("#dashboardSignal"),
  journalList: document.querySelector("#journalList"),
  journalSummary: document.querySelector("#journalSummary"),
  positionForm: document.querySelector("#positionForm"),
  toastRegion: document.querySelector("#toastRegion"),
};

init();

async function init() {
  applyLanguage();
  bindEvents();
  updateClock();
  setInterval(updateClock, 1000);
  renderJournal();
  calculatePositionSize();
  updateChainField();
  await Promise.allSettled([loadConfig(), loadMarketOverview()]);
  const initialView = ["dashboard", "scanner", "analyzer", "journal", "sources"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "dashboard";
  navigate(initialView, false);
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      event.preventDefault();
      navigate(nav.dataset.nav);
    }

    if (event.target.closest("[data-export-current]")) exportCurrentAnalysis();
    if (event.target.closest("[data-new-analysis]")) resetAnalysisView();

    const scanAnalysis = event.target.closest("[data-scan-analysis]");
    if (scanAnalysis) openScanAnalysis(Number(scanAnalysis.dataset.scanAnalysis));

    const evaluate = event.target.closest("[data-evaluate-record]");
    if (evaluate) evaluateRecord(evaluate.dataset.evaluateRecord, evaluate);
  });

  elements.languageToggle.addEventListener("click", () => {
    state.language = state.language === "de" ? "en" : "de";
    localStorage.setItem("jarvis.language", state.language);
    applyLanguage();
    renderJournal();
    if (state.currentAnalysis) renderAnalysis(state.currentAnalysis, state.currentMeta, false);
    if (state.currentScan) renderScannerResults(state.currentScan, false);
    updateMonitorUI();
    calculatePositionSize();
  });

  elements.quickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const asset = elements.quickAsset.value.trim();
    if (!asset) return toast(t("enterAsset"), "warning");
    elements.assetInput.value = asset;
    autoDetectAssetClass(asset);
    navigate("analyzer");
    window.setTimeout(() => requestAnalysis(), 260);
  });

  elements.analysisForm.addEventListener("submit", (event) => {
    event.preventDefault();
    requestAnalysis();
  });

  elements.scannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    requestMasterScan();
  });
  elements.morningBriefButton.addEventListener("click", () => requestMasterScan({ morningBrief: true }));
  elements.monitorToggle.addEventListener("click", toggleMonitoring);
  elements.monitorInterval.addEventListener("change", () => { if (state.monitorEnabled) scheduleMonitor(); });
  elements.positionForm.addEventListener("input", calculatePositionSize);

  elements.assetClass.addEventListener("change", updateChainField);
  document.querySelector("#exportJournal").addEventListener("click", exportJournal);
  document.querySelector("#clearJournal").addEventListener("click", clearJournal);

  document.querySelector(".wordmark").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") navigate("dashboard");
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      navigate("analyzer");
      window.setTimeout(() => elements.assetInput.focus(), 120);
    }
  });
}

function navigate(view, updateHash = true) {
  document.querySelectorAll("[data-view]").forEach((section) => section.classList.toggle("active", section.dataset.view === view));
  document.querySelectorAll("[data-nav]").forEach((button) => button.classList.toggle("active", button.dataset.nav === view));
  if (updateHash) history.replaceState(null, "", `#${view}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "analyzer") window.setTimeout(() => elements.assetInput.focus({ preventScroll: true }), 220);
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = translations[state.language][node.dataset.i18n];
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const value = translations[state.language][node.dataset.i18nHtml];
    if (value) node.innerHTML = value;
  });
  elements.languageToggle.querySelectorAll("span").forEach((span) => span.classList.toggle("active", span.textContent.toLowerCase() === state.language));
  updateEngineUI();
}

function t(key) {
  return translations[state.language][key] || translations.en[key] || key;
}

async function loadConfig() {
  const response = await apiFetch("/api/config");
  state.engine = { ...state.engine, ...(response.analyzer || {}) };
  state.managedProviders = { ...state.managedProviders, ...(response.dataProviders || {}) };
  updateEngineUI();
}

async function loadMarketOverview() {
  try {
    const data = await apiFetch("/api/market-overview");
    if (!data.available || !Array.isArray(data.top) || !data.top.length) throw new Error("Market feed unavailable");
    const locale = state.language === "de" ? "de-DE" : "en-US";
    elements.marketTicker.innerHTML = data.top.map((asset) => {
      const change = Number(asset.change24h);
      const changeClass = Number.isFinite(change) ? (change >= 0 ? "positive" : "negative") : "";
      return `<div class="ticker-item"><strong>${escapeHtml(asset.symbol)}</strong><span class="price">${formatPrice(asset.price, locale)}</span><small>${escapeHtml(asset.name)}</small><span class="change ${changeClass}">${Number.isFinite(change) ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "—"}</span></div>`;
    }).join("");
    elements.marketTimestamp.textContent = shortUtc(data.asOf);
  } catch {
    elements.marketTicker.innerHTML = `<span class="ticker-loading">CMC:// <span>${escapeHtml(t("marketUnavailable"))}</span></span>`;
    elements.marketTimestamp.textContent = "OFFLINE";
  }
}

function updateEngineUI() {
  const ready = Boolean(state.engine.ready);
  elements.engineLed.classList.toggle("ready", ready);
  elements.engineLed.classList.toggle("offline", !ready);
  elements.engineStatusLabel.textContent = ready ? t("engineReady") : t("engineOffline");
  if (elements.railEngineStatus) {
    elements.railEngineStatus.classList.toggle("ready", ready);
    elements.railEngineStatus.classList.toggle("offline", !ready);
    const label = elements.railEngineStatus.querySelector("span:last-child");
    if (label) label.textContent = ready ? `${state.engine.primary || "ai"}_ready` : "engine_offline";
  }

  const activeCount = 1 + (state.engine.webResearch ? 1 : 0) + (providerConnected("coinalyze") ? 1 : 0) + (providerConnected("openmarket") ? 1 : 0);
  elements.sourceCount.textContent = String(Math.min(4, activeCount));

  document.querySelectorAll(".source-row").forEach((row) => {
    const provider = row.dataset.provider;
    const badge = row.querySelector(".provider-state");
    if (!badge) return;
    if (provider === "coinmarketcap") {
      badge.textContent = providerConnected("cmc") ? t("sourceConnected") : t("publicFeed");
      badge.className = `provider-state ${providerConnected("cmc") ? "connected" : "public"}`;
    } else if (provider === "arkham") {
      badge.textContent = state.engine.webResearch ? t("viaAiSearch") : t("sourceLimited");
      badge.className = `provider-state ${state.engine.webResearch ? "connected" : "optional"}`;
    } else {
      const isConnected = providerConnected(provider);
      badge.textContent = isConnected ? t("sourceConnected") : t("unavailable");
      badge.className = `provider-state ${isConnected ? "connected" : "optional"}`;
    }
  });
}

function providerConnected(name) {
  return Boolean(state.managedProviders[name]);
}

function updateChainField() {
  elements.chainField.hidden = !["CRYPTO", "MEME"].includes(elements.assetClass.value);
}

function autoDetectAssetClass(value) {
  const upper = value.trim().toUpperCase();
  if (/^0X[A-F0-9]{40}$/.test(upper) || /^[1-9A-HJ-NP-ZA-KM-Z]{32,50}$/i.test(value.trim())) elements.assetClass.value = "MEME";
  else if (["XAU", "XAUUSD", "GOLD"].includes(upper)) elements.assetClass.value = "GOLD";
  else if (/^[A-Z]{6}$/.test(upper) && upper.endsWith("USD")) elements.assetClass.value = "FOREX";
  else elements.assetClass.value = "CRYPTO";
  updateChainField();
}

async function requestMasterScan({ morningBrief = false, automated = false } = {}) {
  if (state.scanning) return;
  if (!state.engine.ready) {
    if (!automated) toast(t("engineOfflineHelp"), "warning");
    return;
  }

  state.scanning = true;
  elements.scanButton.disabled = true;
  elements.morningBriefButton.disabled = true;
  showMasterProgress(morningBrief);
  const payload = {
    scope: document.querySelector("#scanScope").value,
    horizon: document.querySelector("#scanHorizon").value,
    maxCandidates: morningBrief ? 5 : Number(document.querySelector("#scanMax").value),
    sourceMode: document.querySelector("#scanSourceMode").value,
    language: state.language,
  };
  const progress = createMasterProgressController();
  const progressTimer = setInterval(progress.advance, 2600);
  const logTimer = setInterval(progress.log, 6100);

  try {
    const response = await apiFetch("/api/scan", { method: "POST", body: payload });
    progress.complete();
    await wait(360);
    state.currentScan = response;
    renderScannerResults(response, true);
    for (const item of response.analyses || []) {
      if (item.analysis) storeAnalysis(item.analysis, { ...(item.meta || {}), source: morningBrief ? "MORNING_BRIEF" : "MASTER_SCAN" });
    }
    notifyAlerts(response.alerts || []);
  } catch (error) {
    renderMasterError(error);
  } finally {
    clearInterval(progressTimer);
    clearInterval(logTimer);
    state.scanning = false;
    elements.scanButton.disabled = false;
    elements.morningBriefButton.disabled = false;
    if (state.monitorEnabled) scheduleMonitor();
  }
}

function showMasterProgress(morningBrief) {
  elements.scannerIdle.hidden = true;
  elements.scannerResults.hidden = true;
  elements.masterProgress.hidden = false;
  elements.masterProgressBar.style.width = "4%";
  elements.masterProgressValue.textContent = morningBrief ? "05" : document.querySelector("#scanMax").value.padStart(2, "0");
  elements.masterProgressTitle.textContent = t("discoveringCandidates");
  elements.masterStages.querySelectorAll("span").forEach((node, index) => {
    node.classList.toggle("active", index === 0);
    node.classList.remove("done");
  });
  elements.masterLog.textContent = state.language === "de"
    ? "$ globales Research-Mesh wird initialisiert…\n$ aktuelle Quellen- und Hard-Veto-Regeln geladen…"
    : "$ initializing global research mesh…\n$ loading current source and hard-veto policy…";
}

function createMasterProgressController() {
  let value = 4;
  let stage = 0;
  let logIndex = 0;
  const logs = state.language === "de"
    ? [
        "$ frische Katalysatoren und Volumenanomalien werden gesucht…",
        "$ stärkste Kandidaten werden einzeln tiefengeprüft…",
        "$ Wallet-, Derivate-, Chart- und Ausführungsdaten werden abgeglichen…",
        "$ Meme-Contract- und Manipulationsprüfungen laufen…",
        "$ feste Score-Matrix, CRV und Hard-Vetos werden angewendet…",
        "$ nur ausführbare A-/A+-Setups passieren den Alarm-Filter…",
      ]
    : [
        "$ searching fresh catalysts and volume anomalies…",
        "$ deep-checking the strongest candidates individually…",
        "$ cross-checking wallets, derivatives, charts and execution…",
        "$ running meme-contract and manipulation checks…",
        "$ applying fixed score matrix, R/R and hard vetoes…",
        "$ allowing only executable A/A+ setups through the alert gate…",
      ];
  return {
    advance() {
      value = Math.min(94, value + Math.max(1, Math.round((95 - value) * 0.1)));
      elements.masterProgressBar.style.width = `${value}%`;
      const next = Math.min(3, Math.floor(value / 25));
      if (next !== stage) {
        stage = next;
        elements.masterStages.querySelectorAll("span").forEach((node, index) => {
          node.classList.toggle("done", index < stage);
          node.classList.toggle("active", index === stage);
        });
      }
    },
    log() {
      if (logIndex >= logs.length) return;
      elements.masterLog.textContent += `\n${logs[logIndex++]}`;
      elements.masterLog.scrollTop = elements.masterLog.scrollHeight;
    },
    complete() {
      elements.masterProgressBar.style.width = "100%";
      elements.masterStages.querySelectorAll("span").forEach((node) => { node.classList.add("done"); node.classList.remove("active"); });
    },
  };
}

function renderScannerResults(response, announce = false) {
  elements.scannerIdle.hidden = true;
  elements.masterProgress.hidden = true;
  elements.scannerResults.hidden = false;
  const analyses = Array.isArray(response.analyses) ? response.analyses : [];
  const alerts = analyses.map((item, index) => ({ item, index })).filter(({ item }) => item.analysis?.executable && ["A", "A+"].includes(item.analysis?.verdict));
  const trend = response.discovery?.marketTrend || "UNKNOWN";
  const summary = response.discovery?.summary || "";
  const noTrade = alerts.length === 0;
  const alertHtml = alerts.length
    ? `<section class="scan-section"><div class="scan-section-title"><span>${escapeHtml(t("executableAlerts"))}</span><strong>${alerts.length}</strong></div><div class="alert-stack">${alerts.map(({ item, index }) => renderScanCard(item, index, true)).join("")}</div></section>`
    : `<article class="no-setup"><div class="no-setup-icon"><svg><use href="#i-shield"></use></svg></div><div><span class="terminal-line">SIGNAL_GATE://REJECTED</span><h2>${escapeHtml(t("noAASetup"))}</h2><p>${escapeHtml(t("noAASetupCopy"))}</p></div><strong>${escapeHtml(t("noTrade"))}</strong></article>`;
  const researched = analyses.map((item, index) => ({ item, index })).filter(({ item }) => !item.analysis?.executable);
  const candidatesHtml = researched.length
    ? researched.map(({ item, index }) => renderScanCard(item, index, false)).join("")
    : `<div class="scanner-empty-line">${escapeHtml(response.discovery?.noSetupReason || t("noAASetup"))}</div>`;

  elements.scannerResults.innerHTML = `
    <header class="scanner-summary ${noTrade ? "neutral" : "live"}">
      <div><span class="terminal-line">MASTER_SCAN://COMPLETE</span><h2>${escapeHtml(String(trend).replaceAll("_", "-"))}</h2><p>${escapeHtml(summary)}</p></div>
      <div class="scan-stats"><span><small>${escapeHtml(t("candidates"))}</small><strong>${analyses.length}</strong></span><span><small>A / A+</small><strong>${alerts.length}</strong></span><span><small>UTC</small><strong>${escapeHtml(shortUtc(response.meta?.generatedAt).replace(" UTC", ""))}</strong></span></div>
    </header>
    ${alertHtml}
    <section class="scan-section"><div class="scan-section-title"><span>${escapeHtml(t("researchedCandidates"))}</span><strong>${researched.length}</strong></div><div class="candidate-stack">${candidatesHtml}</div></section>
    <footer class="scan-result-footer"><span><svg><use href="#i-shield"></use></svg>${escapeHtml(t("paperNoOrders"))}</span><span>${escapeHtml(response.meta?.durationMs ? `${Math.round(response.meta.durationMs / 1000)}s` : "—")}</span></footer>`;
  elements.globalTrendValue.textContent = String(trend).replaceAll("_", "-");
  elements.globalTrendValue.className = `metric-value ${trend === "RISK_ON" ? "positive" : trend === "RISK_OFF" ? "negative" : ""}`;
  if (announce) toast(alerts.length ? `${alerts.length} ${t("executableAlerts")}` : t("noAASetup"), alerts.length ? "success" : "warning");
}

function renderScanCard(item, index, alert) {
  if (!item.analysis) {
    return `<article class="candidate-card error"><div><span class="terminal-line">${escapeHtml(item.candidate?.asset || "—")}</span><h3>${escapeHtml(t("candidateError"))}</h3><p>${escapeHtml(item.error?.message || "—")}</p></div><span class="journal-verdict">ERROR</span></article>`;
  }
  const a = item.analysis;
  const trade = a.trade || {};
  const risk = [...(a.redFlags || []), ...(a.hardVetoes || [])][0] || "—";
  const diagnostic = !a.executable && ["INSUFFICIENT_DATA", "NO_TRADE"].includes(a.verdict);
  if (diagnostic) {
    const snapshot = a.marketData || {};
    const blocks = [...(a.dataQuality?.limitations || []), ...(a.hardVetoes || []), ...(a.redFlags || [])]
      .filter((value, position, values) => value && values.indexOf(value) === position)
      .slice(0, 2);
    const stateLabel = a.verdict === "INSUFFICIENT_DATA" ? (state.language === "de" ? "DATENLÜCKE" : "DATA GAP") : (state.language === "de" ? "ABGELEHNT" : "REJECTED");
    const marketRows = [["PRICE", snapshot.price], ["24H", snapshot.change24h], ["VOL", snapshot.volume24h]]
      .filter(([, value]) => value)
      .map(([label, value]) => `<span><small>${label}</small><strong>${escapeHtml(value)}</strong></span>`).join("");
    return `<article class="candidate-card diagnostic">
      <div class="diagnostic-state"><strong>${stateLabel}</strong><small>${a.verdict === "NO_TRADE" ? `SCORE ${escapeHtml(a.score ?? 0)}/100` : (state.language === "de" ? "KEIN SIGNAL" : "NO SIGNAL")}</small></div>
      <div class="candidate-main"><span class="terminal-line">${escapeHtml(a.assetClass || "OTHER")} · ${escapeHtml(a.direction || "WATCH")}</span><h3>${escapeHtml(a.asset || "—")} <small>${escapeHtml(a.assetName || "")}</small></h3><p>${escapeHtml(a.headline || "—")}</p><div class="diagnostic-blocks">${blocks.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}</div></div>
      <div class="diagnostic-evidence"><small>${state.language === "de" ? "DIREKTE MARKTDATEN" : "DIRECT MARKET DATA"}</small><div class="diagnostic-market">${marketRows || "<span><strong>—</strong></span>"}</div><div class="provider-health">${renderProviderHealth(item.providerStatus, a.assetClass)}</div></div>
      <div class="candidate-risk"><small>${state.language === "de" ? "HAUPTBLOCKER" : "PRIMARY BLOCKER"}</small><p>${escapeHtml(risk)}</p><button class="ghost-button" data-scan-analysis="${index}"><span>${escapeHtml(t("openAnalyzer"))}</span><svg><use href="#i-arrow"></use></svg></button></div>
    </article>`;
  }
  return `<article class="candidate-card ${alert ? "alert" : ""}">
    <div class="candidate-score"><strong>${escapeHtml(a.score ?? 0)}</strong><small>/100</small><span>${escapeHtml(String(a.verdict || "NO_TRADE").replaceAll("_", " "))}</span></div>
    <div class="candidate-main"><span class="terminal-line">${escapeHtml(a.assetClass || "OTHER")} · ${escapeHtml(a.direction || "WATCH")}</span><h3>${escapeHtml(a.asset || "—")} <small>${escapeHtml(a.assetName || "")}</small></h3><p>${escapeHtml(a.headline || "—")}</p><div class="candidate-why">${(a.why || []).slice(0, 3).map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}</div></div>
    <div class="candidate-levels"><span><small>${escapeHtml(t("trigger"))}</small><strong>${escapeHtml(trade.trigger || "—")}</strong></span><span><small>${escapeHtml(t("stop"))}</small><strong>${escapeHtml(trade.stop || "—")}</strong></span><span><small>${escapeHtml(t("target"))}</small><strong>${escapeHtml(trade.target || "—")}</strong></span><span><small>${escapeHtml(t("rr"))}</small><strong>${trade.rr !== null && trade.rr !== "" && Number.isFinite(Number(trade.rr)) ? `${Number(trade.rr).toFixed(2)}:1` : "—"}</strong></span></div>
    <div class="candidate-risk"><small>RED FLAG</small><p>${escapeHtml(risk)}</p><button class="ghost-button" data-scan-analysis="${index}"><span>${escapeHtml(t("openAnalyzer"))}</span><svg><use href="#i-arrow"></use></svg></button></div>
  </article>`;
}

function renderProviderHealth(providerStatus = {}, assetClass = "OTHER") {
  const crypto = ["CRYPTO", "MEME"].includes(assetClass);
  const labels = { coinmarketcap: "CMC", coinbase: "COINBASE", kraken: "KRAKEN", coinalyze: "COINALYZE", openmarket: "OPENMARKET", arkham: "ARKHAM" };
  return Object.entries(labels).filter(([key]) => crypto || key === "arkham").map(([key, label]) => {
    const value = providerStatus?.[key] || {};
    const status = value.status === "ok" ? "LIVE" : value.status === "web_search" ? "WEB" : state.language === "de" ? "FEHLT" : "MISS";
    const className = value.status === "ok" ? "live" : value.status === "web_search" ? "web" : "miss";
    return `<span class="source-chip ${className}" title="${escapeAttr(value.note || `${label} ${status}`)}"><i></i>${label}<b>${status}</b></span>`;
  }).join("");
}

function renderMasterError(error) {
  elements.scannerIdle.hidden = true;
  elements.masterProgress.hidden = true;
  elements.scannerResults.hidden = false;
  elements.scannerResults.innerHTML = `<div class="output-idle"><div class="idle-core" style="color:var(--red);border-color:rgba(255,98,123,.28)"><svg><use href="#i-alert"></use></svg></div><span class="terminal-line">MASTER_SCAN://ABORTED</span><h2>${escapeHtml(t("scanFailed"))}</h2><p>${escapeHtml(error.message || t("noSignalCreated"))}</p></div>`;
  toast(error.message || t("scanFailed"), "error");
}

function openScanAnalysis(index) {
  const item = state.currentScan?.analyses?.[index];
  if (!item?.analysis) return;
  state.currentAnalysis = item.analysis;
  state.currentMeta = { ...(item.meta || state.currentScan.meta), providerStatus: item.providerStatus || {} };
  renderAnalysis(item.analysis, state.currentMeta, false);
  navigate("analyzer");
}

async function toggleMonitoring() {
  if (state.monitorEnabled) {
    stopMonitoring();
    return;
  }
  if (!state.engine.ready) {
    toast(t("engineOfflineHelp"), "warning");
    return;
  }
  state.monitorEnabled = true;
  if ("Notification" in globalThis && Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") toast(t("browserNotifications"), "warning");
  }
  updateMonitorUI();
  requestMasterScan({ automated: true });
}

function stopMonitoring() {
  state.monitorEnabled = false;
  state.monitorNextAt = null;
  if (state.monitorTimer) clearTimeout(state.monitorTimer);
  state.monitorTimer = null;
  updateMonitorUI();
}

function scheduleMonitor() {
  if (!state.monitorEnabled) return;
  if (state.monitorTimer) clearTimeout(state.monitorTimer);
  const minutes = Math.max(15, Number(elements.monitorInterval.value) || 30);
  state.monitorNextAt = Date.now() + minutes * 60_000;
  state.monitorTimer = setTimeout(() => requestMasterScan({ automated: true }), minutes * 60_000);
  updateMonitorUI();
}

function updateMonitorUI() {
  if (!elements.monitorToggle) return;
  elements.monitorToggle.classList.toggle("active", state.monitorEnabled);
  elements.monitorToggle.setAttribute("aria-pressed", String(state.monitorEnabled));
  elements.monitorStatus.classList.toggle("active", state.monitorEnabled);
  elements.monitorStatus.querySelector("strong").textContent = state.monitorEnabled ? t("monitorOn") : t("monitorOff");
  if (!state.monitorEnabled || !state.monitorNextAt) elements.monitorNext.textContent = "—";
  else {
    const remaining = Math.max(0, state.monitorNextAt - Date.now());
    const minutes = Math.floor(remaining / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);
    elements.monitorNext.textContent = `${t("nextScan")}: ${minutes}:${String(seconds).padStart(2, "0")}`;
  }
}

function notifyAlerts(alerts) {
  if (!alerts.length) return;
  let seen = [];
  try { seen = JSON.parse(localStorage.getItem("jarvis.alerts.v2") || "[]"); } catch { seen = []; }
  for (const item of alerts) {
    const a = item.analysis;
    const fingerprint = signalFingerprint(a);
    const shouldAnnounce = a.verdict === "A+" || !seen.includes(fingerprint);
    if (!shouldAnnounce) continue;
    const title = a.verdict === "A+" ? `🚨 A+ ${state.language === "de" ? "NOCH LIVE" : "STILL LIVE"}` : `J.A.R.V.I.S ${a.verdict}`;
    const body = `${a.asset} · ${a.direction} · ${a.trade?.trigger || "—"} · ${a.score}/100`;
    toast(`${title} — ${body}`);
    if ("Notification" in globalThis && Notification.permission === "granted") new Notification(title, { body, tag: fingerprint });
    if (!seen.includes(fingerprint)) seen.push(fingerprint);
  }
  localStorage.setItem("jarvis.alerts.v2", JSON.stringify(seen.slice(-100)));
}

async function requestAnalysis() {
  if (state.running) return;
  const asset = elements.assetInput.value.trim();
  if (!asset) {
    toast(t("enterAsset"), "warning");
    elements.assetInput.focus();
    return;
  }
  if (!state.engine.ready) {
    toast(t("engineOfflineHelp"), "warning");
    return;
  }

  state.running = true;
  elements.analyzeButton.disabled = true;
  showScanProgress(asset);

  const payload = {
    asset,
    assetClass: elements.assetClass.value,
    chain: document.querySelector("#chainInput").value,
    horizon: document.querySelector("#horizonInput").value,
    sourceMode: document.querySelector("#sourceMode").value,
    language: state.language,
  };

  let progressTimer;
  let logTimer;
  const progress = createProgressController();
  progressTimer = setInterval(progress.advance, 2500);
  logTimer = setInterval(progress.log, 5200);

  try {
    const response = await apiFetch("/api/analyze", { method: "POST", body: payload });
    clearInterval(progressTimer);
    clearInterval(logTimer);
    progress.complete();
    await wait(420);
    state.currentAnalysis = response.analysis;
    state.currentMeta = { ...response.meta, providerStatus: response.providerStatus };
    renderAnalysis(response.analysis, state.currentMeta, true);
    updateDashboardSignal(response.analysis);
    storeAnalysis(response.analysis, state.currentMeta);
  } catch (error) {
    clearInterval(progressTimer);
    clearInterval(logTimer);
    renderAnalysisError(error);
  } finally {
    state.running = false;
    elements.analyzeButton.disabled = false;
  }
}

function showScanProgress(asset) {
  elements.analysisIdle.hidden = true;
  elements.analysisResult.hidden = true;
  elements.scanProgress.hidden = false;
  elements.scanAsset.textContent = asset.toUpperCase().slice(0, 18);
  elements.progressBar.style.width = "5%";
  elements.scanStages.querySelectorAll("span").forEach((stage, index) => {
    stage.classList.toggle("active", index === 0);
    stage.classList.remove("done");
  });
  elements.terminalLog.textContent = state.language === "de"
    ? "$ serverseitige Research-Engine gestartet…\n$ aktuelle Quellenrichtlinie geladen…"
    : "$ starting server-side research engine…\n$ current source policy loaded…";
}

function createProgressController() {
  let value = 5;
  let stage = 0;
  let logIndex = 0;
  const logs = state.language === "de"
    ? [
        "$ CoinMarketCap-Marktkontext wird angefragt…",
        "$ Derivate- und Funding-Adapter werden geprüft…",
        "$ eingeschränkte Arkham-/Quellen-Websuche läuft…",
        "$ eToro-DE-Ausführbarkeit wird abgeglichen…",
        "$ Hard-Vetos und Score-Matrix werden angewendet…",
      ]
    : [
        "$ requesting CoinMarketCap market context…",
        "$ checking derivatives and funding adapters…",
        "$ restricted Arkham/source web research running…",
        "$ cross-checking eToro Germany execution…",
        "$ applying hard vetoes and score matrix…",
      ];

  return {
    advance() {
      value = Math.min(91, value + Math.max(2, Math.round((92 - value) * 0.16)));
      elements.progressBar.style.width = `${value}%`;
      const nextStage = Math.min(4, Math.floor(value / 20));
      if (nextStage !== stage) {
        stage = nextStage;
        elements.scanStages.querySelectorAll("span").forEach((node, index) => {
          node.classList.toggle("done", index < stage);
          node.classList.toggle("active", index === stage);
        });
      }
    },
    log() {
      if (logIndex >= logs.length) return;
      elements.terminalLog.textContent += `\n${logs[logIndex++]}`;
      elements.terminalLog.scrollTop = elements.terminalLog.scrollHeight;
    },
    complete() {
      elements.progressBar.style.width = "100%";
      elements.scanStages.querySelectorAll("span").forEach((node) => { node.classList.add("done"); node.classList.remove("active"); });
    },
  };
}

function renderAnalysis(analysis, meta, announce = false) {
  elements.analysisIdle.hidden = true;
  elements.scanProgress.hidden = true;
  elements.analysisResult.hidden = false;

  const score = clamp(Number(analysis.score) || 0, 0, 100);
  const verdict = String(analysis.verdict || "NO_TRADE");
  const good = verdict === "A" || verdict === "A+";
  const insufficient = verdict === "INSUFFICIENT_DATA";
  const scoreColor = good ? "var(--accent)" : insufficient ? "var(--red)" : "var(--yellow)";
  const risks = [...(analysis.redFlags || []), ...(analysis.hardVetoes || []).map((item) => `VETO: ${item}`)].slice(0, 10);
  const trade = analysis.trade || {};
  const sources = Array.isArray(analysis.sources) ? analysis.sources : [];
  const breakdown = analysis.scoreBreakdown || {};
  const providerHealth = renderProviderHealth(meta?.providerStatus || {}, analysis.assetClass);

  const level = (label, value, className = "") => `<div class="level-card ${className}"><span>${escapeHtml(label)}</span><strong title="${escapeAttr(value || "—")}">${escapeHtml(value || "—")}</strong></div>`;
  const reasonsHtml = (analysis.why || []).length ? analysis.why.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("") : `<li>—</li>`;
  const risksHtml = risks.length ? risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join("") : `<li>—</li>`;
  const breakdownHtml = [
    ["catalyst", 15], ["technical", 15], ["derivatives", 15], ["smartMoney", 15],
    ["execution", 10], ["traderConsensus", 10], ["riskReward", 10], ["dataQuality", 10],
  ].map(([key, max]) => {
    const value = clamp(Number(breakdown[key]) || 0, 0, max);
    return `<div class="breakdown-row"><span>${escapeHtml(t(key))}</span><div class="breakdown-bar"><span style="width:${(value / max) * 100}%"></span></div><strong>${value}/${max}</strong></div>`;
  }).join("");
  const sourceHtml = sources.length
    ? sources.map((source) => `<a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.name)} · ${escapeHtml(source.type)}</span><svg><use href="#i-external"></use></svg></a>`).join("")
    : `<span>${escapeHtml(t("noSourceLinks"))}</span>`;
  const snapshot = analysis.marketData || {};
  const snapshotRows = [
    ["PRICE", snapshot.price], ["24H", snapshot.change24h], ["VOLUME 24H", snapshot.volume24h],
    ["MARKET CAP", snapshot.marketCap], ["FDV", snapshot.fdv], ["LIQUIDITY", snapshot.liquidity],
    ["OPEN INTEREST", snapshot.openInterest], ["FUNDING", snapshot.fundingRate], ["LIQUIDATIONS 24H", snapshot.liquidations24h],
  ].map(([label, value]) => `<div><span>${label}</span><strong>${escapeHtml(value || "—")}</strong></div>`).join("");
  const timeframeRows = (snapshot.timeframes || []).map((row) => `<tr><td>${escapeHtml(row.period)}</td><td>${escapeHtml(row.priceChange || "—")}</td><td>${escapeHtml(row.volume || "—")}</td><td>${escapeHtml(row.buyers || "—")}</td><td>${escapeHtml(row.sellers || "—")}</td></tr>`).join("");
  const confirmationsHtml = (analysis.confirmations || []).length
    ? analysis.confirmations.map((item) => `<li><strong>${escapeHtml(item.type)}</strong><span>${escapeHtml(item.evidence)}</span></li>`).join("")
    : `<li><span>—</span></li>`;
  const meme = analysis.memeDueDiligence || {};
  const memeFields = [
    ["CONTRACT", meme.contract], ["CHAIN", meme.chain], ["TOKEN AGE", meme.tokenAge], ["SUPPLY", meme.supply],
    ["HOLDERS", meme.holders], ["TOP 10", meme.top10Share], ["TOP 20", meme.top20Share], ["TEAM", meme.teamShare],
    ["CREATOR", meme.creatorShare], ["LIQUIDITY", meme.liquidity], ["EXIT LIQUIDITY", meme.exitLiquidity], ["LP", meme.lpStatus],
    ["MINT", meme.mintAuthority], ["FREEZE", meme.freezeAuthority], ["HONEYPOT", meme.honeypot], ["TAXES", meme.taxes],
    ["DEPLOYER", meme.deployerHistory], ["SNIPERS / BUNDLES", meme.sniperBundledRisk], ["WALLET CLUSTERS", meme.walletClusters],
    ["MANIPULATION", meme.manipulationRisk], ["NARRATIVE", meme.socialNarrative],
  ].map(([label, value]) => `<div><span>${label}</span><strong>${escapeHtml(value || "—")}</strong></div>`).join("");
  const tradeLevelsHtml = insufficient
    ? `<div class="analysis-gate"><div><span class="terminal-line">DATA_GATE://BLOCKED</span><strong>${escapeHtml(state.language === "de" ? "Kein Entry aus unvollständigen Daten" : "No entry from incomplete data")}</strong><p>${escapeHtml(state.language === "de" ? "Trigger, Stop und Ziel werden erst angezeigt, wenn Preis-, Signal- und Ausführungsdaten verifiziert sind." : "Trigger, stop and target appear only after price, signal and execution data are verified.")}</p></div><div class="provider-health">${providerHealth}</div></div>`
    : `<div class="trade-levels">
      ${level(t("direction"), analysis.direction || "NONE")}
      ${level(t("trigger"), trade.trigger)}
      ${level(t("entry"), trade.entry, "entry")}
      ${level(t("stop"), trade.stop, "stop")}
      ${level(t("target"), trade.target, "target")}
      ${level(t("rr"), trade.rr !== null && trade.rr !== "" && Number.isFinite(Number(trade.rr)) ? `${Number(trade.rr).toFixed(2)} : 1` : null)}
      ${level(t("risk"), trade.risk || "UNKNOWN")}
      ${level(t("etoro"), analysis.etoro?.status || "UNCONFIRMED")}
    </div>`;

  elements.analysisResult.innerHTML = `
    <div class="result-header">
      <div class="score-orb" style="--score:${score};--score-color:${scoreColor}"><span>${insufficient ? "—" : score}<small>${insufficient ? "DATA GATE" : "SCORE / 100"}</small></span></div>
      <div class="result-title">
        <span class="terminal-line">${escapeHtml(t("latestLiveDecision"))} · ${escapeHtml(analysis.assetClass || "OTHER")}</span>
        <h2>${escapeHtml(analysis.asset || "—")} <span class="muted">${escapeHtml(analysis.assetName || "")}</span></h2>
        <p>${escapeHtml(analysis.headline || t("noSignalCreated"))}</p>
      </div>
      <div class="verdict-badge ${good ? "good" : insufficient ? "bad" : ""}">${escapeHtml(verdict.replaceAll("_", " "))}</div>
    </div>
    ${tradeLevelsHtml}
    <div class="result-grid">
      <section class="result-panel"><h3>${escapeHtml(t("why"))}</h3><ul class="reason-list">${reasonsHtml}</ul></section>
      <section class="result-panel"><h3>${escapeHtml(t("risksVetoes"))}</h3><ul class="risk-list">${risksHtml}</ul></section>
      <section class="result-panel result-wide"><h3>${escapeHtml(t("confirmations"))}</h3><ul class="confirmation-list">${confirmationsHtml}</ul></section>
      <section class="result-panel"><h3>${escapeHtml(t("scoreBreakdown"))}</h3><div class="breakdown-list">${breakdownHtml}</div></section>
      <section class="result-panel"><h3>EXECUTION + DATA QUALITY</h3><ul class="risk-list"><li>${escapeHtml(analysis.etoro?.instrument || "eToro instrument: —")}</li><li>${escapeHtml(analysis.etoro?.costNotes || "Costs: —")}</li><li>${escapeHtml(trade.invalidation || "Invalidation: —")}</li><li>${escapeHtml(analysis.dataQuality?.freshness || "Unknown")}</li>${(analysis.dataQuality?.limitations || []).slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section class="result-panel result-wide"><h3>${escapeHtml(t("marketSnapshot"))}</h3><div class="snapshot-grid">${snapshotRows}</div>${timeframeRows ? `<div class="table-scroll"><table class="timeframe-table"><thead><tr><th>TF</th><th>CHANGE</th><th>VOLUME</th><th>BUYERS</th><th>SELLERS</th></tr></thead><tbody>${timeframeRows}</tbody></table></div>` : ""}</section>
      ${meme.applies ? `<section class="result-panel result-wide meme-panel ${meme.criticalRedFlag ? "critical" : ""}"><h3>${escapeHtml(t("memeDueDiligence"))}</h3><div class="meme-grid">${memeFields}</div>${(meme.notes || []).length ? `<ul class="risk-list">${meme.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : ""}</section>` : ""}
      <section class="result-panel result-sources"><h3>${escapeHtml(t("verifiedSources"))}</h3><div class="citation-list">${sourceHtml}</div></section>
    </div>
    <div class="result-actions">
      <div class="result-meta"><span><svg><use href="#i-clock"></use></svg>${escapeHtml(t("generated"))}: ${escapeHtml(shortUtc(meta?.generatedAt))}</span><span><svg><use href="#i-shield"></use></svg>${escapeHtml(t("paperTrade"))}</span></div>
      <div class="head-actions"><button class="ghost-button" data-export-current><svg><use href="#i-download"></use></svg><span>${escapeHtml(t("exportResult"))}</span></button><button class="run-button" data-new-analysis><span>${escapeHtml(t("newAnalysis"))}</span><svg><use href="#i-refresh"></use></svg></button></div>
    </div>`;

  if (announce) toast(t("resultSaved"));
}

function renderAnalysisError(error) {
  elements.analysisIdle.hidden = true;
  elements.scanProgress.hidden = true;
  elements.analysisResult.hidden = false;
  elements.analysisResult.innerHTML = `<div class="output-idle"><div class="idle-core" style="color:var(--red);border-color:rgba(255,98,123,.28)"><svg><use href="#i-alert"></use></svg></div><span class="terminal-line">RESEARCH://ABORTED</span><h2>${escapeHtml(t("analysisFailed"))}</h2><p>${escapeHtml(error.message || t("noSignalCreated"))}</p><button class="run-button" data-new-analysis style="margin-top:18px"><span>${escapeHtml(t("newAnalysis"))}</span><svg><use href="#i-refresh"></use></svg></button></div>`;
  toast(error.message || t("analysisFailed"), "error");
}

function resetAnalysisView() {
  elements.analysisResult.hidden = true;
  elements.scanProgress.hidden = true;
  elements.analysisIdle.hidden = false;
  elements.assetInput.focus();
}

function updateDashboardSignal(analysis) {
  const good = analysis.verdict === "A" || analysis.verdict === "A+";
  elements.globalTrendValue.textContent = String(analysis.marketTrend || "UNKNOWN").replaceAll("_", "-");
  elements.globalTrendValue.className = `metric-value ${analysis.marketTrend === "RISK_ON" ? "positive" : analysis.marketTrend === "RISK_OFF" ? "negative" : ""}`;
  elements.dashboardSignal.innerHTML = `<div class="score-orb" style="--score:${clamp(Number(analysis.score)||0,0,100)};--score-color:${good ? "var(--accent)" : "var(--yellow)"}"><span>${escapeHtml(analysis.score)}<small>${escapeHtml(analysis.verdict)}</small></span></div><div><span class="terminal-line">${escapeHtml(analysis.asset)} · ${escapeHtml(analysis.direction)}</span><h3>${escapeHtml(analysis.headline || t("noSignalCreated"))}</h3><p>${escapeHtml((analysis.why || [t("noSignalCreated")])[0])}</p></div>`;
}

function storeAnalysis(analysis, meta) {
  const fingerprint = signalFingerprint(analysis);
  if (["MASTER_SCAN", "MORNING_BRIEF"].includes(meta?.source) && state.journal.some((item) => item.fingerprint === fingerprint)) return;
  const record = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: meta?.generatedAt || new Date().toISOString(),
    analysis,
    fingerprint,
    evaluation: null,
    meta: { model: meta?.model || null, durationMs: meta?.durationMs || null, source: meta?.source || "ASSET_ANALYSIS", paperTrading: true },
  };
  state.journal.unshift(record);
  state.journal = state.journal.slice(0, 100);
  try {
    persistJournal();
  } catch {
    state.journal = state.journal.slice(0, 30);
    persistJournal();
  }
  renderJournal();
}

function loadJournal() {
  try {
    const source = localStorage.getItem("jarvis.journal.v2") || localStorage.getItem("jarvis.journal.v1") || "[]";
    const parsed = JSON.parse(source);
    return Array.isArray(parsed) ? parsed.slice(0, 100).map((record) => ({ ...record, fingerprint: record.fingerprint || signalFingerprint(record.analysis || {}), evaluation: record.evaluation || null })) : [];
  } catch {
    return [];
  }
}

function persistJournal() {
  localStorage.setItem("jarvis.journal.v2", JSON.stringify(state.journal));
}

function renderJournal() {
  const total = state.journal.length;
  const good = state.journal.filter((item) => ["A", "A+"].includes(item.analysis?.verdict)).length;
  const noTrade = state.journal.filter((item) => !["A", "A+"].includes(item.analysis?.verdict)).length;
  const values = [total, good, noTrade, 0];
  elements.journalSummary.querySelectorAll("strong").forEach((node, index) => { node.textContent = String(values[index] ?? 0); });
  renderPerformanceMetrics();

  if (!total) {
    elements.journalList.innerHTML = `<div class="journal-empty"><svg><use href="#i-book"></use></svg><h3>${escapeHtml(t("journalEmpty"))}</h3><p>${escapeHtml(t("journalEmptyCopy"))}</p><button class="run-button" data-nav="analyzer"><span>${escapeHtml(t("analyzeAsset"))}</span><svg><use href="#i-arrow"></use></svg></button></div>`;
    return;
  }

  elements.journalList.innerHTML = state.journal.map((record) => {
    const a = record.analysis || {};
    const trade = a.trade || {};
    const goodVerdict = ["A", "A+"].includes(a.verdict);
    const evaluation = record.evaluation;
    const outcome = evaluation?.status ? String(evaluation.status).replaceAll("_", " ") : "PENDING";
    const canEvaluate = goodVerdict && a.executable;
    return `<article class="journal-row"><div class="asset-cell"><strong>${escapeHtml(a.asset || "—")}</strong><small>${escapeHtml(shortUtc(record.createdAt))} · ${escapeHtml(a.assetClass || "OTHER")} · ${escapeHtml(record.meta?.source || "ANALYSIS")}</small></div><div class="journal-cell"><span>SCORE</span><strong>${escapeHtml(a.score ?? "—")}/100</strong></div><div class="journal-cell"><span>${escapeHtml(t("direction"))}</span><strong>${escapeHtml(a.direction || "NONE")}</strong></div><div class="journal-cell"><span>${escapeHtml(t("entry"))}</span><strong>${escapeHtml(trade.entry || "—")}</strong></div><div class="journal-cell"><span>${escapeHtml(t("outcome"))}</span><strong>${escapeHtml(outcome)}${Number.isFinite(Number(evaluation?.rMultiple)) ? ` · ${Number(evaluation.rMultiple).toFixed(2)}R` : ""}</strong></div><div class="journal-row-actions"><span class="journal-verdict ${goodVerdict ? "good" : ""}">${escapeHtml(String(a.verdict || "NO_TRADE").replaceAll("_", " "))}</span>${canEvaluate ? `<button class="mini-action" data-evaluate-record="${escapeAttr(record.id)}">${escapeHtml(t("evaluateNow"))}</button>` : ""}</div></article>`;
  }).join("");
}

function renderPerformanceMetrics() {
  const closedStatuses = new Set(["STOPPED", "TARGET_REACHED", "CLOSED_OTHER"]);
  const closed = state.journal
    .filter((record) => closedStatuses.has(record.evaluation?.status) && Number.isFinite(Number(record.evaluation?.rMultiple)))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const rValues = closed.map((record) => Number(record.evaluation.rMultiple));
  const wins = rValues.filter((value) => value > 0);
  const losses = rValues.filter((value) => value < 0);
  const averageR = rValues.length ? rValues.reduce((sum, value) => sum + value, 0) / rValues.length : null;
  const winRate = rValues.length ? (wins.length / rValues.length) * 100 : null;
  const grossWin = wins.reduce((sum, value) => sum + value, 0);
  const grossLoss = Math.abs(losses.reduce((sum, value) => sum + value, 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : null;
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let currentType = 0;
  let currentLength = 0;
  for (const value of rValues) {
    equity += value;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
    const type = value > 0 ? 1 : value < 0 ? -1 : 0;
    if (type && type === currentType) currentLength += 1;
    else { currentType = type; currentLength = type ? 1 : 0; }
  }
  document.querySelector("#metricClosed").textContent = String(rValues.length);
  document.querySelector("#metricWinRate").textContent = winRate === null ? "—" : `${winRate.toFixed(1)}%`;
  document.querySelector("#metricAverageR").textContent = averageR === null ? "—" : `${averageR.toFixed(2)}R`;
  document.querySelector("#metricProfitFactor").textContent = profitFactor === null ? "—" : profitFactor === Infinity ? "∞" : profitFactor.toFixed(2);
  document.querySelector("#metricDrawdown").textContent = rValues.length ? `${maxDrawdown.toFixed(2)}R` : "—";
  document.querySelector("#metricStreak").textContent = `${currentType > 0 ? currentLength : 0} / ${currentType < 0 ? currentLength : 0}`;
}

async function evaluateRecord(id, button) {
  const record = state.journal.find((item) => item.id === id);
  if (!record || button.disabled) return;
  if (!state.engine.ready) {
    toast(t("engineOfflineHelp"), "warning");
    return;
  }
  button.disabled = true;
  button.textContent = t("evaluating");
  try {
    const response = await apiFetch("/api/evaluate", { method: "POST", body: { record } });
    record.evaluation = response.evaluation;
    record.evaluationMeta = response.meta;
    persistJournal();
    renderJournal();
    toast(t("evaluationSaved"));
  } catch (error) {
    button.disabled = false;
    button.textContent = t("evaluateNow");
    toast(error.message, "error");
  }
}

function calculatePositionSize() {
  if (!elements.positionForm) return;
  const account = Number(document.querySelector("#positionAccount").value);
  const riskPercent = Number(document.querySelector("#positionRisk").value);
  const entry = Number(document.querySelector("#positionEntry").value);
  const stop = Number(document.querySelector("#positionStop").value);
  const fees = Math.max(0, Number(document.querySelector("#positionFees").value) || 0);
  const maxLoss = Number.isFinite(account) && Number.isFinite(riskPercent) && account > 0 && riskPercent > 0 ? account * riskPercent / 100 : null;
  const distance = Number.isFinite(entry) && Number.isFinite(stop) ? Math.abs(entry - stop) : null;
  const units = maxLoss !== null && distance > 0 ? Math.max(0, (maxLoss - fees) / distance) : null;
  const notional = units !== null && Number.isFinite(entry) ? units * entry : null;
  const locale = state.language === "de" ? "de-DE" : "en-US";
  document.querySelector("#sizeMaxLoss").textContent = maxLoss === null ? "—" : new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(maxLoss);
  document.querySelector("#sizeUnits").textContent = units === null ? "—" : new Intl.NumberFormat(locale, { maximumFractionDigits: 6 }).format(units);
  document.querySelector("#sizeNotional").textContent = notional === null ? "—" : new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(notional);
}

function signalFingerprint(analysis) {
  const trade = analysis?.trade || {};
  return [analysis?.asset, analysis?.direction, analysis?.verdict, trade.trigger, trade.entry, trade.stop, trade.target].map((value) => String(value ?? "").trim().toLowerCase()).join("|");
}

function clearJournal() {
  if (!state.journal.length) return;
  if (!window.confirm(t("confirmClear"))) return;
  state.journal = [];
  localStorage.removeItem("jarvis.journal.v1");
  localStorage.removeItem("jarvis.journal.v2");
  renderJournal();
  toast(t("journalCleared"));
}

function exportJournal() {
  if (!state.journal.length) return toast(t("nothingToExport"), "warning");
  downloadJson(`jarvis-paper-journal-${dateStamp()}.json`, { version: "2.1", exportedAt: new Date().toISOString(), paperTrading: true, records: state.journal });
}

function exportCurrentAnalysis() {
  if (!state.currentAnalysis) return toast(t("nothingToExport"), "warning");
  const asset = String(state.currentAnalysis.asset || "analysis").replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
  downloadJson(`jarvis-${asset}-${dateStamp()}.json`, { analysis: state.currentAnalysis, meta: state.currentMeta });
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function apiFetch(url, options = {}) {
  const headers = { Accept: "application/json", ...(options.headers || {}) };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  return payload;
}

function updateClock() {
  const now = new Date();
  const text = now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false });
  document.querySelector("#utcClock").textContent = `UTC ${text}`;
  updateMonitorUI();
}

function toast(message, type = "success") {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;
  elements.toastRegion.append(node);
  window.setTimeout(() => node.remove(), 4600);
}

function formatPrice(value, locale) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  const digits = number >= 1000 ? 2 : number >= 1 ? 3 : number >= 0.01 ? 5 : 8;
  return new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: digits }).format(number);
}

function shortUtc(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(state.language === "de" ? "de-DE" : "en-GB", { timeZone: "UTC", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }) + " UTC";
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
