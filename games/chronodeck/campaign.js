import { generateNodeMap, createEncounter, RELIC_DATABASE, SeededRNG } from './engine.js';

export const ACTS = [
  { name: 'The fracture', boss: 'Chrono Sentinel', numeral: 'I' },
  { name: 'The lost archive', boss: 'Archive Warden', numeral: 'II' },
  { name: 'The event horizon', boss: 'Paradox Sovereign', numeral: 'III' }
];
export function campaignMap(seed, act) {
  const map = generateNodeMap(`${seed}:act:${act}`);
  // A guaranteed resupply and repair route keeps every act playable.
  map.floors[2].forEach(n => { n.type = 'Shop'; });
  map.floors[5].forEach(n => { n.type = 'Rest'; });
  return map;
}
export function campaignEncounter(type, floor, seed, act = 1, advanced = false) {
  const enemies = createEncounter(type, floor, seed).map(enemy => advanced ? { ...enemy,
    maxHp: Math.round(enemy.maxHp * 1.32),
    pattern: enemy.pattern.map(intent => ({ ...intent, amount: ['attack', 'block'].includes(intent.kind) ? Math.ceil(intent.amount * 1.22) : intent.amount })).concat([
      { kind: 'status', status: 'weak', amount: 1 },
      // Keep escorts within their own damage budget rather than giving them a boss-sized attack.
      { kind: 'attack', amount: Math.ceil(Math.max(...enemy.pattern.filter(intent => intent.kind === 'attack').map(intent => intent.amount)) * 1.12) }
    ])
  } : enemy);
  if (act === 1) return enemies;
  const boss = type === 'Elite' && floor === 7;
  return enemies.map((enemy, i) => ({ ...enemy,
    name: boss && i === 0 ? ACTS[act - 1].boss : enemy.archetype === 'sentinel' ? 'Archive Guardian' : act === 2 ? `Archive Hunter ${i + 1}` : `Paradox Echo ${i + 1}`,
    maxHp: Math.round(enemy.maxHp * (1 + .22 * (act - 1))),
    pattern: enemy.pattern.map(intent => ({ ...intent, amount: ['attack', 'block'].includes(intent.kind) ? intent.amount + 2 * (act - 1) : intent.amount })).concat(
      act === 2 ? [{ kind: 'status', status: 'vulnerable', amount: 1 }] : [{ kind: 'status', status: 'poison', amount: 2 }])
  }));
}
export function advanceAct(run, chosenRelic) {
  if (run.stage !== 'intermission' || run.act >= ACTS.length) throw Error('Act cannot advance');
  const choices = Object.keys(RELIC_DATABASE).filter(id => !run.relics.includes(id));
  if (chosenRelic && !choices.includes(chosenRelic)) throw Error('Invalid relic reward');
  if (chosenRelic) run.relics.push(chosenRelic);
  else run.gold += 90;
  run.clearedBefore = (run.clearedBefore || 0) + run.completed.length;
  run.act++; run.maxHp += 8; run.hp = Math.min(run.maxHp, run.hp + Math.ceil(run.maxHp * .4));
  run.gold += 45; run.map = campaignMap(run.seed, run.act);
  run.completed = []; run.currentNodeId = null; run.stage = 'map';
  run.combat = null; run.offers = null; run.shop = null;
}
export function eventVariant(run) {
  return new SeededRNG(`${run.seed}:${run.act}:${run.currentNodeId}:event`).int(3);
}
