import { ACTS, campaignMap, campaignEncounter, advanceAct, eventVariant } from './campaign.js';
import { CombatState, CARD_DATABASE as CARDS, STARTER_DECK, RELIC_DATABASE as RELICS, SeededRNG, draftCards } from './engine.js';
import './display-ads.js';

const $ = id => document.getElementById(id);
const KEY = 'chronodeck-breach-run-v1';
const icons = { Combat: '⚔', Elite: '◈', Shop: '◇', Rest: '✚', Event: '⌁' };
const NODE_ART = Object.fromEntries(Object.keys(icons).map(type => [type, `./assets/nodes/${type.toLowerCase()}.png`]));
function nodeArtwork(type) {
  const art = text('span', '', 'node-icon');
  art.setAttribute('aria-hidden', 'true');
  const image = document.createElement('img');
  image.src = NODE_ART[type]; image.alt = ''; image.decoding = 'async';
  image.addEventListener('error', () => { art.replaceChildren(document.createTextNode(icons[type])); }, { once: true });
  art.append(image);
  return art;
}
const symbols = { Attack: '⟐', Defend: '⬡', Utility: '✧', Time: '◷' };
const CARD_ART = {
  rewind: './assets/cards/rewind.jpg',
  accelerate: './assets/cards/accelerate.jpg',
  echo: './assets/cards/echo.jpg',
  weaken: './assets/cards/weaken.jpg',
  overclock: './assets/cards/overclock.jpg',
  scan: './assets/cards/scan.jpg',
  repair: './assets/cards/repair.jpg',
  focus: './assets/cards/focus.jpg',
  cleanse: './assets/cards/cleanse.jpg',
  fortify: './assets/cards/fortify.jpg',
  parry: './assets/cards/parry.jpg',
  phase: './assets/cards/phase.jpg',
  bastion: './assets/cards/bastion.jpg',
  railshot: './assets/cards/railshot.jpg',
  doubletap: './assets/cards/doubletap.jpg',
  nova: './assets/cards/nova.jpg',
  piercer: './assets/cards/piercer.jpg',
  rupture: './assets/cards/rupture.jpg',
  toxin: './assets/cards/toxin.jpg',
  strike: './assets/cards/strike.jpg',
  guard: './assets/cards/guard.jpg',
  delay: './assets/cards/delay.jpg',
  loop: './assets/cards/loop.jpg',
  fracture: './assets/cards/temporal-fracture.jpg',
  siphon: './assets/cards/energy-siphon.jpg',
  stasis: './assets/cards/stasis-field.jpg',
  finisher: './assets/cards/event-horizon.jpg'
};
let run, combat = null, selected = null, dragged = null, toastTimer;
function text(tag, content, cls = '') { const el = document.createElement(tag); el.textContent = content; el.className = cls; return el; }
function button(label, action, cls = '', disabled = false) { const el = text('button', label, cls); el.type = 'button'; el.disabled = disabled; el.addEventListener('click', action); return el; }
function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3500); }
function save() {
  if (combat) { run.combat = combat.toJSON(); run.hp = combat.player.hp; }
  try { localStorage.setItem(KEY, JSON.stringify(run)); $('save-status').textContent = 'Progress saved locally'; }
  catch { $('save-status').textContent = 'Save unavailable'; toast('Browser storage unavailable. Keep this tab open to preserve your run.'); }
}
function newRun() {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  combat = null; selected = null;
  run = { version: 1, act: 1, clearedBefore: 0, seed, map: campaignMap(seed, 1), currentNodeId: null, completed: [], hp: 80, maxHp: 80, gold: 80, deck: [...STARTER_DECK], relics: ['anchor'], stage: 'map', combat: null, offers: null, shop: null };
  save(); render(); showStage();
}
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (!data) return false;
    if (data.version !== 1 || !Array.isArray(data.deck) || data.deck.some(id => !CARDS[id]) || !data.map?.floors || !Array.isArray(data.completed) || !Array.isArray(data.relics) || data.relics.some(id => !RELICS[id]) || !Number.isFinite(data.hp)) throw Error('Invalid save');
    if (!['map', 'combat', 'draft', 'shop', 'rest', 'event', 'intermission', 'victory', 'defeat'].includes(data.stage)) throw Error('Invalid stage');
    data.act ??= 1; data.clearedBefore ??= 0;
    if (!Number.isInteger(data.act) || data.act < 1 || data.act > 3) throw Error('Invalid act');
    if (data.stage === 'victory' && data.act < 3) data.stage = 'intermission';
    run = data; combat = data.combat ? CombatState.fromJSON(data.combat) : null;
    if (run.stage === 'combat' && !combat) throw Error('Missing combat');
    render(); showStage(); return true;
  } catch { toast('The saved run could not be read. Starting a new timeline.'); return false; }
}
const node = id => run.map.floors.flat().find(n => n.id === id);
const available = () => run.currentNodeId ? node(run.currentNodeId).next : [run.map.entryId];
function openScreen(title, kicker, closable = false, view = 'encounter') {
  closeScreen();
  $('screen').classList.remove('victory-screen', 'reward-screen');
  $('screen').dataset.view = view;
  $('screen-title').textContent = title; $('screen-kicker').textContent = kicker;
  $('screen-body').replaceChildren(); $('screen-close').hidden = !closable;
  $('screen').dataset.closable = String(closable);
  if (view === 'map') { document.querySelector('.app').inert = true; $('screen').show(); }
  else $('screen').showModal();
  return $('screen-body');
}
function closeScreen() { $('screen').close(); document.querySelector('.app').inert = false; }
function intro(body, message) { body.append(text('p', message, 'overlay-intro')); }
function describe(card) {
  return card.effects.map(f => {
    switch (f.kind) {
      case 'damage': return `Deal ${f.amount}${f.piercing ? ' piercing' : ''} damage${card.target === 'allEnemies' ? ' to all enemies' : ''}.`;
      case 'block': return `Gain ${f.amount} block.`;
      case 'energy': return `Gain ${f.amount} energy.`;
      case 'draw': return `Draw ${f.amount} card${f.amount === 1 ? '' : 's'}.`;
      case 'heal': return `Restore ${f.amount} HP.`;
      case 'status': return `Apply ${f.amount} ${f.status}.`;
      case 'delay': return `Delay ${card.target === 'allEnemies' ? 'each enemy’s' : 'the enemy’s'} next action by ${f.amount} turns.`;
      case 'loop': return `Replay last turn’s last non-Loop card${f.amount > 1 ? ` ${f.amount} times` : ''}.`;
      case 'cleanse': return 'Remove weak, vulnerable, and poison.';
      default: return '';
    }
  }).join(' ');
}
function cardElement(id, instanceId = null) {
  const c = CARDS[id], el = document.createElement(instanceId ? 'button' : 'article');
  el.className = `card ${c.type.toLowerCase()}`;
  el.dataset.card = id;
  const art = text('div', '', 'card-art');
  if (CARD_ART[id]) {
    const image = document.createElement('img');
    image.src = CARD_ART[id]; image.alt = ''; image.draggable = false;
    image.addEventListener('error', () => { art.replaceChildren(text('span', symbols[c.type], 'art-symbol')); }, { once: true });
    art.append(image); el.classList.add('illustrated');
  } else art.append(text('span', symbols[c.type], 'art-symbol'));
  const targets = { enemy: 'One enemy', allEnemies: 'All enemies', self: 'Self', none: 'Previous action' };
  el.append(text('span', String(c.cost), 'card-cost'), text('span', c.type, 'card-type'), art, text('h3', c.name, 'card-name'), text('p', describe(c), 'card-description'), text('small', c.exhaust ? 'Exhaust · this combat' : targets[c.target], 'card-bottom'));
  if (instanceId) {
    el.type = 'button'; el.draggable = true; el.dataset.instance = instanceId;
    el.classList.toggle('selected', selected === instanceId); el.setAttribute('aria-pressed', String(selected === instanceId));
    el.setAttribute('aria-label', `${c.name}, costs ${c.cost}. ${describe(c)}`);
    el.addEventListener('click', () => { selected = selected === instanceId ? null : instanceId; render(); });
    el.addEventListener('dragstart', e => { dragged = instanceId; selected = instanceId; e.dataTransfer.setData('text/plain', instanceId); e.dataTransfer.effectAllowed = 'move'; updateSelection(); });
    el.addEventListener('dragend', () => { dragged = null; updateSelection(); });
  }
  return el;
}
function statusElements(container, entity) {
  container.replaceChildren();
  for (const [name, amount] of Object.entries(entity.statuses || {})) if (amount > 0) container.append(text('span', `${name} ${amount}`, 'status'));
}
function intentText(action) {
  if (!action) return 'No queued action';
  const i = action.intent;
  return `${i.kind === 'attack' ? '⚔ Attack' : i.kind === 'block' ? '⬡ Block' : `⌁ ${i.status}`} ${i.amount}`;
}
function render() {
  document.querySelector('.player-panel').classList.remove('player-impact');
  document.body.dataset.runStage = run.stage;
  const p = combat?.player || { hp: run.hp, maxHp: run.maxHp, block: 0, statuses: {} };
  $('hp-text').textContent = `${p.hp} / ${p.maxHp}`; $('hp-bar').style.width = `${Math.max(0, p.hp / p.maxHp * 100)}%`;
  $('block').textContent = p.block; $('gold').textContent = run.gold; statusElements($('player-status'), p);
  $('relics').replaceChildren(...run.relics.map(id => {
    const r = RELICS[id], el = text('div', '', 'relic');
    el.title = r.description; el.append(text('span', '◈'), document.createTextNode(r.name), text('p', r.description, 'muted')); return el;
  }));
  $('energy').textContent = combat?.energy ?? '—'; $('turn-label').textContent = combat ? `TURN ${String(combat.turn).padStart(2, '0')}` : 'AWAITING ENCOUNTER';
  $('mission').textContent = `ACT ${ACTS[run.act - 1].numeral} · FLOOR ${node(run.currentNodeId)?.floor || 1} / 7`;
  $('hand-count').textContent = combat ? ` / ${combat.hand.length}` : '';
  for (const [pile, id] of [['drawPile', 'draw-count'], ['discardPile', 'discard-count'], ['exhaustPile', 'exhaust-count']]) $(id).textContent = combat?.[pile].length || 0;
  $('enemies').replaceChildren();
  $('enemies').dataset.count = String(combat?.enemies.length || 0);
  const eliteEncounter = node(run.currentNodeId)?.type === 'Elite';
  document.querySelector('.combat-area').classList.toggle('elite-arena', !!combat && eliteEncounter);
  if (combat) for (const enemy of combat.enemies) {
    const isSentinel = enemy.archetype ? enemy.archetype === 'sentinel' : enemy.name.includes('Sentinel');
    const el = button('', () => playSelected(enemy.id), `enemy${enemy.hp <= 0 ? ' dead' : ''}`); el.dataset.enemy = enemy.id;
    el.disabled = enemy.hp <= 0;
    const action = combat.timeline.actions.filter(a => a.enemyId === enemy.id).sort((a, b) => a.turn - b.turn)[0];
    el.append(text('span', `${intentText(action)}${action ? ` · T${action.turn}` : ''}`, 'intent'));
    const art = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); art.setAttribute('viewBox', '0 0 140 140'); art.setAttribute('aria-hidden', 'true');
    art.innerHTML = '<path d="M70 10 108 36 124 80 96 117 70 130 44 117 16 80 32 36Z" fill="#1b2943" stroke="#9d85d5" stroke-width="2"/><path d="M34 49 70 28 106 49 98 91 70 111 42 91Z" fill="#343458" stroke="#ad91ff"/><path d="m48 57 22-12 22 12-6 26-16 12-16-12Z" fill="#141c32" stroke="#64eadf"/><path d="M55 68h30M70 53v30" stroke="#64eadf" stroke-width="4"/><path d="M27 80 7 95M113 80l20 15M44 115l-7 20M96 115l7 20" stroke="#ad91ff" stroke-width="5"/>';
    const meter = text('div', '', 'meter'), fill = document.createElement('div'); fill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp * 100)}%`; meter.append(fill);
    const body = text('div', '', 'enemy-body');
    body.addEventListener('animationend', event => {
      if (event.animationName === 'enemy-recoil' || event.animationName === 'enemy-lunge') el.classList.remove('enemy-hit', 'enemy-attacking');
    });
    body.append(art);
    const image = document.createElement('img'); image.className = 'enemy-sprite'; image.alt = ''; image.draggable = false;
    image.src = isSentinel ? './assets/enemies/chrono-sentinel.png' : './assets/enemies/breach-drone.png';
    image.addEventListener('load', () => body.classList.add('sprite-ready'), { once: true });
    image.addEventListener('error', () => image.remove(), { once: true });
    body.append(image); el.classList.toggle('sentinel', isSentinel);
    el.append(body, text('span', enemy.name, 'enemy-name'), meter, text('small', `${enemy.hp} / ${enemy.maxHp} HP · ${enemy.block} block`));
    const statuses = text('div', '', 'statuses'); statusElements(statuses, enemy); el.append(statuses);
    el.addEventListener('dragover', e => { if (dragged && enemy.hp > 0) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } });
    el.addEventListener('drop', e => { e.preventDefault(); if (dragged) playSelected(enemy.id); }); $('enemies').append(el);
  }
  if (!combat) $('enemies').append(text('p', 'Choose your next breach on the node map.', 'empty'));
  $('timeline').replaceChildren();
  const slots = combat?.timelineTrack || Array.from({ length: 5 }, (_, i) => ({ turn: i + 1, actions: [] }));
  slots.forEach((slot, i) => {
    const el = button('', () => { $('timeline-detail').textContent = slot.actions.length ? slot.actions.map(a => `${combat.enemies.find(e => e.id === a.enemyId)?.name}: ${intentText(a)}`).join(' · ') : `Turn ${slot.turn}: no queued actions.`; }, 'time-slot');
    el.classList.toggle('has-actions', slot.actions.length > 0);
    el.append(text('small', i === 0 ? 'NOW' : `+${i} TURN${i > 1 ? 'S' : ''}`), text('span', slot.actions.length ? slot.actions.map(intentText).join(' / ') : '— Clear', slot.actions.length ? '' : 'quiet')); $('timeline').append(el);
  });
  $('hand').replaceChildren(...(combat?.hand || []).map(c => cardElement(c.definitionId, c.id)));
  $('end-turn').disabled = !combat || run.stage !== 'combat' || !!combat.outcome;
  $('footer-state').textContent = run.stage === 'combat' ? 'PLAYER PHASE // AWAITING INPUT' : `${run.stage.toUpperCase()} // LOCAL RUN`; updateSelection();
}
function updateSelection() {
  const instance = combat?.hand.find(c => c.id === selected), c = instance && CARDS[instance.definitionId];
  $('selection').textContent = c ? `${c.name} · ${c.target === 'enemy' ? 'choose an enemy' : 'ready to play'}` : 'Awaiting command';
  $('play-button').disabled = !c || c.target === 'enemy' || run.stage !== 'combat';
  document.querySelectorAll('.enemy').forEach(el => el.classList.toggle('targetable', !!c && c.target === 'enemy' && combat.enemies.find(e => e.id === el.dataset.enemy)?.hp > 0));
}
function playSelected(target = null) {
  if (!selected || run.stage !== 'combat') return;
  try { const before = captureCombatFX(); combat.playCard(selected, target); selected = null; finishCombatAction(before); } catch (error) { toast(error.message); }
}
function captureCombatFX() {
  return { logIndex: combat.log.length, actions: new Map(combat.timeline.actions.map(a => [a.id, a.turn])) };
}
function finishCombatAction(before) {
  const damage = combat.log.slice(before.logIndex).filter(e => e.event === 'damage');
  const attacks = combat.log.slice(before.logIndex).filter(e => e.event === 'enemyAction' && e.intent.kind === 'attack');
  const queuedTurns = new Set(combat.timeline.actions.filter(a => before.actions.get(a.id) !== a.turn).map(a => a.turn));
  resolveCombat();
  if (run.stage !== 'combat') return;
  for (const attack of attacks) document.querySelector(`[data-enemy="${attack.enemyId}"]`)?.classList.add('enemy-attacking');
  const offsets = new Map();
  for (const hit of damage) {
    const target = hit.targetId === 'player' ? $('hp-bar') : [...document.querySelectorAll('.enemy')].find(el => el.dataset.enemy === hit.targetId);
    if (!target) continue;
    if (hit.targetId !== 'player') target.classList.add('enemy-hit');
    else document.querySelector('.player-panel').classList.add('player-impact');
    const rect = target.getBoundingClientRect(), offset = offsets.get(hit.targetId) || 0;
    offsets.set(hit.targetId, offset + 1);
    const label = hit.hpLoss > 0 ? `−${hit.hpLoss}` : 'BLOCKED';
    const float = text('span', label, `damage-float${hit.hpLoss === 0 ? ' blocked' : ''}${hit.cause === 'poison' ? ' poison' : ''}`);
    float.setAttribute('aria-hidden', 'true'); float.style.left = `${rect.left + rect.width / 2 + offset * 18}px`; float.style.top = `${rect.top + rect.height * .4 + offset * 22}px`;
    document.body.append(float); float.addEventListener('animationend', () => float.remove(), { once: true }); setTimeout(() => float.remove(), 1400);
  }
  [...$('timeline').children].forEach((slot, i) => { if (queuedTurns.has(combat.turn + i)) slot.classList.add('timeline-queued'); });
}
function resolveCombat() {
  if (combat.outcome === 'victory') {
    run.hp = combat.player.hp; run.gold += node(run.currentNodeId).type === 'Elite' ? 45 : 25;
    run.offers = draftCards(new SeededRNG(`${run.seed}:${run.currentNodeId}:reward`)).map(c => c.id);
    run.stage = 'draft'; run.combat = null; combat = null;
  } else if (combat.outcome === 'defeat') { run.hp = 0; run.stage = 'defeat'; }
  save(); render(); if (run.stage !== 'combat') showStage();
}
function enterNode(id) {
  if (run.stage !== 'map' || !available().includes(id)) return;
  const n = node(id); run.currentNodeId = id; selected = null; run.shop = null; run.offers = null;
  if (n.type === 'Combat' || n.type === 'Elite') {
    combat = new CombatState({ seed: `${run.seed}:${id}`, deck: run.deck, relics: run.relics, player: { hp: run.hp, maxHp: run.maxHp }, enemies: campaignEncounter(n.type, n.floor, `${run.seed}:${run.act}:${id}`, run.act) }); run.stage = 'combat';
  } else run.stage = n.type.toLowerCase();
  save(); render(); showStage();
}
function completeNode() {
  if (!run.completed.includes(run.currentNodeId)) run.completed.push(run.currentNodeId);
  run.combat = null; combat = null; run.offers = null; run.shop = null;
  run.stage = run.currentNodeId === run.map.exitId ? (run.act < 3 ? 'intermission' : 'victory') : 'map'; save(); render(); showStage();
}
function showMap(preview = false) {
  const body = openScreen(ACTS[run.act - 1].name, `ACT ${ACTS[run.act - 1].numeral} / III // SEVEN FLOORS`, preview, 'map');
  const descriptions = { Combat: 'Face Breach Drones. Win credits and draft a card.', Elite: 'Challenge a Chrono Sentinel. Earn greater rewards.', Shop: 'Buy cards and relics, or remove a card.', Rest: 'Repair up to 30% of your maximum hull.', Event: 'Investigate a damaged relay. Choose your reward and risk.' };
  const progress = text('div', '', 'route-progress');
  progress.append(text('span', `${run.completed.length} / 7 floors cleared`), text('span', `Hull ${run.hp}/${run.maxHp} · ${run.gold} credits`));
  const status = text('p', preview ? 'Finish your encounter to continue the route.' : 'Choose a glowing encounter to enter. Follow its path to the sector boss.', 'route-status');
  status.setAttribute('aria-live', 'polite');
  const board = text('div', '', 'map-board');
  const svgs = ['wide', 'tall'].map(layout => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('map-lines', `map-lines-${layout}`); board.append(svg); return svg; });
  const coords = new Map();
  run.map.floors.forEach((floor, f) => {
    floor.forEach((n, i) => coords.set(n.id, { x: 7 + f * 14.3, y: floor.length === 1 ? 50 : 20 + i * 60 / (floor.length - 1) }));
    const label = text('span', `${f === 6 ? 'BOSS' : 'FLOOR ' + (f + 1)}`, 'floor-label'); label.style.setProperty('--floor-position', `${7 + f * 14.3}%`); board.append(label);
  });
  for (const n of run.map.floors.flat()) for (const next of n.next) {
    const a = coords.get(n.id), b = coords.get(next);
    svgs.forEach((svg, i) => { const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', i ? a.y : a.x); line.setAttribute('y1', i ? a.x : a.y); line.setAttribute('x2', i ? b.y : b.x); line.setAttribute('y2', i ? b.x : b.y); line.setAttribute('vector-effect', 'non-scaling-stroke');
      line.dataset.from = n.id; line.dataset.to = next;
      if (run.completed.includes(n.id)) line.classList.add('active'); svg.append(line);
    });
  }
  function highlight(id) {
    const reachable = new Set();
    function visit(next) { if (reachable.has(next)) return; reachable.add(next); node(next).next.forEach(visit); }
    if (id) visit(id);
    board.querySelectorAll('line').forEach(line => line.classList.toggle('route-highlight', reachable.has(line.dataset.from) && reachable.has(line.dataset.to)));
    board.querySelectorAll('.map-node').forEach(el => el.classList.toggle('route-highlight', reachable.has(el.dataset.node)));
    status.textContent = id ? descriptions[node(id).type] : preview ? 'Finish your encounter to continue the route.' : 'Choose a glowing encounter to enter. Follow its path to the sector boss.';
  }
  for (const n of run.map.floors.flat()) {
    const canEnter = !preview && available().includes(n.id), done = run.completed.includes(n.id);
    const el = button('', () => enterNode(n.id), `map-node${canEnter ? ' available' : ''}${done ? ' complete' : ''}${n.floor === 7 ? ' boss-node' : ''}`, !canEnter);
    el.dataset.node = n.id; el.append(nodeArtwork(n.type), text('span', n.type, 'node-label'));
    if (canEnter) el.append(text('span', 'ENTER', 'node-enter'));
    if (done) { const check = text('span', '✓', 'node-completed'); check.setAttribute('aria-hidden', 'true'); el.append(check); }
    el.style.setProperty('--map-x', `${coords.get(n.id).x}%`); el.style.setProperty('--map-y', `${coords.get(n.id).y}%`);
    el.setAttribute('aria-label', `Floor ${n.floor} ${n.type}${done ? ', completed' : canEnter ? ', available' : ''}`);
    el.title = descriptions[n.type];
    if (canEnter) { el.addEventListener('pointerenter', () => highlight(n.id)); el.addEventListener('pointerleave', () => highlight(null)); el.addEventListener('focus', () => highlight(n.id)); el.addEventListener('blur', () => highlight(null)); }
    board.append(el);
  }
  const legend = text('div', '', 'legend');
  for (const type of Object.keys(icons)) { const item = text('span', '', 'legend-item'); item.append(nodeArtwork(type), text('span', type)); legend.append(item); }
  body.append(progress, status, board, legend);
}
function showDraft() {
  const body = openScreen('Encounter cleared', 'BREACH SECURED // CARD REWARD');
  $('screen').classList.add('reward-screen');
  const banner = text('div', '', 'reward-banner');
  const seal = text('span', '✓', 'reward-seal'); seal.setAttribute('aria-hidden', 'true');
  const copy = text('div', '', 'reward-copy');
  copy.append(text('h2', 'Salvage the future'), text('p', 'Credits recovered. Choose one card to add to your deck.'));
  banner.append(seal, copy); body.append(banner);
  const grid = text('div', '', 'offer-grid');
  for (const id of run.offers) { const offer = text('div', '', 'offer'); offer.append(cardElement(id), button('Add to deck', () => { run.deck.push(id); completeNode(); }, 'primary')); grid.append(offer); }
  const actions = text('div', '', 'reward-actions'); actions.append(button('Skip reward', completeNode));
  body.append(grid, actions);
}
function showShop() {
  if (!run.shop) {
    const rng = new SeededRNG(`${run.seed}:${run.currentNodeId}:shop`);
    run.shop = { cards: draftCards(rng).map(c => ({ id: c.id, price: 40 + rng.int(3) * 10, sold: false })), relic: Object.keys(RELICS).find(id => !run.relics.includes(id)) || null, relicSold: false, trimmed: false }; save();
  }
  const body = openScreen('The outpost', `SUPPLY EXCHANGE // ${run.gold} CREDITS`); intro(body, 'Purchase recovered technology or remove one card. Stock and purchases are saved immediately.');
  const grid = text('div', '', 'offer-grid');
  run.shop.cards.forEach(offer => {
    const box = text('div', '', 'offer'); box.append(cardElement(offer.id), button(offer.sold ? 'Purchased' : `${offer.price} credits`, () => {
      if (offer.sold || run.gold < offer.price) return; run.gold -= offer.price; run.deck.push(offer.id); offer.sold = true; save(); render(); showShop();
    }, 'primary', offer.sold || run.gold < offer.price)); grid.append(box);
  });
  if (run.shop.relic) {
    const relic = RELICS[run.shop.relic], box = text('div', '', 'offer'); box.append(text('div', '◈', 'event-art'), text('h2', relic.name), text('p', relic.description, 'muted'), button(run.shop.relicSold ? 'Purchased' : '90 credits', () => {
      if (run.shop.relicSold || run.gold < 90) return; run.gold -= 90; run.relics.push(relic.id); run.shop.relicSold = true; save(); render(); showShop();
    }, 'primary', run.shop.relicSold || run.gold < 90)); grid.append(box);
  }
  body.append(grid); const actions = text('div', '', 'overlay-actions'); actions.append(button(run.shop.trimmed ? 'Deck trimmed' : 'Trim one card · 35 credits', showTrim, '', run.shop.trimmed || run.gold < 35 || run.deck.length <= 1), button('Leave outpost', completeNode, 'primary')); body.append(actions);
}
function showTrim() {
  const body = openScreen('Travel lighter', 'SELECT A CARD TO REMOVE'), grid = text('div', '', 'offer-grid');
  run.deck.forEach((id, index) => { const box = text('div', '', 'offer'); box.append(cardElement(id), button('Remove · 35 credits', () => {
    if (run.shop.trimmed || run.gold < 35 || run.deck.length <= 1) return; run.deck.splice(index, 1); run.gold -= 35; run.shop.trimmed = true; save(); render(); showShop();
  })); grid.append(box); }); body.append(grid, button('Back to shop', showShop));
}
function showRest() {
  const amount = Math.min(run.maxHp - run.hp, Math.ceil(run.maxHp * .3)), body = openScreen('A moment outside time', 'REST SITE // SAFE HARBOR');
  intro(body, `Hull integrity: ${run.hp} / ${run.maxHp}. Recover before the next breach.`); body.append(text('div', '✚', 'event-art'), button(`Repair hull · restore ${amount} HP`, () => { run.hp = Math.min(run.maxHp, run.hp + amount); completeNode(); }, 'choice primary'), button('Continue without resting', completeNode, 'choice'));
}
function showEvent() {
  const variant = eventVariant(run);
  if (variant === 1) {
    const body = openScreen('The stranded archivist', 'SURVIVOR SIGNAL');
    intro(body, 'An archivist offers a shield schematic in exchange for a safe passage.');
    body.append(button('Escort · pay 20 credits, gain Phase Armor and heal 12 HP', () => { if (run.gold < 20) return; run.gold -= 20; run.deck.push('phase'); run.hp = Math.min(run.maxHp, run.hp + 12); completeNode(); }, 'choice', run.gold < 20), button('Accept emergency supplies · gain 20 credits', () => { run.gold += 20; completeNode(); }, 'choice'));
    return;
  }
  if (variant === 2) {
    const body = openScreen('The unstable aperture', 'TEMPORAL ANOMALY');
    intro(body, 'The aperture can rewrite your hull or reveal a weapon from a lost future.');
    body.append(button('Stabilize · gain 5 maximum hull and heal 5 HP', () => { run.maxHp += 5; run.hp += 5; completeNode(); }, 'choice'), button('Reach through · lose 10 HP, gain Temporal Fracture', () => { if (run.hp <= 10) return; run.hp -= 10; run.deck.push('fracture'); completeNode(); }, 'choice', run.hp <= 10));
    return;
  }
  const body = openScreen('An echo in the static', 'UNKNOWN SIGNAL // EVENT'); intro(body, 'A derelict relay offers a fragment of tomorrow. Its power core remains unstable.'); body.append(text('div', '⌁', 'event-art'));
  body.append(button('Extract the core · gain 65 credits', () => { if (run.hp <= 8) return; run.hp -= 8; run.gold += 65; completeNode(); }, 'choice', run.hp <= 8), text('p', 'Extraction costs 8 HP. You must survive the procedure.', 'muted'), button('Recover a safe fragment · gain Deep Scan', () => { run.deck.push('scan'); completeNode(); }, 'choice'), button('Leave the relay', completeNode, 'choice'));
}
function showIntermission() {
  const act = ACTS[run.act - 1], body = openScreen(`${act.boss} defeated`, `ACT ${act.numeral} COMPLETE`);
  intro(body, `Next: ${ACTS[run.act].name}. Your deck, credits and relics carry forward. Choose a relic, gain 45 credits, increase maximum hull by 8 and repair 40% of your new maximum hull.`);
  const grid = text('div', '', 'offer-grid');
  for (const id of Object.keys(RELICS).filter(id => !run.relics.includes(id))) {
    const box = text('div', '', 'offer');
    box.append(text('div', '◈', 'event-art'), text('h2', RELICS[id].name), text('p', RELICS[id].description), button('Claim and continue', () => continueCampaign(id), 'primary'));
    grid.append(box);
  }
  body.append(grid, button('Take 90 credits and continue', () => continueCampaign(null), 'choice'));
}
function continueCampaign(relic) {
  advanceAct(run, relic); combat = null; selected = null; save(); render(); showStage();
}
function showVictory() {
  const body = openScreen('Breach sealed', 'CAMPAIGN COMPLETE');
  $('screen').classList.add('victory-screen');
  const celebration = text('div', '', 'victory-particles');
  celebration.setAttribute('aria-hidden', 'true');
  // Visual randomness is independent of the seeded gameplay RNG. Finite CSS
  // animations need no timers and are removed with the encounter screen.
  for (let i = 0; i < 72; i++) {
    const spark = text('i', '', 'victory-spark');
    const angle = i * Math.PI * 2 / 72;
    const distance = 230 + Math.random() * 460;
    spark.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--y', `${Math.sin(angle) * distance * .65}px`);
    spark.style.setProperty('--delay', `${Math.random() * .7}s`);
    spark.style.setProperty('--spin', `${Math.random() * 540}deg`);
    spark.style.setProperty('--spark-color', ['#65fff0', '#f4cb7e', '#b99aff'][i % 3]);
    celebration.append(spark);
  }
  const hero = text('section', '', 'victory-hero');
  const emblem = text('div', '', 'victory-emblem'); emblem.setAttribute('aria-hidden', 'true');
  emblem.append(text('span', '', 'breach-ring ring-one'), text('span', '', 'breach-ring ring-two'), text('span', '', 'breach-ring ring-three'), text('span', '◈', 'victory-sigil'));
  hero.append(text('div', 'PARADOX SOVEREIGN DEFEATED', 'victory-ribbon'), emblem,
    text('p', 'ALL THREE ACTS COMPLETE', 'victory-act'), text('h2', 'Breach sealed', 'victory-title'),
    text('p', 'You broke the sequence. You brought the future back.', 'victory-message'));
  const summary = text('div', '', 'victory-summary'); summary.setAttribute('aria-label', 'Completed run summary');
  const metrics = [[(run.clearedBefore || 0) + run.completed.length, 'Nodes cleared'], [run.deck.length, 'Cards collected'], [run.gold, 'Credits recovered'], [`${run.hp} / ${run.maxHp}`, 'Hull remaining']];
  metrics.forEach(([value, label], i) => {
    const metric = text('div', '', 'victory-metric'); metric.style.setProperty('--metric-delay', `${.8 + i * .12}s`);
    metric.append(text('strong', String(value)), text('span', label)); summary.append(metric);
  });
  const actions = text('div', '', 'victory-actions');
  actions.append(button('Inspect your deck', () => inspectPile()), button('Start a new run →', newRun, 'primary victory-start'));
  body.append(celebration, hero, summary, text('p', 'Twenty-one floors behind you. One timeline reclaimed.', 'victory-epilogue'), actions,
    text('p', 'Campaign complete. Your final deck and completed run are saved.', 'victory-save-note'));
}
function showStage() {
  switch (run.stage) {
    case 'combat': closeScreen(); break;
    case 'map': showMap(); break;
    case 'draft': showDraft(); break;
    case 'shop': showShop(); break;
    case 'rest': showRest(); break;
    case 'event': showEvent(); break;
    case 'intermission': showIntermission(); break;
    case 'victory': showVictory(); break;
    case 'defeat': {
      const body = openScreen('Timeline collapsed', 'RUN ENDED');
      intro(body, `${run.completed.length} nodes completed · ${run.deck.length} cards · ${run.gold} credits. A new timeline awaits.`); body.append(text('div', '⌁', 'event-art'), button('Start a new run', newRun, 'primary')); break;
    }
  }
}
function inspectPile(pile) {
  const names = { drawPile: 'Draw pile', discardPile: 'Discard pile', exhaustPile: 'Exhaust pile' }, body = openScreen(names[pile] || 'Your deck', 'DECK MANIFEST', true);
  const ids = pile ? (combat?.[pile] || []).map(c => c.definitionId).sort() : run.deck;
  intro(body, pile === 'drawPile' ? 'Cards are shown alphabetically; draw order is hidden.' : `${ids.length} cards in this collection.`);
  const grid = text('div', '', 'deck-grid'); grid.append(...ids.map(id => cardElement(id))); body.append(ids.length ? grid : text('p', 'This pile is empty.', 'empty'));
}
function returnToStage() { closeScreen(); if (run.stage !== 'combat') showStage(); }
$('screen-close').addEventListener('click', returnToStage);
$('screen').addEventListener('cancel', e => { e.preventDefault(); if ($('screen').dataset.closable === 'true') returnToStage(); });
$('map-button').addEventListener('click', () => showMap(run.stage !== 'map'));
$('deck-button').addEventListener('click', () => inspectPile());
$('new-button').addEventListener('click', () => {
  const body = openScreen('Start a new timeline?', 'CURRENT RUN WILL BE REPLACED', true); intro(body, 'Starting again replaces the saved run on this browser.'); body.append(button('Start new run', newRun, 'primary'), button('Keep playing', returnToStage));
});
$('play-button').addEventListener('click', () => playSelected());
$('end-turn').addEventListener('click', () => { if (!combat || run.stage !== 'combat') return; try { const before = captureCombatFX(); selected = null; combat.endTurn(); finishCombatAction(before); } catch (error) { toast(error.message); } });
document.querySelectorAll('[data-pile]').forEach(el => el.addEventListener('click', () => inspectPile(el.dataset.pile)));
// Non-enemy cards may be dropped anywhere on the arena or the play button.
for (const area of [document.querySelector('.combat-area'), $('play-button')]) {
  area.addEventListener('dragover', e => { if (dragged) e.preventDefault(); });
  area.addEventListener('drop', e => { if (e.target.closest('.enemy')) return; e.preventDefault(); if (dragged) playSelected(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('screen').open) { selected = null; render(); } });
window.addEventListener('pagehide', () => { if (run) save(); });
if (!load()) newRun();

// Help has its own dialog so closing it returns to the exact current encounter.
const HELP_KEY = 'chronodeck-breach-guide-v1';
function showHelp() { if (!$('help').open) $('help').showModal(); }
function dismissHelp() {
  $('help').close();
  try { localStorage.setItem(HELP_KEY, 'seen'); } catch { /* The guide remains available without storage. */ }
}
document.querySelectorAll('.help-button').forEach(el => el.addEventListener('click', showHelp));
$('help-done').addEventListener('click', dismissHelp);
$('help').addEventListener('cancel', event => { event.preventDefault(); dismissHelp(); });
try { if (!localStorage.getItem(HELP_KEY)) showHelp(); } catch { showHelp(); }

