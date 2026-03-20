const PRESETS = {
  unaryIncrement: {
    name: "Unary Increment",
    inputString: "111",
    blankSymbol: "_",
    startState: "q0",
    acceptState: "qa",
    rejectState: "qr",
    maxSteps: 80,
    rules: [
      { currentState: "q0", read: "1", write: "1", move: "R", nextState: "q0" },
      { currentState: "q0", read: "_", write: "1", move: "S", nextState: "qa" },
    ],
  },
  binaryIncrement: {
    name: "Binary Increment",
    inputString: "1011",
    blankSymbol: "_",
    startState: "q0",
    acceptState: "qa",
    rejectState: "qr",
    maxSteps: 120,
    rules: [
      { currentState: "q0", read: "0", write: "0", move: "R", nextState: "q0" },
      { currentState: "q0", read: "1", write: "1", move: "R", nextState: "q0" },
      { currentState: "q0", read: "_", write: "_", move: "L", nextState: "q1" },
      { currentState: "q1", read: "1", write: "0", move: "L", nextState: "q1" },
      { currentState: "q1", read: "0", write: "1", move: "S", nextState: "qa" },
      { currentState: "q1", read: "_", write: "1", move: "S", nextState: "qa" },
    ],
  },
  palindromeAB: {
    name: "Palindrome Checker (a/b)",
    inputString: "abba",
    blankSymbol: "_",
    startState: "q0",
    acceptState: "qa",
    rejectState: "qr",
    maxSteps: 300,
    rules: [
      { currentState: "q0", read: "X", write: "X", move: "R", nextState: "q0" },
      { currentState: "q0", read: "Y", write: "Y", move: "R", nextState: "q0" },
      { currentState: "q0", read: "a", write: "X", move: "R", nextState: "qFindA" },
      { currentState: "q0", read: "b", write: "Y", move: "R", nextState: "qFindB" },
      { currentState: "q0", read: "_", write: "_", move: "S", nextState: "qa" },

      { currentState: "qFindA", read: "a", write: "a", move: "R", nextState: "qFindA" },
      { currentState: "qFindA", read: "b", write: "b", move: "R", nextState: "qFindA" },
      { currentState: "qFindA", read: "X", write: "X", move: "R", nextState: "qFindA" },
      { currentState: "qFindA", read: "Y", write: "Y", move: "R", nextState: "qFindA" },
      { currentState: "qFindA", read: "_", write: "_", move: "L", nextState: "qCheckA" },

      { currentState: "qFindB", read: "a", write: "a", move: "R", nextState: "qFindB" },
      { currentState: "qFindB", read: "b", write: "b", move: "R", nextState: "qFindB" },
      { currentState: "qFindB", read: "X", write: "X", move: "R", nextState: "qFindB" },
      { currentState: "qFindB", read: "Y", write: "Y", move: "R", nextState: "qFindB" },
      { currentState: "qFindB", read: "_", write: "_", move: "L", nextState: "qCheckB" },

      { currentState: "qCheckA", read: "X", write: "X", move: "L", nextState: "qCheckA" },
      { currentState: "qCheckA", read: "Y", write: "Y", move: "L", nextState: "qCheckA" },
      { currentState: "qCheckA", read: "a", write: "X", move: "L", nextState: "qBack" },
      { currentState: "qCheckA", read: "_", write: "_", move: "S", nextState: "qa" },
      { currentState: "qCheckA", read: "b", write: "b", move: "S", nextState: "qr" },

      { currentState: "qCheckB", read: "X", write: "X", move: "L", nextState: "qCheckB" },
      { currentState: "qCheckB", read: "Y", write: "Y", move: "L", nextState: "qCheckB" },
      { currentState: "qCheckB", read: "b", write: "Y", move: "L", nextState: "qBack" },
      { currentState: "qCheckB", read: "_", write: "_", move: "S", nextState: "qa" },
      { currentState: "qCheckB", read: "a", write: "a", move: "S", nextState: "qr" },

      { currentState: "qBack", read: "a", write: "a", move: "L", nextState: "qBack" },
      { currentState: "qBack", read: "b", write: "b", move: "L", nextState: "qBack" },
      { currentState: "qBack", read: "X", write: "X", move: "L", nextState: "qBack" },
      { currentState: "qBack", read: "Y", write: "Y", move: "L", nextState: "qBack" },
      { currentState: "qBack", read: "_", write: "_", move: "R", nextState: "q0" },
    ],
  },
  evenZeros: {
    name: "Even Number of 0s",
    inputString: "101001",
    blankSymbol: "_",
    startState: "qEven",
    acceptState: "qa",
    rejectState: "qr",
    maxSteps: 120,
    rules: [
      { currentState: "qEven", read: "0", write: "0", move: "R", nextState: "qOdd" },
      { currentState: "qEven", read: "1", write: "1", move: "R", nextState: "qEven" },
      { currentState: "qEven", read: "_", write: "_", move: "S", nextState: "qa" },
      { currentState: "qOdd", read: "0", write: "0", move: "R", nextState: "qEven" },
      { currentState: "qOdd", read: "1", write: "1", move: "R", nextState: "qOdd" },
      { currentState: "qOdd", read: "_", write: "_", move: "S", nextState: "qr" },
    ],
  },
};

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
  runSpeed: 420,
  tapePadding: 6,
  history: [],
  initialSnapshot: null,
  visitedStates: new Set(),
};

const elements = {
  inputString: document.getElementById("inputString"),
  blankSymbol: document.getElementById("blankSymbol"),
  startState: document.getElementById("startState"),
  acceptState: document.getElementById("acceptState"),
  rejectState: document.getElementById("rejectState"),
  maxSteps: document.getElementById("maxSteps"),
  tapePadding: document.getElementById("tapePadding"),
  runSpeed: document.getElementById("runSpeed"),
  runSpeedValue: document.getElementById("runSpeedValue"),
  presetSelect: document.getElementById("presetSelect"),
  ruleState: document.getElementById("ruleState"),
  ruleRead: document.getElementById("ruleRead"),
  ruleWrite: document.getElementById("ruleWrite"),
  ruleMove: document.getElementById("ruleMove"),
  ruleNextState: document.getElementById("ruleNextState"),
  ruleSearch: document.getElementById("ruleSearch"),
  rulesTableBody: document.getElementById("rulesTableBody"),
  tapeContainer: document.getElementById("tapeContainer"),
  currentStateDisplay: document.getElementById("currentStateDisplay"),
  currentSymbolDisplay: document.getElementById("currentSymbolDisplay"),
  nextRuleDisplay: document.getElementById("nextRuleDisplay"),
  headPositionDisplay: document.getElementById("headPositionDisplay"),
  stepCountDisplay: document.getElementById("stepCountDisplay"),
  machineStatus: document.getElementById("machineStatus"),
  transitionCards: document.getElementById("transitionCards"),
  logOutput: document.getElementById("logOutput"),
  ruleRowTemplate: document.getElementById("ruleRowTemplate"),
  ruleCount: document.getElementById("ruleCount"),
  alphabetDisplay: document.getElementById("alphabetDisplay"),
  summaryRules: document.getElementById("summaryRules"),
  summaryVisited: document.getElementById("summaryVisited"),
  summarySpan: document.getElementById("summarySpan"),
  summaryOutcome: document.getElementById("summaryOutcome"),
  initializeBtn: document.getElementById("initializeBtn"),
  initializeBtnTop: document.getElementById("initializeBtnTop"),
  stepBtn: document.getElementById("stepBtn"),
  runBtn: document.getElementById("runBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),
  addRuleBtn: document.getElementById("addRuleBtn"),
  clearRulesBtn: document.getElementById("clearRulesBtn"),
  loadPresetBtn: document.getElementById("loadPresetBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importFile: document.getElementById("importFile"),
  copyRulesBtn: document.getElementById("copyRulesBtn"),
  centerHeadBtn: document.getElementById("centerHeadBtn"),
  expandTapeBtn: document.getElementById("expandTapeBtn"),
  shrinkTapeBtn: document.getElementById("shrinkTapeBtn"),
  jumpToEndBtn: document.getElementById("jumpToEndBtn"),
};

function syncConfigFromInputs() {
  state.inputString = elements.inputString.value || "";
  state.blankSymbol = (elements.blankSymbol.value || "_").charAt(0);
  state.startState = elements.startState.value.trim() || "q0";
  state.acceptState = elements.acceptState.value.trim() || "qa";
  state.rejectState = elements.rejectState.value.trim() || "qr";
  state.maxSteps = Math.max(1, Number(elements.maxSteps.value) || 200);
  state.runSpeed = Math.max(120, Number(elements.runSpeed.value) || 420);
  state.tapePadding = Math.min(25, Math.max(2, Number(elements.tapePadding.value) || 6));
  elements.runSpeedValue.textContent = `${state.runSpeed} ms`;
}

function snapshotState() {
  return {
    tape: [...state.tape.entries()],
    head: state.head,
    currentState: state.currentState,
    steps: state.steps,
    halted: state.halted,
    status: state.status,
  };
}

function restoreFromSnapshot(snapshot) {
  state.tape = new Map(snapshot.tape);
  state.head = snapshot.head;
  state.currentState = snapshot.currentState;
  state.steps = snapshot.steps;
  state.halted = snapshot.halted;
  state.status = snapshot.status;
}

function initializeTape() {
  syncConfigFromInputs();
  stopRunning();
  state.tape = new Map();

  [...state.inputString].forEach((symbol, index) => state.tape.set(index, symbol));
  if (state.inputString.length === 0) state.tape.set(0, state.blankSymbol);

  state.head = 0;
  state.currentState = state.startState;
  state.steps = 0;
  state.initialized = true;
  state.halted = false;
  state.history = [];
  state.visitedStates = new Set([state.startState]);
  updateStatus("Ready");
  state.initialSnapshot = snapshotState();
  clearLog();
  log(`Machine initialized with input: "${state.inputString || "(empty)"}"`);
  render();
  centerHeadOnScreen();
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

  const newRule = { currentState, read, write, move, nextState };
  const existingIndex = state.rules.findIndex(
    (rule) => rule.currentState === currentState && rule.read === read
  );

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
  render();
}

function deleteRule(index) {
  const rule = state.rules[index];
  state.rules.splice(index, 1);
  log(`Rule deleted: δ(${rule.currentState}, ${rule.read})`, "warning");
  render();
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
    haltMachine(`No rule found for (${state.currentState}, ${currentSymbol}). Machine halted.`, "error");
    return;
  }

  state.history.push(snapshotState());
  writeTape(state.head, rule.write);
  const previousHead = state.head;
  if (rule.move === "R") state.head += 1;
  else if (rule.move === "L") state.head -= 1;

  state.currentState = rule.nextState;
  state.steps += 1;
  state.visitedStates.add(state.currentState);
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
    centerHeadOnScreen();
  }
}

function haltMachine(message, type = "warning") {
  state.halted = true;
  stopRunning();
  updateStatus(type === "success" ? "Accepted" : type === "error" ? "Rejected / Halted" : "Stopped");
  log(message, type);
  render();
  centerHeadOnScreen();
}

function runMachine() {
  if (!state.initialized) {
    alert("Initialize the machine first.");
    return;
  }
  if (state.intervalId || state.halted) return;

  syncConfigFromInputs();
  updateStatus("Running");
  renderStatus();
  state.intervalId = setInterval(() => {
    if (state.halted) {
      stopRunning();
      return;
    }
    stepMachine();
  }, state.runSpeed);
}

function runToHalt() {
  if (!state.initialized) {
    alert("Initialize the machine first.");
    return;
  }
  stopRunning();
  let guard = 0;
  while (!state.halted && guard < state.maxSteps + 5) {
    stepMachine();
    guard += 1;
  }
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
  if (state.initialSnapshot) {
    restoreFromSnapshot(state.initialSnapshot);
    state.initialized = true;
    state.halted = false;
    state.history = [];
    state.visitedStates = new Set([state.startState]);
    updateStatus("Reset complete");
    clearLog();
    log("Machine reset to initial configuration.");
    render();
    centerHeadOnScreen();
  } else {
    initializeTape();
  }
}

function clearRules() {
  stopRunning();
  state.rules = [];
  log("All transition rules cleared.", "warning");
  render();
}

function getAlphabet() {
  const symbols = new Set();
  state.rules.forEach((rule) => {
    symbols.add(rule.read);
    symbols.add(rule.write);
  });
  [...state.inputString].forEach((ch) => symbols.add(ch));
  symbols.delete(state.blankSymbol);
  return [...symbols].sort();
}

function renderRules() {
  elements.rulesTableBody.innerHTML = "";
  const search = elements.ruleSearch.value.trim().toLowerCase();
  const filteredRules = state.rules.filter((rule) => {
    if (!search) return true;
    return [rule.currentState, rule.read, rule.write, rule.nextState, rule.move]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  if (filteredRules.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" style="color:#9bb0ce; text-align:center;">No matching rules.</td>`;
    elements.rulesTableBody.appendChild(row);
  } else {
    filteredRules.forEach((rule) => {
      const actualIndex = state.rules.findIndex(
        (candidate) => candidate.currentState === rule.currentState && candidate.read === rule.read
      );
      const fragment = elements.ruleRowTemplate.content.cloneNode(true);
      fragment.querySelector(".rule-current").textContent = rule.currentState;
      fragment.querySelector(".rule-read").textContent = rule.read;
      fragment.querySelector(".rule-write").textContent = rule.write;
      fragment.querySelector(".rule-move").textContent = rule.move;
      fragment.querySelector(".rule-next").textContent = rule.nextState;
      fragment.querySelector(".delete-rule").addEventListener("click", () => deleteRule(actualIndex));
      elements.rulesTableBody.appendChild(fragment);
    });
  }

  const alphabet = getAlphabet();
  elements.ruleCount.textContent = `${state.rules.length} rule${state.rules.length === 1 ? "" : "s"}`;
  elements.alphabetDisplay.textContent = `Alphabet: ${alphabet.length ? alphabet.join(", ") : "-"}`;
}

function renderTape() {
  elements.tapeContainer.innerHTML = "";
  const usedPositions = [...state.tape.keys()];
  const min = usedPositions.length ? Math.min(...usedPositions, state.head) - state.tapePadding : state.head - state.tapePadding;
  const max = usedPositions.length ? Math.max(...usedPositions, state.head) + state.tapePadding : state.head + state.tapePadding;

  for (let pos = min; pos <= max; pos += 1) {
    const cell = document.createElement("div");
    cell.className = `tape-cell ${pos === state.head ? "head" : ""}`.trim();
    cell.dataset.position = String(pos);
    cell.innerHTML = `
      <span class="tape-index">${pos}</span>
      <div class="tape-symbol">${escapeHtml(readTape(pos))}</div>
      <div class="tape-state-chip">${pos === state.head ? escapeHtml(state.currentState) : "&nbsp;"}</div>
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
    const isActive = state.initialized && !state.halted && rule.currentState === state.currentState && rule.read === currentSymbol;
    card.className = `transition-card ${isActive ? "active" : ""}`.trim();
    card.innerHTML = `
      <strong>δ(${escapeHtml(rule.currentState)}, ${escapeHtml(rule.read)})</strong>
      <p>Write <strong>${escapeHtml(rule.write)}</strong>, move <strong>${rule.move}</strong>, go to <strong>${escapeHtml(rule.nextState)}</strong></p>
    `;
    elements.transitionCards.appendChild(card);
  });
}

function renderStatus() {
  const currentSymbol = state.initialized ? readTape(state.head) : "-";
  const nextRule = state.initialized && !state.halted ? getMatchingRule() : null;
  elements.machineStatus.textContent = state.status;
  elements.currentStateDisplay.textContent = state.initialized ? state.currentState : "-";
  elements.headPositionDisplay.textContent = state.initialized ? String(state.head) : "-";
  elements.currentSymbolDisplay.textContent = state.initialized ? currentSymbol : "-";
  elements.nextRuleDisplay.textContent = nextRule
    ? `${nextRule.write}, ${nextRule.move}, ${nextRule.nextState}`
    : "-";
  elements.stepCountDisplay.textContent = String(state.steps);
}

function renderSummary() {
  const positions = [...state.tape.keys()];
  const span = positions.length ? `${Math.min(...positions)} to ${Math.max(...positions)}` : "0";
  elements.summaryRules.textContent = String(state.rules.length);
  elements.summaryVisited.textContent = String(state.visitedStates.size);
  elements.summarySpan.textContent = span;
  elements.summaryOutcome.textContent = state.halted ? state.status : "Pending";
}

function render() {
  renderStatus();
  renderRules();
  renderTape();
  renderTransitionCards();
  renderSummary();
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

function loadPresetMachine() {
  const preset = PRESETS[elements.presetSelect.value];
  if (!preset) return;

  stopRunning();
  elements.inputString.value = preset.inputString;
  elements.blankSymbol.value = preset.blankSymbol;
  elements.startState.value = preset.startState;
  elements.acceptState.value = preset.acceptState;
  elements.rejectState.value = preset.rejectState;
  elements.maxSteps.value = String(preset.maxSteps);
  state.rules = preset.rules.map((rule) => ({ ...rule }));
  clearLog();
  log(`Loaded preset machine: ${preset.name}.`, "success");
  initializeTape();
}

function exportMachine() {
  syncConfigFromInputs();
  const payload = {
    inputString: state.inputString,
    blankSymbol: state.blankSymbol,
    startState: state.startState,
    acceptState: state.acceptState,
    rejectState: state.rejectState,
    maxSteps: state.maxSteps,
    tapePadding: state.tapePadding,
    runSpeed: state.runSpeed,
    rules: state.rules,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "turing-machine-config.json";
  link.click();
  URL.revokeObjectURL(url);
  log("Machine configuration exported as JSON.", "success");
}

function importMachine(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      elements.inputString.value = data.inputString ?? "";
      elements.blankSymbol.value = (data.blankSymbol ?? "_").charAt(0);
      elements.startState.value = data.startState ?? "q0";
      elements.acceptState.value = data.acceptState ?? "qa";
      elements.rejectState.value = data.rejectState ?? "qr";
      elements.maxSteps.value = String(data.maxSteps ?? 200);
      elements.tapePadding.value = String(data.tapePadding ?? 6);
      elements.runSpeed.value = String(data.runSpeed ?? 420);
      state.rules = Array.isArray(data.rules) ? data.rules.map((rule) => ({ ...rule })) : [];
      clearLog();
      log("Machine configuration imported successfully.", "success");
      initializeTape();
    } catch (error) {
      alert("Invalid JSON file.");
      log("Failed to import configuration. Invalid JSON.", "error");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

async function copyRules() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(state.rules, null, 2));
    log("Rules copied to clipboard.", "success");
  } catch {
    log("Clipboard access failed in this browser context.", "warning");
  }
}

function centerHeadOnScreen() {
  const activeCell = elements.tapeContainer.querySelector(`.tape-cell[data-position="${state.head}"]`);
  if (activeCell) {
    activeCell.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}

function attachEvents() {
  elements.addRuleBtn.addEventListener("click", addRule);
  elements.initializeBtn.addEventListener("click", initializeTape);
  elements.initializeBtnTop.addEventListener("click", initializeTape);
  elements.stepBtn.addEventListener("click", stepMachine);
  elements.runBtn.addEventListener("click", runMachine);
  elements.pauseBtn.addEventListener("click", () => {
    stopRunning();
    if (state.initialized && !state.halted) {
      updateStatus("Paused");
      renderStatus();
      renderSummary();
      log("Execution paused.", "warning");
    }
  });
  elements.resetBtn.addEventListener("click", resetMachine);
  elements.clearRulesBtn.addEventListener("click", clearRules);
  elements.loadPresetBtn.addEventListener("click", loadPresetMachine);
  elements.exportBtn.addEventListener("click", exportMachine);
  elements.importFile.addEventListener("change", importMachine);
  elements.copyRulesBtn.addEventListener("click", copyRules);
  elements.ruleSearch.addEventListener("input", renderRules);
  elements.runSpeed.addEventListener("input", syncConfigFromInputs);
  elements.expandTapeBtn.addEventListener("click", () => {
    elements.tapePadding.value = String(Math.min(25, Number(elements.tapePadding.value) + 2));
    syncConfigFromInputs();
    renderTape();
    centerHeadOnScreen();
  });
  elements.shrinkTapeBtn.addEventListener("click", () => {
    elements.tapePadding.value = String(Math.max(2, Number(elements.tapePadding.value) - 2));
    syncConfigFromInputs();
    renderTape();
    centerHeadOnScreen();
  });
  elements.centerHeadBtn.addEventListener("click", centerHeadOnScreen);
  elements.jumpToEndBtn.addEventListener("click", runToHalt);

  document.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    const key = event.key.toLowerCase();
    if (key === "i") initializeTape();
    else if (key === "s") stepMachine();
    else if (key === "r") {
      if (state.intervalId) {
        stopRunning();
        updateStatus("Paused");
        render();
      } else {
        runMachine();
      }
    } else if (key === "l") loadPresetMachine();
  });
}

attachEvents();
loadPresetMachine();
render();
