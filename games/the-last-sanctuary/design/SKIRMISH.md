# First playable skirmish

Two actions per player turn. Moving, attacking, or playing a card spends one action. After the second order, the two raiders take their turns automatically; End Turn also passes immediately. Mana refreshes to three at the start of each player turn.

Seren has three health and attacks for one damage at range two. Aldric has five health and attacks for two damage at range one. Each raider has three health, attacks for one damage at range one, and moves one adjacent hex toward a hero when it cannot attack. Units cannot move through occupied cells, water, woodland, landmarks or ramparts. Raiders can break an adjacent rampart if no route remains.

Portal costs two mana and moves Seren two to four hexes. Rampart costs one mana and creates a blocking wall on an empty land cell within three hexes. Echo Ward costs one mana and blocks the next attack against Aldric. A ward cannot be stacked.

Defeat both raiders to win. Losing both heroes ends the battle. There is no time limit. Attack range uses hex distance; line-of-sight obstacles and combat randomness are outside this first skirmish.

Implementation: `skirmish-rules.js` is deterministic and independent of the renderer. Its factory receives board tiles, and action/endTurn return both events and a fresh state snapshot. Twenty automated rule checks include a complete legal victory and an enemy victory against a passive player.

## Local playtest · study14

Open index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&play=skirmish&revision=14. Uses the preferred second Rampart design. Enemy minis reuse the approved ranger art with muted coloring and red Raider/HP nameplates, while hero art stays unchanged. Attack selection uses enemy labels or figures; dragging onto an in-range foe previews an attack. Moves, spells and attacks require confirmation. End Turn allows passing with unused actions. No timer, saving, multiplayer or full campaign; reload/restart begins a fresh encounter. Full art-study mode remains available by removing play=skirmish.

Twenty rules checks and29 integrated desktop/mobile checks passed, including8legalorders to win,10passedturns to lose, exactrestart, touchdrag/ward/actioncosts andenemyresponse. Mobileenemy and emptyhex labels bypassdrag rayfallback to prevent interception. Fresh actual-server verification also performed. No publication/push.

## Tactical orders and readable combat

Hold the Crossing is Aldric's bridge stance. It costs one action and no mana, requires him to occupy the bridge, and roots him there until the next player turn. Incoming damage is reduced by one through that enemy turn. It cannot be stacked; an existing Echo Ward still blocks the next attack and is consumed normally.

Press the Advantage spends both actions and adds one damage to a selected hero's attack. It is available only before spending any action that turn. This prevents moving or casting first, then receiving a free damage bonus on the last action. The enemy must already be in range. The enemy turn follows immediately unless that strike wins the battle.

Damage previews report actual health loss after ward and stance reductions, capped at remaining health. Combat events carry health before and after the hit, the raw attack, reduction and an immutable intermediate `frame` snapshot. The renderer can replay one event at a time instead of displaying the final state before animation. No rejected order changes state or emits events.

Validation: the original 20 rule checks still pass, along with 27 tactical checks for stance protection, roots, stacking, precise action costs, previews, immutable event frames and rejected-order state preservation.

## Study15 interface

See STUDY-15.md for board-local combat feedback, compactspelltray, contextualcards, mobileconfirmationdock and ordered enemy playback.
