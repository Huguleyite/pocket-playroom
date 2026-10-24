import { CARD_DATABASE, STARTER_DECK } from './engine.js';
// Local keepsake metadata is deliberately separate from the run and artwork.
export const PROFILE_KEY = 'chronodeck-breach-profile-v1';
export const clearedFloors = run => (run.clearedBefore || 0) + run.completed.length;
export function awardFirstClear(profile, run, now = new Date()) {
  if (run.stage !== 'victory' || run.act !== 3) return profile;
  const collectible = profile.collectible || { id: `CD-${globalThis.crypto.randomUUID()}`, earnedAt: now.toISOString(), name: '' };
  const canCapture = !profile.firstClearDeck && !run.advanced && Array.isArray(run.deck) && run.deck.length && run.deck.every(id => CARD_DATABASE[id] && !CARD_DATABASE[id].advanced);
  if (profile.collectible && !canCapture) return profile;
  return { ...profile, version: 1, collectible, ...(canCapture ? { firstClearDeck: [...run.deck] } : {}) };
}
export function startingDeck(profile, advanced) {
  const deck = profile.firstClearDeck;
  return advanced && Array.isArray(deck) && deck.length && deck.every(id => CARD_DATABASE[id] && !CARD_DATABASE[id].advanced) ? [...deck] : [...STARTER_DECK];
}
export function rechargeProgress(run) { return 3 - Math.min(3, cooldown(run)); }
export function cooldown(run) {
  return Math.max(0, (run.signatureReadyAt || 0) - clearedFloors(run));
}
export function useLastWord(run, combat, targetId) {
  if (!run.advanced || run.stage !== 'combat' || combat.phase !== 'player' || combat.outcome) throw Error('The Last Word is available during Advanced combat.');
  if (cooldown(run)) throw Error(`Recharge: clear ${cooldown(run)} more floors.`);
  const enemy = combat.enemies.find(e => e.id === targetId && e.hp > 0);
  if (!enemy) throw Error('Choose a living enemy.');
  const boss = run.map.floors.flat().find(n => n.id === run.currentNodeId)?.floor === 7 && enemy.id === combat.enemies[0].id;
  const before = enemy.hp;
  enemy.hp = boss ? Math.max(1, enemy.hp - Math.ceil(enemy.hp / 2)) : 0;
  combat.log.push({ event: 'damage', turn: combat.turn, targetId, hpLoss: before - enemy.hp, blocked: 0, cause: 'lastWord' });
  // The current encounter is not one of the three subsequent floors.
  run.signatureReadyAt = clearedFloors(run) + 4;
  combat.checkOutcome();
}
