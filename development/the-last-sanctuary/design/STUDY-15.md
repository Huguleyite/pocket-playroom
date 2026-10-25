# Study 15 · readable combat and tactical decisions

Sim resumed the approved combat-clarity direction on October24,2026. This is a local playtest, not a publication.

## Play

index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&play=skirmish&revision=15

The25hex skirmish, approved fixed-view art, connected water, drag/tap confirmation and preferred Rampart2 remain. No new raster art or dependencies were added.

## Readable consequences

Selected attacks connect attacker to target and preview the exact damage, targetHPbefore/after and actioncost directly on the board and beside Confirm. Every living piece has a named healthbar. Strikes/bolts travel to the target, an impactflash and floatingdamage orBLOCKED resolve with the healthchange, and defeated miniatures fade before removal. Enemyturns replay each move/hit individually behind an inputlock. The displayed board and health follow intermediate eventframes, not the engine’s already-computed finalstate. Reduced-motion keeps ordered readable feedback with short holds and no travelling bolt. Restarts restore art opacity and health.

Warm ground marks enemyreach; circles mark movement; attackpreviews highlight attacker/target; wards/bracing are labeled on healthbars. Original bottom announcement is replaced in skirmish by focused action notices, board feedback and optional Battle history.

## Compact magic

The large three-card magic row is removed from skirmish. Fold the Path, Living Rampart and Echo Ward live in a small selected-unit sidebar tray with mana costs. Existing spell art/effects and targeting remain. The old art-study page retains its large cards for comparison.

## Field decisions

Contextual cards show real tradeoffs when available:

- Hold the Crossing: select Aldric on the bridge.1action,0mana; roots him until nextplayerturn and reduces every incoming hit by1 through the enemyresponse. Cannot stack.
- Press the Advantage: selectedhero must already have an enemyinrange and bothactions. Spend bothactions for+1damage; the enemyturn follows immediately unless the strike wins. Cannot move/castfirst and thenuseit. Targetselection can be changed beforeconfirmation.

Cards preview; they do not execute on selection. Cancelling spends nothing. Exact balance remains a playtest question.

## Mobile

A fixed confirmation dock shows the action’s consequences and cost without scrolling away from the board. TouchConfirm brings the board into view before playback; the dock hides while actions resolve. Native taps, drag previews, keyboard selection and cancellation remain. Artwork-comparison controls are hidden during actual play to reduce clutter.

## Validation and limits

Original20rules and27newtactical checks pass;70feedbackmodule browserchecks pass; the full29desktop/mobile victory/defeat/restart regression passes. Integrated animated feedback checks cover numerical previews, hits, inputlock, ordered enemyturns, lethal removal, brace/root protection, pressedattackcosts, and native mobileconfirmation/cancellation. Original19base-study checks pass. Screenshots reviewed on desktop and390pxmobile.

The game still uses fixed-view illustrated miniatures, a deterministic small skirmish and no saving/campaign/multiplayer. Final visual review and balance feedback are pending; no push or publication authorized.
