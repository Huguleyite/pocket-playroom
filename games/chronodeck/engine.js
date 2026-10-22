/** ChronoDeck: Breach — dependency-free ES module.
 * Import using <script type="module">. No DOM or storage access at import time.
 * Turns are 1-based. Timeline slot 0 means the current enemy phase.
 */
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => { Object.values(value).forEach(v => { if (v && typeof v === 'object') freeze(v); }); return Object.freeze(value); };
export const CardType = freeze({ ATTACK: 'Attack', DEFEND: 'Defend', UTILITY: 'Utility', TIME: 'Time' });
export const Target = freeze({ ENEMY: 'enemy', SELF: 'self', ALL: 'allEnemies', NONE: 'none' });
const effect = (kind, amount, extra = {}) => ({ kind, amount, ...extra });
const card = (id, name, type, cost, target, effects, extra = {}) => ({ id, name, type, cost, target, effects, exhaust: false, ...extra });
export const CARD_DATABASE = freeze(Object.fromEntries([
  card('strike', 'Pulse Strike', 'Attack', 1, 'enemy', [effect('damage', 6)]),
  card('guard', 'Barrier', 'Defend', 1, 'self', [effect('block', 5)]),
  card('delay', 'Delay', 'Time', 1, 'enemy', [effect('delay', 2)]),
  card('loop', 'Loop', 'Time', 1, 'none', [effect('loop', 1)]),
  card('railshot', 'Railshot', 'Attack', 2, 'enemy', [effect('damage', 15)]),
  card('doubletap', 'Double Tap', 'Attack', 1, 'enemy', [effect('damage', 4), effect('damage', 4)]),
  card('nova', 'Nova Burst', 'Attack', 2, 'allEnemies', [effect('damage', 9)]),
  card('piercer', 'Phase Piercer', 'Attack', 1, 'enemy', [effect('damage', 7, { piercing: true })]),
  card('rupture', 'Hull Rupture', 'Attack', 1, 'enemy', [effect('damage', 5), effect('status', 2, { status: 'vulnerable' })]),
  card('toxin', 'Nanite Swarm', 'Attack', 1, 'enemy', [effect('status', 5, { status: 'poison' })]),
  card('siphon', 'Energy Siphon', 'Attack', 1, 'enemy', [effect('damage', 4), effect('energy', 1)]),
  card('finisher', 'Event Horizon', 'Attack', 3, 'enemy', [effect('damage', 26)], { exhaust: true }),
  card('fortify', 'Fortify', 'Defend', 2, 'self', [effect('block', 16)]),
  card('parry', 'Reactive Shield', 'Defend', 1, 'self', [effect('block', 7), effect('draw', 1)]),
  card('phase', 'Phase Armor', 'Defend', 1, 'self', [effect('block', 5), effect('status', 2, { status: 'regeneration' })]),
  card('bastion', 'Bastion', 'Defend', 3, 'self', [effect('block', 28)]),
  card('weaken', 'Signal Jam', 'Utility', 1, 'enemy', [effect('status', 2, { status: 'weak' })]),
  card('overclock', 'Overclock', 'Utility', 1, 'self', [effect('energy', 2)], { exhaust: true }),
  card('scan', 'Deep Scan', 'Utility', 1, 'self', [effect('draw', 3)]),
  card('repair', 'Field Repair', 'Utility', 2, 'self', [effect('heal', 8)], { exhaust: true }),
  card('focus', 'Combat Focus', 'Utility', 1, 'self', [effect('status', 2, { status: 'strength' })]),
  card('cleanse', 'Purge Protocol', 'Utility', 1, 'self', [effect('cleanse', 0), effect('block', 3)]),
  card('stasis', 'Stasis Field', 'Time', 2, 'allEnemies', [effect('delay', 1)]),
  card('rewind', 'Rewind', 'Time', 2, 'none', [effect('loop', 1)], { exhaust: true }),
  card('fracture', 'Temporal Fracture', 'Time', 2, 'enemy', [effect('damage', 10), effect('delay', 1)]),
  card('accelerate', 'Accelerate', 'Time', 1, 'self', [effect('draw', 1), effect('energy', 1)], { exhaust: true }),
  card('echo', 'Echo Chamber', 'Time', 2, 'none', [effect('loop', 2)], { exhaust: true })
].map(c => [c.id, c])));
// 25 draftable definitions; basic Strike and Barrier are excluded.
export const DRAFTABLE_CARDS = freeze(Object.keys(CARD_DATABASE).filter(id => !['strike', 'guard'].includes(id)));
export const STARTER_DECK = freeze(['strike', 'strike', 'strike', 'strike', 'guard', 'guard', 'guard', 'guard', 'delay', 'loop']);
export const RELIC_DATABASE = freeze({
  reactor: { id: 'reactor', name: 'Auxiliary Reactor', description: '+1 energy each turn.', energy: 1 },
  lens: { id: 'lens', name: 'Tactical Lens', description: '+1 card drawn each turn.', draw: 1 },
  plating: { id: 'plating', name: 'Adaptive Plating', description: 'Gain 3 block each turn.', block: 3 },
  medkit: { id: 'medkit', name: 'Auto Medic', description: 'Heal 5 after victory.', victoryHeal: 5 },
  anchor: { id: 'anchor', name: 'Temporal Anchor', description: 'Gain 8 block at combat start.', openingBlock: 8 }
});

export class SeededRNG {
  constructor(seed = 'chronodeck') {
    let hash = 2166136261;
    for (const ch of String(seed)) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
    this.state = hash >>> 0;
  }
  next() {
    this.state = (this.state + 0x6D2B79F5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(max) { if (!Number.isInteger(max) || max < 1) throw new Error('max must be a positive integer'); return Math.floor(this.next() * max); }
  shuffle(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) { const j = this.int(i + 1); [result[i], result[j]] = [result[j], result[i]]; }
    return result;
  }
}

/** Absolute scheduling prevents actions delayed beyond the viewport being lost. */
export class TimelineTrack {
  constructor() { this.actions = []; this.nextId = 1; }
  schedule(enemyId, turn, intent) {
    if (!Number.isInteger(turn) || turn < 1) throw new Error('Invalid action turn');
    const action = { id: `action-${this.nextId++}`, enemyId, turn, intent: clone(intent) };
    this.actions.push(action); return action;
  }
  shift(enemyId, amount, currentTurn) {
    if (!Number.isInteger(amount) || amount < 0) throw new Error('Delay must be a nonnegative integer');
    const action = this.actions.filter(a => a.enemyId === enemyId && a.turn >= currentTurn)
      .sort((a, b) => a.turn - b.turn)[0];
    if (action) action.turn += amount;
    return action || null;
  }
  takeDue(turn) {
    const due = this.actions.filter(a => a.turn <= turn).sort((a, b) => a.turn - b.turn || Number(a.id.split('-')[1]) - Number(b.id.split('-')[1]));
    this.actions = this.actions.filter(a => a.turn > turn); return due;
  }
  view(turn) { return Array.from({ length: 5 }, (_, i) => ({ turn: turn + i, actions: clone(this.actions.filter(a => a.turn === turn + i)) })); }
}

export const ENCOUNTER_DATABASE = freeze({
  Combat: [{ name: 'Breach Drone', maxHp: 32, pattern: [{ kind: 'attack', amount: 7 }, { kind: 'block', amount: 6 }, { kind: 'attack', amount: 11 }] }],
  Elite: [{ name: 'Chrono Sentinel', maxHp: 75, pattern: [{ kind: 'attack', amount: 13 }, { kind: 'status', status: 'weak', amount: 2 }, { kind: 'attack', amount: 20 }] }]
});
export function createEncounter(type = 'Combat', floor = 1, seed = 'breach') {
  const templates = ENCOUNTER_DATABASE[type];
  if (!templates || !Number.isInteger(floor) || floor < 1) throw new Error('Invalid combat encounter');
  const rng = new SeededRNG(`${seed}:${type}:${floor}:formation`);
  let count = 1;
  if (floor >= 3 && floor <= 4) count = rng.next() < .4 ? 2 : 1;
  else if (floor >= 5) count = rng.next() < .25 ? 3 : 2;
  if (type === 'Elite' && floor >= 5) count = floor >= 7 ? 3 : 2;
  const formation = Array.from({ length: count }, (_, i) => type === 'Elite' && i === 0 ? 'sentinel' : 'drone');
  return formation.map((archetype, i) => {
    const template = ENCOUNTER_DATABASE[archetype === 'sentinel' ? 'Elite' : 'Combat'][0];
    // Group totals stay near the solo budget; supporting drones are weaker.
    const support = type === 'Elite' && i > 0;
    const hpScale = count === 1 ? 1 : support ? (count === 3 ? .28 : .4) : archetype === 'sentinel' ? (count === 3 ? .72 : .8) : count === 3 ? .43 : .65;
    const attackScale = count === 1 ? 1 : support ? (count === 3 ? .3 : .4) : archetype === 'sentinel' ? .7 : count === 3 ? .4 : .6;
    return {
      ...clone(template), id: `enemy-${i + 1}`, archetype,
      name: archetype === 'sentinel' ? template.name : count === 1 ? template.name : `${support ? 'Escort Drone' : template.name} ${String.fromCharCode(65 + i)}`,
      maxHp: Math.max(1, Math.round((template.maxHp + (floor - 1) * 6) * hpScale)),
      patternIndex: i % template.pattern.length,
      pattern: template.pattern.map(intent => ({ ...clone(intent), amount: ['attack', 'block'].includes(intent.kind) ? Math.max(1, Math.round((intent.amount + floor - 1) * attackScale)) : intent.amount }))
    };
  });
}

export class CombatState {
  constructor({ seed = 'breach', deck = STARTER_DECK, relics = [], player = {}, enemies = createEncounter() } = {}) {
    if (!enemies.length) throw new Error('Combat needs at least one enemy');
    deck.forEach(id => { if (!CARD_DATABASE[id]) throw new Error(`Unknown card: ${id}`); });
    relics.forEach(id => { if (!RELIC_DATABASE[id]) throw new Error(`Unknown relic: ${id}`); });
    this.rng = new SeededRNG(seed);
    this.player = { maxHp: 80, hp: 80, block: 0, statuses: {}, ...clone(player) };
    this.player.hp = Math.min(this.player.maxHp, this.player.hp);
    this.enemies = enemies.map((e, i) => ({ id: `enemy-${i + 1}`, block: 0, statuses: {}, patternIndex: 0, ...clone(e), hp: e.hp ?? e.maxHp }));
    if (new Set(this.enemies.map(e => e.id)).size !== this.enemies.length || this.enemies.some(e => !e.pattern?.length)) throw new Error('Enemies require unique IDs and nonempty patterns');
    this.relics = [...new Set(relics)];
    this.drawPile = this.rng.shuffle(deck.map((definitionId, i) => ({ id: `card-${i + 1}`, definitionId })));
    this.hand = []; this.discardPile = []; this.exhaustPile = [];
    this.timeline = new TimelineTrack(); this.turn = 1; this.energy = 0;
    this.phase = 'player'; this.outcome = null; this.history = []; this.log = [];
    this.enemies.forEach(e => this.queueIntent(e, 1));
    this.startTurn(); this.player.block += this.relicBonus('openingBlock');
  }
  relicBonus(key) { return this.relics.reduce((sum, id) => sum + (RELIC_DATABASE[id][key] || 0), 0); }
  get timelineTrack() { return this.timeline.view(this.turn); }
  get enemyIntents() { return this.enemies.filter(e => e.hp > 0).map(e => ({ enemyId: e.id, actions: clone(this.timeline.actions.filter(a => a.enemyId === e.id)) })); }
  queueIntent(enemy, turn) {
    const intent = enemy.pattern[enemy.patternIndex % enemy.pattern.length];
    enemy.patternIndex++; this.timeline.schedule(enemy.id, turn, intent);
  }
  draw(count) {
    for (let i = 0; i < count; i++) {
      if (this.hand.length >= 10) break;
      if (!this.drawPile.length) { this.drawPile = this.rng.shuffle(this.discardPile); this.discardPile = []; }
      if (!this.drawPile.length) break;
      this.hand.push(this.drawPile.pop());
    }
  }
  startTurn() {
    this.phase = 'player'; this.player.block = this.relicBonus('block');
    this.energy = 3 + this.relicBonus('energy'); this.draw(5 + this.relicBonus('draw'));
  }
  damage(source, victim, amount, piercing = false) {
    let value = Math.max(0, amount + (source.statuses.strength || 0));
    if (source.statuses.weak > 0) value = Math.floor(value * 0.75);
    if (victim.statuses.vulnerable > 0) value = Math.floor(value * 1.5);
    const absorbed = piercing ? 0 : Math.min(victim.block, value);
    const beforeHp = victim.hp;
    victim.block -= absorbed; victim.hp = Math.max(0, victim.hp - (value - absorbed));
    this.log.push({ event: 'damage', turn: this.turn, targetId: victim === this.player ? 'player' : victim.id, hpLoss: beforeHp - victim.hp, blocked: absorbed });
  }
  checkOutcome() {
    if (this.outcome) return true;
    if (this.player.hp <= 0) this.outcome = 'defeat';
    else if (this.enemies.every(e => e.hp <= 0)) {
      this.outcome = 'victory'; this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.relicBonus('victoryHeal'));
    }
    if (this.outcome) this.phase = 'finished';
    this.timeline.actions = this.timeline.actions.filter(a => this.enemies.some(e => e.id === a.enemyId && e.hp > 0));
    return Boolean(this.outcome);
  }
  previousAction() { return [...this.history].reverse().find(h => h.turn === this.turn - 1 && !CARD_DATABASE[h.definitionId].effects.some(e => e.kind === 'loop')); }
  /** cardId is the unique instance ID in hand; target is an enemy ID or object with id. */
  playCard(cardId, target = null) {
    if (this.phase !== 'player' || this.outcome) throw new Error('Cards can only be played in the player phase');
    const index = this.hand.findIndex(c => c.id === cardId);
    if (index < 0) throw new Error('Card is not in hand');
    const instance = this.hand[index], definition = CARD_DATABASE[instance.definitionId];
    const targetId = typeof target === 'object' && target ? target.id : target;
    if (definition.cost > this.energy) throw new Error('Not enough energy');
    if (definition.target === 'enemy' && !this.enemies.some(e => e.id === targetId && e.hp > 0)) throw new Error('Choose a living enemy');
    if (definition.effects.some(e => e.kind === 'loop') && !this.previousAction()) throw new Error('No replayable card from the previous turn');
    this.energy -= definition.cost; this.hand.splice(index, 1);
    this.resolveEffects(definition, targetId);
    (definition.exhaust ? this.exhaustPile : this.discardPile).push(instance);
    this.history.push({ turn: this.turn, definitionId: definition.id, targetId });
    this.log.push({ event: 'cardPlayed', turn: this.turn, cardId, targetId });
    this.checkOutcome(); return this.snapshot();
  }
  resolveEffects(definition, targetId, replay = false) {
    for (const fx of definition.effects) {
      const targets = definition.target === 'allEnemies' ? this.enemies.filter(e => e.hp > 0)
        : definition.target === 'enemy' ? this.enemies.filter(e => e.id === targetId && e.hp > 0) : [this.player];
      switch (fx.kind) {
        case 'damage': targets.forEach(t => this.damage(this.player, t, fx.amount, fx.piercing)); break;
        case 'block': this.player.block += fx.amount; break;
        case 'heal': this.player.hp = Math.min(this.player.maxHp, this.player.hp + fx.amount); break;
        case 'energy': this.energy += fx.amount; break;
        case 'draw': this.draw(fx.amount); break;
        case 'status': targets.forEach(t => { t.statuses[fx.status] = (t.statuses[fx.status] || 0) + fx.amount; }); break;
        case 'cleanse': ['weak', 'vulnerable', 'poison'].forEach(s => delete this.player.statuses[s]); break;
        case 'delay': targets.forEach(t => this.timeline.shift(t.id, fx.amount, this.turn)); break;
        case 'loop': {
          if (replay) break;
          const past = this.previousAction();
          if (!past) break;
          const original = CARD_DATABASE[past.definitionId];
          // If the original target died, use the first surviving enemy.
          const enemyId = this.enemies.find(e => e.id === past.targetId && e.hp > 0)?.id ?? this.enemies.find(e => e.hp > 0)?.id;
          for (let i = 0; i < fx.amount; i++) this.resolveEffects(original, enemyId, true);
          break;
        }
        default: throw new Error(`Unknown effect: ${fx.kind}`);
      }
    }
  }
  tickStatuses(entity) {
    if (entity.hp <= 0) return;
    const beforeHp = entity.hp;
    entity.hp = Math.max(0, entity.hp - (entity.statuses.poison || 0));
    if (entity.hp < beforeHp) this.log.push({ event: 'damage', turn: this.turn, targetId: entity === this.player ? 'player' : entity.id, hpLoss: beforeHp - entity.hp, blocked: 0, cause: 'poison' });
    if (entity.hp > 0) entity.hp = Math.min(entity.maxHp, entity.hp + (entity.statuses.regeneration || 0));
    for (const key of ['poison', 'regeneration', 'weak', 'vulnerable']) {
      if (entity.statuses[key] > 0 && --entity.statuses[key] === 0) delete entity.statuses[key];
    }
  }
  /** Safe to call repeatedly: due actions are consumed once; only runs in enemy phase. */
  processTimeline() {
    if (this.phase !== 'enemy' || this.outcome) return [];
    const executed = [];
    for (const action of this.timeline.takeDue(this.turn)) {
      const enemy = this.enemies.find(e => e.id === action.enemyId && e.hp > 0);
      if (!enemy || this.outcome) continue;
      const intent = action.intent;
      if (intent.kind === 'attack') this.damage(enemy, this.player, intent.amount);
      else if (intent.kind === 'block') enemy.block += intent.amount;
      else if (intent.kind === 'status') this.player.statuses[intent.status] = (this.player.statuses[intent.status] || 0) + intent.amount;
      executed.push(clone(action)); this.log.push({ event: 'enemyAction', ...clone(action) });
      if (!this.checkOutcome()) this.queueIntent(enemy, this.turn + 1);
    }
    return executed;
  }
  endTurn() {
    if (this.phase !== 'player' || this.outcome) throw new Error('Cannot end this turn');
    this.discardPile.push(...this.hand); this.hand = []; this.phase = 'enemy';
    // Enemy status durations tick after their actions; player durations tick before them.
    this.tickStatuses(this.player);
    this.enemies.forEach(e => { e.block = 0; });
    if (!this.checkOutcome()) this.processTimeline();
    if (!this.outcome) this.enemies.forEach(e => this.tickStatuses(e));
    if (!this.checkOutcome()) { this.turn++; this.startTurn(); }
    return this.snapshot();
  }
  snapshot() { return clone({ ...this, timelineTrack: this.timelineTrack }); }
  toJSON() { return { version: 1, ...clone({ rngState: this.rng.state, player: this.player, enemies: this.enemies, relics: this.relics, drawPile: this.drawPile, hand: this.hand, discardPile: this.discardPile, exhaustPile: this.exhaustPile, timeline: this.timeline, turn: this.turn, energy: this.energy, phase: this.phase, outcome: this.outcome, history: this.history, log: this.log }) }; }
  static fromJSON(data) {
    if (data?.version !== 1) throw new Error('Unsupported combat save version');
    const state = Object.create(CombatState.prototype), copy = clone(data);
    delete copy.version; delete copy.rngState; Object.assign(state, copy);
    state.rng = new SeededRNG(); state.rng.state = data.rngState >>> 0;
    state.timeline = Object.assign(new TimelineTrack(), clone(data.timeline)); return state;
  }
}

/** Seven floors, 1–3 nodes per floor, final Elite. Edges only connect adjacent floors.
 * Every node has an incoming/outgoing route (except entry/exit).
 */
export function generateNodeMap(seed = 'breach') {
  const rng = new SeededRNG(seed), types = ['Combat', 'Combat', 'Combat', 'Elite', 'Shop', 'Rest', 'Event'];
  const floors = Array.from({ length: 7 }, (_, f) => Array.from({ length: f === 0 || f === 6 ? 1 : 2 + rng.int(2) }, (_, lane) => ({
    id: `floor-${f + 1}-node-${lane + 1}`, floor: f + 1, lane,
    type: f === 0 ? 'Combat' : f === 6 ? 'Elite' : types[rng.int(types.length)], next: []
  })));
  for (let f = 0; f < 6; f++) {
    const from = floors[f], to = floors[f + 1];
    from.forEach((node, i) => {
      const lane = Math.round(i * (to.length - 1) / Math.max(1, from.length - 1));
      node.next.push(to[lane].id);
      if (to.length > 1 && rng.next() < 0.65) node.next.push(to[(lane + 1) % to.length].id);
    });
    to.forEach((node, i) => {
      if (!from.some(n => n.next.includes(node.id))) from[Math.min(i, from.length - 1)].next.push(node.id);
    });
  }
  return { seed: String(seed), floors, entryId: floors[0][0].id, exitId: floors[6][0].id };
}
export function draftCards(rng = new SeededRNG(), count = 3) {
  if (!Number.isInteger(count) || count < 0 || count > DRAFTABLE_CARDS.length) throw new Error('Invalid draft size');
  return rng.shuffle(DRAFTABLE_CARDS).slice(0, count).map(id => clone(CARD_DATABASE[id]));
}
/** Optional browser persistence. Storage is injectable for testing or IndexedDB adapters. */
export const SaveSystem = {
  save(combat, key = 'chronodeck-breach', storage = globalThis.localStorage) {
    if (!storage) throw new Error('Storage unavailable');
    storage.setItem(key, JSON.stringify(combat.toJSON()));
  },
  load(key = 'chronodeck-breach', storage = globalThis.localStorage) {
    if (!storage) throw new Error('Storage unavailable');
    const raw = storage.getItem(key); return raw === null ? null : CombatState.fromJSON(JSON.parse(raw));
  },
  clear(key = 'chronodeck-breach', storage = globalThis.localStorage) { storage.removeItem(key); }
};

