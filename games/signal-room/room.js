"use strict";

// Each relay is [column, row, width, height, switched on, belongs to a sliding row].
const levels = [
  {
    name: "First light", objective: "Switch on the dark relay to close the gap.", moves: 2,
    source: [0, 2], receiver: [6, 2],
    relays: [[1, 2, 2, 1], [3, 2, 1, 1, false], [4, 2, 2, 1], [1, 4, 1, 1], [4, 0, 2, 1]]
  },
  {
    name: "Crossing", objective: "Slide the tall relay into the gap between the two paths.", moves: 2,
    source: [6, 2], receiver: [6, 1],
    relays: [[4, 2, 2, 1], [4, 1, 2, 1], [2, 1, 1, 2, true, true], [0, 0, 2, 1], [5, 4, 1, 1]]
  },
  {
    name: "Return line", objective: "A lit branch can still end in empty space. Find the return route.", moves: 4,
    source: [0, 3], receiver: [0, 2],
    relays: [[1, 3, 1, 1], [2, 3, 1, 1, false], [1, 2, 1, 1, false], [2, 2, 1, 1],
      [5, 2, 1, 2, true, true], [6, 1, 1, 2], [6, 3, 1, 1], [4, 1, 2, 1, false]]
  },
  {
    name: "Switchback", objective: "Trace back from the receiver before spending a move.", moves: 4,
    source: [2, 1], receiver: [6, 3],
    relays: [[3, 1, 2, 1], [6, 1, 1, 2, true, true], [2, 2, 1, 1, false], [3, 2, 2, 1],
      [0, 2, 1, 2, true, true], [2, 3, 2, 1], [4, 3, 2, 1, false],
      [0, 0, 1, 2], [1, 1, 1, 1], [1, 0, 2, 1, false], [0, 4, 3, 1]]
  },
  {
    name: "Coupled lines", objective: "Each arrow moves both marked relays. Decide which one belongs in the route.", moves: 5,
    source: [0, 1], receiver: [3, 3],
    relays: [[1, 1, 2, 1, false], [4, 1, 1, 2, true, true], [5, 1, 1, 1, false, true],
      [0, 2, 1, 2], [1, 2, 2, 1, false], [1, 3, 1, 1, false], [2, 3, 1, 1, false],
      [5, 2, 1, 2], [6, 3, 1, 1, false], [4, 4, 2, 1]]
  },
  {
    name: "Full transmission", objective: "Carry one signal across three rows. Use the free pulse to check your progress.", moves: 6,
    source: [6, 3], receiver: [0, 1],
    relays: [[4, 3, 2, 1, false], [2, 2, 1, 2, true, true], [4, 2, 1, 1, false],
      [5, 1, 1, 2, true, true], [1, 1, 2, 1, false], [3, 1, 2, 1, false],
      [0, 2, 2, 1], [0, 3, 2, 1, false], [0, 4, 2, 1]],
    preset: { 1: 1 }
  },
  ...campaignBoards.map(parseCampaignBoard)
];

const width = 7;
const height = 5;
const byId = id => document.getElementById(id);
const grid = byId("grid");
const rows = byId("rows");
const sendButton = byId("send");
const nextButton = byId("next");
const picker = byId("puzzle-select");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const progressKey = "signal-room.completed";
let completed = 0;
try {
  const saved = Number(localStorage.getItem(progressKey));
  if (Number.isInteger(saved) && saved >= 0 && saved <= levels.length) completed = saved;
} catch {
  // Progress remains available for the current session when storage is blocked.
}
let levelIndex = 0;
let board, moves, startingBoard, slidingRows;
let history = [];
let busy = false;
let solved = false;
let swipe = null;
let trace = [];
const tileElements = [];
const rowButtons = [];

function makeBoard(level) {
  const endpoints = [
    [level.source, "source", "▶"],
    [level.receiver, "receiver", "◎"]
  ].map(([[x, y], kind, symbol]) => ({ x, y, w: 1, h: 1, kind, symbol, on: true }));
  return endpoints.concat(level.relays.map(([x, y, w, h, on = true, sliding = false]) => ({
    x: x + (sliding ? (level.preset?.[y] || 0) : 0), y, w, h, on, sliding, kind: "relay"
  })));
}

function overlaps(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function slide(tiles, row, step) {
  const onRow = tile => tile.sliding && tile.y === row;
  if (!tiles.some(onRow)) return null;
  const shifted = tiles.map(tile => onRow(tile) ? { ...tile, x: tile.x + step } : tile);
  return shifted.some((tile, index) => onRow(tile) &&
    (tile.x < 0 || tile.x + tile.w > width || shifted.some((other, j) => index !== j && overlaps(tile, other))))
    ? null : shifted;
}

function adjacent(a, b) {
  // Blocks connect along horizontal lanes. Tall relays span two lanes.
  const side = a.x + a.w === b.x || b.x + b.w === a.x;
  return side && a.y < b.y + b.h && b.y < a.y + a.h;
}

function pulse(tiles) {
  const distance = new Map([[0, 0]]);
  const queue = [0];
  for (const i of queue) {
    if (i === 1) continue;
    tiles.forEach((tile, j) => {
      if (tile.on && !distance.has(j) && adjacent(tiles[i], tile)) {
        distance.set(j, distance.get(i) + 1);
        queue.push(j);
      }
    });
  }
  return distance;
}

function addBoardElements() {
  grid.replaceChildren();
  rows.replaceChildren();
  tileElements.length = 0;
  rowButtons.length = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.gridArea = `${y + 1} / ${x + 1}`;
      cell.setAttribute("aria-hidden", "true");
      grid.append(cell);
    }
  }
  board.forEach((tile, index) => {
    const block = document.createElement(tile.kind === "relay" ? "button" : "div");
    if (tile.kind === "relay") {
      block.type = "button";
      block.addEventListener("click", () => toggle(index));
    } else {
      block.setAttribute("role", "img");
    }
    block.textContent = tile.symbol || (tile.sliding ? "↔" : "");
    tileElements.push(block);
    grid.append(block);
  });
  for (const y of slidingRows) {
    for (const [step, arrow, direction] of [[-1, "←", "left"], [1, "→", "right"]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = arrow;
      button.dataset.row = y + 1;
      button.style.gridArea = `${y + 1} / ${step < 0 ? 1 : 2}`;
      button.setAttribute("aria-label", `Slide row ${y + 1} ${direction}`);
      button.addEventListener("click", () => shiftRow(y, step));
      rows.append(button);
      rowButtons.push({ button, y, step });
    }
  }
}

function render() {
  const locked = busy || solved;
  board.forEach((tile, index) => {
    const block = tileElements[index];
    block.className = `tile ${tile.kind}${tile.on ? "" : " off"}${trace.includes(index) ? " traced" : ""}`;
    block.style.gridArea = `${tile.y + 1} / ${tile.x + 1} / span ${tile.h} / span ${tile.w}`;
    if (tile.kind === "relay") {
      const shape = tile.h > 1 ? "Tall" : tile.w > 1 ? "Long" : "Short";
      block.disabled = locked || moves === 0;
      block.setAttribute("aria-pressed", tile.on);
      block.setAttribute("aria-label", `${tile.sliding ? "Sliding " : ""}${shape.toLowerCase()} relay, row ${tile.y + 1}, column ${tile.x + 1}`);
    } else {
      block.setAttribute("aria-label", tile.kind === "source" ? "Pulse source" : "Pulse receiver");
    }
  });
  for (const { button, y, step } of rowButtons) {
    button.disabled = locked || moves === 0 || !slide(board, y, step);
  }
  byId("moves").textContent = moves;
  byId("undo").disabled = locked || history.length === 0;
  byId("reset").disabled = busy;
  picker.disabled = busy;
  sendButton.disabled = busy;
  sendButton.hidden = solved;
  nextButton.hidden = !solved;
}

function say(message) {
  byId("status").textContent = message;
}

function loadLevel(index) {
  levelIndex = index;
  const level = levels[index];
  startingBoard = makeBoard(level);
  board = startingBoard;
  slidingRows = [...new Set(board.filter(tile => tile.sliding).map(tile => tile.y))];
  rows.hidden = slidingRows.length === 0;
  byId("console").classList.toggle("no-shifts", rows.hidden);
  moves = level.moves;
  history = [];
  trace = [];
  solved = false;
  busy = false;
  byId("stage").textContent = `${chapterNames[Math.floor(index / 6)]} · ${index + 1} / ${levels.length}`;
  byId("level-name").textContent = level.name;
  byId("objective").textContent = level.objective;
  nextButton.textContent = index === levels.length - 1 ? "Replay first puzzle" : "Next puzzle →";
  picker.value = index;
  say("Ready to send.");
  addBoardElements();
  render();
  byId("level-name").focus({ preventScroll: true });
}

function unlockLevels() {
  const last = Math.min(completed, levels.length - 1);
  for (let index = picker.options.length; index <= last; index++) {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${index + 1}. ${levels[index].name}`;
    picker.add(option);
  }
}

function changeBoard(next, message) {
  history.push(board);
  board = next;
  moves--;
  trace = [];
  say(moves ? message : "Last move used. Send the pulse or undo a move.");
  render();
}

function toggle(index) {
  if (busy || solved || !moves) return;
  const on = !board[index].on;
  changeBoard(board.map((tile, i) => i === index ? { ...tile, on } : tile),
    on ? "Relay switched on." : "Relay switched off.");
}

function shiftRow(row, step) {
  if (busy || solved || !moves) return;
  const shifted = slide(board, row, step);
  if (shifted) changeBoard(shifted, `Row ${row + 1} shifted ${step < 0 ? "left" : "right"}.`);
  else say("That row has no room to slide in this direction.");
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function sendPulse() {
  if (busy || solved) return;
  busy = true;
  trace = [];
  say("Pulse in flight…");
  render();
  const distances = pulse(board);
  const max = distances.get(1) ?? Math.max(...distances.values());
  for (let hop = 0; hop <= max; hop++) {
    const reached = [...distances].filter(([, distance]) => distance === hop).map(([index]) => index);
    trace.push(...reached);
    for (const index of reached) tileElements[index].classList.add("fired");
    if (!reduceMotion.matches) await delay(135);
    for (const index of reached) {
      tileElements[index].classList.remove("fired");
      tileElements[index].classList.add("traced");
    }
  }
  solved = distances.has(1);
  busy = false;
  if (solved) {
    if (levelIndex === completed) {
      completed++;
      try { localStorage.setItem(progressKey, completed); } catch { /* Storage is optional. */ }
      unlockLevels();
    }
    say(levelIndex === levels.length - 1 ? "All 30 signals received." : "Signal received.");
  } else {
    say(moves ? "Signal stopped. Check where the illuminated route ends." : "Signal stopped. Undo a move or reset the puzzle.");
  }
  render();
  (solved ? nextButton : sendButton).focus({ preventScroll: true });
}

const confirmation = byId("confirm-rules");
const startButton = byId("start");
confirmation.checked = false;
if (completed > 0 && completed < levels.length) startButton.textContent = "Continue game →";
confirmation.addEventListener("change", () => { startButton.disabled = !confirmation.checked; });
startButton.addEventListener("click", () => {
  if (!confirmation.checked) return;
  byId("intro").hidden = true;
  byId("game").hidden = false;
  byId("help-button").hidden = false;
  unlockLevels();
  loadLevel(completed === levels.length ? 0 : completed);
});
byId("help-copy").append(document.querySelector(".instructions").cloneNode(true));
byId("help-button").addEventListener("click", () => byId("help").showModal());
byId("undo").addEventListener("click", () => {
  if (!history.length || busy || solved) return;
  board = history.pop();
  moves++;
  trace = [];
  say("Move undone.");
  render();
});
byId("reset").addEventListener("click", () => loadLevel(levelIndex));
sendButton.addEventListener("click", sendPulse);
nextButton.addEventListener("click", () => loadLevel((levelIndex + 1) % levels.length));
picker.addEventListener("change", () => loadLevel(Number(picker.value)));

grid.addEventListener("pointerdown", event => {
  if (!event.isPrimary || event.button !== 0) return;
  const bounds = grid.getBoundingClientRect();
  const tile = board[tileElements.indexOf(event.target)];
  const y = tile?.sliding ? tile.y : Math.floor((event.clientY - bounds.top) / bounds.height * height);
  swipe = { id: event.pointerId, x: event.clientX, startY: event.clientY, y, consumed: false };
});
grid.addEventListener("pointercancel", () => { swipe = null; });
grid.addEventListener("pointerup", event => {
  if (!swipe || swipe.id !== event.pointerId) return;
  const dx = event.clientX - swipe.x;
  const dy = event.clientY - swipe.startY;
  if (Math.abs(dx) < 27 || Math.abs(dx) < 1.25 * Math.abs(dy)) return;
  swipe.consumed = true;
  if (slidingRows.includes(swipe.y)) shiftRow(swipe.y, Math.sign(dx));
});
grid.addEventListener("click", event => {
  if (event.detail > 0 && swipe?.consumed) event.stopImmediatePropagation();
  swipe = null;
}, true);
