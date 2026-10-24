import { PROFILE_KEY, awardFirstClear, cooldown, useLastWord, startingDeck, rechargeProgress } from './progression.js';
import { COLLECTIBLE_ART, exportCollectible } from './collectible.js';
import { ACTS, campaignMap, campaignEncounter, advanceAct, eventVariant } from './campaign.js';
import { CombatState, CARD_DATABASE as CARDS, STARTER_DECK, RELIC_DATABASE as RELICS, SeededRNG, draftCards } from './engine.js';
import './display-ads.js';

const $ = id => document.getElementById(id);
const KEY = 'chronodeck-breach-run-v1';
let profile = { version: 1 };
try { const saved = JSON.parse(localStorage.getItem(PROFILE_KEY)); if (saved?.version === 1 && saved.collectible?.id && Number.isFinite(Date.parse(saved.collectible.earnedAt))) profile = saved; } catch {}
function persistProfile() { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { toast('Collectible could not be saved. Browser storage is unavailable.'); } }
function ensureAward() { const updated = awardFirstClear(profile, run); if (updated !== profile) { profile = updated; persistProfile(); } }

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
  borrowed: './assets/cards/accelerate.jpg', fracturepoint: './assets/cards/piercer.jpg', anchorprotocol: './assets/cards/cleanse.jpg', causality: './assets/cards/stasis-field.jpg', foresight: './assets/cards/scan.jpg', paradoxshield: './assets/cards/phase.jpg',
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
let signatureSelected = false;
let run, combat = null, selected = null, dragged = null, toastTimer;
function text(tag, content, cls = '') { const el = document.createElement(tag); el.textContent = content; el.className = cls; return el; }
function button(label, action, cls = '', disabled = false) { const el = text('button', label, cls); el.type = 'button'; el.disabled = disabled; el.addEventListener('click', action); return el; }
function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3500); }
function save() {
  if (combat) { run.combat = combat.toJSON(); run.hp = combat.player.hp; }
  try { localStorage.setItem(KEY, JSON.stringify(run)); $('save-status').textContent = 'Progress saved locally'; }
  catch { $('save-status').textContent = 'Save unavailable'; toast('Browser storage unavailable. Keep this tab open to preserve your run.'); }
}
function newRun(advanced = !!profile.collectible) {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  combat = null; selected = null;
  signatureSelected = false;
  run = { advanced: !!advanced && !!profile.collectible, signatureReadyAt: 0, version: 1, act: 1, clearedBefore: 0, seed, map: campaignMap(seed, 1), currentNodeId: null, completed: [], hp: 80, maxHp: 80, gold: 80, deck: startingDeck(profile, !!advanced && !!profile.collectible), relics: ['anchor'], stage: 'map', combat: null, offers: null, shop: null };
  save(); render(); showStage();
}
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (!data) return false;
    if (data.version !== 1 || !Array.isArray(data.deck) || data.deck.some(id => !CARDS[id]) || !data.map?.floors || !Array.isArray(data.completed) || !Array.isArray(data.relics) || data.relics.some(id => !RELICS[id]) || !Number.isFinite(data.hp)) throw Error('Invalid save');
    if (!['map', 'combat', 'draft', 'shop', 'rest', 'event', 'eventResult', 'intermission', 'victory', 'defeat'].includes(data.stage)) throw Error('Invalid stage');
    data.act ??= 1; data.clearedBefore ??= 0;
    if (!Number.isInteger(data.act) || data.act < 1 || data.act > 3) throw Error('Invalid act');
    if (data.stage === 'victory' && data.act < 3) data.stage = 'intermission';
    data.advanced = data.advanced === true; data.signatureReadyAt = Number.isFinite(data.signatureReadyAt) ? data.signatureReadyAt : 0;
    run = data; ensureAward(); combat = data.combat ? CombatState.fromJSON(data.combat) : null;
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
      case 'debt': return `Lose ${f.amount} energy next turn.`;
      case 'armorDamage': return `Deal ${f.amount} damage; double against a target with block.`;
      case 'halveAttack': return 'Halve the target’s next currently queued attack. No effect if no attack is queued.';
      case 'damage': return `Deal ${f.amount}${f.piercing ? ' piercing' : ''} damage${card.target === 'allEnemies' ? ' to all enemies' : ''}.`;
      case 'block': return `Gain ${f.amount} block.`;
      case 'energy': return `Gain ${f.amount} energy.`;
      case 'draw': return `Draw ${f.amount} card${f.amount === 1 ? '' : 's'}.`;
      case 'heal': return `Restore ${f.amount} HP.`;
      case 'status': return `Apply ${f.amount} ${f.status}.`;
      case 'delay': return `Delay ${card.target === 'allEnemies' ? 'each enemy’s' : 'the enemy’s'} next action by ${f.amount} turns.`;
      case 'loop': return `Replay last turn’s last non-Loop card${f.amount > 1 ? ` ${f.amount} times` : ''}.`;
      case 'cleanse': return 'Remove Weak, Vulnerable, and Poison from yourself.';
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
  if (c.advanced) el.append(text('small', 'ADVANCED ONLY', 'advanced-badge'));
  if (instanceId) {
    el.type = 'button'; el.draggable = true; el.dataset.instance = instanceId;
    el.classList.toggle('selected', selected === instanceId); el.setAttribute('aria-pressed', String(selected === instanceId));
    el.setAttribute('aria-label', `${c.name}, costs ${c.cost}. ${describe(c)}`);
    el.addEventListener('click', () => { signatureSelected = false; selected = selected === instanceId ? null : instanceId; render(); });
    el.addEventListener('dragstart', e => { signatureSelected = false; dragged = instanceId; selected = instanceId; e.dataTransfer.setData('text/plain', instanceId); e.dataTransfer.effectAllowed = 'move'; updateSelection(); });
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
  renderSignature();
  $('collectible-button').hidden = !profile.collectible;
  const p = combat?.player || { hp: run.hp, maxHp: run.maxHp, block: 0, statuses: {} };
  $('hp-text').textContent = `${p.hp} / ${p.maxHp}`; $('hp-bar').style.width = `${Math.max(0, p.hp / p.maxHp * 100)}%`;
  $('block').textContent = p.block; $('gold').textContent = run.gold; statusElements($('player-status'), p);
  $('relics').replaceChildren(...run.relics.map(id => {
    const r = RELICS[id], el = text('div', '', 'relic');
    el.title = r.description; el.append(text('span', '◈'), document.createTextNode(r.name), text('p', r.description, 'muted')); return el;
  }));
  $('energy').textContent = combat?.energy ?? '—'; $('turn-label').textContent = combat ? `TURN ${String(combat.turn).padStart(2, '0')}` : 'AWAITING ENCOUNTER';
  $('mission').textContent = `${run.advanced ? 'ADVANCED · ' : ''}ACT ${ACTS[run.act - 1].numeral} · FLOOR ${node(run.currentNodeId)?.floor || 1} / 7`;
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
  $('selection').textContent = c ? `${c.name} · ${c.target === 'enemy' ? 'choose an enemy' : 'ready to play'}` : signatureSelected ? 'The Last Word · choose an enemy' : 'Awaiting command';
  $('play-button').disabled = !c || c.target === 'enemy' || run.stage !== 'combat';
  document.querySelectorAll('.enemy').forEach(el => el.classList.toggle('targetable', (signatureSelected || (!!c && c.target === 'enemy')) && combat.enemies.find(e => e.id === el.dataset.enemy)?.hp > 0));
}
function playSelected(target = null) {
  if (signatureSelected && run.stage === 'combat') {
    try { const before = captureCombatFX(); useLastWord(run, combat, target); signatureSelected = false; selected = null; finishCombatAction(before); }
    catch(error) { toast(error.message); } return;
  }
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
    run.offers = draftCards(new SeededRNG(`${run.seed}:${run.currentNodeId}:reward`), 3, run.advanced).map(c => c.id);
    run.stage = 'draft'; run.combat = null; combat = null;
  } else if (combat.outcome === 'defeat') { run.hp = 0; run.stage = 'defeat'; }
  save(); render(); if (run.stage !== 'combat') showStage();
}
function enterNode(id) {
  if (run.stage !== 'map' || !available().includes(id)) return;
  signatureSelected = false;
  const n = node(id); run.eventResult = null; run.currentNodeId = id; selected = null; run.shop = null; run.offers = null;
  if (n.type === 'Combat' || n.type === 'Elite') {
    combat = new CombatState({ seed: `${run.seed}:${id}`, deck: run.deck, relics: run.relics, player: { hp: run.hp, maxHp: run.maxHp }, enemies: campaignEncounter(n.type, n.floor, `${run.seed}:${run.act}:${id}`, run.act, run.advanced) }); run.stage = 'combat';
  } else run.stage = n.type.toLowerCase();
  save(); render(); showStage();
}
function completeNode() {
  signatureSelected = false;
  if (!run.completed.includes(run.currentNodeId)) run.completed.push(run.currentNodeId);
  run.combat = null; combat = null; run.offers = null; run.shop = null;
  run.stage = run.currentNodeId === run.map.exitId ? (run.act < 3 ? 'intermission' : 'victory') : 'map'; ensureAward(); save(); render(); showStage();
}
function showMap(preview = false) {
  const body = openScreen(ACTS[run.act - 1].name, `ACT ${ACTS[run.act - 1].numeral} / III // SEVEN FLOORS`, preview, 'map');
  $('screen').dataset.act = run.act;
  const tools = text('div', '', 'map-progression-tools');
  tools.append(text('span', run.advanced ? 'ADVANCED MODE' : 'STANDARD MODE', 'eyebrow'), button('New timeline', showNewRun));
  if (profile.collectible) tools.append(button('Your collectible', showCollectible));
  body.append(tools);
  const descriptions = { Combat: 'Face Breach Drones. Win credits and draft a card.', Elite: 'Challenge a Chrono Sentinel. Earn greater rewards.', Shop: 'Buy cards and relics, or remove a card.', Rest: 'Repair up to 30% of your maximum hull.', Event: 'Investigate a damaged relay. Choose your reward and risk.' };
  const progress = text('div', '', 'route-progress');
  progress.append(text('span', `${run.completed.length} / 7 floors cleared`), text('span', `Hull ${run.hp}/${run.maxHp} · ${run.gold} credits`));
  const status = text('p', preview ? 'Finish your encounter to continue the route.' : 'Choose a glowing encounter to enter. Follow its path to the sector boss.', 'route-status');
  status.setAttribute('aria-live', 'polite');
  const board = text('div', '', 'map-board');
  const svgs = ['wide', 'tall'].map(layout => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('map-lines', `map-lines-${layout}`); board.append(svg); return svg; });
  const coords = new Map();
  const nextNodes = preview ? [] : available();
  let briefingNode = nextNodes[0] || null;
  run.map.floors.forEach((floor, f) => {
    floor.forEach((n, i) => coords.set(n.id, { x: 7 + f * 14.3, y: floor.length === 1 ? 50 : 20 + i * 60 / (floor.length - 1) }));
    const label = text('span', `${f === 6 ? 'BOSS' : 'FLOOR ' + (f + 1)}`, 'floor-label'); label.style.setProperty('--floor-position', `${7 + f * 14.3}%`); board.append(label);
  });
  for (const n of run.map.floors.flat()) for (const next of n.next) {
    const a = coords.get(n.id), b = coords.get(next);
    svgs.forEach((svg, i) => { const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', i ? a.y : a.x); line.setAttribute('y1', i ? a.x : a.y); line.setAttribute('x2', i ? b.y : b.x); line.setAttribute('y2', i ? b.x : b.y); line.setAttribute('vector-effect', 'non-scaling-stroke');
      line.dataset.from = n.id; line.dataset.to = next;
      if (run.completed.includes(n.id) && (run.completed.includes(next) || nextNodes.includes(next))) line.classList.add('active');
      if (nextNodes.includes(n.id)) line.classList.add('onward'); svg.append(line);
    });
  }
  function highlight(id) {
    const reachable = new Set();
    function visit(next) { if (reachable.has(next)) return; reachable.add(next); node(next).next.forEach(visit); }
    if (id) visit(id);
    board.querySelectorAll('line').forEach(line => line.classList.toggle('route-highlight', reachable.has(line.dataset.from) && reachable.has(line.dataset.to)));
    board.querySelectorAll('.map-node').forEach(el => el.classList.toggle('route-highlight', reachable.has(el.dataset.node)));
    status.textContent = id ? descriptions[node(id).type] : preview ? 'Finish your encounter to continue the route.' : 'Choose a glowing encounter to enter. Follow its path to the sector boss.';
    if (id) updateBriefing(id);
  }
  for (const n of run.map.floors.flat()) {
    const canEnter = nextNodes.includes(n.id), done = run.completed.includes(n.id);
    const el = button('', () => enterNode(n.id), `map-node${canEnter ? ' available' : ''}${done ? ' complete' : ''}${n.floor === 7 ? ' boss-node' : ''}`, !canEnter);
    el.dataset.node = n.id; el.append(nodeArtwork(n.type), text('span', n.type, 'node-label'));
    el.dataset.type = n.type;
    if (n.floor === 7) {
      el.querySelector('img').src = './assets/enemies/chrono-sentinel.png';
      el.querySelector('.node-label').textContent = ACTS[run.act - 1].boss;
      el.append(text('span', 'SECTOR BOSS', 'boss-caption'));
    }
    if (!done && !canEnter && n.floor <= run.completed.length) el.classList.add('route-skipped');
    if (n.id === run.currentNodeId && done) el.classList.add('current-position');
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
  const footer = text('div', '', 'sector-footer');
  const briefing = text('section', '', 'sector-briefing');
  briefing.setAttribute('aria-label', 'Next encounter briefing');
  const briefingArt = nodeArtwork('Combat');
  const briefingCopy = text('div', '', 'briefing-copy');
  const briefingTitle = text('h2', '', 'briefing-title');
  const briefingDescription = text('p', '', 'briefing-description');
  const briefingRewards = text('div', '', 'briefing-rewards');
  const enter = button('Enter encounter →', () => { if (briefingNode && !preview) enterNode(briefingNode); }, 'primary briefing-enter', preview || !briefingNode);
  briefingCopy.append(text('span', preview ? 'ROUTE PREVIEW' : 'NEXT ENCOUNTER', 'eyebrow'), briefingTitle, briefingDescription, briefingRewards);
  briefing.append(briefingArt, briefingCopy, enter);
  function updateBriefing(id) {
    briefingNode = id;
    const n = id && node(id), type = n?.type || 'Elite';
    const titles = { Combat: 'Breach patrol', Elite: n?.floor === 7 ? ACTS[run.act - 1].boss : 'Elite signature', Shop: 'Supply outpost', Rest: 'Repair chamber', Event: 'Unknown anomaly' };
    briefingTitle.textContent = preview ? 'Chart your next move' : titles[type];
    briefingDescription.textContent = preview ? 'Finish the current encounter to continue your route.' : descriptions[type];
    const rewards = { Combat: ['Earn credits', 'Draft a card'], Elite: ['Greater rewards', 'Powerful enemies'], Shop: ['Buy cards & relics', 'Trim your deck'], Rest: ['Repair hull'], Event: ['Discover a signal', 'Choose risk or reward'] };
    briefingRewards.replaceChildren(...(preview ? [] : rewards[type]).map(value => text('span', value)));
    briefingArt.querySelector('img').src = n?.floor === 7 ? './assets/enemies/chrono-sentinel.png' : NODE_ART[type];
    briefing.dataset.type = type;
    enter.textContent = preview ? 'Encounter in progress' : `Enter ${type === 'Elite' ? 'battle' : type.toLowerCase()} →`;
    enter.disabled = preview || !id;
  }
  footer.append(legend, briefing);
  body.append(progress, status, board, footer);
  updateBriefing(briefingNode);
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
    run.shop = { cards: draftCards(rng, 3, run.advanced).map(c => ({ id: c.id, price: 40 + rng.int(3) * 10, sold: false })), relic: Object.keys(RELICS).find(id => !run.relics.includes(id)) || null, relicSold: false, trimmed: false }; save();
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
    const body = openScreen('The stranded archivist', 'SURVIVOR SIGNAL', false, 'aperture');
    intro(body, 'An archivist offers a shield schematic in exchange for a safe passage.');
    body.append(button('Escort · pay 20 credits, gain Phase Armor and heal 12 HP', () => { if (run.gold < 20) return; run.gold -= 20; run.deck.push('phase'); run.hp = Math.min(run.maxHp, run.hp + 12); resolveEvent(); }, 'choice', run.gold < 20), button('Accept emergency supplies · gain 20 credits', () => { run.gold += 20; resolveEvent(); }, 'choice'));
    return;
  }
  if (variant === 2) {
    const body = openScreen('The unstable aperture', 'TEMPORAL ANOMALY', false, 'aperture');
    intro(body, 'The aperture can rewrite your hull or reveal a weapon from a lost future.');
    const atmosphere = text('div', '', 'aperture-atmosphere');
    atmosphere.setAttribute('aria-hidden', 'true'); body.append(atmosphere);
    const choices = text('div', '', 'aperture-choices');
    function apertureChoice(kind, label, title, description, art, rewards, action, callback, disabled = false) {
      const choice = button('', callback, `aperture-choice ${kind}`, disabled);
      const image = document.createElement('img'); image.src = art; image.alt = ''; image.className = 'aperture-choice-art';
      const copy = text('div', '', 'aperture-choice-copy');
      copy.append(text('span', label, 'eyebrow'), text('h2', title), text('p', description));
      const effects = text('div', '', 'aperture-effects');
      rewards.forEach(([value, tone]) => effects.append(text('span', value, tone || '')));
      copy.append(effects, text('span', action + ' →', 'aperture-action'));
      choice.append(image, copy); choices.append(choice);
    }
    apertureChoice('restore', 'RESTORE', 'Stabilize the aperture', 'Anchor the breach. Rebuild what remains.', CARD_ART.repair,
      [['+5 maximum hull'], ['Heal 5 HP']], 'Stabilize', () => { run.maxHp += 5; run.hp += 5; resolveEvent(); });
    apertureChoice('risk', 'RISK / REWARD', 'Reach into the fracture', 'Claim a weapon from a future that never was.', CARD_ART.fracture,
      [['−10 HP', 'cost'], ['Gain Temporal Fracture']], run.hp <= 10 ? 'Requires more than 10 HP' : 'Reach through',
      () => { if (run.hp <= 10) return; run.hp -= 10; run.deck.push('fracture'); resolveEvent(); }, run.hp <= 10);
    const preview = text('p', describe(CARDS.fracture), 'aperture-card-preview');
    preview.prepend(document.createTextNode('Temporal Fracture · '));
    choices.lastElementChild.querySelector('.aperture-effects').after(preview);
    body.append(choices);
    return;
  }
  const body = openScreen('An echo in the static', 'UNKNOWN SIGNAL // EVENT', false, 'aperture'); intro(body, 'A derelict relay offers a fragment of tomorrow. Its power core remains unstable.');
  body.append(button('Extract the core · gain 65 credits · lose 8 HP', () => { if (run.hp <= 8) return; run.hp -= 8; run.gold += 65; resolveEvent(); }, 'choice', run.hp <= 8), text('p', 'Extraction costs 8 HP. You must survive the procedure.', 'muted'), button('Recover a safe fragment · gain Deep Scan', () => { run.deck.push('scan'); resolveEvent(); }, 'choice'), button('Leave the relay', () => resolveEvent('You leave the relay untouched.'), 'choice'));
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
  actions.append(button('Your collectible', showCollectible), button('Inspect your deck', () => inspectPile()), button('Start Advanced run →', showNewRun, 'primary victory-start'));
  const reward = text('div', '', 'first-clear-banner');
  const art = document.createElement('img'); art.src = COLLECTIBLE_ART; art.alt = 'The Last Word collectible';
  const rewardCopy = text('div', ''); rewardCopy.append(text('h2', 'The Last Word is yours'), text('p', 'First-clear collectible earned. Advanced mode unlocked, with new enemies and six exclusive cards.'), button('Reveal your card', showCollectible, 'primary'));
  reward.append(art, rewardCopy);
  body.append(celebration, hero, reward, summary, text('p', 'Twenty-one floors behind you. One timeline reclaimed.', 'victory-epilogue'), actions,
    text('p', 'Campaign complete. Your final deck and completed run are saved.', 'victory-save-note'));
}
function showStage() {
  switch (run.stage) {
    case 'combat': closeScreen(); break;
    case 'map': showMap(); break;
    case 'draft': showDraft(); break;
    case 'shop': showShop(); break;
    case 'rest': showRest(); break;
    case 'event': showEvent(); styleEventChoices(); break;
    case 'eventResult': showEventResult(); break;
    case 'intermission': showIntermission(); break;
    case 'victory': showVictory(); break;
    case 'defeat': {
      const body = openScreen('Timeline collapsed', 'RUN ENDED');
      intro(body, `${run.completed.length} nodes completed · ${run.deck.length} cards · ${run.gold} credits. A new timeline awaits.`); body.append(text('div', '⌁', 'event-art'), button('Start a new run', showNewRun, 'primary')); break;
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
  showNewRun();
});
$('play-button').addEventListener('click', () => playSelected());
$('end-turn').addEventListener('click', () => { if (!combat || run.stage !== 'combat') return; try { const before = captureCombatFX(); selected = null; signatureSelected = false; combat.endTurn(); finishCombatAction(before); } catch (error) { toast(error.message); } });
document.querySelectorAll('[data-pile]').forEach(el => el.addEventListener('click', () => inspectPile(el.dataset.pile)));
// Non-enemy cards may be dropped anywhere on the arena or the play button.
for (const area of [document.querySelector('.combat-area'), $('play-button')]) {
  area.addEventListener('dragover', e => { if (dragged) e.preventDefault(); });
  area.addEventListener('drop', e => { if (e.target.closest('.enemy')) return; e.preventDefault(); if (dragged) playSelected(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('screen').open) { selected = null; signatureSelected = false; render(); } });
window.addEventListener('pagehide', () => { if (run) save(); });
function showNewRun() {
  const body = openScreen('Start a new timeline?', 'NEW RUN', true);
  intro(body, 'Starting again replaces this browser’s current run. Your earned collectible remains unlocked.');
  const label = text('label', '', 'mode-choice'), toggle = document.createElement('input');
  toggle.type = 'checkbox'; toggle.id = 'advanced-mode'; toggle.checked = !!profile.collectible; toggle.disabled = !profile.collectible;
  label.append(toggle, text('span', profile.collectible ? 'Advanced · stronger enemies, new patterns and exclusive cards' : 'Advanced · complete Act III to unlock'));
  body.append(label, text('p', profile.firstClearDeck ? `Advanced starts with your first winning deck: ${profile.firstClearDeck.length} cards, including duplicates and prior removals. Standard starts fresh.` : 'No first-clear deck is saved yet. A surviving Standard Act III victory will preserve it; otherwise Advanced uses the starter deck.', 'muted'), button('Start new run', () => newRun(toggle.checked), 'primary'), button('Keep playing', returnToStage));
}
function renderSignature() {
  const slot = $('signature-slot');
  const resources = document.querySelector('.actions-panel'), handRow = document.querySelector('.hand-deck-row');
  if (matchMedia('(min-width:1101px)').matches) {
    if (slot.parentElement !== resources) resources.querySelector('[data-pile="exhaustPile"]').after(slot);
  } else if (slot.parentElement !== handRow) handRow.prepend(slot);
  slot.replaceChildren(); slot.hidden = !run.advanced;
  if (!run.advanced) return;
  const remaining = cooldown(run), charge = rechargeProgress(run);
  const b = button('', () => {
    signatureSelected = !signatureSelected; selected = null; render();
  }, 'signature-button', run.stage !== 'combat' || !!remaining || !profile.collectible);
  b.classList.toggle('signature-ready', !remaining);
  b.style.setProperty('--charge', `${charge / 3 * 100}%`);
  b.setAttribute('aria-pressed', String(signatureSelected));
  const status = signatureSelected ? 'Choose an enemy…' : remaining ? `Recharging · ${charge}/3` : 'READY · choose a target';
  b.setAttribute('aria-label', `The Last Word. ${status}. Erase one enemy; Act final bosses lose half their remaining HP, minimum 1. Recharges after three subsequent floors.`);
  const art = text('span', '', 'signature-art'); art.setAttribute('aria-hidden', 'true');
  for (const cls of ['signature-unfilled-art', 'signature-filled-art']) {
    const img = document.createElement('img'); img.src = COLLECTIBLE_ART; img.alt = ''; img.className = cls; art.append(img);
  }
  const meter = text('span', '', 'signature-recharge'); meter.setAttribute('role', 'progressbar'); meter.setAttribute('aria-label', 'The Last Word recharge');
  meter.setAttribute('aria-valuemin','0'); meter.setAttribute('aria-valuemax','3'); meter.setAttribute('aria-valuenow',String(charge));
  for(let i=0;i<3;i++) meter.append(text('i', '', i < charge ? 'charged' : ''));
  b.append(text('span', 'SIGNATURE / MYTHIC', 'signature-rarity'), art, text('strong', 'The Last Word', 'signature-name'),
    text('span', 'Erase one enemy. Act final bosses lose half remaining HP; cannot finish them.', 'signature-description'), meter, text('span', status, 'signature-status'));
  b.title = remaining > 3 ? 'Clear this encounter, then three subsequent floors to recharge.' : remaining ? `Clear ${remaining} more floors to recharge.` : 'Ready. Select this card, then a living enemy.';
  slot.append(b);
}
function showCollectible() {
  if (!profile.collectible) return;
  const award = profile.collectible, body = openScreen('The Last Word', 'FIRST-CLEAR COLLECTIBLE', true, 'collectible');
  const card = text('article', '', 'mythic-card');
  const image = document.createElement('img'); image.src = COLLECTIBLE_ART; image.alt = 'A fractured gold chronometer orbiting a luminous cyan singularity.';
  card.append(image, text('span','MYTHIC / FIRST CLEAR','mythic-rarity'), text('h2','The Last Word'), text('p','Erase one enemy. Act final bosses lose half their remaining HP. Recharges after 3 subsequent floors.'));
  const copy = text('section', '', 'collectible-copy');
  const name = document.createElement('input'); name.maxLength = 32; name.value = award.name || ''; name.id = 'collectible-name'; name.placeholder = 'Optional display name';
  const label = text('label', 'Name included on your downloaded image'); label.htmlFor = name.id;
  name.addEventListener('input', () => { award.name = name.value; persistProfile(); });
  copy.append(text('h2','You earned the final word.'), text('p','Advanced is unlocked. Your signature card starts ready in every Advanced run. Sharing the art does not grant the ability.'), label, name,
    text('p', `First clear: ${new Date(award.earnedAt).toLocaleDateString()} · ${award.id}`, 'collectible-id'),
    text('p','This is a browser-local keepsake, not verified ownership. Keep this browser’s data to preserve your unlock.', 'muted'));
  const actions = text('div','','collectible-actions');
  const exportAction = (wallpaper, share) => exportCollectible(award, wallpaper, share).catch(error => toast(error.message));
  actions.append(button('Download card', () => exportAction(false, false), 'primary'), button('Download phone wallpaper', () => exportAction(true, false)), button('Share card', () => exportAction(false, true)), button('Continue', returnToStage));
  const layout = text('div','','collectible-layout'); layout.append(card,copy); body.append(layout,actions);
}
function resolveEvent(message = 'Your choice is sealed. Your hull, credits and deck have been updated.') {
  if (run.stage !== 'event') return;
  run.eventResult = message; run.stage = 'eventResult'; save(); render(); showEventResult();
}
function showEventResult() {
  const body = openScreen('Signal resolved', 'EVENT COMPLETE', false, 'aperture');
  intro(body, run.eventResult || 'The timeline has changed.');
  body.append(text('p', `Hull ${run.hp}/${run.maxHp} · ${run.gold} credits · ${run.deck.length} cards`, 'event-outcome'), button('Continue to map', completeNode, 'primary'));
}
function styleEventChoices() {
  const body = $('screen-body');
  body.querySelectorAll(':scope > button.choice').forEach((b,i) => {
    const image = document.createElement('img'); image.src = [CARD_ART.fracture,CARD_ART.scan,CARD_ART.phase][i % 3]; image.alt = ''; image.className = 'event-choice-art';
    const caption = text('span', b.textContent); b.replaceChildren(image,caption); b.classList.add('event-choice');
    if (b.disabled) b.append(text('small','Insufficient credits or HP; you must survive this choice.'));
  });
}
matchMedia('(min-width:1101px)').addEventListener('change', () => { if (run) renderSignature(); });
$('collectible-button').addEventListener('click', showCollectible);
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
