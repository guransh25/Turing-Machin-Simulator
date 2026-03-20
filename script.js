const state = {
  rules: [],
  tape: new Map(),
  head: 0,
  currentState: "",
  startState: "q0",
  acceptState: "qa",
  rejectState: "qr",
  blankSymbol: "_",
  inputString: "",
  initialized: false,
  halted: false,
  status: "Not initialized",
  steps: 0,
  maxSteps: 200,
  intervalId: null,
};

const elements = {
  inputString: document.getElementById("inputString"),
  blankSymbol: document.getElementById("blankSymbol"),
  startState: document.getElementById("startState"),
  acceptState: document.getElementById("acceptState"),
  rejectState: document.getElementById("rejectState"),
  maxSteps: document.getElementById("maxSteps"),
  ruleState: document.getElementById("ruleState"),
  ruleRead: document.getElementById("ruleRead"),
  ruleWrite: document.getElementById("ruleWrite"),
  ruleMove: document.getElementById("ruleMove"),
  ruleNextState: document.getElementById("ruleNextState"),
  rulesTableBody: document.getElementById("rulesTableBody"),
  tapeContainer: document.getElementById("tapeContainer"),
  currentStateDisplay: document.getElementById("currentStateDisplay"),
  headPositionDisplay: document.getElementById("headPositionDisplay"),
  stepCountDisplay: document.getElementById("stepCountDisplay"),
  machineStatus: document.getElementById("machineStatus"),
  transitionCards: document.getElementById("transitionCards"),
  logOutput: document.getElementById("logOutput"),
  ruleRowTemplate: document.getElementById("ruleRowTemplate"),
  initializeBtn: document.getElementById("initializeBtn"),
  stepBtn: document.getElementById("stepBtn"),
  runBtn: document.getElementById("runBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),
  addRuleBtn: document.getElementById("addRuleBtn"),
  clearRulesBtn: document.getElementById("clearRulesBtn"),
  loadExampleBtn: document.getElementById("loadExampleBtn"),
};

function syncConfigFromInputs() {
  state.inputString = elements.inputString.value || "";
  state.blankSymbol = (elements.blankSymbol.value || "_").charAt(0);
  state.startState = elements.startState.value.trim() || "q0";
  state.acceptState = elements.acceptState.value.trim() || "qa";
  state.rejectState = elements.rejectState.value.trim() || "qr";
  state.maxSteps = Math.max(1, Number(elements.maxSteps.value) || 200);
}

function initializeTape() {
  syncConfigFromInputs();
  stopRunning();
  state.tape = new Map();

  [...state.inputString].forEach((symbol, index) => {
    state.tape.set(index, symbol);
  });

  if (state.inputString.length === 0) {
    state.tape.set(0, state.blankSymbol);
  }

  state.head = 0;
  state.currentState = state.startState;
  state.steps = 0;
  state.initialized = true;
  state.halted = false;
  updateStatus("Ready");
  clearLog();
  log(`Machine initialized with input: "${state.inputString || '(empty)'}"`);
  render();
}

function normalizeSymbol(symbol) {
  return (symbol || state.blankSymbol).charAt(0);
}

function addRule() {
  const currentState = elements.ruleState.value.trim();
  const read = normalizeSymbol(elements.ruleRead.value);
  const write = normalizeSymbol(elements.ruleWrite.value);
  const move = elements.ruleMove.value;
  const nextState = elements.ruleNextState.value.trim();

  if (!currentState || !nextState) {
    alert("Please enter both current state and next state.");
    return;
  }

  const existingIndex = state.rules.findIndex(
    (rule) => rule.currentState === currentState && rule.read === read
  );

  const newRule = { currentState, read, write, move, nextState };

  if (existingIndex >= 0) {
    state.rules[existingIndex] = newRule;
    log(`Rule updated: δ(${currentState}, ${read}) = (${write}, ${move}, ${nextState})`);
  } else {
    state.rules.push(newRule);
    log(`Rule added: δ(${currentState}, ${read}) = (${write}, ${move}, ${nextState})`);
  }

  elements.ruleState.value = "";
  elements.ruleRead.value = "";
  elements.ruleWrite.value = "";
  elements.ruleNextState.value = "";
  renderRules();
  renderTransitionCards();
}

function deleteRule(index) {
  const rule = state.rules[index];
  state.rules.splice(index, 1);
  log(`Rule deleted: δ(${rule.currentState}, ${rule.read})`);
  renderRules();
  renderTransitionCards();
}

function readTape(position) {
  return state.tape.has(position) ? state.tape.get(position) : state.blankSymbol;
}

function writeTape(position, symbol) {
  state.tape.set(position, symbol);
}

function getMatchingRule() {
  const currentSymbol = readTape(state.head);
  return state.rules.find(
    (rule) => rule.currentState === state.currentState && rule.read === currentSymbol
  );
}

function stepMachine() {
  if (!state.initialized) {
    alert("Initialize the machine first.");
    return;
  }

  if (state.halted) {
    log("Machine is already halted.", "warning");
    return;
  }

  if (state.steps >= state.maxSteps) {
    haltMachine(`Stopped after reaching max step limit (${state.maxSteps}).`, "warning");
    return;
  }

  if (state.currentState === state.acceptState) {
    haltMachine(`Machine accepted the input in state ${state.acceptState}.`, "success");
    return;
  }

  if (state.currentState === state.rejectState) {
    haltMachine(`Machine rejected the input in state ${state.rejectState}.`, "error");
    return;
  }

  const currentSymbol = readTape(state.head);
  const rule = getMatchingRule();

  if (!rule) {
    haltMachine(
      `No transition rule found for (${state.currentState}, ${currentSymbol}). Machine halted.`,
      "error"
    );
    return;
  }

  writeTape(state.head, rule.write);
  const previousHead = state.head;

  if (rule.move === "R") state.head += 1;
  else if (rule.move === "L") state.head -= 1;

  state.currentState = rule.nextState;
  state.steps += 1;

  updateStatus("Running");
  log(
    `Step ${state.steps}: (${rule.currentState}, ${currentSymbol}) → write ${rule.write}, move ${rule.move}, next ${rule.nextState}; head ${previousHead} → ${state.head}`
  );

  if (state.currentState === state.acceptState) {
    haltMachine(`Machine accepted the input in state ${state.acceptState}.`, "success");
  } else if (state.currentState === state.rejectState) {
    haltMachine(`Machine rejected the input in state ${state.rejectState}.`, "error");
  } else {
    render();
  }
}

function haltMachine(message, type = "warning") {
  state.halted = true;
  stopRunning();
  updateStatus(type === "success" ? "Accepted" : type === "error" ? "Rejected / Halted" : "Stopped");
  log(message, type);
  render();
}

function runMachine() {
  if (!state.initialized) {
    alert("Initialize the machine first.");
    return;
  }
  if (state.intervalId) return;

  updateStatus("Running");
  state.intervalId = setInterval(() => {
    if (state.halted) {
      stopRunning();
      return;
    }
    stepMachine();
  }, 500);
}

function stopRunning() {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
}

function updateStatus(value) {
  state.status = value;
}

function resetMachine() {
  stopRunning();
  initializeTape();
  updateStatus("Reset complete");
  render();
}

function clearRules() {
  stopRunning();
  state.rules = [];
  renderRules();
  renderTransitionCards();
  log("All transition rules cleared.", "warning");
}

function renderRules() {
  elements.rulesTableBody.innerHTML = "";

  if (state.rules.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" style="color:#94a3b8; text-align:center;">No rules added yet.</td>`;
    elements.rulesTableBody.appendChild(row);
    return;
  }

  state.rules.forEach((rule, index) => {
    const fragment = elements.ruleRowTemplate.content.cloneNode(true);
    const row = fragment.querySelector("tr");
    row.querySelector(".rule-current").textContent = rule.currentState;
    row.querySelector(".rule-read").textContent = rule.read;
    row.querySelector(".rule-write").textContent = rule.write;
    row.querySelector(".rule-move").textContent = rule.move;
    row.querySelector(".rule-next").textContent = rule.nextState;
    row.querySelector(".delete-rule").addEventListener("click", () => deleteRule(index));
    elements.rulesTableBody.appendChild(fragment);
  });
}

function renderTape() {
  elements.tapeContainer.innerHTML = "";

  const usedPositions = [...state.tape.keys()];
  const min = usedPositions.length ? Math.min(...usedPositions, state.head) - 3 : state.head - 5;
  const max = usedPositions.length ? Math.max(...usedPositions, state.head) + 3 : state.head + 5;

  for (let pos = min; pos <= max; pos += 1) {
    const cell = document.createElement("div");
    cell.className = `tape-cell ${pos === state.head ? "head" : ""}`.trim();
    cell.innerHTML = `
      <span class="tape-index">${pos}</span>
      <div class="tape-symbol">${escapeHtml(readTape(pos))}</div>
    `;
    elements.tapeContainer.appendChild(cell);
  }
}

function renderTransitionCards() {
  elements.transitionCards.innerHTML = "";

  if (state.rules.length === 0) {
    elements.transitionCards.innerHTML = '<div class="transition-card"><p>No transitions available yet.</p></div>';
    return;
  }

  const currentSymbol = state.initialized ? readTape(state.head) : null;

  state.rules.forEach((rule) => {
    const card = document.createElement("div");
    const isActive =
      state.initialized &&
      !state.halted &&
      rule.currentState === state.currentState &&
      rule.read === currentSymbol;

    card.className = `transition-card ${isActive ? "active" : ""}`.trim();
    card.innerHTML = `
      <strong>δ(${escapeHtml(rule.currentState)}, ${escapeHtml(rule.read)})</strong>
      <p>Write <strong>${escapeHtml(rule.write)}</strong>, move <strong>${rule.move}</strong>, go to <strong>${escapeHtml(rule.nextState)}</strong></p>
    `;
    elements.transitionCards.appendChild(card);
  });
}

function renderStatus() {
  elements.machineStatus.textContent = state.status;
  elements.currentStateDisplay.textContent = state.initialized ? state.currentState : "-";
  elements.headPositionDisplay.textContent = state.initialized ? String(state.head) : "-";
  elements.stepCountDisplay.textContent = String(state.steps);
}

function render() {
  renderStatus();
  renderRules();
  renderTape();
  renderTransitionCards();
}

function log(message, type = "") {
  const line = document.createElement("div");
  line.className = `log-line ${type}`.trim();
  line.textContent = message;
  elements.logOutput.appendChild(line);
  elements.logOutput.scrollTop = elements.logOutput.scrollHeight;
}

function clearLog() {
  elements.logOutput.innerHTML = "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadExampleMachine() {
  elements.inputString.value = "111";
  elements.blankSymbol.value = "_";
  elements.startState.value = "q0";
  elements.acceptState.value = "qa";
  elements.rejectState.value = "qr";
  elements.maxSteps.value = "100";

  state.rules = [
    { currentState: "q0", read: "1", write: "1", move: "R", nextState: "q0" },
    { currentState: "q0", read: "_", write: "1", move: "S", nextState: "qa" },
  ];

  clearLog();
  log("Loaded example machine: unary incrementer.");
  initializeTape();
  render();
}

function attachEvents() {
  elements.addRuleBtn.addEventListener("click", addRule);
  elements.initializeBtn.addEventListener("click", initializeTape);
  elements.stepBtn.addEventListener("click", stepMachine);
  elements.runBtn.addEventListener("click", runMachine);
  elements.pauseBtn.addEventListener("click", () => {
    stopRunning();
    if (state.initialized && !state.halted) {
      updateStatus("Paused");
      renderStatus();
      log("Execution paused.", "warning");
    }
  });
  elements.resetBtn.addEventListener("click", resetMachine);
  elements.clearRulesBtn.addEventListener("click", clearRules);
  elements.loadExampleBtn.addEventListener("click", loadExampleMachine);
}

attachEvents();
render();
